# Colonist Tracker

A small Next.js app for tracking Catan game results: record who played and who won
(manually, or by uploading a Colonist.io results screenshot), and see cumulative stats
update instantly. Any group can spin up their own isolated league.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. AI screenshot parsing needs `ANTHROPIC_API_KEY` set in
`.env.local` (see `.env.example`) — without it, manual recording still works fully.

## How it works

- **Record a Game** — either upload a Colonist.io end-game screenshot (Claude vision reads
  the players and winner) or log it manually.
- **Dashboard** — leaderboard (win %, wins, games, streak, form) plus a recent-games feed
  and season highlights.
- **History** — every game ever recorded, filterable by player.
- **Leagues** (`/new` to create one, then `/l/{slug}`) — each league has its own fully
  isolated roster, games, and aliases. The original group's data lives at the `reeb` slug
  (and is also served at the bare `/`, `/record`, `/history` routes for backward
  compatibility). Access is link-only — no accounts; whoever has a league's URL can view
  and record for it.

Data lives in [Vercel Blob](src/lib/blobStore.ts) in production (private access, OIDC
auth via `BLOB_STORE_ID` — no static token needed), falling back to local JSON files
under `data/` for local dev. Colonist.io usernames get mapped to roster names once via
[`data/aliases.json`](data/aliases.json) (or per-league under `leagues/{slug}/`) and
remembered after that.

Stats (win %, streaks, games since last win, wins behind the leader) are computed live
from the game log in [`src/lib/stats.ts`](src/lib/stats.ts) rather than stored, so
they're always consistent with the underlying data. The original group's stats also fold
in a one-time legacy baseline ([`data/legacy-stats.json`](data/legacy-stats.json)) from
before per-game tracking existed — new leagues start clean with no baseline.
