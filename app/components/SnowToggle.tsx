'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

// A small switch on the homepage that lets it snow: off by default, remembered once switched. It sets
// data-snow="on" on <html>, which React never re-renders (layout.tsx restores it before first paint), and
// hp.css shows the winter (SnowBackdrop). Off, the knob is a bead of ice; switched on it rolls across and
// packs into a snowball, a frost shimmer runs along the track and a little snow puffs up (hp.css). Only
// after a click, so a remembered "on" doesn't play on load.
// On hover the switch frosts over like ice, a glint crosses the bead, and a few flakes fall on it.
const KEY = 'mb-snow';
// Where each flake of the puff goes: out and up, then down (px), and when it starts (ms)
const PUFF = [[-9, -16, 10, 0], [-2, -21, 14, 40], [6, -18, 12, 20], [12, -12, 16, 70], [-14, -9, 13, 90], [3, -10, 18, 120]];

export default function SnowToggle() {
  const [on, setOn] = useState(false);
  const [puff, setPuff] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    setOn(document.documentElement.dataset.snow === 'on');
  }, []);
  const flip = () => {
    const next = !on;
    setOn(next);
    setTouched(true);
    if (next) setPuff((n) => n + 1);
    if (next) document.documentElement.dataset.snow = 'on'; else delete document.documentElement.dataset.snow;
    try { localStorage.setItem(KEY, next ? 'on' : 'off'); } catch { /* private mode */ }
  };
  return (
    <button type="button" role="switch" aria-checked={on} className={`hp-snow-switch${touched ? ' is-touched' : ''}`} onClick={flip}>
      <span className="hp-snow-track" aria-hidden="true">
        <span className="hp-snow-knob" />
        {puff > 0 && (
          <span key={puff} className="hp-snow-puff">
            {PUFF.map(([x, y, fall, delay], i) => (
              <i key={i} style={{ '--x': `${x}px`, '--y': `${y}px`, '--fall': `${fall}px`, '--delay': `${delay}ms` } as CSSProperties} />
            ))}
          </span>
        )}
      </span>
      <span className="hp-snow-drift" aria-hidden="true"><i /><i /><i /><i /></span>
      Snow
    </button>
  );
}
