'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// The homepage intro (headline lines rise out of their masks as the set opens) plays once per page
// load. The class is in the server markup so the CSS is ready on first paint, but nothing moves until
// the set is shown (DollSet's ds-shown; hp.css holds the headline till then), so the words and the
// dolls start together. A timer then removes the class so nothing can be left hidden, and
// client-side returns to "/" skip it.
let introPlayed = false;

export default function IntroStage({ className = '', children }: { className?: string; children: ReactNode }) {
  const [intro, setIntro] = useState(() => !introPlayed);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    introPlayed = true;
    if (!intro) return;
    const el = ref.current;
    let t = 0;
    const start = () => { window.clearTimeout(t); t = window.setTimeout(() => setIntro(false), 4200); };
    if (!el?.querySelector('.ds') || el.querySelector('.ds.is-3d, .ds.is-flat')) start();
    else {
      el.addEventListener('ds-shown', start, { once: true });
      // (in case it never comes)
      t = window.setTimeout(() => setIntro(false), 7000);
    }
    return () => { window.clearTimeout(t); el?.removeEventListener('ds-shown', start); };
  }, [intro]);

  return <div ref={ref} className={`${className}${intro ? ' wf-intro' : ''}`}>{children}</div>;
}
