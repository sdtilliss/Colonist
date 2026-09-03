import fs from "fs";
import path from "path";

const ALIASES_PATH = path.join(process.cwd(), "data", "aliases.json");

function readAliases(): Record<string, string> {
  try {
    const raw = fs.readFileSync(ALIASES_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeAliases(aliases: Record<string, string>) {
  fs.writeFileSync(ALIASES_PATH, JSON.stringify(aliases, null, 2) + "\n");
}

export function getAliasMap(): Record<string, string> {
  return readAliases();
}

export function saveAliases(pairs: { rawName: string; resolvedName: string }[]) {
  const aliases = readAliases();
  for (const { rawName, resolvedName } of pairs) {
    if (rawName.toLowerCase() !== resolvedName.toLowerCase()) {
      aliases[rawName] = resolvedName;
    }
  }
  writeAliases(aliases);
}

/** Best-effort guess: an existing alias, else an exact (case-insensitive) roster match, else null. */
export function resolveName(rawName: string, roster: string[]): string | null {
  const aliases = readAliases();
  if (aliases[rawName]) return aliases[rawName];
  const exact = roster.find((r) => r.toLowerCase() === rawName.toLowerCase());
  return exact ?? null;
}
