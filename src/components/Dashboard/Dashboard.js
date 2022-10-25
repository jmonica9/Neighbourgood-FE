import React, { useContext, useState } from "react";
import DashboardCalendar from "./DashboardCalendar";
//import styling
import {
  Card,
  Grid,
  Paper,
  ScrollArea,
  Stack,
  Text,
  createStyles,
  Title,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import DashboardFriendsListings from "./DashboardFriendsListings";
import { UserContext } from "../../App";
import DashboardReviews from "./DashboardReviews";
import { OverallChats } from "../OverallChat";
import { HouseHeartFill } from "react-bootstrap-icons";

export default function Dashboard(props) {
  const drawerOpen = props.drawerOpen;
  const userData = useContext(UserContext);

  const useStyles = createStyles((theme) => ({
    text: {
      fontSize: theme.fontSizes.xl,
      [theme.fn.smallerThan("lg")]: {
        fontSize: theme.fontSizes.sm,
      },
    },
  }));
  const classes = useStyles();

  return (
    <>
      <Stack
        spacing={"1vh"}
        sx={{
          height: "100%",
          minHeight: "80vh",
          marginTop: 0,
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        {/* <Button
          variant="subtle"
          size="xl"
          className="home-button"
          onClick={() => (user ? navigate("/dashboard") : navigate("/"))}
        ></Button> */}
        {/* <Text color="black">Neighbourgood</Text> */}
        {/* <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 500,
            color: "black",
            // paddingLeft: "2rem",
          })}
        >
          <HouseHeartFill variant="subtle" /> <br></br>
          Welcome to Neighbourgood
        </Title> */}
        <Grid ml={drawerOpen ? "23vw" : "3vw"}>
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              height: "80.5vh",
              display: "block",
              borderRadius: 25,
              marginTop: "2rem",
              marginBottom: "2.0rem",
              paddingBottom: "10rem",
            }}
            p={15}
          >
            <Grid>
              <Grid.Col
                span={12}
                sx={{ display: "flex", height: "100%", width: "100%" }}
                pb={0}
                pt={10}
              >
                <Text size={25} weight={"semibold"}>
                  Dashboard
                </Text>
              </Grid.Col>
              <Grid.Col
                span={12}
                pt={0}
                // pb={"10rem"}
              >
                <Card
                  sx={{
                    display: "block",
                    borderRadius: 25,
                    height: "100%",
                    width: "100%",
                    // paddingBottom: "10rem",
                  }}
                  // sx={{ height: "54vh", display: "block", borderRadius: 25 }}
                  // mb={"1vh"}
                  p={0}
                >
                  {/* <Stack> */}
                  <ScrollArea
                    style={{ height: "35rem", paddingBottom: "5rem" }}
                    // style={{ height: "20rem", padding: 0 }}
                    offsetScrollbars
                  >
                    <DashboardCalendar user={userData} />
                  </ScrollArea>

                  {/* </Stack> */}
                </Card>
              </Grid.Col>
              {/* <Grid.Col span={4} p={0} pr={10} sx={{ height: "100%" }}>
                <Stack spacing={"xs"} sx={{ height: "100%" }}>
                  <Card
                    sx={{ height: "60%", display: "flex", borderRadius: 25 }}
                    p={10}
                  >
                    <Stack spacing={"1vh"}>
                      <Text align="left" size="xl">
                        Reviews
                      </Text>
                      <DashboardReviews />
                    </Stack>
                  </Card>
                  <Card
                    sx={{ height: "15vh", display: "flex", borderRadius: 25 }}
                    p={10}
                  >
                    <Text align="left" size="xl">
                      Chat History
                    </Text>
                  </Card>
                </Stack>
              </Grid.Col> */}
            </Grid>
          </Card>
        </Grid>
        <Grid ml={drawerOpen ? "23vw" : "3vw"} mb={"2vh"} height="100%">
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: "white",
              minHeight: 280,
              height: "100%",
              display: "block",
              borderRadius: 25,
            }}
            p={15}
          >
            {/* <Text
              align="left"
              size={25}
              weight={"semibold"}
              classNames={classes.text}
            >
              Friend's Listings
            </Text> */}
            {/* Contents in here */}
            {/* <DashboardFriendsListings user={userData} />
             */}
            <OverallChats />
          </Card>
        </Grid>
      </Stack>
    </>
  );
}
