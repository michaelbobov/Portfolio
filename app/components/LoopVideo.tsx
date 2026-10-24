'use client';

import { useEffect, useRef } from 'react';

// The Spotify Loop demo, playing silently inside a phone frame. It only plays while it is on
// screen, and never on its own under reduced motion (the poster, a still of the player, shows).
export default function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !('IntersectionObserver' in window)) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // React doesn't reliably set the muted property, and browsers only autoplay muted video
    video.muted = true;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce.matches) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    // Watch the phone frame, not the video: the video is cropped, so most of it is never visible
    io.observe(video.parentElement ?? video);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} className="nw-video" src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" />;
}
