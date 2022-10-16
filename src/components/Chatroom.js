import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";

function Chatroom(props) {
  const { chatroomId } = useParams();
  const userData = useContext(UserContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState();
  const [requestor, setRequestor] = useState();
  const [owner, setOwner] = useState();

  useEffect(() => {
    getChatroomInfo();
  }, [userData]);

  const getChatroomInfo = () => {
    axios.get(`${BACKEND_URL}/chatroom/${chatroomId}`).then((res) => {
      setRequestor(res.data.requestorId);
      setOwner(res.data.ownerId);
      axios
        .get(`${BACKEND_URL}/chatroom/listing/${res.data.listingId}`)
        .then((res) => {
          setListing(res.data);
        });
    });
  };

  useEffect(() => {
    console.log(listing);
    console.log(requestor);
    console.log(owner);
  }, [listing]);

  return (
    <div>
      {listing && (
        <p style={{ color: "black" }}>
          listing item id: {listing._id}
          <br />
          listing item title: {listing.title}
          <br />
          chatroomId: {chatroomId}
        </p>
      )}

      <button onClick={() => navigate("/dashboard")}>
        go back to dashboard
      </button>
    </div>
  );
}

export default Chatroom;
