import fs from "fs";
import { head, put } from "@vercel/blob";

function hasBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Reads JSON from Vercel Blob when configured (production), falling back to the
 * bundled local file otherwise (local dev, or before anything's been written yet).
 * Vercel's function filesystem is read-only, so the local file is always a safe
 * read-only seed even in production.
 */
export async function readJson<T>(blobPathname: string, localPath: string): Promise<T> {
  if (hasBlob()) {
    try {
      const meta = await head(blobPathname);
      const res = await fetch(meta.url, { cache: "no-store" });
      return (await res.json()) as T;
    } catch {
      // Not created in the blob store yet — fall through to the local seed.
    }
  }
  const raw = fs.readFileSync(localPath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJson<T>(blobPathname: string, localPath: string, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";
  if (hasBlob()) {
    await put(blobPathname, body, {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  fs.writeFileSync(localPath, body);
}
