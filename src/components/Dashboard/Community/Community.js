import {
  Grid,
  Stack,
  Card,
  Text,
  createStyles,
  Textarea,
  Button,
  Box,
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

export default function Community(props) {
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
    <Stack
      spacing={"1vh"}
      sx={{ height: "100%", marginTop: 10, paddingTop: 10 }}
    >
      Test
    </Stack>
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
