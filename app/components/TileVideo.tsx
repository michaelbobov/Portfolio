'use client';

import { useEffect, useRef, useState } from 'react';

// A Work tile's overview recording (WorkBento): the silent loop running off the tile's edge, and
// its play / pause button kept apart from it, in the tile's own corner, so the crop can never take the
// button with it. Like MotionVideo: it plays while it's on screen, and with reduced motion it waits for
// the button.
export default function TileVideo({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  // False once the visitor pauses it (or wants less motion), so scrolling back doesn't restart it
  const wanted = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) wanted.current = false;
    const on = () => setPlaying(true), off = () => setPlaying(false);
    v.addEventListener('play', on);
    v.addEventListener('pause', off);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && wanted.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => { io.disconnect(); v.removeEventListener('play', on); v.removeEventListener('pause', off); };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    wanted.current = v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <div className="sx-media">
        <span className="sx-shot wb-shot">
          <video ref={ref} src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata" aria-label={label} />
        </span>
      </div>
      <button type="button" className="mv-btn wb-play" onClick={toggle} aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}>
        {playing ? (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 2.6v10.8a1 1 0 0 0 1.5.86l9-5.4a1 1 0 0 0 0-1.72l-9-5.4A1 1 0 0 0 4 2.6Z" fill="currentColor" /></svg>
        )}
      </button>
    </>
  );
}
