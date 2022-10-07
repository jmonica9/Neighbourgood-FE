import React, { useState, useEffect } from "react";
import { renderMatches, useParams } from "react-router-dom";

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
} from "@mantine/core";

export default function Listing(props) {
  const { listingId } = useParams();
  const [themeColor, setThemeColor] = useState(
    neighbourgoodTheme.colors.lightGray
  );
  const [opened, setOpened] = useState(props.openModal);

  useEffect(() => {
    if (props.type === "Sharing") {
      setThemeColor(neighbourgoodTheme.colors.lightTeal);
    } else if (props.type === "Helping") {
      setThemeColor(neighbourgoodTheme.colors.lightPurple);
    } else if (props.type === "Lending") {
      setThemeColor(neighbourgoodTheme.colors.lightBrown);
    }
  }, [props]);

  useEffect(() => {
    setOpened(props.openModal);
  }, [props]);
  const requestAlert = () => {
    //alert problem
    return (
      <Notification color={"green"} sx={{ zIndex: 100 }}>
        Request Successful
      </Notification>
    );
  };
  return (
    <Modal
      size={"80%"}
      opened={opened}
      onClose={() => {
        setOpened(false);
        props.closeModal();
      }}
    >
      <div>
        <div>
          <Card
            sx={{
              width: "100%",
              backgroundColor: themeColor,
              height: "95vh",
              borderRadius: 25,
            }}
          >
            {/* Contents in here */}
            <CardSection>
              <Grid sx={{ width: "100%" }}>
                <Grid.Col span={6}>
                  <Text align="left">Listing {listingId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text align="right">By: *</Text>
                </Grid.Col>
              </Grid>
            </CardSection>
            <br />
            <CardSection>
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={"60vh"}
              />
            </CardSection>
            <CardSection>
              <Stack>
                <Text align="left">Title</Text>
                <Text align="left">Description</Text>
                <Grid>
                  <Grid.Col span={9}></Grid.Col>
                  <Grid.Col span={3}>
                    <Button
                      ml={"5rem"}
                      onClick={() => {
                        return <Notification>Hi</Notification>;
                      }}
                    >
                      Request
                    </Button>
                  </Grid.Col>
                </Grid>
              </Stack>
            </CardSection>
          </Card>
        </div>
      </div>
    </Modal>
  );
}