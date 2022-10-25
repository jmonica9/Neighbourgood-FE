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
  Text,
  NumberInput,
} from "@mantine/core";
import { BACKEND_URL } from "../../constants";
import {
  useParams,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useStyles } from "../../Authentication";
import { toast, ToastContainer } from "react-toastify";
import { UploadIcon } from "@radix-ui/react-icons";
export default function NewListing(props) {
  const { classes } = useStyles();
  const [titleError, setTitleError] = useState();
  //  const [categoriesError,set]=useState();
  const [descriptionError, setDescriptionError] = useState();
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
  const [inputError, set] = useState();
  const navigate = useNavigate();
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
          "Error! Please choose a file that is in the format of image/jpeg or image/png",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );
        console.log("The file is not in format of image/jpeg or image/png");
        navigate(-1);
        return;
      }
    } catch (error) {
      console.warn(error.message);
      toast.error(
        "Error! Please choose a file that is in the format of image/jpeg or image/png",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
      navigate(-1);
      return;
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
    // if (imageFile === null) {
    //   toast.error(
    //     "Error! Please choose a file that is in the format of image/jpeg or image/png",
    //     {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: false,
    //       progress: undefined,
    //     }
    //   );
    //   navigate(-1);
    // }
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
            // error={titleError ? "Invalid Title" : null}
          />
          {titleError ? (
            <Text className={classes.icon}>Invalid Title </Text>
          ) : null}
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
          {descriptionError ? (
            <Text className={classes.icon}>Invalid Description </Text>
          ) : null}
          {type == "lending" ? (
            <NumberInput
              label="Deposit Amount ($SGD)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e)}
            />
          ) : null}

          <Button
            disabled={imageFile === null}
            type="submit"
            radius={"xl"}
            mt={"xs"}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
