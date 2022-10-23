import { useContext, useEffect, useState } from "react";

import {
  Modal,
  Button,
  Group,
  TextInput,
  MultiSelect,
  Avatar,
  FileInput,
} from "@mantine/core";
import { UploadIcon } from "@radix-ui/react-icons";
import { UserContext } from "../../App";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { socket } from "../../App";
import { width } from "@mui/system";

export default function EditProfileModal(props) {
  const [opened, setOpened] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [accountsFollowing, setAccountsFollowing] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState();
  const [imageDataString, setimageDataString] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    setOpened(props.opened);
    console.log(user);
  }, [props]);

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setAccountsFollowing(user.accountsFollowing);

    if (user.accountsFollowing.length > 0) {
      user.accountsFollowing.forEach(async (account) => {
        const response = await axios.get(`${BACKEND_URL}/users/${account}`);
        const username = response.data.username;
        setFollowingData([
          ...followingData,
          { value: account, label: username },
        ]);
      });
    }
  }, []);

  const convertImage = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onloadend = () => {
      setimageDataString(reader.result);
      console.log(imageDataString);
    };
  };

  const submitEdit = async () => {
    const response = await axios.put(`${BACKEND_URL}/users/${user._id}`, {
      username: username,
      email: email,
    });
    console.log(response);
    if (fileInputFile) {
      const uploadImage = await axios.post(
        `${BACKEND_URL}/users/${user._id}/profilepicture`,
        { file: imageDataString }
      );
      console.log(uploadImage);
    }
    setOpened(false);
    props.closeModal();
    // lift up state to recheck JWT to refresh user data
    // fire off socket to App.js to call checkJWT function
    socket.emit("user updated", () => {
      console.log("emitting data");
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          props.closeModal();
          setOpened(false);
        }}
        title="Edit Profile"
      >
        <Avatar
          src={`${user.cloudimg?.url}`}
          alt="userprofile"
          radius={"50%"}
          sx={{ height: "20vh", width: "20vh" }}
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

        <TextInput
          label="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button
          onClick={() => {
            submitEdit();
          }}
        >
          Submit
        </Button>
      </Modal>

      {/* <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group> */}
    </>
  );
}
