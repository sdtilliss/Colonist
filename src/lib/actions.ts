"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addGame, getRoster } from "./store";
import { resolveName, saveAliases } from "./aliases";
import { parseGameScreenshots, type ParsedGame } from "./vision";

export async function recordGame(formData: FormData) {
  const players = formData.getAll("players").map(String).filter(Boolean);
  const winner = String(formData.get("winner") ?? "");

  if (players.length < 2) {
    throw new Error("Select at least two players.");
  }
  if (!winner || !players.includes(winner)) {
    throw new Error("Winner must be one of the selected players.");
  }

  await addGame({ players, winner, playedAt: new Date().toISOString() });

  revalidatePath("/");
  revalidatePath("/history");
  redirect("/?recorded=1");
}

export interface ScreenshotEntry {
  rawName: string;
  victoryPoints: number;
  resolvedName: string | null;
}

export interface ScreenshotParseResult {
  entries: ScreenshotEntry[];
  winnerRawName: string;
  roster: string[];
}

async function fileToImageInput(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mediaType = (file.type || "image/png") as "image/png" | "image/jpeg" | "image/webp";
  return { base64: buffer.toString("base64"), mediaType };
}

export async function parseScreenshots(formData: FormData): Promise<ScreenshotParseResult> {
  const image1 = formData.get("image1");
  const image2 = formData.get("image2");

  if (!(image1 instanceof File) || image1.size === 0) {
    throw new Error("Upload at least one screenshot.");
  }

  const images = [await fileToImageInput(image1)];
  if (image2 instanceof File && image2.size > 0) {
    images.push(await fileToImageInput(image2));
  }

  const parsed: ParsedGame = await parseGameScreenshots(images);
  const roster = await getRoster();

  const entries: ScreenshotEntry[] = await Promise.all(
    parsed.players.map(async (p) => ({
      rawName: p.rawName,
      victoryPoints: p.victoryPoints,
      resolvedName: await resolveName(p.rawName, roster),
    }))
  );

  return { entries, winnerRawName: parsed.winnerRawName, roster };
}

export async function confirmScreenshotGame(
  entries: { rawName: string; resolvedName: string }[],
  winnerResolvedName: string
) {
  const players = entries.map((e) => e.resolvedName.trim()).filter(Boolean);

  if (players.length < 2) {
    throw new Error("At least two players are required.");
  }
  if (!winnerResolvedName || !players.includes(winnerResolvedName)) {
    throw new Error("Winner must be one of the confirmed players.");
  }

  await saveAliases(entries.map((e) => ({ rawName: e.rawName, resolvedName: e.resolvedName.trim() })));
  await addGame({ players, winner: winnerResolvedName, playedAt: new Date().toISOString() });

  revalidatePath("/");
  revalidatePath("/history");
  redirect("/?recorded=1");
}
