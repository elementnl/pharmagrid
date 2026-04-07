# PharmaGrid

A daily pharmacy trivia game inspired by Immaculate Grid. Match drugs to category intersections on a 3x3 grid using your knowledge of the top 200 drugs.

## How to Play

- Each day generates a new puzzle with 6 categories (3 rows, 3 columns)
- Click a cell and type the generic name of a drug that matches both its row and column categories
- You get 9 guesses total — wrong guesses consume a guess but the cell stays open
- Each drug can only be used once
- After the game ends, missed cells reveal answers in yellow — click them to see all valid options

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Stack

- React + Vite
- Tailwind CSS v4
- shadcn/ui
- No backend — puzzles are generated client-side from a seeded PRNG tied to the date

## Data

Drug data lives in `src/data/drugs.json` — 199 drugs with 17 category fields including drug class, indication, route, suffix, brand names, and more.
