import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { toast, ToastContainer } from "react-toastify";
import { UploadIcon } from "@radix-ui/react-icons";
import { socket } from "../../App";
import {
  Modal,
  Button,
  Group,
  MultiSelect,
  Textarea,
  TextInput,
  FileInput,
} from "@mantine/core";

export default function EditListing(props) {
  const [opened, setOpened] = useState(props.opened);
  const [title, setTitle] = useState(props.listing.title);
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [imageFile, setImageFile] = useState();
  const [listingCategories, setListingCategories] = useState(
    props.listing.categories
  );
  const [description, setDescription] = useState(props.listing.description);
  const [imageDataString, setImageDataString] = useState("");

  useEffect(() => {
    setOpened(props.opened);
  }, [props]);

  const data = [
    { value: "Kitchen Appliances", label: "Kitchen Appliances" },
    { value: "Electronics", label: "Electronics" },
    { value: "Clothes and Wearables", label: "Clothes and Apparel" },
    { value: "Personal Care", label: "Personal Care" },
    { value: "Furniture", label: "Furniture" },
    { value: "Toys", label: "Toys" },
    { value: "Hobby", label: "Hobby" },
    { value: "Others", label: "Others" },
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

  const submitListing = async () => {
    if (imageDataString) {
      const response = await axios.post(
        `${BACKEND_URL}/listing/edit/${props.listing._id}`,
        {
          title: title,
          image: imageDataString,
          categories: listingCategories,
          description: description,
          type: props.listing.type,
        }
      );
      console.log(response.data);
    } else {
      const response = await axios.post(
        `${BACKEND_URL}/listing/edit/${props.listing._id}`,
        {
          title: title,
          categories: listingCategories,
          description: description,
          type: props.listing.type,
        }
      );
      console.log(response.data);
    }
    // socket.emit("listing updated", () => {
    //   console.log("emitting data");
    // });

    toast.success("Listing Successfully Edited", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    props.closed();
    props.update();
    setTitle("");
    setImageFile("");
    setListingCategories([]);
    setDescription("");
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          props.closed();
        }}
        title="Edit Listing"
      >
        <TextInput
          placeholder="Title"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
        />
        <FileInput
          label="Upload Image"
          icon={<UploadIcon />}
          onChange={(e) => {
            console.log(e);
            setFileInputValue(e.name);
            setFileInputFile(e);
            convertImage(e);
          }}
        />
        {/* <input
          type="file"
          onChange={(e) => {
            setImageFile(e.target.files[0]);
            convertImage(e);
          }}
        /> */}

        <MultiSelect
          data={data}
          label="Listing Category"
          value={listingCategories}
          required
          onChange={(e) => {
            setListingCategories(e);
          }}
        />
        <Textarea
          label={`Description of ${props.type} Listing`}
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          type="submit"
          radius={"xl"}
          mt={"xs"}
          onClick={() => submitListing()}
        >
          Submit
        </Button>
      </Modal>
    </>
  );
}
