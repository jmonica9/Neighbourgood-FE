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
  Text,
  Box,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import { useNavigate } from "react-router-dom";
import Listing from "../Lobby/Listing";
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

  return (
    <Grid
      sx={{
        justifyContent: "center",
      }}
      mt={"1rem"}
      mb={"5rem"}
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
        <Authentication onClose={() => setAuthOpen(false)} />
      </Modal>
      <Grid>
        <Group sx={{ minHeight: "70vh" }}>
          <Card
            sx={{
              width: props.drawerOpen ? "70vw" : "90vw",
              backgroundColor: "#3E3E3E",
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
                  color: "white",
                }}
              >
                Latest {props.title} type listings
              </Grid.Col>
              <Grid
                mt={"1em"}
                sx={{ background: themeColor, borderRadius: "1rem" }}
                mx="1rem"
                px=" 0.9rem"
              >
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
                        <Grid.Col
                          span={"auto"}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "20rem",
                              height: "20rem",
                              marginTop: "2vh",
                              background: "white",
                              borderRadius: "1rem",
                            }}
                            target="_blank"
                            key={listing._id}
                          >
                            <div style={{ position: "absolute" }}></div>
                            <Image
                              src={listing.cloudimg?.url}
                              width="20rem"
                              max-width="20rem"
                              max-height="20rem"
                              height={"20rem"}
                              alt="No way!"
                              radius="1rem"
                            />
                            <Box
                              className="watchlist-container"
                              sx={{
                                height: "100%",
                                position: "relative",
                                top: "-20rem",
                                backgroundColor: "rgba(17, 5, 5, 0.9)",
                                display: "flex",
                                flexFlow: "column nowrap",
                                justifyContent: "center",
                                opacity: 0,
                                borderRadius: "1rem",
                              }}
                              p="1rem"
                              onClick={() => {
                                setAuthOpen(true);
                              }}
                            >
                              <Box
                                sx={{
                                  color: "white",
                                  whiteSpace: "wrap",
                                  overflow: "hidden",
                                  overflowWrap: "break-word",
                                  fontSize: "1.5rem",
                                }}
                              >
                                {listing.title}
                              </Box>
                              <Box
                                sx={{
                                  color: "white",
                                  whiteSpace: "wrap",
                                  overflow: "hidden",
                                  overflowWrap: "break-word",
                                  fontSize: "0.8rem",
                                }}
                                pt="1rem"
                              >
                                {listing.description}
                              </Box>
                            </Box>
                          </Box>
                        </Grid.Col>
                      ))
                  ) : (
                    <Grid>
                      <Grid.Col
                        px="17rem"
                        py="5rem"
                        sx={{ textAlign: "center" }}
                      >
                        {null}
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
