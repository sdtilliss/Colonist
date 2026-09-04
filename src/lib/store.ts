import fs from "fs";
import path from "path";
import type { Game, LegacyStats } from "./types";
import { readJson, writeJson } from "./blobStore";
import { DEFAULT_LEAGUE_SLUG } from "./leagues";

const LEGACY_STATS_PATH = path.join(process.cwd(), "data", "legacy-stats.json");

function isDefaultLeague(slug?: string): boolean {
  return !slug || slug === DEFAULT_LEAGUE_SLUG;
}

function gamesPaths(slug?: string) {
  if (isDefaultLeague(slug)) {
    return {
      blobPath: "games.json",
      localPath: path.join(process.cwd(), "data", "games.json"),
    };
  }
  return {
    blobPath: `leagues/${slug}/games.json`,
    localPath: path.join(process.cwd(), "data", "leagues", slug!, "games.json"),
  };
}

async function readGames(slug?: string): Promise<Game[]> {
  const { blobPath, localPath } = gamesPaths(slug);
  return readJson<Game[]>(blobPath, localPath);
}

export async function getGames(slug?: string): Promise<Game[]> {
  const games = await readGames(slug);
  return games.sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
}

export async function addGame(
  input: { players: string[]; winner: string; playedAt: string; stats?: Game["stats"] },
  slug?: string
): Promise<Game> {
  const games = await readGames(slug);
  const game: Game = {
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...input,
  };
  games.push(game);
  const { blobPath, localPath } = gamesPaths(slug);
  await writeJson(blobPath, localPath, games);
  return game;
}

export function getLegacyStats(slug?: string): LegacyStats {
  if (!isDefaultLeague(slug)) {
    return { totalGames: 0, players: {} };
  }
  try {
    const raw = fs.readFileSync(LEGACY_STATS_PATH, "utf8");
    return JSON.parse(raw) as LegacyStats;
  } catch {
    return { totalGames: 0, players: {} };
  }
}

export async function getRoster(slug?: string): Promise<string[]> {
  const games = await readGames(slug);
  const roster = new Set<string>();
  games.forEach((g) => {
    g.players.forEach((p) => roster.add(p));
    roster.add(g.winner);
  });
  return [...roster].sort((a, b) => a.localeCompare(b));
}
