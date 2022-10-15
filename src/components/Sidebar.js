import React, { useEffect, useState, useContext } from "react";
import { Group, Navbar, Text } from "@mantine/core";
import SideDrawer from "./SideDrawer";
import { neighbourgoodTheme } from "../styles/Theme";
import AuthModal from "../AuthModal";
import { UserContext } from "../App";
import { Button } from "bootstrap";
import Home from "./HomeButton";
import { CaretRightSquare } from "react-bootstrap-icons";
import { CaretLeftSquareFill } from "react-bootstrap-icons";

export default function Sidebar(props) {
  const userData = useContext(UserContext);
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
            sx={{ position: "fixed", top: "5rem", left: "-6rem" }}
            className="sidebar-neighbourgood"
          >
            <Home />
          </Text>

          {!userData && (
            <Text
              sx={{ position: "fixed", top: "18rem", left: "-2.75rem" }}
              className="sidebar-neighbourgood"
            >
              <AuthModal />
            </Text>
          )}
        </Navbar.Section>
        <Navbar.Section>
          {userData ? (
            <div
              className="drawer-toggle"
              style={{
                display: "flex",
              }}
              onClick={() => {
                props.drawerOpen();
              }}
            >
              {!props.drawer ? <CaretRightSquare /> : <CaretLeftSquareFill />}
            </div>
          ) : null}
        </Navbar.Section>
      </Navbar>
      <SideDrawer
        userData={userData}
        logout={props.logout}
        openDrawer={props.drawer}
        closeDrawer={closeDrawer}
      />
    </div>
  );
}
