import React, { useContext, useState } from "react";
import DashboardCalendar from "./DashboardCalendar";
//import styling
import { Card, Grid, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { neighbourgoodTheme } from "../styles/Theme";
import DashboardFriendsListings from "./DashboardFriendsListings";
import { UserContext } from "../App";

export default function Dashboard(props) {
  const drawerOpen = props.drawerOpen;
  const userData = useContext(UserContext);

  return (
    <div>
      <Grid ml={drawerOpen ? "26vw" : "6vw"}>
        <Card
          sx={{
            width: drawerOpen ? "70vw" : "90vw",
            backgroundColor: neighbourgoodTheme.colors.lightGray,
            height: "30vh",
            display: "block",
            borderRadius: 25,
          }}
        >
          <Text align="left">Friend's Listings</Text>
          {/* Contents in here */}
          <DashboardFriendsListings user={userData} />
        </Card>
      </Grid>
      <br />
      <Grid ml={drawerOpen ? "26vw" : "6vw"}>
        <Card
          sx={{
            width: drawerOpen ? "70vw" : "90vw",
            backgroundColor: neighbourgoodTheme.colors.lightGray,
            height: "65vh",
            display: "block",
            borderRadius: 25,
          }}
        >
          <Grid>
            <Grid.Col span={12} sx={{ display: "flex" }}>
              Dashboard
            </Grid.Col>
            <Grid.Col span={8}>
              <Card sx={{ height: "56vh", display: "block", borderRadius: 25 }}>
                <Stack>
                  <ScrollArea style={{ height: "40rem" }} offsetScrollbars>
                    <DashboardCalendar />
                  </ScrollArea>
                  <Text align="left">Calendar</Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card sx={{ height: "56vh", display: "flex", borderRadius: 25 }}>
                Reviews
              </Card>
            </Grid.Col>
          </Grid>
        </Card>
      </Grid>
    </div>
  );
}
