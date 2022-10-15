import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";

import { createStyles } from "@mantine/core";
import { neighbourgoodTheme } from "./styles/Theme";

const useStyles = createStyles((theme) => ({
  text: {
    fontSize: theme.fontSizes.xl,
    [theme.fn.smallerThan("lg")]: {
      fontSize: theme.fontSizes.sm,
    },
  },
}));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
