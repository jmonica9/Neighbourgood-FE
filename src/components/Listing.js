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
import { UserContext } from "../App";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { toast } from "react-toastify";
import ProfileMenu from "./Profile/ProfileMenu";

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
    props.setLoading(true);
    //title, image, categories, description, type
    const response = await axios.post(`${BACKEND_URL}/listing/request`, {
      listing: props.listing,
      userId: userData._id,
    });
    props.setLoading(false);
    toast.success("You have sent a request!", {
      position: "top-right",
      autoClose: 4500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    // navigate(`/${props.listing._id}/chatroom`);
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
            <Grid.Col span={6}>
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
                height: "100%",
                // minHeight: "50vh",
                borderRadius: 25,
              }}
            >
              <Card.Section>
                <ScrollArea style={{ height: "50vh" }}>
                  <Grid.Col span={6}>
                    <br />
                    <Text size={28} weight={500} mb={4}>
                      {props.listing.title}
                    </Text>
                    <Group grow>
                      <Text size={20} color="dimmed" mb={4}>
                        Posted by: {props.listing.username}
                      </Text>
                      <ProfileMenu userId={props.listing.userId} />
                    </Group>

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
                {/* im not the owner of listing + the requestorIds dont have mine */}
                {!props.listing.requestorIds.includes(userData._id) &&
                  !userData._id === props.listing.userId && (
                    <Button variant="dark" radius="md" onClick={sendRequest}>
                      Request
                    </Button>
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
