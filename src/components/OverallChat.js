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
import { BACKEND_URL } from "../constants";
import { UserContext } from "../App";
import airfryer from "../images/is-air-frying-healthy44-79f5ff9.jpg";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ReviewDetails from "./ReviewDetails";

const getColor = (type) => {
  switch (type) {
    case "lending":
      return "blue";
      break;
    case "sharing":
      return "cyan";
      break;
    case "giving":
      return "pink";
      break;
    default:
      return "red";
  }
};

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
              alignContent: "center",
              // marginLeft: props.drawerOpen ? "25vw" : "5vw",
            }}
          >
            <Group>
              <Grid.Col
                span={3}
                sx={{ display: "flex", alignContent: "center" }}
              >
                <Group
                // sx={{ maxWidth: "15", minWidth: "15", width: "15" }}
                >
                  <Image
                    // maxHeight={20}
                    width="150px"
                    src={item.cloudimg?.url}
                    mr={"5rem"}
                    // sx={{ maxWidth: "15", minWidth: "15", width: "15" }}
                  />
                  <Text
                    size="sm"
                    sx={{ width: "300px" }}
                    weight={500}
                    ml={5}
                    color="black"
                    align="left"
                  >
                    {item.title}
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col
                span={1}
                sx={{
                  width: "300px",
                  display: "flex",
                  align: "center",
                  alignContent: "center",
                }}
              >
                <Badge color={getColor(item.type)} variant="filled">
                  {item.type}
                </Badge>
              </Grid.Col>
              <Grid.Col span={1} sx={{ display: "flex" }}>
                <Group maxWidth={15}>
                  <Text size="sm" weight={500} ml={"3rem"} color="black">
                    {item.username === userData.username
                      ? "You"
                      : item.username}
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={2} sx={{ display: "flex" }}>
                <Group maxWidth={15}>
                  <Text size="sm" color="black" ml={"4rem"}>
                    {/* STATUS */}
                    {item.completed === false ? "Open" : "Completed"}
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={1} sx={{ display: "flex" }}>
                <Group maxWidth={15}>
                  <Button
                    onClick={() => {
                      navigate(`/chatroom/${item.chatId}`, {
                        state: { fromRequestPage: false },
                      });
                    }}
                  >
                    {"Go to Chatroom"}
                  </Button>
                  {item.username === userData.username && !item.completed ? (
                    <Button onClick={(e) => markComplete(item.listingId)}>
                      {"✓ Mark Complete"}
                    </Button>
                  ) : null}
                  {item.completed ? (
                    <Button
                      span={1}
                      sx={{ display: "flex" }}
                      onClick={() => navigate(`/individualReview/${item._id}`)}
                    >
                      Review
                    </Button>
                  ) : null}
                </Group>
              </Grid.Col>
              {/* <Grid.Col></Grid.Col> */}
            </Group>
          </Grid>
        );
      });
  // <Group spacing="sm">
  //   <tr key={item.name}>
  //     <td>
  //       <Group spacing="sm">
  //         <Avatar size={30} src={item.avatar} radius={30} />
  //         <Text size="sm" weight={500}>
  //           {item.name}
  //         </Text>
  //       </Group>
  //     </td>

  //     <td>
  //       <Badge color={getColor(item.type)} variant="filled">
  //         {item.type}
  //       </Badge>
  //     </td>
  //     <td>{item.user}</td>
  //     <td>
  //       <Text size="sm" color="dimmed">
  //         {item.status}
  //       </Text>
  //     </td>
  //     <td>
  //       <button>{">"}</button>
  //     </td>
  //   </tr>
  // </Group>

  return (
    <Grid
      spacing="sm"
      sx={{ marginLeft: props.drawerOpen ? "26vw" : "4vw", display: "flex" }}
    >
      <Table
        style={{
          // marginLeft: props.drawerOpen ? "20vw" : "8vw",
          marginRight: "4vw",
          marginTop: "0.5vw",
          minWidth: "100vw",
          height: "100vh",
          minHeight: "100vh",
        }}
        verticalSpacing="sm"
      >
        <Grid
          ml={"5rem"}
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "inherit",
          }}
        >
          <Grid.Col span={2} sx={{ display: "centre" }}>
            <Text size="m" weight={500}>
              Chat Overview
            </Text>
          </Grid.Col>
          <Grid.Col span={2} sx={{ display: "centre" }}>
            <Text size="m" weight={500}>
              Type
            </Text>
          </Grid.Col>
          <Grid.Col span={1} sx={{ display: "centre" }}>
            <Text size="m" weight={500}>
              Posted By
            </Text>
          </Grid.Col>
          <Grid.Col span={2} sx={{ display: "centre" }}>
            <Text size="m" weight={500}>
              Status
            </Text>
          </Grid.Col>
        </Grid>
        <Divider />
        {chatDetails && rows}
      </Table>
    </Grid>
  );
}
