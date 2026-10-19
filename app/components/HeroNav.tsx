'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

// Homepage top bar. It floats over the hero photo in white, and once the hero has scrolled out
// from under it, it turns ink on the page ground (a class swap; the colours transition in CSS).
// Without script it is not fixed (see the <noscript> rule in page.tsx), so it never sits
// white-on-ground.
export default function HeroNav({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const bar = ref.current;
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (!bar || !hero || !('IntersectionObserver' in window)) {
      bar?.classList.remove('on-photo');
      return;
    }
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        ([entry]) => bar.classList.toggle('on-photo', entry.isIntersecting),
        { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px`, threshold: 0 }
      );
      io.observe(hero);
    };
    watch();
    window.addEventListener('resize', watch);
    return () => {
      io?.disconnect();
      window.removeEventListener('resize', watch);
    };
  }, []);

  return (
    <header ref={ref} className="wf-topbar on-photo">
      {children}
    </header>
  );
}
