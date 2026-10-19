'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, PlayRight } from '@/app/components/icons';

export type RouteStop = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  heroImage: string;
  link: string;
  role: string;
  status: string;
  live: boolean;
  /** Fill behind a contained image (its letterbox); covered images sit on the neutral frame tone */
  bg: string;
  /** How the hero sits in the window: laptop mockups are contained, artwork covers */
  fit?: 'contain' | 'cover';
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Selected work as a route map beside a train window. The active stop is the hovered or focused
// one, otherwise the one nearest 45% of the viewport. The window shows its picture (the new view
// slides in from the right like scenery), a position marker springs along the rail to it, the rail fills
// with scroll, and an LED panel announces the next stop while you're in this section.
// All per-frame work writes to element.style through refs inside requestAnimationFrame, and the
// window swap is CSS transitions toggled by class; React never re-renders per frame.
export default function RouteMap({ stops, after = 'Transfer for About me' }: { stops: RouteStop[]; after?: string }) {
  const routeRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const ledRef = useRef<HTMLDivElement | null>(null);
  const destRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const route = routeRef.current;
    const rail = railRef.current;
    const marker = markerRef.current;
    const fill = fillRef.current;
    const win = windowRef.current;
    const led = ledRef.current;
    const dest = destRef.current;
    if (!route || !rail || !marker || !fill || !win || !led || !dest) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const list = route.querySelector<HTMLOListElement>('.wf-stops');
    const stopEls = Array.from(route.querySelectorAll<HTMLLIElement>('.wf-stop'));
    const views = Array.from(win.querySelectorAll<HTMLElement>('.wf-view'));
    const caps = Array.from(win.querySelectorAll<HTMLElement>('.wf-cap'));
    if (!list || stopEls.length === 0) return;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    // ---------- marker: a spring along the rail, parking just above the active stop's badge.
    // While it moves fast it shows a short streak behind it (a class toggled on change only). ----------
    let ty = 0, tv = 0, tTarget = 0, tRaf = 0;
    const badgeOf = (i: number) => stopEls[i].querySelector<HTMLElement>('.wf-sb');
    const target = (i: number) => {
      const b = badgeOf(i);
      const top = stopEls[i].offsetTop + (b ? b.offsetTop : 0);
      return top - marker.offsetHeight - 8;
    };
    const place = (y: number) => { marker.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`; };
    let streak = '';
    const setStreak = (dir: '' | 'up' | 'down') => {
      if (dir === streak) return;
      streak = dir;
      marker.classList.toggle('is-moving', dir !== '');
      marker.classList.toggle('is-up', dir === 'up');
    };
    const moveMarker = (to: number) => {
      tTarget = to;
      cancelAnimationFrame(tRaf);
      if (reduce.matches) { ty = to; tv = 0; place(ty); setStreak(''); return; }
      let last = performance.now();
      const w = (2 * Math.PI) / 0.42;
      const step = () => {
        const t = performance.now();
        let dt = Math.min(0.064, Math.max(0, t - last) / 1000);
        last = t;
        while (dt > 0) {
          const h = Math.min(dt, 1 / 240);
          const a = -w * w * (ty - tTarget) - 2 * 0.86 * w * tv;
          tv += a * h; ty += tv * h; dt -= h;
        }
        place(ty);
        setStreak(Math.abs(tv) > 120 ? (tv < 0 ? 'up' : 'down') : '');
        if (Math.abs(ty - tTarget) > 0.3 || Math.abs(tv) > 0.5) tRaf = requestAnimationFrame(step);
        else { ty = tTarget; tv = 0; place(ty); setStreak(''); }
      };
      tRaf = requestAnimationFrame(step);
    };
    ty = tTarget = target(0);
    place(ty);

    // ---------- the active stop: hover, then focus, then scroll ----------
    let hoverIdx = -1, focusIdx = -1, scrollIdx = 0, active = -1;
    const apply = () => {
      const i = hoverIdx >= 0 ? hoverIdx : focusIdx >= 0 ? focusIdx : scrollIdx;
      if (i === active) return;
      active = i;
      list.classList.add('has-active');
      stopEls.forEach((s, j) => s.classList.toggle('is-active', j === i));
      views.forEach((v, j) => v.classList.toggle('is-on', j === i));
      caps.forEach((c, j) => c.classList.toggle('is-on', j === i));
      marker.classList.add('on');
      moveMarker(target(i));
    };

    stopEls.forEach((stop, i) => {
      on(stop, 'pointerenter', () => { hoverIdx = i; apply(); });
      const link = stop.querySelector('a');
      if (link) on(link, 'focus', () => { focusIdx = i; apply(); });
    });
    on(list, 'pointerleave', () => { hoverIdx = -1; apply(); });
    on(list, 'focusout', (e) => {
      const next = e.relatedTarget as Node | null;
      if (!next || !list.contains(next)) { focusIdx = -1; apply(); }
    });

    // ---------- scroll: rail fill, the scroll stop, LED next-stop panel ----------
    const sign = document.querySelector<HTMLElement>('[data-station-sign]');
    const end = document.querySelector<HTMLElement>('[data-route-end]');
    let ticking = false, lastText = '';
    const onScroll = () => {
      ticking = false;
      const r = route.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.6 - r.top) / (r.height || 1), 0, 1);
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      // Nearest stop to 45% of the viewport drives the window when nothing is hovered or focused
      let best = 0, bestD = Infinity, passed = -1;
      stopEls.forEach((s, i) => {
        const b = s.getBoundingClientRect();
        const d = Math.abs(b.top + Math.min(b.height, 160) / 2 - vh * 0.45);
        if (d < bestD) { bestD = d; best = i; }
        if (b.top < vh * 0.55) passed = i;
      });
      scrollIdx = best;
      apply();
      const nextStop = stopEls[passed + 1];
      const text = nextStop ? nextStop.dataset.name || '' : after;
      if (text !== lastText) { dest.textContent = text; lastText = text; }
      const pastHero = sign ? sign.getBoundingClientRect().bottom < 0 : r.top < vh * 0.5;
      // It steps aside once the transfer it announces is on screen, so it never sits over the footer
      const arrived = end ? end.getBoundingClientRect().top < vh - 48 : false;
      led.classList.toggle('on', pastHero && !arrived && r.bottom > vh * 0.25);
    };
    const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll);
    cleanups.push(() => {
      window.removeEventListener('scroll', requestScroll);
      window.removeEventListener('resize', requestScroll);
    });

    // The rail ends at the last badge. Row heights change when fonts or images load or the layout
    // reflows, so re-measure then and re-seat the marker on its stop.
    const ro = new ResizeObserver(() => {
      const last = stopEls[stopEls.length - 1];
      const b = badgeOf(stopEls.length - 1);
      if (b) rail.style.bottom = `${Math.max(0, route.offsetHeight - (last.offsetTop + b.offsetTop + b.offsetHeight / 2))}px`;
      const to = target(Math.max(0, active));
      if (Math.abs(to - tTarget) > 1) { cancelAnimationFrame(tRaf); ty = tTarget = to; tv = 0; place(ty); setStreak(''); }
      requestScroll();
    });
    ro.observe(route);
    cleanups.push(() => ro.disconnect());
    onScroll();

    // Like the screens above train doors, the label alternates between English and Japanese
    let ledTimer = 0;
    const syncLed = () => {
      window.clearInterval(ledTimer);
      ledTimer = 0;
      if (reduce.matches) { led.classList.remove('jp-on'); return; }
      ledTimer = window.setInterval(() => led.classList.toggle('jp-on'), 3500);
    };
    syncLed();
    reduce.addEventListener('change', syncLed);
    cleanups.push(() => { reduce.removeEventListener('change', syncLed); window.clearInterval(ledTimer); });

    return () => {
      cleanups.forEach((fn) => fn());
      cancelAnimationFrame(tRaf);
    };
  }, [after]);

  return (
    <>
      <div className="wf-work">
        <div className="wf-route" ref={routeRef}>
          <div className="wf-rail" ref={railRef} aria-hidden="true"><div className="wf-rail-fill" ref={fillRef} /></div>
          <span className="wf-rmark" ref={markerRef} aria-hidden="true" />
          <ol className="wf-stops">
            {stops.map((p, i) => {
              const num = String(i + 1).padStart(2, '0');
              return (
                <li key={p.id} className="wf-stop" data-name={p.title}>
                  <Link href={p.link}>
                    <span className="wf-sb" aria-hidden="true">
                      <span className="wf-code">MB</span>
                      <span className="wf-num">{num}</span>
                    </span>
                    <span className="wf-stop-body">
                      <h3>
                        {p.title}
                        <ArrowUpRight size={20} className="wf-go-icon" />
                      </h3>
                      <span className="wf-meta">
                        <span>{p.role}</span>
                        <span className={`wf-st${p.live ? ' live' : ''}`}>{p.status}</span>
                      </span>
                      <span className="wf-what">{p.description}</span>
                      <span className="wf-thumb" style={p.fit === 'contain' ? ({ '--f': p.bg } as CSSProperties) : undefined}>
                        <Image
                          src={p.heroImage}
                          alt=""
                          fill
                          sizes="(max-width: 1023px) calc(100vw - 84px), 1px"
                          className={p.fit === 'contain' ? 'object-contain' : 'object-cover'}
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The train window: a sticky view of the active stop (desktop only; the list carries the content) */}
        <div className="wf-window-col" aria-hidden="true">
          <div className="wf-window" ref={windowRef}>
            <div className="wf-pane">
              <div className="wf-glass">
                {stops.map((p, i) => (
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
              {stops.map((p, i) => (
                <p key={p.id} className={`wf-cap${i === 0 ? ' is-on' : ''}`}>
                  <span className="wf-cap-name">{p.title}</span>
                  <span className={`wf-st${p.live ? ' live' : ''}`}>{p.status}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wf-led" ref={ledRef} aria-hidden="true">
        <span className="wf-lbl"><span>NEXT</span><span lang="ja">次は</span></span>
        <PlayRight size={14} className="wf-arrow" />
        <span className="wf-dest" ref={destRef} />
      </div>
    </>
  );
}
