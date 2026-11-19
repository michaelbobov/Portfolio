'use client';

import { useEffect, useRef } from 'react';

// The sky's clouds, drawn live: a halftone screen (cobalt dots on a grid turned 15°, as a screen print is)
// through which clouds drift and change shape, after the sky in his postcard: separate masses with heaped,
// uneven tops, flatter bases, ragged edges, a mottled inside where the dots clump big and thin to nothing. It's a small WebGL
// shader on one canvas (multiplied onto the paper, postcard.css), drawn every frame, stopped
// while the hero is off screen or the tab is hidden; with reduced motion it draws one still frame. No
// WebGL: no clouds.

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uSize;   // css px
uniform float uDpr;
uniform float uTime;  // s
uniform vec3 uInk;
uniform vec4 uKeep;   // a box kept clear of cloud (his title): x, y, w, h in css px
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float h1(float n) { return fract(sin(n) * 43758.5453); }
// One row of clouds, as the print's sky has them: separate masses a few hundred px wide, each with a
// billowing, uneven top (several heaps, which slowly rise and churn), a flatter, slightly wavy base, and
// ragged edges that dissolve. The row is cut into slots S px wide; a slot holds a cloud or is left empty
// (the gaps between them); the row travels left at speed px/s. Returns how much cloud (0 to 1) and, in .y,
// how high up its cloud the point is (0 base, 1 top), for the shading.
vec2 row(vec2 px, float baseY, float S, float seed, float speed, float fill) {
  float t = uTime;
  float x = px.x + t * speed;
  float best = 0.0, up = 0.0;
  float i0 = floor(x / S);
  // the ragged edge: the outline is pushed in and out a few px by a fine, churning noise
  float e = (fbm(vec2(x, px.y) / 11.0 + vec2(t * 0.02, -t * 0.015)) - 0.5) * 12.0;
  for (int n = -1; n <= 1; n++) {
    float i = i0 + float(n);
    if (h1(i * 7.13 + seed) > fill) continue;
    float W = S * (0.6 + 0.35 * h1(i * 3.7 + seed + 1.0));
    float cx = (i + 0.5) * S + (h1(i * 5.1 + seed + 2.0) - 0.5) * S * 0.45;
    float u = (x - cx) / (W * 0.5);
    if (abs(u) > 1.15) continue;
    float env = pow(max(0.0, 1.0 - u * u), 0.6);
    float H = W * (0.11 + 0.08 * h1(i * 9.3 + seed + 3.0));
    // (each cloud floats at its own height in the row: a little higher or lower than its neighbours, so the
    // row isn't one level; the spread is a share of the canvas so it stays in bounds at any size)
    float by = baseY + (h1(i * 2.3 + seed + 4.0) - 0.5) * (H * 0.9 + uSize.y * 0.15);
    // the heaps along its top: round (smooth noise, two octaves), each cloud its own, rising slowly
    float heaps = 0.65 * noise(vec2(x / 88.0 + i * 3.1, seed + t * 0.012)) + 0.35 * noise(vec2(x / 40.0 + i * 1.7, seed + 5.0 + t * 0.016));
    float top = by - H * env * (0.2 + 1.25 * heaps);
    // the base curves up at the ends and waves a little; it dissolves rather than ending on a line
    float bot = by - H * 0.22 * (1.0 - env) + H * 0.08 * (noise(vec2(x / 70.0, i + seed + t * 0.008)) - 0.5);
    float inT = (px.y - top + e * 0.7) / 6.0, inB = (bot - px.y + e) / 7.0;
    float v = smoothstep(0.0, 1.0, min(inT, inB)) * smoothstep(0.0, 0.25, env);
    if (v > best) { best = v; up = clamp((by - px.y) / max(1.0, by - top), 0.0, 1.0); }
  }
  return vec2(best, up);
}
void main() {
  vec2 px = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  const float CELL = 4.0, A = 0.2618;
  mat2 r = mat2(cos(A), -sin(A), sin(A), cos(A));
  vec2 g = (r * px) / CELL;
  vec2 id = floor(g) + 0.5;
  vec2 c = (id * CELL) * r;   // the cell's centre back in screen space (r is a rotation: transpose = inverse)
  // two banks: a fuller one high, a thinner one lower, moving a little slower (further off)
  // one row, sparse
  const float SP = 24.0;
  vec2 k = row(c, uSize.y * 0.5, 520.0, 1.3, SP, 0.72);
  float d = k.x;
  // (never behind his title: the keep-out box, faded at its edges)
  vec2 kq = max(uKeep.xy - c, c - (uKeep.xy + uKeep.zw));
  d *= smoothstep(0.0, 28.0, max(kq.x, kq.y));
  float sp = SP;
  // the print's mottle: the ink inside a bank isn't even, it clumps and thins, and the clumps churn slowly,
  // so the dots keep changing size: big in the clumps, tiny where the paper shows through
  float mottle = fbm(vec2(c.x + uTime * sp, c.y) / 11.0 + vec2(uTime * 0.12, -uTime * 0.09));
  // (and a little bigger low in the cloud, its shaded side)
  float ink = d * mix(0.18, 1.2, smoothstep(0.25, 0.75, mottle)) * mix(1.05, 0.6, k.y);
  float rad = sqrt(clamp(ink, 0.0, 1.0)) * 0.62 * CELL;
  float dist = length(g - id) * CELL;
  float aa = 0.6 / uDpr;
  float al = (1.0 - smoothstep(rad - aa, rad + aa, dist)) * step(0.04, ink);
  gl_FragColor = vec4(uInk * al, al) * 0.82;
}`;

export default function CloudPrint() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uSize = u('uSize'), uDpr = u('uDpr'), uTime = u('uTime'), uKeep = u('uKeep');
    gl.uniform3f(u('uInk'), 36 / 255, 69 / 255, 181 / 255);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // (a random start, so it isn't the same sky every visit)
    const t0 = performance.now() - Math.random() * 600000;
    let raf = 0, onScreen = true, dead = false;
    const draw = (now: number) => {
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const size = () => {
      if (dead) return; // (the fonts callback can land after this effect was cleaned up)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uSize, w, h); gl.uniform1f(uDpr, dpr);
      // the box to keep clear: his title under the name, padded
      const role = document.querySelector('.pc-role')?.getBoundingClientRect(), cb = canvas.getBoundingClientRect();
      if (role) gl.uniform4f(uKeep, role.left - cb.left - 16, role.top - cb.top - 14, role.width + 32, role.height + 28);
      else gl.uniform4f(uKeep, -1e5, -1e5, 0, 0);
      draw(performance.now());
    };
    const loop = (now: number) => {
      raf = 0;
      if (!onScreen || document.hidden) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!still && !raf) raf = requestAnimationFrame(loop); };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; start(); });
    io.observe(canvas);
    const vis = () => start();
    document.addEventListener('visibilitychange', vis);
    size(); start();
    // (the title moves once the fonts load: measure its box again then)
    document.fonts?.ready.then(size);
    return () => { dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis);
      // (free what was made, but keep the context: the same canvas may draw again, as React's dev mode does)
      gl.deleteBuffer(buf); gl.deleteProgram(prog); };
  }, []);
  return <canvas ref={ref} className="pc-clouds" aria-hidden="true" />;
}
