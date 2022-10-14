import React, { useState, useEffect, useContext } from "react";
import helping from "../images/helping.jpg";
import lending from "../images/lending.jpg";
import sharing from "../images/sharing.jpg";
import { UserContext } from "../App";
import { Button, Grid, Text, Group, Title, Card } from "@mantine/core";
import LandingPageCarousel from "./LandingPageCarousel";
import { neighbourgoodTheme } from "../styles/Theme";
import Listing from "./Listing";
import Lobby from "./Lobby";
import LandingPageListings from "./LandingPageListings";
import { socket } from "../App";

function LandingPage(props) {
  const userData = useContext(UserContext);
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

  // useEffect(() => {
  //   socket.emit(
  //     "testing",
  //     "this message comes from the front end, and was sent to the backend via socket, then backend socket sends it back and it's now picked up by another use effect in the front end which displays it as an alert"
  //   );
  // }, []);

  // useEffect(() => {
  //   socket.on("testing_received", (data) => {
  //     alert(data);
  //   });
  // }, [socket]);

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
      pl={"3rem"}
    >
      <Grid.Col className="carousel-container" p={0} m={0}>
        <LandingPageCarousel />
      </Grid.Col>

      <Grid
        className="categories-container"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "90vh",
        }}
        mt={"0.1rem"}
      >
        <Grid.Col
          span={6}
          className="sharing-container"
          style={{ height: "100%" }}
          p={0}
        >
          <Grid.Col
            style={{
              backgroundImage: `url(${sharing})`,
              height: "100%",
              backgroundSize: "cover",
              overflow: "clip",
              backgroundRepeat: "no-repeat",
              borderTop: "1px solid #fff",
              borderRight: "1px solid #fff",
            }}
            p={0}
            className="sharingimagebackground"
          >
            <Grid.Col
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              className="sharingoverlay"
            >
              <Grid
                className="sharingdetailscontainer"
                sx={{
                  height: "80%",
                  display: "flex",
                  alignContent: "center",
                }}
                px={"10vw"}
              >
                <Grid.Col className="sharingtitle">
                  <Title size="h1" underline>
                    Sharing
                  </Title>
                </Grid.Col>
                <Grid.Col className="sharingdesc">
                  <Text size="1.7vh">
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
                <Grid.Col className="sharingbutton">
                  <Button
                    size={"sm"}
                    variant="outline"
                    onClick={toggleSharingListings}
                  >
                    See Listings
                  </Button>
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
          <Grid.Col
            style={{
              backgroundImage: `url(${helping})`,
              height: "50%",
              backgroundSize: "cover",
              overflow: "clip",
              backgroundRepeat: "no-repeat",
              borderTop: "1px solid #fff",
            }}
            p={0}
            className="helpingimagebackground"
          >
            <Grid.Col
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              className="helpingoverlay"
            >
              <Grid
                className="helpingdetailscontainer"
                sx={{
                  height: "80%",
                  display: "flex",
                  alignContent: "center",
                }}
                px={"3rem"}
              >
                <Grid.Col className="helpingtitle">
                  <Title size="h2" underline>
                    Helping
                  </Title>
                </Grid.Col>
                <Grid.Col className="helpingdesc">
                  <Text size="1.7vh">
                    <i>
                      "Love your neighbour as you love yourself" - Mark 12:31
                    </i>
                    <br />
                    <br />
                    Spread some love by helping your neighbours with tasks that
                    are troubling them. <br />
                    Or post a task that you need help with and let others show
                    their love for you instead!
                  </Text>
                </Grid.Col>
                <Grid.Col className="helpingbutton">
                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={toggleHelpingListings}
                  >
                    See Listings
                  </Button>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid.Col>
          <Grid.Col
            style={{
              backgroundImage: `url(${lending})`,
              height: "50%",
              backgroundSize: "cover",
              overflow: "clip",
              backgroundRepeat: "no-repeat",
              borderTop: "1px solid #fff",
            }}
            p={0}
            className="lendingimagebackground"
          >
            <Grid.Col
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              className="lendingoverlay"
            >
              <Grid
                className="lendingdetailscontainer"
                sx={{
                  height: "80%",
                  display: "flex",
                  alignContent: "center",
                }}
                px={"3rem"}
              >
                <Grid.Col className="lendingtitle">
                  <Title size="h2" underline>
                    Lending
                  </Title>
                </Grid.Col>
                <Grid.Col className="lendingdesc">
                  <Text size="1.7vh">
                    Loan out items to your neighbours or borrow their stuff with
                    our lending feature.
                    <br />
                    <br />
                    Be sure to take good care of the items you're borrowing,
                    just as how someone borrowing your stuff would take good
                    care of it too!
                  </Text>
                </Grid.Col>
                <Grid.Col className="lendingbutton">
                  <Button
                    size={"sm"}
                    variant="outline"
                    onClick={toggleLendingListings}
                  >
                    See Listings
                  </Button>
                  {/* {<AuthModal />} */}
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid.Col>
        </Grid.Col>
        <Grid.Col className="listings-container" p={0}>
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
