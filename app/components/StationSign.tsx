'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { STATIONS, dayIn, hourIn, skyFor, timeIn, useNow } from '@/app/lib/wayfinding';

type NameLayer = { key: number; idx: number; cls: '' | 'enter-l' | 'enter-r' | 'leave-l' | 'leave-r' };

// Station sign (駅名標): Seattle ↔ Tokyo, with each city's live local time and a sky strip
// coloured by that city's current hour. ◀ ▶ slide the station name in the direction of travel.
export default function StationSign() {
  const [at, setAt] = useState(0);
  const [layers, setLayers] = useState<NameLayer[]>([{ key: 0, idx: 0, cls: '' }]);
  const nextKey = useRef(1);
  const timers = useRef<number[]>([]);
  const now = useNow(15000);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const go = (to: number, dir: 1 | -1) => {
    if (to < 0 || to >= STATIONS.length || to === at) return;
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
        <div className="wf-time">
          <span>Local time in {s.en}</span>
          <b>{now ? `${dayIn(s.tz, now)} ${timeIn(s.tz, now)}` : '--:--'}</b>
        </div>
      </div>
      <div className="wf-track-bar">
        {/* aria-disabled (not disabled) so focus stays on the button at either end of the line */}
        <button
          className="wf-prev"
          type="button"
          aria-label={prev ? `Previous station: ${prev.en}` : 'Previous station'}
          aria-disabled={!prev}
          onClick={() => go(at - 1, -1)}
        >
          ◀ <span>{prev ? prev.en : ''}</span>
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
              {next.en}{'  '}<span lang="ja">{next.kana}</span>
            </span>
          ) : (
            <span>Terminal</span>
          )}{' '}
          ▶
        </button>
      </div>
      <figcaption className="wf-sign-foot">
        <span>MB Line · Seattle ↔ Tokyo</span>
        <span>7,700 km</span>
      </figcaption>
    </figure>
  );
}
