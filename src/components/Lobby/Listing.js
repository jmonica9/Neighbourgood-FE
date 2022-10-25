import React, { useState, useEffect, useContext } from "react";
import { renderMatches, useParams, useNavigate } from "react-router-dom";

//import styling
import { neighbourgoodTheme } from "../../styles/Theme";
import {
  Card,
  Grid,
  Text,
  Group,
  CardSection,
  Image,
  Stack,
  Button,
  Alert,
  Notification,
  Modal,
  Badge,
  Title,
  Container,
  ScrollArea,
} from "@mantine/core";
import { HeartIcon, HeartFilledIcon, DiscIcon } from "@radix-ui/react-icons";
import { UserContext } from "../../App";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";
import ProfileMenu from "../Profile/ProfileMenu";
import EditListing from "./EditListing";
import { socket } from "../../App";
import DeopsitCheckout from "../Deposits/DepositCheckout";
import ReturnDeposit from "../Deposits/ReturnDeposit";
import ClaimDeposit from "../Deposits/ClaimDeposit";
import ListingComments from "./ListingComments";
import { format, formatDistance } from "date-fns";
export default function Listing(props) {
  // const { listingId } = useParams();
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [opened, setOpened] = useState(props.openModal);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [listingDetails, setListingDetails] = useState(props.listing);
  const userData = useContext(UserContext);
  const navigate = useNavigate();

  const getListingDetails = async (id) => {
    const details = await axios.get(`${BACKEND_URL}/listing/single/${id}`);
    console.log(details);
    setListingDetails(details.data);
  };

  useEffect(() => {
    if (props.listing) {
      if (props.listing.type === "sharing") {
        setThemeColor(neighbourgoodTheme.colors.lightTeal);
      } else if (props.listing.type === "helping") {
        setThemeColor(neighbourgoodTheme.colors.lightPurple);
      } else if (props.listing.type === "lending") {
        setThemeColor(neighbourgoodTheme.colors.lightBrown);
      }
      setListingDetails(props.listing);
    }
    setOpened(props.openModal);
  }, [props]);

  // useEffect(() => {
  //   console.log("haha");
  //   socket.on("updating listing info", () => {
  //     console.log("here!!");
  //     getListingDetails(props.listing._id);
  //   });
  // }, [props.listing._id, socket]);

  const sendRequest = async () => {
    // props.setLoading(true);
    //title, image, categories, description, type
    await axios.post(`${BACKEND_URL}/listing/request`, {
      listing: props.listing,
      userId: userData._id,
    });
    // props.setLoading(false);
    toast.success("You have sent a request!", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

    await axios
      .post(`${BACKEND_URL}/chatroom/create/${props.listing._id}`, {
        listingId: props.listing._id,
        requestorId: userData._id,
        ownerId: props.listing.userId,
      })
      .then((res) => {
        navigate(`/chatroom/${res.data._id}`, {
          state: { fromRequestPage: true },
        });
      });
  };

  const withdrawRequest = () => {
    axios.post(`${BACKEND_URL}/listing/withdraw`, {
      listing: props.listing,
      userId: userData._id,
    });
    axios.delete(
      `${BACKEND_URL}/chatroom/delete/${props.listing._id}/${userData._id}`
    );

    toast.error(`You have withdrawn your request for ${props.listing.title}`, {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    props.closeModal();
  };

  const deleteListing = async () => {
    props.setLoading(true);
    const response = await axios
      .post(`${BACKEND_URL}/listing/delete/${props.listing._id}`)
      .then((res) => {
        console.log(res.data);
        console.log("deleted!");
      });
    toast.success("You have deleted the listing!", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    props.setLoading(false);
    setOpened(false);
    props.closeModal();
  };

  const sendToChatroom = async () => {
    const response = await axios.post(`${BACKEND_URL}/chatroom/join`, {
      listing: listingDetails,
      userId: userData._id,
    });
    console.log(response.data);
    navigate(`/chatroom/${response.data._id}`, {
      state: { fromRequestPage: false },
    });
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
  };
  //Likes and Comments
  const updateLikes = async (listing) => {
    console.log(listing);
    if (!listing.usersLiked.includes(userData._id)) {
      console.log("adding");
      const addLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/add`,
        { userId: userData._id }
      );
      console.log(addLikes);
    } else {
      console.log("removing");
      const removeLikes = await axios.post(
        `${BACKEND_URL}/listing/like/${listing._id}/remove`,
        { userId: userData._id }
      );
      console.log(removeLikes);
    }
    await getListingDetails(listing._id);
  };

  const dateDistance = (listing) => {
    if (listing) {
      const time = formatDistance(new Date(), Date.parse(listing.createdAt));
      return time;
    }
  };

  return (
    <Modal
      centered
      closeOnClickOutside
      withCloseButton={false}
      size={"80%"}
      opened={props.openModal}
      onClose={() => {
        setOpened(false);
        props.closeModal();
      }}
    >
      {listingDetails ? (
        <Container fluid className="SideBar-Content-body" px="xs">
          <Grid grow align="start">
            <Grid.Col span={6} m={0} p={1}>
              <Card radius="xl" mr={3}>
                <Card.Section mt="sm">
                  <Image
                    src={listingDetails.cloudimg?.url}
                    height="56vh"
                    alt="photo display"
                    sx={{ width: "100%" }}
                  />
                </Card.Section>

                <Grid.Col span={6} m={0} p={0}>
                  <Group position="center" mt="md" mb="xs">
                    {/* User has not yet requested + user is not the owner of the listing*/}
                    {!listingDetails.requestorIds.includes(userData._id) &&
                      !(userData._id === listingDetails.userId) && (
                        <div>
                          <Button
                            variant="dark"
                            radius="md"
                            onClick={sendRequest}
                          >
                            Request
                          </Button>
                          {/* <DeopsitCheckout
                              listing={listingDetails}
                              name={listingDetails.title}
                              description={listingDetails.description}
                              amount={5000.0}
                            />
                            <ReturnDeposit
                              listing={listingDetails}
                              name={listingDetails.title}
                              description={listingDetails.description}
                              amount={4.99}
                            /> */}
                        </div>
                      )}

                    {/* User has requested already + user is not the owner of the listing */}
                    {listingDetails.requestorIds.includes(userData._id) &&
                      !(userData._id === listingDetails.userId) && (
                        <div>
                          <div style={{ textAlign: "right" }}>
                            You have already sent in a request <br />
                            <br />
                            <span
                              onClick={sendToChatroom}
                              className="listing-modal-button"
                              style={{
                                color: "green",
                              }}
                            >
                              Go to chatroom
                            </span>
                            <span
                              className="listing-modal-button"
                              onClick={withdrawRequest}
                              style={{
                                color: "red",
                                marginLeft: "1rem",
                              }}
                            >
                              Withdraw
                            </span>
                          </div>
                        </div>
                      )}

                    {/* If i own this listing */}
                    {userData._id === listingDetails.userId ? (
                      <div>
                        <Button
                          variant="dark"
                          radius="md"
                          mr={"0.5rem"}
                          onClick={() => setOpenEditModal(true)}
                        >
                          Edit Listing
                        </Button>
                        <EditListing
                          opened={openEditModal}
                          closed={() => closeEditModal()}
                          listing={listingDetails}
                          update={() => getListingDetails(props.listing._id)}
                        />
                        <Button
                          variant="dark"
                          radius="md"
                          onClick={deleteListing}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </Group>
                </Grid.Col>
              </Card>
            </Grid.Col>

            <Card
              m={0}
              sx={{
                width: "50%",
                // width: "100%",
                backgroundColor: themeColor,
                height: "100%",

                borderRadius: 25,
              }}
            >
              <Card.Section>
                <Grid.Col span={6} p={0} px={"xs"}>
                  <br />
                  <Grid>
                    <Grid.Col span={8}>
                      <Text size={28} weight={500} mb={4} inline>
                        {listingDetails.title}
                      </Text>
                      <br />
                      <Text size={20} color="dimmed" mb={4}>
                        Posted by: {listingDetails.username}
                      </Text>
                      {/* <ScrollArea style={{ height: "5vh" }}> */}
                      <ProfileMenu userId={listingDetails.userId} />
                      {/* </ScrollArea> */}
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text mb={"1rem"}>
                        <DiscIcon /> {listingDetails.location}
                      </Text>
                      <Text>{dateDistance(listingDetails)} Ago</Text>
                      <br />
                      <Group>
                        <>
                          {listingDetails.usersLiked.includes(userData._id) ? (
                            <HeartFilledIcon
                              onClick={() => {
                                updateLikes(listingDetails);
                              }}
                              sx={{ cursor: "pointer" }}
                            />
                          ) : (
                            <HeartIcon
                              onClick={() => {
                                updateLikes(listingDetails);
                              }}
                            />
                          )}
                          <Text>{listingDetails.usersLiked.length}</Text>
                        </>
                      </Group>
                      <Stack>
                        {/* <ProfileMenu userId={listingDetails.userId} /> */}
                      </Stack>
                    </Grid.Col>
                  </Grid>
                  <br />
                  {/* <Group>
                    <>
                      {listingDetails.usersLiked.includes(userData._id) ? (
                        <HeartFilledIcon
                          onClick={() => {
                            updateLikes(listingDetails);
                          }}
                        />
                      ) : (
                        <HeartIcon
                          onClick={() => {
                            updateLikes(listingDetails);
                          }}
                        />
                      )}
                      <Text>{listingDetails.usersLiked.length}</Text>
                    </>
                  </Group> */}

                  <Text size={18} color="dimmed">
                    {listingDetails.description}
                  </Text>
                  {/* <ClaimDeposit /> */}
                  <br />
                </Grid.Col>
              </Card.Section>
              <Card.Section>
                <ListingComments
                  listing={listingDetails}
                  open={props.openModal}
                />
              </Card.Section>
            </Card>
          </Grid>
        </Container>
      ) : (
        "There is no listing yet"
      )}
    </Modal>
  );
}
