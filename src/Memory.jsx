import { useState } from "react";
import "./Memory.css";

const GRID_SIZE = 16;
const FLASH_TIME = 400;
const SEQUENCE_DELAY = 600;

export default function Memory() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState("Click Start");
  const [gameOver, setGameOver] = useState(false); // new
  const [scoreMessage, setScoreMessage] = useState(""); // new

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setRound(0);
    setStatus("Watch the pattern");
    setGameOver(false);
    setScoreMessage("");
    setTimeout(() => nextRound([]), 300);
  };

  const nextRound = (prevSequence) => {
    const next = Math.floor(Math.random() * GRID_SIZE);
    const newSequence = [...prevSequence, next];

    setSequence(newSequence);
    setPlayerSequence([]);
    setRound(newSequence.length);
    setStatus(`Round ${newSequence.length}`);
    setCanClick(false);

    setTimeout(() => playSequence(newSequence), 300);
  };

  const playSequence = (seq) => {
    seq.forEach((index, i) => {
      setTimeout(() => setActiveIndex(index), i * SEQUENCE_DELAY);
      setTimeout(() => setActiveIndex(null), i * SEQUENCE_DELAY + FLASH_TIME);
    });

    setTimeout(() => setCanClick(true), seq.length * SEQUENCE_DELAY);
  };

  const handleCardClick = (index) => {
    if (!canClick) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    setActiveIndex(index);

    setTimeout(() => setActiveIndex(null), FLASH_TIME);

    const current = newPlayerSequence.length - 1;

    if (newPlayerSequence[current] !== sequence[current]) {
      setStatus("Game Over!");
      setCanClick(false);

      // Show game over popup
      setGameOver(true);

      const score = sequence.length - 1; 
let comparison = "";

if (score < 3) comparison = "Needs improvement";
else if (score < 5) comparison = "is Below average";
else if (score < 8) comparison = "is Average";
else if (score < 12) comparison = "is Above average";
else comparison = "is Excellent!";

setScoreMessage(`You scored ${score}! That ${comparison}.`);

return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setCanClick(false);
      setTimeout(() => nextRound(sequence), 800);
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="memory-container">
      <h1>Memory Cards</h1>
      <button onClick={startGame}>Start Game</button>
      <p className="status">{status}</p>

      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <div
            key={index}
            className={`card ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {gameOver && (
        <div className="popup">
          <div className="popup-content">
            <h2>Game Over!</h2>
            <p>{scoreMessage}</p>
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
