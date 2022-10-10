import React, { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";

//import styling
import { neighbourgoodTheme } from "../styles/Theme";
import { Header, Text } from "@mantine/core";

function AuthForm(props) {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const [jwtUser, setJwtUser] = useState(null);
  const [welcomeMsg, setWelcomeMsg] = useState(null);

  // access user info on load
  useEffect(() => {
    console.log("get my user info, useeffect!");
    checkJWT();
  }, []);

  useEffect(() => {
    if (jwtUser !== null) {
      setWelcomeMsg(`You are logged in. Welcome back ${jwtUser} `);
    }
  }, [jwtUser]);

  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/register",
    }).then((res) => console.log(res));
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/login",
    }).then((res) => {
      console.log(res);
      toast.success("You have logged in!", {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    });
  };
  const getAllUsers = async () => {
    await Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/users",
    }).then((res) => {
      setAllUsers(res.data);
      console.log(res.data);
    });
  };

  const getMyUser = async () => {
    await Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/myUser",
    }).then((res) => {
      setMyUser(res.data);
      console.log(res.data);
    });
  };

  const checkJWT = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/protectedbyjwt",
    }).then((res) => {
      console.log(res.data);
      setJwtUser(res.data.username);
    });
  };

  const logout = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/logout",
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
    <div className="App">
      <header className="App-header">
        <div>
          <h1>{jwtUser !== null ? welcomeMsg : "please log in"}</h1>
        </div>
        <div>
          <Text size={"xl"} color="black">
            Register
          </Text>
          <input
            placeholder="username"
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <input
            placeholder="password"
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button onClick={register}>Register</button>
        </div>

        <div>
          <Text size={"xl"} color="black">
            Login
          </Text>
          <input
            placeholder="username"
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>

        <div>
          <h1>Get All Users</h1>
          <button onClick={getAllUsers}>Submit</button>
          {allUsers ? (
            <h6>
              All users:
              <ul>
                {allUsers.map((item) => (
                  <li>{item.username}</li>
                ))}
              </ul>{" "}
            </h6>
          ) : null}
        </div>
        <div>
          <h1>Get My User</h1>
          <h6>using passport authentication methods</h6>
          <button onClick={getMyUser}>Get</button>
          {myUser ? <h1>Welcome Back {myUser.username}</h1> : null}
        </div>
        <button onClick={checkJWT}>Check JWT if authorized</button>
        <h6>using jwt token from cookies to access protected user info</h6>
        {jwtUser && jwtUser}
        <br></br>
        <button onClick={logout}>Log Out</button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
        />
      </header>
    </div>
  );
}

export default AuthForm;
