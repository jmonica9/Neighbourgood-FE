import React, { useEffect, useState, useContext } from "react";

//import styling
import {
  Text,
  Grid,
  Card,
  Group,
  Stack,
  ScrollArea,
  SimpleGrid,
  MultiSelect,
  Button,
  Image,
} from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import NewListing from "./NewListing";
import { useLocation, useNavigate } from "react-router-dom";
import Listing from "./Listing";
import { UserContext } from "../App";
import axios from "axios";
import { BACKEND_URL } from "../constants";
export default function Lobby(props) {
  const [lobbyListings, setLobbyListings] = useState([]);
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [openNewModal, setOpenNewModal] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedListing, setSelectedListing] = useState();
  const [myWatchlist, setMyWatchlist] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useContext(UserContext);

  useEffect(() => {
    //WAIT FOR USERDATA
    //according to lobby type:
    //query for listings watchlist
    axios
      .get(
        `${BACKEND_URL}/listing/${location.pathname.split("/")[1]}/${
          userData._id
        }/watchlist`
      )
      .then((res) => {
        console.log("res for my watchlist listings", res);
        setMyWatchlist(res.data);
      });
    //query for my own listings
    axios
      .get(
        `${BACKEND_URL}/listing/${location.pathname.split("/")[1]}/${
          userData._id
        }`
      )
      .then((res) => {
        console.log("res for my listings", res);
        setMyListings(res.data);
      });
    //query for all listings
    axios
      .get(`${BACKEND_URL}/listing/${location.pathname.split("/")[1]}`)
      .then((res) => {
        console.log("res for all listings", res);
        setLobbyListings(res.data);
      });
  }, [userData, location, refresh]);

  useEffect(() => {
    if (props.title === "Sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
    } else if (props.title === "Helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
    } else if (props.title === "Lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
    }
  });

  const TriggerOpenNewModal = () => {
    setOpenNewModal(true);
  };
  const TriggerOpenListingModal = () => {
    setOpenListingModal(true);
  };

  const closeNewModal = () => {
    setOpenNewModal(false);
    setRefresh(!refresh);
  };
  const closeListingModal = () => {
    setOpenListingModal(false);
  };

  const categories = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];

  const ListWatchlist = myWatchlist.map((listing) => (
    <Card
      sx={{ width: "10rem", height: "12rem" }}
      onClick={(e) => {
        setOpenListingModal(true);
        setSelectedListing(listing);
      }}
    >
      {listing.title}
      <Image src={listing.image} />
    </Card>
  ));
  const ListMyListings = myListings.map((listing) => (
    <Card
      sx={{ width: "10rem", height: "12rem" }}
      onClick={(e) => {
        setOpenListingModal(true);
        setSelectedListing(listing);
      }}
    >
      {listing.title}
    </Card>
  ));

  const ListAllListings = lobbyListings.map((listing) => (
    <Card
      sx={{ width: "15rem", height: "17rem" }}
      onClick={() => {
        // navigate(`/${props.title.toLowerCase()}/listing/1`);
        setOpenListingModal(true);
        setSelectedListing(listing);
      }}
    >
      {listing.title}
    </Card>
  ));

  return (
    <div
      style={{
        marginLeft: props.drawerOpen ? "26vw" : "6vw",
        marginRight: "4vw",
        marginTop: "0.5vw",
      }}
    >
      {/* <Text color="black">{props.title}</Text> */}
      <div>
        <Group position="center" grow spacing={"xs"} mb={"xs"}>
          {/* <Grid>
            <Grid.Col span={4} p={0}> */}
          <Card
            sx={{
              // width: props.drawerOpen ? "35vw" : "45vw",
              backgroundColor: themeColor,
              height: "45vh",
              display: "flex",
              borderRadius: 25,
            }}
          >
            {/* Contents in here */}
            <Stack>
              <Text> {props.title} Watchlist</Text>

              <ScrollArea style={{ height: "18rem", width: "100%" }}>
                <Group spacing={"xs"}>
                  {/* map out the listings here */}
                  {myWatchlist && myWatchlist.length > 0 ? (
                    ListWatchlist
                  ) : (
                    <Text>Watchlist is empty</Text>
                  )}
                </Group>
              </ScrollArea>
            </Stack>
          </Card>

          <Card
            sx={{
              // width: props.drawerOpen ? "35vw" : "45vw",
              backgroundColor: themeColor,
              height: "45vh",
              display: "flex",
              borderRadius: 25,
            }}
          >
            <Stack>
              <Text align="left"> Your {props.title} Activities</Text>
              <ScrollArea style={{ height: "18rem", width: "100%" }}>
                <Group spacing={"xs"}>
                  {myListings && myListings.length > 0 ? (
                    ListMyListings
                  ) : (
                    <Text>U have no listings</Text>
                  )}
                </Group>
              </ScrollArea>
            </Stack>
          </Card>
        </Group>

        <Group>
          <Card
            sx={{
              width: props.drawerOpen ? "70vw" : "90vw",
              backgroundColor: themeColor,
              height: "65vh",
              display: "block",
              borderRadius: 25,
            }}
          >
            <Grid>
              <Grid.Col span={12} sx={{ display: "flex" }}>
                Latest {props.title}s
              </Grid.Col>
              <Grid.Col span={6} pl={0}>
                <MultiSelect data={categories} placeholder="Categories" />
              </Grid.Col>
              <Grid.Col span={3} pl={0}>
                <MultiSelect data={categories} placeholder="Categories" />
              </Grid.Col>
              <Grid.Col
                span={3}
                pl={0}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button radius={"xl"} onClick={() => setOpenNewModal(true)}>
                  Add a Listing
                </Button>
              </Grid.Col>

              <ScrollArea style={{ height: "50vh", width: "auto" }}>
                <Group spacing={"xs"}>
                  {lobbyListings ? (
                    ListAllListings
                  ) : (
                    <Text>No Listing Exist Yet</Text>
                  )}
                </Group>
              </ScrollArea>
            </Grid>
          </Card>
        </Group>
        <NewListing
          openModal={openNewModal}
          closeNewModal={closeNewModal}
          type={props.title}
          user={userData}
        />
        <Listing
          openModal={openListingModal}
          closeModal={closeListingModal}
          type={props.title}
          listing={selectedListing}
        />
      </div>
    </div>
  );
}
