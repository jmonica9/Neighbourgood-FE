import React, { useEffect, useState } from "react";

//import styling
import {
  Grid,
  Card,
  Group,
  Stack,
  ScrollArea,
  MultiSelect,
  Button,
  Image,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import { useNavigate } from "react-router-dom";
import Listing from "../Listing";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

export default function LandingPageListings(props) {
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [openListingModal, setOpenListingModal] = useState(false);
  const [listings, setListings] = useState();
  const navigate = useNavigate();
  const [chosenCategories, setChosenCategories] = useState([]);

  useEffect(() => {
    if (props.title === "Sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
      axios.get(`${BACKEND_URL}/listing/sharing`).then((res) => {
        console.log(res.data);
        setListings(res.data);
      });
    } else if (props.title === "Helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
      axios.get(`${BACKEND_URL}/listing/helping`).then((res) => {
        console.log(res.data);
        setListings(res.data);
      });
    } else if (props.title === "Lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
      axios.get(`${BACKEND_URL}/listing/lending`).then((res) => {
        console.log(res.data);
        setListings(res.data);
      });
    }
  }, []);

  useEffect(() => {
    console.log(listings);
  }, [listings]);

  const closeListingModal = () => {
    setOpenListingModal(false);
  };

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

  //query for all listings
  // if (chosenCategories === []) {
  //   axios
  //     .get(`${BACKEND_URL}/listing/${location.pathname.split("/")[1]}`)
  //     .then((res) => {
  //       console.log("res for all listings", res);
  //       setLobbyListings(res.data);
  //     });
  // }

  return (
    <Grid
      sx={{
        justifyContent: "center",
      }}
      mt={"1rem"}
      mb={"2rem"}
    >
      <Grid>
        <Group>
          <Card
            sx={{
              width: props.drawerOpen ? "70vw" : "90vw",
              backgroundColor: themeColor,
              height: "100%",
              display: "block",
              borderRadius: 25,
            }}
          >
            <Grid>
              <Grid.Col
                span={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Latest {props.title}s
              </Grid.Col>
              <Grid.Col span={6} pl={0}>
                <MultiSelect data={categories} placeholder="Categories" />
              </Grid.Col>
              <Grid.Col span={6} pl={0}>
                <MultiSelect data={categories} placeholder="Categories" />
              </Grid.Col>
              <Grid mt={"1em"}>
                <Group
                  spacing={"xs"}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  {listings &&
                    listings
                      .sort((a, b) => {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                      })
                      .map((listing) => (
                        <Card
                          sx={{ width: "15rem", height: "17rem" }}
                          onClick={() => {
                            setOpenListingModal(true);
                          }}
                          key={listing.id}
                          m="1rem"
                        >
                          <Image src={listing.cloudimg?.url} alt="loading" />
                          {listing.title}
                        </Card>
                      ))}
                </Group>
              </Grid>
            </Grid>
          </Card>
        </Group>
        <Listing
          openModal={openListingModal}
          closeModal={closeListingModal}
          type={props.title}
        />
      </Grid>
    </Grid>
  );
}
