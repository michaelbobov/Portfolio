import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { get, put } from '@vercel/blob';
import type { PublicOutfit } from '@/app/data/me';

// Everything lives in one private Vercel Blob store (connected to the project, so it authenticates by
// itself on Vercel). Nothing in it is reachable from the web except through the routes that serve it:
//   outfits/<id>/photo.jpg     (kept privately; served only if he chose to show it)
//   outfits/manifest.json      (the outfits themselves, as garment lists: which is current, and the history)
// On his Mac, with no store set up, the same paths are plain files in .dress-local/ (git ignores it).
const PRIVATE = { access: 'private' as const };
const MANIFEST = 'outfits/manifest.json';
const LOCAL = !process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN;
const local = (path: string) => join(process.cwd(), '.dress-local', path);

export type Manifest = { current: string | null; outfits: PublicOutfit[] };

export const outfitPath = (id: string, file: string) => `outfits/${id}/${file}`;

/** A new outfit id: the day, then 8 random hex digits (2026-11-12-3fa94c1e) */
export const newId = () => `${new Date().toISOString().slice(0, 10)}-${randomBytes(4).toString('hex')}`;
export const isId = (id: unknown): id is string => typeof id === 'string' && /^\d{4}-\d{2}-\d{2}-[0-9a-f]{8}$/.test(id);

/** A stored file as a stream (for the routes), or null if it isn't there */
export async function open(path: string, fresh = false): Promise<ReadableStream<Uint8Array> | null> {
  try {
    if (LOCAL) return new Response(await readFile(local(path))).body;
    const r = await get(path, { ...PRIVATE, ...(fresh ? { useCache: false } : {}) });
    return r && r.statusCode === 200 ? r.stream : null;
  } catch {
    return null;
  }
}

export async function readBytes(path: string, fresh = false) {
  const s = await open(path, fresh);
  return s ? Buffer.from(await new Response(s).arrayBuffer()) : null;
}

export async function write(path: string, body: Buffer | string, contentType: string) {
  if (LOCAL) {
    await mkdir(dirname(local(path)), { recursive: true });
    await writeFile(local(path), body);
    return;
  }
  await put(path, body, { ...PRIVATE, contentType, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
}

export async function readManifest(): Promise<Manifest> {
  const b = await readBytes(MANIFEST, true);
  return b ? (JSON.parse(b.toString('utf8')) as Manifest) : { current: null, outfits: [] };
}

export const saveManifest = (m: Manifest) => write(MANIFEST, JSON.stringify(m), 'application/json');
