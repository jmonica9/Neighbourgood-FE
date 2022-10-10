import React, { useState } from "react";
import { Navbar, Text } from "@mantine/core";
import SideDrawer from "./SideDrawer";
import { neighbourgoodTheme } from "../styles/Theme";

export default function Sidebar(props) {
  const [user, setUser] = useState("placeholder");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => {
    setDrawerOpen(false);
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
            sx={{ position: "fixed", top: 0 }}
            className="sidebar-neighbourgood"
          >
            neighbourgood
          </Text>
          {/* Neighbourgood */}
        </Navbar.Section>
        <Navbar.Section>
          {user ? (
            <button
              className="drawer-toggle"
              onClick={() => {
                setDrawerOpen(!drawerOpen);
                props.drawerOpen();
              }}
            >
              {!drawerOpen ? `>` : `<`}
            </button>
          ) : null}
        </Navbar.Section>
      </Navbar>
      <SideDrawer openDrawer={drawerOpen} closeDrawer={() => closeDrawer()} />
    </div>
  );
}
