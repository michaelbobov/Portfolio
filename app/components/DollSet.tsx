'use client';

import type { CSSProperties } from 'react';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DOLL_INTRO } from '@/app/data/intro';
import { DOLLS } from '@/app/data/dolls';
import { DollInside, FLAT_AFTER, FlatDoll } from '@/app/components/FlatDoll';
import type { DollScene as DollSceneT } from '@/app/components/DollScene';

// The hero's matryoshka, and a way into the site: four dolls, each a link (Work, Side projects, How
// I work, and the littlest, About me), mirrored by the nav at the bottom of every other page. It starts as
// one doll and opens by itself as the headline lands, the way a real set does: the big doll stays put, its lid lifts clear, and the next doll rises
// up out of the cup (carrying the smaller ones inside) and lands beside it, then opens in turn, in
// one cascade down to the littlest. Following a doll plays a little opening, then the page. Web
// Animations drive the motion; the class holds the resting states.
//
// The dolls' art (colours, scarf, fringe) is shared with the 3D set in data/dolls. The seam at the
// waist is only a step in tone (the bottom half a shade deeper). The littlest is solid.
// Where each slot's centre sits relative to the middle of the open row, as (row height × oh) +
// (gap × og). Each doll is 200/260 as wide as it is tall, so with heights 1, .72, .52, .36 the row is
// 2 heights plus 3 gaps wide. Closed, the small dolls sit over the big one and the row is shifted so
// the big one stands in the middle: worked out in CSS, so the very first frame is already right.
const OFFSETS = [[-0.615385, -1.5], [0.046154, -0.5], [0.523077, 0.5], [0.861538, 1.5]] as const;
// The opening runs on the headline's timeline (data/intro)
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
// The hop: an even glide across, and a thrown arc up and down
const GLIDE = 'cubic-bezier(0.45, 0, 0.25, 1)';
// (a soft take-off, not a jolt, and a soft landing, not a thud)
const RISE = 'cubic-bezier(0.3, 0.45, 0.45, 1)';
const FALL = 'cubic-bezier(0.55, 0, 0.6, 0.75)';
let autoOpened = false;
// On the homepage the 3D set starts loading as soon as this code runs, not after the page has
// hydrated. (This code also runs when another page's link prefetches the homepage; then it waits until
// the set mounts, so other pages never fetch three.js.) Until it's drawn the flat set waits unseen
// (hp.css), so the flat one never shows first; it shows only if the 3D one is late, or can't run.
let sceneModule: Promise<typeof import('@/app/components/DollScene')> | null = null;
const loadScene = () => (sceneModule ??= import('@/app/components/DollScene'));
if (typeof window !== 'undefined' && window.location.pathname === '/') loadScene().catch(() => {});

// Where each doll takes you, biggest first. The littlest is Michael.
const PLACES = [
  { href: '/work', label: 'Work' },
  { href: '/side-projects', label: 'Side projects' },
  { href: '/how-i-work', label: 'How I work' },
  { href: '/about', label: 'About me' },
];
// How long a doll's little opening plays before the page changes
const LEAVE_MS = 460;

export default function DollSet() {
  const ref = useRef<HTMLElement | null>(null);
  const router = useRouter();
  // Coming back to the homepage in the same visit, the set is already open
  const openRef = useRef(autoOpened);
  const anims = useRef<Animation[]>([]);
  const [open, setOpen] = useState(autoOpened);
  // The real 3D set (DollScene), drawn over the flat one once it's ready; if it's late, or there's no
  // WebGL, the flat set shows (flat). It loads on its own, so it never holds the page up.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scene = useRef<DollSceneT | null>(null);
  const [in3d, setIn3d] = useState(false);
  const [flat, setFlat] = useState(false);
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
    const hop = DOLL_INTRO.hop, n = slots.length;
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
      // Doll r's floor shadow and its caption appear as it lands in its own place
      slots[r].querySelectorAll('.ds-shadow, .ds-cap').forEach((el) => list.push(el.animate([{ opacity: 0 }, { opacity: 1 }], span(t + hop * 0.6, hop * 0.4))));
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
  const go = (next: boolean, step: number, lead = DOLL_INTRO.lead) => {
    openRef.current = next;
    setOpen(next);
    // Tell the 3D set (and note when, so one that loads mid-way can catch up)
    const root = ref.current;
    if (root) {
      Object.assign(root.dataset, { goAt: String(performance.now()), goOpen: next ? '1' : '0', goStep: String(step), goLead: String(lead) });
      scene.current?.go(next, step, lead);
    }
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

  // Following a doll: a quick opening first (its lid lifts; the littlest, which is solid, hops), then
  // the page. New-tab clicks and reduced motion go straight there.
  const visit = (e: MouseEvent<HTMLAnchorElement>, i: number) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const slot = e.currentTarget;
    const lid = slot.querySelector<SVGGElement>('.ds-doll:not(.is-solid) .ds-top');
    lid?.animate([{ transform: 'translate(-40px, -66px) rotate(-18deg)' }], { duration: LEAVE_MS, easing: EASE_OUT, fill: 'forwards' });
    // The littlest is solid: it hops instead
    if (!lid) slot.querySelector('.ds-doll')?.animate([{ translate: '0 0' }, { translate: '0 -22%', offset: 0.45, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' }, { translate: '0 0' }], { duration: LEAVE_MS, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)', composite: 'add' });
    router.prefetch(PLACES[i].href);
    window.setTimeout(() => router.push(PLACES[i].href), LEAVE_MS);
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

  useEffect(() => {
    let dead = false;
    const root = ref.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const late = window.setTimeout(() => setFlat(true), FLAT_AFTER);
    const fail = () => { window.clearTimeout(late); setFlat(true); };
    loadScene().then(({ createDollScene }) => {
      if (dead) return;
      try {
        const s = createDollScene(root, canvas);
        scene.current = s;
        // Catch up with an opening that started before it was ready
        const at = Number(root.dataset.goAt);
        if (at) s.go(root.dataset.goOpen === '1', Number(root.dataset.goStep), Number(root.dataset.goLead), performance.now() - at);
        s.ready.then(() => { if (!dead) { window.clearTimeout(late); setIn3d(true); } });
      } catch {
        // No WebGL
        fail();
      }
    }, fail);
    return () => { dead = true; window.clearTimeout(late); scene.current?.dispose(); scene.current = null; };
  }, []);

  // The intro starts once the set is shown (the 3D one drawn, or the flat one as the fallback), so
  // "Design," and the first doll arrive together: it says so (IntroStage starts its clock, and hp.css
  // lets the headline go), then opens by itself with the headline, once per visit, one doll per line;
  // with reduced motion it is simply open. After that it is the visitor's to put back and open.
  const shown = in3d || flat;
  useEffect(() => {
    if (!shown) return;
    ref.current?.dispatchEvent(new CustomEvent('ds-shown', { bubbles: true }));
    if (autoOpened) return;
    // The flag is set only when it opens, so a cancelled timer (React re-running effects) still opens
    const t = window.setTimeout(() => { autoOpened = true; go(true, DOLL_INTRO.step, DOLL_INTRO.lead); }, DOLL_INTRO.open);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  return (
    <nav
      ref={ref}
      aria-label="Sections"
      className={`ds${open ? ' is-open' : ''}${moving ? ' is-moving' : ''}${in3d ? ' is-3d' : ''}${flat ? ' is-flat' : ''}`}
    >
      <canvas ref={canvasRef} className="ds-3d" aria-hidden="true" />
      <span className="ds-track">
        {DOLLS.map((d, i) => (
          <Link
            key={i}
            href={PLACES[i].href}
            onClick={(e) => visit(e, i)}
            className="ds-slot"
            style={{ '--i': i, '--oh': OFFSETS[i][0], '--og': OFFSETS[i][1], '--rise': ((1 - d.size) * 8) / 260, height: `${d.size * 100}%` } as CSSProperties}
          >
            <span className="ds-shadow" aria-hidden="true" />
            {i < DOLLS.length - 1 && <DollInside i={i} />}
            <FlatDoll i={i} prefix="ds" shadow={false} />
            <span className="ds-cap">{PLACES[i].label}</span>
          </Link>
        ))}
      </span>
    </nav>
  );
}
