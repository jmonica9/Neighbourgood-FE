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
} from "@mantine/core";
import React, { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BACKEND_URL } from "./constants";

export function Authentication(props) {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const [jwtUser, setJwtUser] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState(null);
  const REGISTER_MODE = "Register";
  const LOGIN_MODE = "Login";
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(REGISTER_MODE);
  // access user info on load
  useEffect(() => {
    console.log("get my user info, useeffect!");
    checkJWT();
  }, []);

  useEffect(() => {
    if (jwtUser !== null) {
      console.log(jwtUser, "use effect jwt user");
      setWelcomeMsg(`You are logged in. Welcome back ${jwtUser} `);
    }
  }, [jwtUser]);

  const register = () => {
    console.log(authMode, "authmode");
    Axios({
      method: "POST",
      data: {
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
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
  };

  const login = () => {
    console.log(authMode, "authmode");
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
    });
  };
  // const getAllUsers = async () => {
  //   await Axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `${BACKEND_URL}/auth/users`,
  //   }).then((res) => {
  //     setAllUsers(res.data);
  //     console.log(res.data);
  //   });
  // };

  // const getMyUser = async () => {
  //   await Axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: `${BACKEND_URL}/auth/myUser`,
  //   }).then((res) => {
  //     setMyUser(res.data);
  //     console.log(res.data);
  //   });
  // };

  const checkJWT = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${BACKEND_URL}/auth/jwtUser`,
    }).then((res) => {
      console.log(res.data);
      setJwtUser(res.data.username);
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
      <Container size={420} my={40}>
        <Title align="center">
          {jwtUser !== undefined ? welcomeMsg : "please log in"}
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
              label="username"
              value={registerUsername}
              placeholder="register username here"
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            <TextInput
              label="email"
              value={registerEmail}
              placeholder="register email here"
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              mt="md"
            />

            <Button fullWidth mt="xl" onClick={register}>
              Register
            </Button>

            <Button onClick={logout}>Log Out</Button>
          </Paper>
        ) : (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="username"
              value={loginUsername}
              placeholder="login username here"
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              mt="md"
            />

            <Button fullWidth mt="xl" onClick={login}>
              Login
            </Button>

            <Button onClick={logout}>Log Out</Button>
          </Paper>
        )}
      </Container>
    </div>
  );
}
