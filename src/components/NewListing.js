import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Group,
  TextInput,
  MultiSelect,
  Textarea,
  FileInput,
} from "@mantine/core";
import { BACKEND_URL } from "../constants";
import { useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
export default function NewListing(props) {
  const [userData, setUserData] = useState(props.user);
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [description, setDescription] = useState();
  const [listingCategories, setListingCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setOpened(props.openModal);
    setUserData(props.user);
  }, [props]);

  // categories
  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];
  const closeModal = () => {
    setTitle("");
    setFileInputFile();
    setFileInputValue();
    setListingCategories([]);
  };

  const submitListing = async (e) => {
    e.preventDefault();
    //title, image, categories, description, type
    const response = await axios.post(`${BACKEND_URL}/listing`, {
      userId: userData._id,
      username: userData.username,
      title: title,
      image:
        "https://images.unsplash.com/photo-1615486363973-f79d875780cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
      categories: listingCategories,
      description: description,
      type: location.pathname.split("/")[1],
    });

    toast.success("You have created a new listing!", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    props.closeNewModal();
    closeModal();
    console.log(response.data);
    setTitle("");
    setListingCategories([]);
    setDescription("");
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          props.closeNewModal();
        }}
        title={`Add New ${props.type} Listing!`}
      >
        {/* Modal content */}
        <form onSubmit={submitListing}>
          <TextInput
            placeholder="Title"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FileInput
            label="Listing Image"
            placeholder={fileInputFile}
            onChange={(e) => setFileInputValue(e.name)}
          />
          <MultiSelect
            data={data}
            label="Listing Category"
            required
            onChange={(e) => {
              setListingCategories(e);
            }}
          />
          <Textarea
            label={`Description of ${props.type} Listing`}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" radius={"xl"} mt={"xs"}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
