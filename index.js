const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const path = require("path");

const PORT = 8080;

const { Server } = require("socket.io");
const io = new Server(server);

const rooms = {};

app.use(express.static(path.join(__dirname, "client")));

app.get("/HelloWorld", (req, res) => {
  res.send("HelloWorld");
});

app.get("/HelloWorld1", (req, res) => {
  res.send("<h1>HelloWorld</h1>");
});

app.get("/HelloWorld2", (req, res) => {
  res.json({ message: "HelloWorld2" });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.on("connection", (socket) => {
  console.log("A user is Connected");

  socket.on("disconnect", () => {
    console.log("user Disconnected");
  });
  socket.on("createGame", () => {
    const roomUniqueId = makeid(5);
    rooms[roomUniqueId] = {};
    socket.join(roomUniqueId);
    socket.emit("newGame", { roomUniqueId: roomUniqueId });
  });
  socket.on("joinGame", (data) => {
    if (rooms[data.roomUniqueId] != null) {
      socket.join(data.roomUniqueId);
      socket.to(data.roomUniqueId).emit("playersConnected", { data: "p1" });
      socket.emit("playersConnected", { data: "p2" });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// // alter way
// function startServer() {
//   console.log("Hello");
// }
// server.listen(PORT, startServer);

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
