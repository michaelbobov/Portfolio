'use client';

import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SHAPE } from '@/app/data/layers';

// The hero's matryoshka. It starts as one doll and opens by itself as the headline lands, the way a
// real set does: the big doll's top pops and the next doll hops out of it onto the shelf, then that
// one pops and lets out the next, down to the littlest. Clicking files them back in, smallest first,
// and opens them again. It is CSS toggled by one class, so it can be reversed halfway; each phase is
// a delay, not a timeline. Measured offsets (how far each doll sits from the middle) are the only JS.
// Each doll is painted tone-on-tone in its own purple, like a lacquered set painted in one colour
// family: a lighter headscarf, a little fringe, an apron panel with a folk flower, a soft gloss.
// The seam at the waist is only a step in tone (the bottom half a shade deeper). The littlest is solid.
const DOLLS = [
  { size: 1, body: '#8b5cf6', shade: '#7e4ef1', scarf: '#b9a2f9', apron: '#cdbdfb', deep: '#4a2a9c' },
  { size: 0.72, body: '#a78bfa', shade: '#9a7cf7', scarf: '#cbbcfc', apron: '#ddd3fd', deep: '#58389f' },
  { size: 0.52, body: '#c4b5fd', shade: '#b8a6fb', scarf: '#e0d7fe', apron: '#ece6ff', deep: '#6b49c0' },
  { size: 0.36, body: '#ede7fe', shade: '#e3dafd', scarf: '#f8f5ff', apron: null, deep: '#7c5cd6' },
] as const;
const INK = '#140b24';
// The headline's last word finishes rising at about 0.9s; the set opens right after
const AUTO_OPEN_MS = 1000;
let autoOpened = false;
const SCARF = 'M100 8C140 8 160 38 160 76C160 96 152 104 154 116C140 130 120 136 100 136S60 130 46 116C48 104 40 96 40 76C40 38 60 8 100 8Z';
const FRINGE = 'M73 78C75 61 87 53 100 55C113 53 125 61 127 78C119 68 110 64 100 69C90 64 81 68 73 78Z';

// A five-petal folk flower in the doll's deepest tone
const Flower = ({ y, r, fill, heart }: { y: number; r: number; fill: string; heart: string }) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      return <circle key={k} cx={(100 + Math.cos(a) * r * 1.35).toFixed(1)} cy={(y + Math.sin(a) * r * 1.35).toFixed(1)} r={r} fill={fill} />;
    })}
    <circle cx="100" cy={y} r={r * 0.9} fill={heart} />
  </g>
);

// One doll, split at the waist into a top half that can lift and a bottom half that stays
export function FlatDoll({ i, prefix, className = '' }: { i: number; prefix: string; className?: string }) {
  const { body, shade, scarf, apron, deep } = DOLLS[i];
  const id = `${prefix}-${i}`, solid = apron === null;
  return (
    <svg className={`ds-doll${solid ? ' is-solid' : ''} ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-t`}><rect x="-20" y="-40" width="240" height="190" /></clipPath>
        <clipPath id={`${id}-b`}><rect x="-20" y="150" width="240" height="130" /></clipPath>
      </defs>
      <ellipse cx="100" cy="255" rx="66" ry="5" fill={INK} opacity=".45" />
      <g className="ds-bot">
        <path d={SHAPE} fill={solid ? body : shade} clipPath={`url(#${id}-b)`} />
        {apron && <ellipse cx="100" cy="203" rx="44" ry="42" fill={apron} />}
        <Flower y={solid ? 196 : 203} r={solid ? 9 : 11} fill={deep} heart={apron ?? scarf} />
        <path d="M30 222c-3-14 0-28 8-40" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g className="ds-top">
        <path d={SHAPE} fill={body} clipPath={`url(#${id}-t)`} />
        <path d={SCARF} fill={scarf} />
        <ellipse cx="100" cy="86" rx="29" ry="32" fill="#fff8f2" />
        <path d={FRINGE} fill={deep} />
        <circle cx="90" cy="88" r="3.4" fill={INK} />
        <circle cx="110" cy="88" r="3.4" fill={INK} />
        <circle cx="84" cy="100" r="5" fill="#ff9fc4" opacity=".6" />
        <circle cx="116" cy="100" r="5" fill="#ff9fc4" opacity=".6" />
        <path d="M58 46c8-15 20-24 34-28" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function DollSet() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  // It opens by itself as "deeper." lands in the headline, once per visit; with reduced motion it
  // is simply open. After that it is the visitor's to close and open.
  useEffect(() => {
    if (autoOpened) return;
    const openNow = () => { autoOpened = true; setOpen(true); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { openNow(); return; }
    // The flag is set only when it opens, so a cancelled timer (React re-running effects) still opens
    const t = window.setTimeout(openNow, AUTO_OPEN_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Closed, every doll sits in the middle of the row; measure how far each slot is from there
  useLayoutEffect(() => {
    const row = ref.current;
    if (!row) return;
    const slots = Array.from(row.querySelectorAll<HTMLElement>('.ds-slot'));
    const measure = () => {
      const middle = row.clientWidth / 2;
      slots.forEach((s) => s.style.setProperty('--dx', `${(middle - (s.offsetLeft + s.offsetWidth / 2)).toFixed(1)}px`));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`ds${open ? ' is-open' : ''}`}
      aria-pressed={open}
      aria-label={open ? 'Nest the matryoshka dolls back together' : 'Open the matryoshka'}
      onClick={() => setOpen((o) => !o)}
    >
      {DOLLS.map((d, i) => (
        <span key={i} className="ds-slot" style={{ '--i': i, height: `${d.size * 100}%` } as CSSProperties}>
          <FlatDoll i={i} prefix="ds" />
        </span>
      ))}
      <span className="ds-hint" aria-hidden="true">{open ? 'Close me' : 'Open me'}</span>
    </button>
  );
}
