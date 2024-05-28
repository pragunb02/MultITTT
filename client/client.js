console.log("RUNNING");
const socket = io();
// Customize the connection URL in io() if the server runs on a different host or port.
// no need of server path
let roomUniqueId;
let player1 = false;

function createGame() {
  player1 = true;
  socket.emit("createGame");
}

function joinGame() {
  roomUniqueId = document.getElementById("roomUniqueId").value;
  console.log("Join Game");
  socket.emit("joinGame", { roomUniqueId: roomUniqueId });
}

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
  const initial = document.getElementById("initial");
  const gamePlay = document.getElementById("gamePlay");
  if (initial) initial.style.display = "none";
  if (gamePlay) gamePlay.style.display = "block";

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
  const waitingArea = document.getElementById("waitingArea");
  if (waitingArea) {
    waitingArea.innerHTML = `Waiting For Opponent, Please share code ${roomUniqueId} `;
    waitingArea.appendChild(copyBtn);
  }
});

socket.on("playersConnected", (datas) => {
  console.log("Executed", datas.data);
  const waitingArea = document.getElementById("waitingArea");
  const gameArea = document.getElementById("gameArea");
  const initial = document.getElementById("initial");
  if (waitingArea) waitingArea.style.display = "none";
  if (gameArea) gameArea.style.display = "block";
  if (initial) initial.style.display = "none";
});

socket.on("p1Choice", (data) => {
  if (!player1) {
    createOpponentChoiceButton(data);
  }
});

socket.on("p2Choice", (data) => {
  if (player1) {
    createOpponentChoiceButton(data);
  }
});

socket.on("result", (data) => {
  let winner = "";
  if (data.winner === "d") {
    winner = "It's a draw";
  } else {
    if (data.winner === "p1") {
      winner = player1 === true ? "You Win" : "You lose";
    } else {
      winner = player1 === false ? "You Win" : "You lose";
    }
  }
  const opponentState = document.getElementById("opponentState");
  const opponentButton = document.getElementById("opponentButton");
  const winnerArea = document.getElementById("winnerArea");
  if (opponentState) opponentState.style.display = "none";
  if (opponentButton) opponentButton.style.display = "block";
  if (winnerArea) winnerArea.innerHTML = winner;
});

function sendChoice(rpsChoice) {
  const choiceEvent = player1 ? "p1Choice" : "p2Choice";
  socket.emit(choiceEvent, {
    rpsChoice: rpsChoice,
    roomUniqueId: roomUniqueId,
  });
  let playerChoiceButton = document.createElement("button");
  playerChoiceButton.style.display = "block";
  playerChoiceButton.innerText = rpsChoice;
  const player1Choice = document.getElementById("player1Choice");
  if (player1Choice) {
    player1Choice.innerHTML = "";
    player1Choice.appendChild(playerChoiceButton);
  }
}

function createOpponentChoiceButton(data) {
  console.log("happend");
  const opponentState = document.getElementById("opponentState");
  if (opponentState) opponentState.innerHTML = "Opponent Made A Choice";
  let opponentButton = document.createElement("button");
  opponentButton.id = "opponentButton";
  opponentButton.style.display = "none";
  opponentButton.innerText = data.rpsChoice;
  const player2Choice = document.getElementById("player2Choice");
  if (player2Choice) {
    player2Choice.appendChild(opponentButton);
  }
}
