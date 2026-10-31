'use client';

import { useEffect, useRef, useState } from 'react';
import { DollInside, FLAT_AFTER, FlatDoll } from '@/app/components/FlatDoll';
import type { AboutScene } from '@/app/components/DollScene';

// The About page's doll, standing in a half-round, doll-shaped frame. On hover it does a little
// double bounce and a spin; clicking twists its top off and away so the next doll peeks up out of it,
// from inside the cup, and clicking again puts the top back. It's the lacquered 3D doll from the
// homepage once WebGL is ready (DollScene). Until then the frame waits empty; if it's late, or there's
// no WebGL, the flat one shows (flat) and does the same in CSS.
export default function AboutDoll() {
  const [open, setOpen] = useState(false);
  const [in3d, setIn3d] = useState(false);
  const [flat, setFlat] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scene = useRef<AboutScene | null>(null);

  useEffect(() => {
    let dead = false;
    const root = ref.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const late = window.setTimeout(() => setFlat(true), FLAT_AFTER);
    const fail = () => { window.clearTimeout(late); setFlat(true); };
    import('@/app/components/DollScene').then(({ createAboutScene }) => {
      if (dead) return;
      try {
        const s = createAboutScene(root, canvas);
        scene.current = s;
        s.ready.then(() => { if (!dead) { window.clearTimeout(late); setIn3d(true); } });
      } catch {
        // No WebGL
        fail();
      }
    }, fail);
    return () => { dead = true; window.clearTimeout(late); scene.current?.dispose(); scene.current = null; };
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    scene.current?.set(next);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`ad${open ? ' is-opening' : ''}${in3d ? ' is-3d' : ''}${flat ? ' is-flat' : ''}`}
      aria-pressed={open}
      aria-label={open ? 'Put the doll’s top back' : 'Open the doll'}
      onClick={toggle}
    >
      {/* Back to front: the inside of the cup, the next doll, the doll; so the next one rises out of the
          cup, behind its front lip */}
      <span className="ad-frame">
        <span className="ad-cup" aria-hidden="true"><DollInside i={0} /></span>
        <span className="ad-inner"><FlatDoll i={1} prefix="adi" /></span>
        <span className="ad-doll"><FlatDoll i={0} prefix="ad" /></span>
        <canvas ref={canvasRef} className="ad-3d" aria-hidden="true" />
      </span>
    </button>
  );
}
