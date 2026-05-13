import { describe, expect, test } from "vitest";
import {
  LINES,
  applyMove,
  createBoard,
  detectOutcome,
  type Board,
  type Player,
} from "./game";

const boardFrom = (cells: string): Board =>
  cells.split("").map((c) => (c === "." ? null : (c as Player)));

describe("createBoard / initial state", () => {
  test("creates 9 empty cells", () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every((c) => c === null)).toBe(true);
  });

  test("game starts ongoing", () => {
    expect(detectOutcome(createBoard()).kind).toBe("ongoing");
  });
});

describe("applyMove (valid placement)", () => {
  test("places X on empty square and returns new board", () => {
    const before = createBoard();
    const result = applyMove(before, 0, "X", "X");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.board[0]).toBe("X");
    expect(before[0]).toBe(null);
  });

  test("ongoing after a single valid move", () => {
    const result = applyMove(createBoard(), 0, "X", "X");
    if (!result.ok) throw new Error("expected ok");
    expect(detectOutcome(result.board).kind).toBe("ongoing");
  });
});

describe("applyMove (rejection paths)", () => {
  test("rejects occupied square without mutating", () => {
    const board = boardFrom("X........");
    const result = applyMove(board, 0, "O", "O");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("occupied");
    expect(board[0]).toBe("X");
  });

  test("rejects move after game has ended", () => {
    const board = boardFrom("XXX......");
    const result = applyMove(board, 4, "O", "O");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("game_over");
    expect(board[4]).toBe(null);
  });

  test("rejects out-of-turn move", () => {
    const board = createBoard();
    const result = applyMove(board, 0, "O", "X");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("out_of_turn");
    expect(board[0]).toBe(null);
  });

  test("rejects out-of-bounds index", () => {
    const result = applyMove(createBoard(), 9, "X", "X");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("out_of_bounds");
  });
});

describe("detectOutcome - win across all 8 lines", () => {
  test.each(LINES)("X wins on line %j", (a, b, c) => {
    const board = createBoard();
    board[a] = "X";
    board[b] = "X";
    board[c] = "X";
    const outcome = detectOutcome(board);
    expect(outcome.kind).toBe("win");
    if (outcome.kind !== "win") return;
    expect(outcome.winner).toBe("X");
    expect(outcome.line).toEqual([a, b, c]);
  });

  test.each(LINES)("O wins on line %j", (a, b, c) => {
    const board = createBoard();
    board[a] = "O";
    board[b] = "O";
    board[c] = "O";
    const outcome = detectOutcome(board);
    expect(outcome.kind).toBe("win");
    if (outcome.kind !== "win") return;
    expect(outcome.winner).toBe("O");
  });

  test("non-winning arrangements are not flagged", () => {
    expect(detectOutcome(boardFrom("X.X.O.O.X")).kind).toBe("ongoing");
    expect(detectOutcome(boardFrom("XO.OX.X.O")).kind).toBe("ongoing");
    expect(detectOutcome(boardFrom(".X..O....")).kind).toBe("ongoing");
  });
});

describe("detectOutcome - draw", () => {
  test("full board with no winner is a draw", () => {
    expect(detectOutcome(boardFrom("XOXXOOOXX")).kind).toBe("draw");
  });

  test("full board with a winner is a win, not a draw", () => {
    const outcome = detectOutcome(boardFrom("XXXOOXOXO"));
    expect(outcome.kind).toBe("win");
    if (outcome.kind !== "win") return;
    expect(outcome.winner).toBe("X");
  });

  test("partial board is neither win nor draw", () => {
    expect(detectOutcome(boardFrom("XO.OX.X.O")).kind).toBe("ongoing");
  });
});
