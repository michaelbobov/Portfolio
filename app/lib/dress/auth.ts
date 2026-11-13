import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// The private outfit page (/dress) is his alone: one passcode (DRESS_PASSCODE), then a signed,
// http-only cookie for a year. The cookie is signed with a key made from the passcode, so changing the
// passcode signs every phone out. On his Mac (development) there's no sign-in.
const NAME = 'dress';
const DAYS = 365;

const sha = (s: string) => createHash('sha256').update(s).digest();
const key = () => {
  const p = process.env.DRESS_PASSCODE;
  if (!p) throw new Error('DRESS_PASSCODE is not set');
  return sha(`dress-cookie:${p}`);
};
const sign = (exp: string) => createHmac('sha256', key()).update(exp).digest('base64url');
const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

export function checkPasscode(input: unknown) {
  const p = process.env.DRESS_PASSCODE;
  return !!p && typeof input === 'string' && same(sha(input), sha(p));
}

export function sessionCookie() {
  const exp = String(Date.now() + DAYS * 864e5);
  return {
    name: NAME,
    value: `${exp}.${sign(exp)}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: DAYS * 86400,
  };
}

export function isSignedIn() {
  if (process.env.NODE_ENV !== 'production') return true;
  try {
    const v = cookies().get(NAME)?.value;
    if (!v) return false;
    const [exp, sig] = v.split('.');
    return !!exp && !!sig && Number(exp) > Date.now() && same(Buffer.from(sig), Buffer.from(sign(exp)));
  } catch {
    return false;
  }
}

export const denied = () => Response.json({ error: 'Sign in first.' }, { status: 401 });
