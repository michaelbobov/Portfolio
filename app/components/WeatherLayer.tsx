'use client';

import { useEffect, useRef } from 'react';

// The weather over the homepage's sky: rain (thin slanted streaks), snow (soft flakes drifting down, the
// near ones bigger and quicker), on one canvas behind the window and the dome, so it falls in the scene, not
// on the page. Fog and overcast are veils (home.css) on the same layer. Drawn each frame only while the page
// is visible; with reduced motion, snow stands still and rain is left out (the veil stays).
export type Weather = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow';

type Drop = { x: number; y: number; z: number; s: number; w: number };

export default function WeatherLayer({ weather, night }: { weather: Weather; night: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || (weather !== 'rain' && weather !== 'snow')) return;
    const g = c.getContext('2d');
    if (!g) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still && weather === 'rain') return;
    let W = 0, H = 0, raf = 0, last = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const drops: Drop[] = [];
    const seed = () => {
      drops.length = 0;
      const n = weather === 'rain' ? Math.round((W * H) / 5200) : Math.round((W * H) / 3600);
      for (let i = 0; i < n; i++) drops.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random(), s: Math.random(), w: Math.random() * Math.PI * 2 });
    };
    const size = () => {
      W = c.clientWidth; H = c.clientHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    // rain: streaks falling fast and slanted, fainter far away; snow: flakes sinking and swaying
    const draw = (dt: number, t: number) => {
      g.clearRect(0, 0, W, H);
      if (weather === 'rain') {
        g.lineCap = 'round';
        const slant = 0.2;
        for (const d of drops) {
          const v = 900 + d.z * 700, len = 10 + d.z * 18;
          d.y += v * dt; d.x += v * slant * dt;
          if (d.y > H + len) { d.y = -len - Math.random() * 60; d.x = Math.random() * (W + 200) - 200; }
          if (d.x > W + 20) d.x -= W + 40;
          g.strokeStyle = night ? `rgba(200,210,240,${0.16 + d.z * 0.26})` : `rgba(255,255,255,${0.2 + d.z * 0.32})`;
          g.lineWidth = 0.6 + d.z * 0.9;
          g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - len * slant, d.y - len); g.stroke();
        }
      } else {
        for (const d of drops) {
          const r = 0.9 + d.z * 2.9, v = 22 + d.z * 52;
          if (dt) { d.y += v * dt; d.x += (Math.sin(t * 0.0006 + d.w) * 14 + 6) * dt; }
          if (d.y > H + 6) { d.y = -6; d.x = Math.random() * W; }
          if (d.x > W + 6) d.x -= W + 12;
          g.fillStyle = `rgba(255,255,255,${0.45 + d.z * 0.45})`;
          g.beginPath(); g.arc(d.x, d.y, r, 0, Math.PI * 2); g.fill();
        }
      }
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      draw(dt, now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !document.hidden && !still) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const vis = () => (document.hidden ? stop() : start());
    size();
    if (still) draw(0, 0); else start();
    const ro = new ResizeObserver(() => { size(); if (still) draw(0, 0); });
    ro.observe(c);
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); ro.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [weather, night]);

  if (weather === 'clear') return null;
  return (
    <div className={`hm-weather is-${weather}`} aria-hidden="true">
      <span className="hm-veil" />
      {(weather === 'rain' || weather === 'snow') && <canvas ref={ref} />}
    </div>
  );
}
