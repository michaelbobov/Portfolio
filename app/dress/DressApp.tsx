'use client';

import { useEffect, useRef, useState } from 'react';
import DressedDoll from '@/app/components/DressedDoll';
import type { PublicOutfit } from '@/app/data/me';

// One step: he takes a photo, the doll is dressed in what he's wearing and goes live. Afterwards he
// sees it, with Undo (takes it off the site) and Retake (a new photo replaces it).
type Step = 'login' | 'ready' | 'working' | 'done';

/** The photo shrunk on the phone to at most 1600 px, so it uploads fast and stays under the server's limit */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext('2d')?.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('Couldn’t read that photo.'))), 'image/jpeg', 0.88));
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data as T;
}
const post = <T,>(url: string, body: unknown) =>
  call<T>(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function DressApp({ signedIn }: { signedIn: boolean }) {
  const [step, setStep] = useState<Step>(signedIn ? 'ready' : 'login');
  const [error, setError] = useState('');
  const [passcode, setPasscode] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [live, setLive] = useState<PublicOutfit | null>(null);
  const [made, setMade] = useState<PublicOutfit | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const replacing = useRef<string | null>(null);

  // What's on the site now
  useEffect(() => {
    if (step !== 'ready') return;
    fetch('/api/outfit', { cache: 'no-store' }).then((r) => r.json()).then((d) => setLive(d.current ?? null)).catch(() => undefined);
  }, [step]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await post('/api/dress/login', { passcode }); setPasscode(''); setStep('ready'); } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  /** Opens the camera (or library); a retake replaces the outfit just made */
  const shoot = (replace: string | null = null) => { replacing.current = replace; setError(''); fileRef.current?.click(); };

  const dress = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setStep('working');
    try {
      const small = await shrink(file);
      setPhotoUrl(URL.createObjectURL(small));
      const form = new FormData();
      form.append('photo', small, 'photo.jpg');
      if (replacing.current) form.append('replace', replacing.current);
      const r = await call<{ outfit: PublicOutfit }>('/api/dress/fit', { method: 'POST', body: form });
      setMade(r.outfit);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStep(made ? 'done' : 'ready');
    }
  };

  const undo = async () => {
    if (!made) return;
    try { await post('/api/dress/unpublish', { id: made.id }); setMade(null); setPhotoUrl(''); setStep('ready'); }
    catch (err) { setError(err instanceof Error ? err.message : String(err)); }
  };

  return (
    <main className="dr">
      <header className="dr-head">
        <h1>Today’s fit</h1>
        {step === 'ready' && live && <p className="dr-live">Live: {day(live.date)}</p>}
      </header>

      {error && <p className="dr-error" role="alert">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { dress(e.target.files?.[0]); e.target.value = ''; }} />

      {step === 'login' && (
        <form className="dr-card" onSubmit={login}>
          <label htmlFor="dr-pass">Passcode</label>
          <input id="dr-pass" type="password" autoComplete="current-password" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoFocus />
          <button type="submit" className="dr-btn" disabled={!passcode}>Sign in</button>
        </form>
      )}

      {step === 'ready' && (
        <button type="button" className="dr-shoot" onClick={() => shoot()}>
          <span className="dr-shoot-icon" aria-hidden="true" />
          Take today’s photo
          <small>Head to toe is best. A mirror selfie works.</small>
        </button>
      )}

      {step === 'working' && (
        <div className="dr-card dr-busy" aria-live="polite">
          {photoUrl && <img className="dr-photo" src={photoUrl} alt="" />}
          <p><span className="dr-spin" aria-hidden="true" />Dressing your doll…</p>
        </div>
      )}

      {step === 'done' && made && (
        <div className="dr-card">
          <div className="dr-stage">
            <DressedDoll outfit={made.outfit} className="dr-doll" />
            {photoUrl && <img className="dr-thumb" src={photoUrl} alt="Your photo" />}
          </div>
          <p className="dr-done">It’s live. Your doll is wearing:</p>
          <ul className="dr-wearing">{made.outfit.map((g, k) => <li key={k}>{g.label}</li>)}</ul>
          <div className="dr-row">
            <button type="button" className="dr-btn is-quiet" onClick={undo}>Undo</button>
            <button type="button" className="dr-btn is-quiet" onClick={() => shoot(made.id)}>Retake</button>
          </div>
        </div>
      )}
    </main>
  );
}
