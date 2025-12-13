import { checkGuess, config, gameState, initializeGame } from "./game.js";

const grid = document.getElementById("wordle-grid");
const GameResultParagraph = document.getElementById("game-result");

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
    if (cell) {
      cell.textContent = "";
    }
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

// Start the game AFTER initializing
async function init() {
  await initializeGame();
  setupGrid();
  document.addEventListener("keydown", handleKeyDown);
}
export function play(userChoice) {
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

  const resultElement = document.getElementById('result');
  if (resultElement) resultElement.textContent = result;
}


init();
