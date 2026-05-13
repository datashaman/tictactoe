import { describe, expect, test } from "vitest";
import { selectAIMove } from "./ai";
import { type Board, type Player } from "./game";

const boardFrom = (cells: string): Board =>
  cells.split("").map((c) => (c === "." ? null : (c as Player)));

describe("selectAIMove priority", () => {
  test("plays the winning move for O when available", () => {
    expect(selectAIMove(boardFrom("OO.X.X..."))).toBe(2);
  });

  test("prefers winning over blocking when both exist", () => {
    expect(selectAIMove(boardFrom("OO.XX...."))).toBe(2);
  });

  test("blocks X's winning move when O has no win", () => {
    expect(selectAIMove(boardFrom("XX.O....."))).toBe(2);
  });

  test("plays center on empty board", () => {
    expect(selectAIMove(boardFrom("........."))).toBe(4);
  });

  test("plays a corner when center is taken and no threats", () => {
    const move = selectAIMove(boardFrom("....X...."));
    expect([0, 2, 6, 8]).toContain(move);
  });

  test("plays an edge when only edges are open", () => {
    const move = selectAIMove(boardFrom("X.X.O.X.X"));
    expect([1, 3, 5, 7]).toContain(move);
  });

  test("never returns an occupied square", () => {
    const boards = [
      "XO.X.O.X.",
      "X.X.O.O.X",
      "XO..X.O..",
      ".X.O.X.O.",
    ];
    for (const cells of boards) {
      const board = boardFrom(cells);
      const move = selectAIMove(board);
      if (move === null) continue;
      expect(board[move]).toBe(null);
    }
  });
});
