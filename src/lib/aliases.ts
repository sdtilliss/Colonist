import path from "path";
import { readJson, writeJson } from "./blobStore";
import { DEFAULT_LEAGUE_SLUG } from "./leagues";

function aliasesPaths(slug?: string) {
  if (!slug || slug === DEFAULT_LEAGUE_SLUG) {
    return {
      blobPath: "aliases.json",
      localPath: path.join(process.cwd(), "data", "aliases.json"),
    };
  }
  return {
    blobPath: `leagues/${slug}/aliases.json`,
    localPath: path.join(process.cwd(), "data", "leagues", slug, "aliases.json"),
  };
}

async function readAliases(slug?: string): Promise<Record<string, string>> {
  try {
    const { blobPath, localPath } = aliasesPaths(slug);
    return await readJson<Record<string, string>>(blobPath, localPath);
  } catch {
    return {};
  }
}

export async function getAliasMap(slug?: string): Promise<Record<string, string>> {
  return readAliases(slug);
}

export async function saveAliases(
  pairs: { rawName: string; resolvedName: string }[],
  slug?: string
): Promise<void> {
  const aliases = await readAliases(slug);
  for (const { rawName, resolvedName } of pairs) {
    if (rawName.toLowerCase() !== resolvedName.toLowerCase()) {
      aliases[rawName] = resolvedName;
    }
  }
  const { blobPath, localPath } = aliasesPaths(slug);
  await writeJson(blobPath, localPath, aliases);
}

/** Best-effort guess: an existing alias, else an exact (case-insensitive) roster match, else null. */
export async function resolveName(
  rawName: string,
  roster: string[],
  slug?: string
): Promise<string | null> {
  const aliases = await readAliases(slug);
  if (aliases[rawName]) return aliases[rawName];
  const exact = roster.find((r) => r.toLowerCase() === rawName.toLowerCase());
  return exact ?? null;
}
