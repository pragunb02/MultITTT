console.log("RUNNING");
const socket = io();

let roomUniqueId;
let player1 = false;
let playerName;

function createGame() {
  player1 = true;
  playerName = document.getElementById("playerName").value;
  if (!playerName) {
    alert("Please enter your name");
    return;
  }
  socket.emit("createGame", { playerName: playerName });
}

function joinGame() {
  roomUniqueId = document.getElementById("roomUniqueId").value;
  playerName = document.getElementById("playerName").value;
  if (!roomUniqueId || !playerName) {
    alert("Please enter both room code and your name");
    return;
  }
  socket.emit("joinGame", {
    roomUniqueId: roomUniqueId,
    playerName: playerName,
  });
}

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
  document.getElementById("initial").style.display = "none";
  document.getElementById("gamePlay").style.display = "block";
  const waitingArea = document.getElementById("waitingArea");
  if (waitingArea) {
    waitingArea.innerHTML = `Waiting For Opponent, Please share code ${roomUniqueId}`;
  }
});

socket.on("playersConnected", (data) => {
  console.log("Players connected:", data);
  document.getElementById("waitingArea").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("initial").style.display = "none";
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
  } else if (data.winner === "p1") {
    winner = player1 ? "You Win" : "You lose";
  } else {
    winner = player1 ? "You lose" : "You Win";
  }
  document.getElementById("opponentState").style.display = "none";
  document.getElementById("opponentButton").style.display = "block";
  document.getElementById("winnerArea").innerHTML = winner;
});

function sendChoice(rpsChoice) {
  const choiceEvent = player1 ? "p1Choice" : "p2Choice";
  socket.emit(choiceEvent, {
    rpsChoice: rpsChoice,
    roomUniqueId: roomUniqueId,
  });
  const playerChoiceButton = document.createElement("button");
  playerChoiceButton.style.display = "block";
  playerChoiceButton.innerText = rpsChoice;
  document.getElementById("player1Choice").innerHTML = "";
  document.getElementById("player1Choice").appendChild(playerChoiceButton);
}

function createOpponentChoiceButton(data) {
  document.getElementById("opponentState").innerHTML = "Opponent Made A Choice";
  const opponentButton = document.createElement("button");
  opponentButton.id = "opponentButton";
  opponentButton.style.display = "none";
  opponentButton.innerText = data.rpsChoice;
  document.getElementById("player2Choice").appendChild(opponentButton);
}
