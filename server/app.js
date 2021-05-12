const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 4001;
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "HOST",
  user: "USERNAME",
  password: "PASSWORD",
  database: "DATABASE"
});

con.connect(err => {
  if (err) throw err;
  console.log("Connected!");
  
  io.on("connection", (socket) => {
    console.log("New user connected");
    
    con.query("SELECT * FROM messages", (err, result) => {
      if (err) throw err;
      console.log(result);
      let toEmit = [];
      for (const item in result) {
        toEmit.push(result[item].msg);
      }
      socket.emit('loadMsgs', toEmit);
    });
    
    socket.on("msg", (msg) => {
      // console.log("MSG GOT");
      socket.broadcast.emit("receiveMessage", data);
      con.query(`INSERT INTO messages (msg) VALUES ('${msg}')`, (err, result) => {
        if (err) throw err;
        console.log("inserted!");
      });
      // console.log(data);
    });
    
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
});

server.listen(port, () => console.log(`Listening to port ${port}`));