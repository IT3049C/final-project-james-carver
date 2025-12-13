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

  // Make it globally accessible for onclick buttons
  window.play = play;
}

// ===== MEMORY CARDS CODE =====
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");

if (game && startBtn && statusText) {
  const gridSize = 16;

  let sequence = [];
  let playerSequence = [];
  let canClick = false;

  // Create grid
  const cards = [];
  game.innerHTML = ""; // safety reset

  for (let i = 0; i < gridSize; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;
    card.addEventListener("click", () => handleClick(i));
    game.appendChild(card);
    cards.push(card);
  }

  startBtn.addEventListener("click", startGame);

  function startGame() {
    sequence = [];
    playerSequence = [];
    statusText.textContent = "Watch the pattern";
    nextRound();
  }

  function nextRound() {
    playerSequence = [];
    canClick = false;
    statusText.textContent = `Round ${sequence.length + 1}`;

    const next = Math.floor(Math.random() * gridSize);
    sequence.push(next);

    playSequence();
  }

  function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
      flash(cards[sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        canClick = true;
      }
    }, 600);
  }

  function flash(card) {
    card.classList.add("active");
    setTimeout(() => card.classList.remove("active"), 300);
  }

  function handleClick(index) {
    if (!canClick) return;

    playerSequence.push(index);
    flash(cards[index]);

    const current = playerSequence.length - 1;

    if (playerSequence[current] !== sequence[current]) {
      statusText.textContent = "Game Over!";
      canClick = false;
      return;
    }

    if (playerSequence.length === sequence.length) {
      setTimeout(nextRound, 800);
    }
  }
}

