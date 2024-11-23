const cells = document.querySelectorAll(".cell");
const playerScoreEl = document.getElementById("player-score");
const tieScoreEl = document.getElementById("tie-score");
const computerScoreEl = document.getElementById("computer-score");

let playerTurn = true;
let board = ["", "", "", "", "", "", "", "", ""];
let playerScore = 0;
let tieScore = 0;
let computerScore = 0;

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Rematch button
let rematchButton;

// Handle user clicks
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (playerTurn && !cell.textContent) {
      board[index] = "X";
      cell.textContent = "X";
      cell.classList.add("taken");
      playerTurn = false;

      // Add a short delay before checking for win/tie and computer's move
      setTimeout(() => {
        if (checkWin("X")) {
          updateScore("player");
        } else if (board.includes("")) {
          setTimeout(computerMove, 500); // Add 500ms delay for computer's move
        } else {
          updateScore("tie");
        }
      }, 200);
    }
  });
});

// Computer's move with logic
function computerMove() {
  let move = findBestMove("O");
  if (move === null) {
    move = findBestMove("X");
  }
  if (move === null) {
    const availableCells = board
      .map((val, idx) => (val === "" ? idx : null))
      .filter((val) => val !== null);
    move = availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  // Update the board immediately
  board[move] = "O";
  cells[move].textContent = "O";
  cells[move].classList.add("taken");

  // Use a short delay to check for win/tie after move
  setTimeout(() => {
    if (checkWin("O")) {
      updateScore("computer");
    } else if (!board.includes("")) {
      updateScore("tie");
    } else {
      playerTurn = true;
    }
  }, 200); // 200ms delay for smoother updates
}

// Find the best move for a player (win or block)
function findBestMove(player) {
  for (let [a, b, c] of winningCombinations) {
    if (board[a] === player && board[b] === player && board[c] === "") return c;
    if (board[a] === player && board[c] === player && board[b] === "") return b;
    if (board[b] === player && board[c] === player && board[a] === "") return a;
  }
  return null;
}

// Check win
function checkWin(player) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === player);
  });
}

// Update score and display rematch button
function updateScore(winner) {
  if (winner === "player") {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    alert("Player wins!");
  } else if (winner === "computer") {
    computerScore++;
    computerScoreEl.textContent = computerScore;
    alert("Computer wins!");
  } else if (winner === "tie") {
    tieScore++;
    tieScoreEl.textContent = tieScore;
    alert("It's a tie!");
  }

  // Show rematch button
  displayRematchButton();
}

// Display the rematch button
function displayRematchButton() {
  if (!rematchButton) {
    rematchButton = document.createElement("button");
    rematchButton.textContent = "Rematch";
    rematchButton.classList.add("rematch-button");
    document.querySelector(".game-container").appendChild(rematchButton);

    rematchButton.addEventListener("click", () => {
      resetBoard();
      rematchButton.remove();
      rematchButton = null;
    });
  }
}

// Reset the board for a new match
function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  playerTurn = true;
}
