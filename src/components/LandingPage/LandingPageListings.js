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
  Modal,
  useMantineTheme,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import { useNavigate } from "react-router-dom";
import Listing from "../Listing";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { Authentication } from "../../Authentication";

export default function LandingPageListings(props) {
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [listings, setListings] = useState([]);
  const [chosenCategories, setChosenCategories] = useState("");
  const [selectedListing, setSelectedListing] = useState({ _id: "test" });
  const [authOpen, setAuthOpen] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (props.title === "sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
    } else if (props.title === "helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
    } else if (props.title === "lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
    }
  });

  useEffect(() => {
    axios.get(`${BACKEND_URL}/listing/${props.title}`).then((res) => {
      setListings(res.data);
    });
  }, []);

  useEffect(() => {
    if (chosenCategories.length < 1) {
      axios.get(`${BACKEND_URL}/listing/${props.title}`).then((res) => {
        setListings(res.data);
      });
    } else sortByCategories();
  }, [chosenCategories]);

  const sortByCategories = async () => {
    await axios
      .post(`${BACKEND_URL}/listing/categories/${props.title}`, {
        categories: chosenCategories,
      })
      .then((res) => {
        setListings(res.data);
      });
  };

  useEffect(() => {
    console.log(selectedListing);
  }, [selectedListing]);

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

  return (
    <Grid
      sx={{
        justifyContent: "center",
      }}
      mt={"1rem"}
      mb={"10rem"}
    >
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={authOpen}
        onClose={() => setAuthOpen(false)}
        overflow="inside"
      >
        {/* <AuthForm /> */}
        <Authentication onClose={() => setAuthOpen(false)} />
      </Modal>
      <Grid>
        <Group sx={{ minHeight: "50vh" }}>
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
                <MultiSelect
                  data={categories}
                  placeholder="Categories"
                  onChange={(e) => {
                    setChosenCategories(e);
                  }}
                />
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
                  {listings.length > 0 ? (
                    listings
                      .sort((a, b) => {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                      })
                      .map((listing) => (
                        <Card
                          sx={{ width: "15rem", height: "17rem" }}
                          onClick={() => {
                            setAuthOpen(true);
                          }}
                          key={listing._id}
                          m="1rem"
                        >
                          <Image src={listing.cloudimg?.url} alt="loading" />
                          {listing.title}
                        </Card>
                      ))
                  ) : (
                    <Grid>
                      <Grid.Col px="17rem" py="5rem">
                        There are no listings matching your selected categories.
                        Please try a different selection or check back again in
                        a few days!
                      </Grid.Col>
                    </Grid>
                  )}
                </Group>
              </Grid>
            </Grid>
          </Card>
        </Group>
      </Grid>
    </Grid>
  );
}
