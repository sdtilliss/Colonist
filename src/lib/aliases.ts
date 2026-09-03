import path from "path";
import { readJson, writeJson } from "./blobStore";

const ALIASES_PATH = path.join(process.cwd(), "data", "aliases.json");

async function readAliases(): Promise<Record<string, string>> {
  try {
    return await readJson<Record<string, string>>("aliases.json", ALIASES_PATH);
  } catch {
    return {};
  }
}

export async function getAliasMap(): Promise<Record<string, string>> {
  return readAliases();
}

export async function saveAliases(pairs: { rawName: string; resolvedName: string }[]): Promise<void> {
  const aliases = await readAliases();
  for (const { rawName, resolvedName } of pairs) {
    if (rawName.toLowerCase() !== resolvedName.toLowerCase()) {
      aliases[rawName] = resolvedName;
    }
  }
  await writeJson("aliases.json", ALIASES_PATH, aliases);
}

/** Best-effort guess: an existing alias, else an exact (case-insensitive) roster match, else null. */
export async function resolveName(rawName: string, roster: string[]): Promise<string | null> {
  const aliases = await readAliases();
  if (aliases[rawName]) return aliases[rawName];
  const exact = roster.find((r) => r.toLowerCase() === rawName.toLowerCase());
  return exact ?? null;
}
