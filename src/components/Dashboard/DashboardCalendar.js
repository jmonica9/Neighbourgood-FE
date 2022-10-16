import React, { useEffect, useState } from "react";
import AppointmentModal from "../AppointmentModal";

import {
  ViewState,
  EditingState,
  IntegratedEditing,
  IntegratedGrouping,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  Toolbar,
  DateNavigator,
  TodayButton,
  GroupingPanel,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";

import { getHours, differenceInMinutes, format } from "date-fns";

import {
  createTheme,
  ThemeProvider,
  styled,
  alpha,
} from "@mui/material/styles";
import { Paper } from "@mui/material";
import { Grid, Group, Text, ScrollArea } from "@mantine/core";
import { neighbourgoodTheme } from "../../styles/Theme";
import { CalendarIcon } from "@radix-ui/react-icons";

const theme = createTheme({});

export default function DashboardCalendar() {
  const currentHour = getHours(new Date());
  const [chosenAppointment, setChosenAppointment] = useState({});
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [schedulerHeight, setSchedulerHeight] = useState();
  const [scrollAreaHeight, setScrollAreaHeight] = useState();

  //Today-Button
  const todayButton = ({ style, ...restProps }) => (
    <TodayButton.Button
      {...restProps}
      style={{ ...style, border: 0 }}
    ></TodayButton.Button>
  );

  const appointmentData = [
    {
      startDate: "2022-10-10T09:00",
      endDate: "2022-10-10T12:00",
      title: "Helping Title",
      details: "Helping Details",
      type: "Helping",
    },
    {
      startDate: "2022-10-10T12:45",
      endDate: "2022-10-10T14:00",
      title: "Sharing Title",
      details: "Sharing Details",
      type: "Sharing",
    },
    {
      startDate: "2022-10-11T10:45",
      endDate: "2022-10-11T13:30",
      title: "Lending Title",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      type: "Lending",
    },
  ];

  const calendarAppointment = (appointmentData) => {
    const { startDate, endDate, type, details } = appointmentData.data;
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
    const startDateParsed = Date.parse(startDate);
    const endDateParsed = Date.parse(endDate);
    const timeDifference = differenceInMinutes(endDateParsed, startDateParsed);
    // console.log(timeDifference);
    const cardHeight = timeDifference / 10;
    return (
      <Paper
        sx={{
          backgroundColor: color,
          height: `${cardHeight}rem`,
          width: "6rem",
          cursor: "pointer",
          margin: 0,
        }}
        onClick={() => {
          setChosenAppointment(appointmentData.data);
          setOpenAppointmentModal(true);
        }}
      >
        <Text size={"sm"} align="left" ml={"0.5rem"}>
          {appointmentData.data.title}
        </Text>
        <Text size="xs" align="left" ml={"0.5rem"}>
          {format(startDateParsed, "HH:mm aa")}-{" "}
          {format(endDateParsed, "HH:mm aa")}
        </Text>
        {/* <Text size={"xs"}>{details}</Text> */}
      </Paper>
    );
  };
  useEffect(() => {
    if (window.innerHeight < 830) {
      setSchedulerHeight(window.innerHeight * 0.45);
      setScrollAreaHeight(window.innerHeight * 0.45);
    } else if (window.innerHeight >= 830 && window.innerHeight < 1000) {
      setSchedulerHeight(window.innerHeight * 0.5);
      setScrollAreaHeight(window.innerHeight * 0.5);
    } else {
      setSchedulerHeight(window.innerHeight * 0.54);
    }
    console.log(schedulerHeight);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <Paper sx={{ overflow: "auto", overflowY: true }}> */}
      <ScrollArea
        style={{ height: schedulerHeight, padding: 0 }}
        // style={{ height: "20rem", padding: 0 }}
        offsetScrollbars
      >
        <Scheduler height={schedulerHeight} data={appointmentData}>
          <ViewState />

          <WeekView startDayHour={6} endDayHour={24} cellDuration={30} />
          <Appointments appointmentComponent={calendarAppointment} />

          {/* <AllDayPanel /> */}
          <Toolbar />
          <DateNavigator />
          <TodayButton
            buttonComponent={todayButton}
            messages={{ today: <CalendarIcon /> }}
          />
          <AppointmentModal
            data={chosenAppointment}
            open={openAppointmentModal}
            close={() => setOpenAppointmentModal(false)}
          />
        </Scheduler>
      </ScrollArea>
      <Text align="left" size={"xl"} ml={"2vh"} mb={"1vh"}>
        Calendar
      </Text>
    </ThemeProvider>
  );
}