'use client';

import { useEffect, useRef, useState } from 'react';

// The live demo (desktop): SkillTree's real interface in a frame, built by the extension's
// scripts/demo/build-demo.mjs. It runs on the author's scanned skills and the bundled catalog, and
// replays the skill uses SkillTree's hooks recorded in six real Claude Code sessions. The frame loads
// when the section comes near; the buttons under it switch the demo's tabs.

const SRC = '/side-projects/skilltree/demo/index.html';

type Tab = 'tree' | 'marketplace' | 'activity';

const TABS: { id: Tab; name: string; fact: string }[] = [
  {
    id: 'tree',
    name: 'Skill Tree',
    fact: 'Each replayed use lands on its skill: the count goes up and the skill lights for a moment. Click a skill for its recorded use.',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    fact: '1,163 public skills from 20 GitHub repositories. Open one to read its SKILL.md at the pinned commit. For you comes from the recorded uses.',
  },
  {
    id: 'activity',
    name: 'Activity',
    fact: 'Every use, grouped by session, typed as a /command or invoked by Claude. No prompt text is kept.',
  },
];

export default function LiveDemo() {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [ask, setAsk] = useState(false);
  const [tab, setTab] = useState<Tab>('tree');
  const tabRef = useRef<Tab>('tree');
  tabRef.current = tab;

  // Load when the section comes near. It is hidden below 1000px, so phones never load it.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) {
      setAsk(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (items) => {
        if (items.some((i) => i.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Messages from the demo: which tab it shows, and wheel scrolling over the map (passed to the page).
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (!frame.current || ev.source !== frame.current.contentWindow) return;
      const d = ev.data as { demo?: string; tab?: Tab; dy?: number };
      if (d?.demo === 'tab' && d.tab) setTab(d.tab);
      if (d?.demo === 'wheel' && typeof d.dy === 'number') window.scrollBy({ top: d.dy, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // The message only names a tab, so it needs no target origin.
  const tell = (t: Tab) => frame.current?.contentWindow?.postMessage({ demo: 'go', tab: t }, '*');
  const go = (t: Tab) => {
    setTab(t);
    if (ready) tell(t);
  };
  const loaded = () => {
    setReady(true);
    if (tabRef.current !== 'tree') tell(tabRef.current);
  };

  return (
    <section className="stx-live" aria-labelledby="stx-live-title">
      <div className="stx-live-head">
        <h2 id="stx-live-title" className="stx-h2" data-reveal>
          Try it here
        </h2>
        <p className="stx-statement" data-reveal style={{ ['--i' as string]: 1 }}>
          The real SkillTree interface, running on my skills and its full catalog. It replays six Claude Code sessions I recorded, so you can watch each use land.
        </p>
      </div>
      <div className="stx-live-field" data-reveal style={{ ['--i' as string]: 2 }}>
        <div ref={box} className={`stx-live-frame${ready ? ' is-ready' : ''}`}>
          {!ready && (
            <div className="stx-live-wait">
              {ask && !on ? (
                <button type="button" className="stx-btn is-on-blue" onClick={() => setOn(true)}>
                  Load the demo, under 1 MB
                </button>
              ) : (
                <p>Loading the demo…</p>
              )}
            </div>
          )}
          {on && <iframe ref={frame} src={SRC} title="SkillTree demo: Skill Tree, Marketplace and Activity" onLoad={loaded} />}
        </div>
      </div>
      <div className="stx-live-tabs" role="group" aria-label="Demo tabs" data-reveal style={{ ['--i' as string]: 3 }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-pressed={tab === t.id} className={`stx-live-tab${tab === t.id ? ' is-on' : ''}`} onClick={() => go(t.id)}>
            <span className="stx-live-name">{t.name}</span>
            <span className="stx-live-fact">{t.fact}</span>
          </button>
        ))}
      </div>
      <p className="stx-live-note" data-reveal style={{ ['--i' as string]: 4 }}>
        It runs in your browser on recorded data and reads nothing from your machine. Opening files, installing and tracking work in VS Code.
      </p>
    </section>
  );
}
