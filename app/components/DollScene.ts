import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SHAPE } from '@/app/data/layers';
import { CHEEK, DOLLS, DOLL_ART, FRINGE, GOLD, INK, SCARF, SET_SIZE, SKIN, WAIST, flowerOf, type Doll } from '@/app/data/dolls';
import { ME } from '@/app/data/me';
import { DOLL_INTRO } from '@/app/data/intro';
import { currentSeason } from '@/app/data/season';
import { CROP, PAINTING_ASPECT, PLAQUE, SKY, VILLAGE_DOLL, ZOOM, artRect, seg } from '@/app/data/village';
import { zoomBus } from '@/app/components/zoomBus';
import type { Village } from '@/app/components/VillageScene';

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
export const FLOOR = 252; // the shape's base, as y in the box
const WALL = 4.5; // shell thickness, box units
const BOX_H = 260;

export const OUTLINE: { r: number; y: number }[] = [];
for (const [p0, p1, p2, p3] of SEGS) {
  for (let i = OUTLINE.length ? 1 : 0; i <= 40; i++) {
    const t = i / 40, u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    OUTLINE.push({ r: x - 100, y });
  }
}
// The outline's radius at a height (y in the box); it runs top to bottom with y always increasing
export function radiusAt(y: number) {
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
// (or, for a painted doll, its painting)
function drawArt(d: Doll, front: boolean, img?: HTMLImageElement) {
  const art = ART * Math.max(d.size, 0.5);
  const c = document.createElement('canvas');
  c.width = Math.round(200 * art); c.height = Math.round(BOX_H * art);
  const x = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  x.scale(c.width / 200, c.height / BOX_H);
  if (img) { x.drawImage(img, 0, 0, 200, BOX_H); return c; }
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
function paint(d: Doll, pic?: Art) {
  const fr = drawArt(d, true, pic?.front), bk = drawArt(d, false, pic?.back);
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

// The painted dolls' fronts and backs (DOLL_ART), loaded once for every scene; a doll whose pictures
// fail stays drawn from its colours
type Art = { front: HTMLImageElement; back: HTMLImageElement };
const loadImage = (src: string) => new Promise<HTMLImageElement>((ok, no) => {
  const im = new Image();
  im.decoding = 'async'; im.onload = () => ok(im); im.onerror = no; im.src = src;
});
let artLoad: Promise<(Art | null)[]> | null = null;
const loadArt = () => (artLoad ??= Promise.all(DOLL_ART.map((a) => (a
  ? Promise.all([loadImage(a.front), loadImage(a.back)]).then(([front, back]) => ({ front, back })).catch(() => null)
  : null))));

// ---------- the village painted on the Work doll (data/village, VillageScene) ----------
// The village (porcelain figurines, VillageScene), rendered from its postcard camera into a texture and
// laid on the doll's belly in her arched window (her painting, doll-2-front, leaves it as a pale sky; the
// mask is that window's interior, traced off her painting): what shows in her window is the world itself.
// (the window's interior, traced off her painting: white inside, black outside)
const maskTexture = () => new THREE.TextureLoader().loadAsync('/village/window-mask.png');
// Its mesh: a grid over the painting's place that lies on the doll's curve (a hair outside it) and can
// flatten into a plane in front of it, the view the village then takes over from. Flat, a point at (fx, fy)
// in the doll's box sits at fx - 100 across, so the plane keeps the painting's proportions exactly; on the
// curve it sits where the body's painting has the same point (paint() wraps at 0.985 of the radius).
const PLAQUE_Z = Math.max(...Array.from({ length: 31 }, (_, j) => radiusAt(PLAQUE.y + (PLAQUE.h * j) / 30))) + 0.6;
function bellyMesh(mask: THREE.Texture) {
  const NX = 48, NY = 30, n = (NX + 1) * (NY + 1);
  const curved = new Float32Array(n * 3), flat = new Float32Array(n * 3), nCurved = new Float32Array(n * 3);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), index: number[] = [];
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i, fx = PLAQUE.x + (PLAQUE.w * i) / NX, fy = PLAQUE.y + (PLAQUE.h * j) / NY;
      const r = radiusAt(fy), X = (fx - 100) / 0.985, Z = Math.sqrt(Math.max(0, r * r - X * X));
      curved.set([X, FLOOR - fy, Z + 0.35], k * 3);
      flat.set([fx - 100, FLOOR - fy, PLAQUE_Z], k * 3);
      // (the body's own normal there: outward, tipped up or down by the slope of the outline, so the painting
      // takes the light exactly as the porcelain round it does)
      const l = Math.hypot(X, Z) || 1, slope = (radiusAt(fy + 0.5) - radiusAt(fy - 0.5)), nl = Math.hypot(1, slope);
      nCurved.set([X / l / nl, slope / nl, Z / l / nl], k * 3);
      uv.set([i / NX, 1 - j / NY], k * 2);
      if (i < NX && j < NY) { const b = k + NX + 1; index.push(k, b, k + 1, k + 1, b, b + 1); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(index);
  // Three passes, back to front: the painting glazed like the body (it's on the doll); then, as it
  // flattens, a plain sky of the same cobalt and the plain picture over it (unlit, not tone-mapped), so at
  // the handoff the screen shows exactly what the village's own render will
  const off = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, transparent: true, depthWrite: false, alphaMap: mask };
  const glazed = new THREE.MeshPhysicalMaterial({ roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.25, sheenColor: new THREE.Color('#ffffff'), opacity: 0, ...off });
  const sky = new THREE.MeshBasicMaterial({ color: SKY, toneMapped: false, opacity: 0, ...off });
  const plain = new THREE.MeshBasicMaterial({ toneMapped: false, opacity: 0, ...off });
  const meshes = [glazed, sky, plain].map((m, i) => { const me = new THREE.Mesh(g, m); me.renderOrder = 1 + i; return me; });
  const group = new THREE.Group();
  group.add(...meshes);
  let at = -1, shown = 0;
  const setFlat = (f: number) => {
    sky.opacity = plain.opacity = f * shown;
    glazed.opacity = shown;
    if (f === at) return;
    at = f;
    for (let k = 0; k < n * 3; k++) pos[k] = curved[k] + (flat[k] - curved[k]) * f;
    for (let k = 0; k < n; k++) {
      const nx = nCurved[k * 3] * (1 - f), ny = nCurved[k * 3 + 1] * (1 - f), nz = nCurved[k * 3 + 2] * (1 - f) + f, l = Math.hypot(nx, ny, nz) || 1;
      nor[k * 3] = nx / l; nor[k * 3 + 1] = ny / l; nor[k * 3 + 2] = nz / l;
    }
    g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true;
    g.computeBoundingSphere();
  };
  setFlat(0);
  return {
    group, setFlat,
    /** put the painting on (its texture), and how much of it shows (it fades in once, when first painted) */
    paint: (tex: THREE.Texture) => { glazed.map = plain.map = tex; glazed.needsUpdate = plain.needsUpdate = true; },
    show: (a: number) => { shown = a; at = -1; },
    disposables: [g, glazed, sky, plain] as { dispose: () => void }[],
  };
}

// A soft round contact shadow, drawn once
function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  // Deep under the base, a little cool, as on snow
  g.addColorStop(0, 'rgba(18,28,56,0.75)'); g.addColorStop(0.55, 'rgba(22,34,66,0.32)'); g.addColorStop(1, 'rgba(24,36,72,0)');
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
// The dive is one move: it gathers speed into the doll's window (DIVE_IN) and carries it on into the
// village, slowing to a stop there (DIVE_OUT), so it never halts at the handoff
const DIVE_IN = bezier(0.45, 0, 0.8, 0.55), DIVE_OUT = bezier(0.2, 0.45, 0.35, 1);
// A hop: a soft take-off, not a jolt, and a soft landing, not a thud. A lid comes away smoothly, not
// with a snap.
const RISE = bezier(0.3, 0.45, 0.45, 1), FALL = bezier(0.55, 0, 0.6, 0.75), LIFT = bezier(0.4, 0, 0.2, 1);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const HOP = DOLL_INTRO.hop;

type Pose = { x: number; y: number; tilt: number; lean: number };
const SHUT: Pose = { x: 0, y: 0, tilt: 0, lean: 0 };
const LIFTED: Pose = { x: -40, y: 66, tilt: 0.32, lean: 0.16 }; // box units, radians
// Hover opens a doll: the lid lifts and tilts aside, clearly open, held while the pointer's on it
const PEEK: Pose = { x: -12, y: 30, tilt: 0.17, lean: 0.08 };
const blend = (a: Pose, b: Pose, t: number): Pose => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), tilt: mix(a.tilt, b.tilt, t), lean: mix(a.lean, b.lean, t) });

// ---------- the studio, a doll, a camera: shared by the set and the About page's doll ----------
// The renderer, its light and the lens
export function studio(canvas: HTMLCanvasElement) {
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
  const rim = new THREE.DirectionalLight('#cfe0ff', 1.6);
  rim.position.set(0.9, 0.45, -0.8);
  scene.add(key, rim, new THREE.HemisphereLight('#f4f8ff', '#4a5d85', 0.55));
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
export function aim(camera: THREE.PerspectiveCamera, W: number, Hc: number, floorPx: number) {
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
  camera.userData.target = new THREE.Vector3(0, ty, 0);
  const a = new THREE.Vector3(0, 0, 0).project(camera), b = new THREE.Vector3(100, 0, 0).project(camera);
  return ((b.x - a.x) / 2) * W / 100;
}

// ---------- the seasons (data/season.ts) ----------
// Real models, loaded only in their season (public/seasons): a Santa hat by J-Toastie (CC BY 3.0, via Poly
// Pizza; credited in the site's footer) and a pumpkin by Quaternius (CC0). Both are low-poly, so their
// corners are welded and their normals averaged when they load: the facets shade as smooth curves, like
// the porcelain beside them. Each comes back centred on the floor (y = 0 at its lowest point).
type SeasonModel = { object: THREE.Object3D; size: THREE.Vector3; parts: { dispose: () => void }[] };
async function loadSeasonModel(src: string, recolour?: (m: THREE.MeshStandardMaterial) => void): Promise<SeasonModel | null> {
  try {
    const [{ GLTFLoader }, { mergeVertices }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/utils/BufferGeometryUtils.js'),
    ]);
    const gltf = await new GLTFLoader().loadAsync(src);
    const parts: { dispose: () => void }[] = [];
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      let g = m.geometry;
      if (!mat.map) { if (g.attributes.uv) g.deleteAttribute('uv'); }
      g.deleteAttribute('normal');
      g = mergeVertices(g, 1e-4); g.computeVertexNormals();
      m.geometry = g;
      mat.flatShading = false; mat.roughness = 0.6; mat.metalness = 0;
      recolour?.(mat);
      mat.needsUpdate = true;
      parts.push(g, mat);
    });
    const box = new THREE.Box3().setFromObject(gltf.scene), c = box.getCenter(new THREE.Vector3());
    gltf.scene.position.set(-c.x, -box.min.y, -c.z);
    const object = new THREE.Group(); object.add(gltf.scene);
    return { object, size: box.getSize(new THREE.Vector3()), parts };
  } catch {
    return null;
  }
}
// A copy of the hat on a doll's head (in the head's coordinates: box units, y up from the floor), sitting
// down over the crown, tipped a little to one side, its tail drooping to the side
function wearHat(head: THREE.Group, hat: SeasonModel) {
  const crown = 34, wide = radiusAt(crown) * 2.2;
  const h = hat.object.clone(true);
  h.scale.setScalar(wide / Math.max(hat.size.x, hat.size.z));
  h.position.set(0, FLOOR - crown - 3, 0);
  h.rotation.set(-0.06, 0.6, -0.1);
  head.add(h);
}

// One doll standing on its floor at the origin: a hollow base and a lid that turns about the rim
// (the littlest is one solid piece), and a contact shadow to lay on the floor under it
// (a doll that can fade is made transparent from the start, at full opacity: three.js builds a different
// shader for opaque materials, so switching later would stall a frame recompiling it)
export function buildDoll(d: Doll, shadowTex: THREE.Texture, fadable = false) {
  let map = paint(d);
  const lacquer = new THREE.MeshPhysicalMaterial({ map, roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.25, sheenColor: new THREE.Color('#ffffff'), transparent: fadable });
  const inside = new THREE.MeshStandardMaterial({ color: new THREE.Color(d.deep).multiplyScalar(0.55), roughness: 0.85, side: THREE.DoubleSide, transparent: fadable });
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
  // A painted doll takes its painting, eyes and all, so the beads go
  const repaint = (art: Art) => {
    const next = paint(d, art);
    lacquer.map = next; map.dispose(); map = next;
    eyes.forEach((e) => { e.visible = false; });
  };
  const disposables: { dispose: () => void }[] = [{ dispose: () => map.dispose() }, lacquer, inside, eyeGeo, eyeMat, shadow.geometry, shadow.material as THREE.Material, ...geos];
  // Fading out (the other dolls, as the camera flies past them into the Work doll's village)
  let faded = 1;
  const fade = (a: number) => {
    if (a === faded) return;
    faded = a;
    if (!fadable) return;
    // (the dark inside goes almost at once, or it shows through the fading shell as a blue ghost)
    lacquer.opacity = a; lacquer.depthWrite = a > 0.98;
    inside.opacity = a ** 6; inside.depthWrite = a > 0.98;
  };
  return { group, lid, head, shadow, disposables, look, repaint, fade };
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
  const SET = DOLLS.slice(0, SET_SIZE);
  const n = SET.length;
  const dolls = SET.map((d, i) => {
    const { group, lid, head, shadow, disposables: own, look, repaint, fade } = buildDoll(d, shadowTex, i !== VILLAGE_DOLL);
    scene.add(group, shadow);
    disposables.push(...own);
    return { d, group, lid, head, shadow, look, repaint, fade, gaze: gaze(), hover: 0, hoverTo: 0, peek: 0, visit: -1, play: -1 };
  });
  // The season's touches (data/season.ts): in December a hat on every doll, in October a pumpkin beside
  // the set, a little in front of the littlest doll. They arrive when their model has loaded.
  let gourd: { group: THREE.Object3D; r: number } | null = null;
  const season = currentSeason();

  // ---------- where the slots are ----------
  let X: number[] = [], S: number[] = [], closedShift = 0, k = 1;
  // On the homepage the set sits in the zoom's pinned screen (VillageZoom): the canvas covers all of that
  // screen, not just the set, so the camera can fly into the Work doll's village. Its place is worked
  // out without transforms (offsets up to the pinned screen, less the set's own shift), so the dolls
  // stand exactly where their slots are.
  const pin = root.closest<HTMLElement>('.hz-pin');
  // (only once the village is there to fly into: then the first screen is a fixed-height stage)
  const zoomable = () => !!pin?.parentElement?.classList.contains('has-village');
  const cover = () => {
    if (!pin || !zoomable()) { canvas.style.cssText = ''; return; }
    let left = 0, top = 0, el: HTMLElement | null = root;
    while (el && el !== pin) { left += el.offsetLeft; top += el.offsetTop; el = el.offsetParent as HTMLElement | null; }
    if (el !== pin) { canvas.style.cssText = ''; return; }
    const tx = parseFloat(getComputedStyle(root).translate) || 0;
    Object.assign(canvas.style, { left: `${-left - tx}px`, top: `${-top}px`, width: `${pin.clientWidth}px`, height: `${pin.clientHeight}px` });
  };
  const layout = () => {
    cover();
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
    base.pos.copy(camera.position); base.target.copy(camera.userData.target);
    X = slots.map((s) => (cx(s) - W / 2) / k);
    S = slots.map((s) => s.offsetHeight / BOX_H / k);
    // (closed, the big doll stands centred on the page: the set is shifted by --mid, hp.css)
    const mid = -(parseFloat(getComputedStyle(root).translate) || 0);
    closedShift = (track.clientWidth / 2 - (slots[0].offsetLeft + slots[0].offsetWidth / 2) + mid) / k;
  };

  // ---------- the opening, on the set's timeline ----------
  let step = DOLL_INTRO.step, lead = DOLL_INTRO.lead, total = (n - 2) * step + lead + HOP, t = root.classList.contains('is-open') ? total : 0, dir = 0;
  const heightOf = (i: number) => (FLOOR - 8) * S[i];
  // Each doll's move, and its jump: about the same few px for all, a touch more for the big ones
  const MOVES: Move[] = ['hop', 'flip', 'spin'];
  // How open a doll should be under the pointer: shut while its lid is thrown (it opens once it's back on)
  const peekTo = (o: { hover: number; play: number }, i: number) => (MOVES[i] === 'flip' && o.play >= 0 ? 0 : o.hover);
  const liftOf = (i: number) => heightOf(n - 1) * 0.18 + (heightOf(i) - heightOf(n - 1)) * 0.05;
  // ---------- the zoom into the Work doll's village (VillageZoom drives it, data/village times it) ----------
  let zp = zoomBus.get().p, focus = zoomBus.get().focus, hoverHouse = -1;
  const base = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  let village: Village | null = null, belly: ReturnType<typeof bellyMesh> | null = null, rt: THREE.WebGLRenderTarget | null = null, bellyIn = 0;
  const v3 = new THREE.Vector3(), q3 = new THREE.Vector3(), d3 = new THREE.Vector3();
  // The camera flies from where it stands to straight in front of the painting, ending where the village
  // will take over (artRect): it turns toward the painting first, while the distance shrinks evenly in
  // proportion (so the approach feels steady, not slow then sudden), easing in and out
  const flyCamera = () => {
    const o = dolls[VILLAGE_DOLL], f = seg(zp, ZOOM.fly), W = canvas.clientWidth, Hc = canvas.clientHeight;
    if (f <= 0 || !W || !Hc || !S[VILLAGE_DOLL]) { camera.position.copy(base.pos); camera.lookAt(base.target); camera.updateMatrixWorld(); return; }
    const s0 = S[VILLAGE_DOLL], ar = artRect(W, Hc), tan = Math.tan((camera.fov * Math.PI) / 360);
    const d1 = (PLAQUE.h * s0 * Hc) / (2 * tan * ar.h), wpp = (2 * d1 * tan) / Hc;
    v3.set(
      o.group.position.x - (ar.x + ar.w / 2 - W / 2) * wpp,
      o.group.position.y + (FLOOR - (PLAQUE.y + PLAQUE.h / 2)) * s0 + (ar.y + ar.h / 2 - Hc / 2) * wpp,
      PLAQUE_Z * s0,
    );
    const pan = EASE_IN_OUT(clamp(f / 0.6)), z = DIVE_IN(f);
    q3.copy(base.target).lerp(v3, pan);
    d3.copy(base.pos).sub(base.target);
    const d0 = d3.length();
    d3.normalize().lerp(v3.set(0, 0, 1), pan).normalize();
    camera.position.copy(q3).addScaledVector(d3, Math.exp(mix(Math.log(d0), Math.log(d1), z)));
    camera.lookAt(q3);
    camera.updateMatrixWorld();
  };

  // ---------- inside the village ----------
  // Its camera moves between shots: the handoff (the postcard view, narrowed to what's on screen, so it
  // starts exactly where the painting was), the overview (every house in view, at any screen shape), and
  // one per house (it, to the left of the case-study card; above it, on a phone)
  type Shot = { pos: THREE.Vector3; tgt: THREE.Vector3; fov: number };
  const vcam = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;
  const handoffShot = (W: number, H: number): Shot => {
    const pc = village!.postcard, ar = artRect(W, H);
    const dir = pc.getWorldDirection(new THREE.Vector3());
    return { pos: pc.position.clone(), tgt: pc.position.clone().addScaledVector(dir, 12), fov: deg(2 * Math.atan(Math.tan(rad(pc.fov / 2)) * (H / ar.h))) };
  };
  // The overview: the handoff's own view, carried a little further in (the dive keeps going forward and
  // settles; it never backs out to show more)
  const overviewShot = (W: number, H: number): Shot => {
    const a = handoffShot(W, H), dir = a.tgt.clone().sub(a.pos).normalize();
    const on = W < H ? 1.5 : 4;
    return { pos: a.pos.clone().addScaledVector(dir, on), tgt: a.tgt.clone().addScaledVector(dir, on), fov: a.fov };
  };
  // A stop on the tour: the place seen from the front of the village, filling most of the height, off to
  // the left of its card (above its card, on a phone)
  const focusShot = (i: number, W: number, H: number): Shot => {
    const h = village!.houses[i], aspect = W / H, portrait = aspect < 1;
    const fov = portrait ? 46 : 34, t = Math.tan(rad(fov / 2));
    const tgt = h.base.clone().add(new THREE.Vector3(0, h.height * 0.48, 0));
    const dist = h.height / ((portrait ? 0.46 : 0.62) * 2 * t);
    const pos = tgt.clone().addScaledVector(h.front, dist).add(new THREE.Vector3(0, dist * 0.22, 0));
    const right = new THREE.Vector3().crossVectors(h.front, new THREE.Vector3(0, 1, 0)).normalize().negate();
    if (portrait) tgt.y -= dist * t * 0.5; else tgt.addScaledVector(right, dist * t * aspect * 0.4);
    return { pos, tgt, fov };
  };
  const cur: Shot = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fov: 30 };
  let curSet = false;
  // Between stops the camera glides on a timed arc, up over the village and down to the next place
  let glide: { from: Shot; t: number; key: number } | null = null, shotKey = -2;
  const ray = new THREE.Raycaster();
  const stage = pin?.querySelector<HTMLElement>('.vz-stage') ?? null;
  const pins = Array.from(pin?.querySelectorAll<HTMLElement>('.vz-pin') ?? []);
  const anchor = new THREE.Vector3(), mid = new THREE.Vector3();
  // One frame of the village: where its camera is, the places popping, the snow, the labels
  const shootVillage = (dt: number) => {
    if (!village) return;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    const en = seg(zp, ZOOM.enter), e = DIVE_OUT(en);
    if (zp < 1 || !curSet) {
      const a = handoffShot(W, H), b = overviewShot(W, H);
      // (the lens widens late, after the camera has moved in, so the frame keeps closing in)
      cur.pos.copy(a.pos).lerp(b.pos, e); cur.tgt.copy(a.tgt).lerp(b.tgt, e); cur.fov = mix(a.fov, b.fov, EASE_IN_OUT(en));
      curSet = zp >= 1; shotKey = -1; glide = null;
    } else {
      const g = focus >= 0 ? focusShot(focus, W, H) : overviewShot(W, H);
      if (focus !== shotKey) { glide = { from: { pos: cur.pos.clone(), tgt: cur.tgt.clone(), fov: cur.fov }, t: 0, key: focus }; shotKey = focus; }
      if (glide && !reduce.matches) {
        glide.t = Math.min(1, glide.t + dt / 1500);
        const k = EASE_IN_OUT(glide.t), f = glide.from;
        // (a quadratic arc: its middle raised by a quarter of the distance travelled)
        mid.copy(f.pos).lerp(g.pos, 0.5).add(new THREE.Vector3(0, f.pos.distanceTo(g.pos) * 0.25, 0));
        cur.pos.copy(f.pos).multiplyScalar((1 - k) * (1 - k)).addScaledVector(mid, 2 * (1 - k) * k).addScaledVector(g.pos, k * k);
        cur.tgt.copy(f.tgt).lerp(g.tgt, k); cur.fov = mix(f.fov, g.fov, k);
        if (glide.t >= 1) glide = null;
      } else { cur.pos.copy(g.pos); cur.tgt.copy(g.tgt); cur.fov = g.fov; glide = null; }
    }
    vcam.aspect = W / H; vcam.fov = cur.fov;
    vcam.position.copy(cur.pos);
    vcam.lookAt(cur.tgt);
    vcam.updateProjectionMatrix(); vcam.updateMatrixWorld();
    village.step(dt, zp >= 1 ? hoverHouse : -1, zp >= 1 ? focus : -1);
    // the labels hang over their places, kept inside the screen, and nudged apart where two would overlap
    // (the further one, higher on the screen, moves up)
    const spots = village.houses.map((h, i) => {
      const el = pins[i];
      if (!el) return null;
      anchor.copy(h.anchor); anchor.y += h.group.position.y;
      anchor.project(vcam);
      const w = el.offsetWidth, hh = el.offsetHeight, half = w / 2 + 10;
      return { el, w, h: hh, x: Math.min(W - half, Math.max(half, ((anchor.x + 1) / 2) * W)), y: ((1 - anchor.y) / 2) * H };
    });
    const live = spots.filter((v): v is NonNullable<typeof v> => !!v).sort((a, b) => b.y - a.y);
    for (let i = 0; i < live.length; i++) for (let j = 0; j < i; j++) {
      const a = live[j], b = live[i];
      if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 6 && b.y > a.y - a.h - 6) b.y = a.y - a.h - 6;
    }
    live.forEach((v) => { v.el.style.transform = `translate3d(${v.x.toFixed(1)}px, ${v.y.toFixed(1)}px, 0)`; });
  };
  const renderVillage = () => {
    if (!village) return;
    const tm = renderer.toneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(SKY, 1);
    renderer.render(village.scene, vcam);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = tm;
  };
  // The painting on the doll: the village from its postcard camera, sky left clear
  const paintBelly = () => {
    if (!village || !rt) return;
    renderer.setRenderTarget(rt);
    renderer.setClearColor(SKY, 0);
    renderer.clear();
    renderer.render(village.scene, village.postcard);
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
  };
  // Pointing at a house lifts it and brightens its windows; clicking flies to it (or back out)
  const pickAt = (e: PointerEvent | MouseEvent) => {
    if (!village || zp < 1) return -1;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), vcam);
    return village.pick(ray);
  };
  const apply = () => {
    const shift = closedShift * (1 - EASE_IN_OUT(t / total));
    // (diving, the dolls stop watching the cursor and the others fade as the camera passes them)
    const still3 = 1 - seg(zp, [0.02, 0.22]), away = 1 - seg(zp, [0.02, 0.2]);
    dolls.forEach((o, i) => {
      let x = X[0], y = 0;
      for (let r = 1; r <= i; r++) {
        const s0 = (r - 1) * step;
        x += (X[r] - X[r - 1]) * GLIDE(clamp((t - (s0 + lead + HOP * 0.3)) / (HOP * 0.7)));
        const u = (t - (s0 + lead)) / HOP;
        if (u > 0 && u < 1) y += heightOf(r - 1) * 0.46 * (u < 0.45 ? RISE(u / 0.45) : 1 - FALL((u - 0.45) / 0.55));
      }
      // Its lid: lifts as the next doll comes out, holds, settles (the littlest has none coming out)
      let pose = SHUT;
      if (o.lid && i < n - 1) {
        const u = t - i * step, d = lead + HOP * 0.75, hold = lead + HOP * 0.4;
        if (u > 0 && u < d) pose = u < lead ? blend(SHUT, LIFTED, LIFT(u / lead)) : u < hold ? LIFTED : blend(LIFTED, SHUT, EASE_IN_OUT((u - hold) / (d - hold)));
      }
      // Hover, a click, and each doll's move, all only while the set is still. Hover plays the doll's move
      // and opens it: its lid lifts and tilts aside (once a thrown lid has landed back on)
      let sx = 1, sy = 1, spin = 0, thrown: ReturnType<typeof flipAt> = null;
      if (o.lid) pose = blend(pose, PEEK, o.peek * (pose === SHUT ? 1 : 0));
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
      // rocked a little onto the corner of its base (lifted so that corner stays on the floor), gently,
      // so the doll still reads as standing on the snow
      const out = i === 0 ? 1 : clamp((t - ((i - 1) * step + lead + HOP * 0.6)) / (HOP * 0.4));
      const g = o.gaze, roll = g.roll * out * 0.3;
      o.group.position.y += Math.abs(Math.sin(roll)) * ROCK_R * S[i];
      o.group.rotation.set(-g.pitch * out * still3, (spin + g.yaw * out) * still3, roll * still3);
      if (i !== VILLAGE_DOLL) o.fade(away);
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
      (o.shadow.material as THREE.MeshBasicMaterial).opacity = 0.62 * land * clamp(1 - y / (heightOf(i) * 0.9)) * (i === VILLAGE_DOLL ? 1 : away);
    });
    if (belly) belly.setFlat(EASE_IN_OUT(seg(zp, ZOOM.flatten)));
    flyCamera();
    // The pumpkin: beside the last doll's place, there once that doll has landed (it grows in)
    if (gourd) {
      const j = n - 1, landed = clamp((t - ((j - 1) * step + lead + HOP * 0.7)) / (HOP * 0.5));
      const s = S[j] * gourd.r * (0.2 + 0.8 * EASE_OUT(landed));
      gourd.group.position.set(X[j] + shift + 150 * S[j], 0, 30 * S[j]);
      gourd.group.scale.setScalar(s);
      gourd.group.visible = landed > 0;
    }
  };

  // ---------- the loop: runs only while something moves ----------
  let raf = 0, last = 0, live = false, gone = false;
  // (a click's opening holds its pose once played, so it counts as still)
  const still = () => !(village && (zp > 0 || bellyIn < 1)) && dir === 0 && dolls.every((o, i) => Math.abs(o.hover - o.hoverTo) < 0.002 && Math.abs(o.peek - peekTo(o, i)) < 0.002 && (o.visit < 0 || o.visit >= 460) && o.play < 0 && gazeStill(o.gaze));
  // The gaze: towards the pointer while the set is still, straight ahead while it opens
  let pointer: { x: number; y: number } | null = null;
  const speed = speedo();
  const eye = new THREE.Vector3();
  const aimAll = () => dolls.forEach((o, i) => {
    if (!pointer || dir !== 0 || !S[i] || zp > 0) return aimGaze(o.gaze, null);
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
      // (how far it's open eases more slowly, so after a thrown lid lands it lifts again gently)
      o.peek += (peekTo(o, i) - o.peek) * (1 - Math.exp(-dt / 150));
      if (o.visit >= 0) o.visit = Math.min(o.visit + dt, 460);
      if (o.play >= 0) { o.play += dt; if (o.play > MOVE_MS[MOVES[i]]) o.play = -1; }
    });
    apply();
    // (the world fades in once, in the space her curls frame, the first time it's ready)
    if (belly && bellyIn < 1) { bellyIn = Math.min(1, bellyIn + dt / 700); belly.show(EASE_IN_OUT(bellyIn)); }
    if (live) {
      if (village && zp > 0) shootVillage(dt);
      if (village && zp >= ZOOM.hand[1]) renderVillage();
      else {
        // (flying in, the painting is the live village, snow falling and all, so it meets the real one)
        if (village && (zp > 0 || bellyIn < 1)) paintBelly();
        renderer.render(scene, camera);
      }
    }
    if (still()) { raf = 0; last = 0; } else raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  if (season === 'december') loadSeasonModel('/seasons/santa-hat.glb', (m) => { if (m.color.r > m.color.b + 0.2) m.color.set('#c42f3a'); }).then((hat) => {
    if (!hat || gone) return;
    dolls.forEach((o) => wearHat(o.head, hat));
    disposables.push(...hat.parts); apply(); kick();
  });
  if (season === 'october') loadSeasonModel('/seasons/pumpkin.glb', (m) => { if (m.color.r > m.color.g + 0.15) m.color.set('#e2782f'); }).then((p) => {
    if (!p || gone) return;
    p.object.rotation.y = 0.4;
    // r: so it's about 132 box units across, at the littlest doll's scale
    gourd = { group: p.object, r: 132 / Math.max(p.size.x, p.size.z) };
    scene.add(p.object); disposables.push(...p.parts); apply(); kick();
  });
  // His doll (data/me) wears his hair and the outfit he published last, as 3D toy pieces over its
  // painting (Outfit3D); with no outfit (or no answer), just his hair. They fade with the doll when the
  // camera flies into the village.
  fetch('/api/outfit').then((r) => r.json())
    .then((d) => (Array.isArray(d?.current?.outfit) ? d.current.outfit : []), () => [])
    .then(async (outfit) => {
      const me = dolls[ME];
      if (!me || gone) return;
      const { wearOutfit } = await import('@/app/components/Outfit3D');
      if (gone) return;
      const worn = wearOutfit(me, outfit, true);
      const fade = me.fade;
      me.fade = (a: number) => { fade(a); worn.fade(a); };
      disposables.push(worn); apply(); kick();
    }).catch(() => undefined);

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
    if (zp > 0) i = null;
    const open = root.classList.contains('is-open');
    dolls.forEach((o, j) => {
      const on = i === j && (open || j === 0);
      // Pointing at a doll plays its move (a hop, a thrown lid, a spin), and the doll opens as it lands
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
      // (the Work doll, where the zoom runs, flies you into its village instead: VillageZoom)
      if (i === VILLAGE_DOLL && zoomable()) return;
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

  const ro = new ResizeObserver(() => { layout(); apply(); kick(); });
  ro.observe(root);
  if (pin) ro.observe(pin);
  layout(); apply();
  // Compile the shaders off the main thread where the browser can and put the paintings on, then draw
  // the first frame
  // (the art list also holds dolls that aren't in the set: only the set's own are painted here)
  const painted = loadArt().then((art) => { if (!gone) dolls.forEach((d, i) => { const a = art[i]; if (a) d.repaint(a); }); });
  off.push(zoomBus.on((st) => {
    // (diving, any move a doll is playing stops, and its lid settles back: a lid mid-throw would fly off
    // with the camera)
    if (st.p > 0 && zp <= 0) dolls.forEach((o) => { o.play = -1; o.hoverTo = 0; });
    zp = st.p; focus = st.focus; hoverHouse = st.hover; if (st.p === 0) curSet = false; kick();
  }));
  if (stage) {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const i = pickAt(e);
      if (i !== hoverHouse) { hoverHouse = i; zoomBus.set({ hover: i }); stage.style.cursor = i >= 0 ? 'pointer' : ''; kick(); }
    };
    const click = (e: MouseEvent) => {
      if (zp < 1) return;
      const i = pickAt(e);
      zoomBus.set({ focus: i >= 0 ? i : -1 });
    };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('click', click);
    off.push(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('click', click); });
  }
  // The village: built once the set is drawn and the page is idle (its models and light load meanwhile),
  // then painted on the Work doll, where it fades in; from then on a click on that doll flies into it
  const startVillage = () => {
    if (!pin || village) return;
    import('@/app/components/VillageScene').then(({ createVillage }) => createVillage(renderer)).then(async (v) => {
      if (gone) { v.dispose(); return; }
      village = v;
      rt = new THREE.WebGLRenderTarget(1792, Math.round(1792 / PAINTING_ASPECT), { samples: 4, type: THREE.HalfFloatType });
      disposables.push(rt, { dispose: () => v.dispose() });
      const mask = await maskTexture();
      belly = bellyMesh(mask);
      disposables.push(mask, ...belly.disposables);
      dolls[VILLAGE_DOLL].group.add(belly.group);
      paintBelly();
      belly.paint(rt.texture);
      pin.parentElement?.classList.add('has-village');
      window.dispatchEvent(new Event('vz-ready'));
      kick();
    }).catch(() => {});
  };
  const ready = Promise.all([renderer.compileAsync(scene, camera).catch(() => scene), painted]).then(() => {
    if (gone) return;
    live = true; layout(); apply(); renderer.render(scene, camera);
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(startVillage, { timeout: 2000 });
    else setTimeout(startVillage, 600);
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
  const painted = loadArt().then((art) => { if (gone) return; if (art[0]) outer.repaint(art[0]); if (art[1]) inner.repaint(art[1]); });
  const ready = Promise.all([renderer.compileAsync(scene, camera).catch(() => scene), painted]).then(() => {
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
