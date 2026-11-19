'use client';

import { useEffect, useRef, useState } from 'react';
import { BOX, FOCUS, OPEN, SHUTTERS, STAGE, frameSvg, shutterSvg, type Focus } from '@/app/data/nalichnik';
import type { Window3D } from '@/app/components/Nalichnik3D';

// A carved Russian window (data/nalichnik), like the ones in a storybook, shut until it's clicked: its
// shutters swing open onto a picture, and a click shuts them again. Each time they open, there's the next
// picture behind them (swapped while they're shut). In 3D (Nalichnik3D) where WebGL is there; otherwise
// drawn flat, its shutters turning in CSS. With reduced motion they open and shut at once.

export type Picture = { src: string; alt: string; caption: string; focus?: Focus };

// (the flat window sits on the 3D one's stage, where the 3D one does)
const SW = STAGE.x1 - STAGE.x0, SH = STAGE.y1 - STAGE.y0;
const inStage = (x: number, y: number, w: number, h: number) => ({
  left: `${((x - STAGE.x0) / SW) * 100}%`, top: `${((y - STAGE.y0) / SH) * 100}%`, width: `${(w / SW) * 100}%`, height: `${(h / SH) * 100}%`,
});
const load = (src: string) => new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

export default function Nalichnik({ pictures }: { pictures: Picture[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scene = useRef<Window3D | null>(null);
  const images = useRef<Promise<HTMLImageElement>[]>([]);
  const [open, setOpen] = useState(false);
  // the picture behind the shutters (none until they're first opened)
  const [at, setAt] = useState(-1);
  const [in3d, setIn3d] = useState(false);

  // 3D if it can be; the pictures loaded ahead, so each is there when the shutters open on it
  const srcs = pictures.map((p) => p.src).join(' ');
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    images.current = srcs.split(' ').map(load);
    images.current.forEach((p) => p.catch(() => {}));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    import('@/app/components/Nalichnik3D').then(({ createWindow }) => {
      if (dead) return;
      try {
        const s = createWindow(canvas, { reduce });
        scene.current = s;
        s.ready.then(() => { if (!dead) setIn3d(true); }, () => {});
      } catch { /* no WebGL: the flat window stays */ }
    }, () => {});
    return () => { dead = true; scene.current?.dispose(); scene.current = null; };
  }, [srcs]);

  // Shut, it takes the next picture; then it opens on it
  const toggle = () => {
    if (open) { setOpen(false); return; }
    const next = (at + 1) % pictures.length;
    setAt(next);
    const s = scene.current;
    if (!s || !in3d) { setOpen(true); return; }
    images.current[next].then((img) => { s.setPhoto(img, pictures[next].focus); setOpen(true); }, () => setOpen(true));
  };

  // (opened before the 3D window was ready: it takes the picture the flat one showed)
  useEffect(() => {
    const s = scene.current;
    if (!s || !in3d) return;
    if (open && at >= 0) images.current[at]?.then((img) => s.setPhoto(img, pictures[at].focus), () => {});
    s.setOpen(open);
  }, [in3d]);
  useEffect(() => { scene.current?.setOpen(open); }, [open]);

  const pic = at >= 0 ? pictures[at] : null;
  const focus = pic?.focus ?? FOCUS;
  const caption = open && pic ? pic.caption : at < 0 ? 'Open the shutters' : 'Open them again for the next picture';
  return (
    <figure className="nl-figure">
      <button
        type="button"
        className={`nl${open ? ' is-open' : ''}${in3d ? ' is-3d' : ''}`}
        aria-pressed={open}
        aria-label={open ? 'Close the shutters' : 'Open the shutters'}
        onClick={toggle}
      >
        <span className="nl-flat" aria-hidden="true">
          {pic && <img className="nl-photo" src={pic.src} alt="" style={{ ...inStage(OPEN.x, OPEN.y, OPEN.w, OPEN.h), objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }} />}
          <span className="nl-frame" style={inStage(0, 0, BOX.w, BOX.h)} dangerouslySetInnerHTML={{ __html: frameSvg() }} />
          <span className="nl-shutters" style={inStage(SHUTTERS.x, SHUTTERS.y, SHUTTERS.w, SHUTTERS.h)}>
            <span className="nl-leaf is-l"><span className="nl-face" dangerouslySetInnerHTML={{ __html: shutterSvg('l') }} /><span className="nl-back" /></span>
            <span className="nl-leaf is-r"><span className="nl-face" dangerouslySetInnerHTML={{ __html: shutterSvg('r') }} /><span className="nl-back" /></span>
          </span>
        </span>
        <canvas ref={canvasRef} className="nl-3d" aria-hidden="true" />
        {open && pic && <span className="sr-only">{pic.alt}</span>}
      </button>
      <figcaption aria-live="polite">
        <span className="nl-count" aria-hidden="true">{pic ? `${at + 1} / ${pictures.length}` : `${pictures.length} pictures`}</span>
        <span className="nl-caption">{caption}</span>
      </figcaption>
    </figure>
  );
}
