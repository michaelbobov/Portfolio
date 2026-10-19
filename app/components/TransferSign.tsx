'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from '@/app/components/icons';

const CLIP = '/stations/tokyo-platform.webm';
const POSTER = '/stations/tokyo-platform-poster.jpg';

// "More about me" as a hanging JR transfer sign (乗換) over real platform footage: a train
// passing a Tokyo platform, in black and white like the hero photos. The sign hangs on two rods
// from the band's top edge, like a sign hung from a platform ceiling; the whole sign is the link.
// The clip (about 9 MB) never loads with the page: its src is set only when the band nears the
// viewport, it plays while at least a quarter is in view and pauses when it leaves. With reduced
// motion, or a browser that can't play WebM, the poster stays.
export default function TransferSign() {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const band = bandRef.current;
    const video = videoRef.current;
    if (!band || !video || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!video.canPlayType('video/webm')) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.preload = 'auto';
      video.src = CLIP;
    };
    // Fetch shortly before it is needed...
    const near = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { load(); near.disconnect(); } },
      { rootMargin: '400px 0px' }
    );
    // ...play while a quarter of the band is in view, pause otherwise
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.25) {
          load();
          video.play().catch(() => { /* autoplay refused: the poster stays */ });
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: [0, 0.25] }
    );
    near.observe(band);
    seen.observe(band);
    return () => {
      near.disconnect();
      seen.disconnect();
      video.pause();
    };
  }, []);

  return (
    <div className="wf-xband" ref={bandRef}>
      <video
        ref={videoRef}
        className="wf-xband-video"
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      />
      <div className="wf-wrap wf-xband-inner">
        <a className="wf-xsign" href="https://about.michaelbobov.com/">
          <span className="wf-xs-rod" aria-hidden="true" />
          <span className="wf-xs-rod wf-xs-rod-r" aria-hidden="true" />
          <span className="wf-xs-arrow" aria-hidden="true">
            <ArrowUpRight size={40} strokeWidth={2.25} />
          </span>
          <span className="wf-xs-jp">
            <span className="wf-xs-kanji" lang="ja">乗換</span>
            <span className="wf-xs-en">Transfer</span>
          </span>
          <span className="wf-xs-to">
            <span className="wf-xs-bullet" aria-hidden="true">Me</span>
            <span className="wf-xs-dest">
              <span className="wf-xs-t1">More about me</span>
              <span className="wf-xs-t2">about.michaelbobov.com</span>
            </span>
          </span>
          <span className="wf-xs-led" lang="ja" aria-hidden="true">のりかえ</span>
        </a>
      </div>
    </div>
  );
}
