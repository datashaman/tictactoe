# Tic-Tac-Toe

A simple 3x3 tic-tac-toe game. Human plays **X**, the computer plays **O** with a selectable difficulty: **Easy** (fixed-priority heuristic) or **Hard** (minimax, unbeatable).

[![test](https://github.com/datashaman/tictactoe/actions/workflows/test.yml/badge.svg)](https://github.com/datashaman/tictactoe/actions/workflows/test.yml)

## Play

```sh
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

Pick **Easy** or **Hard** from the difficulty selector, then click any empty square to place an X. The AI responds after a short delay. Hit **Reset** at any time to start over.

## AI behaviour

`selectAIMove(board, difficulty)` dispatches to one of two strategies.

### Easy — fixed-priority heuristic

1. Take a winning line for O if one exists.
2. Block X's winning line if one exists.
3. Play the center.
4. Play any free corner.
5. Play any free edge.

Deterministic given the board state, and beatable by a human who plays optimally.

### Hard — minimax

Full-depth minimax over the remaining game tree, scoring O-win as `+1`, X-win as `-1`, draw as `0`. The 3x3 search space is small enough to solve every position exhaustively with no pruning needed, so Hard plays perfectly — the best a human can achieve is a draw.

## Project structure

```
src/
  game.ts       Pure engine: createBoard, applyMove, detectOutcome
  ai.ts         selectAIMove (easy heuristic + hard minimax)
  App.tsx       React UI
  game.test.ts  Engine + outcome unit tests
  ai.test.ts    AI priority unit tests
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and bundle for production |
| `npm test` | Run the Vitest suite once |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the built bundle |

## Requirements

- Node `>=24`
- npm

## Verification

- **Unit suite**: 41 Vitest cases covering engine state, all 8 winning lines, draw detection, four move-rejection paths, the Easy AI priority tiers (including the never-occupied invariant), and the Hard minimax (wins when it can, blocks forced losses, and never loses across exhaustive opening play).
- **Acceptance**: manual playthrough of five scenarios — X win, O win, draw, invalid clicks after game end, reset (mid-game and post-game) — on both Easy and Hard.

CI runs `npm ci && npm run build && npm test` on every pull request targeting `main`.

## Tech

Vite, React 19, TypeScript, Vitest.
