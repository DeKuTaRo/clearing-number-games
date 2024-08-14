import React, { useState, useEffect, useRef } from "react";
import "./Game.css";

function Circle({ id, x, y, status, onClick }) {
  return (
    <div className={`circle ${status}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={onClick}>
      {id}
    </div>
  );
}

function Game() {
  const [points, setPoints] = useState("");
  const [time, setTime] = useState(0.0);
  const [circles, setCircles] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [gameStatus, setGameStatus] = useState("default");

  const timerRef = useRef(null);

  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else if (gameStatus === "allCleared") {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStatus]);

  const restartGame = () => {
    if (!points) {
      alert("Please fill in number ");
      return;
    }
    const newCircles = Array.from({ length: points }, (_, index) => ({
      id: index + 1,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    }));
    setCircles(newCircles);
    setCurrentNumber(1);
    setTime(0.0);
    setGameStatus("playing");
  };

  const handleCircleClick = (id) => {
    if (gameStatus !== "playing") return;
    if (id === currentNumber) {
      setCircles(circles.map((circle) => (circle.id === id ? { ...circle, status: "clicked" } : circle)));
      setCurrentNumber(currentNumber + 1);

      setTimeout(() => {
        setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== id));
        if (currentNumber === parseInt(points)) {
          setGameStatus("allCleared");
        }
      }, 3000);
    } else {
      setGameStatus("gameOver");
    }
  };

  const renderStatusGame = (status) => {
    if (gameStatus === "allCleared") {
      return <h1 className="statusClear">ALL CLEARED</h1>;
    } else if (gameStatus === "gameOver") {
      return <h1 className="statusOver">GAME OVER</h1>;
    }
    return <h1>LET'S PLAY</h1>;
  };

  return (
    <div className="game">
      {renderStatusGame(gameStatus)}
      <div>
        Points: <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} />
      </div>
      <div>Time: {time.toFixed(1)}s</div>
      <button onClick={restartGame}>{gameStatus === "default" ? "Play" : "Restart"}</button>
      <div className="game-board">
        {circles.map((circle) => (
          <Circle key={circle.id} {...circle} onClick={() => handleCircleClick(circle.id)} />
        ))}
      </div>
    </div>
  );
}

export default Game;
