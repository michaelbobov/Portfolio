'use client';

import type { MouseEvent, ReactNode } from 'react';

// A card that a pointer can click anywhere on, while its one real link (the a[data-main] inside, its
// name) stays the only way in for the keyboard and screen readers. A click on the card follows that link,
// unless it landed on another link or a button (a play / pause), or the visitor was selecting the card's
// words. Cmd / Ctrl-click opens it in a new tab, as a link would. Without scripts, the name still works.
export default function ClickCard({ className, children }: { className?: string; children: ReactNode }) {
  const go = (e: MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('a, button')) return;
    if (window.getSelection()?.toString()) return;
    const a = e.currentTarget.querySelector<HTMLAnchorElement>('a[data-main]');
    if (!a) return;
    if (e.metaKey || e.ctrlKey) window.open(a.href, '_blank', 'noopener');
    else a.click();
  };
  return <article className={className} onClick={go}>{children}</article>;
}
