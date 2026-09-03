import fs from "fs";
import path from "path";
import type { Game, LegacyBaseline } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "games.json");
const LEGACY_STATS_PATH = path.join(process.cwd(), "data", "legacy-stats.json");

function readAll(): Game[] {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw) as Game[];
}

function writeAll(games: Game[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(games, null, 2) + "\n");
}

export function getGames(): Game[] {
  return readAll().sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
  );
}

export function addGame(input: { players: string[]; winner: string; playedAt: string }): Game {
  const games = readAll();
  const game: Game = {
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...input,
  };
  games.push(game);
  writeAll(games);
  return game;
}

export function getLegacyStats(): Record<string, LegacyBaseline> {
  try {
    const raw = fs.readFileSync(LEGACY_STATS_PATH, "utf8");
    return JSON.parse(raw) as Record<string, LegacyBaseline>;
  } catch {
    return {};
  }
}

export function getRoster(): string[] {
  const games = readAll();
  const roster = new Set<string>();
  games.forEach((g) => {
    g.players.forEach((p) => roster.add(p));
    roster.add(g.winner);
  });
  return [...roster].sort((a, b) => a.localeCompare(b));
}
