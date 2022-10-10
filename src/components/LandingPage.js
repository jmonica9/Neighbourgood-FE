import React, { useState } from "react";
import helping from "../images/helping.jpg";
import lending from "../images/lending.jpg";
import sharing from "../images/sharing.jpg";
import { Button, Grid, Text, Group, Title, Card } from "@mantine/core";
import LandingPageCarousel from "./LandingPageCarousel";
import { neighbourgoodTheme } from "../styles/Theme";
import Listing from "./Listing";
import Lobby from "./Lobby";
import LandingPageListings from "./LandingPageListings";

function LandingPage(props) {
  const [showSharing, setShowSharing] = useState(false);
  const [showHelping, setShowHelping] = useState(false);
  const [showLending, setShowLending] = useState(false);

  const toggleSharingListings = () => {
    setShowSharing(!showSharing);
    setShowHelping(false);
    setShowLending(false);
  };
  const toggleHelpingListings = () => {
    setShowHelping(!showHelping);
    setShowSharing(false);
    setShowLending(false);
  };
  const toggleLendingListings = () => {
    setShowLending(!showLending);
    setShowHelping(false);
    setShowSharing(false);
  };

  return (
    <Grid
      className="landing-container"
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      align="flex-start"
    >
      <Grid.Col className="carousel-container" pl={"3.1rem"} pr={"0"} pt={"0"}>
        <LandingPageCarousel />
      </Grid.Col>

      <Grid
        className="categories-container"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "80vh",
        }}
        pl={"3.1rem"}
      >
        <Grid.Col
          span={6}
          className="sharing-container"
          style={{ height: "80vh" }}
          p={0}
        >
          <Grid.Col
            style={{
              backgroundImage: `url(${sharing})`,
              height: "100.7%",
              backgroundSize: "cover",
              overflow: "clip",
              backgroundRepeat: "no-repeat",
            }}
            p={0}
            mr={"0.1rem"}
          >
            <Grid.Col
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              p={"5rem"}
            >
              <Grid>
                <Grid.Col>
                  <Title size="h2" underline mb={"2rem"}>
                    Sharing
                  </Title>
                </Grid.Col>
                <Grid.Col>
                  <Text size="md" mb={"2rem"}>
                    Have stuff that's still in a good working condition that
                    you're looking to throw or give away? <br />
                    <br />
                    List them on our sharing platform to bless others who are in
                    need. <br />
                    <br />
                    Or check out listings from other users, you can help take
                    their unwanted stuff off their hands!
                  </Text>
                </Grid.Col>
                <Grid.Col>
                  <Text size="md">
                    <Button variant="outline" onClick={toggleSharingListings}>
                      See Listings
                    </Button>
                  </Text>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid.Col>
        </Grid.Col>
        <Grid.Col
          span={6}
          className="helping_lending-container"
          style={{ height: "100%" }}
          p={0}
        >
          <Group style={{ height: "50%" }} spacing={5}>
            <Grid.Col
              style={{
                backgroundImage: `url(${helping})`,
                height: "100%",
                backgroundSize: "cover",
                overflow: "clip",
                backgroundRepeat: "no-repeat",
              }}
              p={0}
            >
              <Grid.Col
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                p={"3rem"}
              >
                <Grid>
                  <Grid.Col>
                    <Title size="h2" underline mb={"1rem"}>
                      Helping
                    </Title>
                  </Grid.Col>
                  <Grid.Col>
                    <Text size="md" mb={"1rem"}>
                      <i>
                        "Love your neighbour as you love yourself" - Mark 12:31
                      </i>
                      <br />
                      <br />
                      Spread some love by helping your neighbours with tasks
                      that are troubling them. <br />
                      <br />
                      Or post a task that you need help with and let others show
                      their love for you instead!
                    </Text>
                  </Grid.Col>
                  <Grid.Col>
                    <Text size="md">
                      <Button variant="outline" onClick={toggleHelpingListings}>
                        See Listings
                      </Button>
                    </Text>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid.Col>
            <Grid.Col
              style={{
                backgroundImage: `url(${lending})`,
                height: "100%",
                backgroundSize: "cover",
                overflow: "clip",
                backgroundRepeat: "no-repeat",
              }}
              p={0}
            >
              <Grid.Col
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                p={"3rem"}
              >
                <Grid>
                  <Grid.Col>
                    <Title size="h2" underline mb={"1rem"}>
                      Lending
                    </Title>
                  </Grid.Col>
                  <Grid.Col>
                    <Text size="md" mb={"1rem"}>
                      Loan out items to your neighbours or borrow their stuff
                      with our lending listings platform
                      <br />
                      <br />
                      Be sure to take good care of the items you're borrowing,
                      just as how someone borrowing your stuff would take good
                      care of it too!
                    </Text>
                  </Grid.Col>
                  <Grid.Col>
                    <Text size="md">
                      <Button variant="outline" onClick={toggleLendingListings}>
                        See Listings
                      </Button>
                    </Text>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid.Col>
          </Group>
        </Grid.Col>
        <Grid.Col
          className="listings-container"
          sx={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            justifyItems: "center",
          }}
          pl={"4rem"}
        >
          {showSharing && (
            <Grid.Col mt={"2rem"}>
              <LandingPageListings title="Sharing" />
            </Grid.Col>
          )}
          {showHelping && (
            <Grid.Col mt={"2rem"}>
              <LandingPageListings title="Helping" />
            </Grid.Col>
          )}
          {showLending && (
            <Grid.Col mt={"2rem"}>
              <LandingPageListings title="Lending" />
            </Grid.Col>
          )}
        </Grid.Col>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
