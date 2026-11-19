import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SHAPE } from '@/app/data/layers';
import { CHEEK, DOLLS, DOLL_ART, FRINGE, GOLD, INK, ME_DOLL, SCARF, SET_SIZE, SKIN, WAIST, flowerOf, type Doll } from '@/app/data/dolls';
import { DOLL_INTRO } from '@/app/data/intro';
import { currentSeason } from '@/app/data/season';

// The homepage matryoshka set in real 3D. Each doll is the flat drawing's own outline spun round its
// axis (a lathe), cut at the waist into a hollow base and a hollow lid, so a doll put inside another
// is really inside it. The flat front painting (scarf, face, fringe, apron, flower) is wrapped round
// the body, so from the front the doll looks exactly like the illustration and from behind you see
// the back of the scarf. The finish is satin painted wood (FINISH), soft and nearly matte.
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
// The flat art is drawn at up to 6 px per box unit (a painting at its own resolution, the drawn dolls
// fewer for the small ones), on canvases kept in memory so reading them back is quick, then wrapped
const ART = 6;
// (or, for a painted doll, its painting)
// (`scale`: px per box unit, so a doll's back is drawn at its front's, which paint reads them both by)
function drawArt(d: Doll, front: boolean, img?: Pic, scale?: number) {
  const art = scale ?? (img ? Math.min(ART, (img instanceof HTMLImageElement ? img.naturalWidth : img.width) / 200) : ART * Math.max(d.size, 0.5));
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
  const fr = drawArt(d, true, pic?.front), bk = drawArt(d, false, pic?.back, fr.width / 200);
  const fd = (fr.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, fr.width, fr.height).data;
  const bd = (bk.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, bk.width, bk.height).data;
  // (round the body, about 1.6 texture px for each px of painting across: a sharper painting, a sharper
  // doll; his, which the homepage zoom flies right up to, is painted at twice the others' size)
  const W = Math.max(512, Math.round(1536 * d.size / 256) * 256, Math.round((fr.width * 1.6) / 256) * 256), H = W / 2;
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
// (a picture is a loaded painting, or one drawn on a canvas: his doll's front with his photo in its window)
type Pic = HTMLImageElement | HTMLCanvasElement;
type Art = { front: Pic; back: Pic };
const loadImage = (src: string) => new Promise<HTMLImageElement>((ok, no) => {
  const im = new Image();
  im.decoding = 'async'; im.onload = () => ok(im); im.onerror = no; im.src = src;
});
let artLoad: Promise<(Art | null)[]> | null = null;
const loadArt = () => (artLoad ??= Promise.all(DOLL_ART.map((a) => (a
  ? Promise.all([loadImage(a.front), loadImage(a.back)]).then(([front, back]) => ({ front, back })).catch(() => null)
  : null))));

// A soft round contact shadow, drawn once
function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  // Deep under the base, in the cobalt of the print, as on the postcard
  g.addColorStop(0, 'rgba(16,30,96,0.72)'); g.addColorStop(0.55, 'rgba(24,44,140,0.3)'); g.addColorStop(1, 'rgba(36,69,181,0)');
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
// Hover opens a doll: the lid lifts and tilts aside, clearly open, held while the pointer's on it
const PEEK: Pose = { x: -12, y: 30, tilt: 0.17, lean: 0.08 };
const blend = (a: Pose, b: Pose, t: number): Pose => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), tilt: mix(a.tilt, b.tilt, t), lean: mix(a.lean, b.lean, t) });

// ---------- the studio, a doll, a camera: shared by the set and the About page's doll ----------
// The renderer, its light and the lens
// The finish: satin painted wood, as the dolls on his postcard (2026-11-18: the gloss lacquer's hot
// highlights looked like plastic, and the warm light turned the shade side peach). A faint sheen, almost no
// clearcoat, a frontal key and a lot of soft fill, so the paintings read flat and graphic; neutral light, so
// the shade goes a cool blue-grey (the cobalt rim and bounce) and the cream stays cream.
const FINISH = { r: 0.66, cc: 0.15, ccr: 0.4, sh: 0, env: 0.14, key: 1.7, rim: 1.2, hemi: 1.75, exp: 1.0,
  kp: [-0.3, 0.6, 1], kc: '#fffaf3', hs: '#f2f1ee' };
function studio(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = FINISH.exp;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = FINISH.env;
  // A near-white key from the front, a little left and above, as on paper in daylight; the shade side and the underside go cobalt
  // (a blue rim from behind on the right, and cobalt bounce from below), the blue under-shade the dolls
  // have on his postcard
  const key = new THREE.DirectionalLight(FINISH.kc, FINISH.key);
  key.position.set(FINISH.kp[0], FINISH.kp[1], FINISH.kp[2]);
  const rim = new THREE.DirectionalLight('#5b7ee6', FINISH.rim);
  rim.position.set(0.9, 0.35, -0.8);
  scene.add(key, rim, new THREE.HemisphereLight(FINISH.hs, '#2445b5', FINISH.hemi));
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
// The glaze's tint over the paintings (painted cream and cobalt since 2026-11-18): barely warm, so the
// cream stays the paper's cream
const GLAZE = '#fff8ee';
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
function buildDoll(d: Doll, shadowTex: THREE.Texture) {
  let map = paint(d);
  // (the paintings' white porcelain reads as warm ivory glaze on the cream paper: the tint multiplies the
  // painting, so the white goes cream and the cobalt stays cobalt)
  const lacquer = new THREE.MeshPhysicalMaterial({ map, color: new THREE.Color(GLAZE), roughness: FINISH.r, clearcoat: FINISH.cc, clearcoatRoughness: FINISH.ccr, sheen: FINISH.sh, sheenColor: new THREE.Color('#fff1d8') });
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
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.85 }));
  shadow.rotation.x = -Math.PI / 2;
  // A painted doll takes its painting, eyes and all, so the beads go
  const repaint = (art: Art) => {
    const next = paint(d, art);
    lacquer.map = next; map.dispose(); map = next;
    eyes.forEach((e) => { e.visible = false; });
  };
  // Another painting, made ahead (it takes a moment) and put on later in one go
  const paintWith = (art: Art) => paint(d, art);
  const wear = (tex: THREE.CanvasTexture) => { lacquer.map = tex; map.dispose(); map = tex; };
  const disposables: { dispose: () => void }[] = [{ dispose: () => map.dispose() }, lacquer, inside, eyeGeo, eyeMat, shadow.geometry, shadow.material as THREE.Material, ...geos];
  return { group, lid, head, shadow, disposables, look, repaint, paintWith, wear };
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

/** A doll's face on the screen (viewport px): its centre and radius */
export type FaceOnScreen = { x: number; y: number; r: number };
export type DollScene = {
  go: (open: boolean, step: number, lead: number, elapsed?: number) => void;
  /** Where doll i's face is on the screen now (its painted window: DollSet's About transition starts there) */
  faceOf: (i: number) => FaceOnScreen;
  /** Where doll i's cup rim is on the screen (its front edge's middle, and half its width) */
  rimOf: (i: number) => FaceOnScreen;
  /** Doll i's lid comes off and is set down aside (he rises out of it, DollSet) */
  release: (i: number) => void;
  /** Doll i turns right round and comes back wearing `front` (his photo in its window); resolves when it has */
  turn: (i: number, front: HTMLCanvasElement) => Promise<void>;
  ready: Promise<void>;
  dispose: () => void;
};

// The About doll's face (it becomes his photo on the About page, DollSet): the painted window is a circle
// FACE_R box units across its radius, FACE_Y down the doll. (Every doll's face window is FACE_R across; on
// his 1200 × 1560 painting, 6 px a box unit, it's a circle of 174 px at (599.5, 520).)
const FACE_Y = 520 / 6, FACE_R = 29;
// Going to the About page (DollSet), his doll either opens, its lid set down aside so he can rise out of
// it (release), or turns right round on the spot and comes back with his photo in its window (turn): the
// painting is swapped halfway, while the face is turned away.
const RELEASE_MS = 520, TURN_MS = 1100;
const ASIDE: Pose = { x: 150, y: 40, tilt: -0.5, lean: 0.1 };

export function createDollScene(root: HTMLElement, canvas: HTMLCanvasElement): DollScene {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const { renderer, scene, camera, shadowTex, disposables } = studio(canvas);

  // ---------- the dolls ----------
  const SET = DOLLS.slice(0, SET_SIZE);
  const n = SET.length;
  const dolls = SET.map((d) => {
    const { group, lid, head, shadow, disposables: own, look, repaint, paintWith, wear } = buildDoll(d, shadowTex);
    scene.add(group, shadow);
    disposables.push(...own);
    return { d, group, lid, head, shadow, look, repaint, paintWith, wear, gaze: gaze(), hover: 0, hoverTo: 0, peek: 0, visit: -1, play: -1,
      release: -1, turn: -1, turnTo: null as THREE.CanvasTexture | null, turned: () => {} };
  });
  // The season's touches (data/season.ts): in December a hat on every doll, in October a pumpkin beside
  // the set, a little in front of the littlest doll. They arrive when their model has loaded.
  let gourd: { group: THREE.Object3D; r: number } | null = null;
  const season = currentSeason();

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
    // (closed, the big doll stands centred on the page: the set is shifted by --mid, hp.css)
    const mid = -(parseFloat(getComputedStyle(root).translate) || 0);
    closedShift = (track.clientWidth / 2 - (slots[0].offsetLeft + slots[0].offsetWidth / 2) + mid) / k;
  };

  // ---------- the opening, on the set's timeline ----------
  let step = DOLL_INTRO.step, lead = DOLL_INTRO.lead, total = (n - 2) * step + lead + HOP, t = root.classList.contains('is-open') ? total : 0, dir = 0;
  const heightOf = (i: number) => (FLOOR - 8) * S[i];
  // Each doll's move, and its jump: about the same few px for all, a touch more for the big ones
  // Pointing at a doll is the highlight: it hops (the littlest, him, turns right round), shut, so the crayon
  // line DollSet draws round it fits it the whole time. Opening is for choosing it: the click lifts its lid
  // (visit, below) before the page changes. ('flip', the thrown lid, is kept for later use.)
  const MOVES: Move[] = ['hop', 'hop', 'spin'];
  // How open a doll should be under the pointer: not at all (the highlight keeps it shut; it opens when
  // chosen). (The littlest never opens: the innermost doll of a set is the one that doesn't.)
  const peekTo = (_o: { hover: number; play: number }, _i: number) => 0;
  const liftOf = (i: number) => heightOf(n - 1) * 0.18 + (heightOf(i) - heightOf(n - 1)) * 0.05;
  // Each doll's lift off the floor on the screen, px, for the crayon line round it (DollSet), which rides
  // along with the hop: written to its slot only when it changes
  const slotEls = Array.from(root.querySelectorAll<HTMLElement>('.ds-slot'));
  const lifted: string[] = [];
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
        // (the littlest never opens: it hops)
        if (o.lid && i < n - 1) pose = blend(pose, LIFTED, EASE_OUT(v));
        else y += heightOf(i) * 0.22 * Math.sin(Math.PI * v);
      }
      if (o.play >= 0) {
        const m = moveAt(MOVES[i], o.play, liftOf(i));
        y += m.y; sx = m.sx; sy = m.sy; spin = m.spin;
        if (MOVES[i] === 'flip') thrown = flipAt(o.play);
      }
      // Leaving for the About page: the lid set down aside, or one whole turn on a little hop, lid on
      if (o.lid && o.release >= 0) pose = blend(pose, ASIDE, LIFT(clamp(o.release / RELEASE_MS)));
      if (o.turn >= 0) {
        const u = clamp(o.turn / TURN_MS);
        // (a lid peeking open under the pointer closes first)
        pose = blend(pose, SHUT, EASE_OUT(clamp(u / 0.2))); thrown = null;
        spin = Math.PI * 2 * EASE_IN_OUT(u);
        y += heightOf(i) * 0.12 * Math.sin(Math.PI * u);
        const q = u > 0.86 ? 0.05 * Math.sin((Math.PI * (u - 0.86)) / 0.14) : 0;
        sx = 1 + q; sy = 1 - q;
      }
      o.group.position.set(x + shift, y, 0);
      o.group.scale.set(S[i] * sx, S[i] * sy, S[i] * sx);
      const lift = `${(-y * k).toFixed(1)}px`;
      if (slotEls[i] && lifted[i] !== lift) { lifted[i] = lift; slotEls[i].style.setProperty('--lift', lift); }
      // The gaze, once the doll is out of the set (nested, it would poke through): turned, tilted, and
      // rocked a little onto the corner of its base (lifted so that corner stays on the floor), gently,
      // so the doll still reads as standing on the snow
      const out = i === 0 ? 1 : clamp((t - ((i - 1) * step + lead + HOP * 0.6)) / (HOP * 0.4));
      const g = o.gaze, roll = g.roll * out * 0.3;
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
      (o.shadow.material as THREE.MeshBasicMaterial).opacity = 0.85 * land * clamp(1 - y / (heightOf(i) * 0.9));
    });
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
  const still = () => dir === 0 && dolls.every((o, i) => Math.abs(o.hover - o.hoverTo) < 0.002 && Math.abs(o.peek - peekTo(o, i)) < 0.002 && (o.visit < 0 || o.visit >= 460) && o.play < 0 && (o.release < 0 || o.release >= RELEASE_MS) && (o.turn < 0 || o.turn >= TURN_MS) && gazeStill(o.gaze));
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
      // (how far it's open eases more slowly, so after a thrown lid lands it lifts again gently)
      o.peek += (peekTo(o, i) - o.peek) * (1 - Math.exp(-dt / 150));
      if (o.visit >= 0) o.visit = Math.min(o.visit + dt, 460);
      if (o.play >= 0) { o.play += dt; if (o.play > MOVE_MS[MOVES[i]]) o.play = -1; }
      if (o.release >= 0) o.release = Math.min(o.release + dt, RELEASE_MS);
      if (o.turn >= 0 && o.turn < TURN_MS) {
        o.turn = Math.min(o.turn + dt, TURN_MS);
        // (halfway round, its face is at the back: the new painting goes on unseen)
        if (o.turnTo && o.turn >= TURN_MS / 2) { o.wear(o.turnTo); o.turnTo = null; }
        if (o.turn >= TURN_MS) o.turned();
      }
    });
    apply();
    if (live) renderer.render(scene, camera);
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
      // (his doll's own way out is DollSet's to start: release or turn)
      if (i === ME_DOLL) return;
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
  // Compile the shaders off the main thread where the browser can and put the paintings on, then draw
  // the first frame
  // (the art list also holds dolls that aren't in the set: only the set's own are painted here)
  const painted = loadArt().then((art) => { if (!gone) dolls.forEach((d, i) => { const a = art[i]; if (a) d.repaint(a); }); });
  const ready = Promise.all([renderer.compileAsync(scene, camera).catch(() => scene), painted]).then(() => {
    if (gone) return;
    live = true; layout(); apply(); renderer.render(scene, camera);
  });

  const faceOf = (i: number): FaceOnScreen => {
    const g = dolls[i].group;
    g.updateMatrixWorld();
    const c = new THREE.Vector3(0, FLOOR - FACE_Y, radiusAt(FACE_Y)).applyMatrix4(g.matrixWorld);
    const e = new THREE.Vector3(FACE_R, FLOOR - FACE_Y, radiusAt(FACE_Y)).applyMatrix4(g.matrixWorld);
    const a = toPage(camera, canvas, c), b = toPage(camera, canvas, e);
    return { x: a.x, y: a.y, r: Math.hypot(b.x - a.x, b.y - a.y) };
  };

  // The cup's rim on the screen (viewport px): the middle of its front edge, and half its width
  const rimOf = (i: number): FaceOnScreen => {
    const g = dolls[i].group;
    g.updateMatrixWorld();
    const y = FLOOR - WAIST;
    const a = toPage(camera, canvas, new THREE.Vector3(0, y, RW).applyMatrix4(g.matrixWorld));
    const l = toPage(camera, canvas, new THREE.Vector3(-RW, y, 0).applyMatrix4(g.matrixWorld));
    const r = toPage(camera, canvas, new THREE.Vector3(RW, y, 0).applyMatrix4(g.matrixWorld));
    return { x: (l.x + r.x) / 2, y: a.y, r: Math.abs(r.x - l.x) / 2 };
  };
  const release = (i: number) => {
    if (reduce.matches || !dolls[i].lid) return;
    const o = dolls[i];
    o.play = -1; o.release = 0; kick();
  };
  const turn = (i: number, front: HTMLCanvasElement) => new Promise<void>((done) => {
    const o = dolls[i];
    if (reduce.matches) { done(); return; }
    loadArt().then((art) => {
      const back = art[i]?.back;
      if (gone || !back) { done(); return; }
      o.turnTo = o.paintWith({ front, back });
      o.play = -1; o.visit = -1; o.turn = 0; o.turned = done;
      last = 0; kick();
    }, () => done());
  });

  const dispose = () => {
    gone = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    off.forEach((f) => f());
    disposables.forEach((x) => x.dispose());
  };

  return {
    go,
    faceOf,
    rimOf,
    release,
    turn,
    ready,
    dispose,
  };
}
