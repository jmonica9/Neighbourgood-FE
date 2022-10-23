import {
  Button,
  Grid,
  Textarea,
  Stack,
  Text,
  Badge,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { BACKEND_URL } from "../../constants";
import { neighbourgoodTheme } from "../../styles/Theme";

export default function ListingCommentsDisplay(props) {
  let commentsInfo = props.comments;
  const navigate = useNavigate();
  let commentList = commentsInfo.map((comment) => {
    // if (Object.keys(comment).includes("userInfo")) {
    // console.log("key true");
    return (
      <Grid key={comment._id}>
        <Badge
          p={0}
          sx={{
            paddingLeft: 0,
            backgroundColor: "transparent",
          }}
          ml={"1.5em"}
          size="lg"
          color="teal"
          leftSection={
            <Avatar
              src={comment.userInfo?.cloudimg?.url}
              size={24}
              radius={25}
              onClick={() => navigate(`/user/${comment.userInfo.username}`)}
              sx={{ cursor: "pointer" }}
            />
          }
        >
          <Text size={"sm"}>{comment.userInfo.username}</Text>
        </Badge>

        <Text size={"sm"}>: {comment.comment}</Text>
      </Grid>
    );
  });

  return <>{commentList}</>;
}
