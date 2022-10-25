import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { socket, UserContext } from "../App";

//import styling
import {
  Drawer,
  Button,
  Group,
  Text,
  createStyles,
  Stack,
  Card,
  Grid,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import EditProfileModal from "./Profile/EditProfileModal";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { createChainedFunction } from "@mui/material";

const useStyles = createStyles((theme) => ({
  drawerPaper: {
    backgroundColor: neighbourgoodTheme.colors.darkGray,
    color: "white",
    borderBottom: 0,
  },
}));

export default function SideDrawer(props) {
  const [opened, setOpened] = useState(false);
  const userData = useContext(UserContext);
  const [user, setUser] = useState(userData);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [chats, setChats] = useState();
  const [chatsInfo, setChatsInfo] = useState();

  const navigate = useNavigate();
  const { classes } = useStyles();
  // undefined useContext here
  // const userData = useContext(UserContext);

  useEffect(() => {
    setOpened(props.openDrawer);
    if (userData) {
      getChats();
    }
  }, [props]);

  useEffect(() => {
    if (!props.userData) {
      setOpened(false);
      // console.log("close drawer");
    }
  });

  useEffect(() => {
    if (chats) {
      console.log(chats);
      getChatsInfo();
    }
  }, [chats]);

  const getChats = async () => {
    const chats = await axios.get(
      `${BACKEND_URL}/chatroom/user/${userData._id}`
    );
    const chatsSorted = chats.data.sort((a, b) => a.createdAt - b.createdAt);
    console.log(chatsSorted);
    setChats(chatsSorted);
  };

  const getChatsInfo = () => {
    if (chats && chats.length > 0) {
      let chatData = [];
      chats.forEach(async (chat) => {
        const data = await axios.get(
          `${BACKEND_URL}/listing/single/${chat.listingId}`
        );
        chatData.push({ ...chat, listingInfo: data.data });
        if (chatData.length === chats.length) {
          setChatsInfo(chatData);
        }
      });
    }
  };

  return (
    <>
      {props.userData ? (
        <Drawer
          // select classnames from above to target specific sub-components
          classNames={{ drawer: classes.drawerPaper }}
          trapFocus={false}
          sx={{
            transform: "translateX(50px)",
            overflow: "auto",
          }}
          opened={opened}
          onClose={() => props.closeDrawer()}
          title=""
          padding={10}
          size="20vw"
          closeOnClickOutside={false}
          withOverlay={false}
          withinPortal={false}
          withCloseButton={false}
        >
          <Stack spacing={"1vh"} sx={{ height: "100%" }}>
            {/* <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "15vh",
                maxHeight: 120,
              }}
              pt={5}
              pb={5}
            >
              <Grid>
                <Grid.Col span={8}>
                  <Text
                    color={"white"}
                    align="left"
                    size="25px"
                    weight={"bold"}
                    mb="1"
                  >
                    Welcome Back,
                  </Text>
                  <Text
                    color={"white"}
                    align="left"
                    size="25px"
                    weight={"bold"}
                  >
                    {props.userData.username}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4} mt={"auto"} mb={"auto"} p={0}>
                  <Avatar
                    src={`${userData.cloudimg?.url}`}
                    alt="userprofile"
                    radius={"50%"}
                    sx={{ height: "5vw", width: "5vw" }}
                  />
                </Grid.Col>
              </Grid>
            </Card> */}
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "25vh",
              }}
              pt={5}
              pb={5}
            >
              <Grid>
                <Grid.Col span={8}>
                  <Text
                    color={"white"}
                    align="left"
                    size="25px"
                    weight={"bold"}
                  >
                    Welcome Back,
                  </Text>
                </Grid.Col>
                <Grid.Col span={4} mt={"auto"} mb={"auto"} p={0}>
                  <Avatar
                    src={`${userData.cloudimg?.url}`}
                    alt="userprofile"
                    radius={"50%"}
                    sx={{ height: "5vw", width: "5vw" }}
                  />
                </Grid.Col>
              </Grid>

              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {props.userData.username}
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {props.userData.email}
              </Text>

              <Text
                color={"white"}
                align="left"
                size="xl"
                weight={"bold"}
                // mb={"3vh"}
              >
                {props.userData.accountsFollowing.length} Following
              </Text>

              {/* Other Profile Info */}

              <Grid sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  sx={{
                    backgroundColor: neighbourgoodTheme.colors.darkGray,
                    borderRadius: 25,
                    position: "absolute",
                    bottom: "1vh",
                    right: "1vh",
                  }}
                  onClick={() => {
                    setOpenEditProfileModal(true);
                  }}
                >
                  Edit
                </Button>
                <EditProfileModal
                  opened={openEditProfileModal}
                  closeModal={() => setOpenEditProfileModal(false)}
                />
              </Grid>
            </Card>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightTeal,
                borderRadius: 15,
                display: "flex",
                height: "7vh",
                maxHeight: 55,
              }}
              onClick={() => {
                navigate("/sharing");
                props.closeDrawer();
              }}
            >
              <Text align="left" size={"25px"}>
                Sharing
              </Text>
            </Button>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightPurple,
                borderRadius: 15,
                display: "flex",
                height: "7vh",
                maxHeight: 55,
              }}
              onClick={() => {
                navigate("/helping");
                props.closeDrawer();
              }}
            >
              <Text align="left" size={"25px"}>
                Helping
              </Text>
            </Button>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightBrown,
                borderRadius: 15,
                display: "flex",
                height: "7vh",
                maxHeight: 55,
              }}
              onClick={() => {
                navigate("/lending");
                props.closeDrawer();
              }}
            >
              <Text align="left" size={"25px"}>
                Lending
              </Text>
            </Button>

            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "30vh",
              }}
              px={12}
              pt={5}
              pb={5}
            >
              <Text color={"white"} align="left" size="25px" weight={"bold"}>
                {/* Current Chats -- need to socket refresh whenever there is a
                change from chats */}
                Current Chats
              </Text>
              <ScrollArea style={{ height: "80%", width: "100%" }} p={1}>
                <Grid>
                  {chatsInfo &&
                    chatsInfo.map((chat) => {
                      return (
                        <Grid.Col key={chat._id} span={4}>
                          <Avatar
                            radius="50%"
                            src={chat.listingInfo?.cloudimg?.url}
                            size={60}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              navigate(`/chatroom/${chat._id}`, {
                                state: { fromRequestPage: false },
                              });
                              console.log("navigating to chatroom");
                              props.refresh();
                            }}
                          >
                            <ChatBubbleIcon style={{ zIndex: "100" }} />
                          </Avatar>

                          {/* <Text size="xs">Enter Chat</Text> */}
                        </Grid.Col>
                      );
                    })}
                </Grid>
              </ScrollArea>
            </Card>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 15,
                display: "flex",
                height: "7vh",
                maxHeight: 55,
              }}
              onClick={() => {
                navigate("/community");
                props.closeDrawer();
              }}
            >
              <Text align="left" size={"25px"}>
                Community
              </Text>
            </Button>
            {/* <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "20vh",
              }}
              pt={5}
              pb={5}
            >
              <Text color={"white"} align="left" size="30px" weight={"bold"}>
                Awards
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                
              </Text>
            </Card> */}
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.darkGray,
                borderRadius: 25,
                display: "flex",
                height: "5vh",
                bottom: 0,
                // position: "absolute",
              }}
              onClick={props.logout}
            >
              <Text align="left" size={"25px"}>
                Logout
              </Text>
            </Button>
          </Stack>
        </Drawer>
      ) : null}
    </>
  );
}
