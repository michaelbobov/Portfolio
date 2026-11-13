import { readManifest } from '@/app/lib/dress/store';

// Public: the current outfit and the history, newest first (no photos, only whether one may be shown)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const m = await readManifest();
    return Response.json(
      { current: m.outfits.find((o) => o.id === m.current) ?? null, outfits: m.outfits.slice(0, 60) },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' } },
    );
  } catch {
    return Response.json({ current: null, outfits: [] }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30' } });
  }
}
