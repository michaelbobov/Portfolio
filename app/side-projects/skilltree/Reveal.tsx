'use client';

import { useEffect } from 'react';

// Entrances: the parts of each section ([data-reveal]) rise in once, staggered by their --i.
// Content is visible without JavaScript; the hidden start state only applies once this has run.
export default function Reveal() {
  useEffect(() => {
    const root = document.querySelector('.stx');
    if (!root) return;
    root.classList.add('stx-js');
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    // Safety net: if the observer never reports (some embedded or headless browsers), show everything.
    let reported = false;
    const fallback = window.setTimeout(() => {
      if (!reported) els.forEach((el) => el.classList.add('is-in'));
    }, 2000);
    const io = new IntersectionObserver(
      (items) => {
        reported = true;
        for (const item of items) {
          if (!item.isIntersecting) continue;
          item.target.classList.add('is-in');
          io.unobserve(item.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);
  return null;
}
