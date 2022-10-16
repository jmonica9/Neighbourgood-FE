import React, { useState, useEffect, useContext } from "react";
import { renderMatches, useParams, useNavigate } from "react-router-dom";

//import styling
import { neighbourgoodTheme } from "../styles/Theme";
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
import { socket, UserContext } from "../App";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { toast } from "react-toastify";

export default function Listing(props) {
  // const { listingId } = useParams();
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [opened, setOpened] = useState(props.openModal);
  const userData = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.listing) {
      if (props.listing.type === "sharing") {
        setThemeColor(neighbourgoodTheme.colors.lightTeal);
      } else if (props.listing.type === "helping") {
        setThemeColor(neighbourgoodTheme.colors.lightPurple);
      } else if (props.listing.type === "lending") {
        setThemeColor(neighbourgoodTheme.colors.lightBrown);
      }
    }
  }, [props]);

  useEffect(() => {
    setOpened(props.openModal);
  });

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
    alert(
      "need to socket emit here to make both owner's and requestor's dashboard/lobby update"
    );
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
      listing: props.listing,
      userId: userData._id,
    });
    navigate(`/chatroom/${response.data._id}`, {
      state: { fromRequestPage: false },
    });
  };

  return (
    <Modal
      // overflow="inside"
      size={"90%"}
      opened={props.openModal}
      onClose={() => {
        setOpened(false);
        props.closeModal();
      }}
    >
      {/* <div> */}
      {/* <div>
          {props.listing ? (
            <Card
              sx={{
                width: "100%",
                backgroundColor: themeColor,
                height: "95vh",
                borderRadius: 25,
              }}
            >
              <CardSection>
                <Grid sx={{ width: "100%" }}>
                  <Grid.Col span={6}>
                    <Text align="left">Listing {props.listing.title}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}></Grid.Col>
                </Grid>
              </CardSection>
              <br />
              <CardSection>
                <Image src={`${props.listing.image}`} height={"60vh"} />
              </CardSection>
              <CardSection>
                <Stack>
                  <Text align="left">Title : {props.listing.title}</Text>
                  <Text align="left">
                    Description : {props.listing.description}
                  </Text>
                  <Grid>
                    <Grid.Col span={9}></Grid.Col>
                    <Grid.Col span={3}>
                      {!props.listing.requestorIds.includes(userData._id) && (
                        <Button ml={"5rem"} onClick={sendRequest}>
                          Request
                        </Button>
                      )}
                      {userData._id === props.listing.userId ? (
                        <Button onClick={deleteListing}>Delete</Button>
                      ) : null}
                    </Grid.Col>
                  </Grid>
                </Stack>
              </CardSection>
            </Card>
          ) : (
            "null"
          )}
        </div> */}
      {/* {props.listing ? (
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            height="100"
            sx={{
              width: "100%",
              backgroundColor: themeColor,
              height: "95vh",
              borderRadius: 25,
            }}
          >
            <Card.Section>
              <Image
                mt={3}
                src={props.listing.cloudimg?.url}
                alt={props.listing.title}
                height="50vh"
                fit="contain"
              />
              
            </Card.Section>

            
            <Group inheritPadding position="right" mt="md" mb="xs">
              {!props.listing.requestorIds.includes(userData._id) && (
                <Button
                  variant="light"
                  color="blue"
                  radius="md"
                  onClick={sendRequest}
                >
                  {" "}
                  Request
                </Button>
              )}
              {userData._id === props.listing.userId ? (
                <Button
                  variant="light"
                  color="blue"
                  radius="md"
                  onClick={deleteListing}
                >
                  Delete
                </Button>
              ) : null}
            </Group>
          </Card>
        ) : (
          "Loading.."
        )}
      </div> */}
      {props.listing ? (
        <Container fluid className="SideBar-Content-body" px="xs">
          <Grid grow align="center">
            <Grid.Col span={4}>
              <Card radius="md" mr={3}>
                <Card.Section mt="sm">
                  <Image
                    src={props.listing.cloudimg?.url}
                    height="50vh"
                    alt="photo display"
                    fit="contain"
                  />
                </Card.Section>
              </Card>
            </Grid.Col>

            <Card
              sx={{
                width: "50%",
                // width: "100%",
                backgroundColor: themeColor,
                // height: "95vh",
                borderRadius: 25,
              }}
            >
              <Card.Section>
                <ScrollArea style={{ height: "18rem" }}>
                  <Grid.Col span={6}>
                    <br />
                    <Text size={28} weight={500} mb={4}>
                      {props.listing.title}
                    </Text>
                    <Text size={20} color="dimmed" mb={4}>
                      Posted by: {props.listing.username}
                    </Text>
                    <Text size={18} color="dimmed">
                      {props.listing.description}
                    </Text>

                    <br />
                  </Grid.Col>
                </ScrollArea>
              </Card.Section>
            </Card>
            <Grid.Col span={6}>
              <Group position="right" mt="md" mb="xs">
                {/* User has not yet requested + user is not the owner of the listing*/}
                {!props.listing.requestorIds.includes(userData._id) &&
                  !(userData._id === props.listing.userId) && (
                    <Button variant="dark" radius="md" onClick={sendRequest}>
                      Request
                    </Button>
                  )}

                {/* User has requested already + user is not the owner of the listing */}
                {props.listing.requestorIds.includes(userData._id) &&
                  !(userData._id === props.listing.userId) && (
                    <div>
                      <div>
                        You have already requested this item. Click
                        <button onClick={sendToChatroom}>here</button>
                        to go to the chatroom!
                      </div>
                      <div>
                        alternatively, click{" "}
                        <button onClick={withdrawRequest}>here</button> to
                        withdraw your interest
                      </div>
                    </div>
                  )}

                {/* If i own this listing */}
                {userData._id === props.listing.userId ? (
                  <Button variant="dark" radius="md" onClick={deleteListing}>
                    Delete
                  </Button>
                ) : null}
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      ) : (
        "There is no listing yet"
      )}
    </Modal>
  );
}
