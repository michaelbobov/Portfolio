'use client';

import { useEffect, useRef } from 'react';

// The end of the headline rolls through what the messy ideas become: real products → live apps →
// shipped code, every 2.6s. Each phrase rises into a clipped slot as the last one leaves upward.
// All phrases share one grid cell, so the line never reflows. It pauses while the tab is hidden;
// with reduced motion it stays on the first phrase. Purely visual: the h1 carries the sentence.
const WORDS = ['real products.', 'live apps.', 'shipped code.'];
const EVERY_MS = 2600;

export default function RollingWord() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const words = Array.from(root.querySelectorAll<HTMLElement>('.wf-roll-word'));
    let at = 0, timer = 0;
    const show = (to: number) => {
      words.forEach((w, i) => {
        w.classList.toggle('is-on', i === to);
        w.classList.toggle('is-out', i === at && i !== to);
      });
      at = to;
    };
    const stop = () => { window.clearInterval(timer); timer = 0; };
    const start = () => {
      stop();
      if (reduce.matches || document.hidden) return;
      timer = window.setInterval(() => show((at + 1) % WORDS.length), EVERY_MS);
    };
    const onMotion = () => { if (reduce.matches) show(0); start(); };
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener('change', onMotion);
    start();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', start);
      reduce.removeEventListener('change', onMotion);
    };
  }, []);

  return (
    <span className="wf-roll" ref={ref}>
      {WORDS.map((w, i) => (
        <span key={w} className={`wf-roll-word${i === 0 ? ' is-on' : ''}`}>
          {w}
        </span>
      ))}
    </span>
  );
}
