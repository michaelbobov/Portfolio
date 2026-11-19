'use client';

import { Fragment, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { wantsSnow3D } from '@/app/components/snowFlag';
import '@/app/hp.css';

// A title in frosted glass (hp.css): the name on the homepage, and every page's title, so each page opens
// the way the homepage does. Drawn once and left still. Two things move over it,
// each clipped to the letters' shapes by an SVG clip path whose text is laid exactly over the real name
// (measured from it): a band of light that crosses the letters now and then, and, under the pointer, a
// window: a soft circle following the cursor (easing, not jumping) in which the letters clear and you see
// the other world through them (with snow off, the winter with snow falling in it; with snow on, the plain,
// snow-free page). Everything that moves is moved, not redrawn: the band, the circle, the scene sliding the
// other way so it stays put on the screen, and the snow. Mouse and trackpad only for the window; with
// reduced motion the band stays away, the circle doesn't trail and its snow holds still. Purely visual (the
// h1 is the text). One per page (the clip path has one id). `className` sizes it (hp.css: gt-page);
// `delay` is the homepage intro's.
const LENS = 300;

export default function GlassName({ words, id, delay, className }: { words: string[]; id: string; delay?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const h1 = useRef<HTMLHeadingElement | null>(null);
  const texts = useRef<(SVGTextElement | null)[]>([]);
  const win = useRef<HTMLDivElement | null>(null);
  const shine = useRef<HTMLDivElement | null>(null);
  const lens = useRef<HTMLDivElement | null>(null);
  const scene = useRef<HTMLDivElement | null>(null);
  const snowCanvas = useRef<HTMLCanvasElement | null>(null);

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
        if (near) { w.classList.add('was-peeked'); snow?.wake(); } else placed = false;
      }
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener('pointermove', move, { passive: true });

    // The three.js snow in the window, on trial (snowFlag); otherwise the CSS flakes
    let snow: { wake: () => void; detach: () => void } | null = null, dead = false;
    const sc3 = snowCanvas.current;
    if (sc3 && fine.matches && wantsSnow3D()) {
      import('@/app/components/Snow3D').then(({ attachLens }) => {
        if (dead) return;
        try { snow = attachLens(sc3, () => w.classList.contains('is-peeking')); } catch { /* no WebGL: the CSS snow stays */ }
      }, () => {});
    }
    return () => { dead = true; snow?.detach(); ro.disconnect(); h.removeEventListener('animationend', measure); window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  const word = (t: string) => <span className="hp-word"><span className="hp-probe" />{t}</span>;
  return (
    <div ref={wrap} className="hp-title-wrap">
      <h1 ref={h1} id={id} className={className ? `hp-title ${className}` : 'hp-title'} style={delay == null ? undefined : ({ '--d': `${delay}ms` } as CSSProperties)}>
        {words.map((t, i) => <Fragment key={t + i}>{i > 0 && ' '}{word(t)}</Fragment>)}
      </h1>
      <svg className="hp-clipdef" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="hp-name-clip" clipPathUnits="userSpaceOnUse">
            {words.map((t, i) => <text key={t + i} ref={(el) => { texts.current[i] = el; }}>{t}</text>)}
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
          <canvas ref={snowCanvas} className="hp-lens-snow" />
        </div>
      </div>
    </div>
  );
}
