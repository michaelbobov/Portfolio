'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import HomeDock from '@/app/components/HomeDock';
import { AboutPanel, BarMenu, DeskIcons, DesktopMenu, Folder, MissionControl, PageWindow, SkyPanel, Spotlight, SunDial, type Found, type MenuItem, type SkyFacts } from '@/app/components/HomeOS';
import SkyFlow from '@/app/components/SkyFlow';
import WeatherLayer, { type Weather } from '@/app/components/WeatherLayer';
import { RESUME } from '@/app/components/Site';
import { ALL_ITEMS, START, TABS, rememberVisit, type DockItem } from '@/app/data/dock';
import { moonPhase, skyBodies, skyPhase, sunElevation } from '@/app/data/sun';

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
// (three ways round the projects, to compare, ?nav=: the dock, its arrows saying where they go ("dock", the
// default); the menu bar's sections as menus ("menus"); the sections as folders on the desktop ("folders"))
export type Nav = 'dock' | 'menus' | 'folders';
type Props = { caption: string; timeZone: string; lat: number; lon: number; scenes: Scenes; phase0: number; live: Live; children?: ReactNode };
// (the pages that open as windows on the desktop, and what each window is called)
const PAGES: Record<string, string> = { '/work': 'Work', '/side-projects': 'Side projects', '/about': 'About me' };
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

export default function HomeShell({ caption, timeZone, lat, lon, scenes, phase0, live, children }: Props) {
  // (the previews, from the address: ?weather= tries one; ?hour=21 starts the sky at that hour there; ?nav=menus
  // or folders tries another way round the projects; ?dock=row the dock as one row of the work)
  const sp = useSearchParams();
  const w = sp?.get('weather') ?? '';
  const asked: Weather | undefined = (['clear', 'cloudy', 'fog', 'rain', 'snow'] as string[]).includes(w) ? (w as Weather) : undefined;
  const hs = sp?.get('hour') ?? '';
  const hour = /^\d{1,2}(\.\d+)?$/.test(hs) ? Number(hs) : undefined;
  const nv = sp?.get('nav');
  const nav: Nav = nv === 'menus' || nv === 'folders' ? nv : 'dock';
  const row = sp?.get('dock') === 'row';
  // (the page open as a window over the desktop, if any)
  const pathname = usePathname() ?? '/';
  const pageTitle = PAGES[pathname];
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
  // (where the sun is, or the moon by night: for the sun dial, and for the windows' shadows, which fall away
  // from it, longer as it gets lower, softer by moonlight)
  const [sky, setSky] = useState({ p: 0.5, up: true, f: 0.5, at: 0, lx: 0, ly: 30, ls: 1 });
  const update = useCallback(() => {
    if (!timed) return;
    const d = at();
    setPhase(skyPhase(sunElevation(d, lat, lon)));
    const b = skyBodies(d, lat, lon), l = b.up ? b.sun : b.moon;
    setSky({ p: b.up ? b.day : b.night, up: b.up, f: moonPhase(d), at: d.getTime(), lx: Math.max(-40, Math.min(40, (0.5 - l.x) * 72)), ly: 16 + Math.max(0, Math.min(0.7, l.y)) * 42, ls: b.up ? 1 : 0.6 });
  }, [timed, at, lat, lon]);
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
    if ((e.target as HTMLElement).closest('a, button, .hm-dock, .hm-win, .hm-float, .os-bar, .os-desk, .os-folder')) return;
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
  // (the same menu, opened from the sky by a right-click, or from his mark as the system's menu)
  const [menuKind, setMenuKind] = useState<'desk' | 'system'>('desk');
  const [spot, setSpot] = useState(false);
  const [saver, setSaver] = useState(false);
  // Mission Control: every project at once (the button at the dock's right end, F3, ⌃↑, or the menu)
  const [mc, setMc] = useState(false);
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
    if ((e.target as HTMLElement).closest('a, button, input, .hm-win, .hm-dock, .hm-float, .os-bar, .os-desk, .os-folder')) return;
    e.preventDefault();
    setMenuKind('desk');
    setMenuAt({ x: e.clientX, y: e.clientY });
  };
  // (the Sky panel: open, folding back into the signature for a moment, or closed)
  const [skyState, setSkyState] = useState<'closed' | 'open' | 'closing'>('closed');
  const skyOpen = skyState === 'open';
  const skyT = useRef(0);
  const closeSky = useCallback(() => {
    setSkyState((st) => (st === 'open' ? 'closing' : st));
    window.clearTimeout(skyT.current);
    skyT.current = window.setTimeout(() => setSkyState((st) => (st === 'closing' ? 'closed' : st)), 190);
  }, []);
  // Play the day: the whole day goes by as a time-lapse, twenty-four hours in nine seconds, the clouds racing,
  // the sun and the moon crossing, the clock in the menu bar running; then it's back where it was. Anything
  // pressed stops it. (With reduced motion, it doesn't run.)
  const [playing, setPlaying] = useState(false);
  const playDay = useCallback(() => {
    if (!timed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearTimeout(glideWait.current); cancelAnimationFrame(glide.current);
    closeSky(); setPlaying(true);
    root.current?.setAttribute('data-scrub', '');
    const from = base.current, t0 = performance.now(), ms = 9000;
    let raf = 0;
    const end = () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointerdown', end, true); window.removeEventListener('keydown', end, true);
      offset.current = from; update(); setScrubbed(null); setPlaying(false);
      root.current?.removeAttribute('data-scrub');
    };
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      offset.current = from + 24 * e;
      boost.current = Math.max(boost.current, 2 + 7 * Math.sin(Math.PI * k));
      update();
      setScrubbed(hourWeather(at().getTime()));
      if (k < 1) raf = requestAnimationFrame(step); else end();
    };
    raf = requestAnimationFrame(step);
    window.addEventListener('pointerdown', end, true); window.addEventListener('keydown', end, true);
  }, [timed, update, at, hourWeather, closeSky]);
  // (the system's menu, from his mark: the machine's own things)
  const system: MenuItem[] = [
    { label: 'About MichaelOS', run: () => setAboutOpen(true) },
    'sep',
    { label: 'Find', hint: '/', run: () => setSpot(true) },
    { label: 'All work', hint: 'F3', run: () => setMc(true) },
    'sep',
    ...(timed ? [{ label: 'Play the day', run: playDay }] : []),
    { label: 'Start screensaver', run: () => setSaver(true) },
    'sep',
    { label: 'Copy link to this page', run: () => { navigator.clipboard?.writeText(window.location.origin).catch(() => {}); } },
  ];
  const menu: MenuItem[] = [
    ...(timed ? [
      { label: 'Daytime', run: () => showTime(findPhase(0)) },
      { label: 'Golden hour', run: () => showTime(findPhase(1)) },
      { label: 'Dusk', run: () => showTime(findPhase(2)) },
      { label: 'Night', run: () => showTime(findPhase(3)) },
    ] : []),
    ...(previewing ? [{ label: 'Back to the live sky', run: backToLive }] : []),
    'sep',
    { label: 'All work', hint: 'F3', run: () => setMc(true) },
    ...(timed ? [{ label: 'Play the day', run: playDay }] : []),
    { label: 'Start screensaver', run: () => setSaver(true) },
    { label: 'Find', hint: '/', run: () => setSpot(true) },
    { label: 'Copy link to this page', run: () => { navigator.clipboard?.writeText(window.location.origin).catch(() => {}); } },
    'sep',
    { label: 'About MichaelOS', run: () => setAboutOpen(true) },
  ];
  // Spotlight: the projects, then the pages
  const found: Found[] = [
    ...ALL_ITEMS.filter((d) => d.id !== START.id).map((d) => ({
      // (what each is, by its section: a case study, a side project, or one of his pages)
      id: d.id, name: d.name, icon: d.id,
      kind: TABS[0].items.includes(d) ? (d.href ? 'Case study' : 'Case study, soon') : TABS[1].items.includes(d) ? 'Side project' : d.id === 'resume' ? 'PDF' : 'Page',
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

  // (the menus way round: which section's menu is open, and where; the folders way round: which folder)
  const [drop, setDrop] = useState<{ i: number; left: number } | null>(null);
  const [folder, setFolder] = useState<number | null>(null);
  const closeDrop = useCallback(() => setDrop(null), []);
  const closeFolder = useCallback(() => setFolder(null), []);
  const openDrop = (i: number, el: HTMLElement) => setDrop({ i, left: el.offsetLeft });

  // (the clock in the menu bar runs with the drag, the glide back, the screensaver and the played day)
  const shown = clock || playing ? at() : null;
  const barTime = shown ? hm(shown) : time ? hm(at()) : '';
  const barDay = shown ? day(shown) : time ? day(at()) : '';

  // (what the Sky panel says: sunrise and sunset there on the day shown, found by walking its hours; the moon
  // by its phase; the weather as it is, or as it's being tried)
  const facts: SkyFacts | null = skyState !== 'closed' ? (() => {
    const d = at(), h = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(d)) + d.getMinutes() / 60;
    const start = d.getTime() - h * H;
    let rise = '', set = '', prev = sunElevation(new Date(start), lat, lon);
    for (let m = 5; m <= 24 * 60; m += 5) {
      const t = new Date(start + m * 60000), e = sunElevation(t, lat, lon);
      if (prev < 0 && e >= 0 && !rise) rise = hm(t);
      if (prev >= 0 && e < 0 && !set) set = hm(t);
      prev = e;
    }
    const f = moonPhase(d), lit = Math.round(((1 - Math.cos(2 * Math.PI * f)) / 2) * 100);
    const moon = f < 0.03 || f > 0.97 ? 'New' : f < 0.22 ? 'Waxing crescent' : f < 0.28 ? 'First quarter' : f < 0.47 ? 'Waxing gibbous' : f < 0.53 ? 'Full' : f < 0.72 ? 'Waning gibbous' : f < 0.78 ? 'Last quarter' : 'Waning crescent';
    return {
      place: caption, time: hm(d), date: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone }).format(d),
      rise: rise || '—', set: set || '—', moon: `${moon}, ${lit}% lit`,
      weather: tried ? `Trying ${tried}` : live ? `${live.temp}°, ${live.words}` : weather,
      phase, previewing, tried, current: live?.kind ?? 'clear', kinds: STATES.map((k) => ({ id: k, label: k[0].toUpperCase() + k.slice(1), icon: glyph(k, k === 'clear' && phase > 2.45) })),
    };
  })() : null;

  return (
    <div ref={root} className={`pc hm${night ? ' is-night' : ''}${saver ? ' is-saver' : ''}`} style={{ '--nt': nt.toFixed(3), '--sg': sg.toFixed(3), '--sn': sn.toFixed(3), '--o1': opacity(1).toFixed(3), '--o2': opacity(2).toFixed(3), '--o3': opacity(3).toFixed(3), '--lx': `${sky.lx.toFixed(1)}px`, '--ly': `${sky.ly.toFixed(1)}px`, '--ls': sky.ls } as CSSProperties} data-nav={nav}>
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

      {/* the menu bar: his mark (the system's menu: About MichaelOS), the site's sections, Contact, the résumé;
          at the right Find (labelled, so it's found), the weather, and the time there with the sun dial. The bar
          is the site and the dock below is the work, so nothing here repeats the dock (all the work at once is
          on F3, the right-click menu and Find). In the menus way round, the sections open as menus */}
      <header className="os-bar">
        <nav className="os-bar-l" aria-label="Main">
          <button type="button" className="os-mi os-mark" aria-label="MichaelOS menu" aria-haspopup="menu" aria-expanded={!!menuAt && menuKind === 'system'} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setMenuKind('system'); setMenuAt(menuAt && menuKind === 'system' ? null : { x: r.left, y: r.bottom + 3 }); }}>
            <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
          </button>
          {TABS.map((t, ti) => (nav === 'menus' ? (
            <button key={t.id} type="button" className={`os-mi${drop?.i === ti ? ' is-open' : ''}`} aria-haspopup="menu" aria-expanded={drop?.i === ti}
              onClick={(e) => (drop?.i === ti ? closeDrop() : openDrop(ti, e.currentTarget))}
              onPointerEnter={(e) => { if (drop && drop.i !== ti) openDrop(ti, e.currentTarget); }}>{t.label}</button>
          ) : <Link key={t.id} className="os-mi" href={t.href} aria-current={pathname === t.href ? 'page' : undefined}>{t.label}</Link>))}
          <Link className="os-mi" href="/about#contact" onClick={(e) => {
            // (About already open: its window scrolls to Contact instead of the page reloading)
            if (pathname !== '/about') return;
            e.preventDefault(); window.history.replaceState(null, '', '/about#contact');
            window.dispatchEvent(new CustomEvent('os:part', { detail: 'contact' }));
          }}>Contact</Link>
          <a className="os-mi" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="os-out" aria-hidden="true">↗</span><span className="sr-only"> (PDF, opens in a new tab)</span></a>
        </nav>
        <div className="os-bar-r">
          <button type="button" className="os-mi os-find" onClick={openSpot} aria-label="Find a project" aria-keyshortcuts="/" title="Find a project or page (/)">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L19.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <span className="os-find-t" aria-hidden="true">Find</span>
          </button>
          <button type="button" className={`os-mi os-wx is-wide${tried ? ' is-tried' : ''}`} onClick={nextWeather} title={tried ? 'Trying another weather: click for the next' : 'The weather in Seattle: click to try another'} aria-label={`Weather: ${tried ? `trying ${SAY[weather]}` : live ? `${live.temp}°, ${live.words}` : 'clear'}. Show another weather`}>
            <span className="os-wx-g" key={`${weather}-${night}`}>{glyph(weather, night)}</span><span aria-hidden="true">{tried ? SAY[weather] : live ? `${live.temp}°` : ''}</span>
          </button>
        </div>
        {/* his signature, in the middle of the bar: where the sun (or the moon) is on its way across the sky, and
            the time there; it opens the Sky panel */}
        <button type="button" className={`os-mi os-sig is-wide${previewing || clock || playing ? ' is-away' : ''}${skyOpen ? ' is-open' : ''}`} aria-haspopup="dialog" aria-expanded={skyOpen} onClick={() => (skyOpen ? closeSky() : setSkyState('open'))} title={previewing ? 'Showing another time' : `The time in ${caption}, and where the ${sky.up ? 'sun' : 'moon'} is`}>
          {timed && <SunDial p={sky.p} up={sky.up} f={sky.f} onLight={!night} />}<span className="os-day">{barDay} </span>{barTime}
        </button>
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className={`hm-hero${timed ? ' is-timed' : ''}`} aria-labelledby={pageTitle ? undefined : 'hero-title'} aria-label={pageTitle ? 'Desktop' : undefined} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onContextMenu={onContext}>
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
            {/* (his name is the page's heading on the desktop; with a page window up, the window's is) */}
            {pageTitle ? <p className="hm-name">Michael Bobov</p> : <h1 id="hero-title" className="hm-name">Michael Bobov</h1>}
          </div>
          <HomeDock tab={tab} onTab={onTab} active={active} onActive={setActive} dir={dir} weather={weather} row={row} />
          {nav === 'folders' && <DeskIcons tabs={TABS} resume={RESUME} onOpen={(fi) => setFolder(fi)} />}
          {clock && <span className={`hm-clock${saver ? ' is-saver' : ''}`} style={{ left: clock.x, top: clock.y } as CSSProperties} aria-hidden="true">{clock.text}</span>}
        </section>
        {/* a page, open as a window over the desktop */}
        {pageTitle && <PageWindow title={pageTitle} path={pathname}>{children}</PageWindow>}
      </main>
      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <DesktopMenu at={menuAt} items={menuKind === 'system' ? system : menu} onClose={() => setMenuAt(null)} />
      {facts && <SkyPanel open={skyOpen} closing={skyState === 'closing'} facts={facts} p={sky.p} up={sky.up} f={sky.f} at={sky.at || Date.now()} timeZone={timeZone} lat={lat} lon={lon}
        onDay={(ms) => showTime((ms - Date.now()) / H)} onClose={closeSky}
        onPhase={(n) => showTime(findPhase(n))} onWeather={(k) => setTried(k === (live?.kind ?? 'clear') ? null : (k as Weather))}
        onPlay={playDay} onLive={() => { backToLive(); setTried(null); }} />}
      <Spotlight open={spot} items={found} onClose={() => setSpot(false)} />
      <BarMenu tab={drop ? TABS[drop.i] : null} left={drop?.left ?? 0} onPick={pickFromMc} onClose={closeDrop} />
      <Folder tab={folder === null ? null : TABS[folder]} title={folder === null ? '' : ['Case studies', 'Side projects', 'About me'][folder]} onPick={(d) => { setFolder(null); pickFromMc(d); }} onClose={closeFolder} />
      <MissionControl open={mc} sections={TABS.map((t) => ({ id: t.id, label: t.label, items: t.items }))} onPick={pickFromMc} onClose={() => setMc(false)} />
    </div>
  );
}
