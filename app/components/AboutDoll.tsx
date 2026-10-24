'use client';

import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { FlatDoll } from '@/app/components/DollSet';
import { ArrowUpRight } from '@/app/components/icons';

// The innermost layer: a doll in a doll-shaped frame, and the whole thing is a link to the About
// site. Hovering lifts the top half; clicking twists it off and away, the next doll peeks up out of
// the bottom half, and then the link is followed. Modified clicks (new tab, new window) and reduced
// motion skip the animation and go straight there; coming back with the back button resets it.
const OPEN_MS = 640;

export default function AboutDoll({ href }: { href: string }) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const reset = () => setOpening(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    setOpening(true);
    window.setTimeout(() => { window.location.href = href; }, OPEN_MS);
  };

  return (
    <a className={`ad${opening ? ' is-opening' : ''}`} href={href} onClick={onClick}>
      <span className="ad-frame">
        <span className="ad-inner"><FlatDoll i={1} prefix="adi" /></span>
        <span className="ad-doll"><FlatDoll i={0} prefix="ad" /></span>
      </span>
      <span className="ad-label">
        Open me<span className="sr-only">: more about Michael at about.michaelbobov.com</span>
        <ArrowUpRight size={16} strokeWidth={2.25} />
      </span>
    </a>
  );
}
