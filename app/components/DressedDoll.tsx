'use client';

import { useEffect, useRef } from 'react';
import { DOLLS, DOLL_ART } from '@/app/data/dolls';
import { ME } from '@/app/data/me';
import type { Outfit } from '@/app/data/outfit';

// His doll in an outfit, in 3D, turning gently from side to side (still with reduced motion): his
// private outfit page's preview, the preview page, and the "Today's fit" card. Changing the outfit only
// swaps the clothes; the scene is built once. `open` lifts the lid, clothes and all. Loads three.js
// only when it's shown.
export default function DressedDoll({ outfit, open = false, still, className = '', label = 'My doll in this outfit' }: {
  outfit: Outfit; open?: boolean; still?: number; className?: string; label?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef({ open, still });
  live.current = { open, still };
  const dress = useRef<((o: Outfit) => void) | null>(null);
  const latest = useRef(outfit);
  latest.current = outfit;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let dead = false, raf = 0, cleanup = () => {};
    Promise.all([import('@/app/components/DollScene'), import('@/app/components/Outfit3D')]).then(async ([D, O]) => {
      if (dead) return;
      const { renderer, scene, camera, shadowTex, disposables } = D.studio(canvas);
      const doll = D.buildDoll(DOLLS[ME], shadowTex);
      const art = DOLL_ART[ME];
      if (art) {
        const load = (src: string) => new Promise<HTMLImageElement>((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; });
        try { doll.repaint({ front: await load(art.front), back: await load(art.back) }); } catch { /* keeps its colours */ }
      }
      const free = () => { doll.disposables.forEach((d) => d.dispose()); disposables.forEach((d) => d.dispose()); renderer.forceContextLoss(); };
      if (dead) { free(); return; }
      scene.add(doll.group, doll.shadow);

      let worn: { dispose: () => void } | null = null;
      dress.current = (o) => { worn?.dispose(); worn = O.wearOutfit(doll, o); };
      dress.current(latest.current);

      const size = () => {
        const W = canvas.clientWidth, H = canvas.clientHeight;
        if (!W || !H) return;
        renderer.setSize(W, H, false);
        const k = D.aim(camera, W, H, H * 0.86);
        const S = (H * 0.72) / ((D.FLOOR - 8) * k);
        doll.group.scale.setScalar(S);
        doll.shadow.position.set(0, 0.5, 0);
        doll.shadow.scale.set(150 * S * 1.25, 150 * S * 0.9, 1);
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(canvas);

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      let lift = live.current.open ? 1 : 0;
      const t0 = performance.now();
      const frame = (now: number) => {
        const { open: o, still: s } = live.current;
        doll.group.rotation.y = s !== undefined ? s : reduce.matches ? 0.35 : Math.sin(((now - t0) / 1000) * 0.45) * 0.8;
        lift += ((o ? 1 : 0) - lift) * (reduce.matches ? 1 : 0.12);
        if (doll.lid) {
          doll.lid.position.set(-26 * lift, D.FLOOR - 150 + 48 * lift, 0);
          doll.lid.rotation.set(-0.1 * lift, 0, 0.24 * lift);
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      cleanup = () => { ro.disconnect(); worn?.dispose(); dress.current = null; free(); };
    });
    return () => { dead = true; cancelAnimationFrame(raf); cleanup(); };
  }, []);

  // A new outfit: new clothes on the same doll
  useEffect(() => { dress.current?.(outfit); }, [outfit]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
