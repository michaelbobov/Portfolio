// A picture -> the clouds' print: cobalt dots on a 15° grid on transparent paper, dot area = tone.
// The Projects page's prints (public/projects/dots-*.webp) were made with it:
//   node scripts/halftone.mjs public/versum-overview.jpg public/projects/dots-versum.webp 1400 10 0 0.14
//   (inkling 0 0.16, spotify-loop 0 0.26, skilltree from projects/skilltree-tree.webp 1 0.1 2.2)
// usage: node scripts/halftone.mjs in out.webp width cell [invert] [lift] [gain]
// (needs sharp, which the project doesn't install: run it with `npx -p sharp node …` or after `npm i --no-save sharp`)
//   invert: ink where the picture is light; lift: tone below this is paper (default .1); gain: ink strength
import sharp from 'sharp';
const [inp, out, wS = '1400', cellS = '10', inv = '0', liftS = '0.1', gainS = '1.15'] = process.argv.slice(2);
const GAIN = Number(gainS);
const W = Number(wS), CELL = Number(cellS), INV = inv === '1', LIFT = Number(liftS);
const img = sharp(inp).removeAlpha().resize(W);
// (a dark UI is inverted, its contrast stretched first, so its text and panels print rather than average away)
const base = INV ? img.clone().greyscale().normalise({ lower: 2, upper: 99 }) : img.clone().greyscale();
const { data: grey, info } = await base.blur(CELL * (INV ? 0.28 : 0.4)).raw().toBuffer({ resolveWithObject: true });
const H = info.height;
const A = 0.2618, ca = Math.cos(A), sa = Math.sin(A);
const o = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const gx = (x * ca - y * sa) / CELL, gy = (x * sa + y * ca) / CELL;
  const cx = Math.floor(gx) + 0.5, cy = Math.floor(gy) + 0.5;
  const px = Math.round((cx * ca + cy * sa) * CELL), py = Math.round((-cx * sa + cy * ca) * CELL);
  let t = 0;
  if (px >= 0 && py >= 0 && px < W && py < H) { const l = grey[py * W + px] / 255; t = INV ? l : 1 - l; }
  // (the print dissolves into the paper at its edges, as the clouds do: a soft falloff over the outer 7%)
  const ss = (e0, e1, v) => { const k = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return k * k * (3 - 2 * k); };
  const edge = ss(0, 0.07 * W, Math.min(px, W - 1 - px)) * ss(0, 0.07 * W, Math.min(py, H - 1 - py));
  const tone = Math.min(1, Math.max(0, (t - LIFT) / (1 - LIFT) * GAIN)) * edge;
  const r = Math.sqrt(tone) * 0.62 * CELL;
  const d = Math.hypot(gx - cx, gy - cy) * CELL;
  const a = Math.min(1, Math.max(0, r - d + 0.5)) * Math.min(1, tone * 25);
  const i = (y * W + x) * 4;
  o[i] = 36; o[i + 1] = 69; o[i + 2] = 181; o[i + 3] = Math.round(a * 255);
}
const r = await sharp(o, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
console.log(out, r.width, r.height, r.size);
