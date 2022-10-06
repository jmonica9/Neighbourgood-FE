import React, { useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";

//import child components
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

//import styling
import { AppShell, Grid, Navbar, ScrollArea, Text } from "@mantine/core";

import "./App.css";
import Sidebar from "./components/Sidebar";
function App() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <Sidebar drawerOpen={() => setDrawerOpen(!drawerOpen)} />
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/dashboard"
            element={<Dashboard drawerOpen={drawerOpen} />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
