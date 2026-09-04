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
    const blob = await get(blobPathname, { access: "private" });
    if (blob) {
      const text = await new Response(blob.stream).text();
      return JSON.parse(text) as T;
    }
    // Not created in the blob store yet — fall through to the local seed.
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
