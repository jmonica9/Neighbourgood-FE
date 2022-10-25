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
import DashboardCalendar from "../DashboardCalendar";
import { ChatBubbleIcon, Pencil2Icon } from "@radix-ui/react-icons";

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
    <>
      <Stack
        spacing={"1vh"}
        sx={{ height: "100%", marginTop: 10, paddingTop: 10 }}
      >
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
            p={15}
          >
            <DashboardFriendsListings user={userData} />
          </Card>
        </Grid>

        <Grid ml={drawerOpen ? "23vw" : "3vw"}>
          <Card
            sx={{
              width: drawerOpen ? "73vw" : "93vw",
              backgroundColor: neighbourgoodTheme.colors.lightGray,
              height: "62.5vh",
              display: "block",
              borderRadius: 25,
            }}
            p={15}
          >
            <Grid gutter={"xs"}>
              <Grid.Col span={8}>
                <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
                  <Text align="left" ml={"0.5em"} size={25} weight={"semibold"}>
                    Community Chat <ChatBubbleIcon />
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
                  <Text align="left" ml={"0.5em"} size={25} weight={"semibold"}>
                    Community Board <Pencil2Icon />
                  </Text>
                  <CommunityPosts />
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid>
      </Stack>
    </>
  );
}

{
  /* <Grid gutter={"xs"} sx={{ display: "flex" }}>
  <Grid.Col span={8}>
    <Card p={0} sx={{ borderRadius: 25, height: "58vh" }}>
      Chat
      <Card.Section>
        <Grid>
          <Grid.Col span={10} pr={0} mr={0}>
            <Textarea radius="lg" placeholder="Add Message" p={"0.5em"} m={0} />
          </Grid.Col>
          <Grid.Col
            span={2}
            sx={{ display: "flex", alignItems: "center" }}
            pl={0}
          >
            <Button
              radius={"1rem"}
              sx={{
                backgroundColor: neighbourgoodTheme.colors.darkGray,
              }}
            >
              Send
            </Button>
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
</Grid>; */
}
