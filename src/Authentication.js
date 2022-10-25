import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
} from "@mantine/core";
import React, { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BACKEND_URL } from "./constants";
import { createStyles } from "@mantine/core";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

import { socket } from "./App";
import GeoAPI from "./components/GeoAPI";
// import Maps from "./components/Maps";
// import GoogleMaps from "./components/GoogleMaps";
import axios from "axios";
export const useStyles = createStyles((theme) => ({
  invalid: {
    backgroundColor:
      // theme.colorScheme === "dark"
      //   ? theme.fn.rgba(theme.colors.red[10], 1000)
      //   :
      theme.colors.red[0],
  },

  icon: {
    color: theme.colors.red[theme.colorScheme === "dark" ? 2 : 6],
  },
}));

export function Authentication(props) {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  const [county, setCounty] = useState("");
  const [myUser, setMyUser] = useState(null);
  const [jwtUser, setJwtUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState(null);
  const [userPostcode, setUserPostcode] = useState("");
  const [usernameError, setUsernameError] = useState();
  const [emailError, setEmailError] = useState();
  const [locationError, setLocationError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [loginPasswordError, setLoginPasswordError] = useState();
  const [loginUsernameError, setLoginUsernameError] = useState();
  const REGISTER_MODE = "Register";
  const LOGIN_MODE = "Login";
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(REGISTER_MODE);
  const { classes } = useStyles();
  // access user info on load

  useEffect(() => {
    console.log(process.env.REACT_APP_GEO_APIKEY, "process env");
    console.log("get my user info, useeffect!");
    checkJWT();
  }, []);

  useEffect(() => {
    if (jwtUser !== null) {
      console.log(jwtUser, "use effect jwt user");
      setWelcomeMsg(`You are logged in. Welcome back ${jwtUser} `);
    }
  }, [jwtUser]);

  const validate = () => {
    if (validator.isEmail(registerEmail)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    if (!registerUsername || registerUsername.length === 0) {
      setUsernameError(true);
    } else setUsernameError(false);

    if (!registerPassword || registerPassword.length === 0) {
      setPasswordError(true);
    } else setPasswordError(false);
    console.log({ emailError, passwordError, usernameError });

    if (!county || county.length === 0) {
      setLocationError(true);
    } else setLocationError(false);
    console.log({ emailError, passwordError, usernameError, locationError });
  };

  const register = async (e) => {
    e.preventDefault();
    validate();
    console.log(authMode, "authmode");
    if (emailError || usernameError || passwordError || locationError) return;
    else if (
      emailError === false &&
      usernameError === false &&
      passwordError === false
    ) {
      axios
        .post(`${BACKEND_URL}/location/insert`, { location: county })
        .then((res) => console.log(res));
      Axios({
        method: "POST",
        data: {
          email: registerEmail,
          username: registerUsername,
          password: registerPassword,
          location: county,
          postcode: userPostcode,
        },
        withCredentials: true,
        url: `${BACKEND_URL}/auth/register`,
      }).then((res) => {
        console.log(res);
        if (res) {
          toast.success("You have registered in!", {
            position: "top-right",
            autoClose: 4500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setAuthMode(LOGIN_MODE);
        }
      });
    }
  };
  const validateLogin = () => {
    if (!loginUsername || loginUsername.length === 0) {
      setLoginUsernameError(true);
    } else setLoginUsernameError(false);

    if (!loginPassword || loginPassword === 0) {
      setLoginPasswordError(true);
    } else setLoginPasswordError(false);
  };
  const login = () => {
    console.log(authMode, "authmode");
    if (!loginUsernameError && !loginPasswordError) {
      Axios({
        method: "POST",
        data: {
          username: loginUsername,
          password: loginPassword,
        },
        withCredentials: true,
        url: `${BACKEND_URL}/auth/login`,
      }).then((res) => {
        console.log(res);
        if (res.data === "No User Exists") {
          toast.error("Invalid login details", {
            position: "top-right",
            autoClose: 4500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          return;
        } else {
          console.log("socket emit user logged in!");
          socket.emit("user", res);
          toast.success("You have logged in! Welcome back", {
            position: "top-right",
            autoClose: 4500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });

          props.onClose();
          navigate("/dashboard");
        }
      });
    } else {
      toast.error("Invalid login details", {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  const checkJWT = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/jwtUser`,
    }).then((res) => {
      console.log(res.data);
      setJwtUser(res.data.username);
      //to remove when Mon finishes lifting userData as state to App
      socket.emit("userData", res.data);
      //end of 'to remove'
    });
  };

  const logout = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/logout`,
    }).then((res) => {
      console.log(res.data);
      setJwtUser(null);
      setMyUser(null);
      setWelcomeMsg(null);
      toast("You have logged out!", {
        position: "top-right",
        autoClose: 4,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    });
  };

  return (
    <div>
      <Container size={420}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome to Neighbourgood
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do you have an account yet?{" "}
          <Anchor
            href="#"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              if (authMode === REGISTER_MODE) {
                setAuthMode(LOGIN_MODE);
              } else if (authMode === LOGIN_MODE) {
                setAuthMode(REGISTER_MODE);
              }
            }}
          >
            {authMode === REGISTER_MODE ? "Login" : "Register"}
          </Anchor>
        </Text>
        {authMode === REGISTER_MODE ? (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Username"
              autoComplete="false"
              value={registerUsername}
              placeholder="register username here"
              onChange={(e) => {
                setRegisterUsername(e.target.value);
                validate();
              }}
              // error={usernameError ? "Invalid username" : null}
              classNames={usernameError ? { input: classes.invalid } : null}
              rightSection={
                usernameError ? (
                  <ExclamationTriangleFill
                    stroke={1.5}
                    size={16}
                    className={classes.icon}
                  />
                ) : null
              }
              withAsterisk
            />
            {usernameError ? (
              <Text className={classes.icon}>Invalid username </Text>
            ) : null}
            <TextInput
              label="Email"
              value={registerEmail}
              placeholder="register email here"
              onChange={(e) => {
                setRegisterEmail(e.target.value);
                validate();
              }}
              mt="md"
              withAsterisk
              // error={emailError ? "Invalid email" : null}
              classNames={emailError ? { input: classes.invalid } : null}
              rightSection={
                emailError ? (
                  <ExclamationTriangleFill
                    stroke={1.5}
                    size={16}
                    className={classes.icon}
                  />
                ) : null
              }
            />
            {emailError ? (
              <Text className={classes.icon}>Invalid email </Text>
            ) : null}

            {/* <GoogleMaps /> */}
            {/* <Maps /> */}
            <TextInput
              type="password"
              sx={{ color: "black" }}
              label="Password"
              value={registerPassword}
              placeholder="Your password"
              mt="md"
              onChange={(e) => {
                setRegisterPassword(e.target.value);
                validate();
              }}
              withAsterisk
              // error={passwordError ? "Invalid password" : null}
              classNames={passwordError ? { input: classes.invalid } : null}
              rightSection={
                passwordError ? (
                  <ExclamationTriangleFill
                    stroke={1.5}
                    size={16}
                    className={classes.icon}
                  />
                ) : null
              }
            />
            {passwordError ? (
              <Text className={classes.icon}>Invalid password </Text>
            ) : null}
            <Box sx={{ paddingTop: "2rem", width: "auto" }}>
              <Text size={"sm"}>Postal Code</Text>
              <GeoAPI
                setLocationError={setLocationError}
                setCounty={setCounty}
                setUserPostcode={setUserPostcode}
                locationError={locationError}
              />
              <Text>{county}</Text>
            </Box>
            <Button fullWidth mt="xl" onClick={register}>
              Register
            </Button>
          </Paper>
        ) : (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="username"
              value={loginUsername}
              placeholder="login username here"
              onChange={(e) => {
                validateLogin();
                setLoginUsername(e.target.value);
              }}
              withAsterisk
              classNames={
                loginUsernameError ? { input: classes.invalid } : null
              }
              rightSection={
                loginUsernameError ? (
                  <ExclamationTriangleFill
                    stroke={1.5}
                    size={16}
                    className={classes.icon}
                  />
                ) : null
              }
            />
            {loginUsernameError ? (
              <Text className={classes.icon}>Invalid username </Text>
            ) : null}
            <TextInput
              type="password"
              label="Password"
              placeholder="Your password"
              onChange={(e) => {
                validateLogin();
                setLoginPassword(e.target.value);
              }}
              required
              mt="md"
              classNames={
                loginPasswordError ? { input: classes.invalid } : null
              }
              rightSection={
                loginPasswordError ? (
                  <ExclamationTriangleFill
                    stroke={1.5}
                    size={16}
                    className={classes.icon}
                  />
                ) : null
              }
              withAsterisk
            />
            {loginPasswordError ? (
              <Text className={classes.icon}>Invalid Password </Text>
            ) : null}

            <Button fullWidth mt="xl" onClick={login} color="black">
              Login
            </Button>
          </Paper>
        )}
      </Container>
    </div>
  );
}
