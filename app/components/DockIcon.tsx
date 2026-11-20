'use client';

import { useId, type ReactElement } from 'react';

// The dock's app icons, after Apple's newest: a tile of tinted glass in a soft gradient of its own colour,
// and one white symbol on it, its details cut clean through (an SVG mask, so the tile shows in the holes),
// lit only by a faint shadow under it (home.css). No gloss, no 3D. Colours are CSS (home.css: --t1/--t2 per
// project), so the set is one place to change. 64 × 64 units, symbols in the middle ~38.
// Classes in a symbol: f = filled, s = a line, c = cut out (a hole), c-s = a line cut out.
const GLYPHS: Record<string, ReactElement> = {
  // Intent OS: a four-petal flower, as on its card
  'intent-os': (
    <g>
      {[45, 135, 225, 315].map((a) => <path key={a} className="f" d="M32 32 C24.4 27.4 23.4 17.8 30 13.9 C31.3 13.2 32.7 13.2 34 13.9 C40.6 17.8 39.6 27.4 32 32 Z" transform={`rotate(${a} 32 32)`} />)}
      <circle className="c" cx="32" cy="32" r="3" />
    </g>
  ),
  // SkillTree: a little tree of skills, a root and three branches, each ending in a node
  skilltree: (
    <g>
      <path className="s" d="M32 41 V33 M19 33 H45 M19 33 V27 M32 33 V27 M45 33 V27" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="f" x="25.5" y="40" width="13" height="13" rx="4" />
      <rect className="f" x="13" y="15" width="12" height="12" rx="3.6" />
      <rect className="f" x="26" y="15" width="12" height="12" rx="3.6" />
      <rect className="f" x="39" y="15" width="12" height="12" rx="3.6" />
      <circle className="c" cx="32" cy="46.5" r="2.2" />
    </g>
  ),
  // Inkling: a fountain pen's nib, its slit and breather hole cut through
  inkling: (
    <g>
      <path className="f" d="M24 12 H40 C41.1 12 42 12.9 42 14 V19.5 L46.5 30.5 C46.9 31.4 46.8 32.4 46.3 33.2 L33.7 52.6 C32.9 53.8 31.1 53.8 30.3 52.6 L17.7 33.2 C17.2 32.4 17.1 31.4 17.5 30.5 L22 19.5 V14 C22 12.9 22.9 12 24 12 Z" />
      <path className="c-s" d="M22 20 H42" strokeWidth="2" />
      <circle className="c" cx="32" cy="32" r="3.4" />
      <path className="c-s" d="M32 35.5 V51" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),
  // Versum Health: a molar, and a sparkle
  versum: (
    <g>
      <path className="f" d="M22.5 15 C16.8 15 14 19.4 14 25.4 C14 31 16.8 34 17.8 38.8 C19 44.6 19.8 51 24.2 51 C27.6 51 28.2 45.4 29.2 41.4 C29.9 38.8 30.8 37.6 32 37.6 C33.2 37.6 34.1 38.8 34.8 41.4 C35.8 45.4 36.4 51 39.8 51 C44.2 51 45 44.6 46.2 38.8 C47.2 34 50 31 50 25.4 C50 19.4 47.2 15 41.5 15 C37.6 15 35.6 17 32 17 C28.4 17 26.4 15 22.5 15 Z" />
      <path className="c" d="M38.6 21.2 L39.6 24 L42.4 25 L39.6 26 L38.6 28.8 L37.6 26 L34.8 25 L37.6 24 Z" />
    </g>
  ),
  // Spotify Loop: a repeat arrow round a few bars of a song
  'spotify-loop': (
    <g>
      <path className="s" d="M48 30.4 A16.2 16.2 0 1 1 42.6 20.6" strokeWidth="3.8" strokeLinecap="round" />
      <path className="f" d="M47.2 25.6 L38.4 24 C37.6 23.9 37.3 22.9 37.8 22.3 L43.6 15.6 C44.1 15 45.1 15.2 45.3 16 L48.3 24.4 C48.5 25.1 47.9 25.7 47.2 25.6 Z" />
      <rect className="f" x="24.6" y="28.5" width="4" height="10" rx="2" />
      <rect className="f" x="30" y="24" width="4" height="19" rx="2" />
      <rect className="f" x="35.4" y="27.5" width="4" height="12" rx="2" />
    </g>
  ),
  // EZ Recipe: a pot with steam rising
  'ez-recipe': (
    <g>
      <path className="s" d="M26 19 c-2.3-2.3 2.3-4 0-6.4 M32 18 c-2.3-2.3 2.3-4 0-6.4 M38 19 c-2.3-2.3 2.3-4 0-6.4" strokeWidth="2.6" strokeLinecap="round" />
      <rect className="f" x="14" y="24" width="36" height="5" rx="2.5" />
      <path className="f" d="M16.5 31 H47.5 V41.5 C47.5 47.3 43.8 51 38 51 H26 C20.2 51 16.5 47.3 16.5 41.5 Z" />
      <path className="s" d="M11.5 35 H16.5 M47.5 35 H52.5" strokeWidth="3.4" strokeLinecap="round" />
      <path className="c-s" d="M22.5 37 V42" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
  // about.michaelbobov.com: a little retro computer, a window open on its screen
  'about-site': (
    <g>
      <rect className="f" x="13" y="12" width="38" height="30" rx="6" />
      <rect className="c" x="17.5" y="16.5" width="29" height="21" rx="3" />
      <rect className="f" x="22" y="21" width="16" height="11" rx="1.6" />
      <path className="c-s" d="M22 24.4 H38" strokeWidth="1.6" />
      <path className="f" d="M26.5 42 H37.5 L39.5 47 H24.5 Z" />
      <rect className="f" x="20" y="47" width="24" height="4.4" rx="2.2" />
    </g>
  ),
  // Résumé: a page with a folded corner and lines of text
  resume: (
    <g>
      <path className="f" d="M20 12 H37.5 L47 21.5 V49 C47 50.7 45.7 52 44 52 H20 C18.3 52 17 50.7 17 49 V15 C17 13.3 18.3 12 20 12 Z" />
      <path className="c" d="M36 12 V20 C36 21.7 37.3 23 39 23 H47 V21.5 L37.5 12 Z" />
      <path className="c-s" d="M23 29 H35 M23 35 H41 M23 41 H41 M23 47 H33" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  ),
  // About me: a person, head and shoulders
  'about-me': (
    <g>
      <circle className="f" cx="32" cy="22.5" r="9.5" />
      <path className="f" d="M14 50 C14 40.2 22 34 32 34 C42 34 50 40.2 50 50 C50 51.4 48.9 52.5 47.5 52.5 H16.5 C15.1 52.5 14 51.4 14 50 Z" />
    </g>
  ),
  // Contact: an envelope, its flap folded in
  contact: (
    <g>
      <rect className="f" x="12" y="17" width="40" height="30" rx="6" />
      <path className="c-s" d="M16 22 L30 32.6 C31.2 33.5 32.8 33.5 34 32.6 L48 22" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

export default function DockIcon({ id, className = '' }: { id: string; className?: string }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg className={`di is-${id} ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`t${u}`} x1="0.2" y1="0" x2="0.6" y2="1"><stop offset="0" className="di-t1" /><stop offset="1" className="di-t2" /></linearGradient>
        <linearGradient id={`g${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="di-g1" /><stop offset="1" className="di-g2" /></linearGradient>
        <mask id={`m${u}`} className="di-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">{GLYPHS[id]}</mask>
      </defs>
      <rect className="di-tile" x="1.5" y="1.5" width="61" height="61" rx="16" fill={`url(#t${u})`} />
      <rect className="di-glyph" x="0" y="0" width="64" height="64" fill={`url(#g${u})`} mask={`url(#m${u})`} />
    </svg>
  );
}
