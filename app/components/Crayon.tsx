import type { CSSProperties } from 'react';
import { SHAPE } from '@/app/data/layers';

// The yellow crayon line that draws itself round a doll when you point at it or tab to it (hp.css,
// .ds-crayon), and the three short shine marks that pop beside its head after. It's the doll's own outline
// (SHAPE, its 200 × 260 box) traced by hand: points round it, pushed out by a gap that drifts a little (a
// hand tracing doesn't keep an even distance), starting at the top of the head and running on past the
// start, so the ends overlap the way a real crayon loop does. Inside the stroke is a scanned wax-crayon
// swatch (public/postcard/wax.png), so the paper shows through its grain, and a slight hand wobble
// (#ds-hand). The line rides along with the doll's hop: DollScene writes the doll's lift to --lift.
// Worked out here, not in the browser, so the server's markup and the page's agree.

type Pt = [number, number];
type Seg = [Pt, Pt, Pt, Pt];

/** SHAPE's segments as cubics (it's only M, C, H and Z) */
function segments(d: string): Seg[] {
  const tok = d.match(/[MCHZ]|-?\d*\.?\d+/g) ?? [];
  const segs: Seg[] = [];
  let i = 0, cur: Pt = [0, 0], start: Pt = [0, 0], cmd = '';
  const num = () => Number(tok[i++]);
  while (i < tok.length) {
    if (/[MCHZ]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'M') { cur = [num(), num()]; start = cur; }
    else if (cmd === 'C') { const a: Pt = [num(), num()], b: Pt = [num(), num()], c: Pt = [num(), num()]; segs.push([cur, a, b, c]); cur = c; }
    else if (cmd === 'H') { const x = num(); const c: Pt = [x, cur[1]]; segs.push([cur, cur, c, c]); cur = c; }
    else if (cmd === 'Z') { if (cur[0] !== start[0] || cur[1] !== start[1]) segs.push([cur, cur, start, start]); cur = start; }
  }
  return segs;
}
const at = ([a, b, c, e]: Seg, t: number): Pt => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1]];
};
// The outline, finely and evenly sampled (by arc length), once
const OUTLINE: Pt[] = (() => {
  const fine: Pt[] = [];
  segments(SHAPE).forEach((s) => { for (let k = 0; k < 60; k++) fine.push(at(s, k / 60)); });
  const len = [0];
  for (let k = 1; k <= fine.length; k++) len.push(len[k - 1] + Math.hypot(fine[k % fine.length][0] - fine[k - 1][0], fine[k % fine.length][1] - fine[k - 1][1]));
  const L = len[len.length - 1], N = 240, out: Pt[] = [];
  let j = 0;
  for (let k = 0; k < N; k++) {
    const want = (k / N) * L;
    while (len[j + 1] < want) j++;
    const f = (want - len[j]) / (len[j + 1] - len[j] || 1), p = fine[j], q = fine[(j + 1) % fine.length];
    out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]);
  }
  return out;
})();
const pointAt = (u: number): Pt => {
  const N = OUTLINE.length, x = (((u % 1) + 1) % 1) * N, k = Math.floor(x), f = x - k;
  const p = OUTLINE[k % N], q = OUTLINE[(k + 1) % N];
  return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
};
const rand = (seed: number) => { let s = seed * 9301 + 49297; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
const f1 = (v: number) => Math.round(v * 10) / 10;

/** The hand-traced loop, `scale` box units to a big doll's unit (small dolls get a wider gap in units, so
 *  it's the same on screen) */
function traced(seed: number, scale: number) {
  const r = rand(seed), N = 150, over = 0.09, start = -0.03 + r() * 0.03, ph1 = r() * 6.28, ph2 = r() * 6.28;
  const pts: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = start + (i / N) * (1 + over);
    const p = pointAt(t), q = pointAt(t + 0.002);
    const dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy) || 1;
    // (SHAPE runs clockwise on screen, so out is to the left of travel in y-down space)
    const nx = dy / m, ny = -dx / m;
    // the gap: about 9 units, breathing, and drifting out a little more as the hand lifts at the end
    const gap = (9 + 2.4 * Math.sin(t * 6.28 * 2 + ph1) + 1.1 * Math.sin(t * 6.28 * 5 + ph2) + (t > 1 ? (t - 1) * 40 : 0)) * scale;
    pts.push([p[0] + nx * gap, p[1] + ny * gap]);
  }
  // Catmull-Rom through the points, as cubics
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

// The shine: three short dashes fanned off the upper left of the head (from a point by the head, out)
const TICKS: [Pt, Pt][] = [[[30, 50], [12, 33]], [[24, 72], [2, 68]], [[30, 95], [12, 102]]];

/** One doll's crayon line; `size` is the doll's height as a share of the big one's */
export function Crayon({ seed, size }: { seed: number; size: number }) {
  const k = 1 / size;
  // ticks: kept the same length on screen, anchored by the head
  const tick = ([a, b]: [Pt, Pt]) => {
    const o: Pt = [40, (a[1] + b[1]) / 2];
    const s = (p: Pt): Pt => [o[0] + (p[0] - o[0]) * k * 0.9, o[1] + (p[1] - o[1]) * Math.min(k, 1.5)];
    const [p, q] = [s(a), s(b)];
    return `M${f1(p[0])} ${f1(p[1])}L${f1(q[0])} ${f1(q[1])}`;
  };
  return (
    <svg className="ds-crayon" viewBox="0 0 200 260" aria-hidden="true" focusable="false" style={{ '--sw': 6.5 * k } as CSSProperties}>
      <path className="ds-wax is-line" d={traced(seed, k)} pathLength={1} />
      {TICKS.map((t, j) => <path key={j} className="ds-wax is-tick" d={tick(t)} pathLength={1} style={{ '--k': j } as CSSProperties} />)}
    </svg>
  );
}

/** The wax and the wobble, once for the set */
export function CrayonDefs() {
  return (
    <svg className="ds-crayon-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="ds-wax" patternUnits="userSpaceOnUse" width="64" height="36">
          <image href="/postcard/wax.png" width="64" height="36" preserveAspectRatio="none" />
        </pattern>
        <filter id="ds-hand" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
