import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Group, Button, Card, Text, Grid, Image } from "@mantine/core";
import { BACKEND_URL } from "../../constants";
import axios from "axios";
import { neighbourgoodTheme } from "../../styles/Theme";
import { format } from "date-fns";
import Listing from "../Listing";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function ProfilePage(props) {
  const [profileData, setProfileData] = useState();
  const [profileListings, setProfileListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [listingOpened, setListingOpened] = useState();

  const { username } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    console.log(props.drawerOpen);
  }, [props]);

  const getUserProfile = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/users/profile/${username}`
    );
    console.log(response.data);
    setProfileData(response.data);
    getUserListings(response.data._id);
  };

  const getUserListings = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/listing/user/${id}`);
    console.log(response.data);
    setProfileListings(response.data);
  };

  const profileListingsSorted = profileListings.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const displayListings = profileListingsSorted.map((listing, index) => {
    let color;
    switch (listing.type) {
      case "sharing":
        color = neighbourgoodTheme.colors.lightTeal;
        break;
      case "helping":
        color = neighbourgoodTheme.colors.lightPurple;
        break;
      case "lending":
        color = neighbourgoodTheme.colors.lightBrown;
        break;
      default:
        color = neighbourgoodTheme.colors.lightGray;
    }
    return (
      <Grid.Col span={3} key={listing.id} p={"0.5vh"}>
        <Card
          sx={{
            backgroundColor: color,
            cursor: "pointer",
            borderRadius: 25,
            padding: 0,
          }}
          onClick={() => {
            setOpenListingModal(true);
            setListingOpened(listing);
            // console.log(listing);
          }}
        >
          <Text size={"sm"} lineClamp={1}>
            {index}: {listing.title}
          </Text>
          <Text size={"sm"}>By: {listing.username}</Text>
          <Image
            src={listing.image}
            height={"15vh"}
            sx={{ maxHeight: "15vh" }}
          />
        </Card>
      </Grid.Col>
    );
  });
  const closeListingModal = () => {
    setOpenListingModal(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <ArrowLeftIcon />
      </Button>
      {profileData && profileListings ? (
        <Grid ml={props.drawerOpen ? "23vw" : "3vw"} mb={"2vh"}>
          <Card
            sx={{
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              width: props.drawerOpen ? "73vw" : "93vw",
            }}
            p={"3vw"}
          >
            <Card.Section mb={"2vh"}>
              <Text size="xl" align="left">
                {profileData.username}
              </Text>
              <Text size="xl" align="left">
                {profileData.email}
              </Text>
            </Card.Section>
            <Card.Section>
              <Text size="md" align="left" mb={"1vh"}>
                {profileData.length} Listings
              </Text>
              <Grid>{displayListings}</Grid>
            </Card.Section>
            <Card.Section>
              <Text size="sm" mt={"2vh"} align="right">
                Joined on{" "}
                {format(Date.parse(profileData.createdAt), "dd MMM yyyy")}
              </Text>
            </Card.Section>
          </Card>
        </Grid>
      ) : null}

      {listingOpened ? (
        <Listing
          openModal={openListingModal}
          closeModal={closeListingModal}
          listing={listingOpened}
        />
      ) : null}
    </>
  );
}
