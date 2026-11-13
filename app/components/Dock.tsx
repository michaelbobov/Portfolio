'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The site's navigation on every page but the homepage (where the dolls are the way in): a bar of liquid
// glass at the bottom, after Apple's, with a raised glass bubble under the page you're on. The bar is four
// layers (the liquid-glass skill's): what's behind, blurred, richer and, in Chromium, bent at the edges by
// an SVG displacement map the size of the bar; a white tint; a rim of light, bright along the top; and the
// words. Point at another word and the bubble springs over to it, stretching a little toward where it's
// going. Styles: site.css.
const SECTIONS = [
  { href: '/', label: 'Home', on: (p: string) => p === '/' },
  { href: '/work', label: 'Work', on: (p: string) => p === '/work' || p.startsWith('/work/') },
  { href: '/side-projects', label: 'Side projects', on: (p: string) => p === '/side-projects' || p.startsWith('/side-projects/') },
  { href: '/about', label: 'About', on: (p: string) => p === '/about' },
];

// The displacement map: an image the size of the bar whose red and green say how far to shift what's
// behind, sideways and up or down. Two gradients, then a blurred neutral grey over the middle, so only
// the edges bend (the skill's inline map)
const glassMap = (w: number, h: number, r: number) => {
  const blur = Math.max(5, Math.round(r * 0.35));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='x' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient><linearGradient id='y' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient><filter id='b'><feGaussianBlur stdDeviation='${blur}'/></filter></defs><rect width='${w}' height='${h}' rx='${r}' fill='url(#x)'/><rect width='${w}' height='${h}' rx='${r}' fill='url(#y)' style='mix-blend-mode:screen'/><rect width='${w}' height='${h}' rx='${r}' fill='#808080' filter='url(#b)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
// Only Chromium bends the backdrop through an SVG filter; elsewhere the glass is blur alone
const bendsBackdrop = () => /Chrome\//.test(navigator.userAgent);

type Box = { x: number; w: number };

export default function Dock() {
  const path = usePathname() ?? '/';
  const here = SECTIONS.findIndex((s) => s.on(path));
  const [over, setOver] = useState<number | null>(null);
  const target = over ?? here;
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [bar, setBar] = useState<{ w: number; h: number } | null>(null);
  const [bend, setBend] = useState(false);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // The bubble's spring: where it is, how wide, how fast
  const spring = useRef({ x: 0, v: 0, w: 0, wv: 0, raf: 0, placed: false });

  // Measure the bar and its items (again when it changes size, e.g. once the font arrives)
  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const measure = () => {
      const pr = pill.getBoundingClientRect();
      setBar({ w: Math.round(pr.width), h: Math.round(pr.height) });
      setBoxes(itemRefs.current.map((el) => { const r = el?.getBoundingClientRect(); return r ? { x: r.left - pr.left, w: r.width } : { x: 0, w: 0 }; }));
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(pill);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { setBend(bendsBackdrop()); }, []);

  // Move the bubble: a spring, a little underdamped so it settles with a give; travelling, it stretches
  // toward where it's going. With reduced motion, or the first time, it's simply there.
  useEffect(() => {
    const el = thumbRef.current, to = boxes[target];
    const s = spring.current;
    if (!el) return;
    if (!to) { el.style.opacity = '0'; return; }
    el.style.opacity = '';
    const draw = () => {
      const stretch = Math.min(Math.abs(s.v) * 0.03, 16);
      el.style.width = `${s.w + stretch}px`;
      el.style.transform = `translateX(${s.x - (s.v < 0 ? stretch : 0)}px)`;
    };
    cancelAnimationFrame(s.raf);
    if (!s.placed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { x: to.x, w: to.w, v: 0, wv: 0, placed: true });
      draw();
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      s.v += (-360 * (s.x - to.x) - 28 * s.v) * dt; s.x += s.v * dt;
      s.wv += (-360 * (s.w - to.w) - 32 * s.wv) * dt; s.w += s.wv * dt;
      const done = Math.abs(s.v) < 0.4 && Math.abs(s.x - to.x) < 0.2 && Math.abs(s.wv) < 0.4 && Math.abs(s.w - to.w) < 0.2;
      if (done) Object.assign(s, { x: to.x, w: to.w, v: 0, wv: 0 });
      draw();
      if (!done) s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [target, boxes]);

  return (
    <nav className="nb" aria-label="Sections" data-bend={bend && bar ? '' : undefined} onPointerLeave={() => setOver(null)}>
      {bend && bar && (
        <svg className="nb-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id="nb-glass" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage result="map" x={0} y={0} width={bar.w} height={bar.h} preserveAspectRatio="none" href={glassMap(bar.w, bar.h, bar.h / 2)} />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={-28} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      <div ref={pillRef} className="nb-pill">
        <span className="nb-refract" aria-hidden="true" />
        <span className="nb-tint" aria-hidden="true" />
        <span ref={thumbRef} className="nb-thumb" aria-hidden="true" />
        <ul className="nb-list">
          {SECTIONS.map((s, i) => (
            <li key={s.href}>
              <Link
                ref={(el) => { itemRefs.current[i] = el; }}
                href={s.href}
                className={`nb-item${i === target ? ' is-on' : ''}`}
                aria-current={i === here ? 'page' : undefined}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOver(i); }}
                onFocus={() => setOver(i)}
                onBlur={() => setOver(null)}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
