'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { SHAPE } from '@/app/data/layers';
import { DOLL_INTRO } from '@/app/data/intro';

// The hero's matryoshka. It starts as one doll and opens by itself as the headline lands, the way a
// real set does: the big doll stays put, its lid lifts clear, and the next doll rises up out of the
// cup (carrying the smaller ones inside) and lands beside it, then opens in turn, in one cascade
// down to the littlest. Clicking packs them back, the same motion backwards, and opens them again;
// mid-way it turns around. Web Animations drive the motion; the class holds the resting states.
//
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
// Where each slot's centre sits relative to the middle of the open row, as (row height × oh) +
// (gap × og). Each doll is 200/260 as wide as it is tall, so with heights 1, .72, .52, .36 the row is
// 2 heights plus 3 gaps wide. Closed, the small dolls sit over the big one and the row is shifted so
// the big one stands in the middle: worked out in CSS, so the very first frame is already right.
const OFFSETS = [[-0.615385, -1.5], [0.046154, -0.5], [0.523077, 0.5], [0.861538, 1.5]] as const;
// The first opening runs on the headline's timeline (data/intro); a click opens or closes it quicker
const CLICK_STEP_MS = 380;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
// The hop: an even glide across, and a thrown arc up and down
const GLIDE = 'cubic-bezier(0.45, 0, 0.25, 1)';
// (a soft take-off, not a jolt, and a soft landing, not a thud)
const RISE = 'cubic-bezier(0.3, 0.45, 0.45, 1)';
const FALL = 'cubic-bezier(0.55, 0, 0.6, 0.75)';
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
// The waist is cut along the front half of an ellipse, the way you see the rim of a cup from a little
// above: the bottom half's top edge is that front lip, the lid's bottom edge matches it, and the
// opening behind it (DollInside) is a separate layer, so a doll coming out sits inside the cup.
const LIP = 'A70 11 0 0 0 170 150';
export function FlatDoll({ i, prefix, className = '', shadow = true }: { i: number; prefix: string; className?: string; shadow?: boolean }) {
  const { body, shade, scarf, apron, deep } = DOLLS[i];
  const id = `${prefix}-${i}`, solid = apron === null;
  return (
    <svg className={`ds-doll${solid ? ' is-solid' : ''} ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-t`}><path d="M-20 -40H220V150H170A70 11 0 0 1 30 150H-20Z" /></clipPath>
        <clipPath id={`${id}-b`}><path d={`M-20 150H30${LIP}H220V280H-20Z`} /></clipPath>
      </defs>
      {shadow && <ellipse cx="100" cy="255" rx="66" ry="5" fill={INK} opacity=".45" />}
      <g className="ds-bot">
        <path d={SHAPE} fill={solid ? body : shade} clipPath={`url(#${id}-b)`} />
        {/* The front lip of the rim, catching the light */}
        {!solid && <path d={`M30 150${LIP}`} fill="none" stroke={body} strokeWidth="3" />}
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

// The inside of a doll's bottom half: the rim seen from above and the dark opening. It is its own
// layer, behind the doll that sits inside and in front of nothing, so that doll is in the cup.
export function DollInside({ i, className = '' }: { i: number; className?: string }) {
  const { body, deep } = DOLLS[i];
  return (
    <svg className={`ds-in ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="150" rx="69" ry="11" fill={body} />
      <ellipse cx="100" cy="151" rx="61" ry="8.5" fill={deep} />
    </svg>
  );
}

export default function DollSet() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const openRef = useRef(false);
  const anims = useRef<Animation[]>([]);
  const [open, setOpen] = useState(false);
  // Hover is switched off while the set moves (so it never fights the lids), and eases in after
  const [moving, setMoving] = useState(false);
  const run = useRef(0);

  // The opening, built from closed to open, one round per doll that opens. In round r the lid of doll
  // r-1 lifts clear and doll r rises up out of it, carrying the smaller dolls inside, and lands in its
  // own place. Rounds overlap into a cascade (the next one starts while the last doll is still
  // landing), which works because each round is added on top of the last: a doll's path is the sum
  // of every hop it has been carried through. Sideways and up-and-down are separate, so each hop is
  // one smooth arc. Underneath, the row glides back to centre. Closing plays all of it backwards.
  const build = (step: number, lead: number) => {
    const row = ref.current;
    const track = row?.querySelector<HTMLElement>('.ds-track');
    if (!row || !track) return [];
    const slots = Array.from(row.querySelectorAll<HTMLElement>('.ds-slot'));
    const xs = slots.map((s) => s.offsetLeft + s.offsetWidth / 2);
    const hs = slots.map((s) => s.offsetHeight);
    const hop = 640, n = slots.length;
    const total = (n - 2) * step + lead + hop;
    // Every animation spans the same total time, so reversing them all keeps them in step
    const span = (delay: number, duration: number): KeyframeAnimationOptions => ({ delay, duration, endDelay: total - delay - duration, fill: 'both' });
    const parts = (k: number) => Array.from(slots[k].querySelectorAll<Element>('.ds-doll, .ds-in, .ds-shadow'));
    const list: Animation[] = [];
    for (let k = 1; k < n; k++) {
      // Closed, doll k sits inside the big one: start from there
      parts(k).forEach((el) => list.push(el.animate([{ transform: `translateX(${xs[0] - xs[k]}px)` }, { transform: `translateX(${xs[0] - xs[k]}px)` }], span(0, total))));
    }
    for (let r = 1; r < n; r++) {
      const t = (r - 1) * step + lead, dx = xs[r] - xs[r - 1], lift = hs[r - 1] * 0.46;
      for (let k = r; k < n; k++) {
        parts(k).forEach((el) => {
          // It rises straight up out of the cup first, then glides across once it has cleared the rim
          list.push(el.animate([{ transform: 'translateX(0px)' }, { transform: `translateX(${dx}px)` }], { ...span(t + hop * 0.3, hop * 0.7), easing: GLIDE, composite: 'add' }));
          if (el.classList.contains('ds-shadow')) return;
          list.push(el.animate([
            { offset: 0, translate: '0px 0px', easing: RISE },
            { offset: 0.45, translate: `0px ${-lift}px`, easing: FALL },
            { offset: 1, translate: '0px 0px' },
          ], { ...span(t, hop), composite: 'add' }));
        });
      }
      // Doll r's floor shadow appears as it lands in its own place
      const shadow = slots[r].querySelector('.ds-shadow');
      if (shadow) list.push(shadow.animate([{ opacity: 0 }, { opacity: 1 }], span(t + hop * 0.6, hop * 0.4)));
      // The lid of the doll it leaves lifts up and aside, holds while it rises out, then settles
      const lid = slots[r - 1].querySelector<SVGGElement>('.ds-doll .ds-top');
      if (lid) {
        const d = lead + hop * 0.75;
        // No first keyframe: it starts from wherever the lid already is (lifted a little on hover)
        list.push(lid.animate([
          { offset: lead / d, transform: 'translate(-40px, -66px) rotate(-18deg)' },
          { offset: (lead + hop * 0.4) / d, transform: 'translate(-40px, -66px) rotate(-18deg)', easing: EASE_IN_OUT },
          { offset: 1, transform: 'none' },
        ], { ...span((r - 1) * step, d), fill: 'none' }));
      }
    }
    list.push(track.animate([{ transform: `translateX(${track.clientWidth / 2 - xs[0]}px)` }, { transform: 'translateX(0px)' }], { ...span(0, total), easing: EASE_IN_OUT }));
    // Keep every layer once it finishes: the browser otherwise drops finished animations it thinks are
    // covered, and a doll would lose all but its last hop and end up a hop too far along
    list.forEach((a) => a.persist());
    return list;
  };

  // Open or close. Mid-way, the running animation turns around; otherwise a fresh one plays, forwards
  // to open or backwards to close. With reduced motion it just switches.
  const go = (next: boolean, step: number, lead = 120) => {
    openRef.current = next;
    setOpen(next);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (anims.current.some((a) => a.playState === 'running')) {
      anims.current.forEach((a) => a.reverse());
    } else {
      anims.current.forEach((a) => a.cancel());
      anims.current = build(step, lead);
      if (!next) anims.current.forEach((a) => a.reverse());
    }
    const id = ++run.current;
    setMoving(true);
    Promise.all(anims.current.map((a) => a.finished)).then(() => { if (run.current === id) setMoving(false); }, () => {});
  };

  // The resting states are CSS (so the first frame is right); a resize drops any held animation
  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const ro = new ResizeObserver(() => {
      if (anims.current.some((a) => a.playState === 'running')) return;
      anims.current.forEach((a) => a.cancel());
      anims.current = [];
    });
    ro.observe(row);
    return () => { ro.disconnect(); anims.current.forEach((a) => a.cancel()); };
  }, []);

  // It opens by itself with the headline, once per visit, one doll per line (the slower step); with
  // reduced motion it is simply open. After that it is the visitor's to close and open.
  useEffect(() => {
    if (autoOpened) return;
    // The flag is set only when it opens, so a cancelled timer (React re-running effects) still opens
    const t = window.setTimeout(() => { autoOpened = true; go(true, DOLL_INTRO.step, DOLL_INTRO.lead); }, DOLL_INTRO.open);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`ds${open ? ' is-open' : ''}${moving ? ' is-moving' : ''}`}
      aria-pressed={open}
      aria-label={open ? 'Nest the matryoshka dolls back together' : 'Open the matryoshka'}
      onClick={() => go(!openRef.current, CLICK_STEP_MS)}
    >
      <span className="ds-track">
        {DOLLS.map((d, i) => (
          <span key={i} className="ds-slot" style={{ '--i': i, '--oh': OFFSETS[i][0], '--og': OFFSETS[i][1], '--rise': ((1 - d.size) * 8) / 260, height: `${d.size * 100}%` } as CSSProperties}>
            <span className="ds-shadow" />
            {i < DOLLS.length - 1 && <DollInside i={i} />}
            <FlatDoll i={i} prefix="ds" shadow={false} />
          </span>
        ))}
      </span>
      <span className="ds-hint" aria-hidden="true">{open ? 'Close me' : 'Open me'}</span>
    </button>
  );
}
