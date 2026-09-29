# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## How to Run

No build step needed. Open directly or serve:

```bash
open index.html
# or
python3 -m http.server 8000   # then http://localhost:8000
```

## Project Structure

Single-page Tetris game — vanilla HTML5 Canvas + CSS + JS (ES6), zero dependencies.

- **index.html** — Canvas elements (#board 300x600, #next-canvas 120x120), HUD (score/lines/level), game-over overlay
- **style.css** — Dark retro theme (#0f0f17 bg), overlay with backdrop-blur
- **game.js** — All game logic (~330 lines, `'use strict'`)

## Architecture (game.js)

**State model** (10 mutable globals, all reset in `init()`):
- `board[][]` — 20×10 grid, 0 = empty, 1-7 = standard piece, 8 = challenge ring (color index)
- `current {shape, x, y, type}` — active falling piece
- `next` — next piece in preview
- `score/lines/level/dropInterval` — game progression
- `paused/gameOver/lastTime/dropAccum/animId` — loop control

**Game loop** (`requestAnimationFrame` → `loop(ts)`):
- Delta-time accumulator for auto-drop
- `draw()` renders grid → board → ghost piece (alpha 0.2) → current piece
- Input via `keydown`: ← → ↓ ↑/X (rotate), Space (hard drop), P (pause)

**Piece lifecycle**: `spawn()` → input/movement → `lockPiece()` → `merge()` → `clearLines()` → `spawn()` next

**Customization** (edit constants at top of `game.js`):
- `COLS/ROWS/BLOCK` — board dimensions and cell size
- `COLORS[1-8]` — 7 tetromino colors + ring
- `PIECES[1-8]` — I,O,T,S,Z,J,L shape matrices + hollow 3x3 ring (8)
- `STANDARD_PIECES/CHALLENGE_TYPE/CHALLENGE_CHANCE` — count of standard pieces, ring type index, ring spawn probability (0.08) in `randomPiece()`
- `LINE_SCORES[0-4]` — points per lines cleared (× level)
- `dropInterval` formula in `clearLines()` — speed ramp

**Theme toggle** (dark by default, not persisted): `#theme-toggle` sets `data-theme="light"|"dark"` on `<html>`. Colors live in CSS variables (`:root` = dark, `[data-theme="light"]` = light) in `style.css`; `drawGrid()` reads `--grid-line` from them and the click handler redraws the canvases.

## Common Tasks

- **Tweak gameplay**: Edit constants in `game.js` lines 3-34
- **Add new piece**: Append to `PIECES` and `COLORS`; cell values = its index. Standard: insert before the ring and bump `STANDARD_PIECES`. Rare: add a branch in `randomPiece()`
- **Change controls**: Modify `keydown` switch at line 289
- **Change scoring**: Edit `LINE_SCORES` or scoring logic in `clearLines()`/`hardDrop()`/`softDrop()`
