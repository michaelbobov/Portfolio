import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SHAPE } from '@/app/data/layers';
import { CHEEK, DOLLS, FRINGE, GOLD, INK, SCARF, SKIN, WAIST, flowerOf, type Doll } from '@/app/data/dolls';
import { DOLL_INTRO } from '@/app/data/intro';

// The homepage matryoshka set in real 3D. Each doll is the flat drawing's own outline spun round its
// axis (a lathe), cut at the waist into a hollow base and a hollow lid, so a doll put inside another
// is really inside it. The flat front painting (scarf, face, fringe, apron, flower) is wrapped round
// the body, so from the front the doll looks exactly like the illustration and from behind you see
// the back of the scarf. A lacquered clearcoat catches soft studio reflections.
//
// The DOM stays in charge (DollSet): the links, captions, hit areas and the open / closed state.
// This scene only draws: it reads where each doll's slot is, mirrors the opening on the same timeline
// (it hears "ds-go" from the set), and reacts to hover and clicks; the dolls watch the cursor and blink
// now and then (their eyes are small glossy beads, not paint, so they can move). It renders only while
// something moves, and shows once its shaders are compiled (ready), so it never stalls the page.

// ---------- the outline, as a profile to spin ----------
// The right half of SHAPE, top to bottom, as cubic segments in the dolls' 200 × 260 box
const SEGS = [
  [[100, 8], [140, 8], [160, 38], [160, 76]],
  [[160, 76], [160, 96], [152, 104], [154, 116]],
  [[154, 116], [158, 136], [184, 160], [184, 200]],
  [[184, 200], [184, 236], [166, 252], [150, 252]],
] as const;
const FLOOR = 252; // the shape's base, as y in the box
const WALL = 4.5; // shell thickness, box units
const BOX_H = 260;

const OUTLINE: { r: number; y: number }[] = [];
for (const [p0, p1, p2, p3] of SEGS) {
  for (let i = OUTLINE.length ? 1 : 0; i <= 40; i++) {
    const t = i / 40, u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    OUTLINE.push({ r: x - 100, y });
  }
}
// The outline's radius at a height (y in the box); it runs top to bottom with y always increasing
function radiusAt(y: number) {
  if (y <= OUTLINE[0].y) return 0;
  for (let i = 1; i < OUTLINE.length; i++) {
    const a = OUTLINE[i - 1], b = OUTLINE[i];
    if (y <= b.y) return a.r + ((y - a.y) / (b.y - a.y || 1)) * (b.r - a.r);
  }
  return OUTLINE[OUTLINE.length - 1].r;
}
const V = (r: number, y: number) => new THREE.Vector2(Math.max(r, 0), FLOOR - y);
const RW = radiusAt(WAIST);
// Outer surfaces, bottom to top (lathe normals face out); inner ones run back down (normals face in)
const BASE_OUTER = [V(0, FLOOR), ...OUTLINE.filter((p) => p.y > WAIST).reverse().map((p) => V(p.r, p.y)), V(RW, WAIST)];
const BASE_INNER = [V(RW, WAIST), V(RW - WALL, WAIST), ...OUTLINE.filter((p) => p.y > WAIST && p.y < FLOOR - WALL).map((p) => V(radiusAt(p.y) - WALL, p.y)), V(radiusAt(FLOOR - WALL) - WALL, FLOOR - WALL), V(0, FLOOR - WALL)];
const LID_OUTER = [V(RW, WAIST), ...OUTLINE.filter((p) => p.y < WAIST).reverse().map((p) => V(p.r, p.y))];
const LID_INNER = [V(0, 8 + WALL), ...OUTLINE.filter((p) => p.y > 8 + WALL && p.y < WAIST).map((p) => V(p.r - WALL, p.y)), V(RW - WALL, WAIST), V(RW, WAIST)];

// A lathe whose texture coordinates are (angle round the doll, height in the box), so lid and base
// share one painting and it lines up across the waist. The seam is at the back.
function lathe(points: THREE.Vector2[], painted: boolean) {
  const g = new THREE.LatheGeometry(points, 112, Math.PI, Math.PI * 2);
  if (painted) {
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - (FLOOR - pos.getY(i)) / BOX_H);
    uv.needsUpdate = true;
  }
  return g;
}

// ---------- the painting ----------
// The flat art is drawn at up to 6 px per box unit (fewer for the small dolls, whose textures are
// smaller), on canvases kept in memory so reading them back is quick, then wrapped
const ART = 6;
function drawArt(d: Doll, front: boolean) {
  const art = ART * Math.max(d.size, 0.5);
  const c = document.createElement('canvas');
  c.width = Math.round(200 * art); c.height = Math.round(BOX_H * art);
  const x = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  x.scale(c.width / 200, c.height / BOX_H);
  // The whole box in the body's colours first, so samples at the very edge never fall off the shape
  x.fillStyle = d.body; x.fillRect(0, 0, 200, WAIST);
  x.fillStyle = d.apron === null ? d.body : d.shade; x.fillRect(0, WAIST, 200, BOX_H - WAIST);
  // The headscarf, grown a little past its outline so it reaches the edge of the head all round
  const scarf = new Path2D(SCARF);
  x.fillStyle = d.scarf; x.strokeStyle = d.scarf; x.lineWidth = 8; x.lineJoin = 'round';
  x.save(); x.clip(new Path2D(SHAPE)); x.fill(scarf); x.stroke(scarf); x.restore();
  x.fill(scarf);
  if (!front) return c;
  x.fillStyle = SKIN; x.beginPath(); x.ellipse(100, 86, 29, 32, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = d.deep; x.fill(new Path2D(FRINGE));
  x.globalAlpha = 0.6; x.fillStyle = CHEEK;
  for (const cx of [84, 116]) { x.beginPath(); x.arc(cx, 100, 5, 0, Math.PI * 2); x.fill(); }
  x.globalAlpha = 1;
  if (d.apron) { x.fillStyle = d.apron; x.beginPath(); x.ellipse(100, 203, 44, 42, 0, 0, Math.PI * 2); x.fill(); }
  const f = flowerOf(d);
  x.fillStyle = d.deep;
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    x.beginPath(); x.arc(100 + Math.cos(a) * f.r * 1.35, f.y + Math.sin(a) * f.r * 1.35, f.r, 0, Math.PI * 2); x.fill();
  }
  x.fillStyle = GOLD; x.beginPath(); x.arc(100, f.y, f.r * 0.9, 0, Math.PI * 2); x.fill();
  return c;
}

// Wrap the flat art round the doll: a point at angle θ and height y on the body shows what the flat
// drawing has at x = 100 + r(y)·sin θ (the front drawing on the front half, the back one behind)
function paint(d: Doll) {
  const fr = drawArt(d, true), bk = drawArt(d, false);
  const fd = (fr.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, fr.width, fr.height).data;
  const bd = (bk.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, bk.width, bk.height).data;
  const W = Math.max(512, Math.round(1536 * d.size / 256) * 256), H = W / 2;
  const out = document.createElement('canvas');
  out.width = W; out.height = H;
  const ox = out.getContext('2d') as CanvasRenderingContext2D;
  const img = ox.createImageData(W, H), o = img.data;
  const sw = fr.width, sh = fr.height, art = sw / 200;
  const sin = new Float32Array(W), cos = new Float32Array(W);
  for (let i = 0; i < W; i++) { const th = ((i + 0.5) / W) * Math.PI * 2 - Math.PI; sin[i] = Math.sin(th); cos[i] = Math.cos(th); }
  for (let j = 0; j < H; j++) {
    const y = ((j + 0.5) / H) * BOX_H, r = radiusAt(Math.min(y, FLOOR)) * 0.985;
    const sy = Math.min(sh - 2, Math.max(0, y * art - 0.5)), y0 = sy | 0, fy = sy - y0;
    for (let i = 0; i < W; i++) {
      const src = cos[i] >= 0 ? fd : bd;
      const sx = Math.min(sw - 2, Math.max(0, (100 + r * sin[i]) * art - 0.5)), x0 = sx | 0, fx = sx - x0;
      const a = (y0 * sw + x0) * 4, b = a + 4, c2 = a + sw * 4, e = c2 + 4, t = (j * W + i) * 4;
      for (let ch = 0; ch < 3; ch++) {
        o[t + ch] = (src[a + ch] * (1 - fx) + src[b + ch] * fx) * (1 - fy) + (src[c2 + ch] * (1 - fx) + src[e + ch] * fx) * fy;
      }
      o[t + 3] = 255;
    }
  }
  ox.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// A soft round contact shadow, drawn once
function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.75)'); g.addColorStop(0.55, 'rgba(0,0,0,0.32)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// ---------- easing ----------
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t, Y = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) { const d = (3 * ax * t + 2 * bx) * t + cx; if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; }
    return Y(Math.min(1, Math.max(0, t)));
  };
}
const EASE_OUT = bezier(0.23, 1, 0.32, 1), EASE_IN_OUT = bezier(0.65, 0, 0.35, 1), GLIDE = bezier(0.45, 0, 0.25, 1);
// A hop: a soft take-off, not a jolt, and a soft landing, not a thud. A lid comes away smoothly, not
// with a snap.
const RISE = bezier(0.3, 0.45, 0.45, 1), FALL = bezier(0.55, 0, 0.6, 0.75), LIFT = bezier(0.4, 0, 0.2, 1);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const HOP = DOLL_INTRO.hop;

type Pose = { x: number; y: number; tilt: number; lean: number };
const SHUT: Pose = { x: 0, y: 0, tilt: 0, lean: 0 };
const LIFTED: Pose = { x: -40, y: 66, tilt: 0.32, lean: 0.16 }; // box units, radians
const PEEK: Pose = { x: 0, y: 12, tilt: 0.09, lean: 0.05 };
const blend = (a: Pose, b: Pose, t: number): Pose => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), tilt: mix(a.tilt, b.tilt, t), lean: mix(a.lean, b.lean, t) });

// ---------- the studio, a doll, a camera: shared by the set and the About page's doll ----------
// The renderer, its light and the lens
function studio(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.98;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.38;
  const key = new THREE.DirectionalLight('#ffffff', 2.1);
  key.position.set(-0.55, 0.9, 0.85);
  const rim = new THREE.DirectionalLight('#c9b6ff', 1.6);
  rim.position.set(0.9, 0.45, -0.8);
  scene.add(key, rim, new THREE.HemisphereLight('#f1eaff', '#140b24', 0.55));
  const camera = new THREE.PerspectiveCamera(16, 1, 1, 20000);
  const shadowTex = shadowTexture();
  const disposables: { dispose: () => void }[] = [renderer, pmrem, env, shadowTex];
  return { renderer, scene, camera, shadowTex, disposables };
}

// A camera just above eye level, looking down 4°, as at a toy on a shelf in front of you (so the faces
// sit where the drawing has them), placed so the floor falls on a line floorPx down the canvas and 1
// world unit is about 1 px there. Returns px per world unit along the floor.
const LOOK = (4 * Math.PI) / 180;
// The contact shadow's depth, as a share of its width: deep enough to read from that low
const SHADOW_D = 0.9;
function aim(camera: THREE.PerspectiveCamera, W: number, Hc: number, floorPx: number) {
  camera.aspect = W / Hc;
  const e = LOOK, D = Hc / 2 / Math.tan(((camera.fov / 2) * Math.PI) / 180);
  let ty = 0;
  for (let it = 0; it < 3; it++) {
    camera.position.set(0, ty + D * Math.sin(e), D * Math.cos(e));
    camera.lookAt(0, ty, 0);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    const p = new THREE.Vector3(0, 0, 0).project(camera);
    const py = (1 - p.y) / 2 * Hc;
    // The floor shows below the centre by the target's height: move the target to put it on the line
    ty += (floorPx - py) / Math.cos(e);
  }
  const a = new THREE.Vector3(0, 0, 0).project(camera), b = new THREE.Vector3(100, 0, 0).project(camera);
  return ((b.x - a.x) / 2) * W / 100;
}

// One doll standing on its floor at the origin: a hollow base and a lid that turns about the rim
// (the littlest is one solid piece), and a contact shadow to lay on the floor under it
function buildDoll(d: Doll, shadowTex: THREE.Texture) {
  const map = paint(d);
  const lacquer = new THREE.MeshPhysicalMaterial({ map, roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.25, sheenColor: new THREE.Color('#ffffff') });
  const inside = new THREE.MeshStandardMaterial({ color: new THREE.Color(d.deep).multiplyScalar(0.55), roughness: 0.85, side: THREE.DoubleSide });
  const group = new THREE.Group();
  let lid: THREE.Group | null = null;
  const geos: THREE.BufferGeometry[] = [];
  if (d.apron === null) {
    const g = lathe([...BASE_OUTER, ...LID_OUTER.slice(1)], true);
    geos.push(g);
    group.add(new THREE.Mesh(g, lacquer));
  } else {
    const g1 = lathe(BASE_OUTER, true), g2 = lathe(BASE_INNER, false), g3 = lathe(LID_OUTER, true), g4 = lathe(LID_INNER, false);
    geos.push(g1, g2, g3, g4);
    group.add(new THREE.Mesh(g1, lacquer), new THREE.Mesh(g2, inside));
    // The lid turns about the rim
    lid = new THREE.Group();
    lid.position.y = FLOOR - WAIST;
    const l1 = new THREE.Mesh(g3, lacquer), l2 = new THREE.Mesh(g4, inside);
    l1.position.y = l2.position.y = -(FLOOR - WAIST);
    lid.add(l1, l2);
    group.add(lid);
  }
  // The eyes: two small glossy beads on the face, on the head (the lid, or the littlest's one piece)
  const eyeGeo = new THREE.SphereGeometry(EYE_R, 20, 14);
  const eyeMat = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 });
  const eyes = [new THREE.Mesh(eyeGeo, eyeMat), new THREE.Mesh(eyeGeo, eyeMat)];
  const head = new THREE.Group();
  head.add(...eyes);
  if (lid) { head.position.y = -(FLOOR - WAIST); lid.add(head); } else group.add(head);
  // Where they look: lx, ly from -1 to 1 (right, up), sliding over the face; open from 1 to 0 (a blink)
  const look = (lx: number, ly: number, open = 1) => {
    eyes.forEach((e, k) => {
      const ex = (k ? 1 : -1) * EYE_DX + lx * 3, ey = EYE_Y - ly * 2.4;
      const r = radiusAt(ey), z = Math.sqrt(Math.max(0, r * r - ex * ex));
      e.position.set(ex, FLOOR - ey, z + 0.2);
      e.rotation.set(0, Math.atan2(ex, z), 0);
      e.scale.set(1, Math.max(0.08, open), 0.3);
    });
  };
  look(0, 0);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.6 }));
  shadow.rotation.x = -Math.PI / 2;
  const disposables: { dispose: () => void }[] = [map, lacquer, inside, eyeGeo, eyeMat, shadow.geometry, shadow.material as THREE.Material, ...geos];
  return { group, lid, shadow, disposables, look };
}

const poseLid = (lid: THREE.Group, pose: Pose) => {
  lid.position.set(pose.x, FLOOR - WAIST + pose.y, 0);
  lid.rotation.set(-pose.lean, 0, pose.tilt);
};

// ---------- the gaze: where the cursor goes, the dolls look ----------
// Like the roly-poly toy (the nevalyashka, the matryoshka's cousin), each doll turns towards the
// cursor and rocks on its base to lean after it, on springs, so it overshoots and wobbles back; a
// quick sweep of the cursor past them sets them rocking. Its eyes go the rest of the way, it squints
// happily under the pointer, and blinks now and then. Mouse only, never with reduced motion.
const EYE_Y = 88, EYE_DX = 10, EYE_R = 3.4, BLINK_MS = 170;
/** Half the doll's base, box units: the corner it rocks on */
const ROCK_R = 66;
type Gaze = { yaw: number; yv: number; roll: number; rv: number; pitch: number; lx: number; ly: number; to: [number, number, number, number, number]; blink: number };
const gaze = (): Gaze => ({ yaw: 0, yv: 0, roll: 0, rv: 0, pitch: 0, lx: 0, ly: 0, to: [0, 0, 0, 0, 0], blink: -1 });
const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v));
// Look at a point dx px right of and dy px above the doll's eyes, on the screen (or straight ahead),
// with the cursor moving at vx px/ms: the nearer it passes, the more its speed rocks the doll
const aimGaze = (g: Gaze, dx: number | null, dy = 0, vx = 0) => {
  if (dx === null) { g.to = [0, 0, 0, 0, 0]; return; }
  const near = Math.exp(-(dx * dx + dy * dy) / (2 * 340 * 340));
  g.to = [
    lim(Math.atan2(dx, 640) * 0.8, 0.6),
    lim(Math.atan2(dy, 900) * 0.25, 0.08),
    lim(dx / 360, 1),
    lim(dy / 300, 1),
    -(lim(dx / 800, 1) * 0.08 + lim(vx * 0.06, 0.2) * (0.3 + 0.7 * near)),
  ];
};
// Springs for the turn and the rock (stiffer for the small ones, so they're quicker and bouncier),
// plain easing for the tilt and the eyes
const stepGaze = (g: Gaze, dt: number, stiff: number) => {
  const s = dt / 1000, c = 2 * Math.sqrt(stiff) * 0.4, cr = 2 * Math.sqrt(stiff * 1.4) * 0.3;
  g.yv += ((g.to[0] - g.yaw) * stiff - g.yv * c) * s; g.yaw += g.yv * s;
  g.rv += ((g.to[4] - g.roll) * stiff * 1.4 - g.rv * cr) * s; g.roll += g.rv * s;
  g.pitch += (g.to[1] - g.pitch) * (1 - Math.exp(-dt / 150));
  const ke = 1 - Math.exp(-dt / 50);
  g.lx += (g.to[2] - g.lx) * ke; g.ly += (g.to[3] - g.ly) * ke;
  if (g.blink >= 0) { g.blink += dt; if (g.blink > BLINK_MS) g.blink = -1; }
};
const gazeStill = (g: Gaze) => g.blink < 0 && Math.abs(g.yv) < 0.01 && Math.abs(g.rv) < 0.01 && Math.abs(g.to[0] - g.yaw) < 0.002 && Math.abs(g.to[4] - g.roll) < 0.002 && Math.abs(g.to[1] - g.pitch) < 0.002 && Math.abs(g.to[2] - g.lx) < 0.01 && Math.abs(g.to[3] - g.ly) < 0.01;
// How open the eyes are: a blink closes them; a happy squint (0 to 1) narrows them
const openOf = (g: Gaze, squint = 0) => (g.blink < 0 ? 1 : 1 - Math.sin((Math.PI * g.blink) / BLINK_MS)) * (1 - 0.62 * squint);
// The cursor's sideways speed, px/ms, smoothed; it fades out once the cursor stops
const speedo = () => {
  let x = 0, t = 0, v = 0;
  return {
    move: (nx: number, nt: number) => { if (t && nt > t) v = v * 0.5 + lim((nx - x) / (nt - t), 4) * 0.5; x = nx; t = nt; },
    decay: (dt: number) => { v *= Math.exp(-dt / 90); if (Math.abs(v) < 0.001) v = 0; return v; },
    get: () => v,
  };
};
// Each doll blinks on its own random clock; returns the way to stop
const blinker = (gazes: Gaze[], kick: () => void) => {
  const timers: number[] = [];
  const next = (g: Gaze, k: number) => { timers[k] = window.setTimeout(() => { g.blink = 0; kick(); next(g, k); }, 2600 + Math.random() * 4200); };
  gazes.forEach(next);
  return () => timers.forEach((t) => window.clearTimeout(t));
};
// Where the pointer is (mouse only), or null once it has left the page
const watchPointer = (onMove: (p: { x: number; y: number; t: number } | null) => void) => {
  const move = (e: PointerEvent) => { if (e.pointerType === 'mouse') onMove({ x: e.clientX, y: e.clientY, t: e.timeStamp }); };
  const out = (e: PointerEvent) => { if (!e.relatedTarget) onMove(null); };
  const blur = () => onMove(null);
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerout', out);
  window.addEventListener('blur', blur);
  return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); window.removeEventListener('blur', blur); };
};
// A point in the scene, in page px
const toPage = (camera: THREE.Camera, canvas: HTMLCanvasElement, p: THREE.Vector3) => {
  const r = canvas.getBoundingClientRect();
  p.project(camera);
  return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
};

// The hover moves, tw ms in. Every doll hops (a jump lift high, then a smaller one, with a squash on
// each landing). The littlest then turns right round ('spin'); the second doll throws its lid instead
// of the second hop ('flip'): a somersault towards you, so you see inside it, and it drops back on.
type Move = 'hop' | 'spin' | 'flip';
const MOVE_MS: Record<Move, number> = { hop: 720, spin: 1400, flip: 1180 };
const hop = (tw: number, a: number, b: number, lift: number) => { const u = (tw - a) / (b - a); return u > 0 && u < 1 ? lift * (u < 0.5 ? RISE(u / 0.5) : 1 - FALL((u - 0.5) / 0.5)) : 0; };
const squash = (tw: number, c: number, amt: number) => { const u = Math.abs(tw - c) / 90; return u < 1 ? amt * (1 - u) : 0; };
function moveAt(move: Move, tw: number, lift: number) {
  const flip = move === 'flip';
  const q = squash(tw, 330, 0.07) + (flip ? squash(tw, 980, 0.05) : squash(tw, 620, 0.04));
  return {
    y: hop(tw, 0, 320, lift) + (flip ? 0 : hop(tw, 380, 610, lift * 0.5)),
    sx: 1 + q, sy: 1 - q,
    spin: move === 'spin' ? Math.PI * 2 * EASE_IN_OUT(clamp((tw - 640) / 720)) : 0,
  };
}
// The thrown lid, tw ms into a flip: up on an arc and once round, as anything thrown goes (a parabola,
// an even turn), back on at 970 ms with a tiny bounce. It turns about its middle, LID_C above the rim.
// Null while it sits on the doll.
const LID_C = 60;
function flipAt(tw: number) {
  const f = (tw - 330) / 640;
  if (f <= 0 || tw >= 1120) return null;
  if (f >= 1) return { up: hop(tw, 970, 1120, 5), turn: 0 };
  return { up: 4 * f * (1 - f) * 118, turn: Math.PI * 2 * f };
}

export type DollScene = { go: (open: boolean, step: number, lead: number, elapsed?: number) => void; ready: Promise<void>; dispose: () => void };

export function createDollScene(root: HTMLElement, canvas: HTMLCanvasElement): DollScene {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const { renderer, scene, camera, shadowTex, disposables } = studio(canvas);

  // ---------- the dolls ----------
  const n = DOLLS.length;
  const dolls = DOLLS.map((d) => {
    const { group, lid, shadow, disposables: own, look } = buildDoll(d, shadowTex);
    scene.add(group, shadow);
    disposables.push(...own);
    return { d, group, lid, shadow, look, gaze: gaze(), hover: 0, hoverTo: 0, visit: -1, play: -1 };
  });

  // ---------- where the slots are ----------
  let X: number[] = [], S: number[] = [], closedShift = 0, k = 1;
  const layout = () => {
    const W = canvas.clientWidth, Hc = canvas.clientHeight;
    if (!W || !Hc) return;
    renderer.setSize(W, Hc, false);
    const track = root.querySelector<HTMLElement>('.ds-track');
    const slots = Array.from(root.querySelectorAll<HTMLElement>('.ds-slot'));
    if (!track || slots.length < n) return;
    // Layout positions (transform-free) relative to the canvas, in px
    const cx = (s: HTMLElement) => track.offsetLeft + s.offsetLeft + s.offsetWidth / 2 - canvas.offsetLeft;
    const floorPx = track.offsetTop + slots[0].offsetTop + slots[0].offsetHeight - (8 / BOX_H) * slots[0].offsetHeight - canvas.offsetTop;
    k = aim(camera, W, Hc, floorPx);
    X = slots.map((s) => (cx(s) - W / 2) / k);
    S = slots.map((s) => s.offsetHeight / BOX_H / k);
    closedShift = (track.clientWidth / 2 - (slots[0].offsetLeft + slots[0].offsetWidth / 2)) / k;
  };

  // ---------- the opening, on the set's timeline ----------
  let step = DOLL_INTRO.step, lead = DOLL_INTRO.lead, total = (n - 2) * step + lead + HOP, t = root.classList.contains('is-open') ? total : 0, dir = 0;
  const heightOf = (i: number) => (FLOOR - 8) * S[i];
  // Each doll's move, and its jump: about the same few px for all, a touch more for the big ones
  const MOVES: Move[] = ['hop', 'flip', 'hop', 'spin'];
  const liftOf = (i: number) => heightOf(n - 1) * 0.18 + (heightOf(i) - heightOf(n - 1)) * 0.05;
  const apply = () => {
    const shift = closedShift * (1 - EASE_IN_OUT(t / total));
    dolls.forEach((o, i) => {
      let x = X[0], y = 0;
      for (let r = 1; r <= i; r++) {
        const s0 = (r - 1) * step;
        x += (X[r] - X[r - 1]) * GLIDE(clamp((t - (s0 + lead + HOP * 0.3)) / (HOP * 0.7)));
        const u = (t - (s0 + lead)) / HOP;
        if (u > 0 && u < 1) y += heightOf(r - 1) * 0.46 * (u < 0.45 ? RISE(u / 0.45) : 1 - FALL((u - 0.45) / 0.55));
      }
      // Its lid: lifts as the next doll comes out, holds, settles
      let pose = SHUT;
      if (o.lid) {
        const u = t - i * step, d = lead + HOP * 0.75, hold = lead + HOP * 0.4;
        if (u > 0 && u < d) pose = u < lead ? blend(SHUT, LIFTED, LIFT(u / lead)) : u < hold ? LIFTED : blend(LIFTED, SHUT, EASE_IN_OUT((u - hold) / (d - hold)));
      }
      // Hover, a click, and each doll's move, all only while the set is still. Held hover lifts the lid
      // a crack (not on the doll that throws its lid)
      let sx = 1, sy = 1, spin = 0, thrown: ReturnType<typeof flipAt> = null;
      if (o.lid && MOVES[i] !== 'flip') pose = blend(pose, PEEK, o.hover * (pose === SHUT ? 1 : 0));
      if (o.visit >= 0) {
        const v = clamp(o.visit / 460);
        if (o.lid) pose = blend(pose, LIFTED, EASE_OUT(v));
        else y += heightOf(i) * 0.22 * Math.sin(Math.PI * v);
      }
      if (o.play >= 0) {
        const m = moveAt(MOVES[i], o.play, liftOf(i));
        y += m.y; sx = m.sx; sy = m.sy; spin = m.spin;
        if (MOVES[i] === 'flip') thrown = flipAt(o.play);
      }
      o.group.position.set(x + shift, y, 0);
      o.group.scale.set(S[i] * sx, S[i] * sy, S[i] * sx);
      // The gaze, once the doll is out of the set (nested, it would poke through): turned, tilted, and
      // rocked onto the corner of its base, lifted so that corner stays on the floor
      const out = i === 0 ? 1 : clamp((t - ((i - 1) * step + lead + HOP * 0.6)) / (HOP * 0.4));
      const g = o.gaze, roll = g.roll * out;
      o.group.position.y += Math.abs(Math.sin(roll)) * ROCK_R * S[i];
      o.group.rotation.set(-g.pitch * out, spin + g.yaw * out, roll);
      o.look(g.lx, g.ly, openOf(g, o.hover));
      if (o.lid) {
        poseLid(o.lid, pose);
        if (thrown) {
          o.lid.rotation.set(thrown.turn, 0, 0);
          o.lid.position.y += thrown.up + LID_C * (1 - Math.cos(thrown.turn));
          o.lid.position.z = -LID_C * Math.sin(thrown.turn);
        }
      }
      // The floor shadow: the small ones' show once they've landed; it fades as the doll lifts
      const land = i === 0 ? 1 : clamp((t - ((i - 1) * step + lead + HOP * 0.6)) / (HOP * 0.4));
      const w = 168 * S[i];
      o.shadow.position.set(x + shift, 0.5, 0);
      o.shadow.scale.set(w * 1.25 * (1 - y / (heightOf(i) * 1.6)), w * SHADOW_D, 1);
      (o.shadow.material as THREE.MeshBasicMaterial).opacity = 0.62 * land * clamp(1 - y / (heightOf(i) * 0.9));
    });
  };

  // ---------- the loop: runs only while something moves ----------
  let raf = 0, last = 0, live = false, gone = false;
  // (a click's opening holds its pose once played, so it counts as still)
  const still = () => dir === 0 && dolls.every((o) => Math.abs(o.hover - o.hoverTo) < 0.002 && (o.visit < 0 || o.visit >= 460) && o.play < 0 && gazeStill(o.gaze));
  // The gaze: towards the pointer while the set is still, straight ahead while it opens
  let pointer: { x: number; y: number } | null = null;
  const speed = speedo();
  const eye = new THREE.Vector3();
  const aimAll = () => dolls.forEach((o, i) => {
    if (!pointer || dir !== 0 || !S[i]) return aimGaze(o.gaze, null);
    const e = toPage(camera, canvas, eye.set(o.group.position.x, (FLOOR - EYE_Y) * S[i], 0));
    aimGaze(o.gaze, pointer.x - e.x, e.y - pointer.y, speed.get());
  });
  const frame = (now: number) => {
    const dt = Math.min(48, now - (last || now));
    last = now;
    if (dir) {
      t += dir * dt;
      // Stop at the end it's heading for (it starts at the other one)
      if (dir > 0 && t >= total) { t = total; dir = 0; } else if (dir < 0 && t <= 0) { t = 0; dir = 0; }
    }
    const moving = dir !== 0;
    speed.decay(dt);
    aimAll();
    dolls.forEach((o, i) => {
      // (the littlest is quickest and bounciest, the big one heaviest, so the set moves in a ripple)
      stepGaze(o.gaze, dt, 70 + i * 26);
      const to = moving ? 0 : o.hoverTo;
      o.hover += (to - o.hover) * (1 - Math.exp(-dt / 70));
      if (o.visit >= 0) o.visit = Math.min(o.visit + dt, 460);
      if (o.play >= 0) { o.play += dt; if (o.play > MOVE_MS[MOVES[i]]) o.play = -1; }
    });
    apply();
    if (live) renderer.render(scene, camera);
    if (still()) { raf = 0; last = 0; } else raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const go = (open: boolean, s: number, l: number, elapsed = 0) => {
    if (reduce.matches) { t = open ? total : 0; dir = 0; kick(); return; }
    if (dir) { dir = -dir; kick(); return; }
    step = s; lead = l; total = (n - 2) * step + lead + HOP;
    t = open ? Math.min(total, elapsed) : Math.max(0, total - elapsed);
    dir = (open ? t < total : t > 0) ? (open ? 1 : -1) : 0;
    kick();
  };

  // ---------- hover and clicks ----------
  const setHover = (i: number | null) => {
    if (reduce.matches) return;
    const open = root.classList.contains('is-open');
    dolls.forEach((o, j) => {
      const on = i === j && (open || j === 0);
      if (on && o.hoverTo === 0 && dir === 0 && o.play < 0) o.play = 0;
      o.hoverTo = on ? 1 : 0;
    });
    kick();
  };
  const slots = Array.from(root.querySelectorAll<HTMLElement>('.ds-slot'));
  const off: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Document, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn as EventListener);
    off.push(() => el.removeEventListener(type, fn as EventListener));
  };
  slots.forEach((s, i) => {
    on(s, 'pointerenter', (e) => { if (e.pointerType === 'mouse') setHover(i); });
    on(s, 'pointerleave', () => setHover(null));
    on(s, 'click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || reduce.matches) return;
      dolls[i].visit = 0; dolls[i].play = -1; kick();
    });
  });
  if (!reduce.matches) {
    off.push(watchPointer((p) => { pointer = p; if (p) speed.move(p.x, p.t); kick(); }));
    off.push(blinker(dolls.map((o) => o.gaze), kick));
  }
  // Coming back with the back button: the click's opening shouldn't still be held
  const onShow = () => { dolls.forEach((o) => { o.visit = -1; }); kick(); };
  window.addEventListener('pageshow', onShow);
  off.push(() => window.removeEventListener('pageshow', onShow));

  const ro = new ResizeObserver(() => { layout(); apply(); if (live) renderer.render(scene, camera); });
  ro.observe(root);
  layout(); apply();
  // Compile the shaders off the main thread where the browser can, then draw the first frame
  const ready = renderer.compileAsync(scene, camera).catch(() => scene).then(() => {
    if (gone) return;
    live = true; layout(); apply(); renderer.render(scene, camera);
  });

  return {
    go,
    ready,
    dispose: () => {
      gone = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      off.forEach((f) => f());
      disposables.forEach((x) => x.dispose());
    },
  };
}

// ---------- the About page's doll ----------
// The big doll alone in its arch, with the next one inside it. On hover it does the little bounce and
// a real turn (so you see the back of its scarf). Opening twists the lid off, up and out of the arch,
// and the next doll rises out of the cup; closing plays it back, so the lid drops back on. The DOM
// keeps the button and its state (AboutDoll), and the flat doll beneath marks where it stands.
export type AboutScene = { set: (open: boolean) => void; ready: Promise<void>; dispose: () => void };

const AWAY: Pose = { x: 70, y: 320, tilt: -0.55, lean: 0.25 }; // the lid, gone out of the top of the arch
const OPEN_MS = 640;
const RISE_BY = 42; // how far the next doll comes up, box units: head and shoulders, its flower still in the cup

export function createAboutScene(root: HTMLElement, canvas: HTMLCanvasElement): AboutScene {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const { renderer, scene, camera, shadowTex, disposables } = studio(canvas);
  const outer = buildDoll(DOLLS[0], shadowTex), inner = buildDoll(DOLLS[1], shadowTex);
  const g = gaze();
  // The next doll stands on the first one's inner floor, inside it, so it goes wherever that goes
  inner.group.scale.setScalar(DOLLS[1].size);
  outer.group.add(inner.group);
  scene.add(outer.group, outer.shadow);
  disposables.push(...outer.disposables, ...inner.disposables);

  let S = 1;
  const layout = () => {
    const W = canvas.clientWidth, Hc = canvas.clientHeight;
    const box = root.querySelector<HTMLElement>('.ad-doll');
    if (!W || !Hc || !box) return;
    renderer.setSize(W, Hc, false);
    // Stand where the flat doll stands in the frame
    const h = box.offsetHeight;
    const k = aim(camera, W, Hc, box.offsetTop + h - (8 / BOX_H) * h - canvas.offsetTop);
    S = h / BOX_H / k;
  };

  let u = root.classList.contains('is-opening') ? OPEN_MS : 0, dir = 0, twirl = -1;
  const apply = () => {
    const H = (FLOOR - 8) * S;
    let y = 0, sx = 1, sy = 1, spin = 0;
    if (twirl >= 0) ({ y, sx, sy, spin } = moveAt('spin', twirl, H * 0.18));
    outer.group.position.set(0, y + Math.abs(Math.sin(g.roll)) * ROCK_R * S, 0);
    outer.group.scale.set(S * sx, S * sy, S * sx);
    outer.group.rotation.set(-g.pitch, spin + g.yaw, g.roll);
    outer.look(g.lx, g.ly, openOf(g, sq));
    inner.look(g.lx, g.ly, openOf(g, sq));
    // The lid comes straight up first, then swings away on a twist
    if (outer.lid) {
      const up = EASE_OUT(clamp(u / 520)), side = EASE_IN_OUT(clamp((u - 60) / 460));
      poseLid(outer.lid, { x: AWAY.x * side, y: AWAY.y * up, tilt: AWAY.tilt * side, lean: AWAY.lean * side });
      outer.lid.rotation.y = -0.7 * up;
    }
    inner.group.position.y = WALL + RISE_BY * EASE_OUT(clamp((u - 140) / (OPEN_MS - 140)));
    const w = 168 * S;
    outer.shadow.position.set(0, 0.5, 0);
    outer.shadow.scale.set(w * 1.25 * (1 - y / (H * 1.6)), w * SHADOW_D, 1);
    (outer.shadow.material as THREE.MeshBasicMaterial).opacity = 0.5 * clamp(1 - y / (H * 0.9));
  };

  let raf = 0, last = 0, live = false, gone = false;
  let pointer: { x: number; y: number } | null = null, inside = false, sq = 0;
  const speed = speedo();
  const eye = new THREE.Vector3();
  const frame = (now: number) => {
    const dt = Math.min(48, now - (last || now));
    last = now;
    if (dir) {
      u += dir * dt;
      if (dir > 0 && u >= OPEN_MS) { u = OPEN_MS; dir = 0; } else if (dir < 0 && u <= 0) { u = 0; dir = 0; }
    }
    if (twirl >= 0) { twirl += dt; if (twirl > MOVE_MS.spin) twirl = -1; }
    // It watches the pointer, except while it opens or turns
    speed.decay(dt);
    if (pointer && dir === 0 && twirl < 0 && S) {
      const e = toPage(camera, canvas, eye.set(0, (FLOOR - EYE_Y) * S, 0));
      aimGaze(g, pointer.x - e.x, e.y - pointer.y, speed.get());
    } else aimGaze(g, null);
    stepGaze(g, dt, 90);
    // A happy squint while the pointer is on it
    sq += ((inside ? 1 : 0) - sq) * (1 - Math.exp(-dt / 90));
    apply();
    if (live) renderer.render(scene, camera);
    if (dir === 0 && twirl < 0 && gazeStill(g) && Math.abs((inside ? 1 : 0) - sq) < 0.01) { raf = 0; last = 0; } else raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const set = (open: boolean) => {
    twirl = -1;
    if (reduce.matches) { u = open ? OPEN_MS : 0; dir = 0; } else dir = open ? 1 : -1;
    kick();
  };
  // The bounce and turn, only while it's closed and still
  const enter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduce.matches) return;
    inside = true; kick();
    if (dir !== 0 || u > 0 || twirl >= 0) return;
    twirl = 0; kick();
  };
  const leave = () => { inside = false; kick(); };
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  const stops: Array<() => void> = [];
  if (!reduce.matches) {
    stops.push(watchPointer((p) => { pointer = p; if (p) speed.move(p.x, p.t); kick(); }));
    stops.push(blinker([g], kick));
  }

  const ro = new ResizeObserver(() => { layout(); apply(); if (live) renderer.render(scene, camera); });
  ro.observe(root);
  layout(); apply();
  const ready = renderer.compileAsync(scene, camera).catch(() => scene).then(() => {
    if (gone) return;
    live = true; layout(); apply(); renderer.render(scene, camera);
  });

  return {
    set,
    ready,
    dispose: () => {
      gone = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener('pointerenter', enter);
      root.removeEventListener('pointerleave', leave);
      stops.forEach((f) => f());
      disposables.forEach((x) => x.dispose());
    },
  };
}
