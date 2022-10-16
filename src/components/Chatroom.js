import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Modal, Button, Group, Grid } from "@mantine/core";

function Chatroom(props) {
  const { chatroomId } = useParams();
  const userData = useContext(UserContext);
  const { state } = useLocation();

  const navigate = useNavigate();
  const [listing, setListing] = useState();
  const [requestor, setRequestor] = useState();
  const [owner, setOwner] = useState();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (state.fromRequestPage && listing) {
      if (listing.type === "lending") {
        setOpened(true);
      }
    } else {
      console.log("from elsewhere");
    }
  }, [listing]);

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

  return (
    <div>
      {listing && (
        <p style={{ color: "black" }}>
          listing item id: {listing._id}
          <br />
          listing item title: {listing.title}
          <br />
          listing item type: {listing.type}
          <br />
          chatroomId: {chatroomId}
        </p>
      )}

      <button onClick={() => navigate("/dashboard")}>
        go back to dashboard
      </button>
      <>
        <Modal opened={opened} onClose={() => setOpened(false)} fullScreen>
          <Group position="center">
            <Grid>
              <Grid.Col>BORROWING ETIQUETTE</Grid.Col>
              <Grid.Col>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the Lorem Ipsum generators on
                the Internet tend to repeat predefined chunks as necessary,
                making this the first true generator on the Internet. It uses a
                dictionary of over 200 Latin words, combined with a handful of
                model sentence structures, to generate Lorem Ipsum which looks
                reasonable. The generated Lorem Ipsum is therefore always free
                from repetition, injected humour, or non-characteristic words
                etc.
              </Grid.Col>
              <Grid.Col>
                <Button onClick={() => setOpened(false)}>Accept</Button>
              </Grid.Col>
            </Grid>
          </Group>
        </Modal>
      </>
    </div>
  );
}

export default Chatroom;
