'use client';

import { useEffect, useRef } from 'react';

// "Featured Work" as living type: one variable font (Bricolage Grotesque) whose letters thin and
// condense as the cursor comes near (wght 800 → 300, wdth 100 → 75, within about 220px) and turn
// grape at their closest. At rest it is a bold title. One rAF per pointer move, and only while the
// title is in view; touch devices and reduced motion keep the static bold title. The letters are
// aria-hidden; the h2 is named by its aria-label.
const FALLOFF = 220;

export default function LivingTitle({ id, text, className = '' }: { id?: string; text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const title = ref.current;
    if (!title || !('IntersectionObserver' in window)) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const letters = Array.from(title.querySelectorAll<HTMLElement>('.lt-ch'));
    let raf = 0, mx = -9999, my = -9999, watching = false;

    const paint = () => {
      raf = 0;
      for (const c of letters) {
        const r = c.getBoundingClientRect();
        if (!r.width) continue;
        const k = Math.max(0, 1 - Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)) / FALLOFF);
        c.style.fontVariationSettings = k > 0 ? `"wght" ${Math.round(800 - 500 * k)}, "wdth" ${Math.round(100 - 25 * k)}, "opsz" 96` : '';
        c.classList.toggle('is-near', k > 0.6);
      }
    };
    const rest = () => { mx = my = -9999; letters.forEach((c) => { c.style.fontVariationSettings = ''; c.classList.remove('is-near'); }); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const start = () => {
      if (watching || !fine.matches || reduce.matches) return;
      watching = true;
      window.addEventListener('pointermove', onMove, { passive: true });
    };
    const stop = () => {
      if (!watching) return;
      watching = false;
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf); raf = 0;
      rest();
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(title);
    const onPrefs = () => { stop(); };
    reduce.addEventListener('change', onPrefs);
    fine.addEventListener('change', onPrefs);
    return () => {
      io.disconnect();
      stop();
      reduce.removeEventListener('change', onPrefs);
      fine.removeEventListener('change', onPrefs);
    };
  }, []);

  return (
    <h2 id={id} ref={ref} className={`lt ${className}`} aria-label={text}>
      {text.split(' ').map((word, w, all) => (
        <span key={w} aria-hidden="true">
          <span className="lt-word">
            {Array.from(word).map((ch, i) => (
              <span key={i} className="lt-ch">{ch}</span>
            ))}
          </span>
          {w < all.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  );
}
