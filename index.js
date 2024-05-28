const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 8080;
const rooms = {};

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("createGame", () => {
    const roomUniqueId = makeId(5);
    rooms[roomUniqueId] = {};
    socket.join(roomUniqueId);
    socket.emit("newGame", { roomUniqueId: roomUniqueId });
  });

  socket.on("joinGame", (data) => {
    const room = rooms[data.roomUniqueId];
    if (room) {
      socket.join(data.roomUniqueId);
      socket.to(data.roomUniqueId).emit("playersConnected", { data: "p1" });
      socket.emit("playersConnected", { data: "p2" });
    }
  });

  socket.on("p1Choice", (data) => {
    const room = rooms[data.roomUniqueId];
    room.p1Choice = data.rpsChoice;
    socket
      .to(data.roomUniqueId)
      .emit("p1Choice", { rpsChoice: data.rpsChoice });
    if (room.p2Choice) {
      declareWinner(data.roomUniqueId);
    }
  });

  socket.on("p2Choice", (data) => {
    const room = rooms[data.roomUniqueId];
    room.p2Choice = data.rpsChoice;
    socket
      .to(data.roomUniqueId)
      .emit("p2Choice", { rpsChoice: data.rpsChoice });
    if (room.p1Choice) {
      declareWinner(data.roomUniqueId);
    }
  });
});

function declareWinner(roomUniqueId) {
  const room = rooms[roomUniqueId];
  const p1 = room.p1Choice;
  const p2 = room.p2Choice;
  let winner;

  if (p1 === p2) {
    winner = "d";
  } else if (
    (p1 === "Paper" && p2 === "Rock") ||
    (p1 === "Rock" && p2 === "Scissor") ||
    (p1 === "Scissor" && p2 === "Paper")
  ) {
    winner = "p1";
  } else {
    winner = "p2";
  }

  io.to(roomUniqueId).emit("result", { winner: winner });

  room.p1Choice = null;
  room.p2Choice = null;
}

function makeId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
