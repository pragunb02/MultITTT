const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const path = require("path");

const PORT = 8080;

const { Server } = require("socket.io");
const io = new Server(server);

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
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// // alter way
// function startServer() {
//   console.log("Hello");
// }
// server.listen(PORT, startServer);
