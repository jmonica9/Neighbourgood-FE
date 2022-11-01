import React, { useContext, useState } from "react";
import DashboardCalendar from "./DashboardCalendar";
//import styling
import {
  Card,
  Grid,
  Paper,
  ScrollArea,
  Stack,
  Text,
  createStyles,
  Title,
  Box,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import DashboardFriendsListings from "./DashboardFriendsListings";
import { UserContext } from "../../App";
import DashboardReviews from "./DashboardReviews";
import { OverallChats } from "./OverallChat";
import { HouseHeartFill } from "react-bootstrap-icons";

export default function Dashboard(props) {
  const drawerOpen = props.drawerOpen;
  const userData = useContext(UserContext);

  const useStyles = createStyles((theme) => ({
    text: {
      fontSize: theme.fontSizes.xl,
      [theme.fn.smallerThan("lg")]: {
        fontSize: theme.fontSizes.sm,
      },
    },
  }));
  const classes = useStyles();

  return (
    <>
      <Stack
        sx={{
          height: "100%",
          minHeight: "80rem",
          marginTop: 0,
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        <Grid ml={drawerOpen ? "23vw" : "3vw"}>
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              height: "38rem",
              display: "block",
              borderRadius: 25,
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
            p={15}
          >
            <Grid>
              <Grid.Col
                span={12}
                sx={{ display: "flex", height: "100%", width: "100%" }}
                pb={0}
                pt={10}
              >
                <Text size={"1.5rem"} weight={"semibold"} my={"1rem"}>
                  Dashboard
                </Text>
              </Grid.Col>
              <Grid.Col span={12} pt={0}>
                <Card
                  sx={{
                    display: "block",
                    borderRadius: "1rem",
                    height: "100%",
                    width: "100%",
                  }}
                  p={0}
                >
                  <DashboardCalendar user={userData} drawerOpen={drawerOpen} />
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid>
        <Box ml={drawerOpen ? "23vw" : "3vw"} mb={"3rem"} height="100%">
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              background: neighbourgoodTheme.colors.lightGray,
              minHeight: 280,
              height: "100%",
              borderRadius: "1rem",
            }}
            p={0}
          >
            <OverallChats />
          </Card>
        </Box>
      </Stack>
    </>
  );
}
