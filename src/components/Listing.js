import React, { useState, useEffect, useContext } from "react";
import { renderMatches, useParams, useNavigate } from "react-router-dom";

//import styling
import { neighbourgoodTheme } from "../styles/Theme";
import {
  Card,
  Grid,
  Text,
  Group,
  CardSection,
  Image,
  Stack,
  Button,
  Alert,
  Notification,
  Modal,
} from "@mantine/core";
import { UserContext } from "../App";
import axios from "axios";
import { BACKEND_URL } from "../constants";

export default function Listing(props) {
  const { listingId } = useParams();
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [opened, setOpened] = useState(props.openModal);
  const userData = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.listing.type === "sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
    } else if (props.listing.type === "helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
    } else if (props.listing.type === "lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
    }
  }, [props]);

  useEffect(() => {
    setOpened(props.openModal);
  });

  const sendRequest = async () => {
    //title, image, categories, description, type
    const response = await axios.post(`${BACKEND_URL}/listing/request`, {
      listing: props.listing,
      userId: userData._id,
    });
    navigate(`/${props.listing._id}/chatroom`);
  };

  return (
    <Modal
      size={"80%"}
      opened={opened}
      onClose={() => {
        setOpened(false);
        props.closeModal();
      }}
    >
      <div>
        <div>
          <Card
            sx={{
              width: "100%",
              backgroundColor: themeColor,
              height: "95vh",
              borderRadius: 25,
            }}
          >
            {/* Contents in here */}
            <CardSection>
              <Grid sx={{ width: "100%" }}>
                <Grid.Col span={6}>
                  <Text align="left">Listing {listingId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text align="right">By: {props.listing.username}</Text>
                </Grid.Col>
              </Grid>
            </CardSection>
            <br />
            <CardSection>
              <Image src={`${props.listing.image}`} height={"60vh"} />
            </CardSection>
            <CardSection>
              <Stack>
                <Text align="left">Title : {props.listing.title}</Text>
                <Text align="left">
                  Description : {props.listing.description}
                </Text>
                <Grid>
                  <Grid.Col span={9}></Grid.Col>
                  <Grid.Col span={3}>
                    {!props.listing.requestorIds.includes(userData._id) && (
                      <Button ml={"5rem"} onClick={sendRequest}>
                        Request
                      </Button>
                    )}
                  </Grid.Col>
                </Grid>
              </Stack>
            </CardSection>
          </Card>
        </div>
      </div>
    </Modal>
  );
}
