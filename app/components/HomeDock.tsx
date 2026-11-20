'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import DockIcon from '@/app/components/DockIcon';
import { ALL_ITEMS, TABS, type DockItem } from '@/app/data/dock';
import { TILE_MAP } from '@/app/data/glass';

// The homepage's way round, after Dia's homepage, the Mac dock and Apple's Liquid Glass. In the middle, one
// window shows the current thing (a project's real product, playing; his portrait; his résumé). A dome of
// liquid glass rises across the window's foot: it bends what's behind its edge, as curved glass does (an SVG
// displacement map on its backdrop, Chromium; frosted only elsewhere). On its rim sit the current tab's
// apps, glass tiles too; the arrows at the rim's ends (and the words in the bar, HomeShell) switch tabs:
// Work, Side Projects, About. Pointing at the dock magnifies the icons near the pointer, as the Mac dock
// does; pointing at (or tabbing to) an icon shows it in the window (a crossfade), which lifts a little out of
// the dome while the pointer is near the icons or on the window; its line is under the dock. A click on an icon opens it; on touch, the first tap
// shows it and the second opens it. A click on the window, or on its green button as on a Mac, opens it
// too, the window growing to fill the screen on the way. Arrow keys move along the dock, and past its ends
// to the next tab.
// Reduced motion: no magnifying, no autoplay (the window shows the still). Styles: home.css.
const ease = (a: number, b: number, k: number) => a + (b - a) * k;

// The dome's refraction: only along its visible rim, through a lens just big enough to cover the curve on
// the screen (bending the whole dome, a square thousands of px across, cost most of each frame). The lens is
// W × h; its map shifts what's behind sideways and up/down (its two gradients), held at neutral grey inside
// the circle, so only a band along the rim bends, the way a thick glass edge does.
const lensMap = (W: number, h: number, R: number, band: number) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${h}'><defs><linearGradient id='x' x1='0' x2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient><linearGradient id='y' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient><filter id='b' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='${band * 0.42}'/></filter></defs><rect width='${W}' height='${h}' fill='url(#x)'/><rect width='${W}' height='${h}' fill='url(#y)' style='mix-blend-mode:screen'/><circle cx='${W / 2}' cy='${R}' r='${R - band}' fill='#808080' filter='url(#b)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

type Props = { tab: number; onTab: (i: number, dir: number) => void; active: string; onActive: (id: string) => void; dir: number };

function HomeDock({ tab, onTab, active, onActive, dir }: Props) {
  const dock = useRef<HTMLDivElement | null>(null);
  const icons = useRef<(HTMLElement | null)[]>([]);
  const arrows = useRef<(HTMLElement | null)[]>([]);
  const vids = useRef<Record<string, HTMLVideoElement | null>>({});
  const win = useRef<HTMLElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const T = TABS[tab];
  const items = T.items;
  const item = ALL_ITEMS.find((d) => d.id === active) as DockItem;
  // (the media of everything shown so far stays in the window, so going back to one is instant)
  const [seen, setSeen] = useState<string[]>([active]);
  // (pointing at the dock or the window lifts the window a little further out of the dome)
  const [peek, setPeek] = useState(false);
  const peekT = useRef(0);
  const peekOn = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; window.clearTimeout(peekT.current); setPeek(true); };
  // (it settles back only after a moment, so crossing between the window and the dock doesn't bob it)
  const peekOff = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; window.clearTimeout(peekT.current); peekT.current = window.setTimeout(() => setPeek(false), 260); };

  // ---------- opening: the window (or its green button, as a Mac window's) opens the current thing. For a
  // page of this site the window first grows to fill the screen; elsewhere it opens in a new tab ----------
  const router = useRouter();
  const [zoom, setZoom] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const open = () => {
    if (!item.href) return;
    if (item.external) { window.open(item.href, '_blank', 'noopener'); return; }
    const r = win.current?.getBoundingClientRect();
    if (!r || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(item.href); return; }
    router.prefetch(item.href);
    setZoom({ x: r.left, y: r.top, w: r.width, h: r.height });
    window.setTimeout(() => router.push(item.href!), 430);
  };
  const onWinClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    open();
  };
  useEffect(() => { setSeen((s) => (s.includes(active) ? s : [...s, active])); }, [active]);
  const [dome, setDome] = useState<{ S: number; R: number; W: number; h: number; href: string; tile: number }>({ S: 0, R: 0, W: 0, h: 0, href: '', tile: 76 });
  const geo = useRef<{ x: number; y: number; rot: number }[]>([]);
  const scale = useRef<number[]>([]);
  const target = useRef<number[]>([]);
  const raf = useRef(0);
  const motionOK = useRef(true);

  // ---------- the arc: where each icon and the two arrows sit on the rim ----------
  const layout = useCallback(() => {
    const d = dock.current;
    if (!d) return;
    const W = d.clientWidth;
    const size = icons.current[0]?.offsetWidth || 76;
    const narrow = W < 900;
    const R = narrow ? W * 1.3 : Math.min(Math.max(W * 0.95, 900), 2000);
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
    const band = Math.max(26, size * 0.42);
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
  const onLeave = () => { target.current = items.map(() => 1); kick(); };

  // ---------- the window's media: the current one plays (if motion is welcome), the rest rest ----------
  useEffect(() => {
    Object.entries(vids.current).forEach(([id, v]) => {
      if (!v) return;
      if (id === active && motionOK.current) {
        if (!v.getAttribute('src')) { v.src = v.dataset.src!; v.load(); }
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [active, seen]);

  // ---------- choosing ----------
  // (on touch the first tap shows it, the second opens it; with a mouse, pointing already showed it. Whether
  // a tap is the first is settled when the finger comes down, before the tap's focus makes it current)
  const down = useRef<{ id: string; touch: boolean; was: boolean } | null>(null);
  const onIconDown = (e: React.PointerEvent, d: DockItem) => { down.current = { id: d.id, touch: e.pointerType !== 'mouse', was: d.id === activeRef.current }; };
  const onIconClick = (e: MouseEvent, d: DockItem) => {
    const t = down.current;
    down.current = null;
    if (t && t.id === d.id && t.touch && !t.was) { e.preventDefault(); onActive(d.id); }
  };
  const go = (step: number) => onTab((tab + step + TABS.length) % TABS.length, step);
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

  const prev = TABS[(tab - 1 + TABS.length) % TABS.length], next = TABS[(tab + 1) % TABS.length];

  return (
    <div className={`hm-stage${peek ? ' is-peek' : ''}`}>
      {/* the refraction filters: the dome's (its size changes with the screen) and the tiles' */}
      <svg className="hm-defs" aria-hidden="true" focusable="false">
        <filter id="hm-glass-dome" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          {dome.href && <feImage href={dome.href} x="0" y="0" width={dome.W} height={dome.h} preserveAspectRatio="none" result="map" />}
          <feDisplacementMap in="SourceGraphic" in2="map" scale="-46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="hm-glass-tile" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feImage href={TILE_MAP} x="0" y="0" width={dome.tile} height={dome.tile} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="-18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* the window: the current thing */}
      <section className={`hm-win${item.href ? ' is-open-able' : ''}`} ref={win} aria-label={`Preview: ${item.name}`} onPointerEnter={peekOn} onPointerLeave={peekOff} onClick={onWinClick}>
        <div className="hm-chrome">
          <span className="hm-dots">
            <i aria-hidden="true" /><i aria-hidden="true" />
            <button type="button" className="hm-green" onClick={open} disabled={!item.href} aria-label={item.href ? `Open ${item.name}${item.external ? ' (opens in a new tab)' : ''}` : `${item.name}: coming soon`}>
              <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M3.2 6.8V8.8H5.2M8.8 5.2V3.2H6.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </span>
          <span className="hm-tab" key={item.id}>
            <DockIcon id={item.id} />
            <span className="hm-tab-name">{item.name}</span>
            <span className="hm-tab-meta">{item.meta}</span>
          </span>
        </div>
        <div className="hm-media">
          {ALL_ITEMS.filter((d) => seen.includes(d.id)).map((d) => (
            <div key={d.id} className={`hm-m is-${d.id}${d.id === active ? ' is-on' : ''}${d.media.kind === 'image' && d.media.fit === 'contain' ? ' is-contain' : ''}${d.media.kind === 'note' ? ' is-note' : ''}`} aria-hidden={d.id === active ? undefined : true}>
              {d.media.kind === 'video' ? (
                <>
                  <img src={d.media.poster} alt="" draggable={false} style={{ objectPosition: d.media.position }} />
                  <video ref={(el) => { vids.current[d.id] = el; }} data-src={d.media.src} muted loop playsInline preload="none" aria-label={d.media.label} style={{ objectPosition: d.media.position }} />
                </>
              ) : d.media.kind === 'image' ? (
                <img src={d.media.src} alt={d.media.alt} draggable={false} style={{ objectPosition: d.media.position }} />
              ) : (
                <div className="hm-note">
                  <p className="hm-note-title">{d.media.title}</p>
                  {d.media.lines.map((l) => <p key={l} className="hm-note-line">{l}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {zoom && <span className="hm-zoom" aria-hidden="true" style={{ left: zoom.x, top: zoom.y, width: zoom.w, height: zoom.h } as CSSProperties} />}

      {/* the dome of glass, its apps on the rim, the arrows at the ends, the way in under them */}
      <div className="hm-dock" ref={dock} onPointerMove={onMove} onPointerLeave={(e) => { onLeave(); peekOff(e); }}>
        <div className="hm-dome" aria-hidden="true" style={{ width: dome.S || undefined }}>
          <span className="hm-dome-refract" />
          <span className="hm-dome-tint" />
          <span className="hm-dome-rim" />
        </div>
        {/* the bending, only along the rim on screen: a lens cut to the dome's circle */}
        {dome.href && <span className="hm-lens" aria-hidden="true" style={{ width: dome.W, height: dome.h, clipPath: `circle(${dome.R}px at 50% ${dome.R}px)` }} />}
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
          <ul className={`hm-icons ${dir < 0 ? 'from-left' : dir > 0 ? 'from-right' : ''}`} key={T.id}>
            {items.map((d, i) => {
              const body = (
                <>
                  <span className={`hm-tile is-${d.id}`}>
                    <span className="hm-glass" aria-hidden="true" />
                    <DockIcon id={d.id} />
                  </span>
                  <span className="hm-tip" aria-hidden="true">{d.label ?? d.name}</span>
                  <span className="sr-only">{d.name}: {d.line}{d.external ? ' (opens in a new tab)' : ''}</span>
                </>
              );
              const props = { className: 'hm-hit', onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') onActive(d.id); }, onPointerDown: (e: React.PointerEvent) => onIconDown(e, d), onFocus: () => onActive(d.id) };
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
        <div className="hm-go" key={item.id}>
          <p className="hm-go-line">{item.line} <Link className="hm-more" href={T.href}>{T.more} →</Link></p>
        </div>
      </div>
    </div>
  );
}

// (the page re-renders on every move of a drag across the sky; the dock only when its own props change)
export default memo(HomeDock);
