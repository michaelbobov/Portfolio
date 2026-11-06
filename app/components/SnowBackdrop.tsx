'use client';

import { useEffect, useRef } from 'react';

// The homepage's winter, for when the snow is switched on (SnowToggle): a still picture of frosted
// blue-grey winter with a snowfield (public/snow/backdrop.webp, a portrait one on tall screens), and snow
// falling over it, small sharp flakes and big soft ones drifting down at three speeds, a layer between the
// name and the dolls (over the letters, behind the dolls), and more in front of everything (a sparse layer,
// and a few big blurred flakes close to the lens), so the snow has depth round the name and the set. Off, it isn't
// shown at all (so the picture isn't fetched) and the page keeps its plain cold gradient (hp.css). With
// reduced motion the flakes hold still.
//
// The dolls stand in the middle of the picture's snowfield: the picture is laid so the line they stand on
// falls on the sharpest band of its snow (ground, as a share of the picture's height), scaled up from
// `cover` only as much as it takes to still fill the screen. CSS can't know where the dolls' feet are on
// a given screen, so this measures it, and again on a resize or when the snow comes on.
const PICS = {
  wide: { w: 1672, h: 941, ground: 0.79 },
  tall: { w: 941, h: 1672, ground: 0.84 },
};

export default function SnowBackdrop() {
  const pic = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const back = pic.current, winter = back?.parentElement;
    if (!back || !winter) return;
    const portrait = window.matchMedia('(orientation: portrait)');
    const place = () => {
      const ds = document.querySelector<HTMLElement>('.hp .ds');
      if (!ds || document.documentElement.dataset.snow !== 'on') return;
      const box = winter.getBoundingClientRect(), W = box.width, H = box.height;
      if (!W || !H) return;
      // The line they stand on: the set's top plus its height (its padding below is for the labels)
      const base = ds.getBoundingClientRect().top + parseFloat(getComputedStyle(ds).height) - box.top;
      const p = portrait.matches ? PICS.tall : PICS.wide;
      const s = Math.max(W / p.w, H / p.h, base / (p.ground * p.h), (H - base) / ((1 - p.ground) * p.h));
      const w = p.w * s, h = p.h * s;
      back.style.backgroundSize = `${w}px ${h}px`;
      back.style.backgroundPosition = `${(W - w) / 2}px ${base - p.ground * h}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(winter);
    const ds = document.querySelector('.hp .ds');
    if (ds) ro.observe(ds);
    const mo = new MutationObserver(() => requestAnimationFrame(place));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-snow'] });
    portrait.addEventListener('change', place);
    return () => { ro.disconnect(); mo.disconnect(); portrait.removeEventListener('change', place); };
  }, []);
  return (
    <>
      <div className="hp-winter" aria-hidden="true">
        <div ref={pic} className="hp-backdrop" />
        <div className="hp-flakes"><i className="is-far" /><i className="is-mid" /></div>
      </div>
      {/* Between the name and the dolls: snow drifting over the letters, behind the dolls */}
      <div className="hp-flakes hp-flakes-between" aria-hidden="true"><i className="is-between" /></div>
      {/* In front of the dolls and the name */}
      <div className="hp-flakes hp-flakes-front" aria-hidden="true"><i className="is-front" /><i className="is-lens" /></div>
    </>
  );
}
