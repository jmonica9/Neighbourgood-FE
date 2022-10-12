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
} from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import { useNavigate } from "react-router-dom";
import Listing from "./Listing";

export default function LandingPageListings(props) {
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
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
    <Grid
      sx={{
        justifyContent: "center",
      }}
      mt={"1rem"}
    >
      <Grid>
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
                <ScrollArea style={{ height: "50vh", width: "auto" }}>
                  <Group
                    spacing={"xs"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
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
