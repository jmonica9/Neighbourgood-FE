import React, { useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";

//import child components
import AuthForm from "./components/AuthForm";
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
function App() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="App">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={neighbourgoodTheme}
      >
        <header className="App-header">
          <Sidebar drawerOpen={() => setDrawerOpen(!drawerOpen)} />
          <Routes>
            {/* darren here */}
            {/* <Route path="/" element={<Landing />} /> */}
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
        </header>
      </MantineProvider>
    </div>
  );
}

export default App;
