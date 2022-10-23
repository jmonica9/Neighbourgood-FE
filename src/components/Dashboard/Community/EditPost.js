import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  MultiSelect,
  Text,
  Textarea,
  Button,
  TextInput,
  FileInput,
} from "@mantine/core";
import { BACKEND_URL } from "../../../constants";
import axios from "axios";
import { UserContext } from "../../../App";
import { UploadIcon } from "@radix-ui/react-icons";

export default function EditPost(props) {
  const [opened, setOpened] = useState(false);
  const [postTitle, setPostTitle] = useState(props.post.postTitle);
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [imageDataString, setImageDataString] = useState();
  const [postCategories, setPostCategories] = useState(
    props.post.postCategories
  );
  const [postDescription, setPostDescription] = useState(
    props.post.postDescription
  );

  const user = useContext(UserContext);

  useEffect(() => {
    setOpened(props.opened);
    setPostTitle(props.post.postTitle);
    setPostCategories(props.post.postCategories);
    setPostDescription(props.post.postDescription);
  }, [props]);

  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];

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
  const submitEdit = async () => {
    const post = await axios.put(`${BACKEND_URL}/post/${props.post._id}`, {
      title: postTitle,
      image: imageDataString,
      categories: postCategories,
      description: postDescription,
    });
    console.log(post);
    if (post.status === 200) {
      // TOASTIFY HERE
      refreshFields();
      props.refreshPost();
      props.closed();
    }
  };

  const refreshFields = () => {
    setPostTitle("");
    setFileInputFile();
    setFileInputValue();
    setImageDataString();
    setPostCategories([]);
    setPostDescription("");
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => {
        setOpened(false);
        props.closed();
        refreshFields();
      }}
      title="Edit Community Post"
      closeOnClickOutside
    >
      <TextInput
        label="Title"
        value={postTitle}
        onChange={(e) => {
          setPostTitle(e.target.value);
        }}
      />
      <FileInput
        label="Upload Profile Picture"
        icon={<UploadIcon />}
        onChange={(e) => {
          console.log(e);
          setFileInputValue(e.name);
          setFileInputFile(e);
          convertImage(e);
        }}
      />
      <MultiSelect
        data={data}
        value={postCategories}
        label="Category"
        onChange={(e) => {
          console.log(e);
          setPostCategories(e);
        }}
      />
      <Textarea
        label="Description"
        value={postDescription}
        onChange={(e) => {
          setPostDescription(e.target.value);
        }}
      />
      <Button
        mt={"1em"}
        onClick={() => {
          submitEdit();
        }}
      >
        Submit
      </Button>
    </Modal>
  );
}
