'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import HomeDock from '@/app/components/HomeDock';
import { AboutPanel, DesktopMenu, MissionControl, Spotlight, type Found, type MenuItem } from '@/app/components/HomeOS';
import SkyFlow from '@/app/components/SkyFlow';
import WeatherLayer, { type Weather } from '@/app/components/WeatherLayer';
import { RESUME } from '@/app/components/Site';
import { ALL_ITEMS, START, TABS, rememberVisit, type DockItem } from '@/app/data/dock';
import { skyPhase, sunElevation } from '@/app/data/sun';

// The homepage (page.tsx hands it where he is and the weather there), as a desktop (OS-PORTFOLIO.md): the
// sky of that place at its real time of day and in its real weather, with a menu bar across the top (his
// mark, the system's menu, opens About this desktop; then the site's pages and the résumé; at the right
// Search, Mission Control, the weather there and the clock there), what he does and his name, and the window
// and the dock (HomeDock). The weather in the menu bar is a button: it tries the other weathers in turn, then
// goes back to the real one. The sky: up to four paintings of the place (day, golden hour, dusk, night),
// crossfaded by where the sun is there now (data/sun.ts), checked each minute, with a sun and a moon that
// travel across it (SkyFlow). The easter egg: drag across the sky and the day runs with you (a full day
// across the screen's width) as a time-lapse, the clouds racing, the sun and moon crossing, the clock in the
// menu bar running with it, the weather following the real forecast for each hour; drag up or down to change
// the weather yourself. Let go and it glides back to now. The words turn from ink to cream as dusk goes into
// night. Like an operating system: right-click on the sky for a menu (other times of day, back to the live
// sky, the screensaver); / or ⌘K opens Spotlight; F3 opens Mission Control, all the work at once; the
// screensaver runs the day by on its own until anything moves. Styles: home.css (.os-bar for the menu bar).
export type Scenes = { dusk: string; day?: string; golden?: string; night?: string; flow?: string[] };
type Live = { temp: number; words: string; kind: Weather; hours?: { t: number; kind: Weather; temp: number }[] } | null;
type Props = { caption: string; timeZone: string; lat: number; lon: number; scenes: Scenes; phase0: number; live: Live; weather?: Weather; hour?: number };
// (the weather button in the top line steps through these, then back to the real weather)
const STATES: Weather[] = ['clear', 'cloudy', 'rain', 'snow', 'fog'];
const SAY: Record<Weather, string> = { clear: 'clear', cloudy: 'cloudy', fog: 'foggy', rain: 'raining', snow: 'snowing' };
const ORDER = ['day', 'golden', 'dusk', 'night'] as const;
// (the menu bar's weather: a small glyph for each, the sun turning to the moon at night)
const glyph = (w: Weather, night: boolean) => {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const cloud = <path {...p} d="M6.5 15.5h8.2a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.8 1.3A2.7 2.7 0 0 0 6.5 15.5Z" />;
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      {w === 'clear' ? (night ? <path {...p} d="M15.5 12.6A6 6 0 0 1 7.4 4.5a6 6 0 1 0 8.1 8.1Z" /> : <><circle {...p} cx="10" cy="10" r="3.4" /><path {...p} d="M10 2.6v1.6M10 15.8v1.6M2.6 10h1.6M15.8 10h1.6M4.8 4.8l1.1 1.1M14.1 14.1l1.1 1.1M4.8 15.2l1.1-1.1M14.1 5.9l1.1-1.1" /></>)
        : w === 'cloudy' ? cloud
        : w === 'rain' ? <>{cloud}<path {...p} d="M8 17.6l-.6 1.2M11 17.6l-.6 1.2M14 17.6l-.6 1.2" /></>
        : w === 'snow' ? <path {...p} d="M10 2.8v14.4M3.8 6.4l12.4 7.2M3.8 13.6l12.4-7.2M8.2 3.8 10 5.4l1.8-1.6M8.2 16.2 10 14.6l1.8 1.6" />
        : <path {...p} d="M3.5 7.5h13M2.5 10.5h15M4.5 13.5h11" />}
    </svg>
  );
};
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
  // (the window opens on its Welcome tab, the studio painting; pointing at an app shows that app)
  const [active, setActive] = useState(START.id);
  const onTab = useCallback((i: number, d: number) => { setDir(d); setTab(i); setActive(TABS[i].featured); }, []);

  // ---------- the sky ----------
  const timed = !!(scenes.day && scenes.golden && scenes.night);
  const [phase, setPhase] = useState(timed ? phase0 : 2);
  const offset = useRef(0); // hours ahead of now (the drag)
  const base = useRef(0); // (a preview of another hour, ?hour=: where the drag returns to)
  const [clock, setClock] = useState<{ text: string; x: number; y: number } | null>(null);
  const [time, setTime] = useState('');
  const fmt = useCallback((d: Date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(d).toLowerCase(), [timeZone]);
  // (the menu bar's clock, as a Mac's: "Mon Nov 23  2:26 PM", there)
  const day = useCallback((d: Date) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone }).format(d).replace(',', ''), [timeZone]);
  const hm = useCallback((d: Date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(d), [timeZone]);
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
  // (how fast the clouds run, over their own drift: dragging the day along runs them like a time-lapse, in
  // step with how fast the hours are going by, and backwards when the day is dragged back; SkyFlow lets it
  // settle back on its own)
  const boost = useRef(0);
  const lastScrub = useRef({ at: 0, off: 0 });
  const scrubTo = (dx: number, dy: number, w: number, w0: number) => {
    offset.current = (drag.current?.base ?? 0) - (dx / w) * 24;
    const now = performance.now(), ls = lastScrub.current, dt = Math.max(16, now - ls.at) / 1000;
    if (ls.at && now - ls.at < 200) {
      const v = Math.max(-14, Math.min(14, ((offset.current - ls.off) / dt) * 2.2));
      if (Math.abs(v) > Math.abs(boost.current) * 0.6) boost.current = v; else boost.current *= 0.6;
    }
    lastScrub.current = { at: now, off: offset.current };
    update();
    const steps = Math.trunc(-dy / 90);
    const kind = steps ? STATES[(((w0 + steps) % STATES.length) + STATES.length) % STATES.length] : hourWeather(at().getTime()) ?? tried ?? live?.kind ?? 'clear';
    setScrubbed(kind);
    return kind;
  };
  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!timed || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('a, button, .hm-dock, .hm-win, .hm-float, .os-bar')) return;
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

  // ---------- the OS pieces (HomeOS) ----------
  const router = useRouter();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuAt, setMenuAt] = useState<{ x: number; y: number } | null>(null);
  const [spot, setSpot] = useState(false);
  const [saver, setSaver] = useState(false);
  // Mission Control: every project at once (the button at the dock's right end, F3, ⌃↑, or the menu)
  const [mc, setMc] = useState(false);
  const openMc = useCallback(() => setMc(true), []);
  const openSpot = useCallback(() => setSpot(true), []);
  const pickFromMc = (d: DockItem) => {
    setMc(false);
    if (d.href) rememberVisit(d.id);
    if (d.href && d.external) window.open(d.href, '_blank', 'noopener');
    else if (d.href) router.push(d.href);
    else { const s = TABS.findIndex((t) => t.items.some((x) => x.id === d.id)); if (s >= 0) onTab(s, s > tab ? 1 : -1); setActive(d.id); }
  };
  const [previewing, setPreviewing] = useState(hour !== undefined);
  // (the next time, from now, that the sky reaches a phase: 0 day, 1 golden hour, 2 dusk, 3 night)
  const findPhase = useCallback((target: number) => {
    for (let h = 0.25; h < 30; h += 0.25) {
      const ph = skyPhase(sunElevation(new Date(Date.now() + h * H), lat, lon));
      if (Math.abs(ph - target) < 0.1) return h;
    }
    return 0;
  }, [lat, lon]);
  const showTime = (h: number) => { window.clearTimeout(glideWait.current); cancelAnimationFrame(glide.current); base.current = offset.current = h; update(); setTime(fmt(at())); setPreviewing(true); };
  const backToLive = () => { base.current = offset.current = 0; update(); setTime(fmt(at())); setPreviewing(false); };
  const onContext = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button, input, .hm-win, .hm-dock, .hm-float, .os-bar')) return;
    e.preventDefault();
    setMenuAt({ x: e.clientX, y: e.clientY });
  };
  const menu: MenuItem[] = [
    ...(timed ? [
      { label: 'Daytime', run: () => showTime(findPhase(0)) },
      { label: 'Golden hour', run: () => showTime(findPhase(1)) },
      { label: 'Dusk', run: () => showTime(findPhase(2)) },
      { label: 'Night', run: () => showTime(findPhase(3)) },
    ] : []),
    ...(previewing ? [{ label: 'Back to the live sky', run: backToLive }] : []),
    'sep',
    { label: 'Mission Control', hint: 'F3', run: () => setMc(true) },
    { label: 'Start screensaver', run: () => setSaver(true) },
    { label: 'Spotlight', hint: '/', run: () => setSpot(true) },
    { label: 'Copy link to this page', run: () => { navigator.clipboard?.writeText(window.location.origin).catch(() => {}); } },
    'sep',
    { label: 'About this desktop', run: () => setAboutOpen(true) },
  ];
  // Spotlight: the projects, then the pages
  const found: Found[] = [
    ...ALL_ITEMS.filter((d) => d.id !== START.id).map((d) => ({
      id: d.id, name: d.name, kind: d.href ? (d.external ? 'Website' : d.cta.includes('case study') ? 'Case study' : 'Page') : 'Coming soon', icon: d.id,
      open: () => {
        if (d.href) rememberVisit(d.id);
        if (d.href && d.external) window.open(d.href, '_blank', 'noopener');
        else if (d.href) router.push(d.href);
        else { const s = TABS.findIndex((t) => t.items.some((x) => x.id === d.id)); if (s >= 0) { onTab(s, s > tab ? 1 : -1); } setActive(d.id); }
      },
    })),
    { id: 'p-work', name: 'All work', kind: 'Page', open: () => router.push('/work') },
    { id: 'p-side', name: 'All side projects', kind: 'Page', open: () => router.push('/side-projects') },
    { id: 'p-about', name: 'About me', kind: 'Page', open: () => router.push('/about') },
  ];
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable="true"]');
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); setSpot(true); }
      else if (e.key === 'F3' || (e.key === 'ArrowUp' && e.ctrlKey)) { e.preventDefault(); setMc((v) => !v); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  // the screensaver: the windows fade away and the day runs by on its own, about two hours a second, the
  // weather following the real hours; anything (a move, a key, a click, a scroll) brings it all back to now
  useEffect(() => {
    if (!saver) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSaver(false); return; }
    let raf = 0, last = performance.now();
    const t0 = last;
    root.current?.setAttribute('data-scrub', '');
    const tick = (now: number) => {
      offset.current += ((now - last) / 1000) * 2;
      boost.current = Math.max(boost.current, 3.2);
      last = now;
      update();
      setScrubbed(hourWeather(at().getTime()));
      setClock({ text: fmt(at()), x: window.innerWidth / 2, y: window.innerHeight - 72 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const stop = () => { if (performance.now() - t0 > 600) setSaver(false); };
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    evs.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((ev) => window.removeEventListener(ev, stop));
      offset.current = base.current; update();
      setScrubbed(null); setClock(null);
      root.current?.removeAttribute('data-scrub');
    };
  }, [saver, update, at, fmt, hourWeather]);

  // which two paintings show, and how much of the upper one
  const i = Math.min(Math.floor(phase), 2), k = phase - i;
  const opacity = (j: number) => (!timed ? (ORDER[j] === 'dusk' ? 1 : 0) : j === i ? 1 : j === i + 1 ? k : 0);
  const night = timed && phase > 2.45;
  // (the words turn cream once the sky is half dark; the change itself is a half-second fade, home.css, so
  // they never linger at a grey that reads on neither sky)
  const nt = night ? 1 : 0;
  // (the studio painting in the window takes the same light: golden hour coming in from phase 0.3 to 1, night
  // from 1.8 to 2.8, so dragging the sky turns the room from day to night too)
  const sg = timed ? Math.min(1, Math.max(0, (phase - 0.3) / 0.7)) : 1;
  const sn = timed ? Math.min(1, Math.max(0, (phase - 1.8) / 1)) : 0;

  // (the clock in the menu bar runs with the drag, the glide back and the screensaver)
  const shown = clock ? at() : null;
  const barTime = shown ? hm(shown) : time ? hm(at()) : '';
  const barDay = shown ? day(shown) : time ? day(at()) : '';

  return (
    <div ref={root} className={`pc hm${night ? ' is-night' : ''}${saver ? ' is-saver' : ''}`} style={{ '--nt': nt.toFixed(3), '--sg': sg.toFixed(3), '--sn': sn.toFixed(3), '--o1': opacity(1).toFixed(3), '--o2': opacity(2).toFixed(3), '--o3': opacity(3).toFixed(3) } as CSSProperties}>
      {/* the sky: the place's paintings, crossfaded by the time of day */}
      <div className="hm-sky" aria-hidden="true">
        {ORDER.map((p, j) => scenes[p] && (
          <div key={p} className={`hm-sky-${p}`} style={{ backgroundImage: `url(${scenes[p]})`, opacity: opacity(j) } as CSSProperties} />
        ))}
        {/* the same paintings on a canvas, where only the sea of clouds moves (Seattle's four, which its mask
            fits); it fades in over the still ones once it's ready */}
        {timed && <SkyFlow scenes={scenes.flow ?? ORDER.map((p) => scenes[p] as string)} pair={[i, Math.min(i + 1, 3), k]} boost={boost} hours={offset} lat={lat} lon={lon} />}
        {/* mist drifting over the sea of clouds, two layers at different heights and speeds */}
        <span className="hm-wisps is-far" />
        <span className="hm-wisps is-near" />
        <WeatherLayer weather={weather} night={night} />
      </div>

      {/* the menu bar: his mark (the system's menu, as the Apple is: About this desktop), the site's pages and
          the résumé; at the right, as a Mac's status items, Search, Mission Control, the weather and the clock */}
      <header className="os-bar">
        <nav className="os-bar-l" aria-label="Main">
          <button type="button" className="os-mi os-mark" aria-label="About this desktop" aria-haspopup="dialog" onClick={() => setAboutOpen(true)}>
            <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
          </button>
          <Link className="os-mi" href="/work">Work</Link>
          <Link className="os-mi" href="/side-projects">Side Projects</Link>
          <Link className="os-mi" href="/about">About</Link>
          <a className="os-mi" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="os-out" aria-hidden="true">↗</span><span className="sr-only"> (PDF, opens in a new tab)</span></a>
        </nav>
        <div className="os-bar-r">
          <button type="button" className="os-mi is-icon is-wide" onClick={openSpot} aria-label="Search projects (/)" title="Search (/)">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L19.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className="os-mi is-icon is-wide" onClick={openMc} aria-label="Show all work (F3)" title="All work (F3)">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3.5" y="5" width="7.5" height="6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" /><rect x="13" y="5" width="7.5" height="6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" /><rect x="3.5" y="13" width="7.5" height="6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" /><rect x="13" y="13" width="7.5" height="6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" /></svg>
          </button>
          <button type="button" className={`os-mi os-wx is-wide${tried ? ' is-tried' : ''}`} onClick={nextWeather} title={tried ? 'Trying another weather: click for the next' : 'The weather in Seattle: click to try another'} aria-label={`Weather: ${tried ? `trying ${SAY[weather]}` : live ? `${live.temp}°, ${live.words}` : 'clear'}. Show another weather`}>
            {glyph(weather, night)}<span aria-hidden="true">{tried ? SAY[weather] : live ? `${live.temp}°` : ''}</span>
          </button>
          <span className={`os-mi os-clock${previewing || clock ? ' is-away' : ''}`} title={previewing ? 'Showing another time: right-click the sky to go back to now' : `The time in ${caption}`}>
            <span className="os-day">{barDay} </span>{barTime}
          </span>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className={`hm-hero${timed ? ' is-timed' : ''}`} aria-labelledby="hero-title" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onContextMenu={onContext}>
          <div className="hm-intro">
            <p className="hm-role">
              <span>Product Designer &amp; Builder</span>
              <span className="hm-where">
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                  <path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="12" cy="10.2" r="2.3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="sr-only">Currently in </span>{caption}
              </span>
            </p>
            <h1 id="hero-title" className="hm-name">Michael Bobov</h1>
          </div>
          <HomeDock tab={tab} onTab={onTab} active={active} onActive={setActive} dir={dir} weather={weather} />
          {clock && <span className={`hm-clock${saver ? ' is-saver' : ''}`} style={{ left: clock.x, top: clock.y } as CSSProperties} aria-hidden="true">{clock.text}</span>}
        </section>
      </main>
      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <DesktopMenu at={menuAt} items={menu} onClose={() => setMenuAt(null)} />
      <Spotlight open={spot} items={found} onClose={() => setSpot(false)} />
      <MissionControl open={mc} sections={TABS.map((t) => ({ id: t.id, label: t.label, items: t.items }))} onPick={pickFromMc} onClose={() => setMc(false)} />
    </div>
  );
}
