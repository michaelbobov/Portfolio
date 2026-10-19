'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@/app/components/icons';

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  link: string;
  role: string;
  status: string;
  live: boolean;
  /** Fill behind a contained image (its letterbox); covered images sit on the neutral frame tone */
  bg?: string;
  /** How the image sits in the window: laptop mockups are contained, artwork covers */
  fit?: 'contain' | 'cover';
};

// Selected work as a list beside a sticky preview window (desktop). The active project is the
// hovered or focused row, otherwise the one nearest 45% of the viewport while scrolling. The
// window swap is CSS transitions toggled by class, so it retargets cleanly; scroll work runs in
// requestAnimationFrame and React never re-renders for it.
export default function WorkList({ items }: { items: WorkItem[] }) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const win = windowRef.current;
    if (!list || !win) return;

    const rows = Array.from(list.querySelectorAll<HTMLLIElement>('.wf-row'));
    const views = Array.from(win.querySelectorAll<HTMLElement>('.wf-view'));
    const caps = Array.from(win.querySelectorAll<HTMLElement>('.wf-cap'));
    if (rows.length === 0) return;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    // ---------- the active project: hover, then focus, then scroll ----------
    let hoverIdx = -1, focusIdx = -1, scrollIdx = 0, active = -1;
    const apply = () => {
      const i = hoverIdx >= 0 ? hoverIdx : focusIdx >= 0 ? focusIdx : scrollIdx;
      if (i === active) return;
      active = i;
      list.classList.add('has-active');
      rows.forEach((r, j) => r.classList.toggle('is-active', j === i));
      views.forEach((v, j) => v.classList.toggle('is-on', j === i));
      caps.forEach((c, j) => c.classList.toggle('is-on', j === i));
    };

    rows.forEach((row, i) => {
      on(row, 'pointerenter', () => { hoverIdx = i; apply(); });
      const link = row.querySelector('a');
      if (link) on(link, 'focus', () => { focusIdx = i; apply(); });
    });
    on(list, 'pointerleave', () => { hoverIdx = -1; apply(); });
    on(list, 'focusout', (e) => {
      const next = e.relatedTarget as Node | null;
      if (!next || !list.contains(next)) { focusIdx = -1; apply(); }
    });

    // ---------- scroll: the row nearest 45% of the viewport ----------
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const vh = window.innerHeight;
      let best = 0, bestD = Infinity;
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + Math.min(b.height, 160) / 2 - vh * 0.45);
        if (d < bestD) { bestD = d; best = i; }
      });
      scrollIdx = best;
      apply();
    };
    const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll);
    cleanups.push(() => {
      window.removeEventListener('scroll', requestScroll);
      window.removeEventListener('resize', requestScroll);
    });
    onScroll();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="wf-work">
      <ol className="wf-rows" ref={listRef}>
        {items.map((p) => (
          <li key={p.id} className="wf-row">
            <Link href={p.link}>
              <h3>
                {p.title}
                <ArrowUpRight size={20} className="wf-go-icon" />
              </h3>
              <span className="wf-meta">
                {p.role},{' '}
                <span className={`wf-st${p.live ? ' live' : ''}`}>{p.status}</span>
              </span>
              <span className="wf-what">{p.description}</span>
              <span className="wf-thumb" style={p.fit === 'contain' ? ({ '--f': p.bg } as CSSProperties) : undefined}>
                <Image
                  src={p.heroImage}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 32px), 1px"
                  className={p.fit === 'contain' ? 'object-contain' : 'object-cover'}
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* The preview window: a sticky view of the active project (desktop only; the list carries the content) */}
      <div className="wf-window-col" aria-hidden="true">
        <div className="wf-window" ref={windowRef}>
          <div className="wf-pane">
            <div className="wf-glass">
              {items.map((p, i) => (
                <div key={p.id} className={`wf-view${i === 0 ? ' is-on' : ''}`} style={p.fit === 'contain' ? { background: p.bg } : undefined}>
                  <Image
                    src={p.heroImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 1px"
                    className={p.fit === 'contain' ? 'object-contain' : 'object-cover'}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="wf-caps">
            {items.map((p, i) => (
              <p key={p.id} className={`wf-cap${i === 0 ? ' is-on' : ''}`}>
                <span className="wf-cap-name">{p.title}</span>
                <span className={`wf-st${p.live ? ' live' : ''}`}>{p.status}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
