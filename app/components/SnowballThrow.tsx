'use client';

import { useEffect } from 'react';

// When it's snowing (SnowToggle), the cursor is a snowball (hp.css), and a click anywhere that isn't a
// link or a button throws it: it arcs up and away, smaller as it goes into the scene, then splats in a
// burst of flakes that drift down and melt away. Mouse and trackpad only; with reduced motion there's
// only the splat, fading in place. Purely decorative: the clicks still do what they did.
export default function SnowballThrow() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const live = new Set<HTMLElement>();
    const at = (x: number, y: number, cls: string) => {
      const el = document.createElement('span');
      el.className = cls;
      el.style.left = `${x}px`; el.style.top = `${y}px`;
      document.body.appendChild(el);
      live.add(el);
      return el;
    };
    const drop = (el: HTMLElement) => { el.remove(); live.delete(el); };

    const splat = (x: number, y: number) => {
      const blot = at(x, y, 'sb-splat');
      blot.animate([{ transform: 'translate(-50%, -50%) scale(0.3)', opacity: 1 }, { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.18 }, { transform: 'translate(-50%, -50%) scale(1.05)', opacity: 0 }], { duration: 1300, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' }).onfinish = () => drop(blot);
      if (reduce.matches) return;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5, r = 14 + Math.random() * 22;
        const f = at(x, y, 'sb-flake');
        f.animate([
          { transform: 'translate(-50%, -50%) translate(0, 0) scale(0.6)', opacity: 1 },
          { transform: `translate(-50%, -50%) translate(${Math.cos(a) * r}px, ${Math.sin(a) * r - 6}px) scale(1)`, opacity: 1, offset: 0.35 },
          { transform: `translate(-50%, -50%) translate(${Math.cos(a) * r * 1.2}px, ${Math.sin(a) * r + 18}px) scale(0.7)`, opacity: 0 },
        ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' }).onfinish = () => drop(f);
      }
    };

    const onDown = (e: PointerEvent) => {
      if (document.documentElement.dataset.snow !== 'on' || !fine.matches || e.button !== 0 || !document.querySelector('.hp-home')) return;
      if ((e.target as Element | null)?.closest('a, button, input, select, textarea, [role="switch"]')) return;
      const x = e.clientX, y = e.clientY;
      if (reduce.matches) { splat(x, y); return; }
      // Thrown: up in an arc and away (smaller), landing a little above and aside of where you clicked
      const dx = (Math.random() - 0.5) * 50, rise = 70 + Math.random() * 30, land = 34 + Math.random() * 16;
      const ball = at(x, y, 'sb-ball');
      ball.animate([
        { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)' },
        { transform: `translate(-50%, -50%) translate(${dx * 0.55}px, ${-rise}px) scale(0.62)`, offset: 0.55 },
        { transform: `translate(-50%, -50%) translate(${dx}px, ${-land}px) scale(0.42)` },
      ], { duration: 480, easing: 'cubic-bezier(0.25, 0.6, 0.45, 1)' }).onfinish = () => { drop(ball); splat(x + dx, y - land); };
    };
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('pointerdown', onDown); live.forEach((el) => el.remove()); };
  }, []);
  return null;
}
