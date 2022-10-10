import React from "react";
import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import axios from "axios";

//import styling
import { neighbourgoodTheme } from "../styles/Theme";
import { Header, Text } from "@mantine/core";

function AuthForm(props) {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);
  // delete this during merge
  const [currentUser, setCurrentUser] = useState(null);
  // end of delete portion
  const navigate = useNavigate();

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
  const login = async () => {
    const response = await axios.post("http://localhost:3001/login", {
      username: loginUsername,
      password: loginPassword,
    });
    await props.signIn(response.data);
    // await Axios({
    //   method: "POST",
    //   data: {
    //     username: loginUsername,
    //     password: loginPassword,
    //   },
    //   withCredentials: true,
    //   url: "http://localhost:3001/login",
    // }).then((res) => setCurrentUser(res.data));
    // await props.signIn(currentUser);
  };
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/users",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  return (
    <div className="App">
      <header className="App-header">
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
          <Text size={"xl"} color="black">
            Get User
          </Text>
          <button onClick={getUser}>Submit</button>
          {data ? (
            <Text color="black">
              Welcome Back{" "}
              {data.map((item) => {
                return item.username;
              })}
            </Text>
          ) : null}
        </div>
        <button
          onClick={() => {
            console.log("clicked");
            navigate("dashboard");
          }}
        >
          Dashboard
        </button>
      </header>
    </div>
  );
}

export default AuthForm;
