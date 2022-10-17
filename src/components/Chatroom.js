import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
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
  const [proposedMonth, setProposedMonth] = useState();
  const [proposedDay, setProposedDay] = useState();
  const [proposedTime, setProposedTime] = useState();
  const [appointmentProposed, setAppointmentProposed] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  /* if user came from a lending "request", then show etiquette modal */
  useEffect(() => {
    if (state.fromRequestPage && listing) {
      if (listing.type === "lending") {
        setOpened(true);
      }
    }
  }, [listing]);

  /* once userData is in, get chatroom info --> listingId, ownerId, requestorId */
  useEffect(() => {
    getChatroomInfo();
  }, [userData]);

  const getChatroomInfo = () => {
    axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
      setRequestorId(res.data.requestorId);
      setOwnerId(res.data.ownerId);
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

  const getUsersInfo = () => {
    axios.get(`${BACKEND_URL}/users/${ownerId}`).then((res) => {
      setOwner(res.data);
      axios.get(`${BACKEND_URL}/users/${requestorId}`).then((res) => {
        setRequestor(res.data);
      });
    });
  };

  const getMessages = () => {
    axios.get(`${BACKEND_URL}/messages/${chatroomId}`).then((res) => {
      setAllMessages(res.data);
    });
  };

  const getAppointmentInfo = () => {
    axios
      .get(`${BACKEND_URL}/appointment`, { chatroomId: chatroomId })
      .then((res) => {
        if (res.data) {
          if (res.data.proposedDateAndTime) {
            setAppointmentProposed(true);
          }
          if (res.data.confirmed) {
            setAppointmentConfirmed(true);
          }
        }
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
        console.log("this is here", res.data);
      });
    setMessage("");
    getMessages();
  };

  /*------------------------------ appointment functions ----------------------------------*/
  const proposeAppointment = () => {
    axios
      .post(`${BACKEND_URL}/appointment`, {
        requestorId: requestorId,
        ownerId: ownerId,
        listingId: listing._id,
        proposedDateAndTime: `${proposedMonth}-${proposedDay}-${proposedTime}`,
      })
      .then(() => {
        setAppointmentProposed(true);
      });
  };

  return (
    listing &&
    owner && (
      <Box
        sx={{
          height: "70rem",
          width: "90%",
          backgroundColor: "#D3D3D3",
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-start",
          alignItems: "center",
          borderRadius: "1rem",
          color: "#000",
        }}
        ml="3rem"
        my="1rem"
      >
        <>
          <Modal opened={opened} onClose={() => setOpened(false)} fullScreen>
            <Group position="center">
              <Grid>
                <Grid.Col>BORROWING ETIQUETTE</Grid.Col>
                <Grid.Col>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Grid.Col>
                <Grid.Col>
                  <Button onClick={() => setOpened(false)}>Accept</Button>
                </Grid.Col>
              </Grid>
            </Group>
          </Modal>
        </>
        <Box
          sx={{
            height: "6%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          px={"3rem"}
          my={"1rem"}
        >
          <Text>Item: {listing.title}</Text>
          <Text>
            Posted by {owner.username}{" "}
            {`${time_ago(new Date(listing.createdAt))}`}
          </Text>
        </Box>
        <Box
          sx={{
            height: "47%",
            width: "95%",
            backgroundColor: "#3E3E3E",
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: "1rem",
          }}
          mb={"1rem"}
        >
          <Box
            sx={{
              height: "90%",
              width: "50%",
              backgroundColor: "#fff",
              display: "flex",
              flexFlow: "row nowrap",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "1rem",
            }}
            mx={"2%"}
          >
            <img
              style={{ maxHeight: "90%", maxWidth: "90%" }}
              src={listing.image}
              alt={listing.title}
            />
          </Box>

          <Box
            sx={{
              height: "90%",
              width: "50%",
              backgroundColor: "#fff",
              display: "flex",
              borderRadius: "1rem",
              color: "black",
              textAlign: "left",
            }}
            mx={"2%"}
            px={"2%"}
            py={"2%"}
          >
            <Grid>
              <Grid.Col span={12}>
                <Text size="lg">
                  Description: <br />
                  {listing.description}
                  <br />
                  <br />
                  Condition: <br />
                  Not yet implemented...
                </Text>
              </Grid.Col>
              {!appointmentProposed && (
                <span>
                  <Grid.Col
                    span={12}
                    sx={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Text size="lg" sx={{ height: "1rem" }}>
                      Propose a time:
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
                      onChange={(e) =>
                        setProposedTime(
                          e.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        )
                      }
                    />
                    <Button variant="filled" onClick={proposeAppointment}>
                      Propose
                    </Button>
                  </Grid.Col>
                </span>
              )}
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            height: "47%",
            width: "95%",
            backgroundColor: "#3E3E3E",
            borderRadius: "1rem",
          }}
          mb={"1rem"}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "1rem",
              minHeight: "70%",
              color: "black",
            }}
            mx={"1rem"}
            mt={"1rem"}
          >
            {allMessages.length > 0 &&
              allMessages.map((message) => {
                return (
                  <Box py={"0.5rem"} key={message._id}>
                    <Text>
                      {message.senderName}: {message.messageText}
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
            p={"1rem"}
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

                <span className="formButton" type="submit">
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
