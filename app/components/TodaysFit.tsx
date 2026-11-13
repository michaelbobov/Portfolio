'use client';

import { useEffect, useRef, useState } from 'react';
import DressedDoll from '@/app/components/DressedDoll';
import type { PublicOutfit } from '@/app/data/me';

// A quiet line under the About page's doll once he has published an outfit: "Today's fit · Nov 12".
// It opens a small card with his doll in that outfit (in 3D, loaded only when the card opens), what he
// wore, his photo if he chose to show it, and arrows back through earlier days. Nothing shows until
// there's an outfit.
const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

export default function TodaysFit() {
  const [outfits, setOutfits] = useState<PublicOutfit[]>([]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    fetch('/api/outfit').then((r) => r.json())
      .then((d) => setOutfits((Array.isArray(d.outfits) ? d.outfits : []).filter((o: PublicOutfit) => Array.isArray(o?.outfit) && o.outfit.length)))
      .catch(() => undefined);
  }, []);

  if (!outfits.length) return null;
  const latest = outfits[0], o = outfits[i] ?? latest;

  const show = () => { setI(0); setShown(true); dialog.current?.showModal(); };
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className="tf-open" onClick={show}>
        {isToday(latest.date) ? 'Today’s fit' : 'Latest fit'} <span>· {day(latest.date)}</span>
      </button>
      {/* A click on the backdrop (the dialog itself, outside the card) closes it */}
      <dialog ref={dialog} className="tf" aria-labelledby="tf-title" onClose={() => setShown(false)} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="tf-card">
          <div className="tf-top">
            <h2 id="tf-title">{isToday(o.date) ? 'Today’s fit' : day(o.date)}</h2>
            <button type="button" className="tf-close" aria-label="Close" onClick={close}>×</button>
          </div>
          <div className={`tf-pics${o.photo ? ' has-photo' : ''}`}>
            {shown && <DressedDoll outfit={o.outfit} className="tf-doll" />}
            {o.photo && <img src={`/api/outfit/${o.id}/photo`} alt="The outfit in real life" />}
          </div>
          <ul className="tf-pieces">
            {o.outfit.map((g, k) => <li key={k}>{g.label}</li>)}
          </ul>
          {outfits.length > 1 && (
            <div className="tf-nav">
              <button type="button" disabled={i >= outfits.length - 1} onClick={() => setI(i + 1)}>← Earlier</button>
              <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}>Later →</button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
