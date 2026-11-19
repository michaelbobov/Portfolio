import * as THREE from 'three';

// Snow in three.js: a couple of thousand flakes in real depth in front of a camera focused on the dolls.
// Flakes near the lens are big soft discs, flakes at the dolls' distance are sharp little crumbs that
// tumble (flicker narrow and wide) and streak slightly as they fall, far ones are small and hazy. Each
// sways on its own helix, a slow gusting wind carries them all, and the camera leans a little with the
// pointer round the dolls, so near snow slides one way and far snow the other.
//
// Cheap by design: every flake's position is worked out on the GPU from the time and its own seed, so no
// JavaScript runs per flake; one WebGL context on an OffscreenCanvas draws every layer and hands each its
// frame as an ImageBitmap (no copy); the canvas is drawn at no more than 1.5× (soft flakes don't need
// retina pixels), steps down if frames run long, and nothing draws when nothing shows.
//
// Two places use it, never at once: the homepage's winter with snow on (SnowBackdrop: three layers, behind
// the name, between the name and the dolls, in front of the dolls, so the dolls really stand in the snow),
// and the window through the glass name with snow off (GlassName: the same snow, seen through the letters
// where the window is). On trial behind ?snow=3d (snowFlag).

const FOV = 40, FOCUS = 7;
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
// Blur (circle of confusion) as a share of the view's height, per unit of 1/depth away from the focus:
// stronger in front of the dolls than behind them, as a portrait lens's would be
const NEAR_K = 0.14, FAR_K = 0.05;
// The DOM layers they're drawn into, as depth bands: the snow behind the name, the snow between the name
// and the dolls, the snow in front of the dolls (and how strong each is; the front stays light so the name
// and the labels read)
const BANDS: { from: number; to: number; opacity: number }[] = [
  { from: 8.6, to: 99, opacity: 1 },
  { from: 6.8, to: 8.6, opacity: 1 },
  { from: 0, to: 6.8, opacity: 0.85 },
];
// How many flakes at which depths, and how big (world units, about metres)
const GROUPS = [
  { n: 22, d: [0.8, 2.6], size: [0.016, 0.026] },
  { n: 210, d: [2.6, 6.8], size: [0.015, 0.03] },
  { n: 340, d: [6.8, 8.6], size: [0.015, 0.032] },
  { n: 1300, d: [8.6, 42], size: [0.014, 0.03] },
];
// Steps down when frames run long: [pixel ratio cap, share of the flakes]
const QUALITY: [number, number][] = [[1.5, 1], [1, 1], [1, 0.6], [0.75, 0.4]];

const vertex = /* glsl */ `
attribute vec4 aA; // start across, start down (-1..1), phase, a random number
attribute vec4 aB; // depth, size, fall speed, sway
uniform float uTime, uFullH, uAspect, uWindVel, uOpacity;
uniform vec2 uWind, uTarget, uBand;
varying vec2 vP;
varying float vAlpha, vBlur, vSpin, vSquash, vLen, vR, vRnd, vTwinkle;
const float TAN = ${TAN.toFixed(6)}, FOCUS = ${FOCUS.toFixed(1)}, NEAR_K = ${NEAR_K}, FAR_K = ${FAR_K};
void main() {
  float d0 = aB.x;
  if (d0 < uBand.x || d0 >= uBand.y) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float t = uTime, ph = aA.z, rnd = aA.w;
  float w = 0.45 + rnd * 0.8;
  float s = sin(t * w + ph), c = cos(t * w + ph);
  float d = d0 + aB.w * 0.5 * c;
  // its size on screen and its blur, in device pixels
  float focal = 0.5 * uFullH / TAN;
  float px = aB.y * focal / d;
  float coc = d < FOCUS ? NEAR_K * uFullH * (1.0 / d - 1.0 / FOCUS) : FAR_K * uFullH * (1.0 / FOCUS - 1.0 / d);
  float big = max(px, coc);
  float r = 0.5 * big + 0.75;
  // where it is: falling and swaying, carried by the wind, wrapping round a box a little bigger than the
  // view at its depth, so nothing pops in at an edge
  float margin = r * d / focal + 0.35;
  float hh = d0 * TAN + margin, hw = d0 * TAN * uAspect + margin;
  float y = aA.y * hh - aB.z * t;
  y = mod(y + hh, 2.0 * hh) - hh;
  float x = aA.x * hw + uWind.x * (0.75 + 0.5 * rnd) + aB.w * s;
  x = mod(x + hw, 2.0 * hw) - hw;
  vec4 clip = projectionMatrix * viewMatrix * vec4(x, y, -d, 1.0);
  // a short streak along the way it's moving (as a camera sees it), sharp flakes only
  vec2 vel = vec2(uWindVel * (0.75 + 0.5 * rnd) + aB.w * w * c, -aB.z) * focal / d;
  vBlur = coc / (coc + px + 0.001);
  float len = 1.0 + clamp(length(vel) / 90.0 / (2.0 * r), 0.0, 2.0) * (1.0 - vBlur);
  vec2 dir = normalize(vel + vec2(0.0, -0.0001)), side = vec2(-dir.y, dir.x);
  vec2 off = side * position.x * r + dir * position.y * r * len;
  clip.xy += off * 2.0 / uTarget * clip.w;
  gl_Position = clip;
  // how strong: dimmer as it blurs (its light spread wider), fainter if smaller than a pixel, hazy far off
  float a = 0.92 * pow((px + 1.0) / (big + 1.0), 0.6);
  a *= clamp(px / 1.6, 0.35, 1.0);
  a *= 1.0 - smoothstep(28.0, 48.0, d);
  vAlpha = a * uOpacity;
  float tumble = t * (0.6 + 1.8 * fract(rnd * 7.31)) + ph * 3.0;
  vSpin = tumble * 0.5;
  vSquash = mix(1.0, 0.55 + 0.45 * abs(cos(tumble * 0.7)), 1.0 - vBlur);
  vTwinkle = 0.8 + 0.2 * abs(sin(tumble));
  vP = position.xy; vLen = len; vR = r; vRnd = rnd;
}`;

const fragment = /* glsl */ `
varying vec2 vP;
varying float vAlpha, vBlur, vSpin, vSquash, vLen, vR, vRnd, vTwinkle;
void main() {
  // a capsule along the streak, squashed across as the flake tumbles edge-on
  vec2 q = vec2(vP.x / vSquash, vP.y * vLen);
  float seg = vLen - 1.0;
  vec2 e = vec2(q.x, max(abs(q.y) - seg, 0.0));
  float dist = length(e);
  // a sharp flake is an uneven crumb; a blurred one, an even disc
  float ang = atan(e.y, e.x) + vSpin;
  float edge = 1.0 + (1.0 - vBlur) * 0.22 * (0.6 * sin(3.0 * ang + vRnd * 6.283) + 0.4 * sin(5.0 * ang + vRnd * 12.0));
  float R = mix(0.78, 0.94, vBlur) * edge;
  float soft = mix(clamp(1.4 / vR, 0.05, 0.6), 0.2, vBlur);
  float m = 1.0 - smoothstep(R - soft, R, dist);
  float k = dist / R;
  // bright at the heart of a sharp flake, with a faint cool edge so it reads on white; a bokeh disc is even,
  // a touch brighter at its rim
  float body = mix(1.0 - 0.35 * k * k, 0.85 + 0.15 * smoothstep(0.5, 1.0, k), vBlur);
  vec3 col = mix(vec3(0.7, 0.76, 0.86), vec3(0.97, 0.98, 1.0), mix(smoothstep(1.0, 0.45, k), 1.0, vBlur));
  float a = vAlpha * m * body * vTwinkle;
  gl_FragColor = vec4(col * a, a);
}`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function flakes(share: number) {
  const rnd = rng(11);
  const list: number[][] = [];
  for (const g of GROUPS) {
    for (let i = 0; i < Math.round(g.n * share); i++) {
      // (far snow thins with depth, so the distance isn't all specks)
      const d = Math.sqrt(g.d[0] ** 2 + (g.d[1] ** 2 - g.d[0] ** 2) * rnd());
      const size = g.size[0] + (g.size[1] - g.size[0]) * rnd() ** 1.6;
      list.push([rnd() * 2 - 1, rnd() * 2 - 1, rnd() * Math.PI * 2, rnd(), d, size, 0.22 + 0.2 * rnd(), 0.04 + 0.16 * rnd()]);
    }
  }
  // shuffled, so drawing fewer of them thins every depth alike
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  const a = new Float32Array(list.length * 4), b = new Float32Array(list.length * 4);
  list.forEach((f, i) => { a.set(f.slice(0, 4), i * 4); b.set(f.slice(4), i * 4); });
  const quad = new THREE.PlaneGeometry(2, 2);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = quad.index;
  geo.setAttribute('position', quad.getAttribute('position'));
  geo.setAttribute('aA', new THREE.InstancedBufferAttribute(a, 4));
  geo.setAttribute('aB', new THREE.InstancedBufferAttribute(b, 4));
  geo.instanceCount = list.length;
  return geo;
}

type Layers = { ctxs: ImageBitmapRenderingContext[]; canvases: HTMLCanvasElement[]; box: HTMLElement; visible: boolean; w: number; h: number; stop: () => void };
type Lens = { canvas: HTMLCanvasElement; ctx: ImageBitmapRenderingContext; active: () => boolean; until: number };

class Snow {
  private canvas = new OffscreenCanvas(1, 1);
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 100);
  private scene = new THREE.Scene();
  private material: THREE.ShaderMaterial;
  private geo: THREE.InstancedBufferGeometry;
  private total: number;
  private sized = '';
  private raf = 0; private last = 0; private time = 0; private wind = 0;
  private px = 0; private py = 0; private tx = 0; private ty = 0;
  private level = 0; private acc = 0; private count = 0; private slow = 0; private drawn = 0;
  layers: Layers | null = null;
  lens: Lens | null = null;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false, premultipliedAlpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    const small = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700;
    this.geo = flakes(small ? 0.5 : 1);
    this.total = this.geo.instanceCount;
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex, fragmentShader: fragment, transparent: true, depthTest: false, depthWrite: false, premultipliedAlpha: true, side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 }, uFullH: { value: 1 }, uAspect: { value: 1 }, uWindVel: { value: 0 }, uOpacity: { value: 1 },
        uWind: { value: new THREE.Vector2() }, uTarget: { value: new THREE.Vector2(1, 1) }, uBand: { value: new THREE.Vector2(0, 99) },
      },
    });
    const mesh = new THREE.Mesh(this.geo, this.material);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      this.tx = (e.clientX / innerWidth) * 2 - 1; this.ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  wake = () => { if (!this.raf) { this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); } };

  private size(w: number, h: number) {
    const key = `${w}x${h}`;
    if (key !== this.sized) { this.renderer.setSize(w, h, false); this.sized = key; }
  }

  private frame = (now: number) => {
    this.raf = 0;
    const on = document.documentElement.dataset.snow === 'on';
    const L = this.layers, N = this.lens;
    const layers = !!L && on && L.visible && L.w > 0;
    let lens = false;
    if (!layers && N && !on) { if (N.active()) N.until = now + 450; lens = now < N.until; }
    if (!layers && !lens) return;
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000)); this.last = now;
    this.time += dt;
    const T = this.time;
    const gust = Math.sin(T * 0.13) * 0.6 + Math.sin(T * 0.31 + 1.7) * 0.3 + Math.sin(T * 0.71 + 4.1) * 0.1;
    const windVel = 0.05 + 0.09 * gust;
    this.wind += windVel * dt;
    // the camera leans with the pointer, round the dolls (they stay put; near snow and far snow part)
    this.px += (this.tx - this.px) * 0.05; this.py += (this.ty - this.py) * 0.05;
    this.camera.position.set(this.px * 0.14, -this.py * 0.08, 0);
    this.camera.lookAt(0, 0, -FOCUS);
    const u = this.material.uniforms;
    u.uTime.value = T; u.uWindVel.value = windVel; u.uWind.value.set(this.wind, 0);
    if (layers && L) this.drawLayers(L, dt); else if (N) this.drawLens(N);
    if (!this.drawn++) document.documentElement.dataset.snow3d = '';
    this.raf = requestAnimationFrame(this.frame);
  };

  private drawLayers(L: Layers, dt: number) {
    const [cap, share] = QUALITY[this.level];
    const dpr = Math.min(devicePixelRatio || 1, cap);
    const W = Math.max(1, Math.round(L.w * dpr)), H = Math.max(1, Math.round(L.h * dpr));
    this.size(W, H);
    this.geo.instanceCount = Math.round(this.total * share);
    this.camera.clearViewOffset();
    this.camera.aspect = L.w / L.h;
    this.camera.updateProjectionMatrix();
    const u = this.material.uniforms;
    u.uFullH.value = H; u.uAspect.value = L.w / L.h; u.uTarget.value.set(W, H);
    BANDS.forEach((band, i) => {
      const c = L.canvases[i];
      if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
      u.uBand.value.set(band.from, band.to); u.uOpacity.value = band.opacity;
      this.renderer.render(this.scene, this.camera);
      L.ctxs[i].transferFromImageBitmap(this.canvas.transferToImageBitmap());
    });
    // a step down if frames run long for two stretches of two seconds running (not counting the first
    // three, while the page and its dolls load)
    if (++this.count > 180) {
      this.acc += dt;
      if (this.count % 120 === 0) {
        this.slow = this.acc / 120 > 0.024 ? this.slow + 1 : 0;
        if (this.slow >= 2 && this.level < QUALITY.length - 1) { this.level++; this.slow = 0; }
        this.acc = 0;
      }
    }
  }

  private drawLens(N: Lens) {
    // (its frame, the lens: the canvas itself is hidden until the first frame is drawn)
    const r = (N.canvas.parentElement ?? N.canvas).getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    this.size(W, H);
    this.geo.instanceCount = Math.round(this.total * QUALITY[this.level][1]);
    const fw = innerWidth, fh = Math.max(innerHeight, 640);
    this.camera.aspect = fw / fh;
    this.camera.setViewOffset(fw, fh, r.left, r.top, r.width, r.height);
    const u = this.material.uniforms;
    u.uFullH.value = fh * dpr; u.uAspect.value = fw / fh; u.uTarget.value.set(W, H);
    u.uBand.value.set(0, 99); u.uOpacity.value = 1;
    if (N.canvas.width !== W || N.canvas.height !== H) { N.canvas.width = W; N.canvas.height = H; }
    this.renderer.render(this.scene, this.camera);
    N.ctx.transferFromImageBitmap(this.canvas.transferToImageBitmap());
  }
}

let snow: Snow | null = null;
const get = () => (snow ??= new Snow());

function bitmap(c: HTMLCanvasElement) {
  const ctx = c.getContext('bitmaprenderer');
  if (!ctx) throw new Error('no bitmaprenderer');
  return ctx;
}

/** The homepage's winter: `canvases` behind the name, between it and the dolls, and in front, all the size
 *  of `box`. Draws while the snow is on and the box is on screen. Returns a detach. */
export function attachLayers(canvases: HTMLCanvasElement[], box: HTMLElement) {
  const s = get();
  const measure = () => { const r = box.getBoundingClientRect(); L.w = r.width; L.h = r.height; s.wake(); };
  const io = new IntersectionObserver(([e]) => { L.visible = e.isIntersecting; s.wake(); });
  const ro = new ResizeObserver(measure);
  const mo = new MutationObserver(s.wake);
  const L: Layers = {
    canvases, ctxs: canvases.map(bitmap), box, visible: true, w: 0, h: 0,
    stop: () => { io.disconnect(); ro.disconnect(); mo.disconnect(); },
  };
  s.layers = L;
  io.observe(box); ro.observe(box);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-snow'] });
  measure();
  return () => { L.stop(); if (s.layers === L) s.layers = null; };
}

/** The window through the glass name: draws into `canvas` (wherever it is on screen) while `active()`,
 *  with the snow off. Call `wake` when it may have become active. */
export function attachLens(canvas: HTMLCanvasElement, active: () => boolean) {
  const s = get();
  const N: Lens = { canvas, ctx: bitmap(canvas), active, until: 0 };
  s.lens = N;
  return { wake: s.wake, detach: () => { if (s.lens === N) s.lens = null; } };
}
