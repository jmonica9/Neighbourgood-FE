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
import { UserContext } from "../App";
import { BACKEND_URL } from "../constants";
import { neighbourgoodTheme } from "../styles/Theme";

export default function ListingComments(props) {
  const [comment, setComment] = useState("");
  const [listingComments, setListingComments] = useState();
  const [commentList, setCommentList] = useState([]);

  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getListingComments();
  }, []);

  const getListingComments = async () => {
    const comments = await axios.get(
      `${BACKEND_URL}/listing/single/${props.listing._id}`
    );
    console.log(comments.data.comment);
    setListingComments(comments.data.comment);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (comment !== "") {
      const addComment = await axios.post(
        `${BACKEND_URL}/listing/comment/${props.listing._id}`,
        {
          senderId: user._id,
          senderUsername: user.username,
          senderPic: user.cloudimg.url,
          comment: comment,
        }
      );
      console.log(addComment);
      getListingComments();

      // setComment("");
      // socket to update comments
    }
  };

  const showComments = () => {
    // console.log(props.listing.comment);
    let commentList = listingComments.map((comment) => {
      return (
        <Grid>
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
                src={comment.senderPic}
                size={24}
                radius={25}
                onClick={() => navigate(`/user/${comment.senderUsername}`)}
                sx={{ cursor: "pointer" }}
              />
            }
          >
            {/* <Avatar radius={25} src={comment.senderPic} /> */}
            <Text size={"sm"}>{comment.senderUsername}</Text>
          </Badge>

          <Text size={"sm"}>: {comment.comment}</Text>
        </Grid>
      );
    });
    return commentList;
  };

  return (
    <Stack>
      {listingComments && listingComments.length > 0 ? showComments() : null}
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
              setComment(""); // not working?
            }}
          >
            Send
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
