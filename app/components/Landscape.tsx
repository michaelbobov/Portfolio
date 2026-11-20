'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ABOVE, placeOf, SUN, type Place } from '@/app/data/places';
import CloudPrint from '@/app/components/CloudPrint';

// The homepage's landscape for where Michael is (data/places.ts), and the little paper label saying so.
// Two one-ink prints per place, far and near, laid on the paper with multiply (postcard.css), and the red
// sun setting behind the far one's mountains. A new place
// fades in over the old one (700 ms), and the old one goes once it's covered. On a mouse the two layers
// drift a few px against each other as the pointer moves (the near one more), for depth; never with
// reduced motion, and never on touch. ?place=japan previews another place.

const FADE_MS = 700;
// (The sun's place, SUN and ABOVE, is in data/places.ts.) ?sun=off leaves it out.
// The most each layer drifts, px, at the edge of the screen
const DRIFT = { far: 4, near: 9 };

export default function Landscape({ initial }: { initial: string }) {
  const [places, setPlaces] = useState<Place[]>(() => [placeOf(initial)]);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = places[places.length - 1];
  const [sun, setSun] = useState(true);
  useEffect(() => { if (new URLSearchParams(window.location.search).get('sun') === 'off') setSun(false); }, []);

  // A preview (?place=), or later a live location, swaps the place
  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get('place');
    if (!want) return;
    const next = placeOf(want);
    if (next.id === current.id) return;
    setPlaces((p) => (p.some((x) => x.id === next.id) ? p : [...p, next]));
    const t = window.setTimeout(() => setPlaces([next]), FADE_MS + 60);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The drift: eased toward the pointer, transforms only, and only while it's still catching up
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, x = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      el.style.setProperty('--dx', x.toFixed(3));
      raf = Math.abs(tx - x) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      {/* Two boxes, each the prints' own 2:1: the distance (the sun setting behind the mountains, the far print,
          its clouds, which drift) runs wide across the page; the near print (the landmark, the city, trees)
          is smaller, to the right, its foot just above the dolls' floor */}
      <div ref={ref} className="pc-land" style={{ '--far': DRIFT.far, '--near': DRIFT.near } as CSSProperties} role="img" aria-label={current.alt}>
        {/* The sky's clouds, drawn live as a moving halftone (CloudPrint), the same for every place */}
        <CloudPrint />
        <div className="pc-distance">
          {sun && places.map((p, i) => (
            <svg key={`s-${p.id}`} className={`pc-sun${i > 0 ? ' is-new' : ''}`} viewBox={`0 ${-ABOVE} 1536 ${768 + ABOVE}`} aria-hidden="true" focusable="false">
              <mask id={`pc-sky-${p.id}`} maskUnits="userSpaceOnUse" x="0" y={-ABOVE} width="1536" height={768 + ABOVE}>
                <rect x="0" y={-ABOVE} width="1536" height={ABOVE + 2} fill="#fff" />
                <image href={p.sky} x="0" y="0" width="1536" height="768" preserveAspectRatio="none" />
              </mask>
              {/* (paper under the ink, so the sun is a solid disc the clouds pass behind) */}
              <g mask={`url(#pc-sky-${p.id})`}>
                <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r * 0.82} fill="#f3ead9" />
                <image href="/postcard/sun.webp" x={SUN.cx - SUN.r} y={SUN.cy - SUN.r} width={2 * SUN.r} height={2 * SUN.r} />
              </g>
            </svg>
          ))}
          {places.map((p, i) => <img key={`f-${p.id}`} className={`pc-far${i > 0 ? ' is-new' : ''}`} src={p.far} alt="" width={1536} height={768} fetchPriority={i === 0 ? 'high' : 'auto'} decoding="async" />)}
        </div>
        <div className="pc-nearby">
          {places.map((p, i) => <img key={`n-${p.id}`} className={`pc-near${i > 0 ? ' is-new' : ''}`} src={p.near} alt="" width={1536} height={768} decoding="async" />)}
        </div>
      </div>
      {/* (where he is, in plain typed words under his title; it changes with the place) */}
      <p className="pc-where">Currently in <span key={current.id} className="pc-where-city">{current.caption}</span></p>
    </>
  );
}
