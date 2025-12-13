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
const hintBtn = document.getElementById("hint-btn");
const hintRow = document.getElementById("hint-row");
const revealedHints = new Set(); // Track revealed indices

hintBtn.addEventListener("click", showHint);

function showHint() {
  // Make sure the target word is set
  if (!gameState.targetWord) return;

  const currentAttempt = gameState.currentAttempt;
  const unknownIndices = [];

  // Collect indices in the current row that are empty and not yet revealed
  for (let i = 0; i < config.wordLength; i++) {
    const cell = document.getElementById(`cell-${currentAttempt}-${i}`);
    if (cell && !cell.textContent && !revealedHints.has(i)) {
      unknownIndices.push(i);
    }
  }

  if (unknownIndices.length === 0) return; // all hints revealed

  // Pick a random unknown letter index
  const randomIndex = unknownIndices[Math.floor(Math.random() * unknownIndices.length)];
  revealedHints.add(randomIndex);

  // Create the hint letter element using the stored target word
  const hintLetter = document.createElement("div");
  hintLetter.className = "letter hint";
  hintLetter.textContent = gameState.targetWord[randomIndex]; // <-- stored word

  // Append to the hint row
  hintRow.appendChild(hintLetter);

  // Animate the hint if desired
  animateElement(hintLetter, "bounceIn");
}


  initWordle();
}

// ===== ROCK PAPER SCISSORS CODE =====
const resultElement = document.getElementById('result');
const player1Btn = document.getElementById('player1-toggle');
const player2Btn = document.getElementById('player2-toggle');
const playGameBtn = document.getElementById('play-game-btn');

if (resultElement) {
  // Track player types: 'human' or 'cpu'
  let player1Type = 'human';
  let player2Type = 'cpu';

  // Track human choices before CPU plays
  let player1Choice = null;
  let player2Choice = null;

  const choices = ['rock', 'paper', 'scissors'];

  // Toggle player type
  function togglePlayer(player) {
    if (player === 1) {
      player1Type = player1Type === 'human' ? 'cpu' : 'human';
      player1Btn.textContent = `Player 1: ${player1Type.toUpperCase()}`;
      player1Choice = null; // Reset choice when switching type
    } else {
      player2Type = player2Type === 'human' ? 'cpu' : 'human';
      player2Btn.textContent = `Player 2: ${player2Type.toUpperCase()}`;
      player2Choice = null;
    }
  }

  player1Btn.addEventListener('click', () => togglePlayer(1));
  player2Btn.addEventListener('click', () => togglePlayer(2));

  // Play a round automatically when both choices are ready
  function checkAndPlay() {
    // Auto-generate CPU choices if needed
    if (player1Type === 'cpu' && !player1Choice) {
      player1Choice = choices[Math.floor(Math.random() * choices.length)];
    }
    if (player2Type === 'cpu' && !player2Choice) {
      player2Choice = choices[Math.floor(Math.random() * choices.length)];
    }

    // Wait for human input if human hasn't chosen yet
    if (!player1Choice || !player2Choice) return;

    let result = '';

    if (player1Choice === player2Choice) {
      result = `It's a tie! Both chose ${player1Choice}.`;
    } else if (
      (player1Choice === 'rock' && player2Choice === 'scissors') ||
      (player1Choice === 'paper' && player2Choice === 'rock') ||
      (player1Choice === 'scissors' && player2Choice === 'paper')
    ) {
      result = `Player 1 wins! ${player1Choice} beats ${player2Choice}.`;
    } else {
      result = `Player 2 wins! ${player2Choice} beats ${player1Choice}.`;
    }

    resultElement.textContent = result;

    // Reset choices for next round
    player1Choice = player1Type === 'human' ? null : player1Choice;
    player2Choice = player2Type === 'human' ? null : player2Choice;
  }

  // Human selects a choice
  function selectChoice(player, choice) {
    if (player === 1 && player1Type === 'human') {
      player1Choice = choice;
    } else if (player === 2 && player2Type === 'human') {
      player2Choice = choice;
    }
    checkAndPlay();
  }

  // Play Game button
  if (playGameBtn) {
    playGameBtn.addEventListener('click', () => {
      // Auto-generate CPU choices if needed
      if (player1Type === 'cpu' && !player1Choice) {
        player1Choice = choices[Math.floor(Math.random() * choices.length)];
      }
      if (player2Type === 'cpu' && !player2Choice) {
        player2Choice = choices[Math.floor(Math.random() * choices.length)];
      }

      // Check if both choices are ready (all CPU or human+CPU)
      if (player1Choice && player2Choice) {
        checkAndPlay();
      } else {
        resultElement.textContent = 'Waiting for human player(s) to choose.';
      }
    });
  }

  // Expose functions globally
  window.selectChoice = selectChoice;
  window.togglePlayer = togglePlayer;
}


// ===== TIC TAC TOE =====
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
