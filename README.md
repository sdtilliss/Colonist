# Colonist Tracker

A small Next.js app that replaces the old Catan Win Tracker Google Form + Sheet with a
proper site: record who played and who won, and see cumulative stats update instantly.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it works

- **Record a Game** (`/record`) — pick everyone at the table, pick the winner, save.
  This is the direct replacement for the old Google Form.
- **Dashboard** (`/`) — leaderboard (win %, wins, games, current streak, form) plus a
  recent-games feed and season highlights.
- **History** (`/history`) — every game ever recorded, filterable by player.

Games are stored in [`data/games.json`](data/games.json), seeded with the 27 games
migrated from the original "Catan Win Tracker" spreadsheet's Form Responses. New games
recorded through the site are appended to the same file — no more manually reopening
the sheet or form.

Stats (win %, streaks, games since last win, wins behind the leader) are computed live
from the game log in [`src/lib/stats.ts`](src/lib/stats.ts) rather than stored, so
they're always consistent with the underlying data.

## Note on deploying

The data store is a flat JSON file on disk, which is fine for local use but won't
persist across deploys/invocations on a serverless platform like Vercel. If this ever
moves off a laptop, swap `src/lib/store.ts` for a real database (e.g. a Postgres or
SQLite integration from the Vercel Marketplace) — the rest of the app doesn't need to
change.
