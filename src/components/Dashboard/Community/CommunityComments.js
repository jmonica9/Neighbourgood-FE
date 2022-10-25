import {
  Stack,
  Grid,
  Textarea,
  Button,
  Text,
  Avatar,
  Badge,
} from "@mantine/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants";
import { UserContext } from "../../../App";
import { neighbourgoodTheme } from "../../../styles/Theme";
import { useNavigate } from "react-router-dom";

export default function CommunityComments(props) {
  const [comment, setComment] = useState("");
  const [commentsInfo, setCommentsInfo] = useState();

  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getCommentsInfo();
  }, [props]);

  const submitComment = async () => {
    if (comment !== "") {
      const addComment = await axios.post(
        `${BACKEND_URL}/post/${props.post._id}/comment`,
        {
          senderId: user._id,
          comment: comment,
        }
      );
      console.log(addComment);
    }
    setComment("");
    props.refreshPost();
  };
  const getCommentsInfo = async () => {
    let info = [];
    props.post.postUserComments.forEach(async (comment) => {
      const userData = await axios.get(
        `${BACKEND_URL}/users/${comment.senderId}`
      );
      info.push({
        ...comment,
        senderUsername: userData.data.username,
        senderPic: userData.data.cloudimg?.url,
      });
      if (info.length == props.post.postUserComments.length) {
        console.log(info);
        setCommentsInfo(info);
      }
    });
  };

  const showComments = () => {
    if (commentsInfo && commentsInfo.length > 0) {
      const commentList = commentsInfo.map((comment) => {
        return (
          <Grid mb={"0.05em"} p={0}>
            <Avatar
              src={user?.cloudimg?.url}
              size={24}
              radius={25}
              mr={"0.25em"}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/${comment.senderUsername}`)}
            />
            <Text size={"sm"} color={neighbourgoodTheme.colors.darkGray}>
              {comment.senderUsername}
            </Text>

            <Text size={"sm"}>: {comment.comment}</Text>
          </Grid>
        );
      });
      return commentList;
    }
  };
  return (
    <Stack spacing={"xs"}>
      {props.post.postUserComments.length > 0 ? showComments() : null}
      <Grid>
        <Grid.Col span={10} pr={0}>
          <Textarea
            radius="lg"
            placeholder="Add Comment"
            p={"1em"}
            pl={0}
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
