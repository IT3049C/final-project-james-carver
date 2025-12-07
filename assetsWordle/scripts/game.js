export const config = {
  wordLength: 5,
  maxAttempts: 6,
};

export const gameState = {
  currentAttempt: 0,
  currentPosition: 0,
  targetWord: null,
};

// Fetch a random word
export async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${config.wordLength}`
  );
  const data = await response.json();
  return data[0];
}

// Initialize the game
export async function initializeGame() {
  gameState.targetWord = await getRandomWord();
}

// Check if guess is valid and evaluate result
export async function checkGuess(guess) {
  const isValid = await isValidWord(guess.toLowerCase());

  if (!isValid) {
    console.error("Invalid word");
    return null;
  }

  const targetLetters = gameState.targetWord.toLowerCase().split("");
  const guessLetters = guess.toLowerCase().split("");

  return guessLetters.map((letter, index) => {
    if (letter === targetLetters[index]) {
      return "correct";
    } else if (targetLetters.includes(letter)) {
      return "misplaced";
    } else {
      return "incorrect";
    }
  });
}

// Word validation using external dictionary API
async function isValidWord(word) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return response.ok;
}
