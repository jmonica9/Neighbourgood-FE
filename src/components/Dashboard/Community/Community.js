import {
  Grid,
  Stack,
  Card,
  Text,
  createStyles,
  Textarea,
  Button,
} from "@mantine/core";
import { neighbourgoodTheme } from "../../../styles/Theme";
import React, { useContext } from "react";
import { UserContext } from "../../../App";
import DashboardFriendsListings from "../DashboardFriendsListings";
import CommunityPosts from "./CommunityPosts";

export default function Community(props) {
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
    <Stack>
      <Grid ml={drawerOpen ? "23vw" : "3vw"} mb={"2vh"}>
        <Card
          sx={{
            width: drawerOpen ? "73vw" : "93vw",
            backgroundColor: neighbourgoodTheme.colors.lightGray,
            minHeight: 280,
            height: "35vh",
            display: "block",
            borderRadius: 25,
          }}
        >
          {/* <Text
            align="left"
            size={25}
            weight={"semibold"}
            classNames={classes.text}
          >
            Friend's Listings
          </Text> */}
          <DashboardFriendsListings user={userData} />
        </Card>
      </Grid>

      <Grid ml={drawerOpen ? "23vw" : "3vw"} gutter="lg" p={0}>
        <Grid.Col span={12} p={0} grow>
          <Card
            sx={{
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              height: "62.5vh",
              display: "block",
              borderRadius: 25,
            }}
          >
            <Grid gutter={"xs"} sx={{ display: "flex" }}>
              <Grid.Col span={8}>
                <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
                  Chat
                  <Card.Section>
                    <Grid>
                      <Grid.Col span={10} pr={0} mr={0}>
                        <Textarea
                          radius="lg"
                          placeholder="Add Message"
                          p={"0.5em"}
                          m={0}
                        />
                      </Grid.Col>
                      <Grid.Col
                        span={2}
                        sx={{ display: "flex", alignItems: "center" }}
                        pl={0}
                      >
                        <Button>Send</Button>
                      </Grid.Col>
                    </Grid>
                  </Card.Section>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card sx={{ borderRadius: 25 }}>
                  Community Posts
                  <CommunityPosts />
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
