import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../App";

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
} from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import AuthModal from "../AuthModal";
import EditProfileModal from "./Profile/EditProfileModal";
import axios from "axios";
import { BACKEND_URL } from "../constants";

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

  const navigate = useNavigate();
  const { classes } = useStyles();
  // undefined useContext here
  // const userData = useContext(UserContext);

  useEffect(() => {
    setOpened(props.openDrawer);
  }, [props]);

  useEffect(() => {
    if (!props.userData) {
      setOpened(false);
      // console.log("close drawer");
    }
  });

  useEffect(() => {
    if (userData) {
      getChats();
    }
  }, [userData]);

  useEffect(() => {
    if (chats) {
      console.log(chats);
    }
  }, [chats]);

  const getChats = () => {
    axios.get(`${BACKEND_URL}/chatroom/user/${userData._id}`).then((res) => {
      setChats(res.data);
    });
  };

  return (
    <>
      {props.userData ? (
        <Drawer
          // select classnames from above to target specific sub-components
          classNames={{ drawer: classes.drawerPaper }}
          sx={{
            transform: "translateX(50px)",
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
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "15vh",
                maxHeight: 120,
              }}
              pt={5}
              pb={5}
            >
              <Text
                color={"white"}
                align="left"
                size="25px"
                weight={"bold"}
                mb="1"
              >
                Welcome Back,
              </Text>
              <Text color={"white"} align="left" size="25px" weight={"bold"}>
                {props.userData.username}
              </Text>
            </Card>
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "25vh",
              }}
              pt={5}
              pb={5}
            >
              <Text color={"white"} align="left" size="25px" weight={"bold"}>
                Profile
              </Text>
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
              pt={5}
              pb={5}
            >
              <Text color={"white"} align="left" size="25px" weight={"bold"}>
                {/* Current Chats -- need to socket refresh whenever there is a
                change from chats */}
              </Text>
              <Grid>
                {chats &&
                  chats.map((chat) => {
                    return (
                      <Grid.Col key={chat._id}>
                        <p style={{ fontSize: "1rem" }}>
                          {/* listingId: {chat.listingId} */}
                        </p>
                        <Button
                          variant="dark"
                          onClick={() => {
                            navigate(`/chatroom/${chat._id}`, {
                              state: { fromRequestPage: false },
                            });
                          }}
                        >
                          go to chatroom
                        </Button>
                      </Grid.Col>
                    );
                  })}
              </Grid>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {/* some stuff */}
              </Text>
            </Card>
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
