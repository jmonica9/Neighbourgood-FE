import {
  createStyles,
  Text,
  Avatar,
  Group,
  Container,
  Grid,
  Card,
  CardSection,
  ScrollArea,
  Image,
} from "@mantine/core";
import { UserContext } from "../App";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants";
const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));
// {
//     requestorId: { type: String, required: true },
//     ownerId: { type: String, required: true },
//     reviewText: { type: String },
//     type: { type: String },
//   },
export default function ReviewDetails(props) {
  const { classes } = useStyles();
  const userData = useContext(UserContext);

  useEffect(() => {
    console.log(props.review);
  }, [props]);

  return (
    <div>
      <div
        style={{
          marginLeft: props.drawerOpen ? "26vw" : "6vw",
          marginRight: "4vw",
          marginTop: "0.5vw",
          color: "black",
          // height: "100%",
        }}
      >
        {/* <Text size="xl" weight={500} color="black" align="center" mb={50}>
          {props.review.listingTitle}
        </Text> */}
        <Grid grow align="center" width="100%">
          <Avatar
            src={props.review.user.cloudimg?.url}
            alt={"img"}
            radius="xl"
          />
          <div>
            <Text size="sm">{props.review.user.username}</Text>
            <Text size="xs" color="dimmed">
              {new Date(props.review.createdAt).toLocaleString(undefined, {
                dateStyle: "short",
              })}
              {/* {props.review.createdAt.toISOString()} */}
            </Text>
          </div>

          <Text className={classes.body} size="sm" color="black" mb={"1.5rem"}>
            {props.review.reviewText}
          </Text>
        </Grid>
        {/* <Grid grow align="center" width="100%">
          <Avatar
            src={props.review.user.cloudimg?.url}
            alt={"img"}
            radius="xl"
          />
          <div>
            <Text size="sm">{props.review.user.username}</Text>
            <Text size="xs" color="dimmed">
              {new Date(props.review.createdAt).toLocaleString(undefined, {
                dateStyle: "short",
              })}
            
            </Text>
          </div>

          <Text className={classes.body} size="sm" color="black" mb={"1.5rem"}>
            {props.review.reviewText}
          </Text>
        </Grid> */}
        {/* <Group mt={30}>
          <Avatar
            src={"https://www.w3schools.com/howto/img_avatar.png"}
            alt={"img"}
            radius="xl"
          />

          <Text size="sm">{"BOB"}</Text>
          <Text size="xs" color="dimmed">
           Posted at: test-date-fromBE
          </Text>
        </Group>
        <Text className={classes.body} ml={3.3} size="sm" color="black">
          {
            "Bob[Receiver]: Ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets"
          }
        </Text> */}
      </div>
    </div>
  );
}
