'use client';

import type { CSSProperties } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The site's navigation on every page but the homepage (where the dolls are the way in): a slim pill
// floating at the bottom, in the same glass as the homepage's labels: a home button first, then one word
// per section, each with that section's painted doll's head (public/dolls/head-*.png). A highlight glides to the item under the pointer (or keyboard
// focus) and rests on the page you're on. The highlight is a second copy of the list, clipped to one
// item, so text and fill change colour together and nothing reflows; the clip is a CSS transition,
// so it retargets smoothly mid-move.
const ITEMS = [
  { href: '/', label: 'Home', icon: '', match: [] as string[] },
  { href: '/work', label: 'Work', icon: '/dolls/head-1.png', match: ['/work/versum', '/work/spotify-loop', '/work/inkling'] },
  { href: '/side-projects', label: 'Side projects', icon: '/dolls/head-2.png', match: [] as string[] },
  { href: '/how-i-work', label: 'How I work', icon: '/dolls/head-3.png', match: [] as string[] },
  { href: '/about', label: 'About me', icon: '/dolls/head-4.png', match: [] as string[] },
];

// eslint-disable-next-line @next/next/no-img-element
const Mark = ({ src }: { src: string }) => <img className="dock-mark" src={src} alt="" width={18} height={18} decoding="async" />;
// Home: a little house, in the item's own colour
const House = () => (
  <svg className="dock-home" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M7.2 1.9a1.2 1.2 0 0 1 1.6 0l5.6 4.9c.4.4.2 1.1-.4 1.1h-.9v5.3c0 .6-.5 1-1 1H9.6v-3.6a.6.6 0 0 0-.6-.6H7a.6.6 0 0 0-.6.6v3.6H3.9c-.5 0-1-.4-1-1V7.9H2c-.6 0-.8-.7-.4-1.1Z" fill="currentColor" />
  </svg>
);
const isHome = (t: (typeof ITEMS)[number]) => t.href === '/';

export default function Dock() {
  const path = usePathname() ?? '/';
  const here = ITEMS.findIndex((t) => path === t.href || t.match.includes(path));
  const [over, setOver] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [clip, setClip] = useState<string | null>(null);

  // Clip the highlight copy to the item being pointed at, else to the page you're on, else to nothing
  const target = over ?? (here >= 0 ? here : null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const items = Array.from(list.querySelectorAll<HTMLElement>('.dock-item'));
      // Nothing to point at: the highlight stays where it was and fades out (is-shown), no jump
      if (target === null || !items[target]) return;
      const el = items[target];
      // offsetLeft is measured from the pill; the lit copy sits over the list, inside the pill's padding
      const left = el.offsetLeft - list.offsetLeft;
      setClip(`inset(0 ${list.clientWidth - left - el.offsetWidth}px 0 ${left}px round 999px)`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [target]);

  const shown = target !== null;
  return (
    <nav className="dock" aria-label="Sections" onPointerLeave={() => setOver(null)}>
      <div className="dock-pill">
        <ul ref={listRef} className="dock-list">
          {ITEMS.map((t, i) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`dock-item${isHome(t) ? ' is-home' : ''}${i === here ? ' is-here' : ''}`}
                aria-current={i === here ? 'page' : undefined}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOver(i); }}
                onFocus={() => setOver(i)}
                onBlur={() => setOver(null)}
              >
                {isHome(t) ? <><House /><span className="sr-only">{t.label}</span></> : <><Mark src={t.icon} />{t.label}</>}
              </Link>
            </li>
          ))}
        </ul>
        {/* The highlight: the same list, lit, clipped to one item */}
        <ul className={`dock-list dock-lit${shown ? ' is-shown' : ''}`} style={{ clipPath: clip ?? 'inset(0 50% 0 50% round 999px)' } as CSSProperties} aria-hidden="true">
          {ITEMS.map((t) => (
            <li key={t.href}>
              <span className={`dock-item${isHome(t) ? ' is-home' : ''}`}>
                {isHome(t) ? <House /> : <><Mark src={t.icon} />{t.label}</>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
