import fs from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

function hasBlob(): boolean {
  // BLOB_STORE_ID is set once the store is connected; auth happens via Vercel's
  // OIDC token at runtime, so no static BLOB_READ_WRITE_TOKEN is required.
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
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
      const blob = await get(blobPathname, { access: "private" });
      if (blob) {
        const text = await new Response(blob.stream).text();
        return JSON.parse(text) as T;
      }
      // Not created in the blob store yet — fall through to the local seed.
    } catch (err) {
      // A transient Blob error shouldn't crash the whole page — fall back to the
      // local seed (possibly stale, but a working page beats a hard failure).
      console.error(`Blob read failed for ${blobPathname}, falling back to local seed:`, err);
    }
  }
  const raw = fs.readFileSync(localPath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJson<T>(blobPathname: string, localPath: string, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";
  if (hasBlob()) {
    await put(blobPathname, body, {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, body);
}
