import { Card, Grid, Image, ScrollArea, Text, TextInput } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { neighbourgoodTheme } from "../../styles/Theme";
import { BACKEND_URL } from "../../constants";
import Listing from "../Lobby/Listing";
import { UserContext } from "../../App";
import { formatDistanceToNow } from "date-fns";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";

export default function DashboardFriendsListings(props) {
  const [friendsListings, setFriendsListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [listingOpened, setListingOpened] = useState();
  const [searchField, setSearchField] = useState("");
  const [refresh, setRefresh] = useState(false);

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
  }, [user, refresh, openListingModal, searchField]);

  useEffect(() => {
    console.log(props.drawerOpen);
  }, [props]);

  const getFriendsListings = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/listing/user/${id}`);
    // console.log(response.data);
    setFriendsListings(response.data);
    if (searchField !== "") {
      searchListings();
    }
  };

  const friendsListingsSorted = friendsListings.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const closeListingModal = () => {
    setOpenListingModal(false);
  };
  const updateLikes = async (listing) => {
    setRefresh(true);
    console.log(listing);
    if (!listing.usersLiked.includes(user._id)) {
      console.log("adding");
      const addLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/add`,
        { userId: user._id }
      );
      console.log(addLikes);
    } else {
      console.log("removing");
      const removeLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/remove`,
        { userId: user._id }
      );
      console.log(removeLikes);
    }
    await getFriendsListings();
    // this only gets all listing -> use another state loading to reload based on sorting
    setRefresh(false);
  };

  const searchListings = () => {
    const filteredList = friendsListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchField.toLowerCase()) ||
        listing.username.toLowerCase().includes(searchField.toLowerCase())
    );
    setFriendsListings(filteredList);
    console.log(filteredList.length);
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
      <Grid.Col span={props.drawerOpen ? 4 : 3} key={listing._id} p={"0.5vh"}>
        <Card
          radius={"xl"}
          sx={{
            backgroundColor: color,
            cursor: "pointer",
            borderRadius: 25,
            padding: 0,
            // width: "16rem",
            // height: "17rem",
          }}
        >
          <Grid>
            <Grid.Col span={5}>
              <Text size={"sm"} align="left" lineClamp={1}>
                @{listing.username}
              </Text>
            </Grid.Col>
            <Grid.Col span={7} pl={0}>
              <Text size={"sm"}>
                {formatDistanceToNow(Date.parse(listing.createdAt))} ago
              </Text>
            </Grid.Col>
          </Grid>
          <Image
            src={listing.cloudimg?.url}
            height={"15vh"}
            sx={{ maxHeight: "15vh" }}
            onClick={() => {
              setOpenListingModal(true);
              setListingOpened(listing);
              // console.log(listing);
            }}
          />
          <Grid>
            <Grid.Col span={8}>
              <Text size={"md"} align="left" lineClamp={1} sx={{}}>
                {listing.title}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text mt="md" size={"sm"}>
                {listing.usersLiked.includes(user._id) ? (
                  <HeartFilledIcon
                    style={{ marginRight: "1vw" }}
                    onClick={() => {
                      updateLikes(listing);
                    }}
                  />
                ) : (
                  <HeartIcon
                    style={{ marginRight: "1vw" }}
                    onClick={() => {
                      updateLikes(listing);
                    }}
                  />
                )}
                {listing.usersLiked.length}
              </Text>
            </Grid.Col>
          </Grid>
        </Card>
      </Grid.Col>
    );
  });
  return (
    <>
      <Grid>
        <Grid.Col span={8} grow>
          <Text align="left" size={25} weight={"semibold"}>
            Friend's Listings
          </Text>
        </Grid.Col>
        <Grid.Col span={4} grow>
          <TextInput
            radius="xl"
            placeholder="Search"
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              searchListings();
            }}
          />
        </Grid.Col>
      </Grid>

      <ScrollArea style={{ width: "100%", height: "30vh" }} p={0}>
        <Grid p={0} m={0}>
          {displayFriendsListings}
        </Grid>
      </ScrollArea>
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
