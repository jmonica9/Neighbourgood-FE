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
import CommunityChat from "./CommunityChat";

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
    <>
      <Stack
        spacing={"0.5rem"}
        sx={{ height: "100%", marginTop: 10, paddingTop: 10 }}
      >
        <Grid ml={drawerOpen ? "24vw" : "3vw"} mb={"2vh"}>
          <Grid.Col span={12} p={0} m={0}>
            <Card
              sx={{
                width: drawerOpen ? "74vw" : "93vw",
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                minHeight: 280,
                height: "35vh",
                display: "block",
                borderRadius: 25,
              }}
              p={15}
            >
              <DashboardFriendsListings
                user={userData}
                drawerOpen={props.drawerOpen}
              />
            </Card>
          </Grid.Col>
        </Grid>

        <Grid ml={drawerOpen ? "24vw" : "3vw"} gutter="lg" p={0}>
          <Grid.Col span={12} p={0} grow>
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                height: "55rem",
                display: "block",
                borderRadius: 25,
              }}
            >
              <Grid gutter={"xs"}>
                <Grid.Col span={8}>
                  <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
                    <Text
                      align="left"
                      ml={"0.5em"}
                      size={25}
                      weight={"semibold"}
                      mb={"0.5em"}
                    >
                      Community Chat <ChatBubbleIcon />
                    </Text>
                    <CommunityChat socket={props.socket} />
                  </Card>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
                    <Text
                      align="left"
                      ml={"0.5em"}
                      size={25}
                      weight={"semibold"}
                    >
                      Community Board <Pencil2Icon />
                    </Text>
                    <CommunityPosts />
                  </Card>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
}
