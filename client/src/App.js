/*
* PROJECT: sql-react-chat
* DESCRIPTION: A MySQL-based chatting website made with react js, express and socket.io.
* AUTHOR: Vahin Sharma
* DOI & DOC: 11-May-2021
*/

import React, {useState, useEffect} from "react";
import './App.css';
import socketIOClient from "socket.io-client";
import MessageBody from './components/MessageBody.js';

const endPoint = "http://" + window.location.hostname + ":4001";

const socket = socketIOClient(endPoint, {transports: ['websocket', 'polling', 'flashsocket']});

let id = "";

if (document.cookie == "") {
  id = prompt("Please enter your username");
  document.cookie = `{"name":"${id}"}`;
} else {
  id = JSON.parse(document.cookie).name;
}

function App() {  
  const [messageList, setMessageList] = useState([]);
  const [messageBoxValue, setMessageBoxValue] = useState("");
  
  useEffect(() => {
    socket.on("connection", data => {
      console.log("connected!");
    })
    
    socket.on("receiveMessage", receivedMsg => {
      setMessageList(prevMessages => [...prevMessages, receivedMsg]);
    })
    
    socket.on("loadMsgs", data => {
      setMessageList(data);
    })
  }, [socket]);
  
  const handleMessageBoxValue = (e) => {
    setMessageBoxValue(e.target.value);
  }
  
  const handleMessageBoxKeyDown = (e) => {
    if (e.which === 13) {
      const message = messageBoxValue;
      if (message !== "") {
        setMessageBoxValue("");
        const msgFormatted = `[${id}]: ${message}`;
        socket.emit("msg", msgFormatted);
        setMessageList(prevMessages => [...prevMessages, msgFormatted]);
      }
    }
  }
  
  return (
    <div className="App">
      <div id="messageBodyContainer">
        <MessageBody messageList={messageList}/>
      </div>
      <div id="messageBoxContainer">
        <input type="text" id="messageBox" value={messageBoxValue} onChange={handleMessageBoxValue}
        onKeyDown={handleMessageBoxKeyDown} autoFocus="on" />
      </div>
    </div>
  );
}

export default App;