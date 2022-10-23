import React, { useState, createContext, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Axios from "axios";
import { BACKEND_URL } from "./constants";
import Dashboard from "./components/Dashboard/Dashboard";

//import styling
import {
  AppShell,
  Grid,
  Navbar,
  ScrollArea,
  Text,
  MantineProvider,
} from "@mantine/core";
import { neighbourgoodTheme } from "./styles/Theme";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Lobby from "./components/Lobby/Lobby";
import Listing from "./components/Lobby/Listing";
import LandingPage from "./components/LandingPage/LandingPage";
import { Authentication } from "./Authentication";

import { io } from "socket.io-client";
import Chatroom from "./components/Chatroom/Chatroom";
import ProfilePage from "./components/Profile/ProfilePage";
import { Faq } from "./components/Miscellaneous/Faq";
import { OverallChats } from "./components/OverallChat";
import { Error } from "./components/Miscellaneous/Error";
import ReviewDetails from "./components/ReviewDetails";
import IndividualReview from "./components/IndividualReviews";
import Community from "./components/Dashboard/Community/Community";
export const socket = io("http://localhost:3000");

export const UserContext = createContext();

export default function App() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState();
  useEffect(() => {
    checkJWT();
  }, []);

  const logout = () => {
    console.log("logout!");
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/logout`,
    }).then((res) => {
      navigate("/");
      console.log(res.data);
      setUserData(null);
      toast("You have logged out!", {
        position: "top-right",
        autoClose: 4,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    });
  };

  const checkJWT = async () => {
    await Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/jwtUser`,
    }).then((res) => {
      // console.log(res.data);
      if (res.data === "No User Exists") {
        setUserData(undefined);
      } else setUserData(res.data);
    });
  };

  useEffect(() => {
    socket.on("testing_received", (data) => {
      alert("this is from app.js");
    });
    socket.on("user", (data) => {
      console.log(data, "socket user logged in DATA");
      setUserData(data.data);
    });
    socket.on("updating user info", () => {
      checkJWT();
    });
  }, [socket]);

  return (
    <div className="App">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={neighbourgoodTheme}
      >
        <header className="App-header">
          <UserContext.Provider value={userData}>
            <Sidebar
              drawer={drawerOpen}
              logout={logout}
              drawerOpen={() => {
                setDrawerOpen(!drawerOpen);
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/signin"
                element={
                  <Authentication
                    title="Lending"
                    onLogin={(data) => setUserData(data)}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={<Dashboard drawerOpen={drawerOpen} />}
              />
              <Route
                path="/user/:username"
                element={<ProfilePage drawerOpen={drawerOpen} />}
              />
              <Route
                path="/sharing"
                element={
                  <Lobby
                    title="Sharing"
                    drawerOpen={drawerOpen}
                    socket={socket}
                  />
                }
              />
              <Route
                path="/helping"
                element={
                  <Lobby
                    title="Helping"
                    drawerOpen={drawerOpen}
                    socket={socket}
                  />
                }
              />
              <Route
                path="/lending"
                element={
                  <Lobby
                    title="Lending"
                    drawerOpen={drawerOpen}
                    socket={socket}
                  />
                }
              />
              <Route
                path="/sharing/listing/:listingId"
                element={<Listing title="Sharing" drawerOpen={drawerOpen} />}
              />
              <Route
                path="/helping/listing/:listingId"
                element={<Listing title="Helping" drawerOpen={drawerOpen} />}
              />
              <Route
                path="/lending/listing/:listingId"
                element={<Listing title="Lending" drawerOpen={drawerOpen} />}
              />
              <Route
                path="/chatroom/:chatroomId"
                element={<Chatroom drawerOpen={drawerOpen} socket={socket} />}
              />
              <Route path="/faq" element={<Faq />}></Route>
              <Route
                path="/overallChats"
                element={<OverallChats drawerOpen={drawerOpen} />}
              ></Route>
              <Route
                path="/individualReview/:listingId"
                element={<IndividualReview drawerOpen={drawerOpen} />}
              ></Route>
              <Route path="/*" element={<Error />}></Route>
              <Route
                path="/community"
                element={<Community drawerOpen={drawerOpen} />}
              />
            </Routes>
          </UserContext.Provider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
          />
        </header>
      </MantineProvider>
    </div>
  );
}
