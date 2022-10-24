import React, { useEffect, useState } from "react";
import axios from "axios";
import { Convert } from "mongo-image-converter";
import {
  Modal,
  Button,
  Group,
  TextInput,
  MultiSelect,
  Textarea,
  FileInput,
  NumberInput,
} from "@mantine/core";
import { BACKEND_URL } from "../../constants";
import { useParams, useLocation } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { UploadIcon } from "@radix-ui/react-icons";
export default function NewListing(props) {
  const [userData, setUserData] = useState(props.user);
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageString, setImageString] = useState("");
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState(null);
  const [description, setDescription] = useState();
  const [depositAmount, setDepositAmount] = useState(1);
  const [listingCategories, setListingCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setOpened(props.openModal);
    setUserData(props.user);
  }, [props]);
  //convert image to string
  let imageData;
  let type = location.pathname.split("/")[1];
  const convertImage = async (event) => {
    try {
      const convertedImage = await Convert(imageFile);
      if (convertedImage) {
        console.log(convertedImage);
        imageData = convertedImage;
        setImageString(convertedImage);
      } else {
        toast.error(
          "Error! The file is not in format of image/jpeg or image/png",
          {
            position: "top-right",
            autoClose: 4500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );
        console.log("The file is not in format of image/jpeg or image/png");
      }
    } catch (error) {
      console.warn(error.message);
    }
  };

  const closeModal = () => {
    setTitle("");
    setFileInputFile();
    setFileInputValue();
    setListingCategories([]);
  };

  const submitListing = async (e) => {
    e.preventDefault();
    await convertImage(e);
    props.setLoading(true);
    console.log(userData, "userData");
    console.log(imageData, "imageData from submit");
    // console.log(imageString, "imagestring from submit");
    //title, image, categories, description, type
    const response = await axios.post(`${BACKEND_URL}/listing`, {
      userId: userData._id,
      username: userData.username,
      title: title,
      image: imageData,
      categories: listingCategories,
      description: description,
      depositAmount: depositAmount,
      location: userData.location,
      type: type,
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
    props.setLoading(false);
    console.log(response.data);
    setTitle("");
    setImageFile("");
    setListingCategories([]);
    setDescription("");
  };

  return (
    <>
      <Modal
        opened={props.openModal}
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
          {/* <FileInput
            label="Upload Image"
            icon={<UploadIcon />}
            onClick={(e) => console.log("try upload")}
            onChange={(e) => {
              console.log("try");
              setFileInputValue(e.name);
              setFileInputFile(e);
            }}
          /> */}
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {/* <input
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
          <input
            type="file"
            value={imageFile}
            onChange={(e) => setImageFile(e.target.files[0])}
          /> */}

          <MultiSelect
            data={props.categoriess}
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

          {type == "lending" ? (
            <NumberInput
              label="Deposit Amount ($SGD)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e)}
            />
          ) : null}

          <Button type="submit" radius={"xl"} mt={"xs"}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
