import React from "react";
import "./App.css";
import { useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function AuthForm() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const [jwtUser, setJwtUser] = useState(null);
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
    }).then((res) => console.log(res));
  };
  const getAllUsers = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/users",
    }).then((res) => {
      setAllUsers(res.data);
      console.log(res.data);
    });
  };
  const getMyUser = () => {
    Axios({
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

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Register</h1>
          <input
            placeholder="username"
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <input
            placeholder="password"
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button onClick={register}>Submit</button>
        </div>

        <div>
          <h1>Login</h1>
          <input
            placeholder="username"
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            placeholder="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={login}>Submit</button>
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
      </header>
    </div>
  );
}

export default AuthForm;
