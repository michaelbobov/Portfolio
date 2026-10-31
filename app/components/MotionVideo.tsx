'use client';

import { useEffect, useRef, useState } from 'react';

// A silent motion piece (a feature overview): it loops while it's on screen, with a small button to
// pause or play it. Under reduced motion it never starts on its own: the poster shows until the
// button is pressed. The wrapper is positioned by where it's used (a card's stage, a case study
// frame); its look is in site.css (.mv).
export default function MotionVideo({ src, poster, width, height, label, className = '' }: { src: string; poster: string; width: number; height: number; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  // False once the visitor pauses it (or wants less motion), so scrolling back doesn't restart it
  const wanted = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React doesn't reliably set the muted property, and browsers only autoplay muted video
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
    <span className={`mv ${className}`}>
      <video ref={ref} src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata" aria-label={label} />
      <button type="button" className="mv-btn" onClick={toggle} aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}>
        {playing ? (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 2.6v10.8a1 1 0 0 0 1.5.86l9-5.4a1 1 0 0 0 0-1.72l-9-5.4A1 1 0 0 0 4 2.6Z" fill="currentColor" /></svg>
        )}
      </button>
    </span>
  );
}
