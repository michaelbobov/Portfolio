'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

// The name on the homepage, in frosted glass (hp.css), drawn once and left still. Two things move over it,
// each clipped to the letters' shapes by an SVG clip path whose text is laid exactly over the real name
// (measured from it): a band of light that crosses the letters now and then, and, under the pointer, a
// window: a soft circle following the cursor (easing, not jumping) in which the letters clear and you see
// the other world through them (with snow off, the winter with snow falling in it; with snow on, the plain,
// snow-free page). Everything that moves is moved, not redrawn: the band, the circle, the scene sliding the
// other way so it stays put on the screen, and the snow. Mouse and trackpad only for the window; with
// reduced motion the band stays away, the circle doesn't trail and its snow holds still. Purely visual (the
// h1 is the text).
const LENS = 300;

export default function GlassName({ delay }: { delay: number }) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const h1 = useRef<HTMLHeadingElement | null>(null);
  const texts = useRef<(SVGTextElement | null)[]>([]);
  const win = useRef<HTMLDivElement | null>(null);
  const shine = useRef<HTMLDivElement | null>(null);
  const lens = useRef<HTMLDivElement | null>(null);
  const scene = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const w = wrap.current, h = h1.current, wn = win.current, sh = shine.current, ln = lens.current, sc = scene.current;
    if (!w || !h || !wn || !sh || !ln || !sc) return;
    // Lay the clip path's text over the real name: same font, each word at its own start and baseline
    const measure = () => {
      for (const box of [wn, sh]) {
        box.style.left = `${h.offsetLeft}px`; box.style.top = `${h.offsetTop}px`;
        box.style.width = `${h.offsetWidth}px`; box.style.height = `${h.offsetHeight}px`;
      }
      const hr = h.getBoundingClientRect(), cs = getComputedStyle(h);
      Array.from(h.querySelectorAll<HTMLElement>('.hp-word')).forEach((word, i) => {
        const t = texts.current[i], probe = word.querySelector('.hp-probe'), node = word.lastChild;
        if (!t || !probe || !node) return;
        const r = document.createRange(); r.selectNodeContents(node);
        t.setAttribute('x', String(r.getBoundingClientRect().left - hr.left));
        t.setAttribute('y', String(probe.getBoundingClientRect().bottom - hr.top));
        Object.assign(t.style, { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing, fontOpticalSizing: cs.fontOpticalSizing, fontVariationSettings: cs.fontVariationSettings });
      });
      w.classList.add('is-ready');
    };
    document.fonts.ready.then(measure);
    measure();
    const ro = new ResizeObserver(measure); ro.observe(h);
    h.addEventListener('animationend', measure);

    // The window, for a mouse
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0, inside = false, placed = false;
    const step = () => {
      raf = 0;
      const k = reduce.matches ? 1 : 0.4;
      x += (tx - x) * k; y += (ty - y) * k;
      const b = wn.getBoundingClientRect(), lx = x - LENS / 2, ly = y - LENS / 2;
      ln.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
      // (the scene slides the other way, so its top left stays at the screen's)
      sc.style.transform = `translate3d(${(-lx - b.left).toFixed(1)}px, ${(-ly - b.top).toFixed(1)}px, 0)`;
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      const b = wn.getBoundingClientRect();
      tx = e.clientX - b.left; ty = e.clientY - b.top;
      if (!placed) { x = tx; y = ty; placed = true; }
      // (only on the letters' own band, not the space round the name)
      const pad = b.height * 0.12;
      const near = e.clientX > b.left + pad && e.clientX < b.right - pad && e.clientY > b.top + pad && e.clientY < b.bottom - pad;
      if (near !== inside) {
        inside = near; w.classList.toggle('is-peeking', near);
        if (near) w.classList.add('was-peeked'); else placed = false;
      }
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { ro.disconnect(); h.removeEventListener('animationend', measure); window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  const word = (t: string) => <span className="hp-word"><span className="hp-probe" />{t}</span>;
  return (
    <div ref={wrap} className="hp-title-wrap">
      <h1 ref={h1} id="hero-title" className="hp-title" style={{ '--d': `${delay}ms` } as CSSProperties}>{word('Michael')} {word('Bobov')}</h1>
      <svg className="hp-clipdef" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="hp-name-clip" clipPathUnits="userSpaceOnUse">
            <text ref={(el) => { texts.current[0] = el; }}>Michael</text>
            <text ref={(el) => { texts.current[1] = el; }}>Bobov</text>
          </clipPath>
        </defs>
      </svg>
      <div ref={shine} className="hp-shine" aria-hidden="true"><i /></div>
      <div ref={win} className="hp-window" aria-hidden="true">
        <div ref={lens} className="hp-lens">
          <div ref={scene} className="hp-scene">
            <div className="hp-scene-pic" />
            <div className="hp-flakes"><i className="is-mid" /><i className="is-front" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
