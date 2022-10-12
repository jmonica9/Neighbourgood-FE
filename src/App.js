import React, { useState, createContext, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
const socket = io("http://localhost:3001");

export const UserContext = createContext();

export default function App() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState();

  const signInUser = (user) => {
    setUserData(user);
  };

  useEffect(() => {
    console.log("socket here");
    socket.on("testing1_recieved", () => console.log("socket emitted"));
  }, [socket]);

  useEffect(() => {
    socketEmit();
  }, []);
  const socketEmit = () => {
    socket.emit("testing1", "data string");
  };

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
              drawerOpen={() => {
                setDrawerOpen(!drawerOpen);
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage signIn={signInUser} />} />
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
