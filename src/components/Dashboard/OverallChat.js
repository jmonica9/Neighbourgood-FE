import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
  Grid,
  Divider,
  Image,
} from "@mantine/core";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { UserContext } from "../../App";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { neighbourgoodTheme } from "../../styles/Theme";

// const data = [
//   {
//     avatar: airfryer,
//     name: "listing1",
//     user: "bob",
//     type: "giving",
//     status: "open",
//   },
//   {
//     avatar: airfryer,
//     name: "listing2",
//     user: "joe",
//     type: "lending",
//     status: "close",
//   },
//   {
//     avatar: airfryer,
//     name: "listing3",
//     user: "tim",
//     type: "sharing",
//     status: "open",
//   },
//   {
//     avatar: airfryer,
//     name: "listing4",
//     user: "lala",
//     type: "giving",
//     status: "close",
//   },
// ];

export function OverallChats(props) {
  const userData = useContext(UserContext);
  const theme = useMantineTheme();
  const [chats, setChats] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [listChat, setListChat] = useState([]);
  // const getChatroomInfo = () => {
  //   axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
  //     setRequestorId(res.data.requestorId);
  //     setOwnerId(res.data.ownerId);
  //   });

  //   axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
  //     axios
  //       .get(`${BACKEND_URL}/chatroom/listing/${res.data.listingId}`)
  //       .then((res) => {
  //         setListing(res.data);
  //       });
  //   });
  //   console.log("getchatroominfo ran");
  // };

  const chatDetails = [];
  const getChatsDetails = async (chats) => {
    await chats.forEach((chat) => {
      axios
        .get(`${BACKEND_URL}/chatroom/listing/${chat.listingId}`)
        .then((res) => {
          chatDetails.push(
            Object.assign(res.data, {
              chatId: chat._id,
              listingId: chat.listingId,
            })
          );
          if (chats.length === chatDetails.length) {
            setListChat(chatDetails);
          }
        });
    });
    console.log(chatDetails);

    return chatDetails;
  };

  const getChats = async () => {
    //get chats belonging to user
    if (userData) {
      console.log(userData);
      console.log("get chats id");
      await axios
        .get(`${BACKEND_URL}/chatroom/user/${userData._id}`)
        .then((res) => {
          console.log(res.data, "GOT THE CHATS");
          setChats(res.data);
          return res.data;
        })
        .then((chats) => {
          console.log("get chat details AKA LISTING DETAILS");
          getChatsDetails(chats);
        });
    }
  };
  useEffect(() => {
    if (userData) {
      getChats();
      console.log("got chats?");
    }
  }, [refresh]);

  const markComplete = (listingId) => {
    axios
      .get(`${BACKEND_URL}/listing/markcomplete/${listingId}`)
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
      });
  };

  const rows =
    listChat &&
    listChat
      .sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      })
      .map((item) => {
        return (
          <Grid
            mt={"1.5rem"}
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              borderBottom: "0.1rem solid white",
            }}
            className="individualcontainerlobby"
            pb={"1rem"}
            pl={"1rem"}
          >
            <Grid.Col
              span={3}
              sx={{
                display: "flex",
                alignContent: "center",
                flexDirection: "column",
              }}
            >
              <Group>
                <Image
                  src={item.cloudimg?.url}
                  ml={"0.5rem"}
                  sx={{
                    minWidth: "15rem",
                    maxWidth: "15rem",
                    background: "white",
                  }}
                />
              </Group>
              <Text
                size="sm"
                weight={"2rem"}
                color="black"
                align="left"
                pl={"0.5rem"}
                pt={"0.5rem"}
              >
                {item.title}
              </Text>
            </Grid.Col>
            <Grid.Col
              span={2}
              sx={{
                width: "300px",
                display: "flex",
              }}
              pl={"2rem"}
            >
              <Badge color={"black"} variant="filled">
                {item.type}
              </Badge>
            </Grid.Col>
            <Grid.Col span={2} sx={{ display: "flex" }}>
              <Group maxWidth={15}>
                <Text size="sm" weight={500} color="black" pl={"2rem"}>
                  {item.username === userData.username ? "You" : item.username}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={2} sx={{ display: "flex" }}>
              <Group maxWidth={15}>
                <Text size="sm" color="black" pl={"2rem"}>
                  {/* STATUS */}
                  {item.completed === false ? "Open" : "Completed"}
                </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={"auto"} sx={{ display: "flex" }}>
              <Group pl={"2rem"}>
                <Button
                  sx={{ background: neighbourgoodTheme.colors.darkGray }}
                  onClick={() => {
                    navigate(`/chatroom/${item.chatId}`, {
                      state: { fromRequestPage: false },
                    });
                  }}
                >
                  {"Go to Chatroom"}
                </Button>
                {item.username === userData.username && !item.completed ? (
                  <Button
                    onClick={(e) => markComplete(item.listingId)}
                    sx={{ background: neighbourgoodTheme.colors.darkGray }}
                  >
                    {"✓ Mark Complete"}
                  </Button>
                ) : null}
                {item.completed ? (
                  <Button
                    span={1}
                    sx={{ background: neighbourgoodTheme.colors.darkGray }}
                    onClick={() => navigate(`/individualReview/${item._id}`)}
                  >
                    Review
                  </Button>
                ) : null}
              </Group>
            </Grid.Col>
          </Grid>
        );
      });

  return (
    <Grid
      className="headercontainerlobby"
      sx={{
        marginLeft: props.drawerOpen ? "26vw" : 0,
        display: "flex",
      }}
      py={"0.8rem"}
    >
      <Grid.Col
        span={3}
        sx={{
          display: "flex",
          background: neighbourgoodTheme.colors.darkGray,
          color: "#fff",
        }}
        pl={"2rem"}
        pt={"1rem"}
      >
        <Text size="md" weight={"5rem"}>
          Ongoing Chats
        </Text>
      </Grid.Col>

      <Grid.Col
        span={2}
        sx={{
          display: "flex",
          background: neighbourgoodTheme.colors.darkGray,
          color: "#fff",
        }}
        pl={"2rem"}
        pt={"1rem"}
      >
        <Text size="md" weight={"5rem"}>
          Type
        </Text>
      </Grid.Col>
      <Grid.Col
        span={2}
        sx={{
          display: "flex",
          background: neighbourgoodTheme.colors.darkGray,
          color: "#fff",
        }}
        pl={"2rem"}
        pt={"1rem"}
      >
        <Text size="md" weight={"5rem"}>
          Posted By
        </Text>
      </Grid.Col>
      <Grid.Col
        span={2}
        sx={{
          display: "flex",
          background: neighbourgoodTheme.colors.darkGray,
          color: "#fff",
        }}
        pl={"2rem"}
        pt={"1rem"}
      >
        <Text size="md" weight={"5rem"}>
          Status
        </Text>
      </Grid.Col>
      <Grid.Col
        span={"auto"}
        sx={{
          display: "flex",
          background: neighbourgoodTheme.colors.darkGray,
          color: "#fff",
        }}
        pl={"2rem"}
      >
        <Text size="md" weight={"5rem"}></Text>
      </Grid.Col>
      {chatDetails && rows}
    </Grid>
  );
}
