'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { DIVE_MS, RISE_MS, ZOOM, seg } from '@/app/data/village';
import { zoomBus } from '@/app/components/zoomBus';

// The homepage's dive: clicking the Side projects doll flies the camera into the village painted on her
// belly, and the painting becomes the 3D village (DollScene, VillageScene), where each place is a side
// project: one side project (the matryoshka itself) leading to the others.
//  1. the name, the bar and the other dolls blur and fade, as if out of focus
//  2. the camera flies to the painting; its curve flattens, and the village takes over from that very view
//  3. the camera moves on into the village, the houses pop one after another, their labels arrive
// Then it's a guided tour: a bar of numbered steps (the places in the order the path passes them), with
// Previous and Next and the arrow keys; choose one (or click a place, or its label) and the camera travels
// to it and its card docks beside it, with the project's pictures; close it to see the whole village.
// "Back to the dolls", Escape or the browser's Back fly out again (the dive is a history entry,
// #side-projects). It runs on a clock, not the scroll; with reduced motion the dolls and the village simply
// crossfade. Until the 3D village is ready (or without WebGL) that doll goes to the Side projects page, and
// the side projects are a plain section under the dolls.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const HASH = '#side-projects';

export default function VillageZoom({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hz = ref.current;
    const pin = hz?.querySelector<HTMLElement>('.hz-pin');
    const vz = hz?.querySelector<HTMLElement>('.vz');
    if (!hz || !pin || !vz) return;
    const q = (s: string) => hz.querySelector<HTMLElement>(s);
    const all = (s: string) => Array.from(hz.querySelectorAll<HTMLElement>(s));
    const name = q('.hp-name'), ds = q('.ds'), track = q('.ds-track'), winter = q('.hp-winter'), head = q('.vz-head');
    const chrome = all('.sb, .hp-snow-switch, .hp-credit'), flakes = all('.hp-flakes-between, .hp-flakes-front, .hp-floor');
    const pins = all('.vz-pin'), cards = all('.vz-card'), back = q('.vz-back'), steps = all('.vz-tour-step');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = (el: HTMLElement | null, styles: Partial<CSSStyleDeclaration>) => { if (el) Object.assign(el.style, styles); };
    const ready = () => hz.classList.contains('has-village');

    let p = 0, raf = 0, pushed = false, focusTimer = 0;

    // Everything on the page that follows p
    const show = (next: number) => {
      p = next;
      zoomBus.set({ p });
      const fade = reduce.matches;
      const a = easeOut(seg(p, ZOOM.away));
      set(name, { opacity: String(1 - a), filter: !fade && a > 0 && a < 1 ? `blur(${(a * 14).toFixed(2)}px)` : '', transform: !fade && a > 0 ? `scale(${1 + a * 0.05})` : '', willChange: a > 0 && a < 1 ? 'opacity, filter, transform' : '' });
      chrome.forEach((el) => set(el, { opacity: String(1 - seg(p, [0, 0.1])), visibility: p > 0.1 ? 'hidden' : '' }));
      set(track, { opacity: String(1 - seg(p, [0, 0.1])) });
      set(ds, { pointerEvents: p > 0 ? 'none' : '' });
      set(winter, { opacity: String(1 - seg(p, [0.1, 0.45])), transform: !fade && p > 0 ? `scale(${1 + easeOut(seg(p, ZOOM.fly)) * 0.3})` : '' });
      flakes.forEach((el) => set(el, { opacity: String(1 - seg(p, [0.04, 0.3])) }));
      // The overlay: there from the handoff, its heading and labels arriving last
      vz.classList.toggle('is-on', p >= ZOOM.hand[1]);
      vz.classList.toggle('is-in', p >= 1);
      // (without the 3D village the heading is just the plain section's, always shown)
      const l = ready() ? easeOut(seg(p, ZOOM.labels)) : 1;
      set(head, { opacity: l < 1 ? String(l) : '', transform: l < 1 ? `translate3d(0, ${((1 - l) * -8).toFixed(1)}px, 0)` : '' });
      // Inside, the page stays put
      document.documentElement.classList.toggle('vz-lock', p > 0);
    };

    // Run p to `to` on the clock (from wherever it is, so a dive can turn round mid-way)
    const run = (to: number, ms: number, done?: () => void) => {
      cancelAnimationFrame(raf);
      const from = p, dur = Math.abs(to - from) * ms;
      if (!dur) { show(to); done?.(); return; }
      const t0 = performance.now();
      const tick = (now: number) => {
        // (a frame's timestamp can be a hair before t0: never let p dip below where it started)
        const t = Math.min(1, Math.max(0, (now - t0) / dur));
        show(from + (to - from) * t);
        if (t < 1) raf = requestAnimationFrame(tick); else { raf = 0; done?.(); }
      };
      raf = requestAnimationFrame(tick);
    };
    // With reduced motion: a quick crossfade instead of the flight
    const swap = (to: number, done?: () => void) => {
      pin.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-in', fill: 'forwards' }).finished.then(() => {
        show(to); done?.();
        pin.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
      }, () => {});
    };

    const arrive = () => back?.focus({ preventScroll: true });
    const dive = () => {
      if (!ready() || (p >= 1 && !raf)) return;
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      if (location.hash !== HASH) { history.pushState({ vz: 1 }, '', HASH); pushed = true; }
      if (reduce.matches) swap(1, arrive); else run(1, DIVE_MS, arrive);
    };
    const rise = () => {
      if (p === 0 && !raf) return;
      const go = () => (reduce.matches ? swap(0) : run(0, RISE_MS, () => ds?.querySelector<HTMLElement>('.ds-slot')?.focus({ preventScroll: true })));
      // (an open card closes first and the camera backs out to the village, then it flies out)
      if (zoomBus.get().focus >= 0) { zoomBus.set({ focus: -1 }); focusTimer = window.setTimeout(go, reduce.matches ? 0 : 420); } else go();
    };
    const leave = () => {
      if (pushed && location.hash === HASH) { history.back(); return; }
      if (location.hash === HASH) history.replaceState(null, '', location.pathname + location.search);
      rise();
    };

    // ---------- the houses' cards ----------
    let opener: HTMLElement | null = null;
    const onBus = (s: ReturnType<typeof zoomBus.get>) => {
      cards.forEach((c, i) => {
        const open = i === s.focus && s.p >= 1;
        if (open === c.classList.contains('is-open')) return;
        c.classList.toggle('is-open', open);
        const v = c.querySelector('video');
        if (open && v && !reduce.matches) { v.preload = 'auto'; v.play().catch(() => {}); } else v?.pause();
        if (open && opener) { c.querySelector<HTMLElement>('.vz-cta')?.focus({ preventScroll: true }); opener = null; }
      });
      vz.classList.toggle('has-focus', s.focus >= 0);
      pins.forEach((el, i) => { el.classList.toggle('is-hover', i === s.hover); el.classList.toggle('is-focus', i === s.focus); });
      // the tour bar shows where you are
      steps.forEach((el, i) => { if (i === s.focus) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); el.classList.toggle('is-hover', i === s.hover); });
    };
    const offBus = zoomBus.on(onBus);
    const focusOn = (i: number) => zoomBus.set({ focus: ((i % cards.length) + cards.length) % cards.length });

    // ---------- wiring ----------
    const onDive = () => dive();
    const onPop = () => { pushed = false; if (location.hash === HASH) dive(); else rise(); };
    const onKey = (e: KeyboardEvent) => {
      if (p === 0) return;
      // (the arrow keys walk the tour)
      if (p >= 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !(e.target as HTMLElement).closest('input, textarea')) {
        e.preventDefault();
        const f = zoomBus.get().focus;
        focusOn(e.key === 'ArrowRight' ? f + 1 : f < 0 ? cards.length - 1 : f - 1);
        return;
      }
      if (e.key !== 'Escape') return;
      if (zoomBus.get().focus >= 0) zoomBus.set({ focus: -1 }); else leave();
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.vz-back')) { leave(); return; }
      if (t.closest('.vz-close')) { zoomBus.set({ focus: -1 }); return; }
      const step = t.closest<HTMLElement>('.vz-step');
      if (step) {
        const f = zoomBus.get().focus, d = Number(step.dataset.step);
        focusOn(f < 0 ? (d > 0 ? 0 : cards.length - 1) : f + d);
        return;
      }
      const stop = t.closest<HTMLElement>('.vz-tour-step');
      if (stop) { if (e.detail === 0) opener = stop; focusOn(Number(stop.dataset.i)); return; }
      // A label flies to its place first; the card has the way to the project (new-tab clicks still go)
      const pinEl = t.closest<HTMLElement>('.vz-pin');
      if (pinEl && ready() && p >= 1 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault();
        if (e.detail === 0) opener = pinEl;
        focusOn(Number(pinEl.dataset.i));
      }
    };
    // Once the village is ready: start inside it if the address says so
    const onReady = () => { if (location.hash === HASH) dive(); };
    window.addEventListener('hz-dive', onDive);
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    window.addEventListener('vz-ready', onReady);
    vz.addEventListener('click', onClick);
    // Pointing at a step in the tour bar lifts its place and shows its label
    const stepOver = (e: Event) => { const el = (e.target as HTMLElement).closest<HTMLElement>('.vz-tour-step'); zoomBus.set({ hover: el ? Number(el.dataset.i) : -1 }); };
    const stepOut = () => zoomBus.set({ hover: -1 });
    steps.forEach((el) => { el.addEventListener('pointerenter', stepOver); el.addEventListener('pointerleave', stepOut); el.addEventListener('focus', stepOver); el.addEventListener('blur', stepOut); });
    show(0);
    if (ready()) onReady();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(focusTimer);
      offBus();
      window.removeEventListener('hz-dive', onDive);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('vz-ready', onReady);
      vz.removeEventListener('click', onClick);
      steps.forEach((el) => { el.removeEventListener('pointerenter', stepOver); el.removeEventListener('pointerleave', stepOut); el.removeEventListener('focus', stepOver); el.removeEventListener('blur', stepOut); });
      document.documentElement.classList.remove('vz-lock');
      zoomBus.set({ p: 0, focus: -1, hover: -1 });
    };
  }, []);

  return (
    <div ref={ref} className="hz">
      <div className="hz-pin">{children}</div>
    </div>
  );
}
