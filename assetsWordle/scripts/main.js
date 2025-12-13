// main.js
import { checkGuess, config, gameState, initializeGame } from "./game.js";

// ===== WORDLE CODE =====
const grid = document.getElementById("wordle-grid");
const GameResultParagraph = document.getElementById("game-result");

if (grid && GameResultParagraph) {
  function createTile(row, col) {
    const tile = document.createElement("div");
    tile.className = "letter";
    tile.id = `cell-${row}-${col}`;
    tile.setAttribute("data-row", row);
    tile.setAttribute("data-col", col);
    grid.appendChild(tile);
  }

  function setupGrid() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${config.wordLength}, 60px)`;

    for (let row = 0; row < config.maxAttempts; row++) {
      for (let col = 0; col < config.wordLength; col++) {
        createTile(row, col);
      }
    }
  }

  function isLetter(letter) {
    return letter.length === 1 && /[a-z]/i.test(letter);
  }

  function handleKeyDown(e) {
    if (isLetter(e.key)) {
      addLetter(e.key);
    } else if (e.key === "Backspace") {
      removeLetter();
    } else if (e.key === "Enter") {
      submitGuess();
    }
  }

  function addLetter(letter) {
    if (gameState.currentPosition < config.wordLength) {
      const cell = document.getElementById(
        `cell-${gameState.currentAttempt}-${gameState.currentPosition}`
      );
      if (cell) {
        cell.textContent = letter.toLowerCase();
        animateElement(cell, "bounceIn");
        gameState.currentPosition++;
      }
    }
  }

  function removeLetter() {
    if (gameState.currentPosition > 0) {
      gameState.currentPosition--;
      const cell = document.getElementById(
        `cell-${gameState.currentAttempt}-${gameState.currentPosition}`
      );
      if (cell) cell.textContent = "";
    }
  }

  function animateElement(element, animation) {
    element.classList.add("animate__animated", `animate__${animation}`);
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove("animate__animated", `animate__${animation}`);
      },
      { once: true }
    );
  }

  async function submitGuess() {
    if (gameState.currentPosition < config.wordLength) {
      shakeRow();
      return;
    }

    const rowTiles = document.querySelectorAll(
      `[data-row="${gameState.currentAttempt}"]`
    );

    const userGuess = Array.from(rowTiles)
      .map((tile) => tile.textContent)
      .join("")
      .toLowerCase();

    const results = await checkGuess(userGuess);
    if (!results) {
      shakeRow();
      return;
    }

    revealResults(results);

    const isWon = results.every((r) => r === "correct");
    if (isWon) {
      showMessage("You Won 🎉");
      lockInput();
      return;
    }

    gameState.currentAttempt++;
    gameState.currentPosition = 0;

    const isLost = gameState.currentAttempt >= config.maxAttempts;
    if (isLost) {
      lockInput();
      showMessage("Game Over! The word was: " + gameState.targetWord);
    }
  }

  function revealResults(results) {
    const delay = 300;
    results.forEach((result, col) => {
      const cell = document.getElementById(
        `cell-${gameState.currentAttempt}-${col}`
      );
      setTimeout(() => {
        animateElement(cell, "flipInX");
        cell.classList.add(result);
      }, col * delay);
    });
  }

  function shakeRow() {
    const rowTiles = document.querySelectorAll(
      `[data-row="${gameState.currentAttempt}"]`
    );
    rowTiles.forEach((tile) => animateElement(tile, "shakeX"));
  }

  function showMessage(msg) {
    GameResultParagraph.textContent = msg;
  }

  function lockInput() {
    document.removeEventListener("keydown", handleKeyDown);
  }

  // Start Wordle game
  async function initWordle() {
    await initializeGame();
    setupGrid();
    document.addEventListener("keydown", handleKeyDown);
  }

  initWordle();
}

// ===== ROCK PAPER SCISSORS CODE =====
const resultElement = document.getElementById('result');

if (resultElement) {
  function play(userChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';

    if (userChoice === computerChoice) {
      result = `It's a tie! You both chose ${userChoice}.`;
    } else if (
      (userChoice === 'rock' && computerChoice === 'scissors') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = `You win! ${userChoice} beats ${computerChoice}.`;
    } else {
      result = `You lose! ${computerChoice} beats ${userChoice}.`;
    }

    resultElement.textContent = result;
  }

  window.play = play;
}

// ===== MEMORY CARDS CODE =====
const ticCells = document.querySelectorAll('.cell');
const ticStatus = document.getElementById('tic-status');
const ticResetButton = document.getElementById('tic-reset');

if (ticCells.length && ticStatus && ticResetButton) {

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;

  // Who is Player or CPU
  let playerTypes = { X: "Player", O: "CPU" }; // default: X is Player, O is CPU

  // Score tracking
  let scores = { X: 0, O: 0 };

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // ----- Create Buttons to toggle X and O -----
  const xButton = document.createElement('button');
  xButton.textContent = "X: Player";
  xButton.style.marginRight = "10px";

  const oButton = document.createElement('button');
  oButton.textContent = "O: CPU";

  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginBottom = "10px";
  buttonContainer.appendChild(xButton);
  buttonContainer.appendChild(oButton);
  document.body.insertBefore(buttonContainer, ticStatus);

  xButton.addEventListener('click', () => {
    playerTypes.X = playerTypes.X === "Player" ? "CPU" : "Player";
    xButton.textContent = `X: ${playerTypes.X}`;
    if (currentPlayer === "X" && playerTypes.X === "CPU") cpuMove();
  });

  oButton.addEventListener('click', () => {
    playerTypes.O = playerTypes.O === "Player" ? "CPU" : "Player";
    oButton.textContent = `O: ${playerTypes.O}`;
    if (currentPlayer === "O" && playerTypes.O === "CPU") cpuMove();
  });

  // ----- Create Scoreboard -----
  const scoreBoard = document.createElement('div');
  scoreBoard.style.marginBottom = "15px";
  scoreBoard.textContent = `Score - X: ${scores.X} | O: ${scores.O}`;
  document.body.insertBefore(scoreBoard, buttonContainer);

  function updateScoreboard() {
    scoreBoard.textContent = `Score - X: ${scores.X} | O: ${scores.O}`;
  }

  // ----- Handle Cell Click -----
  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] !== "" || !gameActive) return;
    if (playerTypes[currentPlayer] === "CPU") return; // ignore clicks on CPU turn

    makeMove(index);
  }

  function makeMove(index) {
    board[index] = currentPlayer;
    ticCells[index].textContent = currentPlayer;
    checkWinner();
  }

  // ----- CPU Move -----
  function cpuMove() {
    if (!gameActive || playerTypes[currentPlayer] === "Player") return;

    const emptyCells = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    setTimeout(() => {
      makeMove(move);
    }, 300); // delay to simulate thinking
  }

  // ----- Check Winner -----
  function checkWinner() {
    for (let [a, b, c] of winningConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        ticStatus.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;

        // Update score
        scores[currentPlayer]++;
        updateScoreboard();
        return;
      }
    }

    if (!board.includes("")) {
      ticStatus.textContent = "It's a tie!";
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    ticStatus.textContent = `${currentPlayer}'s turn (${playerTypes[currentPlayer]})`;

    // If CPU turn, make auto move
    if (playerTypes[currentPlayer] === "CPU") cpuMove();
  }

  // ----- Reset Game -----
  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    ticCells.forEach(cell => cell.textContent = "");
    ticStatus.textContent = `${currentPlayer}'s turn (${playerTypes[currentPlayer]})`;

    if (playerTypes[currentPlayer] === "CPU") cpuMove();
  }

  ticCells.forEach(cell => cell.addEventListener('click', handleCellClick));
  ticResetButton.addEventListener('click', resetGame);

  // Initial CPU move if X is CPU
  if (playerTypes[currentPlayer] === "CPU") cpuMove();
}
