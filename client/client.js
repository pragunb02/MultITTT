console.log("RUNNING");
const socket = io();
// Customize the connection URL in io() if the server runs on a different host or port.
// no need of server path
let roomUniqueId;

function createGame() {
  socket.emit("createGame");
}

function joinGame() {
  roomUniqueId = document.getElementById("roomUniqueId").value;
  socket.emit("joinGame", { roomUniqueId: roomUniqueId });
}

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
});
