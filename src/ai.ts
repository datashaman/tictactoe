import { LINES, detectOutcome, type Board, type Player } from "./game";

export type Difficulty = "easy" | "hard";

const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];
const CENTER = 4;

const findWinningMove = (board: Board, player: Player): number | null => {
  for (const [a, b, c] of LINES) {
    const cells = [board[a], board[b], board[c]];
    const positions = [a, b, c];
    const playerCount = cells.filter((v) => v === player).length;
    const emptyCount = cells.filter((v) => v === null).length;
    if (playerCount === 2 && emptyCount === 1) {
      return positions[cells.indexOf(null)];
    }
  }
  return null;
};

const firstEmpty = (board: Board, candidates: number[]): number | null => {
  for (const i of candidates) if (board[i] === null) return i;
  return null;
};

export const selectAIMoveEasy = (board: Board): number | null => {
  const win = findWinningMove(board, "O");
  if (win !== null) return win;

  const block = findWinningMove(board, "X");
  if (block !== null) return block;

  if (board[CENTER] === null) return CENTER;

  const corner = firstEmpty(board, CORNERS);
  if (corner !== null) return corner;

  return firstEmpty(board, EDGES);
};

const otherPlayer = (p: Player): Player => (p === "O" ? "X" : "O");

const minimax = (
  board: Board,
  toMove: Player,
): { score: number; move: number | null } => {
  const outcome = detectOutcome(board);
  if (outcome.kind === "win") {
    return { score: outcome.winner === "O" ? 1 : -1, move: null };
  }
  if (outcome.kind === "draw") return { score: 0, move: null };

  const maximize = toMove === "O";
  let bestScore = maximize ? -Infinity : Infinity;
  let bestMove: number | null = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    const next = board.slice();
    next[i] = toMove;
    const { score } = minimax(next, otherPlayer(toMove));
    if (maximize ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return { score: bestScore, move: bestMove };
};

export const selectAIMoveHard = (board: Board): number | null =>
  minimax(board, "O").move;

export const selectAIMove = (
  board: Board,
  difficulty: Difficulty = "easy",
): number | null =>
  difficulty === "hard" ? selectAIMoveHard(board) : selectAIMoveEasy(board);
