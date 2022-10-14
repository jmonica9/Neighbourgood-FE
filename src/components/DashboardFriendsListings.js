import { Card, Grid, Image, ScrollArea, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { neighbourgoodTheme } from "../styles/Theme";
import { BACKEND_URL } from "../constants";
import Listing from "./Listing";
import { UserContext } from "../App";

export default function DashboardFriendsListings(props) {
  const [friendsListings, setFriendsListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [listingOpened, setListingOpened] = useState();

  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      console.log(user.accountsFollowing);
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
    const response = await axios.get(`${BACKEND_URL}/listing/${id}`);
    console.log(response.data);
    return response.data;
  };

  // const friendsListings = [
  //   {
  //     userId: "User 1",
  //     title: "Sharing Listing Title",
  //     type: "Sharing",
  //     category: "",
  //     image:
  //       "https://images.unsplash.com/photo-1665344287455-d28131b732b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  //     reserved: false,
  //     dateOfTransaction: "",
  //   },
  //   {
  //     userId: "User 2",
  //     title: "Helping Listing Title",
  //     type: "Helping",
  //     category: "",
  //     image:
  //       "https://images.unsplash.com/photo-1665141530020-6df603c446c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  //     reserved: false,
  //     dateOfTransaction: "",
  //   },
  //   {
  //     userId: "User 2",
  //     title: "Lending Listing Title",
  //     type: "Lending",
  //     category: "",
  //     image:
  //       "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  //     reserved: false,
  //     dateOfTransaction: "",
  //   },
  //   {
  //     userId: "User 3",
  //     title: "Helping Listing Title",
  //     type: "Helping",
  //     category: "",
  //     image:
  //       "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  //     reserved: false,
  //     dateOfTransaction: "",
  //   },
  //   {
  //     userId: "User 3",
  //     title: "Lending Listing Title",
  //     type: "Lending",
  //     category: "",
  //     image:
  //       "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  //     reserved: false,
  //     dateOfTransaction: "",
  //   },
  // ];

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
      <Grid.Col span={3} key={listing.id}>
        <Card
          sx={{ backgroundColor: color, cursor: "pointer", borderRadius: 25 }}
          onClick={() => {
            setOpenListingModal(true);
            setListingOpened(listing);
            // console.log(listing);
          }}
        >
          <Text size={"sm"}>
            {index}: {listing.title}
          </Text>
          <Text size={"sm"}>By: {listing.username}</Text>
          <Image src={listing.image} height={"15vh"} />
        </Card>
      </Grid.Col>
    );
  });
  return (
    <div>
      <ScrollArea style={{ width: "auto", height: "25vh" }}>
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
