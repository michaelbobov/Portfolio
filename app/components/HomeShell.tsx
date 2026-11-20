'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { GlassTabs } from '@/app/components/Dock';
import HomeDock from '@/app/components/HomeDock';
import WeatherLayer, { type Weather } from '@/app/components/WeatherLayer';
import { RESUME } from '@/app/components/Site';
import { TABS } from '@/app/data/dock';
import { skyPhase, sunElevation } from '@/app/data/sun';

// The homepage (page.tsx hands it where he is and the weather there): the sky of that place at its real
// time of day and in its real weather, his name, the window and the dock (HomeDock), and the glass bar at
// the bottom, the same as on every page, whose words here are the dock's tabs (Work, Side Projects, About),
// so the bar and the arrows are the one way round. The top keeps only his mark and the résumé. The weather
// word in the top line is a button: it tries the other weathers in turn, then goes back to the real one. The sky: up to four paintings of the place (day, golden hour, dusk, night), crossfaded
// by where the sun is there now (data/sun.ts), checked each minute. The easter egg: drag across the sky
// and the day runs with you (a full day across the screen's width), the weather following the real
// forecast for each hour; drag up or down to change the weather yourself; a little clock tells the hour.
// Let go and it glides back to now. The words turn from ink to cream as dusk goes into night. Styles: home.css.
export type Scenes = { dusk: string; day?: string; golden?: string; night?: string };
type Live = { temp: number; words: string; kind: Weather; hours?: { t: number; kind: Weather; temp: number }[] } | null;
type Props = { caption: string; timeZone: string; lat: number; lon: number; scenes: Scenes; phase0: number; live: Live; weather?: Weather; hour?: number };
// (the weather button in the top line steps through these, then back to the real weather)
const STATES: Weather[] = ['clear', 'cloudy', 'rain', 'snow', 'fog'];
const SAY: Record<Weather, string> = { clear: 'clear', cloudy: 'cloudy', fog: 'foggy', rain: 'raining', snow: 'snowing' };
const ORDER = ['day', 'golden', 'dusk', 'night'] as const;
const H = 3600000;

export default function HomeShell({ caption, timeZone, lat, lon, scenes, phase0, live, weather: asked, hour }: Props) {
  // ---------- the weather: the real one there, or one being tried (the button in the top line) ----------
  const [tried, setTried] = useState<Weather | null>(asked ?? null);
  // (while the sky is dragged: the weather of the hour dragged to, or the one chosen by dragging up/down)
  const [scrubbed, setScrubbed] = useState<Weather | null>(null);
  const weather: Weather = scrubbed ?? tried ?? live?.kind ?? 'clear';
  const nextWeather = () => {
    const from = tried ?? live?.kind ?? 'clear';
    const i = STATES.indexOf(from);
    const n = STATES[(i + 1) % STATES.length];
    // (once round all five, back to the real weather)
    setTried(tried && n === (live?.kind ?? 'clear') ? null : n);
  };
  const [tab, setTab] = useState(0);
  const [dir, setDir] = useState(0);
  const [active, setActive] = useState(TABS[0].featured);
  const onTab = useCallback((i: number, d: number) => { setDir(d); setTab(i); setActive(TABS[i].featured); }, []);

  // ---------- the sky ----------
  const timed = !!(scenes.day && scenes.golden && scenes.night);
  const [phase, setPhase] = useState(timed ? phase0 : 2);
  const offset = useRef(0); // hours ahead of now (the drag)
  const base = useRef(0); // (a preview of another hour, ?hour=: where the drag returns to)
  const [clock, setClock] = useState<{ text: string; x: number; y: number } | null>(null);
  const [time, setTime] = useState('');
  const fmt = useCallback((d: Date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(d).toLowerCase(), [timeZone]);
  const at = useCallback(() => new Date(Date.now() + offset.current * H), []);
  const update = useCallback(() => { if (timed) setPhase(skyPhase(sunElevation(at(), lat, lon))); }, [timed, at, lat, lon]);
  useEffect(() => {
    if (hour !== undefined) {
      const h = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(new Date())) + new Date().getMinutes() / 60;
      base.current = offset.current = ((hour - h) % 24 + 24) % 24 - (((hour - h) % 24 + 24) % 24 > 12 ? 24 : 0);
    }
    const tick = () => { update(); setTime(fmt(at())); };
    tick();
    const t = window.setInterval(tick, 60000);
    return () => window.clearInterval(t);
  }, [update, fmt]);

  // ---------- the egg: drag the sky ----------
  // Sideways runs the day (a full day across the screen's width; drag left and the day goes on, as a
  // timeline pulled along), and the weather follows the real hours there, yesterday to tomorrow (the
  // forecast). Up and down steps through the weathers. Let go and it all glides back to now. A press only
  // becomes a drag once it has moved a few px, so a click on the window still opens it; once dragging, the
  // pointer is captured and nothing gets selected or picked up.
  const root = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; base: number; id: number; on: boolean; w0: number; host: HTMLElement } | null>(null);
  const glide = useRef(0);
  const glideWait = useRef(0);
  const hourWeather = useCallback((t: number): Weather | null => {
    const hs = live?.hours;
    if (!hs?.length) return null;
    let best = hs[0];
    for (const h of hs) if (Math.abs(h.t - t) < Math.abs(best.t - t)) best = h;
    return Math.abs(best.t - t) <= 2 * H ? best.kind : null;
  }, [live]);
  const scrubTo = (dx: number, dy: number, w: number, w0: number) => {
    offset.current = (drag.current?.base ?? 0) - (dx / w) * 24;
    update();
    const steps = Math.trunc(-dy / 90);
    const kind = steps ? STATES[(((w0 + steps) % STATES.length) + STATES.length) % STATES.length] : hourWeather(at().getTime()) ?? tried ?? live?.kind ?? 'clear';
    setScrubbed(kind);
    return kind;
  };
  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!timed || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('a, button, .hm-dock, .pc-bar, .nb')) return;
    drag.current = { x: e.clientX, y: e.clientY, base: offset.current, id: e.pointerId, on: false, w0: STATES.indexOf(tried ?? live?.kind ?? 'clear'), host: e.currentTarget };
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.on) {
      if (Math.hypot(dx, dy) < 6) return;
      d.on = true;
      // (a glide back from an earlier drag stops here, and this drag starts from where it had got to)
      window.clearTimeout(glideWait.current); cancelAnimationFrame(glide.current);
      d.base = offset.current;
      d.host.setPointerCapture(e.pointerId);
      d.host.classList.add('is-dragging');
      root.current?.setAttribute('data-scrub', '');
      window.getSelection()?.removeAllRanges();
    }
    const kind = scrubTo(dx, dy, e.currentTarget.clientWidth, d.w0);
    setClock({ text: `${fmt(at())} · ${SAY[kind]}`, x: e.clientX, y: e.clientY });
  };
  const onUp = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.on) return;
    d.host.classList.remove('is-dragging');
    // back to now: a glide (or at once, with reduced motion); the weather back to the real one
    const from = offset.current, t0 = performance.now(), still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = still ? 0 : Math.min(1800, 500 + Math.abs(from - base.current) * 110);
    const step = (now: number) => {
      const k = ms ? Math.min(1, (now - t0) / ms) : 1;
      offset.current = base.current + (from - base.current) * Math.pow(1 - k, 3);
      update();
      setClock((c) => (c && k < 1 ? { ...c, text: fmt(at()) } : null));
      if (k < 1) glide.current = requestAnimationFrame(step);
      else { setScrubbed(null); root.current?.removeAttribute('data-scrub'); }
    };
    glideWait.current = window.setTimeout(() => { glide.current = requestAnimationFrame(step); }, still ? 0 : 450);
  };

  // which two paintings show, and how much of the upper one
  const i = Math.min(Math.floor(phase), 2), k = phase - i;
  const opacity = (j: number) => (!timed ? (ORDER[j] === 'dusk' ? 1 : 0) : j === i ? 1 : j === i + 1 ? k : 0);
  const night = timed && phase > 2.45;
  // (the words turn cream once the sky is half dark; the change itself is a half-second fade, home.css, so
  // they never linger at a grey that reads on neither sky)
  const nt = night ? 1 : 0;

  // ---------- the glass bar at the bottom: the dock's tabs here, the same bar as on every page ----------
  const tabItems = TABS.map((t) => ({ key: t.id, label: t.label }));
  const pickTab = (i: number) => { if (i !== tab) onTab(i, i > tab ? 1 : -1); };

  return (
    <div ref={root} className={`pc hm${night ? ' is-night' : ''}`} style={{ '--nt': nt.toFixed(3) } as CSSProperties}>
      {/* the sky: the place's paintings, crossfaded by the time of day */}
      <div className="hm-sky" aria-hidden="true">
        {ORDER.map((p, j) => scenes[p] && (
          <div key={p} className={`hm-sky-${p}`} style={{ backgroundImage: `url(${scenes[p]})`, opacity: opacity(j) } as CSSProperties} />
        ))}
        {/* mist drifting over the sea of clouds, two layers at different heights and speeds */}
        <span className="hm-wisps is-far" />
        <span className="hm-wisps is-near" />
        <WeatherLayer weather={weather} night={night} />
      </div>

      <header className="pc-bar">
        <Link href="/" className="pc-mark" aria-label="Michael Bobov: home">
          <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
        </Link>
        <ul className="pc-nav">
          <li>
            <a className="pc-pill" href={RESUME} target="_blank" rel="noopener noreferrer">
              Résumé <span aria-hidden="true">↗</span><span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className={`hm-hero${timed ? ' is-timed' : ''}`} aria-labelledby="hero-title" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="hm-intro">
            <p className="hm-role">
              <span>Product Designer &amp; Builder</span>
              <span className="hm-where">
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                  <path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="12" cy="10.2" r="2.3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="sr-only">Currently in </span>{caption}{time && <span className="hm-time">· {time}</span>}
              </span>
              <button type="button" className={`hm-wx${tried ? ' is-tried' : ''}`} onClick={nextWeather} aria-label={`Weather: ${tried ? `trying ${SAY[weather]}` : live ? `${live.temp}°, ${live.words}` : 'clear'}. Show another weather`}>
                <span aria-hidden="true">{tried ? `try: ${SAY[weather]}` : live ? `${live.temp}° ${live.words}` : 'weather'}</span>
                <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M3 8a5 5 0 0 1 8.5-3.5L13 6M13 2.5V6H9.5M13 8a5 5 0 0 1-8.5 3.5L3 10M3 13.5V10h3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </p>
            <h1 id="hero-title" className="hm-name">Michael Bobov</h1>
          </div>
          <HomeDock tab={tab} onTab={onTab} active={active} onActive={setActive} dir={dir} />
          <GlassTabs items={tabItems} here={tab} onPick={pickTab} label="Sections" className="hm-tabs" />
          {clock && <span className="hm-clock" style={{ left: clock.x, top: clock.y } as CSSProperties} aria-hidden="true">{clock.text}</span>}
        </section>
      </main>
    </div>
  );
}
