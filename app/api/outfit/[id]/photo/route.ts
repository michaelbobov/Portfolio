import { isId, open, outfitPath, readManifest } from '@/app/lib/dress/store';

// Public, but only for an outfit published with its photo shown (none are, for now): that day's photo
export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const none = () => new Response('Not found', { status: 404 });
  if (!isId(params.id)) return none();
  try {
    const outfit = (await readManifest()).outfits.find((o) => o.id === params.id);
    if (!outfit?.photo) return none();
    const stream = await open(outfitPath(outfit.id, 'photo.jpg'));
    if (!stream) return none();
    return new Response(stream, {
      headers: { 'Content-Type': 'image/jpeg', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    });
  } catch {
    return none();
  }
}
