'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import DockIcon from '@/app/components/DockIcon';
import { RESUME } from '@/app/components/Site';
import type { DockItem, DockTab } from '@/app/data/dock';
import { moonPhase, sunElevation } from '@/app/data/sun';

// The homepage's operating-system pieces (HomeShell opens them; styles: home.css .os-*):
// - AboutPanel: "About this desktop", from his mark at the top left, as a Mac's About This Mac.
// - DesktopMenu: right-click on the sky: preview the sky at another time, go back to the live sky, start
//   the screensaver, copy the link, About. Never over the windows, the dock or a link.
// - Spotlight: press / (or ⌘K) to find a project or a page by name and open it.
// - MissionControl ("All work"): all the work at once, every project a little window (its still; its
//   recording plays while pointed at), in rows by section; a click opens it.
// - BarMenu (the "menus" way round, ?nav=menus): the menu bar's Work, Side Projects and About open as menus,
//   each project a row with its icon, name and what it is, and the section's page at the foot.
// - DeskIcons and Folder (the "folders" way round, ?nav=folders): a folder for each section on the desktop,
//   and the résumé as a file; a folder opens as a window listing its projects.
// - SkyPanel: the menu bar's signature, the sun dial and the clock in its middle, opens this: MichaelOS's own
//   control, over the world rather than the machine. The time there, sunrise and sunset, tonight's moon, the
//   weather; show the sky at another time of day or in another weather; play the whole day as a time-lapse.
// - PageWindow: Work, Side Projects and About, each open as a big window over the desktop (the (os) layout keeps
//   the desktop as you go between them). It rises in as a window does; its close sinks it behind the dome and
//   goes home; its enlarge fills the screen under the menu bar. Its body scrolls; an address with a #part
//   (/about#contact) scrolls to it.
// Each closes with Escape or a click outside, and gives focus back where it was.

const useEscape = (on: boolean, close: () => void) => {
  useEffect(() => {
    if (!on) return;
    const k = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [on, close]);
};

export function AboutPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const ring = useId();
  useEscape(open, onClose);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="os-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* (laid out as the maker's mark on the base of a piece of porcelain: a cobalt stamp with his mark and
          the edition round it, then the maker's details, rather than as a Mac's About This Mac) */}
      <div ref={ref} className="os-about" role="dialog" aria-modal="true" aria-labelledby="os-about-title" tabIndex={-1}>
        <span className="os-ctl os-about-ctl">
          <button type="button" className="os-ctl-b" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><path d="M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
        </span>
        <div className="os-about-head">
          <span className="os-stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <defs><path id={ring} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
              <circle cx="50" cy="50" r="47.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth="0.9" />
              <text className="os-stamp-text"><textPath href={`#${ring}`} textLength="236" lengthAdjust="spacing">MICHAELOS · SEATTLE EDITION ·</textPath></text>
            </svg>
            <span className="os-stamp-mark" />
          </span>
          <div>
            <h2 id="os-about-title" className="os-about-title">MichaelOS</h2>
            <p className="os-about-ver">Seattle edition</p>
          </div>
        </div>
        <dl className="os-about-specs">
          <div><dt>Designer</dt><dd>Michael Bobov</dd></div>
          <div><dt>Based in</dt><dd>Seattle, WA</dd></div>
          <div className="is-wide"><dt>Role</dt><dd>Product designer &amp; builder</dd></div>
        </dl>
        <p className="os-about-why">
          The nesting dolls are a nod to my heritage. I also think of design as a process of uncovering layers.
        </p>
        <div className="os-about-actions">
          <Link className="os-btn is-primary" href="/about">More about me</Link>
          <a className="os-btn" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="sr-only"> (PDF, opens in a new tab)</span></a>
        </div>
      </div>
    </div>
  );
}

export type MenuItem = { label: string; run: () => void; hint?: string } | 'sep';

export function DesktopMenu({ at, items, onClose }: { at: { x: number; y: number } | null; items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEscape(!!at, onClose);
  // (kept on screen, and focus goes to the first item so the keyboard can use it)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!at) { setPos(null); return; }
    const el = ref.current;
    const w = el?.offsetWidth ?? 220, h = el?.offsetHeight ?? 200;
    setPos({ x: Math.min(at.x, window.innerWidth - w - 8), y: Math.min(at.y, window.innerHeight - h - 8) });
    el?.querySelector<HTMLButtonElement>('button')?.focus();
  }, [at]);
  useEffect(() => {
    if (!at) return;
    const off = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    window.addEventListener('pointerdown', off, true);
    return () => window.removeEventListener('pointerdown', off, true);
  }, [at, onClose]);
  if (!at) return null;
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const bs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const i = bs.indexOf(document.activeElement as HTMLButtonElement);
    bs[(i + (e.key === 'ArrowDown' ? 1 : -1) + bs.length) % bs.length]?.focus();
  };
  return (
    <div ref={ref} className="os-menu" role="menu" aria-label="Desktop" style={{ left: (pos ?? at).x, top: (pos ?? at).y, visibility: pos ? 'visible' : 'hidden' }} onKeyDown={onKey}>
      {items.map((it, i) => it === 'sep' ? <div key={i} className="os-sep" role="separator" /> : (
        <button key={it.label} type="button" role="menuitem" className="os-item" onClick={() => { onClose(); it.run(); }}>
          <span>{it.label}</span>{it.hint && <span className="os-hint">{it.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export type Found = { id: string; name: string; kind: string; icon?: string; open: () => void };

export function Spotlight({ open, items, onClose }: { open: boolean; items: Found[]; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  useEscape(open, onClose);
  useEffect(() => { if (open) { setQ(''); setSel(0); requestAnimationFrame(() => input.current?.focus()); } }, [open]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((it) => `${it.name} ${it.kind}`.toLowerCase().includes(t)) : items;
  }, [q, items]);
  if (!open) return null;
  const go = (it?: Found) => { if (!it) return; onClose(); it.open(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(shown[sel]); }
  };
  return (
    <div className="os-scrim is-light" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="os-spot" role="dialog" aria-modal="true" aria-label="Find">
        <div className="os-spot-field">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Find a project or page"
            aria-label="Find a project or page"
            role="combobox"
            aria-expanded="true"
            aria-controls="os-spot-list"
            aria-activedescendant={shown[sel] ? `os-spot-${shown[sel].id}` : undefined}
          />
        </div>
        <ul id="os-spot-list" className="os-spot-list" role="listbox">
          {shown.map((it, i) => (
            <li key={it.id} id={`os-spot-${it.id}`} role="option" aria-selected={i === sel} className={`os-spot-row${i === sel ? ' is-sel' : ''}`} onPointerMove={() => setSel(i)} onClick={() => go(it)}>
              {it.icon ? <DockIcon id={it.icon} /> : <span className="os-spot-dot" aria-hidden="true" />}
              <span className="os-spot-name">{it.name}</span>
              <span className="os-spot-kind">{it.kind}</span>
            </li>
          ))}
          {!shown.length && <li className="os-spot-none">Nothing called “{q}” yet.</li>}
        </ul>
      </div>
    </div>
  );
}

// (a project's window in Mission Control plays its recording only while it's pointed at)
const play = (e: RPointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const v = e.currentTarget.querySelector('video');
  if (!v) return;
  if (!v.getAttribute('src')) { v.src = v.dataset.src!; v.load(); }
  v.play().catch(() => {});
};
const pause = (e: RPointerEvent<HTMLElement>) => { e.currentTarget.querySelector('video')?.pause(); };

export function MissionControl({ open, sections, onPick, onClose }: { open: boolean; sections: { id: string; label: string; items: DockItem[] }[]; onPick: (d: DockItem) => void; onClose: () => void }) {
  const first = useRef<HTMLButtonElement | null>(null);
  useEscape(open, onClose);
  useEffect(() => { if (open) requestAnimationFrame(() => first.current?.focus()); }, [open]);
  if (!open) return null;
  let n = 0;
  return (
    <div className="os-mc" role="dialog" aria-modal="true" aria-label="All work" onPointerDown={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('os-mc-row')) onClose(); }}>
      <p className="os-mc-hint">All my work at a glance. Click one to open it; Esc to go back.</p>
      {sections.map((sec) => (
        <section key={sec.id} className="os-mc-row" aria-label={sec.label}>
          <h2 className="os-mc-label">{sec.label}</h2>
          <ul className="os-mc-tiles">
            {sec.items.map((d) => {
              const i = n++;
              const m = d.media;
              return (
                <li key={d.id} style={{ '--i': i } as CSSProperties}>
                  <button ref={i === 0 ? first : undefined} type="button" className="os-mc-win" onClick={() => onPick(d)} onPointerEnter={play} onPointerLeave={pause}>
                    <span className="os-mc-chrome" aria-hidden="true"><i /><i /><i /><DockIcon id={d.id} /><span className="os-mc-name">{d.name}</span></span>
                    <span className={`os-mc-media${m.kind === 'image' && m.fit === 'contain' ? ' is-contain' : ''}${m.kind === 'note' ? ' is-note' : ''}`} aria-hidden="true">
                      {m.kind === 'video' ? (
                        <>
                          <img src={m.poster} alt="" decoding="async" draggable={false} style={{ objectPosition: m.position }} />
                          <video data-src={m.src} muted loop playsInline preload="none" style={{ objectPosition: m.position }} />
                        </>
                      ) : m.kind === 'image' ? (
                        <img src={m.src} alt="" decoding="async" draggable={false} style={{ objectPosition: m.position }} />
                      ) : m.kind === 'note' ? (
                        <span className="os-mc-note">{m.title}</span>
                      ) : null}
                    </span>
                    <span className="os-mc-meta">{d.meta || d.cta}</span>
                    <span className="sr-only">{d.name}: {d.line}{d.external ? ' (opens in a new tab)' : ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------- the menus way round: a section's menu from the menu bar ----------
export function BarMenu({ tab, left, onPick, onClose }: { tab: DockTab | null; left: number; onPick: (d: DockItem) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEscape(!!tab, onClose);
  useEffect(() => {
    if (!tab) return;
    const off = (e: PointerEvent) => { const t = e.target as HTMLElement; if (!ref.current?.contains(t) && !t.closest('.os-bar [aria-haspopup="menu"]')) onClose(); };
    window.addEventListener('pointerdown', off, true);
    return () => window.removeEventListener('pointerdown', off, true);
  }, [tab, onClose]);
  if (!tab) return null;
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const bs = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = bs.indexOf(document.activeElement as HTMLElement);
    bs[(i + (e.key === 'ArrowDown' ? 1 : -1) + bs.length) % bs.length]?.focus();
  };
  return (
    <div ref={ref} className="os-drop" role="menu" aria-label={tab.label} style={{ left }} onKeyDown={onKey}>
      {tab.items.map((d) => (
        <button key={d.id} type="button" role="menuitem" className="os-drop-row" onClick={() => { onClose(); onPick(d); }}>
          <DockIcon id={d.id} />
          <span className="os-drop-text"><span className="os-drop-name">{d.name}</span><span className="os-drop-line">{d.line}</span></span>
          <span className="os-drop-meta">{d.href ? (d.external ? '↗' : '') : 'soon'}</span>
        </button>
      ))}
      <div className="os-sep" role="separator" />
      <Link role="menuitem" className="os-drop-row is-more" href={tab.href} onClick={onClose}>{tab.more} <span aria-hidden="true">→</span></Link>
    </div>
  );
}

// ---------- the folders way round: the sections as folders on the desktop ----------
const FolderGlyph = () => (
  <svg viewBox="0 0 64 52" width="64" height="52" aria-hidden="true" className="os-fold-art">
    <path d="M4 10a5 5 0 0 1 5-5h14l6 6h26a5 5 0 0 1 5 5v4H4Z" className="os-fold-back" />
    <path d="M4 18a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v25a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" className="os-fold-front" />
  </svg>
);
const FileGlyph = () => (
  <svg viewBox="0 0 64 52" width="64" height="52" aria-hidden="true" className="os-fold-art">
    <path d="M18 2h20l12 12v34a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" className="os-file" />
    <path d="M38 2v10a2 2 0 0 0 2 2h10" className="os-file-fold" />
    <rect x="13" y="30" width="22" height="10" rx="2" className="os-file-tag" />
    <text x="24" y="37.6" textAnchor="middle" className="os-file-tagt">PDF</text>
  </svg>
);
export function DeskIcons({ tabs, resume, onOpen }: { tabs: DockTab[]; resume: string; onOpen: (i: number) => void }) {
  const names: Record<string, string> = { work: 'Case studies', side: 'Side projects', about: 'About me' };
  return (
    <ul className="os-desk" aria-label="Desktop">
      {tabs.map((t, i) => (
        <li key={t.id}>
          <button type="button" className="os-desk-item" onClick={() => onOpen(i)} aria-haspopup="dialog">
            <FolderGlyph /><span className="os-desk-name">{names[t.id] ?? t.label}</span>
          </button>
        </li>
      ))}
      <li>
        <a className="os-desk-item" href={resume} target="_blank" rel="noopener noreferrer">
          <FileGlyph /><span className="os-desk-name">Résumé.pdf</span><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}
export function Folder({ tab, title, onPick, onClose }: { tab: DockTab | null; title: string; onPick: (d: DockItem) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEscape(!!tab, onClose);
  useEffect(() => { if (tab) requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('.os-fold-row')?.focus()); }, [tab]);
  if (!tab) return null;
  return (
    <div ref={ref} className="os-folder" role="dialog" aria-label={title}>
      <div className="os-folder-bar">
        <span className="os-ctl"><button type="button" className="os-ctl-b" onClick={onClose} aria-label="Close the folder"><svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></span>
        <span className="os-folder-title">{title}</span>
        <span className="os-folder-count">{tab.items.length} items</span>
      </div>
      <ul className="os-folder-list">
        {tab.items.map((d) => (
          <li key={d.id}>
            <button type="button" className="os-fold-row" onClick={() => onPick(d)}>
              <DockIcon id={d.id} />
              <span className="os-drop-text"><span className="os-drop-name">{d.name}</span><span className="os-drop-line">{d.line}</span></span>
              <span className="os-fold-meta">{d.meta}</span>
            </button>
          </li>
        ))}
      </ul>
      <Link className="os-folder-more" href={tab.href}>{tab.more} <span aria-hidden="true">→</span></Link>
    </div>
  );
}

// ---------- the Sky panel (from the menu bar's sun dial and clock) ----------
// Its own controls, not a Mac's: it opens out of the signature as a circle widening from the sun dial, its rows
// rising in one after another, and folds back into it. Its dial's sun (or moon) travels along its arc to where
// it is, and swings across when the time is changed. The time of day is a track with four stops, a small sun
// gliding along it on a spring (a moon at night); the weathers are five glyphs, a soft halo sliding to the one
// showing, the one chosen giving a little bounce. With reduced motion, the states change without the travel.
export type SkyFacts = {
  place: string; time: string; date: string; rise: string; set: string; moon: string; weather: string;
  phase: number; previewing: boolean; tried: string | null; current: string; kinds: { id: string; label: string; icon: ReactNode }[];
};
// The moon as it is, drawn as it looks in the painted sky (f: how far through its month, 0 new, 0.5 full, waxing
// lit from the right): a face in the colour round it (cream on the night bar, in the almanac's night windows and
// in the panel's night dial), its lit part bounded by the curve of the terminator, its dark part faint, a soft glow
// round it. On a light surface (onLight) it's the pale moon of a daytime sky.
export function MoonGlyph({ cx, cy, r, f, onLight = false, craters = false }: { cx: number; cy: number; r: number; f: number; onLight?: boolean; craters?: boolean }) {
  const k = Math.cos(2 * Math.PI * f), rx = Math.max(0.001, Math.abs(k) * r), waxing = f < 0.5;
  const lit = `M${cx} ${cy - r}A${r} ${r} 0 0 ${waxing ? 1 : 0} ${cx} ${cy + r}A${rx} ${r} 0 0 ${waxing ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0)} ${cx} ${cy - r}Z`;
  const face = 'currentColor';
  return (
    <g className="os-moon" opacity={onLight ? 0.4 : 1}>
      <circle cx={cx} cy={cy} r={r * 1.3} fill={face} opacity={0.16} />
      <circle cx={cx} cy={cy} r={r} fill={face} opacity={0.18} />
      <path d={lit} fill={face} />
      {craters && (
        <g fill="rgba(22,22,26,0.13)">
          <circle cx={cx - r * 0.34} cy={cy - r * 0.06} r={r * 0.22} /><circle cx={cx + r * 0.24} cy={cy - r * 0.38} r={r * 0.12} /><circle cx={cx + r * 0.2} cy={cy + r * 0.34} r={r * 0.15} />
        </g>
      )}
    </g>
  );
}
// The sun: a disc and eight rays, in a faint glow.
export function SunGlyph({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a); return `M${cx + c * r * 1.6} ${cy + s * r * 1.6}L${cx + c * r * 2.1} ${cy + s * r * 2.1}`; }).join('');
  return <g className="os-sun"><circle cx={cx} cy={cy} r={r * 2.5} fill="currentColor" opacity={0.08} /><circle cx={cx} cy={cy} r={r} fill="currentColor" /><path d={rays} stroke="currentColor" strokeWidth={r * 0.45} strokeLinecap="round" /></g>;
}

// The sun dial: the sky's way from horizon to horizon. The sun and the moon each go round on their own wheel, and
// only what's above the horizon shows: by day the sun rolls across (turning as a wheel would over the distance it
// travels), and at sunset it sinks under the horizon on the right as the moon rises on the left, upright, in its
// real phase (f); at dawn the other way round. Each glides on (1.1 s, a little overshoot) and always forward the
// short way round, and follows a drag of the sky exactly. With intro, they rise from the horizon once shown. Used
// in the menu bar and the Sky panel (onLight: on its light glass).
export function SunDial({ p, up, f = 0.5, w = 30, intro = false, onLight = false, className = '' }: { p: number; up: boolean; f?: number; w?: number; intro?: boolean; onLight?: boolean; className?: string }) {
  const clip = useId();
  const [ready, setReady] = useState(!intro);
  useEffect(() => {
    if (!intro) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(r);
  }, [intro]);
  const q = Math.min(1, Math.max(0, p));
  // (each body's angle on its wheel: 0 rising on the left, 180 setting on the right, beyond that under the horizon;
  // taken the short way round from where it was, so it never sweeps back over the sky)
  const last = useRef({ sun: 0, moon: 180 });
  const near = (target: number, prev: number) => target + 360 * Math.round((prev - target) / 360);
  const sun = ready ? near(up ? 180 * q : 180 + 180 * q, last.current.sun) : (up ? 0 : 180);
  const moon = ready ? near(up ? 180 + 180 * q : 180 * q, last.current.moon) : (up ? 180 : 0);
  useEffect(() => { last.current = { sun, moon }; });
  const big = w > 50;
  return (
    <svg className={`os-dial ${className}`} viewBox="-1.5 -1.5 29 19.5" width={w} height={(w * 19.5) / 29} aria-hidden="true">
      <defs><clipPath id={clip}><rect x="-6" y="-6" width="38" height="19.6" /></clipPath></defs>
      <path d="M-0.5 13.5h27" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <path className="os-dial-arc" d="M3 13.5a10 10 0 0 1 20 0" fill="none" stroke="currentColor" strokeWidth="0.9" strokeDasharray="1.4 2" opacity="0.5" />
      <g clipPath={`url(#${clip})`}>
        <g className="os-dial-body" style={{ transform: `rotate(${sun}deg)` }}>
          <g className="os-dial-spin" style={{ transform: `rotate(${sun * 3}deg)` }}><SunGlyph cx={3} cy={13.5} r={big ? 1.5 : 1.55} /></g>
        </g>
        <g className="os-dial-body" style={{ transform: `rotate(${moon}deg)` }}>
          <g className="os-dial-spin" style={{ transform: `rotate(${-moon}deg)` }}><MoonGlyph cx={3} cy={13.5} r={big ? 1.75 : 2.1} f={f} onLight={onLight} craters={big} /></g>
        </g>
      </g>
    </svg>
  );
}

// The almanac (the Sky panel's calendar): a month of Seattle's sky, each day a little window onto his paintings:
// the night's stars, with that night's moon in its real phase, and the day's clouds rising from its foot as far as
// the day has daylight (sunrise to sunset over the whole day), so
// the days can be seen shortening into winter and the moon going round. Today is ringed; the day the sky is
// showing is filled. A click shows the sky on that day, at the same time of day. The days come in on a
// diagonal; the months slide. Times are Seattle's.
type Zoned = { y: number; m: number; d: number; h: number; min: number };
const zonedParts = (ms: number, timeZone: string): Zoned => {
  const ps = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(ms));
  const g = (t: string) => Number(ps.find((x) => x.type === t)?.value ?? 0);
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour') % 24, min: g('minute') };
};
// (the moment it's that date and hour there)
const zonedMs = (y: number, m: number, d: number, h: number, min: number, timeZone: string) => {
  const guess = Date.UTC(y, m - 1, d, h, min), p = zonedParts(guess, timeZone);
  return guess - (Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - guess);
};
type Day = { d: number; ms: number; light: number; rise: string; set: string; f: number; moon: string };
const moonName = (f: number) => (f < 0.03 || f > 0.97 ? 'New moon' : f < 0.22 ? 'Waxing crescent' : f < 0.28 ? 'First quarter' : f < 0.47 ? 'Waxing gibbous' : f < 0.53 ? 'Full moon' : f < 0.72 ? 'Waning gibbous' : f < 0.78 ? 'Last quarter' : 'Waning crescent');
function monthOf(y: number, m: number, timeZone: string, lat: number, lon: number): Day[] {
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const hm = (ms: number) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(new Date(ms));
  return Array.from({ length: n }, (_, i) => {
    const d = i + 1, start = zonedMs(y, m, d, 0, 0, timeZone);
    let rise = 0, set = 0, prev = sunElevation(new Date(start), lat, lon);
    for (let t = 10; t <= 24 * 60; t += 10) {
      const ms = start + t * 60000, e = sunElevation(new Date(ms), lat, lon);
      if (prev < 0 && e >= 0 && !rise) rise = ms;
      if (prev >= 0 && e < 0 && !set) set = ms;
      prev = e;
    }
    const f = moonPhase(new Date(zonedMs(y, m, d, 21, 0, timeZone)));
    return { d, ms: start, light: rise && set ? (set - rise) / 86400000 : 0, rise: rise ? hm(rise) : '—', set: set ? hm(set) : '—', f, moon: moonName(f) };
  });
}
function Almanac({ at, timeZone, lat, lon, onDay }: { at: number; timeZone: string; lat: number; lon: number; onDay: (ms: number) => void }) {
  const shown = zonedParts(at, timeZone), today = zonedParts(Date.now(), timeZone);
  const [ym, setYm] = useState({ y: shown.y, m: shown.m, dir: 0 });
  const [hover, setHover] = useState<Day | null>(null);
  const days = useMemo(() => monthOf(ym.y, ym.m, timeZone, lat, lon), [ym.y, ym.m, timeZone, lat, lon]);
  const lead = new Date(Date.UTC(ym.y, ym.m - 1, 1)).getUTCDay();
  const go = (step: number) => setYm((v) => { const m = v.m + step; return { y: v.y + Math.floor((m - 1) / 12), m: ((m - 1 + 120) % 12) + 1, dir: step }; });
  const title = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(ym.y, ym.m - 1, 15)));
  const info = hover ?? days.find((x) => ym.y === shown.y && ym.m === shown.m && x.d === shown.d) ?? days[0];
  const dl = (x: Day) => `${Math.floor(x.light * 24)}h ${Math.round((x.light * 24 * 60) % 60)}m`;
  return (
    <div className="os-alm">
      <div className="os-alm-head">
        <button type="button" className="os-alm-nav" onClick={() => go(-1)} aria-label="Previous month">‹</button>
        <p className="os-alm-title" key={title} aria-live="polite">{title}</p>
        <button type="button" className="os-alm-nav" onClick={() => go(1)} aria-label="Next month">›</button>
      </div>
      <div className="os-alm-week" aria-hidden="true">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => <span key={i}>{w}</span>)}</div>
      <div className={`os-alm-grid${ym.dir < 0 ? ' from-left' : ym.dir > 0 ? ' from-right' : ''}`} key={`${ym.y}-${ym.m}`} role="grid" aria-label={title} onPointerLeave={() => setHover(null)}>
        {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} className="os-alm-pad" />)}
        {days.map((x, i) => {
          const col = (lead + i) % 7, row = Math.floor((lead + i) / 7);
          const isToday = ym.y === today.y && ym.m === today.m && x.d === today.d;
          const isShown = ym.y === shown.y && ym.m === shown.m && x.d === shown.d;
          return (
            <button key={x.d} type="button" className={`os-alm-day${isToday ? ' is-today' : ''}${isShown ? ' is-shown' : ''}`} style={{ '--light': x.light.toFixed(3), '--w': row + col, '--nx': `${(i * 37) % 100}%`, '--dx': `${(i * 53 + 20) % 100}%` } as CSSProperties}
              onPointerEnter={() => setHover(x)} onFocus={() => setHover(x)}
              onClick={() => onDay(zonedMs(ym.y, ym.m, x.d, shown.h, shown.min, timeZone))}
              aria-label={`${title.split(' ')[0]} ${x.d}: ${x.moon}, sunrise ${x.rise}, sunset ${x.set}${isToday ? ', today' : ''}`} aria-pressed={isShown}>
              <span className="os-alm-light" aria-hidden="true" />
              <span className="os-alm-num">{x.d}</span>
              <svg className="os-alm-moon" viewBox="0 0 12 12" width="13" height="13" aria-hidden="true"><MoonGlyph cx={6} cy={6} r={4.6} f={x.f} /></svg>
            </button>
          );
        })}
      </div>
      <p className="os-alm-info" key={info?.d}>
        {info && <><b>{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(ym.y, ym.m - 1, info.d, 12)))}</b> · {info.moon} · ↑ {info.rise} · ↓ {info.set} · {dl(info)} of light</>}
      </p>
    </div>
  );
}

export function SkyPanel({ open, closing, facts, p, up, f, at: shownAt, timeZone, lat, lon, onDay, onPhase, onWeather, onPlay, onLive, onClose }: {
  open: boolean; closing: boolean; facts: SkyFacts; p: number; up: boolean; f: number; at: number; timeZone: string; lat: number; lon: number;
  onDay: (ms: number) => void; onPhase: (n: number) => void; onWeather: (k: string) => void; onPlay: () => void; onLive: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [bounce, setBounce] = useState<string | null>(null);
  // (the panel shows the sky now, or, from its date, the almanac)
  const [view, setView] = useState<'sky' | 'cal'>('sky');
  useEscape(open, onClose);
  useEffect(() => {
    if (!open) { setView('sky'); return; }
    requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true }));
    const off = (e: PointerEvent) => { const t = e.target as HTMLElement; if (!ref.current?.contains(t) && !t.closest('.os-sig')) onClose(); };
    window.addEventListener('pointerdown', off, true);
    return () => window.removeEventListener('pointerdown', off, true);
  }, [open, onClose]);
  if (!open && !closing) return null;
  const phases = ['Day', 'Golden hour', 'Dusk', 'Night'];
  const at = Math.min(3, Math.max(0, Math.round(facts.phase)));
  const wi = Math.max(0, facts.kinds.findIndex((k) => k.id === (facts.tried ?? facts.current)));
  return (
    <div ref={ref} className={`os-sky${closing ? ' is-closing' : ''}${view === 'cal' ? ' is-cal' : ''}`} role="dialog" aria-label={`The sky in ${facts.place}`}>
      <div className="os-sky-head">
        <div>
          <p className="os-sky-place">{facts.place}{facts.previewing ? ' · another time' : ''}</p>
          <p className="os-sky-time">{facts.time}</p>
          <button type="button" className="os-sky-date" onClick={() => setView((v) => (v === 'sky' ? 'cal' : 'sky'))} aria-expanded={view === 'cal'}>
            {facts.date}
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d={view === 'cal' ? 'M3 7.5 6 4.5l3 3' : 'M3 4.5 6 7.5l3-3'} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <span className={`os-sky-dial${up ? '' : ' is-night'}`}><SunDial p={p} up={up} f={f} w={78} intro onLight={up} className="is-big" /></span>
      </div>
      {view === 'cal' ? (
        <div className="os-sky-view" key="cal"><Almanac at={shownAt} timeZone={timeZone} lat={lat} lon={lon} onDay={onDay} /></div>
      ) : (
        <div className="os-sky-view" key="sky">
          <dl className="os-sky-facts">
            <div><dt>Sunrise</dt><dd>{facts.rise}</dd></div>
            <div><dt>Sunset</dt><dd>{facts.set}</dd></div>
            <div><dt>Moon</dt><dd>{facts.moon}</dd></div>
            <div><dt>Weather</dt><dd>{facts.weather}</dd></div>
          </dl>
          {/* the time of day: a track with four stops, its sun (a moon at night) gliding to the one shown */}
          <div className="os-track" role="group" aria-label="Show the sky at" style={{ '--at': at } as CSSProperties}>
            <span className="os-track-line" aria-hidden="true" />
            <span className={`os-track-mark${at === 3 ? ' is-moon' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 20 20" width="20" height="20">{at === 3 ? <MoonGlyph cx={10} cy={10} r={5} f={f} craters /> : <SunGlyph cx={10} cy={10} r={4} />}</svg>
            </span>
            {phases.map((ph, i) => (
              <button key={ph} type="button" className={`os-track-stop${i === at ? ' is-on' : ''}`} aria-pressed={i === at} onClick={() => onPhase(i)}>
                <span className="os-track-dot" aria-hidden="true" />{ph}
              </button>
            ))}
          </div>
          {/* the weathers: five glyphs, a halo sliding to the one showing */}
          <div className="os-wxrow" role="group" aria-label="Try the weather" style={{ '--at': wi } as CSSProperties}>
            <span className="os-wxrow-halo" aria-hidden="true" />
            {facts.kinds.map((k) => {
              const on = (facts.tried ?? facts.current) === k.id;
              return (
                <button key={k.id} type="button" className={`os-wxrow-b${on ? ' is-on' : ''}${bounce === k.id ? ' is-bounce' : ''}`} aria-pressed={on} title={k.label}
                  onClick={() => { setBounce(k.id); window.setTimeout(() => setBounce(null), 420); onWeather(k.id); }}>
                  {k.icon}<span>{k.label}</span>
                </button>
              );
            })}
          </div>
          {/* Play the day: a row; pointed at, its little sun runs its arc */}
          <button type="button" className="os-play" onClick={onPlay}>
            <svg className="os-play-arc" viewBox="-1.5 -1.5 29 19.5" width="40" height="27" aria-hidden="true">
              <path d="M-0.5 13.5h27" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
              <path d="M3 13.5a10 10 0 0 1 20 0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.4 2" opacity="0.5" />
              <g className="os-play-sun"><SunGlyph cx={3} cy={13.5} r={1.8} /></g>
            </svg>
            <span className="os-play-words"><span className="os-play-name">Play the day</span><span className="os-play-sub">24 hours in 9 seconds</span></span>
            <span className="os-play-go" aria-hidden="true"><svg viewBox="0 0 12 12" width="10" height="10"><path d="M4 2.4 9.6 6 4 9.6Z" fill="currentColor" /></svg></span>
          </button>
          {(facts.previewing || facts.tried) && <button type="button" className="os-sky-live" onClick={onLive}>Back to now</button>}
        </div>
      )}
    </div>
  );
}

// ---------- a page, open as a window over the desktop ----------
export function PageWindow({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  const router = useRouter();
  const body = useRef<HTMLDivElement | null>(null);
  const [closing, setClosing] = useState(false);
  const [full, setFull] = useState(false);
  // (only the body scrolls to a part of the page: the window itself, its title bar, stays put)
  const toPart = (id: string) => {
    const el = body.current, part = el?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!el || !part) return false;
    requestAnimationFrame(() => el.scrollTo({ top: part.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 12 }));
    return true;
  };
  // (a new page: back to its top, or to the part the address names; focus goes into it for the keyboard)
  useEffect(() => {
    setClosing(false);
    const el = body.current;
    if (!el) return;
    const hash = window.location.hash.slice(1);
    if (!(hash && toPart(hash))) el.scrollTop = 0;
    el.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  // (a link to a part of the page already open, such as Contact from the menu bar while About is up)
  useEffect(() => {
    const onPart = (e: Event) => { toPart((e as CustomEvent<string>).detail); };
    window.addEventListener('os:part', onPart);
    return () => window.removeEventListener('os:part', onPart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const close = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push('/'); return; }
    setClosing(true);
    window.setTimeout(() => router.push('/'), 300);
  };
  return (
    <section className={`hm-page${full ? ' is-full' : ''}${closing ? ' is-closing' : ''}`} aria-label={title}>
      <div className="hm-page-bar">
        <span className="hm-dots os-ctl">
          <button type="button" className="os-ctl-b" onClick={close} aria-label={`Close ${title}`}>
            <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><path d="M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className="os-ctl-b" onClick={() => setFull((f) => !f)} aria-pressed={full} aria-label={full ? 'Exit full screen' : 'Full screen'}>
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2.6 6.6V9.4H5.4M9.4 5.4V2.6H6.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </span>
        <span className="hm-page-title" key={path}>{title}</span>
      </div>
      <div ref={body} className="hm-page-body" tabIndex={-1} key={path}>
        {children}
      </div>
    </section>
  );
}
