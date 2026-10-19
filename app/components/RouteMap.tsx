'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  /** Fill behind the image while it loads / letterboxes */
  bg: string;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Tags that only repeat the role ("Consumer AI" vs "Consumer · AI") are dropped
const words = (s: string) => s.toLowerCase().split(/\s+/).map((w) => w.replace(/s$/, ''));
const extraTags = (tags: string[], role: string) => {
  const roleWords = new Set(words(role));
  return tags.filter((t) => !words(t).every((w) => roleWords.has(w)));
};

// Selected work as a route map. The rail fills with scroll, a train springs to the hovered or
// focused stop (and follows scroll otherwise), a preview trails the cursor, and an LED panel
// announces the next stop while you're in this section. All per-frame work writes to
// element.style through refs inside requestAnimationFrame; React never re-renders per frame.
export default function RouteMap({ stops, after = 'Transfer · About me' }: { stops: RouteStop[]; after?: string }) {
  const routeRef = useRef<HTMLDivElement | null>(null);
  const trainRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const peekRef = useRef<HTMLDivElement | null>(null);
  const ledRef = useRef<HTMLDivElement | null>(null);
  const destRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const route = routeRef.current;
    const train = trainRef.current;
    const fill = fillRef.current;
    const peekEl = peekRef.current;
    const led = ledRef.current;
    const dest = destRef.current;
    if (!route || !train || !fill || !peekEl || !led || !dest) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const stopEls = Array.from(route.querySelectorAll<HTMLLIElement>('.wf-stop'));
    const peekImgs = Array.from(peekEl.querySelectorAll<HTMLElement>('.wf-peek-img'));
    if (stopEls.length === 0) return;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    // ---------- train: a critically-damped-ish spring toward the active stop ----------
    let ty = 0, tv = 0, tTarget = 0, tRaf = 0, active = 0;
    const center = (el: HTMLElement) => el.offsetTop + el.offsetHeight / 2 - 20;
    const place = (y: number) => { train.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`; };
    const moveTrain = (to: number) => {
      tTarget = to;
      cancelAnimationFrame(tRaf);
      if (reduce.matches) { ty = to; tv = 0; place(ty); return; }
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
        if (Math.abs(ty - tTarget) > 0.3 || Math.abs(tv) > 0.5) tRaf = requestAnimationFrame(step);
        else { ty = tTarget; tv = 0; place(ty); }
      };
      tRaf = requestAnimationFrame(step);
    };
    const goTo = (i: number) => { active = i; train.classList.add('on'); moveTrain(center(stopEls[i])); };
    ty = tTarget = center(stopEls[0]);
    place(ty);

    // ---------- preview: trails the cursor, tilts with speed, crossfades between stops ----------
    let px = 0, py = 0, cx = 0, cy = 0, rot = 0, loop = 0, showing = false, current = -1;
    const tick = () => {
      const k = reduce.matches ? 1 : 0.18;
      const nx = cx + (px - cx) * k, ny = cy + (py - cy) * k, speed = nx - cx;
      cx = nx; cy = ny;
      rot += ((reduce.matches ? 0 : clamp(speed * 0.35, -7, 7)) - rot) * 0.2;
      peekEl.style.transform = `translate3d(${(cx + 24).toFixed(1)}px, ${(cy - 110).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      loop = showing || Math.abs(px - cx) > 0.5 || Math.abs(rot) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const showImg = (i: number) => {
      if (current === i) return;
      current = i;
      peekEl.style.background = stopEls[i].dataset.bg || '';
      peekImgs.forEach((img, j) => img.classList.toggle('out', j !== i));
    };

    stopEls.forEach((stop, i) => {
      on(stop, 'pointerenter', (e) => {
        goTo(i);
        if (!fine.matches || e.pointerType !== 'mouse') return;
        if (!showing) { cx = px = e.clientX; cy = py = e.clientY; rot = 0; }
        showImg(i);
        showing = true;
        peekEl.classList.add('on');
        if (!loop) loop = requestAnimationFrame(tick);
      });
      on(stop, 'pointermove', (e) => { px = e.clientX; py = e.clientY; });
      const link = stop.querySelector('a');
      if (link) on(link, 'focus', () => goTo(i));
    });
    on(route, 'pointerleave', () => { showing = false; peekEl.classList.remove('on'); });

    // ---------- scroll: rail fill, train when idle, LED next-stop panel ----------
    const sign = document.querySelector<HTMLElement>('[data-station-sign]');
    let ticking = false, lastText = '';
    const onScroll = () => {
      ticking = false;
      const r = route.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.6 - r.top) / (r.height || 1), 0, 1);
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      let idx = -1;
      stopEls.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.55) idx = i; });
      const nextStop = stopEls[idx + 1];
      const text = nextStop ? nextStop.dataset.name || '' : after;
      if (text !== lastText) { dest.textContent = text; lastText = text; }
      const pastHero = sign ? sign.getBoundingClientRect().bottom < 0 : r.top < vh * 0.5;
      led.classList.toggle('on', pastHero && r.bottom > vh * 0.25);
      if (idx >= 0 && !showing) {
        active = idx;
        train.classList.add('on');
        if (Math.abs(tTarget - center(stopEls[idx])) > 1) moveTrain(center(stopEls[idx]));
      }
    };
    const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll);
    cleanups.push(() => {
      window.removeEventListener('scroll', requestScroll);
      window.removeEventListener('resize', requestScroll);
    });

    // Row heights change when fonts load or the layout reflows: re-seat the train on its stop
    const ro = new ResizeObserver(() => {
      const to = center(stopEls[active]);
      if (Math.abs(to - tTarget) > 1) { cancelAnimationFrame(tRaf); ty = tTarget = to; tv = 0; place(ty); }
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
      cancelAnimationFrame(loop);
    };
  }, [after]);

  return (
    <>
      <div className="wf-route" ref={routeRef}>
        <div className="wf-rail" aria-hidden="true"><div className="wf-rail-fill" ref={fillRef} /></div>
        <div className="wf-train" ref={trainRef} aria-hidden="true" />
        <ol className="wf-stops">
          {stops.map((p, i) => {
            const num = String(i + 1).padStart(2, '0');
            return (
              <li key={p.id} className="wf-stop" data-bg={p.bg} data-name={p.title}>
                <Link href={p.link}>
                  <span className="wf-sb" aria-hidden="true">
                    <span className="wf-code">MB</span>
                    <span className="wf-num">{num}</span>
                  </span>
                  <h3>{p.title}</h3>
                  <span className="wf-what">{p.description}</span>
                  <span className="wf-kind">
                    <span>{p.role}</span>
                    {extraTags(p.tags, p.role).length > 0 && (
                      <span className="wf-tags">{extraTags(p.tags, p.role).join(' · ')}</span>
                    )}
                  </span>
                  <span className={`wf-st${p.live ? ' live' : ''}`}>{p.status}</span>
                  <span className="wf-thumb" style={{ '--f': p.bg } as CSSProperties}>
                    <Image src={p.heroImage} alt="" fill sizes="(max-width: 760px) calc(100vw - 102px), 1px" className="object-cover" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="wf-led" ref={ledRef} aria-hidden="true">
        <span className="wf-lbl"><span>NEXT</span><span lang="ja">次は</span></span>
        <span className="wf-arrow">▶</span>
        <span className="wf-dest" ref={destRef} />
      </div>
      <div className="wf-peek" ref={peekRef} aria-hidden="true">
        <div className="wf-peek-inner">
          {stops.map((p, i) => (
            <Image
              key={p.id}
              src={p.heroImage}
              alt=""
              fill
              sizes="340px"
              className={`wf-peek-img object-cover${i === 0 ? '' : ' out'}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
