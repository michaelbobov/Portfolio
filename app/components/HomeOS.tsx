'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import DockIcon from '@/app/components/DockIcon';
import { RESUME } from '@/app/components/Site';
import type { DockItem } from '@/app/data/dock';

// The homepage's operating-system pieces (HomeShell opens them; styles: home.css .os-*):
// - AboutPanel: "About this desktop", from his mark at the top left, as a Mac's About This Mac.
// - DesktopMenu: right-click on the sky: preview the sky at another time, go back to the live sky, start
//   the screensaver, copy the link, About. Never over the windows, the dock or a link.
// - Spotlight: press / (or ⌘K) to find a project or a page by name and open it.
// - MissionControl: all the work at once, as a Mac's Mission Control lays out every window: each project a
//   little window (its still; its recording plays while pointed at), in rows by section; a click opens it.
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
  useEscape(open, onClose);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="os-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className="os-about" role="dialog" aria-modal="true" aria-labelledby="os-about-title" tabIndex={-1}>
        <div className="os-about-bar">
          <button type="button" className="os-close" onClick={onClose} aria-label="Close" />
        </div>
        <Image className="os-about-mark" src="/mb-mark.png" alt="" width={129} height={160} />
        <h2 id="os-about-title" className="os-about-title">MichaelOS</h2>
        <p className="os-about-ver">Seattle edition</p>
        <dl className="os-about-specs">
          <div><dt>Designer</dt><dd>Michael Bobov</dd></div>
          <div><dt>Role</dt><dd>Product designer &amp; builder</dd></div>
          <div><dt>Based in</dt><dd>Seattle, WA</dd></div>
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
      <div className="os-spot" role="dialog" aria-modal="true" aria-label="Spotlight search">
        <div className="os-spot-field">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Search projects and pages"
            aria-label="Search projects and pages"
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
