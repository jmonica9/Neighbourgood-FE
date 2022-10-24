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
  Center,
  NativeSelect,
  TextInput,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import NewListing from "./NewListing";
import { useLocation, useNavigate } from "react-router-dom";
import Listing from "./Listing";
import { UserContext } from "../../App";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { LoadingOverlay, Title } from "@mantine/core";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { socket } from "../../App";

export default function Lobby(props) {
  const [lobbyListings, setLobbyListings] = useState([]);
  const [locationCategories, setLocationCategories] = useState(["All"]);
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [categoriess, setCategoriess] = useState([]);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [chosenCategories, setChosenCategories] = useState([]);
  const [chosenLocation, setChosenLocation] = useState("");
  const [myListings, setMyListings] = useState([]);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedListing, setSelectedListing] = useState();
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [listLocations, setListLocations] = useState([]);
  const userData = useContext(UserContext);

  useEffect(() => {
    if (userData) {
      axios
        .get(
          `${BACKEND_URL}/listing/${location.pathname.split("/")[1]}/${
            userData._id
          }/watchlist`
        )
        .then((res) => {
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
          setMyListings(res.data);
        });

      getLocationCategories();
      getCategories();
    }
    console.log(categoriess);
  }, [userData, location, refresh]);

  useEffect(() => {
    console.log(chosenCategories);
    //if no chosen categories/locations then get all listings
    if (
      (chosenCategories === [] || chosenCategories.length < 1) &&
      (chosenLocation === "" || chosenLocation === "All")
    ) {
      console.log("no sort");
      axios
        .get(`${BACKEND_URL}/listing/${location.pathname.split("/")[1]}`)
        .then((res) => {
          console.log(res);
          setLobbyListings(res.data);
        });
    } else if (
      // chose categories & location is nt initial state &  chosen All
      chosenCategories.length > 0 &&
      chosenLocation !== "All" &&
      chosenLocation !== ""
    ) {
      console.log("sort by loc n cat");
      sortByLocationAndCategories();
    } else if (chosenLocation !== "" && chosenLocation !== "All") {
      console.log(chosenLocation !== "All", "status");
      console.log("sort by loc", chosenLocation);
      sortByLocation();
    } else if (chosenCategories !== [] || chosenCategories.length > 0) {
      console.log("sort by cat");
      sortByCategories();
    }
  }, [
    chosenCategories,
    chosenLocation,
    location,
    locationCategories,
    loading,
    search,
  ]);

  const searchListings = (listingsArray) => {
    if (search !== "") {
      const listings = listingsArray.filter(
        (listing) =>
          listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.username.toLowerCase().includes(search.toLowerCase())
      );
      return listings;
    } else {
      return listingsArray;
    }
  };

  const getLobbyListings = async () => {
    const updatedListings = await axios.get(
      `${BACKEND_URL}/listing/${location.pathname.split("/")[1]}`
    );
    setLobbyListings(updatedListings.data);
  };

  // useEffect(() => {
  //   socket.on("updating listing info", () => {
  //     getLobbyListings();
  //   });
  // });

  const getCategories = () => {
    console.log(props.title, "TESTTTTTTT");
    if (props.title === "Sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
      // categories
      setCategoriess([
        { value: "Kitchen Appliances", label: "Kitchen Appliances" },
        { value: "Electronics", label: "Electronics" },
        { value: "Clothes and Wearables", label: "Clothes and Apparel" },
        { value: "Personal Care", label: "Personal Care" },
        { value: "Furniture", label: "Furniture" },
        { value: "Toys", label: "Toys" },
        { value: "Hobby", label: "Hobby" },
        { value: "Others", label: "Others" },
      ]);
    } else if (props.title === "Helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
      setCategoriess([
        { value: "Animal rescue and care", label: "Animal rescue and care" },
        { value: "Teaching", label: "Teaching" },
        { value: "Household Help", label: "Household Help" },
        { value: "Repair", label: "Repair" },
        { value: "Delivery", label: "Delivery" },
        { value: "Transport", label: "Transport" },
        { value: "Food", label: "Food" },
      ]);
    } else if (props.title === "Lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
      setCategoriess([
        { value: "Kitchen Appliances", label: "Kitchen Appliances" },
        { value: "Electronics", label: "Electronics" },
        { value: "Clothes and Wearables", label: "Clothes and Apparel" },
        { value: "Personal Care", label: "Personal Care" },
        { value: "Furniture", label: "Furniture" },
        { value: "Toys", label: "Toys" },
        { value: "Hobby", label: "Hobby" },
        { value: "Others", label: "Others" },
      ]);
    }
  };

  const sortByCategories = async () => {
    console.log("sort by categories");
    const listings = await axios.post(
      `${BACKEND_URL}/listing/categories/${location.pathname.split("/")[1]}`,
      { categories: chosenCategories }
    );
    console.log(listings.data);
    const listingsArray = searchListings(listings.data);
    setLobbyListings(listingsArray);
  };

  //Likes and Comments
  const updateLikes = async (listing) => {
    setRefresh(true);
    console.log(listing);
    if (!listing.usersLiked.includes(userData._id)) {
      console.log("adding");
      const addLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/add`,
        { userId: userData._id }
      );
      console.log(addLikes);
    } else {
      console.log("removing");
      const removeLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/remove`,
        { userId: userData._id }
      );
      console.log(removeLikes);
    }
    // await getLobbyListings();
    // this only gets all listing -> use another state loading to reload based on sorting
    setRefresh(false);

    console.log("lobby listings CAT", lobbyListings);
  };

  const sortByLocation = async () => {
    console.log("sort by location");
    await axios
      .post(
        `${BACKEND_URL}/listing/locations/${location.pathname.split("/")[1]}`,
        { location: chosenLocation }
      )
      .then((res) => {
        const listingsArray = searchListings(res.data);
        setLobbyListings(listingsArray);
      });
    console.log("lobby listings LOC", lobbyListings);
  };

  const sortByLocationAndCategories = async () => {
    console.log("sort by location+categories");
    await axios
      .post(
        `${BACKEND_URL}/listing/locationscategories/${
          location.pathname.split("/")[1]
        }`,
        { location: chosenLocation, categories: chosenCategories }
      )
      .then((res) => {
        const listingsArray = searchListings(res.data);
        setLobbyListings(listingsArray);
      });
    console.log("lobby listings LOC+CAT", lobbyListings);
  };

  const getLocationCategories = async () => {
    console.log("getting locations categories!");
    await axios
      .get(
        "http://localhost:3000/location/"
        // `http:/${BACKEND_URL}/location/`
      )
      .then((res) => {
        // setLocationCategories(current=>
        //  [current,res.data.map((item) => {
        //     return item.location;
        //   })]
        // );
        setLocationCategories([
          "All",
          ...res.data.map((item) => {
            return item.location;
          }),
        ]);
      });
    console.log({ locationCategories });
  };

  const closeNewModal = () => {
    setOpenNewModal(false);
    setRefresh(!refresh);
  };
  const closeListingModal = () => {
    setOpenListingModal(false);
    setRefresh(!refresh);
  };

  // categories;
  const categories = [
    { value: "Kitchen Appliances", label: "Kitchen Appliances" },
    { value: "Electronics", label: "Electronics" },
    { value: "Clothes and Wearables", label: "Clothes and Apparel" },
    { value: "Personal Care", label: "Personal Care" },
    { value: "Furniture", label: "Furniture" },
    { value: "Toys", label: "Toys" },
    { value: "Hobby", label: "Hobby" },
    { value: "Others", label: "Others" },
  ];

  const ListWatchlist = myWatchlist
    .sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .map((listing) => (
      <Card
        sx={{
          width: "10rem",
          height: "10rem",
          marginTop: "2vh",
          marginBottom: "2vh",
        }}
        target="_blank"
        key={listing._id}
      >
        <Card.Section width="10rem" height="10rem">
          <Image
            src={listing.cloudimg?.url}
            width="10rem"
            max-width="10rem"
            max-height="10rem"
            height={160}
            alt="No way!"
            onClick={() => {
              setOpenListingModal(true);
              setSelectedListing(listing);
            }}
          />
        </Card.Section>

        <Text weight={500} size="lg" mt="md">
          {listing.title}
        </Text>

        <Text mt="xs" color="dimmed" size="sm">
          {listing.description}
        </Text>
      </Card>
    ));
  const ListMyListings = myListings
    .sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .map((listing) => (
      <Card
        sx={{
          width: "10rem",
          height: "10rem",
          marginTop: "2vh",
          marginBottom: "2vh",
        }}
        target="_blank"
        onClick={() => {
          // navigate(`/${props.title.toLowerCase()}/listing/1`);
          setOpenListingModal(true);
          setSelectedListing(listing);
        }}
      >
        <Card.Section width="10rem" height="10rem">
          <Image
            src={listing.cloudimg?.url}
            width="10rem"
            max-width="10rem"
            max-height="10rem"
            height={160}
            alt="No way!"
          />
        </Card.Section>

        <Text weight={500} size="lg" mt="md">
          {listing.title}
        </Text>

        <Text mt="xs" color="dimmed" size="sm">
          {listing.description}
        </Text>
      </Card>
      // <Card
      //   sx={{ width: "10rem", height: "12rem" }}
      //   onClick={(e) => {
      //     setOpenListingModal(true);
      //     setSelectedListing(listing);
      //   }}
      // >
      //   {listing.title}
      // </Card>
    ));

  const ListAllListings = lobbyListings
    .sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .map((listing) => (
      <Card
        sx={{
          width: "15rem",
          height: "17rem",
          marginTop: "2vh",
          marginBottom: "2vh",
        }}
        target="_blank"
        key={listing._id}
      >
        <Card.Section width="13rem" height="15rem">
          <Image
            src={listing.cloudimg?.url}
            width="15rem"
            max-width="15rem"
            max-height="15rem"
            height={160}
            alt=""
            onClick={() => {
              setOpenListingModal(true);
              setSelectedListing(listing);
            }}
            sx={{ cursor: "pointer" }}
          />
        </Card.Section>
        <Grid>
          <Grid.Col span={8}>
            <Text weight={500} size="lg" mt="md">
              {listing.title}
            </Text>

            <Text mt="xs" color="dimmed" size="sm">
              {listing.description}
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text mt="md" size={"sm"}>
              {listing.usersLiked.includes(userData._id) ? (
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
        <div style={{ width: "100%", position: "relative" }}>
          <LoadingOverlay
            visible={loading}
            overlayBlur={6}
            loaderProps={{ size: "xl" }}
          />
          <Group position="center" grow spacing={"xs"} mb={"xs"}>
            {/* <Grid>
            <Grid.Col span={4} p={0}> */}
            <Card
              sx={{
                // width: props.drawerOpen ? "35vw" : "45vw",
                backgroundColor: themeColor,
                height: "35vh",
                minHeight: 280,
                display: "flex",
                borderRadius: 25,
              }}
            >
              {/* Contents in here */}
              <Stack>
                <Text align="left">{props.title} Watchlist</Text>

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
                height: "35vh",
                minHeight: 280,
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
                      <Text>You have no Listings</Text>
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
                height: "100%",

                display: "block",
                borderRadius: 25,
                marginBottom: "5vh",
              }}
            >
              <Grid>
                <Grid.Col span={6} sx={{ display: "flex" }}>
                  Latest {props.title}s
                </Grid.Col>
                <Grid.Col span={6} pl={0} sx={{ display: "flex" }}>
                  <TextInput
                    placeholder="Search"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    sx={{ width: "100%" }}
                  />
                </Grid.Col>
                <Grid.Col span={6} pl={0}>
                  <MultiSelect
                    data={categories.length > 1 && categoriess}
                    placeholder="Categories"
                    onChange={(e) => {
                      setChosenCategories(e);
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={4} pl={0}>
                  <NativeSelect
                    onChange={(event) => setChosenLocation(event.target.value)}
                    data={
                      locationCategories.length > 0
                        ? locationCategories
                        : ["Locations: All"]
                    }
                    placeholder="Location"
                  />
                </Grid.Col>
                <Grid.Col
                  span={2}
                  pl={0}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button radius={"xl"} onClick={() => setOpenNewModal(true)}>
                    Add a Listing
                  </Button>
                </Grid.Col>
                {/* 
                <ScrollArea style={{ height: "50vh", width: "auto" }}> */}
                <Group spacing={"xs"} sx={{ marginBottom: "7vh" }}>
                  {lobbyListings ? (
                    ListAllListings
                  ) : (
                    <Text>No Listing Exists Yet</Text>
                  )}
                </Group>
                {/* </ScrollArea> */}
              </Grid>
            </Card>
          </Group>
          <NewListing
            openModal={openNewModal}
            closeNewModal={closeNewModal}
            type={props.title}
            user={userData}
            loading={loading}
            setLoading={setLoading}
            categoriess={categoriess}
          />
          <Listing
            openModal={openListingModal}
            closeModal={closeListingModal}
            type={props.title}
            listing={selectedListing}
            loading={loading}
            setLoading={setLoading}
            socket={props.socket}
          />
        </div>
      </div>
    </div>
  );
}
