import fs from "fs";
import path from "path";
import type { Game, LegacyBaseline } from "./types";
import { readJson, writeJson } from "./blobStore";

const GAMES_PATH = path.join(process.cwd(), "data", "games.json");
const LEGACY_STATS_PATH = path.join(process.cwd(), "data", "legacy-stats.json");

async function readGames(): Promise<Game[]> {
  return readJson<Game[]>("games.json", GAMES_PATH);
}

export async function getGames(): Promise<Game[]> {
  const games = await readGames();
  return games.sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
}

export async function addGame(input: { players: string[]; winner: string; playedAt: string }): Promise<Game> {
  const games = await readGames();
  const game: Game = {
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...input,
  };
  games.push(game);
  await writeJson("games.json", GAMES_PATH, games);
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

export async function getRoster(): Promise<string[]> {
  const games = await readGames();
  const roster = new Set<string>();
  games.forEach((g) => {
    g.players.forEach((p) => roster.add(p));
    roster.add(g.winner);
  });
  return [...roster].sort((a, b) => a.localeCompare(b));
}
