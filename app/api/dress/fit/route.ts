import type { PublicOutfit } from '@/app/data/me';
import { cleanOutfit } from '@/app/data/outfit';
import { denied, isSignedIn } from '@/app/lib/dress/auth';
import { preparePhoto, readOutfit } from '@/app/lib/dress/read';
import { isId, newId, outfitPath, readManifest, saveManifest, write } from '@/app/lib/dress/store';

// The whole thing in one step: his photo comes in, the vision model reads the clothes, anything the
// photo doesn't show stays as the doll wears it now, and the result is published. `replace` (a retake)
// takes the outfit it replaces off the site. The photo is kept privately and never shown.
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: Request) {
  if (!isSignedIn()) return denied();
  const form = await req.formData().catch(() => null);
  const file = form?.get('photo');
  const replace = form?.get('replace');
  if (!(file instanceof Blob) || file.size === 0) return Response.json({ error: 'No photo came through.' }, { status: 400 });
  if (file.size > 4_000_000) return Response.json({ error: 'That photo is too big.' }, { status: 413 });

  let photo: Buffer, reading: Awaited<ReturnType<typeof readOutfit>>;
  try {
    photo = await preparePhoto(Buffer.from(await file.arrayBuffer()));
    reading = await readOutfit(photo);
  } catch (e) {
    console.error('dress/fit', e);
    return Response.json({ error: 'Couldn’t read that photo. Try again?' }, { status: 502 });
  }
  if (!reading.ok || !reading.outfit.length) {
    return Response.json({ error: reading.problem || 'I couldn’t make out the outfit. Try a photo that shows it head to toe.' }, { status: 422 });
  }

  const m = await readManifest();
  if (isId(replace)) {
    m.outfits = m.outfits.filter((o) => o.id !== replace);
    if (m.current === replace) m.current = m.outfits[0]?.id ?? null;
  }
  // What the photo doesn't show, the doll keeps wearing
  const now = m.outfits.find((o) => o.id === m.current)?.outfit ?? [];
  const outfit = cleanOutfit([...reading.outfit, ...now.filter((g) => reading.keep.includes(g.slot))]);

  const id = newId();
  await write(outfitPath(id, 'photo.jpg'), photo, 'image/jpeg');
  const entry: PublicOutfit = { id, date: new Date().toISOString(), outfit, photo: false };
  m.outfits = [entry, ...m.outfits];
  m.current = id;
  await saveManifest(m);
  return Response.json({ ok: true, outfit: entry });
}
