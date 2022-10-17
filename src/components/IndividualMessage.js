import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import "../App.css";
export default function IndividualMessage(props) {
  const { text, uid } = props.message;
  const userData = useContext(UserContext);
  const [messageClass, setMessageClass] = useState();

  useEffect(() => {
    if (userData) {
      const msgClass = uid === userData?._id ? "sent" : "received";
      console.log(userData._id);
      console.log(uid);
      setMessageClass(msgClass);
      console.log(msgClass, "MSG CLASS");
    }
  }, [props, userData]);

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={"https://api.adorable.io/avatars/23/abott@adorable.png"}
          alt="userpic"
        />
        <p>{text}</p>
      </div>
    </>
  );
}
