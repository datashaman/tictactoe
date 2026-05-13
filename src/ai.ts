import { LINES, type Board, type Player } from "./game";

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

export const selectAIMove = (board: Board): number | null => {
  const win = findWinningMove(board, "O");
  if (win !== null) return win;

  const block = findWinningMove(board, "X");
  if (block !== null) return block;

  if (board[CENTER] === null) return CENTER;

  const corner = firstEmpty(board, CORNERS);
  if (corner !== null) return corner;

  return firstEmpty(board, EDGES);
};
