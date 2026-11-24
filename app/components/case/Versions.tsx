'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

// A case study in two lengths: the short version (one screen: the problem, what I did, the decisions,
// where it stands) and the full case study. A switch under the facts picks one; both share the header and
// the hero recording above it and the next project below. The full case study shows by default. A choice
// is kept in the address (?v=short or ?v=full, so a copied link opens on that version) and remembered for
// the visitor's next case study, which opens on it unless its address says otherwise. The one shown fades
// in (260 ms). Without JavaScript the full case study shows. Styles: app/work/study.css.
type V = 'short' | 'full';
const Ctx = createContext<{ v: V; set: (v: V, toBody?: boolean) => void }>({ v: 'full', set: () => {} });
const KEY = 'st-version';
const LABEL: Record<V, string> = { short: 'Short version', full: 'Full case study' };

export function Versions({ children }: { children: ReactNode }) {
  const [v, setV] = useState<V>('full');
  // (the address wins; otherwise what this visitor picked last time)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('v');
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(KEY); } catch { /* storage blocked: the default stands */ }
    const want = q === 'short' || q === 'full' ? q : saved === 'short' ? 'short' : null;
    if (want) setV(want);
  }, []);
  const set = useCallback((n: V, toBody = false) => {
    setV(n);
    try { window.localStorage.setItem(KEY, n); } catch { /* not remembered, still switched */ }
    const u = new URL(window.location.href);
    // (written either way, so a copied link opens on the version that was chosen, whatever the reader picked before)
    u.searchParams.set('v', n);
    window.history.replaceState(window.history.state, '', u);
    // (from the end of the short version: straight to the top of the full one, which fades in; a smooth
    // scroll from there would run back up through the whole case study)
    // (instant, over the page's smooth scrolling, globals.css). Focus goes to the full version's first heading,
    // since the button that had it is now hidden; the next Tab carries on from there.
    if (toBody) requestAnimationFrame(() => {
      const full = document.getElementById('st-full');
      full?.scrollIntoView({ block: 'start', behavior: 'instant' });
      const h = full?.querySelector<HTMLElement>('h2');
      if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    });
  }, []);
  return <Ctx.Provider value={{ v, set }}>{children}</Ctx.Provider>;
}

// The switch: two tabs on a track, a white thumb under the chosen one (it slides across, 260 ms)
export function VersionSwitch() {
  const { v, set } = useContext(Ctx);
  const refs = useRef<Record<V, HTMLButtonElement | null>>({ short: null, full: null });
  const order: V[] = ['short', 'full'];
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const n: V = e.key === 'Home' ? 'short' : e.key === 'End' ? 'full' : v === 'short' ? 'full' : 'short';
    set(n);
    refs.current[n]?.focus();
  };
  return (
    <div className={`st-switch is-${v}`} role="tablist" aria-label="Case study length" onKeyDown={onKey}>
      <span className="st-switch-thumb" aria-hidden="true" />
      {order.map((o) => (
        <button
          key={o}
          ref={(el) => { refs.current[o] = el; }}
          type="button"
          role="tab"
          id={`st-tab-${o}`}
          aria-selected={v === o}
          aria-controls={`st-${o}`}
          tabIndex={v === o ? 0 : -1}
          className="st-switch-opt"
          onClick={() => set(o)}
        >
          {LABEL[o]}
        </button>
      ))}
    </div>
  );
}

// One of the two lengths; hidden while the other is chosen
export function Version({ of, children }: { of: V; children: ReactNode }) {
  const { v } = useContext(Ctx);
  return (
    <div id={`st-${of}`} role="tabpanel" aria-labelledby={`st-tab-${of}`} hidden={v !== of} className={`st-version is-${of}`}>
      {children}
    </div>
  );
}

// The way on from the short version to the full one
export function ReadFull() {
  const { set } = useContext(Ctx);
  return (
    <button type="button" className="st-short-more" onClick={() => set('full', true)}>
      Read the full case study <span aria-hidden="true">↓</span>
    </button>
  );
}
