export type Cell = "X" | "O" | null;
export type Board = Cell[];
export type Player = "X" | "O";
export type Outcome =
  | { kind: "ongoing" }
  | { kind: "win"; winner: Player; line: [number, number, number] }
  | { kind: "draw" };

export const LINES: Array<[number, number, number]> = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const createBoard = (): Board => Array(9).fill(null);

export const detectOutcome = (board: Board): Outcome => {
  for (const line of LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { kind: "win", winner: v, line };
    }
  }
  if (board.every((c) => c !== null)) return { kind: "draw" };
  return { kind: "ongoing" };
};

export type MoveError = "occupied" | "game_over" | "out_of_turn" | "out_of_bounds";

export const applyMove = (
  board: Board,
  index: number,
  player: Player,
  toMove: Player,
): { ok: true; board: Board } | { ok: false; error: MoveError } => {
  if (index < 0 || index > 8) return { ok: false, error: "out_of_bounds" };
  if (detectOutcome(board).kind !== "ongoing") return { ok: false, error: "game_over" };
  if (player !== toMove) return { ok: false, error: "out_of_turn" };
  if (board[index] !== null) return { ok: false, error: "occupied" };
  const next = board.slice();
  next[index] = player;
  return { ok: true, board: next };
};
