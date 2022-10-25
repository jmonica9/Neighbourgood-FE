import {
  Button,
  Card,
  Grid,
  Image,
  Text,
  ScrollArea,
  Group,
  Avatar,
} from "@mantine/core";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants";
import { neighbourgoodTheme } from "../../../styles/Theme";
import AddPost from "./AddPost";
import PostModal from "./PostModal";
import { UserContext } from "../../../App";
import { formatDistanceToNow } from "date-fns";

export default function CommunityPosts() {
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsInfo, setPostsInfo] = useState([]);
  const [selectedPostOpen, setSelectedPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState();

  const user = useContext(UserContext);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [posts]);

  const getPosts = async () => {
    const returnedPosts = await axios.get(`${BACKEND_URL}/post`);
    console.log(returnedPosts.data);
    setPosts(returnedPosts.data);

    if (selectedPost) {
      const thePost = returnedPosts.data.filter(
        (post) => post._id === selectedPost._id
      );
      console.log(thePost);
      setSelectedPost(thePost);
      getUserInfo();
    }
  };

  const getUserInfo = async () => {
    if (posts && posts.length > 0) {
      let info = [];
      posts.forEach(async (post) => {
        const userData = await axios.get(`${BACKEND_URL}/users/${post.userId}`);
        info.push({
          ...post,
          username: userData.data.username,
          userPic: userData.data.cloudimg?.url,
        });
        if (info.length == posts.length) {
          setPostsInfo(info);
        }
      });
    }
  };

  const addPostClosed = () => {
    setAddPostOpen(false);
    getPosts();
  };
  const closeSelectedPostModal = () => {
    setSelectedPostOpen(false);
    setSelectedPost();
    console.log("closing");
  };

  //Likes and Comments
  const updateLikes = async (post) => {
    if (!post.postUsersLiked.includes(user._id)) {
      console.log("like");
      const like = await axios.post(
        `${BACKEND_URL}/post/${post._id}/like/add`,
        {
          userId: user._id,
        }
      );
      console.log(like);
    } else {
      console.log("unlike");
      const unlike = await axios.post(
        `${BACKEND_URL}/post/${post._id}/like/remove`,
        {
          userId: user._id,
        }
      );
      console.log(unlike);
    }
    getPosts();
    // await getPosts(post._id);
    // console.log(posts);
  };

  const showPosts = () => {
    const postList = postsInfo.map((post) => {
      return (
        <Card
          sx={{
            backgroundColor: neighbourgoodTheme.colors.lightGray,
            borderRadius: 25,
          }}
          mb={"0.5em"}
        >
          <Grid>
            <Grid sx={{ width: "100%" }}>
              {/* <Grid.Col span={3}>
                <Avatar src={post.userPic} size={24} radius={25} />
              </Grid.Col> */}
              <Grid.Col span={5}>
                <Text size="xs" align="left">
                  @{post.username}
                </Text>
              </Grid.Col>
              <Grid.Col span={7}>
                <Text size="xs" align="right">
                  <Text size={"xs"}>
                    {formatDistanceToNow(Date.parse(post.createdAt))} ago
                  </Text>
                </Text>
              </Grid.Col>
            </Grid>
            <Image
              alt=""
              src={post.cloudimg.url}
              sx={{ height: "100%", width: "auto", cursor: "pointer" }}
              onClick={() => {
                setSelectedPostOpen(true);
                setSelectedPost(post);
                console.log(post);
              }}
            />

            <Grid.Col span={8}>
              <Text size="xs" align="left">
                {post.postTitle}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Group>
                <>
                  {user &&
                  post.postUsersLiked.length > 0 &&
                  post.postUsersLiked.includes(user._id) ? (
                    <HeartFilledIcon
                      onClick={() => {
                        updateLikes(post);
                      }}
                    />
                  ) : (
                    <HeartIcon
                      onClick={() => {
                        updateLikes(post);
                      }}
                    />
                  )}

                  <Text size={"xs"}>{post.postUsersLiked.length}</Text>
                </>
              </Group>
            </Grid.Col>
          </Grid>
          {/* {selectedPost ? (
            <PostModal
              post={selectedPost}
              opened={selectedPostOpen}
              closed={() => closeSelectedPostModal()}
              updateLikes={() => {
                updateLikes(selectedPost);
              }}
            />
          ) : null} */}
        </Card>
      );
    });
    return postList;
  };

  return (
    <div>
      <ScrollArea style={{ height: "45vh" }} m={"1vh"}>
        {showPosts()}
      </ScrollArea>

      <Button radius={"xl"} onClick={() => setAddPostOpen(true)}>
        Add Post
      </Button>
      <AddPost opened={addPostOpen} closed={addPostClosed} />
      {selectedPost ? (
        <PostModal
          post={selectedPost}
          opened={selectedPostOpen}
          closed={() => closeSelectedPostModal()}
          updateLikes={(selectedPost) => {
            updateLikes(selectedPost);
          }}
          refreshAllPosts={() => getPosts()}
        />
      ) : null}
    </div>
  );
}
