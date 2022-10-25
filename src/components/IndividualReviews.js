import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import ReviewDetails from "./ReviewDetails";
import ReviewForm from "./ReviewForm";
import { UserContext } from "../App";
function IndividualReview(props) {
  const { listingId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [combined, setCombined] = useState([]);
  const userData = useContext(UserContext);
  const [listingDets, setListingDets] = useState();
  const [refresh, setRefresh] = useState(false);
  const getReviews = async () => {
    await axios
      .get(`${BACKEND_URL}/review/getOneListing/${listingId}`)
      .then((res) => {
        console.log(res.data, "get review data");
        setReviews(res.data);
        return res.data;
      })
      .then((reviews) => {
        getUserInfo(reviews);
      });
  };

  let combinedDetails = [];
  const navigate = useNavigate();
  const getUserInfo = async (reviews) => {
    await reviews.forEach(async (review) => {
      const user = await axios.get(`${BACKEND_URL}/users/${review.postedBy}`);
      const listing = await axios.get(
        `${BACKEND_URL}/listing/single/${review.listingId}`
      );
      setListingDets(listing.data);
      // console.log(user, listing, "USER LISTING FOR REVIEWS BE");
      combinedDetails.push(
        Object.assign(
          review,
          { user: user.data },
          {
            listingTitle: listing.data.title,
            listingDescription: listing.data.description,
            listingImage: listing.data.cloudimg?.url,
          }
        )
        // { review.data, user, listing }
      );
    });
    // console.log({ combinedDetails });
    setCombined(combinedDetails);
  };

  useEffect(() => {
    getReviews();
  }, [refresh]);

  useEffect(() => {
    if (userData) {
      if (reviews.length < 1) {
        setShowReviewForm(true);
      } else
        reviews.forEach((review) => {
          if (review.postedBy === userData._id) {
            // dont show review
            setShowReviewForm(false);
          } else setShowReviewForm(true);
        });
    }
  }, [reviews]);

  // useEffect(() => {
  //   console.log(combinedDetails);
  // }, [combinedDetails]);

  return (
    <Box height="100vh">
      <Grid
        spacing="sm"
        sx={{ marginLeft: props.drawerOpen ? "26vw" : "4vw", display: "flex" }}
      >
        <Grid.Col span={12}>
          {listingDets && (
            <Container
              fluid
              className="SideBar-Content-body"
              px="xs"
              height="100vh"
            >
              <Grid grow align="center" width="100%" height="100%">
                <Grid.Col span={6}>
                  <Card radius="md" mr={3}>
                    <Card.Section mt="sm">
                      <Image
                        src={listingDets?.cloudimg?.url}
                        height="20vh"
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
                    // backgroundColor: themeColor,
                    height: "100%",
                    // minHeight: "50vh",
                    borderRadius: 25,
                  }}
                >
                  <Card.Section>
                    <Grid.Col span={6}>
                      <br />
                      <Grid>
                        <Grid.Col span={12}>
                          <Text size={28} weight={500} mb={4}>
                            {listingDets.title}
                          </Text>
                          <Text size={20} color="dimmed" mb={4}>
                            Desc: {listingDets.description}
                          </Text>
                        </Grid.Col>
                        {/* <Grid.Col span={4}>
                        <Text mb={"1rem"}>
                          <DiscIcon /> {listingDetails.location}
                        </Text>
                        <Text>{dateDistance(listingDetails)} Ago</Text>
                        <Stack>
                          <ProfileMenu userId={listingDetails.userId} />
                        </Stack>
                      </Grid.Col> */}
                      </Grid>
                    </Grid.Col>
                  </Card.Section>
                </Card>{" "}
              </Grid>
            </Container>
          )}
        </Grid.Col>
        <Grid.Col
          className="testt"
          span={12}
          align="center"
          sx={{
            display: "flex",
            align: "center",
            alignContent: "center",
            justifyContent: "center",
            // marginLeft: "8rem",
          }}
        >
          <Grid
            grow
            align="center"
            width="70%"
            height="100%"
            sx={{
              display: "flex",
              // align: "center",
              // justifyItems: "center",
              alignContent: "center",
              // marginLeft: "8rem",
            }}
          >
            <Grid.Col
              span={12}
              sx={{
                display: "flex",
                align: "center",
                alignContent: "center",
                // marginLeft: "8rem",
              }}
              width="100%"
            >
              {!showReviewForm ? null : ( // ) //   </Text> //     Your review exists //   <Text color="black" size="sm"> //  (
                <ReviewForm
                  refresh={refresh}
                  setRefresh={setRefresh}
                  userData={userData}
                />
              )}
            </Grid.Col>
            <Grid.Col
              span={12}
              sx={{
                display: "flex",
                justifyItems: "center",
                // align: "center",
                alignContent: "center",
              }}
            >
              {/* <Group
                sx={{
                  display: "flex",
                  align: "center",
                  alignContent: "center",
                }}
              > */}
              {combined &&
                combined.map((review) => {
                  console.log("RUNNING");
                  return <ReviewDetails review={review} />;
                })}
              {/* {combinedDetails.length > 0 && (
        <ReviewDetails reviews={combinedDetails} />
      )} */}
              <Button onClick={(e) => navigate(-1)}>Go back</Button>
              {/* </Group> */}
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default IndividualReview;
