'use client';

import { useEffect, useRef } from 'react';

// The end of the headline, in a comic starburst: REAL PRODUCTS! → LIVE APPS! → SHIPPED CODE!,
// every 2.4s, and every swap lands like a punch. The old burst squashes out (120ms); the new one
// slams in from a small, tilted start with a spring overshoot and a rotation snap, in the next
// burst colour. On landing it throws ink rays and a few stars, shakes its line a little and flashes
// a small BAM!/POW!. The swap is CSS transitions toggled by class (interruptible); the impact FX
// are short-lived nodes that are always removed. All phrases share one grid cell, so the line never
// reflows. It pauses on hover and while the tab is hidden; with reduced motion it stays on the
// first phrase with no FX. Purely visual: the h1 carries the full sentence for screen readers.
const WORDS = ['REAL PRODUCTS!', 'LIVE APPS!', 'SHIPPED CODE!'];
const FILLS = ['#ffd84d', '#ff8fb8', '#7ce0b3', '#7cc8ff'];
const STAR_FILLS = ['#ffd84d', '#ff8fb8', '#7ce0b3', '#7cc8ff', '#ffa45c', '#c9b6ff'];
const FLASH = ['BAM!', 'POW!'];
const STAR = 'M12 1l3.2 6.9 7.3.8-5.4 5 1.5 7.3L12 17.3 5.4 21l1.5-7.3-5.4-5 7.3-.8Z';
const EVERY_MS = 2400;
const OUT_MS = 120;
const IN_MS = 520;
const LAND_MS = Math.round(IN_MS * 0.4);

export default function ComicKeyword() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const words = Array.from(root.querySelectorAll<HTMLElement>('.wf-kw-word'));
    const line = root.closest<HTMLElement>('.ed-nowrap') ?? root;
    let at = 0, fill = 0, timer = 0, outTimer = 0, landTimer = 0, hovered = false;
    const fx = new Set<Element>();
    const drop = (el: Element) => { el.remove(); fx.delete(el); };
    const add = <E extends Element>(el: E) => { document.body.appendChild(el); fx.add(el); return el; };
    const later = new Set<number>();
    const after = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { later.delete(id); fn(); }, ms);
      later.add(id);
    };

    // ---------- the landing: rays, stars, a micro-shake and a BAM!/POW! flash ----------
    const impact = (word: HTMLElement) => {
      const r = word.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const reach = Math.max(r.width, r.height) * 0.5;
      const n = 6 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360 + Math.random() * 18;
        const ray = add(document.createElement('div'));
        ray.className = 'kw-ray';
        ray.animate([
          { transform: `translate3d(${cx}px, ${cy}px, 0) rotate(${a}deg) translateX(${reach * 0.7}px) scaleX(0.2)`, opacity: 1 },
          { transform: `translate3d(${cx}px, ${cy}px, 0) rotate(${a}deg) translateX(${reach + 26}px) scaleX(1)`, opacity: 0 },
        ], { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).onfinish = () => drop(ray);
      }
      const stars = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < stars; i++) {
        const s = add(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('class', 'kw-star');
        s.innerHTML = `<path d="${STAR}" fill="${STAR_FILLS[Math.floor(Math.random() * STAR_FILLS.length)]}" stroke="#1d1233" stroke-width="2" stroke-linejoin="round"/>`;
        const a = Math.random() * Math.PI * 2, d = reach + 30 + Math.random() * 30;
        s.animate([
          { transform: `translate3d(${cx - 9}px, ${cy - 9}px, 0) scale(0.3) rotate(0deg)`, opacity: 1 },
          { transform: `translate3d(${cx - 9 + Math.cos(a) * d}px, ${cy - 9 + Math.sin(a) * d * 0.7}px, 0) scale(1) rotate(${Math.random() * 240 - 120}deg)`, opacity: 1, offset: 0.7 },
          { transform: `translate3d(${cx - 9 + Math.cos(a) * d * 1.1}px, ${cy - 9 + Math.sin(a) * d * 0.8 + 10}px, 0) scale(0.6) rotate(${Math.random() * 240 - 120}deg)`, opacity: 0 },
        ], { duration: 560, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).onfinish = () => drop(s);
      }
      line.animate([
        { transform: 'translate(0, 0)' }, { transform: 'translate(-3px, 1px)' }, { transform: 'translate(3px, -2px)' },
        { transform: 'translate(-2px, 2px)' }, { transform: 'translate(2px, -1px)' }, { transform: 'translate(0, 0)' },
      ], { duration: 160, easing: 'linear' });
      const flash = add(document.createElement('div'));
      flash.className = 'kw-flash';
      flash.textContent = FLASH[Math.floor(Math.random() * FLASH.length)];
      flash.style.left = `${r.right - 18}px`;
      flash.style.top = `${r.top - 14}px`;
      after(() => drop(flash), 380);
    };

    const show = (to: number) => {
      const from = at;
      if (to === from) return;
      at = to;
      fill = (fill + 1) % FILLS.length;
      window.clearTimeout(outTimer);
      window.clearTimeout(landTimer);
      // Snap anything mid-swap to rest first
      words.forEach((w, i) => { if (i !== from) w.classList.remove('is-out'); });
      const incoming = words[to];
      const snap = Math.random() < 0.5 ? -18 : 18;
      incoming.style.setProperty('--k0', `${snap}deg`);
      incoming.style.setProperty('--kr', `${(Math.random() * 10 - 5).toFixed(1)}deg`);
      incoming.style.setProperty('--kb', FILLS[fill]);
      void incoming.offsetWidth; // start from the tilted, tiny state
      words[from].classList.remove('is-on');
      words[from].classList.add('is-out');
      incoming.classList.add('is-on');
      outTimer = window.setTimeout(() => words[from].classList.remove('is-out'), OUT_MS + 20);
      if (!reduce.matches) landTimer = window.setTimeout(() => impact(incoming), LAND_MS);
    };
    const stop = () => { window.clearInterval(timer); timer = 0; };
    const start = () => {
      stop();
      if (reduce.matches || hovered || document.hidden) return;
      timer = window.setInterval(() => show((at + 1) % WORDS.length), EVERY_MS);
    };
    const onEnter = () => { hovered = true; stop(); };
    const onLeave = () => { hovered = false; start(); };
    const onVisibility = () => start();
    const onMotion = () => { if (reduce.matches) show(0); start(); };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', onMotion);
    start();
    return () => {
      stop();
      window.clearTimeout(outTimer);
      window.clearTimeout(landTimer);
      later.forEach((id) => window.clearTimeout(id));
      fx.forEach((el) => el.remove());
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', onMotion);
    };
  }, []);

  return (
    <span className="wf-kw" ref={ref} aria-hidden="true">
      {WORDS.map((w, i) => (
        <span key={w} className={`wf-kw-word${i === 0 ? ' is-on' : ''}`}>
          {w}
        </span>
      ))}
    </span>
  );
}
