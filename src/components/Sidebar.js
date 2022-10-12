import React, { useEffect, useState } from "react";
import { Navbar, Text, Button } from "@mantine/core";
import SideDrawer from "./SideDrawer";
import { neighbourgoodTheme } from "../styles/Theme";
import AuthModal from "../AuthModal";

export default function Sidebar(props) {
  const [user, setUser] = useState("");

  const closeDrawer = () => {
    props.drawerOpen();
  };

  return (
    <div>
      <Navbar
        fixed={true}
        // position={{ left: 0 }}
        height={"100rem"}
        p="xs"
        width={{ base: 50 }}
        sx={{
          background: neighbourgoodTheme.colors.darkGray,
          border: 0,
          float: "left",
        }}
      >
        <Navbar.Section grow>
          <Text
            mt={"6.5rem"}
            ml={"-7rem"}
            sx={{ position: "fixed", top: 0, left: 40 }}
            className="sidebar-neighbourgood"
          >
            neighbourgood
          </Text>
          {/* conditional rendering here */}
          {!user && (
            <Text
              mt={"18.5rem"}
              ml={"-5.3rem"}
              sx={{ position: "fixed", top: 0, left: 40 }}
              className="sidebar-neighbourgood"
            >
              <AuthModal />
            </Text>
          )}
        </Navbar.Section>
        <Navbar.Section>
          {user ? (
            <button
              className="drawer-toggle"
              onClick={() => {
                props.drawerOpen();
              }}
            >
              {!props.drawer ? `>` : `<`}
            </button>
          ) : null}
        </Navbar.Section>
      </Navbar>
      <SideDrawer openDrawer={props.drawer} closeDrawer={closeDrawer} />
    </div>
  );
}
