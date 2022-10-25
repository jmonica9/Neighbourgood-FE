import {
  Grid,
  Stack,
  Card,
  Text,
  createStyles,
  Textarea,
  Button,
  Box,
  ScrollArea,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../../styles/Theme";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../../App";
import DashboardFriendsListings from "../DashboardFriendsListings";
import CommunityPosts from "./CommunityPosts";
import DashboardCalendar from "../DashboardCalendar";
import { ChatBubbleIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Send } from "react-bootstrap-icons";
import axios from "axios";
import { BACKEND_URL } from "../../../constants";

export default function CommunityChat(props) {
  const drawerOpen = props.drawerOpen;
  const userData = useContext(UserContext);
  const [currentMessage, setCurrentMessage] = useState("");
  const [allMessages, setAllMessages] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    props.socket.emit("join_room", { room: `communitychat` });
  }, []);

  useEffect(() => {
    props.socket.on("refresh_communitychat", (data) => {
      getAllMessages();
    });
  }, [props.socket]);

  useEffect(() => {
    getAllMessages();
  }, [userData]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessage = () => {
    console.log("this ran");
    if (currentMessage) {
      axios
        .post(`${BACKEND_URL}/communitymessage`, {
          messageText: currentMessage,
          senderId: userData._id,
          senderName: userData.username,
        })
        .then(() => {
          props.socket.emit("refresh_communitychat_trigger", {
            room: `communitychat`,
          });
        });
    }
    setCurrentMessage("");
  };

  const getAllMessages = () => {
    axios.get(`${BACKEND_URL}/communitymessage`).then((res) => {
      setAllMessages(res.data);
    });
  };

  const useStyles = createStyles((theme) => ({
    text: {
      fontSize: theme.fontSizes.xl,
      [theme.fn.smallerThan("lg")]: {
        fontSize: theme.fontSizes.sm,
      },
    },
  }));
  const classes = useStyles();

  return (
    <>
      {/* <Grid gutter={"xs"} sx={{ display: "flex" }}> */}
      {/* <Grid.Col span={12}> */}
      <Card sx={{ height: "17em" }} p={0}>
        {/* <hr /> */}
        <ScrollArea
          type="hover"
          style={{ height: "12.5em", borderTop: "solid lightgray 1px" }}
          offsetScrollbars
          // pt={"1em"}
          m={0}
        >
          {/* <Box
          sx={{ overflowY: "scroll", maxHeight: "30em", minHeight: "30rem" }}
        > */}
          {allMessages.length > 0 &&
            userData &&
            allMessages.map((message) => {
              return message.senderId === userData._id ? (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                  my={"0.5rem"}
                  pr="1rem"
                >
                  <div
                    style={{
                      background: neighbourgoodTheme.colors.lightGray,
                      padding: "0.5rem",
                      maxWidth: "50%",
                      borderRadius: "0.5rem",
                    }}
                    ref={bottomRef}
                  >
                    <Text
                      size="0.7rem"
                      sx={{
                        display: "flex",
                        flexFlow: "column wrap",
                        alignItems: "flex-end",
                        color: "green",
                      }}
                    >
                      <Text size="sm" mb="0.5rem" sx={{ color: "black" }}>
                        {message.messageText}
                      </Text>
                      {message.senderName} sent{" "}
                      {`${time_ago(new Date(message.createdAt))}`}
                    </Text>
                  </div>
                </Box>
              ) : (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                  my={"0.5rem"}
                  pl="1rem"
                >
                  <div
                    style={{
                      background: neighbourgoodTheme.colors.lightGray,
                      padding: "0.5rem",
                      maxWidth: "50%",
                      borderRadius: "0.5rem",
                    }}
                    ref={bottomRef}
                  >
                    <Text
                      size="0.7rem"
                      sx={{
                        display: "flex",
                        flexFlow: "column wrap",
                        alignItems: "flex-start",
                        color: "green",
                      }}
                    >
                      <Text size="sm" mb="0.5rem" sx={{ color: "black" }}>
                        {message.messageText}
                      </Text>
                      {message.senderName} sent{" "}
                      {`${time_ago(new Date(message.createdAt))}`}
                    </Text>
                  </div>
                </Box>
              );
            })}
          {/* </Box> */}
        </ScrollArea>
        <hr style={{ margin: "0" }} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
          }}
        >
          <textarea
            className="community-chat-container"
            style={{
              width: "90%",
              height: "9.5rem",
              textAlign: "left",
              resize: "none",
              fontSize: "1rem",
              padding: "1rem 0 0 1rem",
              border: "none",
              overflow: "auto",
              outline: "none",
            }}
            placeholder="Send a message here"
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
          />
          <Box
            sx={{
              width: "20%",
              height: "9.5rem",
              // display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
            pb="1rem"
            pr="1rem"
            pt={"1.5rem"}
          >
            <Button
              radius={25}
              sx={{ backgroundColor: neighbourgoodTheme.colors.darkGray }}
            >
              <Send
                style={{
                  background: neighbourgoodTheme.colors.darkGray,
                  color: "white",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                }}
                size="2rem"
                className="community-chat-sendbutton"
                onClick={sendMessage}
              />
            </Button>
          </Box>
        </Box>
      </Card>
      {/* </Grid.Col> */}
      {/* </Grid> */}
    </>
  );
}

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
