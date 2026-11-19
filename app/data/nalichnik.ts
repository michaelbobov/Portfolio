// A carved Russian window (a nalichnik) in the dolls' Gzhel: white wood, cobalt carving. A pointed
// kokoshnik pediment with a sun rosette, carved pilasters, a sill with a fringe of drops, and two shutters
// with a painted flower. Drawn in a 320 × 440 box. The pieces are solid shapes (the 3D window extrudes
// them, Nalichnik3D) and the painting is SVG (its carving texture, and the flat window without WebGL).

export const C = '#2f4f9e';
export const WOOD = '#fbfaf7';
export const BOX = { w: 320, h: 440 };
/** The window's opening: the photo sits in it */
export const OPEN = { x: 56, y: 136, w: 208, h: 240 };
/** The shutters: shut, they cover the opening and the pilasters; they hinge on the frame's outer edges
 *  and open right back, flat against the wall beside it */
export const SHUTTERS = { x: 24, y: 136, w: 272, h: 240 };
/** Where a picture is held when it's cropped to the opening: its point (shares of its width and height)
 *  kept in view; by default the middle, a little above centre (faces are high in portraits) */
export type Focus = { x: number; y: number };
export const FOCUS: Focus = { x: 0.5, y: 0.28 };
/** The stage round the window: room for the open shutters */
export const STAGE = { x0: -120, x1: BOX.w + 120, y0: -6, y1: BOX.h + 16 };

const scallops = Array.from({ length: 10 }, (_, i) => 20 + i * 28);
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

/** The frame's solid pieces, front to back: how far each stands out (its depth) */
export const PIECES: { d: string; depth: number }[] = [
  { d: 'M18 124 C40 124 70 96 100 74 C130 54 150 42 160 8 C170 42 190 54 220 74 C250 96 280 124 302 124 Z', depth: 10 }, // pediment
  { d: 'M14 120 H306 V136 H14 Z', depth: 16 }, // top beam
  { d: 'M24 136 H56 V376 H24 Z', depth: 13 }, // pilasters
  { d: 'M264 136 H296 V376 H264 Z', depth: 13 },
  { d: 'M8 376 H312 V392 H8 Z', depth: 18 }, // sill
  { d: `M16 392 ${scallops.map(() => 'a14 14 0 0 0 28 0').join(' ')} L296 392 Z`, depth: 7 }, // fringe
  ...scallops.map((x) => ({ d: ring(x + 14, 414, 3.6), depth: 7 })), // drops
];

/** The frame, painted: the pieces in white with cobalt outlines, and the carving */
export function frameSvg(shadow = true) {
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX.w} ${BOX.h}" width="${BOX.w}" height="${BOX.h}">`);
  if (shadow) out.push('<defs><filter id="nl-soft" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#13224a" flood-opacity="0.18"/></filter></defs>');
  out.push(`<g ${shadow ? 'filter="url(#nl-soft)"' : ''} fill="${WOOD}" stroke="${C}" stroke-width="1.6" stroke-linejoin="round">`);
  PIECES.forEach((p) => out.push(`<path d="${p.d}"/>`));
  out.push('</g>');
  out.push(`<g fill="none" stroke="${C}" stroke-width="2" stroke-linecap="round"><path d="M40 116 C66 112 88 92 108 78 M280 116 C254 112 232 92 212 78"/><path d="M70 108 c8 -14 22 -14 24 -2 M250 108 c-8 -14 -22 -14 -24 -2"/><path d="M118 66 c6 -10 14 -12 20 -8 M202 66 c-6 -10 -14 -12 -20 -8"/></g>`);
  out.push(`<g fill="${C}"><circle cx="160" cy="80" r="9"/>`);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2, x = 160 + Math.cos(a) * 19, y = 80 + Math.sin(a) * 19;
    out.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5.5" ry="2.6" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  }
  for (let i = 0; i < 13; i++) out.push(`<circle cx="${40 + i * 20}" cy="128" r="2.2"/>`);
  for (let i = 0; i < 14; i++) out.push(`<circle cx="${30 + i * 20}" cy="384" r="2"/>`);
  for (let i = 0; i < 8; i++) out.push(`<path d="M40 ${152 + i * 29} l7 9 l-7 9 l-7 -9 Z"/><path d="M280 ${152 + i * 29} l7 9 l-7 9 l-7 -9 Z"/>`);
  out.push('</g></svg>');
  return out.join('');
}

/** One shutter, painted (both sides are): a carved panel with a flower; `side` puts its latch on the
 *  edge that meets the other shutter */
export function shutterSvg(side: 'l' | 'r') {
  const w = SHUTTERS.w / 2, h = SHUTTERS.h, m = w / 2;
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${(m + Math.cos(a) * 13).toFixed(1)}" cy="${(120 + Math.sin(a) * 13).toFixed(1)}" r="8.5"/>`;
  }).join('');
  const leaves = `<path d="M${m} 52 c-14 10 -14 26 0 34 c14 -8 14 -24 0 -34 Z M${m} 154 c-14 10 -14 26 0 34 c14 -8 14 -24 0 -34 Z"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
    + `<rect x="0" y="0" width="${w}" height="${h}" fill="${WOOD}" stroke="${C}" stroke-width="1.8"/>`
    + `<rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="4" fill="none" stroke="${C}" stroke-width="1.5"/>`
    + `<rect x="17" y="17" width="${w - 34}" height="${h - 34}" rx="3" fill="none" stroke="${C}" stroke-width="0.8" stroke-dasharray="2 4"/>`
    + `<path d="M${m} 28 L${w - 22} 120 L${m} 212 L22 120 Z" fill="none" stroke="${C}" stroke-width="1.5"/>`
    + `<g fill="${C}">${petals}<circle cx="${m}" cy="120" r="6" fill="${WOOD}"/>${leaves}<circle cx="${side === 'l' ? w - 7 : 7}" cy="120" r="3.2"/></g></svg>`;
}
