import React, { useRef, useState, useContext, useEffect } from "react";
import "../App.css";
import { socket, UserContext } from "../App";
import IndividualMessage from "./IndividualMessage";
import { Button } from "@mantine/core";
// function ChatroomFE() {
//   const [user] = useAuthState(auth);

//   return (
//     <div className="App">
//       <header>
//         <h1>⚛️🔥💬</h1>
//         <SignOut />
//       </header>

//       <section>{user ? <ChatRoom /> : <SignIn />}</section>
//     </div>
//   );
// }

function ChatroomFE(props) {
  // joe user id 63467dd7c61a8bfba36f341d
  // darren user id 63453109c61a8bfba3dee895
  const userData = useContext(UserContext);
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [messagesEg, setMessagesEg] = useState([
    { text: "HELLO by Darren", uid: "63453109c61a8bfba3dee895" },
    { text: "MSG1 by Joe", uid: "63467dd7c61a8bfba36f341d" },
    { text: "MSG2 by Darren", uid: "63453109c61a8bfba3dee895" },
    { text: "MSG3 by Joe", uid: "63467dd7c61a8bfba36f341d" },
  ]);
  //  const messagesEg = [
  //    { text: "HELLO by Darren", uid: "63453109c61a8bfba3dee895" },
  //    { text: "MSG1 by Joe", uid: "63467dd7c61a8bfba36f341d" },
  //    { text: "MSG2 by Darren", uid: "63453109c61a8bfba3dee895" },
  //    { text: "MSG3 by Joe", uid: "63467dd7c61a8bfba36f341d" },
  //  ];
  useEffect(() => {
    console.log(messages, "messages");
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    //AXIOS REQ TO BE here
    setMessagesEg((prevState) => [
      ...prevState,
      { text: formValue, uid: userData._id },
    ]);
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="ChatContainer"
      style={{
        marginLeft: props.drawerOpen ? "26vw" : "3vw",
      }}
    >
      <div className="section">
        <main>
          {messagesEg &&
            messagesEg.map((msg, index) => (
              <IndividualMessage key={index} message={msg} />
            ))}

          <span ref={dummy}></span>
        </main>
      </div>

      <form onSubmit={sendMessage} className="chatForm">
        <input
          className="chatInput"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="send a message here"
        />

        <button className="formButton" type="submit" disabled={!formValue}>
          {"Send"}
        </button>
      </form>
      <div className="listing">
        <p style={{ color: "black" }}>
          listing item id:123
          <br />
          listing item title: abc
          <br />
          listing item type: sharing
          <br />
          chatroomId:12341351390185013
        </p>
      </div>
    </div>
  );
}
// import React, { useRef, useState, useContext } from "react";
// import {UserContext } from "../App";
// function ChatMessage(props) {
//   const { text, uid, photoURL } = props.message;
// const userData = useContext(UserContext);
//   const messageClass = uid === userData._id ? "sent" : "received";

//   return (
//     <>
//       <div className={`message ${messageClass}`}>
//         <img
//           src={
//            "https://api.adorable.io/avatars/23/abott@adorable.png"
//           }
//         />
//         <p>{text}</p>
//       </div>
//     </>
//   );
// }

export default ChatroomFE;
