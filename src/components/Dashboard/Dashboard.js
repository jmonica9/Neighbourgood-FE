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
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import DashboardFriendsListings from "./DashboardFriendsListings";
import { UserContext } from "../../App";
import DashboardReviews from "./DashboardReviews";

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
        spacing={"1vh"}
        sx={{ height: "100%", marginTop: 10, paddingTop: 10 }}
      >
        <Grid ml={drawerOpen ? "23vw" : "3vw"} mb={"2vh"}>
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              minHeight: 280,
              height: "35vh",
              display: "block",
              borderRadius: 25,
            }}
            p={15}
          >
            {/* <Text
              align="left"
              size={25}
              weight={"semibold"}
              classNames={classes.text}
            >
              Friend's Listings
            </Text> */}
            {/* Contents in here */}
            <DashboardFriendsListings user={userData} />
          </Card>
        </Grid>

        <Grid ml={drawerOpen ? "23vw" : "3vw"}>
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              height: "62.5vh",
              display: "block",
              borderRadius: 25,
            }}
            p={15}
          >
            <Grid>
              <Grid.Col span={12} sx={{ display: "flex" }} pb={0} pt={10}>
                <Text size={25} weight={"semibold"}>
                  Dashboard
                </Text>
              </Grid.Col>
              <Grid.Col span={12} pt={0} pb={0}>
                <Card
                  sx={{
                    display: "block",
                    borderRadius: 25,
                    height: "100%",
                  }}
                  // sx={{ height: "54vh", display: "block", borderRadius: 25 }}
                  // mb={"1vh"}
                  p={0}
                >
                  {/* <Stack> */}
                  {/* <ScrollArea
                    style={{ height: "35rem", padding: 0 }}
                    // style={{ height: "20rem", padding: 0 }}
                    offsetScrollbars
                  > */}
                  <DashboardCalendar user={userData} />
                  {/* </ScrollArea> */}

                  {/* </Stack> */}
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid>
      </Stack>
    </>
  );
}
