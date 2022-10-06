import React from "react";
import AuthForm from "./AuthForm";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthForm />
      </header>
    </div>
  );
}

export default App;
