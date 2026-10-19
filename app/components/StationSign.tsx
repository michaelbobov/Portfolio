'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { STATIONS, dayIn, hourIn, skyFor, timeIn, useNow } from '@/app/lib/wayfinding';
import { PlayLeft, PlayRight } from '@/app/components/icons';

type NameLayer = { key: number; idx: number; cls: '' | 'enter-l' | 'enter-r' | 'leave-l' | 'leave-r' };

// Motion values (the CSS halves live in home.css)
const DEPART_MS = 380;
const ARRIVE_MS = 800;
const EASE_DEPART = 'cubic-bezier(0.65, 0, 0.35, 1)';
const EASE_ARRIVE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const LED_MS = 720;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Station sign (駅名標): Seattle ↔ Tokyo, with each city's live local time and a sky strip
// coloured by that city's current hour. The line bar carries a "you are here" marker, the way
// JR train LCDs show position: it slides in once on load (CSS), and ◀ ▶ run it off one edge with
// a short motion streak and back in from the other while the station and photo swap. Marker and
// LED motion are Web Animations on refs; React only swaps the content.
export default function StationSign() {
  const [at, setAt] = useState(0);
  const [layers, setLayers] = useState<NameLayer[]>([{ key: 0, idx: 0, cls: '' }]);
  const nextKey = useRef(1);
  const timers = useRef<number[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const markerRun = useRef(0);
  const ledRef = useRef<HTMLSpanElement | null>(null);
  const ledTextRef = useRef<HTMLSpanElement | null>(null);
  const shownAt = useRef(0);
  const photoTimer = useRef(0);
  const now = useNow(15000);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(photoTimer.current);
    };
  }, []);

  // The hero photo behind the sign follows the station. Layers are [data-station-photo] elements
  // (HeroPhotos); this only swaps classes, and the moves are CSS transitions (home.css): the
  // outgoing view slides 3% left and fades during the departure, then the new one comes in.
  const swapPhoto = (from: number, to: number) => {
    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-station-photo]'));
    if (layers.length === 0) return;
    const idx = (el: HTMLElement) => Number(el.dataset.stationPhoto);
    window.clearTimeout(photoTimer.current);
    // Snap whatever is mid-run to its end state, without transitions
    layers.forEach((el) => {
      el.classList.add('no-tr');
      el.classList.remove('is-out');
      el.classList.toggle('is-on', idx(el) === from);
    });
    void layers[0].offsetWidth;
    layers.forEach((el) => el.classList.remove('no-tr'));
    layers.forEach((el) => {
      const i = idx(el);
      if (i === from) { el.classList.remove('is-on'); el.classList.add('is-out'); }
      if (i === to) el.classList.add('is-on');
      if (i === to) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    // After the departure, park the old view back at its entry position (no transition)
    photoTimer.current = window.setTimeout(() => {
      layers.forEach((el) => {
        if (!el.classList.contains('is-out')) return;
        el.classList.add('no-tr');
        el.classList.remove('is-out');
        void el.offsetWidth;
        el.classList.remove('no-tr');
      });
    }, DEPART_MS + 40);
  };

  // The platform LED scrolls the new line name in from the right, in steps, as LED boards do
  useEffect(() => {
    if (shownAt.current === at) return;
    shownAt.current = at;
    const pill = ledRef.current;
    const text = ledTextRef.current;
    if (!pill || !text || typeof text.animate !== 'function') return;
    text.getAnimations().forEach((a) => a.cancel());
    if (reduced()) return;
    text.animate(
      [{ transform: `translateX(${pill.clientWidth}px)` }, { transform: 'translateX(0px)' }],
      { duration: LED_MS, easing: 'steps(18, end)' }
    );
  }, [at]);

  // Run the marker off one edge, re-enter from the other, settle at centre: one 1.18s animation.
  // The streak behind it shows only while it moves. A press during a run (or during the load
  // slide-in) snaps it to its end, then starts anew.
  const runMarker = (dir: 1 | -1) => {
    const marker = markerRef.current;
    const bar = barRef.current;
    if (!marker || !bar || typeof marker.animate !== 'function') return;
    marker.getAnimations().forEach((a) => a.finish());
    const run = ++markerRun.current;
    marker.classList.remove('is-moving');
    if (reduced()) return;
    marker.classList.toggle('is-rev', dir < 0);
    marker.classList.add('is-moving');
    const leave = dir * (bar.clientWidth / 2 + marker.offsetWidth / 2 + 56);
    const total = DEPART_MS + ARRIVE_MS;
    const p = DEPART_MS / total;
    const anim = marker.animate(
      [
        { offset: 0, transform: 'translateX(0px)', easing: EASE_DEPART },
        { offset: p, transform: `translateX(${leave}px)` },
        { offset: p, transform: `translateX(${-leave}px)`, easing: EASE_ARRIVE },
        { offset: 1, transform: 'translateX(0px)' },
      ],
      { duration: total }
    );
    anim.onfinish = () => {
      if (markerRun.current === run) marker.classList.remove('is-moving');
    };
  };

  const go = (to: number, dir: 1 | -1) => {
    if (to < 0 || to >= STATIONS.length || to === at) return;
    runMarker(dir);
    swapPhoto(at, to);
    // Names already on their way out are dropped; the current one slides out opposite the travel direction
    const outgoing = layers.filter((l) => !l.cls.startsWith('leave'));
    const leaveCls = dir > 0 ? 'leave-l' : 'leave-r';
    setLayers([
      ...outgoing.map((l) => ({ ...l, cls: leaveCls as NameLayer['cls'] })),
      { key: nextKey.current++, idx: to, cls: dir > 0 ? 'enter-r' : 'enter-l' },
    ]);
    const gone = outgoing.map((l) => l.key);
    timers.current.push(
      window.setTimeout(() => setLayers((prev) => prev.filter((l) => !gone.includes(l.key))), 260)
    );
    setAt(to);
  };

  const s = STATIONS[at];
  const prev = STATIONS[at - 1];
  const next = STATIONS[at + 1];
  const signStyle = {
    '--lc': s.color,
    '--lc-ink': s.onColor,
    ...(now ? { '--sky': skyFor(hourIn(s.tz, now)) } : {}),
  } as CSSProperties;

  return (
    <figure className="wf-sign" id="sign" data-station-sign aria-label="Station sign" style={signStyle}>
      <div className="wf-sky" />
      <div className="wf-sign-body">
        <div className="wf-badge">
          <span className="wf-code">{s.code}</span>
          <span className="wf-num">{s.num}</span>
        </div>
        <div className="wf-names" aria-live="polite">
          {layers.map((l) => {
            const st = STATIONS[l.idx];
            const leaving = l.cls.startsWith('leave');
            return (
              <div key={l.key} className={`wf-name ${l.cls}`} aria-hidden={leaving || undefined}>
                <span className="wf-kana" lang="ja">{st.kana}</span>
                <span className="wf-en">{st.en}</span>
                <span className="wf-note">{st.note}</span>
              </div>
            );
          })}
        </div>
        <span className="wf-pled" ref={ledRef}>
          <span className="wf-pled-text" ref={ledTextRef}>
            {s.lineJa && <span lang="ja">{s.lineJa} </span>}
            {s.line}
          </span>
        </span>
        <div className="wf-time">
          <span>Local time in {s.en}</span>
          <b>{now ? `${dayIn(s.tz, now)} ${timeIn(s.tz, now)}` : '--:--'}</b>
        </div>
      </div>
      <div className="wf-track-bar" ref={barRef}>
        {/* aria-disabled (not disabled) so focus stays on the button at either end of the line */}
        <button
          className="wf-prev"
          type="button"
          aria-label={prev ? `Previous station: ${prev.en}` : 'Previous station'}
          aria-disabled={!prev}
          onClick={() => go(at - 1, -1)}
        >
          <PlayLeft size={12} />
          <span>{prev ? prev.en : ''}</span>
        </button>
        <span className="wf-here" aria-hidden="true" />
        <button
          className="wf-next"
          type="button"
          aria-label={next ? `Next station: ${next.en}` : 'Next station: terminal'}
          aria-disabled={!next}
          onClick={() => go(at + 1, 1)}
        >
          {next ? (
            <span>
              {next.en}
              <span className="wf-next-kana" lang="ja">{next.kana}</span>
            </span>
          ) : (
            <span>Terminal</span>
          )}
          <PlayRight size={12} />
        </button>
        {/* "You are here": the position marker, with a streak that shows only while it moves */}
        <span className="wf-marker" ref={markerRef} aria-hidden="true" />
      </div>
      <figcaption className="wf-sign-foot">Seattle to Tokyo, 7,700 km</figcaption>
    </figure>
  );
}
