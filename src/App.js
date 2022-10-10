import React from "react";
import AuthForm from "./AuthForm";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AuthModal from "./AuthModal";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <AuthForm /> */}
        <AuthModal />
      </header>
    </div>
  );
}

export default App;
