import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../App";

//import styling
import { Drawer, Button, Group, Text, createStyles } from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";

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

  const navigate = useNavigate();
  const { classes } = useStyles();
  const userData = useContext(UserContext);

  useEffect(() => {
    setOpened(props.openDrawer);
    setUser(userData);
  }, [props]);

  return (
    <>
      {user ? (
        <Drawer
          // select classnames from above to target specific sub-components
          classNames={{ drawer: classes.drawerPaper }}
          sx={{
            transform: "translateX(50px)",
          }}
          opened={opened}
          onClose={() => props.closeDrawer()}
          title=""
          padding="xl"
          size="20vw"
          closeOnClickOutside={false}
          withOverlay={false}
          withinPortal={false}
          withCloseButton={false}
        >
          <Text>Welcome Back, {user.username}</Text>
          {/* Drawer content */}
          <button
            onClick={() => {
              navigate("/sharing");
            }}
          >
            Sharing
          </button>
          <button
            onClick={() => {
              navigate("/helping");
            }}
          >
            Helping
          </button>
          <button
            onClick={() => {
              navigate("/lending");
            }}
          >
            Lending
          </button>
        </Drawer>
      ) : null}
    </>
  );
}
