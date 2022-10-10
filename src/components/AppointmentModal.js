import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Group,
  Text,
  Stack,
  Avatar,
  createStyles,
  Badge,
  Grid,
} from "@mantine/core";
import { format } from "date-fns";
import { neighbourgoodTheme } from "../styles/Theme";
import { ClockIcon } from "@radix-ui/react-icons";
import { height } from "@mui/system";

export default function AppointmentModal(props) {
  const [opened, setOpened] = useState(props.open);
  const { title, startDate, endDate, details, type } = props.data;

  useEffect(() => {
    setOpened(props.open);
  }, [props]);

  const startDateParsed = Date.parse(startDate);
  const endDateParsed = Date.parse(endDate);

  let color;
  switch (type) {
    case "Sharing":
      color = neighbourgoodTheme.colors.lightTeal;
      break;
    case "Helping":
      color = neighbourgoodTheme.colors.lightPurple;
      break;
    case "Lending":
      color = neighbourgoodTheme.colors.lightBrown;
      break;
    default:
      color = neighbourgoodTheme.colors.lightGray;
  }

  const useStyles = createStyles((theme) => ({
    badgePaper: {
      backgroundColor: color,
      color: "white",
      borderBottom: 0,
    },
  }));
  const { classes } = useStyles();

  return (
    <>
      {Object.keys(props.data).length ? (
        <Modal
          withCloseButton={false}
          centered
          opened={opened}
          onClose={() => {
            setOpened(false);
            props.close();
          }}
        >
          {/* Modal content */}

          <Grid pb={"2rem"}>
            <Badge
              m={0}
              p={0}
              sx={{ width: "2vw", height: "2vw", borderRadius: "25" }}
              classNames={{ root: classes.badgePaper }}
            ></Badge>
            <Text size={"xl"} ml={"1rem"} weight={700}>
              {title}
            </Text>
          </Grid>
          {/* <Stack sx={{ gap: 0 }}> */}
          <Grid>
            <div style={{ marginLeft: "0.5rem" }}>
              <ClockIcon />
            </div>
            <Text ml={"1.4rem"} mb={"0.5rem"}>
              {format(startDateParsed, "cccc, d MMM yyyy")}
            </Text>
          </Grid>
          <Text ml={"2rem"}>
            {format(startDateParsed, "HH:mm aa")}-{" "}
            {format(endDateParsed, "HH:mm aa")}
          </Text>
          {/* </Stack> */}
          <Text ml={"2rem"} mt={"1rem"}>
            {details}
          </Text>
        </Modal>
      ) : null}
    </>
  );
}
