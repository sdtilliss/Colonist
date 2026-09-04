import path from "path";
import type { Game } from "./types";
import { readJson, writeJson } from "./blobStore";

export const DEFAULT_LEAGUE_SLUG = "reeb";

export interface LeagueMeta {
  slug: string;
  name: string;
  createdAt: string;
}

function metaPaths(slug: string) {
  return {
    blobPath: `leagues/${slug}/meta.json`,
    localPath: path.join(process.cwd(), "data", "leagues", slug, "meta.json"),
  };
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 40);
  return base || "league";
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export async function createLeague(name: string): Promise<LeagueMeta> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("League name is required.");
  }

  const slug = `${slugify(trimmed)}-${randomSuffix()}`;
  const meta: LeagueMeta = { slug, name: trimmed, createdAt: new Date().toISOString() };

  const { blobPath, localPath } = metaPaths(slug);
  await writeJson(blobPath, localPath, meta);

  await writeJson(
    `leagues/${slug}/games.json`,
    path.join(process.cwd(), "data", "leagues", slug, "games.json"),
    [] as Game[]
  );
  await writeJson(
    `leagues/${slug}/aliases.json`,
    path.join(process.cwd(), "data", "leagues", slug, "aliases.json"),
    {} as Record<string, string>
  );

  return meta;
}

export async function getLeagueMeta(slug: string): Promise<LeagueMeta | null> {
  if (slug === DEFAULT_LEAGUE_SLUG) {
    return {
      slug: DEFAULT_LEAGUE_SLUG,
      name: "Catan Win Tracker",
      createdAt: "2024-06-12T00:00:00.000Z",
    };
  }
  try {
    const { blobPath, localPath } = metaPaths(slug);
    return await readJson<LeagueMeta>(blobPath, localPath);
  } catch {
    return null;
  }
}
