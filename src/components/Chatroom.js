import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";

function Chatroom(props) {
  const { listingId, chatroomId } = useParams();
  const userData = useContext(UserContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState("");
  const [requestor, setRequestor] = useState("");
  const [owner, setOwner] = useState("");

  useEffect(() => {
    getListingInfo();
  }, [userData]);

  const getListingInfo = () => {
    axios.get(`${BACKEND_URL}/chatroom/${listingId}`).then((res) => {
      setListing(res.data);
    });
  };

  return (
    <div>
      <p style={{ color: "black" }}>
        listing item details: {listing._id}
        <br />
        listing item title: {listing.title}
        <br />
        chatroomId: {chatroomId}
      </p>

      <button onClick={() => navigate("/dashboard")}>
        go back to dashboard
      </button>
    </div>
  );
}

export default Chatroom;
