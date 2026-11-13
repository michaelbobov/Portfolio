'use client';

import { useEffect, useState } from 'react';
import DressedDoll from '@/app/components/DressedDoll';
import { SAMPLES, cleanOutfit } from '@/app/data/outfit';

// The 3D clothes on his doll, in the two sample outfits; ?still=<angle> stops the turning, ?open opens it
export default function OutfitPreview() {
  const [open, setOpen] = useState(false);
  const [still, setStill] = useState<number | undefined>(undefined);
  const [shown, setShown] = useState(SAMPLES);
  const [only, setOnly] = useState<number | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.has('open')) setOpen(true);
    if (q.has('still')) setStill(Number(q.get('still')) || 0);
    if (q.has('only')) setOnly(Number(q.get('only')) || 0);
    // ?try=shirt,jacket:open — those garments alone, in plain colours, one doll each
    const tryList = q.get('try');
    if (tryList) {
      const COLORS = ['#c9b48f', '#4a6890', '#e9e4d8', '#7d8590', '#5d6640'];
      setShown(tryList.split(',').map((t, k) => {
        const [kind, flag] = t.split(':');
        return { name: t, outfit: cleanOutfit([{ kind, color: COLORS[k % COLORS.length], pattern: flag === 'stripes' ? 'stripes' : 'solid', color2: '#26365e', open: flag === 'open', label: t }]) };
      }));
      return;
    }
    // What's live now, first
    if (!tryList) fetch('/api/outfit', { cache: 'no-store' }).then((r) => r.json()).then((d) => {
      if (Array.isArray(d?.current?.outfit)) setShown([{ name: 'Live now', outfit: d.current.outfit }, ...SAMPLES]);
    }).catch(() => undefined);
  }, []);
  return (
    <main className="op">
      <header className="op-head">
        <h1>Your doll, dressed</h1>
        <button type="button" className="op-btn" aria-pressed={open} onClick={() => setOpen(!open)}>{open ? 'Close the doll' : 'Open the doll'}</button>
      </header>
      <div className="op-grid">
        {shown.filter((_, k) => only === null || k === only).map((s) => (
          <figure key={s.name}>
            <DressedDoll outfit={s.outfit} open={open} still={still} className="op-canvas" />
            <figcaption><strong>{s.name}</strong>{s.outfit.map((g) => g.label).join(' · ')}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
