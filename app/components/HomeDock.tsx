'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent as RPointerEvent } from 'react';
import DockIcon from '@/app/components/DockIcon';
import GlassRain from '@/app/components/GlassRain';
import type { Weather } from '@/app/components/WeatherLayer';
import { ALL_ITEMS, START, TABS, forgetVisit, rememberVisit, visited, type DockItem } from '@/app/data/dock';
import { TILE_MAP } from '@/app/data/glass';

// The homepage's way round, after Dia's homepage, the Mac dock and Apple's Liquid Glass. In the middle, one
// window, a little browser, shows the current thing (a project's real product, playing; his portrait; his
// résumé). It opens on a Welcome tab: a painting of his studio, whose light follows the page's sky. A dome of liquid glass rises across the window's foot: it bends what's behind its edge, as curved
// glass does (an SVG displacement map on its backdrop, Chromium; frosted only elsewhere). On its rim sit the
// current tab's apps, glass tiles too, each with its name under it; the arrows at the rim's ends change the
// dock's section: Work, Side Projects, About. (The glass bar at the bottom is the site's links, as on every
// page; Search and Mission Control are at the top right, HomeShell.) Pointing at the dock magnifies the icons near the pointer, as the
// Mac dock does; pointing at (or tabbing to) an icon shows it in the window, which lifts a little out of the
// dome while the pointer is near the icons or on the window; its line is under the dock. A click on an icon
// opens it; on touch, the first tap shows it and the second opens it. A click on the window or its green
// button opens it too, the window growing to fill the screen. Pointing only counts after a moment (90 ms),
// so sweeping across the dock doesn't flicker through everything on the way; the new picture fades in over
// the old one, which stays until it's covered. A new section's apps slide in as the old ones slide out.
// The window's tabs are what's been looked at: the thing being pointed at is a passing tab (its name in
// italics) until it has been looked at for a moment (or its tab is clicked); then it stays, up to four, the
// oldest going first. A tab closes with its ×. Like a Mac's, a tab, or an icon pulled up off the dock, can be
// dropped anywhere on the screen, where it becomes a window of its own (up to four); those windows move by
// their title bar, come to the front when touched, close with the red button, and go back in as a tab when
// dropped on the window's tabs. Only the window in front plays its recording. On phones and tablets there
// is just the one window.
// Reduced motion: no magnifying, no autoplay (the windows show the still), no growing. Styles: home.css.
const ease = (a: number, b: number, k: number) => a + (b - a) * k;

// The dome's refraction: only along its visible rim, through a lens just big enough to cover the curve on
// the screen (bending the whole dome, a square thousands of px across, cost most of each frame). The lens is
// W × h. Its map is worked out for the circle itself: within a band inside the rim, each point is pushed
// along the rim's normal, hardest right at the edge (a curve, (1 − depth)²), so what's behind the rim is
// magnified toward it the way the thick edge of a convex glass does; deeper in, the map is neutral grey and
// nothing bends. Drawn once per size on a half-size canvas (the map is smooth, so it scales up cleanly).
const lensMap = (W: number, h: number, R: number, band: number) => {
  const k = 2, w = Math.max(1, Math.round(W / k)), hh = Math.max(1, Math.round(h / k));
  const c = document.createElement('canvas');
  c.width = w; c.height = hh;
  const g = c.getContext('2d');
  if (!g) return '';
  const img = g.createImageData(w, hh), px = img.data;
  const cx = W / 2, cy = R;
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x * k - cx, dy = y * k - cy, dist = Math.hypot(dx, dy) || 1, depth = R - dist;
      let r = 128, gr = 128;
      // (past the rim it keeps the edge's full push, so there's no seam where the lens's circle cuts it off)
      if (depth < band) {
        const m = depth <= 0 ? 1 : (1 - depth / band) ** 2;
        r = 128 + (dx / dist) * m * 127;
        gr = 128 + (dy / dist) * m * 127;
      }
      const i = (y * w + x) * 4;
      px[i] = r; px[i + 1] = gr; px[i + 2] = 128; px[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
};

type Props = { tab: number; onTab: (i: number, dir: number) => void; active: string; onActive: (id: string) => void; dir: number; weather: Weather };
type Float = { key: number; id: string; x: number; y: number; z: number };
type Drag = { mode: 'tab' | 'icon' | 'win'; id: string; key: number; x0: number; y0: number; ox: number; oy: number; x: number; y: number };
const MAX_TABS = 4;
const MAX_FLOATS = 4;
const byId = (id: string) => ALL_ITEMS.find((d) => d.id === id) as DockItem;
const sectionOf = (id: string) => TABS.findIndex((t) => t.items.some((d) => d.id === id));
// (a tab that stays, the oldest one not being looked at going if there are too many)
const keep = (list: string[], id: string) => {
  if (list.includes(id)) return list;
  const n = [...list, id];
  while (n.length > MAX_TABS) n.splice(n.findIndex((x) => x !== id), 1);
  return n;
};
const greenIcon = <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M3.2 6.8V8.8H5.2M8.8 5.2V3.2H6.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const crossIcon = <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M3.8 3.8l4.4 4.4M8.2 3.8l-4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;

// The studio's desk: each object is its own cut-out over the painting of the empty desk (public/home/desk/,
// made from the paintings, in all three lights), placed where it was painted (percent of the painting,
// which .hm-desk lays over the window exactly as the picture is cropped). They're the nearest layer of the
// diorama, shifting most with the pointer. In the main window each is a way in: pointed at, it lifts a
// little off the desk and its name shows.
const DESK: { id: string; x: number; y: number; w: number; h: number; to?: string; label?: string }[] = [
  { id: 'pencils', x: 37.5, y: 51.95, w: 7.62, h: 5.96 },
  { id: 'sketchbook', x: 9.18, y: 47.75, w: 27.73, h: 10.25, to: TABS[0].featured, label: 'Case studies' },
  { id: 'mug', x: 47.4, y: 47.85, w: 7.62, h: 8.79, to: 'contact', label: 'Say hello' },
  { id: 'doll', x: 61.07, y: 40.72, w: 7.42, h: 16.02, to: 'about-me', label: 'About me' },
  { id: 'plant', x: 73.83, y: 39.55, w: 17.77, h: 19.43, to: TABS[1].featured, label: 'Side projects' },
];
function Desk({ onPick }: { onPick?: (to: string) => void }) {
  return (
    <div className="hm-desk">
      {DESK.map((o) => {
        const style = { left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` } as CSSProperties;
        const body = (
          <>
            <span className="hm-obj-shadow" aria-hidden="true" />
            <span className="hm-obj-art" aria-hidden="true">
              <img src={`/home/desk/${o.id}-day.webp`} alt="" decoding="async" draggable={false} />
              <img className="is-golden" src={`/home/desk/${o.id}-golden.webp`} alt="" decoding="async" draggable={false} />
              <img className="is-night" src={`/home/desk/${o.id}-night.webp`} alt="" decoding="async" draggable={false} />
            </span>
            {o.label && onPick && <span className="hm-spot-tip">{o.label}</span>}
          </>
        );
        return o.to && onPick
          ? <button key={o.id} type="button" className={`hm-obj is-${o.id}`} style={style} aria-label={o.label} onClick={(e) => { e.stopPropagation(); onPick(o.to!); }}>{body}</button>
          : <span key={o.id} className={`hm-obj is-${o.id}`} style={style}>{body}</span>;
      })}
    </div>
  );
}

// A tab's or a window's little icon: the app's, or for the Welcome tab his mark
function TabIcon({ id }: { id: string }) {
  return id === START.id ? <img className="di hm-mark-ico" src="/mb-mark.png" alt="" width={129} height={160} draggable={false} /> : <DockIcon id={id} />;
}

// One thing's picture: its recording (a still until it plays), a screenshot, a note, or the studio painting
function Media({ d, on, vid, weather = 'clear', onSpot }: { d: DockItem; on: boolean; vid: (el: HTMLVideoElement | null) => void; weather?: Weather; onSpot?: (to: string) => void }) {
  return (
    <div className={`hm-m is-${d.id}${on ? ' is-on' : ''}${d.media.kind === 'image' && d.media.fit === 'contain' ? ' is-contain' : ''}${d.media.kind === 'note' ? ' is-note' : ''}${d.media.kind === 'scene' ? ' is-scene' : ''}`} aria-hidden={on ? undefined : true}>
      {d.media.kind === 'video' ? (
        <>
          <img src={d.media.poster} alt="" decoding="async" draggable={false} style={{ objectPosition: d.media.position }} />
          <video ref={vid} data-src={d.media.src} muted loop playsInline preload="none" aria-label={d.media.label} style={{ objectPosition: d.media.position }} />
        </>
      ) : d.media.kind === 'image' ? (
        <img src={d.media.src} alt={d.media.alt} decoding="async" draggable={false} style={{ objectPosition: d.media.position }} />
      ) : d.media.kind === 'scene' ? (
        // (three paintings of the one room, the golden-hour and night ones laid over the day one as the
        // page's sky turns: --sg and --sn, set by HomeShell)
        <>
          {/* (a painted diorama in three depths: the sky outside, far and still, being the page itself; the room,
              which shifts a little with the pointer; the desk's objects, nearer, which shift more; and a soft
              light that follows the pointer across it) */}
          {/* (full screen: the page behind is covered, so the panes look out on the sky paintings instead, framed
              on the mountain, in the same light as the page's sky: --o1..--o3, from HomeShell) */}
          <div className="hm-view" aria-hidden="true">
            {d.media.view.map((src, i) => <img key={src} src={src} alt="" decoding="async" draggable={false} style={i ? { opacity: `var(--o${i}, 0)` } : undefined} />)}
          </div>
          <div className="hm-room">
          <img className="hm-sc" src={d.media.day} alt={d.media.alt} decoding="async" draggable={false} />
          <img className="hm-sc is-golden" src={d.media.golden} alt="" decoding="async" draggable={false} />
          <img className="hm-sc is-night" src={d.media.night} alt="" decoding="async" draggable={false} />
          {/* (the panes are cut out of the painting, so the page's own sky shows through them: the real time,
              the real weather, the mountain where it really is behind the window. Over them, cut to the same
              shape: a sheen, and the weather on the glass: rain running down it, frost in its corners, mist
              on it in fog, the lamp's reflection at night) */}
          <span className={`hm-pane is-${weather}`} aria-hidden="true">
            <span className="hm-pane-glass" />
            {on && weather === 'rain' && <GlassRain />}
          </span>
          </div>
          <Desk onPick={on ? onSpot : undefined} />
          <span className="hm-roomlight" aria-hidden="true" />
        </>
      ) : (
        <div className="hm-note">
          <p className="hm-note-title">{d.media.title}</p>
          {d.media.lines.map((l) => <p key={l} className="hm-note-line">{l}</p>)}
        </div>
      )}
    </div>
  );
}

function HomeDock({ tab, onTab, active, onActive, dir, weather }: Props) {
  const stage = useRef<HTMLDivElement | null>(null);
  const dock = useRef<HTMLDivElement | null>(null);
  const icons = useRef<(HTMLElement | null)[]>([]);
  const arrows = useRef<(HTMLElement | null)[]>([]);
  const vids = useRef<Record<string, HTMLVideoElement | null>>({});
  const win = useRef<HTMLElement | null>(null);
  const strip = useRef<HTMLDivElement | null>(null);
  const tabBtns = useRef<(HTMLButtonElement | null)[]>([]);
  const floatEls = useRef<Record<number, HTMLElement | null>>({});
  const activeRef = useRef(active);
  activeRef.current = active;
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const T = TABS[tab];
  const items = T.items;
  const item = byId(active);
  // (the media of everything shown so far stays in the window, so going back to one is instant; a section's
  // stills load as soon as the pointer comes to the dock or the section opens, so pointing never waits)
  const [seen, setSeen] = useState<string[]>([active]);
  const preload = useCallback((ids: string[]) => setSeen((s) => (ids.every((id) => s.includes(id)) ? s : [...s, ...ids.filter((id) => !s.includes(id))])), []);
  useEffect(() => { preload([active]); }, [active, preload]);
  // (and the opening section's stills once the page has settled, decoded off the main thread, so the first
  // pass along the dock doesn't stall while they're read)
  useEffect(() => {
    const ids = TABS[0].items.map((d) => d.id);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    if (w.requestIdleCallback) { const h = w.requestIdleCallback(() => preload(ids), { timeout: 2500 }); return () => w.cancelIdleCallback?.(h); }
    const t = window.setTimeout(() => preload(ids), 1500);
    return () => window.clearTimeout(t);
  }, [preload]);
  // (pointing at the dock or the window lifts the window a little further out of the dome)
  const [peek, setPeek] = useState(false);
  const peekT = useRef(0);
  const peekOn = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; window.clearTimeout(peekT.current); setPeek(true); };
  // (it settles back only after a moment, so crossing between the window and the dock doesn't bob it)
  const peekOff = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; window.clearTimeout(peekT.current); peekT.current = window.setTimeout(() => setPeek(false), 260); };

  // ---------- the window's tabs: the ones that stay, and the passing one being looked at ----------
  const [kept, setKept] = useState<string[]>([active]);
  const passing = kept.includes(active) ? null : active;
  const tabIds = passing ? [...kept, passing] : kept;
  // (the passing tab is one slot whose contents change as the pointer moves, so it doesn't flicker in and
  // out. Pointing never keeps a tab: a tab stays only for a project this visitor has opened this session,
  // a tab they clicked, or a window dropped back in)
  const settled = useRef(new Set<string>());
  useEffect(() => {
    const v = visited();
    if (!v.length) return;
    v.forEach((id) => settled.current.add(id));
    setKept((k) => v.reduce((acc, id) => keep(acc, id), k));
  }, []);

  // ---------- which window is in front (0 the big one, else a window of its own); only it plays ----------
  const [floats, setFloats] = useState<Float[]>([]);
  const floatsRef = useRef(floats);
  floatsRef.current = floats;
  const [front, setFront] = useState(0);
  const zTop = useRef(10);
  const nextKey = useRef(1);
  const motionOK = useRef(true);
  // (showing something: in the big window, brought to the front; from another section, the dock follows)
  const show = useCallback((id: string, toFront = true) => {
    const s = sectionOf(id);
    if (s >= 0 && s !== tabRef.current) onTab(s, s > tabRef.current ? 1 : -1);
    onActive(id);
    if (toFront) setFront(0);
  }, [onTab, onActive]);
  const pick = (id: string) => { setFront(0); onActive(id); };

  // ---------- closing the window: it sinks down behind the dome, and the glass ripples as it goes through;
  // a click on an app brings it back up out of the dome, with that app. 'back' (not 'open') once it has
  // come back, so its rise doesn't replay later ----------
  const [winState, setWinState] = useState<'open' | 'closed' | 'back'>('open');
  const closed = winState === 'closed';
  const closedRef = useRef(closed);
  closedRef.current = closed;
  const disp = useRef<SVGFEDisplacementMapElement | null>(null);
  const splashEl = useRef<HTMLSpanElement | null>(null);
  const splash = useCallback(() => {
    if (!motionOK.current) return;
    // (the rim's bending swings and settles, a damped wave over 1.2 s, and a ring of light runs out from
    // the middle of the rim)
    const el = disp.current, t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000, k = Math.exp(-t * 3.6) * Math.cos(t * Math.PI * 2 * 2.4);
      el?.setAttribute('scale', String(Math.round(-46 - 70 * k)));
      if (t < 1.25) requestAnimationFrame(tick); else el?.setAttribute("scale", "-46");
    };
    requestAnimationFrame(tick);
    const r = splashEl.current;
    if (r) { r.classList.remove('is-on'); void r.offsetWidth; r.classList.add('is-on'); }
  }, []);

  // ---------- moving the window by its title bar (mouse, wide screens): the view through the studio's
  // panes is the page behind them, so moving the window moves the mountain in it. A double-click on the
  // title bar sends it home ----------
  const off = useRef({ x: 0, y: 0 });
  const [moved, setMoved] = useState(false);
  const place = () => { const el = win.current; if (!el) return; el.style.setProperty('--wx', `${off.current.x}px`); el.style.setProperty('--wy', `${off.current.y}px`); };
  const goHome = () => { off.current = { x: 0, y: 0 }; place(); setMoved(false); };
  const onChromeDown = (e: RPointerEvent) => {
    if (full) return;
    if (e.button !== 0 || e.pointerType === 'touch' || window.matchMedia('(max-width: 899px)').matches) return;
    if ((e.target as HTMLElement).closest('button, a, .hm-ctab')) return;
    const el = win.current;
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY, o = { ...off.current };
    const left0 = r.left - o.x, top0 = r.top - o.y;
    el.classList.add('is-moving');
    document.documentElement.classList.add('hm-moving');
    const move = (ev: PointerEvent) => {
      off.current = {
        x: Math.min(Math.max(o.x + ev.clientX - x0, 120 - left0 - r.width), window.innerWidth - 120 - left0),
        y: Math.min(Math.max(o.y + ev.clientY - y0, 8 - top0), window.innerHeight - 60 - top0),
      };
      place();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.classList.remove('is-moving');
      document.documentElement.classList.remove('hm-moving');
      setMoved(Math.abs(off.current.x) + Math.abs(off.current.y) > 2);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // (the picture leans with the pointer, and the studio's layers shift by their depths: its position over
  // the window, -1 to 1 each way, as two variables; at most once a frame, and back to the middle on leaving)
  const leanRaf = useRef(0);
  const lean = (e: React.PointerEvent, out = false) => {
    if (e.pointerType !== 'mouse' || !motionOK.current) return;
    const el = win.current;
    if (!el) return;
    const r = el.getBoundingClientRect(), px = out ? 0 : ((e.clientX - r.left) / r.width) * 2 - 1, py = out ? 0 : ((e.clientY - r.top) / r.height) * 2 - 1;
    cancelAnimationFrame(leanRaf.current);
    leanRaf.current = requestAnimationFrame(() => { el.style.setProperty('--px', px.toFixed(3)); el.style.setProperty('--py', py.toFixed(3)); });
  };

  // ---------- full screen: the Welcome window's green button, as a Mac's: the window grows from where it is to
  // fill the screen (a FLIP over 520 ms), showing the whole room; green again, or Escape, brings it back ----------
  const [full, setFull] = useState(false);
  const flipFrom = useRef<DOMRect | null>(null);
  const toggleFull = () => { flipFrom.current = win.current?.getBoundingClientRect() ?? null; setFull((f) => !f); setPeek(false); };
  useLayoutEffect(() => {
    const el = win.current, a = flipFrom.current;
    flipFrom.current = null;
    if (!el || !a || !motionOK.current) return;
    const b = el.getBoundingClientRect();
    el.animate([
      { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, transformOrigin: '0 0' },
      { transform: 'none', transformOrigin: '0 0' },
    ], { duration: 520, easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)' });
  }, [full]);
  useEffect(() => {
    if (!full) return;
    const k = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') toggleFull(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  // (leaving the Welcome tab leaves full screen)
  useEffect(() => { if (active !== START.id && full) setFull(false); }, [active, full]);

  const closeWin = () => {
    window.clearTimeout(peekT.current);
    setPeek(false);
    setWinState('closed');
    // (as a browser's: closing the window closes its tabs, so they don't come back next time)
    forgetVisit();
    window.setTimeout(splash, 240);
    // (the button that had focus has gone with the window: focus goes to the dock's first app)
    requestAnimationFrame(() => icons.current[0]?.querySelector<HTMLElement>('a, button')?.focus());
  };
  // (pointing counts after 90 ms on the icon; moving on before then cancels it)
  const hoverT = useRef(0);
  const pointAt = (id: string) => { if (closedRef.current) return; window.clearTimeout(hoverT.current); hoverT.current = window.setTimeout(() => pick(id), motionOK.current ? 90 : 0); };
  const pointOff = () => window.clearTimeout(hoverT.current);
  useEffect(() => () => window.clearTimeout(hoverT.current), []);

  // ---------- opening: for a page of this site the window first grows to fill the screen; elsewhere it
  // opens in a new tab ----------
  const router = useRouter();
  const [zoom, setZoom] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const open = (d: DockItem, el: Element | null) => {
    if (!d.href) return;
    rememberVisit(d.id);
    if (d.external) { window.open(d.href, '_blank', 'noopener'); return; }
    const r = el?.getBoundingClientRect();
    if (!r || !motionOK.current) { router.push(d.href); return; }
    router.prefetch(d.href);
    setZoom({ x: r.left, y: r.top, w: r.width, h: r.height });
    window.setTimeout(() => router.push(d.href!), 430);
  };
  // (a drag that ends over the window isn't a click on it)
  const dragged = useRef(false);
  const onWinClick = (e: MouseEvent) => {
    if (dragged.current) { dragged.current = false; return; }
    if ((e.target as HTMLElement).closest('a, button, .hm-chrome')) return;
    open(item, win.current);
  };

  const [dome, setDome] = useState<{ S: number; R: number; W: number; h: number; href: string; tile: number }>({ S: 0, R: 0, W: 0, h: 0, href: '', tile: 76 });
  const geo = useRef<{ x: number; y: number; rot: number }[]>([]);
  const scale = useRef<number[]>([]);
  const target = useRef<number[]>([]);
  const raf = useRef(0);

  // ---------- the arc: where each icon and the two arrows sit on the rim ----------
  const layout = useCallback(() => {
    const d = dock.current;
    if (!d) return;
    const W = d.clientWidth;
    const size = icons.current[0]?.offsetWidth || 76;
    const narrow = W < 900;
    const R = narrow ? W * 1.3 : Math.max(W * 0.95, 900);
    const L = narrow ? Math.min((W - 110) / (items.length + 0.4), size * 1.32) : size * 1.42;
    const cx = W / 2, cy = R, mid = (items.length - 1) / 2;
    const at = (k: number) => { const th = ((k - mid) * L) / R; return { x: cx + R * Math.sin(th), y: cy - R * Math.cos(th), rot: th }; };
    geo.current = items.map((_, i) => at(i));
    const place = (el: HTMLElement | null, g: { x: number; y: number; rot: number }) => {
      if (!el) return;
      el.style.left = `${g.x}px`; el.style.top = `${g.y}px`; el.style.setProperty('--rot', `${g.rot}rad`);
    };
    geo.current.forEach((g, i) => place(icons.current[i], g));
    place(arrows.current[0], at(-0.95 - (narrow ? 0.05 : 0.15)));
    place(arrows.current[1], at(items.length - 1 + 0.95 + (narrow ? 0.05 : 0.15)));
    d.style.setProperty('--R', `${R}px`);
    const S = Math.round(2 * R);
    // (a thick edge: the band that bends is over half an icon deep)
    const band = Math.max(34, size * 0.58);
    const h = Math.round(R - Math.sqrt(Math.max(0, R * R - (W / 2) * (W / 2))) + band + 12);
    setDome((o) => (o.S === S && o.W === W && o.tile === size ? o : { S, R, W, h, href: lensMap(W, h, R, band), tile: size }));
  }, [items]);

  useEffect(() => {
    motionOK.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scale.current = items.map(() => 1); target.current = items.map(() => 1);
    layout();
    const ro = new ResizeObserver(layout);
    if (dock.current) ro.observe(dock.current);
    document.fonts?.ready.then(layout);
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [layout, items]);

  // ---------- the Mac dock's magnifying ----------
  const tick = () => {
    let moving = false;
    items.forEach((_, i) => {
      const s = ease(scale.current[i] ?? 1, target.current[i] ?? 1, 0.22);
      if (Math.abs(s - (target.current[i] ?? 1)) > 0.002) moving = true;
      scale.current[i] = s;
      const el = icons.current[i];
      if (el) { el.style.setProperty('--s', s.toFixed(3)); el.style.setProperty('--lift', `${((s - 1) * 26).toFixed(1)}px`); }
    });
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };
  const onLeave = () => { target.current = items.map(() => 1); kick(); };
  // (only near the icons: below them, on the way to the bar at the bottom, nothing grows and the window
  // doesn't lift; the magnifying fades with the distance from the row, up and down as well as across)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !dock.current) return;
    const r = dock.current.getBoundingClientRect(), size = icons.current[0]?.offsetWidth || 76;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let near = Infinity;
    geo.current.forEach((g, i) => {
      const dx = (x - g.x) / (size * 1.3), dy = Math.max(0, Math.abs(y - g.y) - size * 0.5) / (size * 0.6);
      near = Math.min(near, Math.abs(y - g.y));
      target.current[i] = motionOK.current ? 1 + 0.4 * Math.exp(-dx * dx - dy * dy) : 1;
    });
    if (near < size * 0.9) peekOn(e); else peekOff(e);
    kick();
  };

  // ---------- playing: only the window in front plays its recording (if motion is welcome) ----------
  const frontFloat = floats.find((f) => f.key === front);
  const playing = frontFloat ? `f${frontFloat.key}:${frontFloat.id}` : closed ? '' : `main:${active}`;
  useEffect(() => {
    Object.entries(vids.current).forEach(([k, v]) => {
      if (!v) return;
      if (k === playing && motionOK.current) {
        if (!v.getAttribute('src')) { v.src = v.dataset.src!; v.load(); }
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [playing, seen, floats.length]);

  // ---------- dragging: a tab out of the title bar, or an icon up off the dock (either becomes a window
  // where it's dropped), or a window by its title bar (dropped on the big window's tabs, it goes back in as
  // a tab). The window follows the pointer directly (no re-render per move); its place is saved when it's
  // let go. Mouse only, on screens wide enough for windows side by side. ----------
  const drag = useRef<Drag | null>(null);
  const live = useRef({ active, kept, tabIds, show });
  live.current = { active, kept, tabIds, show };
  const overStrip = (x: number, y: number) => {
    const r = strip.current?.getBoundingClientRect();
    return !!r && x >= r.left - 16 && x <= r.right + 16 && y >= r.top - 20 && y <= r.bottom + 20;
  };
  const toFront = useCallback((key: number) => {
    zTop.current += 1;
    const z = zTop.current;
    setFloats((fs) => fs.map((f) => (f.key === key ? { ...f, z } : f)));
    setFront(key);
  }, []);
  const onDragMove = useCallback((e: PointerEvent) => {
    const d = drag.current, st = stage.current;
    if (!d || !st) return;
    const sr = st.getBoundingClientRect();
    if (!d.key) {
      // (a tab becomes a window once pulled about 48 px from where it was, any way, sideways too; an icon
      // once lifted well up off the dock)
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
      if (d.mode === 'tab' ? Math.hypot(dx, dy) < 48 : dy > -34) return;
      dragged.current = true;
      document.documentElement.classList.add('hm-moving');
      d.ox = 110; d.oy = 18;
      d.x = e.clientX - sr.left - d.ox; d.y = e.clientY - sr.top - d.oy;
      // (already out in a window of its own: that window comes to the pointer instead)
      const had = floatsRef.current.find((f) => f.id === d.id);
      if (had) { d.key = had.key; toFront(had.key); }
      else {
        if (floatsRef.current.length >= MAX_FLOATS) { drag.current = null; return; }
        const key = nextKey.current++;
        zTop.current += 1;
        d.key = key;
        setFloats((fs) => [...fs, { key, id: d.id, x: d.x, y: d.y, z: zTop.current }]);
        setFront(key);
      }
      // (it leaves the tabs, if other tabs are left; if it was the one shown, the big window moves on to
      // the tab next to it)
      const { active: a, kept: k, tabIds: ids, show: to } = live.current;
      const rest = ids.filter((x) => x !== d.id);
      if (rest.length && ids.includes(d.id)) {
        setKept(k.filter((x) => x !== d.id));
        if (d.id === a) to(rest[Math.min(ids.indexOf(d.id), rest.length - 1)], false);
      }
    }
    // (kept on the screen: the title bar always stays reachable)
    const el = floatEls.current[d.key];
    const w = el?.offsetWidth ?? 360;
    d.x = Math.min(Math.max(e.clientX - sr.left - d.ox, -sr.left - w + 120), window.innerWidth - sr.left - 120);
    d.y = Math.min(Math.max(e.clientY - sr.top - d.oy, -sr.top + 8), window.innerHeight - sr.top - 44);
    if (el) el.style.transform = `translate(${d.x}px, ${d.y}px)`;
    strip.current?.classList.toggle('is-drop', overStrip(e.clientX, e.clientY));
  }, [toFront]);
  const onDragEnd = useCallback((e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragEnd);
    document.documentElement.classList.remove('hm-moving');
    strip.current?.classList.remove('is-drop');
    if (!d?.key) return;
    // (the click that follows a drag isn't one; wherever it lands, it's let through again after it)
    window.setTimeout(() => { dragged.current = false; }, 0);
    // (dropped on the big window's tabs: back in as a tab, and shown)
    if (overStrip(e.clientX, e.clientY)) {
      setFloats((fs) => fs.filter((f) => f.key !== d.key));
      setKept((k) => keep(k, d.id));
      live.current.show(d.id);
      return;
    }
    // (not parked over the dock: a window let go over it rises until its foot clears the icons)
    const dk = dock.current?.getBoundingClientRect(), st = stage.current?.getBoundingClientRect(), el = floatEls.current[d.key];
    if (dk && st && el) {
      const clear = dk.top - (icons.current[0]?.offsetHeight ?? 76) * 0.75 - st.top - el.offsetHeight;
      if (d.y > clear) { d.y = Math.max(clear, 8 - st.top); el.style.transition = 'transform 320ms cubic-bezier(0.2, 0.9, 0.3, 1)'; el.style.transform = `translate(${d.x}px, ${d.y}px)`; window.setTimeout(() => { el.style.transition = ''; }, 340); }
    }
    setFloats((fs) => fs.map((f) => (f.key === d.key ? { ...f, x: d.x, y: d.y } : f)));
  }, [onDragMove]);
  // (when the screen gets smaller, a window of its own is brought back so its title bar is on it)
  useEffect(() => {
    const fit = () => {
      const st = stage.current?.getBoundingClientRect();
      if (!st) return;
      setFloats((fs) => fs.map((f) => {
        const w = floatEls.current[f.key]?.offsetWidth ?? 360;
        const x = Math.min(Math.max(f.x, -st.left - w + 120), window.innerWidth - st.left - 120), y = Math.min(Math.max(f.y, -st.top + 8), window.innerHeight - st.top - 44);
        return x === f.x && y === f.y ? f : { ...f, x, y };
      }));
    };
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  const startDrag = (e: RPointerEvent, mode: Drag['mode'], id: string, key = 0) => {
    dragged.current = false;
    if (e.button !== 0 || e.pointerType === 'touch' || window.matchMedia('(max-width: 899px)').matches) return;
    const f = floatsRef.current.find((x) => x.key === key);
    const sr = stage.current?.getBoundingClientRect();
    drag.current = { mode, id, key, x0: e.clientX, y0: e.clientY, ox: f && sr ? e.clientX - sr.left - f.x : 0, oy: f && sr ? e.clientY - sr.top - f.y : 0, x: f?.x ?? 0, y: f?.y ?? 0 };
    if (mode === 'win') { e.preventDefault(); toFront(key); document.documentElement.classList.add('hm-moving'); }
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragEnd);
  };
  useEffect(() => () => {
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('pointercancel', onDragEnd);
    document.documentElement.classList.remove('hm-moving');
  }, [onDragMove, onDragEnd]);
  const closeFloat = (key: number) => { const f = floatsRef.current.find((x) => x.key === key); if (f) forgetVisit(f.id); setFloats((fs) => fs.filter((x) => x.key !== key)); setFront(0); };

  // ---------- the tabs: a click shows one (and keeps a passing one); × closes; arrow keys move along ----------
  const onTabClick = (id: string) => {
    if (dragged.current) { dragged.current = false; return; }
    setKept((k) => keep(k, id));
    show(id);
  };
  const closeTab = (id: string) => {
    const i = tabIds.indexOf(id), rest = tabIds.filter((x) => x !== id);
    if (!rest.length) return;
    setKept((k) => k.filter((x) => x !== id));
    forgetVisit(id);
    if (id === active) {
      const next = rest[Math.min(i, rest.length - 1)];
      show(next);
      requestAnimationFrame(() => tabBtns.current[tabIds.filter((x) => x !== id).indexOf(next)]?.focus());
    }
  };
  const onTabKey = (e: KeyboardEvent) => {
    const i = tabIds.indexOf(active), n = tabIds.length;
    const to = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    show(tabIds[to]);
    tabBtns.current[to]?.focus();
  };

  // ---------- choosing on the dock ----------
  // (with a mouse, pointing shows it in the window; a click or a tap opens it)
  const down = useRef<{ id: string; touch: boolean; was: boolean } | null>(null);
  const onIconDown = (e: RPointerEvent, d: DockItem) => {
    down.current = { id: d.id, touch: e.pointerType !== 'mouse', was: d.id === activeRef.current };
    startDrag(e, 'icon', d.id);
  };
  // (the window closed: a click on an app brings it back with that app, instead of leaving the page)
  const reopen = (id: string) => {
    off.current = { x: 0, y: 0 }; place(); setMoved(false);
    settled.current.add(id);
    setKept(id === START.id ? [id] : [START.id, id]);
    pick(id);
    setWinState('back');
    splash();
  };
  const onIconClick = (e: MouseEvent, d: DockItem) => {
    if (dragged.current) { e.preventDefault(); dragged.current = false; return; }
    if (closedRef.current) { e.preventDefault(); down.current = null; reopen(d.id); return; }
    down.current = null;
    // (one click or tap opens it, on a phone too: each app's name is under it, so there's no need to look
    // first)
    if (d.href) rememberVisit(d.id);
  };
  const go = (step: number) => onTab((tab + step + TABS.length) % TABS.length, step);
  const prev = TABS[(tab - 1 + TABS.length) % TABS.length], next = TABS[(tab + 1) % TABS.length];
  // (focus follows a tab change made from the keyboard: onto the new tab's first or last icon)
  const focusNext = useRef<'first' | 'last' | null>(null);
  useEffect(() => {
    if (!focusNext.current) return;
    const el = (focusNext.current === 'first' ? icons.current[0] : icons.current[items.length - 1])?.querySelector<HTMLElement>('a, button');
    focusNext.current = null;
    el?.focus();
  }, [tab, items.length]);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = icons.current.findIndex((el) => el && el.contains(document.activeElement));
    if (i < 0) return;
    e.preventDefault();
    const step = e.key === 'ArrowRight' ? 1 : -1;
    const j = i + step;
    if (j < 0 || j >= items.length) { focusNext.current = step > 0 ? 'first' : 'last'; go(step); return; }
    icons.current[j]?.querySelector<HTMLElement>('a, button')?.focus();
  };

  // ---------- changing section: the old apps slide out toward where the arrow points away from (180 ms),
  // as the new ones slide in from the other side; their stills load at once ----------
  const prevSec = useRef({ id: T.id, items });
  const [leaving, setLeaving] = useState<{ key: string; to: number; icons: { id: string; x: number; y: number; rot: number }[] } | null>(null);
  useLayoutEffect(() => {
    const was = prevSec.current;
    if (was.id === T.id) return;
    // (geo still holds the old row here: the new one is laid out in an effect, after this)
    const g = geo.current;
    if (motionOK.current) setLeaving({ key: was.id, to: dir >= 0 ? -1 : 1, icons: was.items.map((d, i) => ({ id: d.id, ...(g[i] ?? { x: 0, y: 0, rot: 0 }) })) });
    prevSec.current = { id: T.id, items };
    preload(items.map((d) => d.id));
    const t = window.setTimeout(() => setLeaving(null), 200);
    return () => window.clearTimeout(t);
  }, [T.id, items, dir, preload]);


  return (
    <div className={`hm-stage${peek ? ' is-peek' : ''}`} ref={stage}>
      {/* the refraction filters: the dome's (its size changes with the screen) and the tiles' */}
      <svg className="hm-defs" aria-hidden="true" focusable="false">
        <filter id="hm-glass-dome" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          {dome.href && <feImage href={dome.href} x="0" y="0" width={dome.W} height={dome.h} preserveAspectRatio="none" result="map" />}
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="map" scale="-46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="hm-glass-tile" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feImage href={TILE_MAP} x="0" y="0" width={dome.tile} height={dome.tile} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="-18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* the window: the current thing, its tabs, the way in */}
      <section
        className={`hm-win${item.href ? ' is-open-able' : ''}${front === 0 ? ' is-front' : ''}${item.id === START.id ? ' is-start' : ''}${closed ? ' is-closed' : winState === 'back' ? ' is-back' : ''}${moved ? ' is-moved' : ''}${full ? ' is-full' : ''}`}
        ref={win}
        aria-label={`Preview: ${item.name}`}
        aria-hidden={closed || undefined}
        onPointerEnter={(e) => { if (!moved && !full) peekOn(e); }}
        onPointerLeave={(e) => { peekOff(e); lean(e, true); }}
        onPointerMove={(e) => lean(e)}
        onPointerDown={() => { if (front !== 0) setFront(0); }}
        onClick={onWinClick}
      >
        <div className="hm-chrome" onPointerDown={onChromeDown} onDoubleClick={(e) => { if (!(e.target as HTMLElement).closest('button, a')) goHome(); }} title={moved ? 'Double-click to put the window back' : undefined}>
          <span className="hm-dots">
            <button type="button" className="hm-red" onClick={closeWin} aria-label="Close the window" tabIndex={closed ? -1 : undefined}>{crossIcon}</button>
            <i aria-hidden="true" />
            <button type="button" className="hm-green" onClick={() => (item.id === START.id ? toggleFull() : open(item, win.current))} disabled={!item.href && item.id !== START.id} aria-label={item.id === START.id ? (full ? 'Exit full screen' : 'Enter full screen') : item.href ? `Open ${item.name}${item.external ? ' (opens in a new tab)' : ''}` : `${item.name}: coming soon`} aria-pressed={item.id === START.id ? full : undefined}>
              {greenIcon}
            </button>
          </span>
          <div ref={strip} className="hm-ctabs" role="tablist" aria-label="Open tabs" onKeyDown={onTabKey}>
            {tabIds.map((id, i) => {
              const d = byId(id);
              return (
                <div key={id === passing ? 'passing' : id} className={`hm-ctab is-${id}${id === active ? ' is-on' : ''}${id === passing ? ' is-passing' : ''}${settled.current.has(id) && id !== passing ? ' is-settled' : ''}`} onPointerDown={(e) => { if (!(e.target as HTMLElement).closest('.hm-ctab-x')) startDrag(e, 'tab', id); }} title={tabIds.length > 1 ? 'Drag out onto the page to open it in a window of its own' : undefined}>
                  <button
                    ref={(el) => { tabBtns.current[i] = el; }}
                    type="button"
                    role="tab"
                    className="hm-ctab-main"
                    aria-selected={id === active}
                    aria-controls="hm-media"
                    tabIndex={id === active ? 0 : -1}
                    onClick={() => onTabClick(id)}
                  >
                    <TabIcon id={id} />
                    <span className="hm-ctab-name">{d.label ?? d.name}</span>
                  </button>
                  {tabIds.length > 1 && (
                    <button type="button" className="hm-ctab-x" onClick={() => closeTab(id)} aria-label={`Close ${d.name}'s tab`} tabIndex={id === active ? 0 : -1}>{crossIcon}</button>
                  )}
                </div>
              );
            })}
          </div>
          {item.meta && <span className="hm-meta" key={`m-${item.id}`}>{item.meta}</span>}
        </div>
        <div className="hm-media" id="hm-media">
          {ALL_ITEMS.filter((d) => seen.includes(d.id)).map((d) => (
            <Media key={d.id} d={d} on={d.id === active} weather={closed ? 'clear' : weather} onSpot={(to) => show(to)} vid={(el) => { vids.current[`main:${d.id}`] = el; }} />
          ))}
        </div>
      </section>

      {/* tabs and icons pulled out onto the page, each a window of its own */}
      {floats.map((f) => {
        const d = byId(f.id);
        return (
          <section
            key={f.key}
            ref={(el) => { floatEls.current[f.key] = el; }}
            className={`hm-float${f.key === front ? ' is-front' : ''}`}
            style={{ transform: `translate(${f.x}px, ${f.y}px)`, zIndex: f.z } as CSSProperties}
            aria-label={`${d.name}, in its own window`}
            onPointerDown={() => { if (f.key !== front) toFront(f.key); }}
          >
            <div className="hm-chrome hm-fchrome" onPointerDown={(e) => { if (!(e.target as HTMLElement).closest('button')) startDrag(e, 'win', f.id, f.key); }}>
              <span className="hm-dots">
                <button type="button" className="hm-red" onClick={() => closeFloat(f.key)} aria-label={`Close ${d.name}'s window`}>{crossIcon}</button>
                <i aria-hidden="true" />
                <button type="button" className="hm-green" onClick={(e) => open(d, e.currentTarget.closest('.hm-float'))} disabled={!d.href} aria-label={d.href ? `Open ${d.name}${d.external ? ' (opens in a new tab)' : ''}` : `${d.name}: coming soon`}>
                  {greenIcon}
                </button>
              </span>
              <span className="hm-ftitle"><TabIcon id={d.id} /><span>{d.label ?? d.name}</span></span>
            </div>
            <div className={`hm-media${d.href ? ' is-open-able' : ''}`} onClick={(e) => open(d, e.currentTarget.closest('.hm-float'))}>
              <Media d={d} on weather={weather} vid={(el) => { vids.current[`f${f.key}:${d.id}`] = el; }} />
            </div>
          </section>
        );
      })}
      {zoom && <span className="hm-zoom" aria-hidden="true" style={{ left: zoom.x, top: zoom.y, width: zoom.w, height: zoom.h } as CSSProperties} />}

      {/* the dome of glass, its apps on the rim, the arrows at the ends, the line under them */}
      <div className="hm-dock" ref={dock} onPointerEnter={() => preload(items.map((d) => d.id))} onPointerMove={onMove} onPointerLeave={(e) => { onLeave(); pointOff(); peekOff(e); }}>
        <div className="hm-dome" aria-hidden="true" style={{ width: dome.S || undefined }}>
          <span className="hm-dome-refract" />
          <span className="hm-dome-tint" />
          <span className="hm-dome-rim" />
          <span ref={splashEl} className="hm-splash" />
        </div>
        {/* the bending, only along the rim on screen: a lens cut to the dome's circle */}
        {dome.href && <span className="hm-lens" aria-hidden="true" style={{ width: dome.W, height: dome.h, clipPath: `circle(${dome.R}px at 50% ${dome.R}px)` }} />}
        {/* the arrows at the rim's ends change the dock's section: Work, Side Projects, About */}
        <button type="button" ref={(el) => { arrows.current[0] = el; }} className="hm-arrow is-prev" onClick={() => go(-1)} aria-label={`Previous: ${prev.label}`}>
          <span className="hm-glass" aria-hidden="true" />
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14.5 6 L8.5 12 L14.5 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="hm-tip" aria-hidden="true">{prev.label}</span>
        </button>
        <button type="button" ref={(el) => { arrows.current[1] = el; }} className="hm-arrow is-next" onClick={() => go(1)} aria-label={`Next: ${next.label}`}>
          <span className="hm-glass" aria-hidden="true" />
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9.5 6 L15.5 12 L9.5 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="hm-tip" aria-hidden="true">{next.label}</span>
        </button>
        <nav aria-label={T.label} onKeyDown={onKey}>
          <ul className={`hm-icons ${dir < 0 ? 'from-left' : dir > 0 ? 'from-right' : ''}`} key={T.id} style={{ '--n': items.length } as CSSProperties}>
            {items.map((d, i) => {
              const body = (
                <>
                  <span className={`hm-tile is-${d.id}`}>
                    <span className="hm-glass" aria-hidden="true" />
                    <DockIcon id={d.id} />
                  </span>
                  <span className="hm-label" aria-hidden="true">{d.label ?? d.name}</span>
                  <span className="sr-only">{d.name}: {d.line}{d.external ? ' (opens in a new tab)' : ''}</span>
                </>
              );
              const props = { className: 'hm-hit', draggable: false, onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse' && !drag.current?.key) pointAt(d.id); }, onPointerLeave: pointOff, onPointerDown: (e: React.PointerEvent) => onIconDown(e, d), onFocus: () => { if (!closedRef.current) pick(d.id); } };
              return (
                <li key={d.id} ref={(el) => { icons.current[i] = el; }} className={`hm-icon${d.id === active ? ' is-active' : ''}`} style={{ '--s': 1, '--lift': '0px', '--i': i } as CSSProperties}>
                  {!d.href ? <button type="button" {...props}>{body}</button>
                    : d.external ? <a href={d.href} target="_blank" rel="noopener noreferrer" {...props} onClick={(e) => onIconClick(e, d)}>{body}</a>
                    : <Link href={d.href} {...props} onClick={(e) => onIconClick(e, d)}>{body}</Link>}
                </li>
              );
            })}
          </ul>
        </nav>
        {/* (the dock says nothing more while the window is up: the apps' names are under them, the pages in the
            menu bar. Only once the window's been closed, a line on how to bring it back) */}
        {closed && (
          <div className="hm-go">
            <p className="hm-go-line">Pick an app to open the window again, or <button type="button" className="hm-reopen" onClick={() => reopen(START.id)}>open Welcome</button>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// (the page re-renders on every move of a drag across the sky; the dock only when its own props change)
export default memo(HomeDock);
