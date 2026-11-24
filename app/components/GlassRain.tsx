'use client';

import { useEffect, useRef } from 'react';

// Rain on the studio's window (HomeDock's Welcome painting), when it's raining in Seattle: beads of water
// sitting on the glass, and now and then a heavier drop that runs down, faster as it goes, wandering a
// little and leaving a trail of small beads that dry off. Drawn on a canvas the size of the window's
// picture; CSS masks it to the panes (home.css .hm-pane). Each bead is a small lens: clear, a dark rim
// along its lower edge and a bright point of light at the top left. Drawn only while it's on screen;
// with reduced motion the beads sit still and nothing runs.
type Bead = { x: number; y: number; r: number; life: number };
type Runner = { x: number; y: number; r: number; v: number; wob: number; lastTrail: number };

// (the panes are roughly the right 58% of the picture and its top half: no drops are drawn elsewhere)
const AREA = { x0: 0.4, x1: 1, y0: 0, y1: 0.56 };

export default function GlassRain() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext('2d');
    if (!g) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, raf = 0, last = performance.now(), visible = true;
    const beads: Bead[] = [], runners: Runner[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const inArea = () => ({ x: rand(AREA.x0, AREA.x1) * W, y: rand(AREA.y0, AREA.y1) * H });
    // a bead, drawn once per size into a sprite
    const sprites = new Map<number, HTMLCanvasElement>();
    const sprite = (r: number) => {
      const key = Math.round(r * 4) / 4;
      const hit = sprites.get(key);
      if (hit) return hit;
      const s = document.createElement('canvas'), n = Math.ceil((key * 2 + 4) * dpr);
      s.width = s.height = n;
      const q = s.getContext('2d')!;
      q.scale(dpr, dpr);
      const m = key + 2;
      q.fillStyle = 'rgba(255,255,255,0.12)';
      q.beginPath(); q.arc(m, m, key, 0, Math.PI * 2); q.fill();
      q.strokeStyle = 'rgba(24,32,52,0.32)'; q.lineWidth = Math.max(0.7, key * 0.28);
      q.beginPath(); q.arc(m, m, key * 0.86, 0.1 * Math.PI, 0.9 * Math.PI); q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.85)';
      q.beginPath(); q.arc(m - key * 0.34, m - key * 0.38, Math.max(0.5, key * 0.26), 0, Math.PI * 2); q.fill();
      sprites.set(key, s);
      return s;
    };
    const seed = () => {
      beads.length = 0; runners.length = 0;
      const n = Math.round((W * H * (AREA.x1 - AREA.x0) * (AREA.y1 - AREA.y0)) / 520);
      for (let i = 0; i < n; i++) beads.push({ ...inArea(), r: rand(0.7, 2.6) * (Math.random() < 0.08 ? 1.6 : 1), life: Infinity });
    };
    const size = () => {
      W = c.clientWidth; H = c.clientHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites.clear();
      seed();
    };
    const draw = () => {
      g.clearRect(0, 0, W, H);
      for (const b of beads) {
        const s = sprite(b.r);
        g.globalAlpha = Number.isFinite(b.life) ? Math.max(0, Math.min(1, b.life)) : 1;
        g.drawImage(s, b.x - b.r - 2, b.y - b.r - 2, s.width / dpr, s.height / dpr);
      }
      g.globalAlpha = 1;
      for (const d of runners) {
        const s = sprite(d.r);
        g.drawImage(s, d.x - d.r - 2, d.y - d.r - 2, s.width / dpr, s.height / dpr);
      }
    };
    const step = (dt: number, t: number) => {
      // now and then a bead gets heavy enough to run
      if (runners.length < 5 && Math.random() < dt * 0.9) {
        const p = inArea();
        runners.push({ x: p.x, y: Math.min(p.y, H * 0.3), r: rand(2.4, 3.8), v: rand(18, 40), wob: Math.random() * 10, lastTrail: 0 });
      }
      for (let i = runners.length - 1; i >= 0; i--) {
        const d = runners[i];
        d.v = Math.min(d.v + 260 * dt, 300);
        d.y += d.v * dt;
        d.x += Math.sin(t * 0.004 + d.wob) * 6 * dt;
        // (it takes up the beads it runs through, and leaves small ones behind)
        for (let j = beads.length - 1; j >= 0; j--) {
          const b = beads[j];
          if (Number.isFinite(b.life)) continue;
          if (Math.abs(b.x - d.x) < d.r + b.r && Math.abs(b.y - d.y) < d.r + b.r) { beads.splice(j, 1); d.r = Math.min(d.r + b.r * 0.12, 4.6); }
        }
        if (d.y - d.lastTrail > rand(6, 14)) { beads.push({ x: d.x + rand(-0.8, 0.8), y: d.y - d.r, r: rand(0.6, 1.3), life: 3 }); d.lastTrail = d.y; }
        if (d.y > AREA.y1 * H + 10) runners.splice(i, 1);
      }
      // trails dry off; the glass keeps getting new beads
      for (let j = beads.length - 1; j >= 0; j--) { const b = beads[j]; if (Number.isFinite(b.life)) { b.life -= dt * 0.6; if (b.life <= 0) beads.splice(j, 1); } }
      if (Math.random() < dt * 14) beads.push({ ...inArea(), r: rand(0.7, 2.2), life: Infinity });
      if (beads.length > 900) beads.splice(0, beads.length - 900);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      step(dt, now); draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible && !document.hidden && !still) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    size(); draw(); start();
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting && e.intersectionRatio > 0; if (visible) start(); else stop(); });
    io.observe(c);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={ref} className="hm-rain" aria-hidden="true" />;
}
