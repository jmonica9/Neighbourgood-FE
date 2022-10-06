import React, { useState } from "react";
//import styling
import { Card, Grid, Paper, Text } from "@mantine/core";

export default function Dashboard(props) {
  const drawerOpen = props.drawerOpen;

  return (
    <div>
      <Grid ml={drawerOpen ? "26vw" : "6vw"}>
        <Card
          sx={{
            width: drawerOpen ? "70vw" : "90vw",
            backgroundColor: "#d9d9d9",
            height: "30vh",
            display: "flex",
            borderRadius: 25,
          }}
        >
          Friend's Listings
          {/* Contents in here */}
        </Card>
      </Grid>
      <br />
      <Grid ml={drawerOpen ? "26vw" : "6vw"}>
        <Card
          sx={{
            width: drawerOpen ? "70vw" : "90vw",
            backgroundColor: "#d9d9d9",
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
              <Card sx={{ height: "56vh", display: "flex", borderRadius: 25 }}>
                Calendar
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
