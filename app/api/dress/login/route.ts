import { NextResponse } from 'next/server';
import { checkPasscode, sessionCookie } from '@/app/lib/dress/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { passcode } = await req.json().catch(() => ({}));
  if (!process.env.DRESS_PASSCODE) return NextResponse.json({ error: 'DRESS_PASSCODE isn’t set on the server.' }, { status: 500 });
  if (!checkPasscode(passcode)) {
    // Slow down guessing
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'That’s not it.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie());
  return res;
}
