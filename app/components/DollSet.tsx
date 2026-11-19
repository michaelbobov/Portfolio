'use client';

import type { CSSProperties } from 'react';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DOLL_INTRO } from '@/app/data/intro';
import { DOLLS, DOLL_ART, SET_SIZE } from '@/app/data/dolls';
import { DollInside, FLAT_AFTER, FlatDoll, canWebGL } from '@/app/components/FlatDoll';
import { Crayon, CrayonDefs } from '@/app/components/Crayon';
import type { DollScene as DollSceneT } from '@/app/components/DollScene';

// The hero's matryoshka, and a way into the site: three dolls, each a link (Work, Side projects, and the
// littlest, About me), mirrored by the nav at the bottom of every other page. It starts as
// one doll and opens by itself as the headline lands, the way a real set does: the big doll stays put, its lid lifts clear, and the next doll rises
// up out of the cup (carrying the smaller ones inside) and lands beside it, then opens in turn, in
// one cascade down to the littlest. Following a doll plays a little opening, then the page. Web
// Animations drive the motion; the class holds the resting states.
//
// The dolls' art (colours, scarf, fringe) is shared with the 3D set in data/dolls. The seam at the
// waist is only a step in tone (the bottom half a shade deeper). The littlest is solid.
const SET = DOLLS.slice(0, SET_SIZE);
// Where each slot's centre sits relative to the middle of the open row, as (row height × oh) +
// (gap × og). Each doll is 200/260 as wide as it is tall, so the row is ROW heights plus n − 1 gaps wide
// (hp.css reads it as --row). Closed, the small dolls sit over the big one and the row is shifted so the
// big one stands in the middle: worked out in CSS, so the very first frame is already right.
const WIDTHS = SET.map((d) => (d.size * 200) / 260);
const ROW = WIDTHS.reduce((a, b) => a + b, 0);
const OFFSETS = SET.map((_, i) => [WIDTHS.slice(0, i).reduce((a, b) => a + b, 0) + WIDTHS[i] / 2 - ROW / 2, i - (SET.length - 1) / 2] as const);
/** The set's geometry for hp.css: its width in heights and gaps, and where the big doll's slot sits */
export const SET_STYLE = { '--row': ROW, '--gaps': SET.length - 1, '--oh0': OFFSETS[0][0], '--og0': OFFSETS[0][1] } as CSSProperties;
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
// His photo on the About page (public/me.webp, his cut-out, 1254 px square) and the circle of it the doll's
// face window becomes, as shares of its width; and the window in his doll's painting (1200 × 1560 px)
const ME_PHOTO = { src: '/me.webp', cx: 610 / 1254, cy: 560 / 1254, r: 315 / 1254, top: 185 / 1254 };
const ME_PAINT = { src: '/dolls/me-front.webp', w: 1200, h: 1560, cx: 599.5, cy: 520, r: 174 };
const MORPH = { ms: 760, ease: 'cubic-bezier(0.65, 0, 0.35, 1)' };
// He rises out of his doll like the next doll in a set: a quick rise, slowing as he clears the rim
const RISE_OUT = { ms: 780, delay: 260, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' };

/** How his doll takes you to the About page: it turns round and comes back as him ('turn', the default:
 *  the littlest doll of a set doesn't open), or it opens and he rises out of it ('open'). Try the other
 *  with /?reveal=open (kept for the visit). */
type Reveal = 'open' | 'turn';
function revealMode(): Reveal {
  const q = new URLSearchParams(window.location.search).get('reveal');
  try {
    if (q === 'open' || q === 'turn') sessionStorage.setItem('me-reveal', q);
    return sessionStorage.getItem('me-reveal') === 'open' ? 'open' : 'turn';
  } catch {
    return q === 'open' ? 'open' : 'turn';
  }
}

type Circle = { x: number; y: number; r: number };
type Rect = { left: number; top: number; width: number; height: number };
const insetOf = (r: Rect, round: number) =>
  `inset(${r.top}px ${window.innerWidth - r.left - r.width}px ${window.innerHeight - r.top - r.height}px ${r.left}px round ${round}px)`;
const loaded = (src: string) => new Promise<HTMLImageElement>((ok, no) => {
  const im = new Image();
  im.onload = () => ok(im); im.onerror = no; im.src = src;
});

/** The moving picture both ways share: a clip (screen coordinates) round content laid out where it starts,
 *  over a porcelain ground that becomes the portrait's panel */
function morphLayer() {
  const morph = document.createElement('div');
  morph.className = 'me-morph';
  morph.setAttribute('aria-hidden', 'true');
  const ground = document.createElement('div');
  ground.className = 'me-morph-ground';
  const content = document.createElement('div');
  content.className = 'me-morph-content';
  morph.append(ground, content);
  return { morph, ground, content };
}

/** The About page in beneath, hidden (me-arriving), then once its portrait is laid out, `glide` carries the
 *  picture onto it; the page fades in round it as it lands, and its own portrait takes over. */
function arrive(go: () => void, morph: HTMLElement, glide: (cell: DOMRect, photo: DOMRect, round: number) => void) {
  const html = document.documentElement;
  html.classList.add('me-leaving');
  const done = () => {
    html.classList.remove('me-leaving', 'me-arriving', 'me-landing', 'me-going');
    morph.remove();
  };
  window.setTimeout(() => {
    html.classList.add('me-arriving');
    go();
    const t0 = performance.now();
    const land = () => {
      const cell = document.querySelector<HTMLElement>('.me-face'), img = cell?.querySelector<HTMLImageElement>('.me-photo');
      if (!cell || !img || !img.complete || !img.naturalWidth) {
        if (performance.now() - t0 < 5000) requestAnimationFrame(land); else done();
        return;
      }
      glide(cell.getBoundingClientRect(), img.getBoundingClientRect(), parseFloat(getComputedStyle(cell).borderTopLeftRadius) || 0);
      window.setTimeout(() => html.classList.add('me-landing'), MORPH.ms * 0.45);
      window.setTimeout(done, MORPH.ms + 30);
    };
    requestAnimationFrame(land);
  }, 240);
}

/** 'open': his doll's lid is set down aside (DollScene.release) and he rises up out of the cup, the way each
 *  doll in the set rises out of the one before; risen, he glides into his portrait on the About page while
 *  the porcelain panel gathers round him. Hidden below the rim while he rises (the clip's bottom edge). */
function riseToAbout(rim: Circle, go: () => void) {
  const { morph, ground, content } = morphLayer();
  const photo = new Image();
  photo.src = ME_PHOTO.src; photo.alt = '';
  // his face the size of the doll's painted one; risen to his collar
  const w = rim.r * 1.7, left = rim.x - ME_PHOTO.cx * w, top = rim.y - w * 0.8;
  Object.assign(photo.style, { left: `${left}px`, top: `${top}px`, width: `${w}px` });
  content.append(photo);
  ground.style.opacity = '0';
  const H = window.innerHeight, above = `inset(0px 0px ${H - rim.y}px 0px round 0px)`;
  morph.style.clipPath = above;
  document.body.append(morph);
  const rise = photo.animate([{ transform: `translateY(${w * (0.8 - ME_PHOTO.top) + 4}px)` }, { transform: 'none' }], { duration: RISE_OUT.ms, delay: RISE_OUT.delay, easing: RISE_OUT.ease, fill: 'both' });
  // (the page starts to go once he's mostly out)
  window.setTimeout(() => arrive(go, morph, (c, b, round) => {
    const sc = b.width / w, tx = b.left - left * sc, ty = b.top - top * sc;
    const timing = { duration: MORPH.ms, easing: MORPH.ease, fill: 'forwards' as const };
    Object.assign(ground.style, { left: `${c.left}px`, top: `${c.top}px`, width: `${c.width}px`, height: `${c.height}px`, borderRadius: `${round}px` });
    rise.finish();
    morph.animate([{ clipPath: above }, { clipPath: insetOf(c, round) }], timing);
    content.animate([{ transform: 'none' }, { transform: `translate(${tx}px, ${ty}px) scale(${sc})` }], timing);
    ground.animate([{ opacity: 0 }, { opacity: 1 }], { duration: MORPH.ms * 0.5, delay: MORPH.ms * 0.15, easing: 'ease-out', fill: 'forwards' });
  }), RISE_OUT.delay + RISE_OUT.ms * 0.7);
}

/** 'turn' (and the plain way): his doll's face window lifts off and opens out into the portrait's panel,
 *  growing the photo with it. After a turn his photo is already in the window; otherwise the painted face
 *  turns into the photo on the way. */
function windowToAbout(face: Circle, go: () => void, photoFirst: boolean) {
  const { morph, ground, content } = morphLayer();
  const photo = new Image(), paint = new Image();
  photo.src = ME_PHOTO.src; paint.src = ME_PAINT.src; photo.alt = paint.alt = '';
  // both pictures with their circles on the doll's face circle
  const pw = face.r / ME_PHOTO.r, k = face.r / ME_PAINT.r;
  Object.assign(photo.style, { left: `${face.x - ME_PHOTO.cx * pw}px`, top: `${face.y - ME_PHOTO.cy * pw}px`, width: `${pw}px` });
  const circle = { left: face.x - face.r, top: face.y - face.r, width: 2 * face.r, height: 2 * face.r };
  // (behind the window, the porcelain the doll's window has round his cut-out)
  Object.assign(ground.style, { left: `${circle.left}px`, top: `${circle.top}px`, width: `${circle.width}px`, height: `${circle.height}px` });
  content.append(photo);
  // (the painting only inside its face window: the doll's hood doesn't come along)
  const paintWin = document.createElement('div');
  if (!photoFirst) {
    photo.style.opacity = '0';
    paintWin.className = 'me-morph-paint';
    Object.assign(paintWin.style, { left: `${circle.left}px`, top: `${circle.top}px`, width: `${circle.width}px`, height: `${circle.height}px` });
    Object.assign(paint.style, { left: `${face.r - ME_PAINT.cx * k}px`, top: `${face.r - ME_PAINT.cy * k}px`, width: `${ME_PAINT.w * k}px` });
    paintWin.append(paint);
    content.append(paintWin);
  }
  morph.style.clipPath = insetOf(circle, face.r);
  document.body.append(morph);
  // it lifts off as the homepage goes
  content.animate([{ transform: 'none' }, { transform: 'translateY(-2px)' }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
  arrive(go, morph, (c, b, round) => {
    const to = { x: b.left + ME_PHOTO.cx * b.width, y: b.top + ME_PHOTO.cy * b.width, r: ME_PHOTO.r * b.width };
    // the content's move: the face circle carried from the doll to the portrait (scaled about the origin)
    const sc = to.r / face.r, tx = to.x - face.x * sc, ty = to.y - face.y * sc;
    const timing = { duration: MORPH.ms, easing: MORPH.ease, fill: 'forwards' as const };
    morph.animate([{ clipPath: insetOf(circle, face.r) }, { clipPath: insetOf(c, round) }], timing);
    ground.animate([{ left: `${circle.left}px`, top: `${circle.top}px`, width: `${circle.width}px`, height: `${circle.height}px` }, { left: `${c.left}px`, top: `${c.top}px`, width: `${c.width}px`, height: `${c.height}px` }], timing);
    content.animate([{ transform: 'translate(0px, -2px)' }, { transform: `translate(${tx}px, ${ty}px) scale(${sc})` }], timing);
    if (!photoFirst) {
      photo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: MORPH.ms * 0.45, delay: MORPH.ms * 0.08, easing: 'ease-in-out', fill: 'forwards' });
      paintWin.animate([{ opacity: 1 }, { opacity: 0 }], { duration: MORPH.ms * 0.45, delay: MORPH.ms * 0.16, easing: 'ease-in-out', fill: 'forwards' });
    }
  });
}

/** His doll's front with his photo in its face window, for the turn (DollScene.turn wears it) */
async function photoFront() {
  const [paint, photo] = await Promise.all([loaded(ME_PAINT.src), loaded(ME_PHOTO.src)]);
  const c = document.createElement('canvas');
  c.width = ME_PAINT.w; c.height = ME_PAINT.h;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  x.drawImage(paint, 0, 0, c.width, c.height);
  const pw = (ME_PAINT.r / ME_PHOTO.r);
  x.save();
  x.beginPath(); x.arc(ME_PAINT.cx, ME_PAINT.cy, ME_PAINT.r, 0, Math.PI * 2); x.clip();
  x.fillStyle = '#eef2f7'; x.fillRect(ME_PAINT.cx - ME_PAINT.r, ME_PAINT.cy - ME_PAINT.r, 2 * ME_PAINT.r, 2 * ME_PAINT.r);
  x.drawImage(photo, ME_PAINT.cx - ME_PHOTO.cx * pw, ME_PAINT.cy - ME_PHOTO.cy * pw, pw, pw);
  x.restore();
  return c;
}

let sceneModule: Promise<typeof import('@/app/components/DollScene')> | null = null;
const loadScene = () => (sceneModule ??= import('@/app/components/DollScene'));
// The set's paintings are fetched at the same moment, so the 3D set isn't kept waiting for them after.
if (typeof window !== 'undefined' && window.location.pathname === '/') {
  loadScene().catch(() => {});
  DOLL_ART.slice(0, SET_SIZE).forEach((a) => { if (a) [a.front, a.back].forEach((src) => { new Image().src = src; }); });
  new Image().src = ME_PHOTO.src;
}

// Where each doll takes you, biggest first (the top nav lists the same, in the same order). The littlest is
// Michael: About, which is also how to reach him.
export const PLACES = [
  { href: '/work', label: 'Projects' },
  { href: '/side-projects', label: 'Play' },
  { href: '/about', label: 'About' },
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
      // Doll r's floor shadow appears as it lands in its own place (its label is the stylesheet's: on
      // hover and focus only, or under it on touch once the set is open)
      slots[r].querySelectorAll('.ds-shadow').forEach((el) => list.push(el.animate([{ opacity: 0 }, { opacity: 1 }], span(t + hop * 0.6, hop * 0.4))));
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
    // (closed, the big doll stands centred on the page: the set itself is shifted by --mid, hp.css)
    const mid = -(parseFloat(getComputedStyle(row).translate) || 0);
    list.push(track.animate([{ transform: `translateX(${track.clientWidth / 2 - xs[0] + mid}px)` }, { transform: 'translateX(0px)' }], { ...span(0, total), easing: EASE_IN_OUT }));
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
  // the page. His doll (About) instead becomes him on the way to the About page: it opens and he rises out
  // of it, or it turns round as him (revealMode, 'turn' by default). New-tab clicks and reduced motion go straight there.
  const visit = (e: MouseEvent<HTMLAnchorElement>, i: number) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const s = scene.current;
    if (PLACES[i].href === '/about' && in3d && s) {
      // (once only: a second click on the way does nothing)
      const html = document.documentElement;
      if (html.classList.contains('me-going')) return;
      html.classList.add('me-going');
      router.prefetch('/about');
      const to = () => router.push('/about');
      if (revealMode() === 'open') {
        s.release(i);
        riseToAbout(s.rimOf(i), to);
      } else {
        photoFront().then((front) => s.turn(i, front)).then(
          () => window.setTimeout(() => windowToAbout(s.faceOf(i), to, true), 120),
          () => windowToAbout(s.faceOf(i), to, false),
        );
      }
      return;
    }
    const slot = e.currentTarget;
    // (his doll turns instead, above; the littlest never opens: it hops, like a solid doll)
    const lid = PLACES[i].href === '/about' || i === SET.length - 1 ? null : slot.querySelector<SVGGElement>('.ds-doll:not(.is-solid) .ds-top');
    lid?.animate([{ transform: 'translate(-40px, -66px) rotate(-18deg)' }], { duration: LEAVE_MS, easing: EASE_OUT, fill: 'forwards' });
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
    if (!canWebGL()) { fail(); return () => window.clearTimeout(late); }
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
      style={SET_STYLE}
      className={`ds${open ? ' is-open' : ''}${moving ? ' is-moving' : ''}${in3d ? ' is-3d' : ''}${flat ? ' is-flat' : ''}`}
    >
      <CrayonDefs />
      <canvas ref={canvasRef} className="ds-3d" aria-hidden="true" />
      <span className="ds-track">
        {SET.map((d, i) => (
          <Link
            key={i}
            href={PLACES[i].href}
            onClick={(e) => visit(e, i)}
            className="ds-slot"
            style={{ '--i': i, '--oh': OFFSETS[i][0], '--og': OFFSETS[i][1], '--rise': ((1 - d.size) * 8) / 260, height: `${d.size * 100}%` } as CSSProperties}
          >
            <span className="ds-shadow" aria-hidden="true" />
            <DollInside i={i} />
            <FlatDoll i={i} prefix="ds" shadow={false} />
            <Crayon seed={i + 1} size={d.size} />
            <span className="ds-cap">{PLACES[i].label}</span>
          </Link>
        ))}
      </span>
    </nav>
  );
}
