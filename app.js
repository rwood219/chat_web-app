const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
const { text } = require("express");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
//set static
app.use(express.static(path.join(__dirname + "/public")));

const chatBot = "Chat Bot";

//runn when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome user
    socket.emit("message", formatMessage(chatBot, "welcome to chat"));

    //broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("chatBot", `${username} has joined the chat`)
      );
      
    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //runs when disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("chatBot", `${user.username} has left the chat`)
      );
        //send users and room info
    io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`app running on ${PORT}`));
