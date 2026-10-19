'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// The homepage intro (headline lines rise out of their masks) plays once per
// page load. The class is in the server markup so the CSS starts on first paint; a timer then
// removes it so nothing can be left hidden, and client-side returns to "/" skip it.
let introPlayed = false;

export default function IntroStage({ className = '', children }: { className?: string; children: ReactNode }) {
  const [intro, setIntro] = useState(() => !introPlayed);

  useEffect(() => {
    introPlayed = true;
    if (!intro) return;
    const t = window.setTimeout(() => setIntro(false), 2600);
    return () => window.clearTimeout(t);
  }, [intro]);

  return <div className={`${className}${intro ? ' wf-intro' : ''}`}>{children}</div>;
}
