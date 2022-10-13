import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chatroom(props) {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        go back to dashboard
      </button>
    </div>
  );
}

export default Chatroom;
