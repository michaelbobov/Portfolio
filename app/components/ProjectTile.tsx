'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

// One project on the Projects page: its cover (the real poster, or a screenshot), then where it stands,
// its name, what it does and my role. Pointing at it crossfades the cover into the project's muted overview
// loop and back; the video loads only then (preload none, no src until asked). "Preview" plays it for touch
// and keyboard (and keeps it playing when the pointer leaves). With reduced motion, pointing doesn't play
// anything; the button still does. A click anywhere on the tile, except the button, opens the case study:
// the name is the tile's one link. Projects without a video get a slow, small zoom of the still instead.
export type Tile = {
  id: string;
  name: string;
  href: string;
  meta: string;
  line: string;
  role: string;
  cover: { src: string; alt: string; position?: string };
  video?: { src: string; label: string };
};

export default function ProjectTile({ t, eager }: { t: Tile; eager?: boolean }) {
  const vid = useRef<HTMLVideoElement | null>(null);
  const timer = useRef(0);
  const pinned = useRef(false);
  const [live, setLive] = useState(false);
  const [pin, setPin] = useState(false);

  // (whether playback is wanted right now: a `playing` that arrives after a stop, as on a slow first load,
  // is turned back and never shown)
  const wanted = useRef(false);
  // (each request to play is numbered, so only the latest one's failure resets anything)
  const req = useRef(0);
  const play = () => {
    const v = vid.current;
    if (!v || !t.video) return;
    wanted.current = true;
    const n = ++req.current;
    window.clearTimeout(timer.current);
    if (!v.getAttribute('src')) { v.src = t.video.src; v.load(); }
    // (still playing from a moment ago: show it again now, as no new `playing` event will come)
    if (!v.paused && v.readyState >= 3) setLive(true);
    v.play().catch(() => {
      // (the browser refused it, and it's still the one wanted: back to the poster, and the button back
      // to "Preview" so it can be tried again)
      if (n !== req.current || !wanted.current) return;
      wanted.current = false;
      pinned.current = false;
      setPin(false);
      setLive(false);
    });
  };
  const stop = () => {
    const v = vid.current;
    if (!v) return;
    wanted.current = false;
    setLive(false);
    // (fade back to the poster first, then rewind, unless it was asked for again meanwhile)
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { if (!wanted.current) { v.pause(); v.currentTime = 0; } }, 360);
  };

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const on = () => { if (wanted.current) setLive(true); else v.pause(); };
    v.addEventListener('playing', on);
    // (a pinned preview stops once it's scrolled away)
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting && pinned.current) { pinned.current = false; setPin(false); stop(); } });
    io.observe(v);
    return () => { v.removeEventListener('playing', on); io.disconnect(); window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hoverOK = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enter = () => { if (t.video && hoverOK()) play(); };
  const leave = () => { if (t.video && !pinned.current) stop(); };
  const toggle = () => {
    pinned.current = !pinned.current;
    setPin(pinned.current);
    if (pinned.current) play(); else stop();
  };
  const go = (e: MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || (e.target as HTMLElement).closest('a, button') || window.getSelection()?.toString()) return;
    const a = e.currentTarget.querySelector<HTMLAnchorElement>('a[data-main]');
    if (!a) return;
    if (e.metaKey || e.ctrlKey) window.open(a.href, '_blank', 'noopener'); else a.click();
  };

  return (
    <article className={`pt is-${t.id}${t.video ? ' has-video' : ''}`} onClick={go} onPointerEnter={enter} onPointerLeave={leave}>
      <div className="pt-words">
        <p className="pt-meta">{t.meta}</p>
        <h2 className="pt-name"><Link href={t.href} data-main="">{t.name}<span className="pt-arrow" aria-hidden="true">→</span></Link></h2>
        {/* (after the name for the keyboard; shown at the meta line's end, projects.css) */}
        {t.video && (
          <button type="button" className="pt-preview" onClick={toggle} aria-pressed={pin} aria-label={`${pin ? 'Stop' : 'Play'} the preview: ${t.video.label}`}>
            <span aria-hidden="true">{pin ? '■' : '▶'}</span> {pin ? 'Stop preview' : 'Preview'}
          </button>
        )}
        <p className="pt-line">{t.line}</p>
        <p className="pt-role">{t.role}</p>
      </div>
      <figure className={`pt-cover${live ? ' is-live' : ''}`}>
        <img src={t.cover.src} alt={t.cover.alt} width={1400} height={700} loading={eager ? 'eager' : 'lazy'} decoding="async" style={t.cover.position ? { objectPosition: t.cover.position } : undefined} />
        {t.video && <video ref={vid} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} style={t.cover.position ? { objectPosition: t.cover.position } : undefined} />}
      </figure>
    </article>
  );
}
