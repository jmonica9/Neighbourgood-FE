import React, { useEffect, useState, useContext } from "react";
import AppointmentModal from "./AppointmentModal";

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
import { BACKEND_URL } from "../../constants";
import { UserContext } from "../../App";

import { getHours, differenceInMinutes, format, add } from "date-fns";

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

import axios from "axios";

const theme = createTheme({});

export default function DashboardCalendar(props) {
  const currentHour = getHours(new Date());
  const [chosenAppointment, setChosenAppointment] = useState({});
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [schedulerHeight, setSchedulerHeight] = useState();
  const [scrollAreaHeight, setScrollAreaHeight] = useState();
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [appointmentsDataInfo, setAppointmentsDataInfo] = useState([]);

  const user = useContext(UserContext);

  useEffect(() => {
    console.log(props.user);
    getAppointmentData();
  }, [user, props]);

  useEffect(() => {
    getAppointmentDetails();
  }, [appointmentsData]);

  const getAppointmentData = async () => {
    const response = await axios.get(`${BACKEND_URL}/appointment`);
    const userAppts = response.data.filter(
      (appt) =>
        appt.confirmed &&
        (appt.requestorId === user._id || appt.ownerId === user._id)
    );
    // console.log(userAppts);
    setAppointmentsData(userAppts);
  };

  const getAppointmentDetails = async () => {
    let apptDetails = [];
    if (appointmentsData.length > 0) {
      appointmentsData.forEach(async (appt) => {
        const details = await axios.get(
          `${BACKEND_URL}/listing/single/${appt.listingId}`
        );
        console.log(details);
        apptDetails.push({
          startDate: appt.proposedDateAndTime,
          title: details.data?.title,
          details: details.data?.description,
          type: details.data?.type,
          listingId: appt.listingId,
          chatroomId: appt.chatroomId,
        });
        console.log(apptDetails.length, appointmentsData.length);
        if (apptDetails.length === appointmentsData.length) {
          console.log(apptDetails);
          setAppointmentsDataInfo(apptDetails);
        }
      });
    }
  };

  //Today-Button
  const todayButton = ({ style, ...restProps }) => (
    <TodayButton.Button
      {...restProps}
      style={{ ...style, border: 0 }}
    ></TodayButton.Button>
  );

  const calendarAppointment = (appointmentsDataInfo) => {
    console.log(appointmentsDataInfo.data);
    const { startDate, endDate, type, details } = appointmentsDataInfo.data;
    let color;
    switch (type) {
      case "sharing":
        color = neighbourgoodTheme.colors.lightTeal;
        break;
      case "helping":
        color = neighbourgoodTheme.colors.lightPurple;
        break;
      case "lending":
        color = neighbourgoodTheme.colors.lightBrown;
        break;
      default:
        color = neighbourgoodTheme.colors.lightGray;
    }
    const startDateParsed = Date.parse(startDate);
    const endDateParsed = Date.parse(add(startDateParsed, { hours: 3 }));
    const timeDifference = differenceInMinutes(endDateParsed, startDateParsed);
    // console.log(timeDifference);
    const cardHeight = timeDifference / 10;
    return (
      <Paper
        sx={{
          backgroundColor: color,
          height: `${cardHeight}rem`,
          width: props.drawerOpen ? "7rem" : "9.25rem",
          cursor: "pointer",
          margin: 0,
        }}
        onClick={() => {
          setChosenAppointment(appointmentsDataInfo.data);
          setOpenAppointmentModal(true);
        }}
      >
        <Text size={"sm"} align="left" ml={"0.5rem"}>
          {appointmentsDataInfo.data.title}
        </Text>
        <Text size="xs" align="left" ml={"0.5rem"}>
          {format(startDateParsed, "HH:mm aa")}-{" "}
          {format(endDateParsed, "HH:mm aa")}
        </Text>
        <Text size={"xs"} align="left" lineClamp={6}>
          {details}
        </Text>
      </Paper>
    );
  };
  useEffect(() => {
    if (window.innerHeight < "5rem") {
      setSchedulerHeight(window.innerHeight * 0.45);
      setScrollAreaHeight(window.innerHeight * 0.45);
    } else if (window.innerHeight >= "5rem" && window.innerHeight < "6.5rem") {
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
      <Scheduler height={schedulerHeight} data={appointmentsDataInfo}>
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
      <hr style={{ margin: "0 0 1rem" }} />
    </ThemeProvider>
  );
}
