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
import React, { useContext, useState } from "react";
import { BACKEND_URL } from "../../../constants";
import { UserContext } from "../../../App";
import { neighbourgoodTheme } from "../../../styles/Theme";
import { useNavigate } from "react-router-dom";

export default function CommunityComments(props) {
  const [comment, setComment] = useState("");

  const user = useContext(UserContext);
  const navigate = useNavigate();

  const submitComment = async () => {
    if (comment !== "") {
      const addComment = await axios.post(
        `${BACKEND_URL}/post/${props.post._id}/comment`,
        {
          senderId: user._id,
          senderUsername: user.username,
          senderPic: user.cloudimg.url,
          comment: comment,
        }
      );
      console.log(addComment);
    }
    setComment("");
    props.refreshPost();
  };

  const showComments = () => {
    const commentList = props.post.postUserComments.map((comment) => {
      return (
        <Grid mb={"0.05em"} p={0}>
          {/* <Badge
            p={0}
            sx={{
              paddingLeft: 0,
              backgroundColor: neighbourgoodTheme.colors.lightGray,
            }}
            mb={"0.5em"}
            ml={"1.5em"}
            pr={"0.5em"}
            size="lg"
            color="teal"
            leftSection={
              <Avatar src={comment.senderPic} size={24} radius={25} />
            }
          >
            <Text size={"sm"} color={neighbourgoodTheme.colors.darkGray}>
              {comment.senderUsername}
            </Text>
          </Badge> */}
          <Avatar
            src={comment.senderPic}
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
