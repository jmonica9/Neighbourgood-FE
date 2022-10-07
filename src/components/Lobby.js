import React, { useEffect, useState } from "react";

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
} from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import NewListing from "./NewListing";
import { useNavigate } from "react-router-dom";
import Listing from "./Listing";

export default function Lobby(props) {
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openListingModal, setOpenListingModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.title === "Sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
    } else if (props.title === "Helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
    } else if (props.title === "Lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
    }
  });
  const closeNewModal = () => {
    setOpenNewModal(false);
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
  return (
    <div
      style={{
        marginLeft: props.drawerOpen ? "26vw" : "6vw",
        marginRight: "4vw",
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
              height: "30vh",
              display: "flex",
              borderRadius: 25,
            }}
          >
            {/* Contents in here */}
            <Stack>
              {props.title} Watchlist
              <ScrollArea style={{ height: "15rem", width: "auto" }}>
                <Group spacing={"xs"}>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                </Group>
              </ScrollArea>
            </Stack>
          </Card>
          {/* </Grid.Col>
            <Grid.Col span={8} p={0} pl={"1rem"}> */}
          <Card
            sx={{
              // width: props.drawerOpen ? "35vw" : "45vw",
              backgroundColor: themeColor,
              height: "30vh",
              display: "flex",
              borderRadius: 25,
            }}
          >
            {/* Contents in here */}
            <Stack>
              Your {props.title} Activities
              <ScrollArea style={{ height: "15rem", width: "auto" }}>
                <Group spacing={"xs"}>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                  <Card sx={{ width: "10rem", height: "12rem" }}>
                    Placeholder Card
                  </Card>
                </Group>
              </ScrollArea>
            </Stack>
          </Card>
          {/* </Grid.Col>
          </Grid> */}
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
                  <Card
                    sx={{ width: "18.5rem", height: "20rem" }}
                    onClick={() => {
                      // navigate(`/${props.title.toLowerCase()}/listing/1`);
                      setOpenListingModal(true);
                    }}
                  >
                    Listing
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                  <Card sx={{ width: "18.5rem", height: "20rem" }}>
                    Listing{" "}
                  </Card>
                </Group>
              </ScrollArea>

              {/* <Grid.Col span={8}>
                <Card
                  sx={{ height: "56vh", display: "flex", borderRadius: 25 }}
                >
                  Calendar
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card
                  sx={{ height: "56vh", display: "flex", borderRadius: 25 }}
                >
                  Reviews
                </Card>
              </Grid.Col> */}
            </Grid>
          </Card>
        </Group>
        <NewListing
          openModal={openNewModal}
          closeModal={closeNewModal}
          type={props.title}
        />
        <Listing
          openModal={openListingModal}
          closeModal={closeListingModal}
          type={props.title}
        />
      </div>
    </div>
  );
}
