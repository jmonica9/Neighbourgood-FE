import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import {
  Modal,
  Button,
  Group,
  Grid,
  Text,
  Container,
  Box,
} from "@mantine/core";
import { Send } from "react-bootstrap-icons";
import { Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import "../../App.css";
import LendingTermsAndConditions from "./LendingTermsConditionsModal";
import DeopsitCheckout from "../Deposits/DepositCheckout";
import ReturnDeposit from "../Deposits/ReturnDeposit";
import ClaimDeposit from "../Deposits/ClaimDeposit";
// import { socket } from ".././App";
// import { io } from "socket.io-client";
// const socket = io("http://localhost:3000");

function Chatroom(props) {
  const { chatroomId } = useParams();
  const userData = useContext(UserContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [listing, setListing] = useState();
  const [requestorId, setRequestorId] = useState();
  const [ownerId, setOwnerId] = useState();
  const [opened, setOpened] = useState(false);
  const [requestor, setRequestor] = useState();
  const [owner, setOwner] = useState();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState();
  const [days, setDays] = useState(originalDays);
  const [proposedMonth, setProposedMonth] = useState("Jan");
  const [proposedDay, setProposedDay] = useState(1);
  const [proposedTime, setProposedTime] = useState(new Date());
  const [appointment, setAppointment] = useState();
  const [appointmentProposed, setAppointmentProposed] = useState();
  const [confirmedTransactionDate, setConfirmedTransactionDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const templatedConfirmedMessage = `We've left this chatroom open for you to work out any additional details.`;
  const bottomRef = useRef(null);

  /* --------------------socket stuff-------------------- */

  // join room at start
  useEffect(() => {
    props.socket.emit("join_room", { room: `${chatroomId}` });
  }, [chatroomId]);

  const paymentStatusChange = (status) => {
    setPaymentStatus(status);
  };

  //when socket says to refresh, chatroom should re-get the following things:
  //messages, appointment, listing
  const refreshChatroom = () => {
    props.socket.emit("refresh_chatroom_trigger", { room: `${chatroomId}` });
    console.log("refresh");
  };
  useEffect(() => {
    props.socket.on("refresh_chatroom", (data) => {
      if (chatroomId) {
        getChatroomInfo();
      }
    });
  }, [props.socket]);

  /* --------------------end of socket stuff-------------------- */

  /* if user came from a lending "request", then show etiquette modala */
  useEffect(() => {
    if (state.fromRequestPage && listing && allMessages) {
      if (listing.type === "lending" && allMessages.length === 0) {
        setOpened(true);
      }
    }
  }, [allMessages]);

  /* once userData is in, get chatroom info --> listingId, ownerId, requestorId */
  useEffect(() => {
    getChatroomInfo();
  }, [userData]);

  const getChatroomInfo = () => {
    axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
      setRequestorId(res.data.requestorId);
      setOwnerId(res.data.ownerId);
    });

    axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
      axios
        .get(`${BACKEND_URL}/chatroom/listing/${res.data.listingId}`)
        .then((res) => {
          setListing(res.data);
        });
    });
  };

  /* once listing details and users IDs are gotten, get full users info + all chat messages and check on status of appointment */
  useEffect(() => {
    if (listing) {
      getUsersInfo();
      getMessages();
      getAppointmentInfo();
    }
  }, [listing]);

  useEffect(() => {
    if (appointment) {
      setAppointmentProposed(true);
    } else setAppointmentProposed(false);
  }, [appointment]);

  const getUsersInfo = () => {
    axios.get(`${BACKEND_URL}/users/${ownerId}`).then((res) => {
      setOwner(res.data);
      axios.get(`${BACKEND_URL}/users/${requestorId}`).then((res) => {
        setRequestor(res.data);
      });
    });
  };

  /* when user selects a month, update the days to be the number of days in that month */
  useEffect(() => {
    let daysArray = [];
    if (monthsWithThirtyOneDays.includes(proposedMonth)) {
      for (let i = 1; i < 32; i++) {
        daysArray.push(`${i}`);
        setDays(daysArray);
      }
    } else if (proposedMonth === "Feb") {
      for (let i = 1; i < 29; i++) {
        daysArray.push(`${i}`);
        setDays(daysArray);
      }
    } else {
      setDays(originalDays);
    }
  }, [proposedMonth]);

  /* -------------------- chatroom functions -------------------- */
  const getMessages = () => {
    axios.get(`${BACKEND_URL}/messages/${chatroomId}`).then((res) => {
      setAllMessages(res.data);
    });
  };

  const getAppointmentInfo = () => {
    setAppointment("");
    axios
      .post(`${BACKEND_URL}/appointment/getinfo`, {
        listingId: listing._id,
        chatroomId: chatroomId,
      })
      .then((res) => {
        if (res.data) {
          if (res.data.confirmed) {
            axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
              axios
                .get(`${BACKEND_URL}/chatroom/listing/${res.data.listingId}`)
                .then((res) => {
                  setConfirmedTransactionDate(res.data.dateOfTransaction);
                });
            });
          }

          setAppointment(res.data);
        }
      });
  };

  const deleteChatroom = () => {
    //delete the chatroom, navigate to dashboard
    axios.post(`${BACKEND_URL}/listing/withdraw`, {
      listing: listing,
      userId: requestorId,
    });
    axios.delete(
      `${BACKEND_URL}/chatroom/delete/${listing._id}/${userData._id}`
    );
    navigate("/dashboard");
  };

  /*------------------------------ send message functions ----------------------------------*/
  const setMessageValue = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_URL}/messages/${chatroomId}/${userData._id}`, {
        messageText: message,
        senderName: userData.username,
      })
      .then((res) => {
        setMessage("");
      });
    props.socket.emit("refresh_chatroom_trigger", { room: `${chatroomId}` });
  };

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  /*------------------------------ appointment functions ----------------------------------*/

  const acceptAppointment = (message) => {
    //set appointment to true
    setConfirmedTransactionDate(message.proposedDate);
    axios
      .put(`${BACKEND_URL}/appointment`, {
        listingId: listing._id,
        requestorId: requestorId,
        ownerId: ownerId,
      })
      .then((res) => {
        console.log(res.data);
      });

    //delete the message
    axios
      .delete(`${BACKEND_URL}/messages`, {
        data: { chatroomId: chatroomId },
      })
      .then(() => {
        getMessages();
        props.socket.emit("refresh_chatroom_trigger", {
          room: `${chatroomId}`,
        });
        props.socket.emit("listing_updated", {
          listingId: `${listing._id}`,
        });
      });

    //change listing's "reservedBy"
    axios
      .put(`${BACKEND_URL}/listing/reserve`, {
        listingId: listing._id,
        requestorId: requestorId,
        dateOfTransaction: message.proposedDate,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const deleteAppointment = () => {
    //delete from appointment collection and delete from messages collection

    axios.delete(`${BACKEND_URL}/appointment`, {
      data: {
        listingId: listing._id,
        requestorId: requestorId,
        ownerId: ownerId,
      },
    });

    axios
      .delete(`${BACKEND_URL}/messages`, {
        data: { chatroomId: chatroomId },
      })
      .then(() => {
        getMessages();
        props.socket.emit("refresh_chatroom_trigger", {
          room: `${chatroomId}`,
        });
      });
  };

  const proposeAppointment = () => {
    let monthFormat;
    switch (proposedMonth) {
      case "Jan":
        monthFormat = 1;
        break;

      case "Feb":
        monthFormat = 2;
        break;

      case "Mar":
        monthFormat = 3;
        break;

      case "Apr":
        monthFormat = 4;
        break;

      case "May":
        monthFormat = 5;
        break;

      case "Jun":
        monthFormat = 6;
        break;

      case "Jul":
        monthFormat = 7;
        break;

      case "Aug":
        monthFormat = 8;
        break;

      case "Sep":
        monthFormat = 9;
        break;

      case "Oct":
        monthFormat = 10;
        break;

      case "Nov":
        monthFormat = 11;
        break;

      case "Dec":
        monthFormat = 12;
        break;

      default:
        monthFormat = 1;
    }

    axios
      .post(`${BACKEND_URL}/appointment`, {
        chatroomId: chatroomId,
        requestorId: requestorId,
        ownerId: ownerId,
        listingId: listing._id,
        proposedDateAndTime: `2022-${monthFormat}-${proposedDay}T${proposedTime.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`,
      })
      .then((res) => {
        axios
          .post(
            `${BACKEND_URL}/messages/appointment/${chatroomId}/${userData._id}`,
            {
              messageText: `${
                listing.type === "helping"
                  ? `${
                      userData._id === requestorId
                        ? `${userData.username} has proposed to help you on `
                        : `${userData.username} needs your help on`
                    }`
                  : `${
                      userData._id === requestorId
                        ? `${userData.username} has proposed to collect the item from you on `
                        : `${userData.username} is available to pass you the item on`
                    }`
              }`,
              senderName: userData.username,
              proposedDate: `${proposedDay} of ${proposedMonth} at ${proposedTime.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )} hrs`,
            }
          )
          .then(() => {
            setMessage("");
            getMessages();
            props.socket.emit("refresh_chatroom_trigger", {
              room: `${chatroomId}`,
            });
          });
      });
  };

  return (
    listing &&
    owner && (
      <Box className="chatroom-main-container">
        {/* etiquette for lending modal */}
        <>
          <Modal opened={opened} onClose={() => setOpened(false)} fullScreen>
            <LendingTermsAndConditions closeModal={() => setOpened(false)} />
          </Modal>
        </>
        {listing && requestor && owner && (
          <>
            <Box className="chatroom-postedby-container">
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Grid.Col span={4}>
                  {" "}
                  <Text size="lg">
                    <b>Title: {listing.title}</b>
                    <Text size="xs"> Listing type: {listing.type}</Text>
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  {" "}
                  <Text size="lg" sx={{ textAlign: "center" }}>
                    <b>
                      <u>
                        {requestor.username} & {owner.username}
                      </u>
                    </b>
                    <Text size="xs" sx={{ textAlign: "center" }}>
                      {" "}
                      Posted: {`${time_ago(new Date(listing.createdAt))}`}
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col
                  span={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  pr="0"
                >
                  {" "}
                  <button
                    className="chatroom-end-button"
                    onClick={deleteChatroom}
                  >
                    End Chat
                  </button>
                </Grid.Col>
              </Grid>
            </Box>
          </>
        )}
        <Box className="chatroom-listingdetails-container">
          <Box className="chatroom-listingimage-container">
            <img
              style={{ maxHeight: "90%", maxWidth: "90%" }}
              src={listing.cloudimg?.url}
              alt={listing.title}
            />
          </Box>
          <Box className="chatroom-listingdescription-container">
            {listing.reservedBy && requestor ? (
              <span>
                <Grid>
                  <Grid.Col span={10}>
                    <Text size="xl">
                      Description: <br />
                      <Text size="md">{listing.description}</Text>
                    </Text>
                    {listing.type === "lending" && requestorId == userData._id && (
                      <>
                        <DeopsitCheckout
                          listing={listing}
                          name={listing.title}
                          description={listing.description}
                          amount={listing.depositAmount} //  to change!!!
                          status={paymentStatus}
                          updatePaymentStatus={() =>
                            paymentStatusChange("Deposit Paid")
                          }
                          refresh={refreshChatroom}
                        />
                        {paymentStatus === "Deposit Paid" ? (
                          <Text size="sm">Deposit has been Submitted.</Text>
                        ) : null}
                      </>
                    )}
                    {listing.type === "lending" && ownerId == userData._id && (
                      // listing.completed &&
                      <Grid>
                        <Grid.Col span={4}>
                          {" "}
                          <ReturnDeposit
                            listing={listing}
                            name={listing.title}
                            description={listing.description}
                            amount={listing.depositAmount}
                            status={paymentStatus}
                            updatePaymentStatus={() =>
                              paymentStatusChange("Deposit Returned")
                            }
                            refresh={refreshChatroom}
                          />
                        </Grid.Col>
                        <Grid.Col span={8}>
                          <ClaimDeposit
                            amount={listing.depositAmount}
                            listing={listing}
                            status={paymentStatus}
                            updatePaymentStatus={() =>
                              paymentStatusChange("Deposit Claimed")
                            }
                            refresh={refreshChatroom}
                          />
                        </Grid.Col>
                        {paymentStatus === "Deposit Paid" ? (
                          <Text size="sm">Deposit has been Returned.</Text>
                        ) : null}
                        {paymentStatus === "Deposit Claimed" ? (
                          <Text size="sm">Deposit has been Claimed.</Text>
                        ) : null}
                      </Grid>
                    )}
                  </Grid.Col>
                  <span>
                    <Grid.Col
                      span={12}
                      sx={{ display: "flex", alignItems: "flex-end" }}
                    >
                      {listing.userId === userData._id ? (
                        listing.type === "helping" ? (
                          <>
                            <Text
                              size="md"
                              className="chatroom-description-appointment confirmed"
                            >
                              {`${requestor.username} has agreed to help you on ${confirmedTransactionDate}! ${templatedConfirmedMessage}`}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text
                              size="md"
                              className="chatroom-description-appointment confirmed"
                            >
                              {`You have agreed to pass this item to ${requestor.username} on ${confirmedTransactionDate}! ${templatedConfirmedMessage}`}
                            </Text>
                          </>
                        )
                      ) : listing.type === "helping" ? (
                        <>
                          {listing.reservedBy === userData._id ? (
                            <Text
                              size="md"
                              className="chatroom-description-appointment confirmed"
                            >
                              {`You have agreed to help ${owner.username} on ${confirmedTransactionDate}!
                              ${templatedConfirmedMessage}`}
                            </Text>
                          ) : (
                            <Text
                              size="md"
                              className="chatroom-description-appointment other"
                            >
                              {`Someone else has already agreed to help ${owner.username}! But we've left this chatroom open for you to continue your conversation.`}
                            </Text>
                          )}
                        </>
                      ) : (
                        <>
                          {listing.reservedBy === userData._id ? (
                            <Text
                              size="md"
                              className="chatroom-description-appointment confirmed"
                            >
                              {`You have agreed to pick up this item from ${owner.username} on ${confirmedTransactionDate}! ${templatedConfirmedMessage}`}
                            </Text>
                          ) : (
                            <Text
                              size="md"
                              className="chatroom-description-appointment other"
                            >
                              {`${owner.username} has already reserved this item for someone else! But we've left this chatroom open for you to continue your conversation.`}
                            </Text>
                          )}
                        </>
                      )}
                    </Grid.Col>
                  </span>
                </Grid>
              </span>
            ) : (
              <span>
                <Grid>
                  <Grid.Col span={12}>
                    <Text size="lg">
                      Description: <br />
                      {listing.description}
                    </Text>
                  </Grid.Col>
                  {!appointment && (
                    <span>
                      <Grid.Col
                        span={12}
                        sx={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <Text size="lg" sx={{ height: "1rem" }} mt="3rem">
                          Propose a date and time:
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={12} sx={{ display: "flex" }}>
                        <Select
                          placeholder="Day"
                          data={days}
                          sx={{ width: "20%" }}
                          variant="filled"
                          mr={"1%"}
                          onChange={(e) => {
                            setProposedDay(e);
                          }}
                        />
                        <Select
                          placeholder="Month"
                          data={[
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ]}
                          mr={"1%"}
                          sx={{ width: "20%" }}
                          variant="filled"
                          onChange={(e) => {
                            setProposedMonth(e);
                          }}
                        />
                        <TimeInput
                          variant="filled"
                          format="12"
                          defaultValue={new Date()}
                          sx={{ width: "20%" }}
                          mr={"1%"}
                          onChange={(e) => setProposedTime(e)}
                        />
                        <Button variant="filled" onClick={proposeAppointment}>
                          Propose
                        </Button>
                      </Grid.Col>
                    </span>
                  )}
                </Grid>
              </span>
            )}
          </Box>
        </Box>
        <Box className="chatroom-chatbox-container">
          <Box className="chatroom-chatboxdisplay-container">
            {allMessages &&
              allMessages.length > 0 &&
              allMessages.map((message) => {
                //if no proposed date
                return !message.proposedDate ? (
                  message.senderId === userData._id ? (
                    <Box
                      key={message._id}
                      ref={bottomRef}
                      className="chatroom-message-container chatroomuser"
                    >
                      <Text
                        size="md"
                        className="chatroom-message-text usermessage"
                      >
                        {message.messageText}
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      key={message._id}
                      ref={bottomRef}
                      className="chatroom-message-container otheruser"
                    >
                      <Text
                        size="md"
                        className="chatroom-message-text othermessage"
                        ml={"1rem"}
                      >
                        {message.messageText}
                      </Text>
                    </Box>
                  )
                ) : //if there is a proposesd date
                message.senderId !== userData._id ? (
                  <>
                    <Box
                      py={"1rem"}
                      px={"2rem"}
                      key={message._id}
                      ref={bottomRef}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Text
                        size="lg"
                        className="chatroom-appointment appointment-received"
                      >
                        {message.messageText} {message.proposedDate}
                        <Button
                          mx="1rem"
                          color="teal"
                          size="xs"
                          variant="outline"
                          onClick={() => acceptAppointment(message)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="teal"
                          onClick={deleteAppointment}
                        >
                          Decline
                        </Button>
                      </Text>
                    </Box>
                  </>
                ) : (
                  <Box
                    py={"1rem"}
                    px={"2rem"}
                    key={message._id}
                    ref={bottomRef}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Text
                      size="lg"
                      className="chatroom-appointment appointment-proposed"
                    >
                      Currently waiting for the other party to accept your
                      proposed appointment for {message.proposedDate}
                    </Text>
                  </Box>
                );
              })}
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "1rem",
            }}
            mx={"1rem"}
            mt={"1rem"}
            p={"0.5rem"}
          >
            <Box
              sx={{
                color: "black",
              }}
            >
              <form>
                <input
                  className="chatInput"
                  placeholder="send a message here"
                  value={message}
                  onChange={(e) => setMessageValue(e)}
                />

                <span className="messageButton" type="submit">
                  <Send onClick={sendMessage} />
                </span>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  );
}

export default Chatroom;

/*------------------------------ other functions ----------------------------------*/
/*---------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

let originalDays = [];
for (let i = 1; i < 31; i++) {
  originalDays.push(`${i}`);
}

const monthsWithThirtyOneDays = [
  "Jan",
  "Mar",
  "May",
  "Jul",
  "Aug",
  "Oct",
  "Dec",
];

function time_ago(time) {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds == 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
}
