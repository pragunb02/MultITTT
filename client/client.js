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
  console.log("Join Game");
  socket.emit("joinGame", { roomUniqueId: roomUniqueId });
}

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
  document.getElementById("initial").style.display = "none";
  document.getElementById("gamePlay").style.display = "block";

  let copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy Code";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(roomUniqueId).then(
      function () {
        console.log("Done Copying Code");
      },
      function (err) {
        console.log("error in copying");
      }
    );
  });
  document.getElementById(
    "waitingArea"
  ).innerHTML = `Waiting For Oppenent ,Please share code  ${roomUniqueId} to `;
  document.getElementById("waitingArea").appendChild(copyBtn);
});

socket.on("playersConnected", (datas) => {
  console.log("Excectued", datas.data);
  document.getElementById("waitingArea").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("initial").style.display = "none";
});
