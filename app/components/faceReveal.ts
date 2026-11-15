// His painted face melts off into his real one: the doll's glaze runs off from his eyes outwards, in drips
// and islands rather than a neat circle, with a thin cobalt line along the melting edge. Drawn on a canvas
// over the face window: his photo, where the melt has reached.

const MELT_MS = 1150, N = 256, COBALT = [52, 92, 196];

/** When each point of the window melts, 0 to 1, on an N × N grid over it: soonest at his eyes (a little
 *  above the window's middle), spreading outwards, made uneven by a few octaves of smooth noise. From a
 *  fixed seed, so it melts the same way every time. */
function meltMap() {
  const out = new Float32Array(N * N);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const G = 9, grid = Array.from({ length: G * G }, rnd);
  const at = (x: number, y: number) => grid[(((y % G) + G) % G) * G + (((x % G) + G) % G)];
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * sx, b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * sx;
    return a + (b - a) * sy;
  };
  const eyes = { x: 0.5, y: 0.44 };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = i / (N - 1), v = j / (N - 1);
    const d = Math.min(1, Math.hypot((u - eyes.x) * 1.25, v - eyes.y) / 0.62);
    const n = noise(u * 3, v * 3) * 0.55 + noise(u * 7, v * 7) * 0.3 + noise(u * 15, v * 15) * 0.15;
    out[j * N + i] = d * 0.62 + n * 0.38;
  }
  return out;
}

/** Melts the painting off him: draws `img` (his photo, placed at `at` in px, `at.width` wide) on `canvas`
 *  (the window, `size` px square) wherever the melt has reached. Resolves when he's all there. */
export function faceReveal(canvas: HTMLCanvasElement, img: HTMLImageElement, at: { left: number; top: number; width: number }, size: number) {
  return new Promise<void>((done) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * dpr);
    const x = canvas.getContext('2d');
    const map = meltMap();
    const mask = document.createElement('canvas'), edge = document.createElement('canvas');
    mask.width = mask.height = edge.width = edge.height = N;
    const mx = mask.getContext('2d'), ex = edge.getContext('2d');
    if (!x || !mx || !ex) { done(); return; }
    const mi = mx.createImageData(N, N), ei = ex.createImageData(N, N);
    const soft = 0.025, band = 0.014, t0 = performance.now();
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / MELT_MS);
      // (eased in and out, and run a little past the end so the last drips go too)
      const p = (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2) * 1.12 - 0.04;
      for (let q = 0; q < N * N; q++) {
        const d = p - map[q];
        mi.data[q * 4 + 3] = (d <= 0 ? 0 : d >= soft ? 1 : d / soft) * 255;
        ei.data[q * 4] = COBALT[0]; ei.data[q * 4 + 1] = COBALT[1]; ei.data[q * 4 + 2] = COBALT[2];
        ei.data[q * 4 + 3] = Math.exp(-(((d - band) / band) ** 2)) * (1 - k) * 255;
      }
      mx.putImageData(mi, 0, 0); ex.putImageData(ei, 0, 0);
      x.globalCompositeOperation = 'source-over';
      x.clearRect(0, 0, canvas.width, canvas.height);
      x.drawImage(img, at.left * dpr, at.top * dpr, at.width * dpr, at.width * dpr);
      x.globalCompositeOperation = 'destination-in';
      x.drawImage(mask, 0, 0, canvas.width, canvas.height);
      x.globalCompositeOperation = 'source-over';
      x.drawImage(edge, 0, 0, canvas.width, canvas.height);
      if (k < 1) requestAnimationFrame(frame); else done();
    };
    requestAnimationFrame(frame);
  });
}
