import { describe, expect, test } from "vitest";
import {
  selectAIMove,
  selectAIMoveEasy,
  selectAIMoveHard,
} from "./ai";
import { detectOutcome, type Board, type Player } from "./game";

const boardFrom = (cells: string): Board =>
  cells.split("").map((c) => (c === "." ? null : (c as Player)));

describe("selectAIMoveEasy priority", () => {
  test("plays the winning move for O when available", () => {
    expect(selectAIMoveEasy(boardFrom("OO.X.X..."))).toBe(2);
  });

  test("prefers winning over blocking when both exist", () => {
    expect(selectAIMoveEasy(boardFrom("OO.XX...."))).toBe(2);
  });

  test("blocks X's winning move when O has no win", () => {
    expect(selectAIMoveEasy(boardFrom("XX.O....."))).toBe(2);
  });

  test("plays center on empty board", () => {
    expect(selectAIMoveEasy(boardFrom("........."))).toBe(4);
  });

  test("plays a corner when center is taken and no threats", () => {
    const move = selectAIMoveEasy(boardFrom("....X...."));
    expect([0, 2, 6, 8]).toContain(move);
  });

  test("plays an edge when only edges are open", () => {
    const move = selectAIMoveEasy(boardFrom("X.X.O.X.X"));
    expect([1, 3, 5, 7]).toContain(move);
  });

  test("never returns an occupied square", () => {
    const boards = ["XO.X.O.X.", "X.X.O.O.X", "XO..X.O..", ".X.O.X.O."];
    for (const cells of boards) {
      const board = boardFrom(cells);
      const move = selectAIMoveEasy(board);
      if (move === null) continue;
      expect(board[move]).toBe(null);
    }
  });
});

describe("selectAIMove default routes to easy", () => {
  test("default difficulty matches selectAIMoveEasy", () => {
    expect(selectAIMove(boardFrom("........."))).toBe(selectAIMoveEasy(boardFrom(".........")));
  });
});

describe("selectAIMoveHard (minimax)", () => {
  test("takes an immediate winning move", () => {
    expect(selectAIMoveHard(boardFrom("OO.XX...."))).toBe(2);
  });

  test("blocks an immediate X win", () => {
    expect(selectAIMoveHard(boardFrom("XX.O....."))).toBe(2);
  });

  test("never returns an occupied square", () => {
    const boards = ["XO.X.O.X.", "X.X.O.O.X", "XO..X.O..", ".X.O.X.O."];
    for (const cells of boards) {
      const board = boardFrom(cells);
      const move = selectAIMoveHard(board);
      if (move === null) continue;
      expect(board[move]).toBe(null);
    }
  });

  test("from empty board, picks a corner or center (optimal openings)", () => {
    const move = selectAIMoveHard(boardFrom("........."));
    expect([0, 2, 4, 6, 8]).toContain(move);
  });
});

describe("selectAIMoveHard exhaustive never-lose property", () => {
  // Game-tree exploration: O plays Hard; X plays every possible move.
  // If any leaf reports X wins, the property fails.
  const search = (board: Board, toMove: Player): "x_wins" | "safe" => {
    const outcome = detectOutcome(board);
    if (outcome.kind === "win") {
      return outcome.winner === "X" ? "x_wins" : "safe";
    }
    if (outcome.kind === "draw") return "safe";

    if (toMove === "O") {
      const move = selectAIMoveHard(board);
      if (move === null) return "safe";
      const next = board.slice();
      next[move] = "O";
      return search(next, "X");
    }

    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      const next = board.slice();
      next[i] = "X";
      if (search(next, "O") === "x_wins") return "x_wins";
    }
    return "safe";
  };

  test("X cannot win against Hard from any reachable position (X moves first)", () => {
    expect(search(boardFrom("........."), "X")).toBe("safe");
  });
});
