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
import EditProfileModal from "./EditProfileModal";

const useStyles = createStyles((theme) => ({
  drawerPaper: {
    backgroundColor: neighbourgoodTheme.colors.darkGray,
    color: "white",
    borderBottom: 0,
  },
}));

export default function SideDrawer(props) {
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useState();
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

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
          padding="xs"
          size="20vw"
          closeOnClickOutside={false}
          withOverlay={false}
          withinPortal={false}
          withCloseButton={false}
        >
          <Stack spacing={"xs"} sx={{ height: "100%" }}>
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
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
                height: "20vh",
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
                mb={"1.5em"}
              >
                10 Following
              </Text>

              {/* Other Profile Info */}

              <Grid sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  sx={{
                    backgroundColor: neighbourgoodTheme.colors.darkGray,
                    borderRadius: 25,
                    bottom: 0,
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
                borderRadius: 25,
                display: "flex",
                height: "5vh",
              }}
              onClick={() => {
                navigate("/sharing");
              }}
            >
              <Text align="left" size={"28px"}>
                Sharing
              </Text>
            </Button>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightPurple,
                borderRadius: 25,
                display: "flex",
                height: "5vh",
              }}
              onClick={() => {
                navigate("/helping");
              }}
            >
              <Text align="left" size={"28px"}>
                Helping
              </Text>
            </Button>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightBrown,
                borderRadius: 25,
                display: "flex",
                height: "5vh",
              }}
              onClick={() => {
                navigate("/lending");
              }}
            >
              <Text align="left" size={"28px"}>
                Lending
              </Text>
            </Button>
            <Card
              sx={{
                backgroundColor: neighbourgoodTheme.colors.lightGray,
                borderRadius: 25,
                height: "20vh",
              }}
              pt={5}
              pb={5}
            >
              <Text color={"white"} align="left" size="30px" weight={"bold"}>
                Current Chats
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {/* some stuff */}
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {/* some stuff */}
              </Text>
            </Card>
            <Card
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
                {/* some stuff */}
              </Text>
              <Text color={"white"} align="left" size="xl" weight={"bold"}>
                {/* some stuff */}
              </Text>
            </Card>
            <Button
              sx={{
                backgroundColor: neighbourgoodTheme.colors.darkGray,
                borderRadius: 25,
                display: "flex",
                height: "5vh",
              }}
              onClick={props.logout}
            >
              <Text align="left" size={"28px"}>
                Logout
              </Text>
            </Button>
          </Stack>
        </Drawer>
      ) : null}
    </>
  );
}
