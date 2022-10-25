import {
  Modal,
  TextInput,
  FileInput,
  Textarea,
  MultiSelect,
  Button,
} from "@mantine/core";
import { UploadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import { BACKEND_URL } from "../../../constants";

export default function AddPost(props) {
  const [opened, setOpened] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState();
  const [imageDataString, setImageDataString] = useState();
  const [postCategories, setPostCategories] = useState([]);
  const [postDescription, setPostDescription] = useState("");

  const user = useContext(UserContext);

  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];

  useEffect(() => {
    setOpened(props.opened);
  }, [props]);

  const refreshFields = () => {
    setPostTitle("");
    setFileInputFile();
    setFileInputValue();
    setImageDataString();
    setPostCategories([]);
    setPostDescription("");
  };

  let imageData;
  const convertImage = async (e) => {
    const reader = new FileReader();
    console.log(e);
    reader.readAsDataURL(e);
    reader.onloadend = () => {
      setImageDataString(reader.result);
      console.log(imageDataString);
    };
  };
  const submitPost = async () => {
    const post = await axios.post(`${BACKEND_URL}/post`, {
      userId: user._id,
      title: postTitle,
      image: imageDataString,
      categories: postCategories,
      description: postDescription,
      username: user.username,
      userPic: user.cloudimg.url,
    });
    console.log(post);
    if (post.status === 200) {
      // TOASTIFY HERE
      refreshFields();
      props.closed();
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => {
        setOpened(false);
        props.closed();
        refreshFields();
      }}
      title="Add Community Post"
      closeOnClickOutside
    >
      <TextInput
        label="Title"
        required
        onChange={(e) => {
          setPostTitle(e.target.value);
        }}
      />
      <FileInput
        label="Upload Profile Picture"
        icon={<UploadIcon />}
        required
        onChange={(e) => {
          console.log(e);
          setFileInputValue(e.name);
          setFileInputFile(e);
          convertImage(e);
        }}
      />
      <MultiSelect
        data={data}
        label="Category"
        required
        onChange={(e) => {
          console.log(e);
          setPostCategories(e);
        }}
      />
      <Textarea
        label="Description"
        required
        onChange={(e) => {
          setPostDescription(e.target.value);
        }}
      />
      <Button
        mt={"1em"}
        disabled={
          postTitle === "" || postDescription === "" || fileInputFile === null
        }
        onClick={() => {
          submitPost();
        }}
      >
        Submit
      </Button>
    </Modal>
  );
}
