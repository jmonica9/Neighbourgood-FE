import { Card, Grid, Image, ScrollArea, Text } from "@mantine/core";
import React, { useState } from "react";
import { neighbourgoodTheme } from "../styles/Theme";

export default function DashboardFriendsListings() {
  const friendsListings = [
    {
      userId: "User 1",
      title: "Sharing Listing Title",
      type: "Sharing",
      category: "",
      image:
        "https://images.unsplash.com/photo-1665344287455-d28131b732b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      reserved: false,
      dateOfTransaction: "",
    },
    {
      userId: "User 2",
      title: "Helping Listing Title",
      type: "Helping",
      category: "",
      image:
        "https://images.unsplash.com/photo-1665141530020-6df603c446c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      reserved: false,
      dateOfTransaction: "",
    },
    {
      userId: "User 2",
      title: "Lending Listing Title",
      type: "Lending",
      category: "",
      image:
        "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      reserved: false,
      dateOfTransaction: "",
    },
    {
      userId: "User 3",
      title: "Helping Listing Title",
      type: "Helping",
      category: "",
      image:
        "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      reserved: false,
      dateOfTransaction: "",
    },
    {
      userId: "User 3",
      title: "Lending Listing Title",
      type: "Lending",
      category: "",
      image:
        "https://images.unsplash.com/photo-1665329929710-644672e5b705?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      reserved: false,
      dateOfTransaction: "",
    },
  ];

  const displayFriendsListings = friendsListings.map((listing, index) => {
    let color;
    switch (listing.type) {
      case "Sharing":
        color = neighbourgoodTheme.colors.lightTeal;
        break;
      case "Helping":
        color = neighbourgoodTheme.colors.lightPurple;
        break;
      case "Lending":
        color = neighbourgoodTheme.colors.lightBrown;
        break;
      default:
        color = neighbourgoodTheme.colors.lightGray;
    }
    return (
      <Grid.Col span={3}>
        <Card sx={{ backgroundColor: color }}>
          <Text size={"sm"}>
            {index}: {listing.title}
          </Text>
          <Text size={"sm"}>By: {listing.userId}</Text>
          <Image src={listing.image} height={"15vh"} />
        </Card>
      </Grid.Col>
    );
  });
  return (
    <div>
      <ScrollArea style={{ width: "auto", height: "25vh" }}>
        <Grid>{displayFriendsListings}</Grid>
      </ScrollArea>
    </div>
  );
}
