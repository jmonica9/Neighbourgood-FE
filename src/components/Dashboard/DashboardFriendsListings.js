import { Card, Grid, Image, ScrollArea, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { neighbourgoodTheme } from "../../styles/Theme";
import { BACKEND_URL } from "../../constants";
import Listing from "../Lobby/Listing";
import { UserContext } from "../../App";

export default function DashboardFriendsListings(props) {
  const [friendsListings, setFriendsListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [listingOpened, setListingOpened] = useState();
  const [searchField, setSearchField] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      // console.log(user.accountsFollowing);
      let friendsListingsArray = [];
      if (user.accountsFollowing.length > 0) {
        user.accountsFollowing.forEach(async (user_id) => {
          let listings = await getFriendsListings(user_id);
          friendsListingsArray = [...friendsListingsArray, ...listings];
          setFriendsListings(friendsListingsArray);
        });
      }
    }
  }, [user]);

  const getFriendsListings = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/listing/user/${id}`);
    // console.log(response.data);
    return response.data;
  };

  const friendsListingsSorted = friendsListings.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const closeListingModal = () => {
    setOpenListingModal(false);
  };

  const displayFriendsListings = friendsListingsSorted.map((listing, index) => {
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
      <Grid.Col span={3} key={listing._id} p={"0.5vh"}>
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
  return (
    <div>
      <Text align="left" size={25} weight={"semibold"}>
        Friend's Listings
      </Text>
      <ScrollArea style={{ width: "100%", height: "30vh" }}>
        <Grid>{displayFriendsListings}</Grid>
      </ScrollArea>
      {listingOpened ? (
        <Listing
          openModal={openListingModal}
          closeModal={closeListingModal}
          listing={listingOpened}
        />
      ) : null}
    </div>
  );
}
