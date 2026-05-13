# Tic-Tac-Toe

A simple 3x3 tic-tac-toe game. Human plays **X**, the computer plays **O** with a fixed-priority heuristic.

[![test](https://github.com/datashaman/tictactoe/actions/workflows/test.yml/badge.svg)](https://github.com/datashaman/tictactoe/actions/workflows/test.yml)

## Play

```sh
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

Click any empty square to place an X. The AI responds after a short delay. Hit **Reset** at any time to start over.

## AI behaviour

`selectAIMove(board)` chooses in this order:

1. Take a winning line for O if one exists.
2. Block X's winning line if one exists.
3. Play the center.
4. Play any free corner.
5. Play any free edge.

The AI is deterministic given the board state — it's beatable by a human who plays optimally.

## Project structure

```
src/
  game.ts       Pure engine: createBoard, applyMove, detectOutcome
  ai.ts         selectAIMove
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

- **Unit suite**: 35 Vitest cases covering engine state, all 8 winning lines, draw detection, four move-rejection paths, and the AI priority tiers including the never-occupied invariant.
- **Acceptance**: manual playthrough of five scenarios — X win, O win, draw, invalid clicks after game end, reset (mid-game and post-game).

CI runs `npm ci && npm run build && npm test` on every pull request targeting `main`.

## Tech

Vite, React 19, TypeScript, Vitest.
