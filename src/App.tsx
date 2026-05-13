import { useCallback, useEffect, useState } from "react";
import { applyMove, createBoard, detectOutcome, type Board, type Player } from "./game";
import { selectAIMove } from "./ai";
import "./App.css";

const HUMAN: Player = "X";
const AI: Player = "O";

const statusText = (board: Board, toMove: Player): string => {
  const outcome = detectOutcome(board);
  if (outcome.kind === "win") return `${outcome.winner} wins`;
  if (outcome.kind === "draw") return "Draw";
  return toMove === HUMAN ? "Your turn (X)" : "AI thinking…";
};

const App = () => {
  const [board, setBoard] = useState<Board>(createBoard);
  const [toMove, setToMove] = useState<Player>(HUMAN);

  const outcome = detectOutcome(board);
  const gameOver = outcome.kind !== "ongoing";
  const winningLine = outcome.kind === "win" ? new Set(outcome.line) : null;

  const handleCellClick = useCallback(
    (index: number) => {
      if (toMove !== HUMAN) return;
      const result = applyMove(board, index, HUMAN, toMove);
      if (!result.ok) return;
      setBoard(result.board);
      setToMove(AI);
    },
    [board, toMove],
  );

  const handleReset = useCallback(() => {
    setBoard(createBoard());
    setToMove(HUMAN);
  }, []);

  useEffect(() => {
    if (toMove !== AI || gameOver) return;
    const timer = setTimeout(() => {
      const index = selectAIMove(board);
      if (index === null) return;
      const result = applyMove(board, index, AI, AI);
      if (!result.ok) return;
      setBoard(result.board);
      setToMove(HUMAN);
    }, 300);
    return () => clearTimeout(timer);
  }, [board, toMove, gameOver]);

  return (
    <main className="app">
      <h1>Tic-Tac-Toe</h1>
      <p className="status" aria-live="polite">
        {statusText(board, toMove)}
      </p>
      <div className="board" role="grid" aria-label="Tic-tac-toe board">
        {board.map((cell, i) => {
          const disabled = cell !== null || gameOver || toMove !== HUMAN;
          const isWinning = winningLine?.has(i) ?? false;
          return (
            <button
              key={i}
              className={`cell${isWinning ? " cell--win" : ""}`}
              onClick={() => handleCellClick(i)}
              disabled={disabled}
              aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ", empty"}`}
            >
              {cell}
            </button>
          );
        })}
      </div>
      <button className="reset" onClick={handleReset}>
        Reset
      </button>
    </main>
  );
};

export default App;
