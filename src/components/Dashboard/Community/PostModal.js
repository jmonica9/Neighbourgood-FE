import {
  Avatar,
  Badge,
  Grid,
  Image,
  Modal,
  Text,
  Group,
  Stack,
  Button,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { UserContext } from "../../../App";
import axios from "axios";
import { BACKEND_URL } from "../../../constants";
import CommunityComments from "./CommunityComments";
import EditPost from "./EditPost";
import ProfileMenu from "../../Profile/ProfileMenu";

export default function PostModal(props) {
  const [opened, setOpened] = useState(props.opened);
  const [postInfo, setPostInfo] = useState(props.post);
  const [userInfo, setUserInfo] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);

  const user = useContext(UserContext);

  useEffect(() => {
    setOpened(props.opened);
    getPost();
    getUserInfo();
    console.log(props);
    console.log(props.post);
  }, [props]);

  // const loadPostData = async () => {
  //   await setPostInfo(props.post);
  // };

  const getPost = async () => {
    const updatedPost = await axios.get(`${BACKEND_URL}/post/${postInfo._id}`);
    setPostInfo(updatedPost.data);
    // props.refreshAllPosts();
  };

  const getUserInfo = async () => {
    const userData = await axios.get(`${BACKEND_URL}/users/${postInfo.userId}`);
    console.log(userData);
    setUserInfo(userData.data);
  };

  // const updateLikes = async (post) => {
  //   if (!props.post.postUsersLiked.includes(user._id)) {
  //     console.log("like");
  //     const like = await axios.post(
  //       `${BACKEND_URL}/post/${props.post._id}/like/add`,
  //       {
  //         userId: user._id,
  //       }
  //     );
  //     console.log(like);
  //   } else {
  //     console.log("unlike");
  //     const unlike = await axios.post(
  //       `${BACKEND_URL}/post/${props.post._id}/like/remove`,
  //       {
  //         userId: user._id,
  //       }
  //     );
  //     console.log(unlike);
  //   }
  // };

  const closeEditModal = () => {
    setOpenEditModal(false);
    props.refreshAllPosts();
  };

  const showCategories = () => {
    if (postInfo && postInfo.postCategories) {
      let categories = postInfo.postCategories.map((desc) => {
        return (
          <Badge>
            <Text color={"white"}>{desc}</Text>
          </Badge>
        );
      });
      return categories;
    }
  };
  console.log(postInfo);
  return (
    <div>
      {/* {postInfo && postInfo.postUsersLiked ? ( */}
      <Modal
        withCloseButton={false}
        opened={opened}
        onClose={() => {
          setOpened(false);
          props.closed();
        }}
        overlayOpacity={0.3}
      >
        <Grid>
          <Grid.Col span={8}>
            <Text>{postInfo.postTitle}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Group sx={{ justifyContent: "flex-end" }}>
              {postInfo.postUsersLiked &&
              postInfo.postUsersLiked.length > 0 &&
              postInfo.postUsersLiked.includes(user._id) ? (
                <HeartFilledIcon
                  onClick={() => {
                    props.updateLikes(postInfo);
                    getPost();
                  }}
                />
              ) : (
                <HeartIcon
                  onClick={() => {
                    props.updateLikes(postInfo);
                    getPost();
                  }}
                />
              )}

              <Text size="sm">
                {postInfo.postUsersLiked
                  ? postInfo.postUsersLiked.length
                  : null}
              </Text>
            </Group>
          </Grid.Col>
        </Grid>

        <Image alt="" src={postInfo.cloudimg?.url} />
        <Grid mt={"0.5em"} sx={{ justifyContent: "center" }}>
          <Grid.Col span={8}>{showCategories()}</Grid.Col>
          <Grid.Col span={4}>
            <Grid>
              <Grid.Col span={3}>
                <Avatar src={userInfo?.cloudimg?.url} size={24} radius={25} />
              </Grid.Col>
              <Grid.Col span={9}>
                <Text size="sm">{userInfo?.username}</Text>
              </Grid.Col>
              <ProfileMenu userId={postInfo.userId} />
            </Grid>
            {/* {props.post.postUsersLiked.includes(user._id) ? (
            <HeartFilledIcon
              onClick={() => {
                props.updateLikes(props.post);
              }}
            />
          ) : (
            <HeartIcon
              onClick={() => {
                props.updateLikes(props.post);
              }}
            />
          )} */}
          </Grid.Col>
        </Grid>
        <Stack>
          <Text size="sm" mt={"1.25em"}>
            {postInfo.postDescription}
          </Text>
          <CommunityComments post={postInfo} refreshPost={() => getPost()} />
          {postInfo.userId === user._id ? (
            <Button onClick={() => setOpenEditModal(true)}>Edit</Button>
          ) : null}
        </Stack>
        <EditPost
          opened={openEditModal}
          closed={() => closeEditModal()}
          post={postInfo}
          refreshPost={() => getPost()}
        />
      </Modal>
      {/* ) : null} */}
    </div>
  );
}
