import { Menu, Text, Button, Group } from "@mantine/core";
import { CheckIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { socket } from "../../App";
import ProfilePage from "./ProfilePage";

export default function ProfileMenu(props) {
  const [profileData, setProfileData] = useState();
  // const [profileListings, setProfileListings] = useState();
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getProfileData(props.userId);
    // getUserListings(props.userId);
  }, []);

  const getProfileData = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/users/${id}`);
    setProfileData(response.data);
  };
  // const getUserListings = async (id) => {
  //   const response = await axios.get(`${BACKEND_URL}/listing/user/${id}`);
  //   console.log(response.data);
  //   setProfileListings(response.data);
  // };

  const updateFriend = async (action) => {
    console.log(user._id);
    const response = await axios.post(
      `${BACKEND_URL}/users/${user._id}/updateFriend`,
      {
        friendId: props.userId,
        action: action,
      }
    );
    console.log(response.data);
    socket.emit("user updated", () => {
      console.log("emitting data");
    });
  };

  const closeProfileModal = () => {
    setOpenProfileModal(false);
  };

  return (
    <div>
      {profileData ? (
        <Menu
          shadow="md"
          width={200}
          position="left"
          closeOnClickOutside
          withArrow
        >
          <Menu.Target>
            <Button>View Profile</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>User Profile</Menu.Label>
            <Text size={"md"} weight={"bold"} ml={"1.3rem"}>
              {profileData.username}
            </Text>
            <Text size={"md"} weight={"bold"} ml={"1.3rem"}>
              {profileData.email}
            </Text>

            {user._id !== props.userId ? (
              <div>
                <Menu.Divider />
                {user.accountsFollowing.includes(props.userId) ? (
                  <Menu.Item
                    onClick={() => {
                      updateFriend("delete");
                    }}
                  >
                    Remove Friend
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    onClick={() => {
                      updateFriend("add");
                    }}
                  >
                    Add Friend
                  </Menu.Item>
                )}
              </div>
            ) : null}

            {/* <ProfilePage
              opened={openProfileModal}
              close={() => closeProfileModal()}
              profile={profileData}
            /> */}
            <Group position="center">
              <Button onClick={() => navigate(`/user/${profileData.username}`)}>
                View Full Profile
              </Button>
            </Group>
          </Menu.Dropdown>
        </Menu>
      ) : null}
    </div>
  );
}
