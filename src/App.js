import React, { useState, createContext, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Axios from "axios";
import { BACKEND_URL } from "./constants";
//import child components
// import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

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
import AuthModal from "./AuthModal";

import Sidebar from "./components/Sidebar";
import Lobby from "./components/Lobby";
import Listing from "./components/Listing";
import LandingPage from "./components/LandingPage";
import { Authentication } from "./Authentication";

import { io } from "socket.io-client";
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
    console.log("App.js check for user!");
    await Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/jwtUser`,
    }).then((res) => {
      console.log(res.data);
      setUserData(res.data);
    });
  };

  useEffect(() => {
    console.log("socket here");
    socket.on("testing1_recieved", () => console.log("socket emitted"));
    socket.on("user", (data) => {
      console.log(data, "socket user logged in DATA");
      setUserData(data);
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
                path="/sharing"
                element={<Lobby title="Sharing" drawerOpen={drawerOpen} />}
              />
              <Route
                path="/helping"
                element={<Lobby title="Helping" drawerOpen={drawerOpen} />}
              />
              <Route
                path="/lending"
                element={<Lobby title="Lending" drawerOpen={drawerOpen} />}
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
