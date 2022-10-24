import {
  Button,
  Grid,
  Textarea,
  Stack,
  Text,
  Badge,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { BACKEND_URL } from "../../constants";
import { neighbourgoodTheme } from "../../styles/Theme";

export default function ListingComments(props) {
  const [comment, setComment] = useState("");
  const [listingComments, setListingComments] = useState();
  const [commentsInfo, setCommentsInfo] = useState();

  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getListingComments();
  }, []);

  useEffect(() => {
    console.log(commentsInfo);
  }, [commentsInfo]);

  //this works as well - backend eager loading
  // const getListingComments = async () => {
  //   const comments = await axios.get(
  //     `${BACKEND_URL}/listing/comment/${props.listing._id}`
  //   );
  //   console.log(comments);
  //   setCommentsInfo(comments.data);
  // };

  let commentDetails = [];

  const getListingComments = async () => {
    console.log("commentsInfo:", commentsInfo);
    const comments = await axios.get(
      `${BACKEND_URL}/listing/single/${props.listing._id}`
    );
    let comms = comments.data.comment;
    comms.forEach(async (comment) => {
      const user = await axios.get(`${BACKEND_URL}/users/${comment.senderId}`);
      commentDetails.push(Object.assign(comment, { userInfo: user.data }));
      if (commentDetails.length === comments.data.comment.length) {
        setCommentsInfo(commentDetails);
      }
    });

    // console.log("commentsInfo:", commentsInfo);
  };

  const submitComment = async (e) => {
    // e.preventDefault();
    if (comment !== "") {
      await axios
        .post(`${BACKEND_URL}/listing/comment/${props.listing._id}`, {
          senderId: user._id,
          comment: comment,
        })
        .then(() => getListingComments());
    }
  };

  let commentsInfoSorted =
    commentsInfo &&
    commentsInfo.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  console.log(commentsInfoSorted);

  let showComments =
    commentsInfo !== undefined &&
    commentsInfoSorted.map((comment, index) => {
      // if (Object.keys(comment).includes("userInfo")) {
      // console.log("key true");
      return (
        <Grid key={index} mt={"0.5em"} m={0}>
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

  return (
    <Stack>
      <ScrollArea style={{ height: "10em" }} offsetScrollbars>
        {commentsInfo !== undefined ? commentsInfo && showComments : null}
      </ScrollArea>

      <Grid>
        <Grid.Col span={10} pr={0}>
          <Textarea
            radius="lg"
            placeholder="Add Comment"
            p={"1em"}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </Grid.Col>
        <Grid.Col
          span={2}
          sx={{ display: "flex", alignItems: "center" }}
          pl={0}
        >
          <Button
            onClick={(e) => {
              submitComment(e);
              setComment("");
            }}
          >
            Send
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
