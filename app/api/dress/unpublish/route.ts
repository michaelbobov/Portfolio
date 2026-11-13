import { denied, isSignedIn } from '@/app/lib/dress/auth';
import { isId, readManifest, saveManifest } from '@/app/lib/dress/store';

// Takes an outfit off the site (out of the history too). If it was the current one, the one before it
// comes back; with none left, his base doll does. Its files stay in the private store.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isSignedIn()) return denied();
  const { id } = await req.json().catch(() => ({}));
  if (!isId(id)) return Response.json({ error: 'Bad request.' }, { status: 400 });
  const m = await readManifest();
  m.outfits = m.outfits.filter((o) => o.id !== id);
  if (m.current === id) m.current = m.outfits[0]?.id ?? null;
  await saveManifest(m);
  return Response.json({ ok: true, current: m.current });
}
