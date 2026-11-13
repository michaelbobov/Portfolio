import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HOUSES, PAINTING_ASPECT, SKY } from '@/app/data/village';

// The side-projects world: a frozen lake in the taiga, seen at eye level, with one snowy island per side
// project in a gentle arc across the ice, a dotted skating trail linking them in the tour's order, and a
// porcelain penguin out on the ice. Round the lake, a deep forest of snowy firs in front of a painted taiga
// panorama: the background is rich, and the islands stand clear of it on the open ice.
//
// Everything is Gzhel porcelain painted with Codex's image tool in the Side projects doll's style
// (public/village). The cabin, the hut on chicken legs and the penguin are 3D models made from their
// paintings (Hunyuan3D 2.1's shapes, public/village/models); the firs are turned on a lathe from their
// painting's outline, like the dolls. Each wears its painting, projected onto it from the front, under a
// soft porcelain glaze. SkillTree's landmark is built here: a bare porcelain tree that is its own diagram,
// every fork and tip a glowing node in a cobalt ring, snow along its branches.
//
// It is painted on the doll's belly by rendering it from its postcard camera (DollScene), so what shows
// in her window is this world itself, and flying in is seamless.

/** One side project's island: where it stands, which way the camera sees it from, where its label hangs */
export type House = { id: string; group: THREE.Group; anchor: THREE.Vector3; base: THREE.Vector3; front: THREE.Vector3; height: number };

export type Village = {
  scene: THREE.Scene;
  houses: House[];
  /** the camera the doll's painting is rendered with (her window's shape), so the handoff starts exactly there */
  postcard: THREE.PerspectiveCamera;
  /** the hovered island's lift, and SkillTree's light climbing its nodes while it's pointed at or visited */
  step: (dt: number, hover: number, focus: number) => void;
  pick: (ray: THREE.Raycaster) => number;
  dispose: () => void;
};

/** The pieces, how tall each stands (world units), and how each is made solid: a model, or turned from its outline */
const PIECES = { cabin: 2.6, hut: 3.4, penguin: 1.1, fir1: 4.4 } as const;
type Piece = keyof typeof PIECES;
const MODELLED: Piece[] = ['cabin', 'hut', 'penguin'];
const TURNED: Piece[] = ['fir1'];
const KIND: Record<string, Piece | 'skilltree'> = { house: 'cabin', tree: 'skilltree', hut: 'hut' };
/** SkillTree's tree, as a diagram: its nodes (x, y, depth, level) in front view, and the branches between them */
const SKILL_NODES: [number, number, number, number][] = [
  [0, 1.45, 0, 0],
  [-1.3, 2.55, 0.2, 1], [0, 2.95, -0.15, 1], [1.3, 2.55, 0.2, 1],
  [-2.0, 3.45, 0.1, 2], [-0.85, 3.95, 0.3, 2], [0, 4.35, 0, 2], [0.85, 3.95, 0.3, 2], [2.0, 3.45, 0.1, 2],
];
const SKILL_LINKS: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [3, 7], [3, 8]];
const SKILL_H = 4.6;
/** The lake: its middle and radius; the islands' height and radius */
const LAKE = { x: 0, z: -3, r: 13 }, ISLAND = { h: 0.36, r: 1.95 };
/** Laid out for a tall screen (a phone)? Decided once, when the world is built: the islands zigzag back
 *  across the lake there, and the camera stands higher to see down the lake */
const tall = () => typeof window !== 'undefined' && window.innerWidth < window.innerHeight;

const loadTex = (src: string) => new THREE.TextureLoader().loadAsync(src).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });
type Assets = { paint: Record<Piece, THREE.Texture>; outline: Partial<Record<Piece, THREE.Texture>>; models: Partial<Record<Piece, THREE.Object3D>>; taiga: THREE.Texture; ice: THREE.Texture };
let assets: Promise<Assets> | null = null;
const keyed = <T,>(keys: Piece[], list: T[]) => Object.fromEntries(keys.map((k, i) => [k, list[i]]));
/** Fetch the paintings and models (once); call early to warm the cache */
export const loadVillageAssets = () => (assets ??= Promise.all([
  Promise.all((Object.keys(PIECES) as Piece[]).map((k) => loadTex(`/village/${k}-paint.webp`))),
  Promise.all(TURNED.map((k) => loadTex(`/village/${k}.webp`))),
  Promise.all(MODELLED.map((k) => new GLTFLoader().loadAsync(`/village/models/${k}.glb`).then((g) => g.scene))),
  loadTex('/village/taiga.webp'),
  loadTex('/village/ice.webp'),
]).then(([paint, outline, models, taiga, ice]) => ({
  paint: keyed(Object.keys(PIECES) as Piece[], paint) as Record<Piece, THREE.Texture>,
  outline: keyed(TURNED, outline), models: keyed(MODELLED, models), taiga, ice,
})));

export async function createVillage(renderer: THREE.WebGLRenderer): Promise<Village> {
  const { paint, outline, models, taiga, ice } = await loadVillageAssets();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(SKY, 34, 80);
  const portrait = tall();
  // Where the camera that paints her window stands, and looks
  const EYE = portrait ? new THREE.Vector3(0, 9.5, 24) : new THREE.Vector3(0, 5.8, 30), LOOK = portrait ? new THREE.Vector3(0, 1.4, -3.5) : new THREE.Vector3(0, 2.6, -4);
  const disposables: { dispose: () => void }[] = [];
  const own = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  // ---------- light: a soft studio for the porcelain's glaze ----------
  const pmrem = own(new THREE.PMREMGenerator(renderer));
  scene.environment = own(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
  scene.environmentIntensity = 0.45;
  const sun = new THREE.DirectionalLight('#ffffff', 1.1);
  sun.position.set(-4, 7, 6);
  scene.add(sun, new THREE.HemisphereLight('#ffffff', '#c9d7f0', 1.35));

  // ---------- the snow, and the lake in it ----------
  const snow = own(new THREE.MeshStandardMaterial({ color: '#f6f8fc', roughness: 0.95 }));
  const field = new THREE.Mesh(own(new THREE.PlaneGeometry(260, 260)), snow);
  field.rotation.x = -Math.PI / 2;
  scene.add(field);
  ice.wrapS = ice.wrapT = THREE.RepeatWrapping;
  ice.repeat.set(3, 3);
  const iceMat = own(new THREE.MeshPhysicalMaterial({ map: ice, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true }));
  // (its shore is soft: the ice thins into the snow over its outer edge)
  iceMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vDisc;').replace('#include <uv_vertex>', '#include <uv_vertex>\nvDisc = position.xy;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vDisc;').replace('#include <map_fragment>', `#include <map_fragment>
      diffuseColor.a *= 1.0 - smoothstep(${(LAKE.r * 0.82).toFixed(2)}, ${LAKE.r.toFixed(2)}, length(vDisc));`);
  };
  const lake = new THREE.Mesh(own(new THREE.CircleGeometry(LAKE.r, 96)), iceMat);
  lake.rotation.x = -Math.PI / 2; lake.position.set(LAKE.x, 0.01, LAKE.z); lake.scale.set(1.25, 1, 1);
  scene.add(lake);

  // ---------- the taiga: the painted panorama round the back, like a theatre's backcloth ----------
  const R = 46, arc = 3.0, tw = (taiga.image as { width: number }).width, th = (taiga.image as { height: number }).height, h = (R * arc * th) / tw;
  const clothMat = own(new THREE.MeshBasicMaterial({ map: taiga, side: THREE.BackSide, toneMapped: false, fog: false, transparent: true }));
  // (its sky fades into the real one at the top)
  clothMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.a *= 1.0 - smoothstep(0.82, 1.0, vMapUv.y);'); };
  const cloth = new THREE.Mesh(own(new THREE.CylinderGeometry(R, R, h, 96, 1, true, Math.PI - arc / 2, arc)), clothMat);
  cloth.position.set(0, h / 2 - 0.6, LAKE.z);
  scene.add(cloth);

  // ---------- a soft shadow under each piece ----------
  const blob = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d') as CanvasRenderingContext2D, gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(27,58,143,0.28)'); gr.addColorStop(0.6, 'rgba(27,58,143,0.1)'); gr.addColorStop(1, 'rgba(27,58,143,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    return own(new THREE.CanvasTexture(c));
  })();
  const shadowMat = own(new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, toneMapped: false }));
  const shadowGeo = own(new THREE.PlaneGeometry(1, 1));
  const shadow = (w: number, d: number, y = 0.02) => { const m = new THREE.Mesh(shadowGeo, shadowMat); m.rotation.x = -Math.PI / 2; m.position.y = y; m.scale.set(w, d, 1); return m; };

  // ---------- the figures ----------
  const glazes = new Map<Piece, THREE.Material>();
  const glazeOf = (k: Piece) => {
    let m = glazes.get(k);
    if (!m) { m = own(new THREE.MeshPhysicalMaterial({ map: paint[k], roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.35 })); glazes.set(k, m); }
    return m;
  };
  const plain = own(new THREE.MeshPhysicalMaterial({ color: '#f3f6fb', roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.4 }));
  // Projection: across the painting from the left of the figure's box to its right, up it from its foot
  const project = (g: THREE.BufferGeometry, box: THREE.Box3) => {
    const pos = g.attributes.position, uv = new Float32Array(pos.count * 2), size = box.getSize(new THREE.Vector3());
    for (let i = 0; i < pos.count; i++) { uv[i * 2] = (pos.getX(i) - box.min.x) / size.x; uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / size.y; }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  };
  const modelled = (k: Piece) => {
    const src = models[k] as THREE.Object3D, out = new THREE.Group();
    src.updateMatrixWorld(true);
    const parts: THREE.BufferGeometry[] = [];
    src.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { const g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld); parts.push(g); } });
    const box = new THREE.Box3();
    parts.forEach((g) => { g.computeBoundingBox(); box.union(g.boundingBox as THREE.Box3); });
    const s = PIECES[k] / (box.max.y - box.min.y), c = box.getCenter(new THREE.Vector3());
    parts.forEach((g) => {
      project(g, box);
      // (sunk a little, so a base the model was given sits under the snow)
      g.translate(-c.x, -box.min.y - (box.max.y - box.min.y) * 0.03, -c.z); g.scale(s, s, s); g.computeVertexNormals();
      out.add(new THREE.Mesh(own(g), glazeOf(k)));
    });
    return out;
  };
  // A turned piece's geometry: its painting's outline, row by row, spun round its middle, the painting projected on
  const lathed = (k: Piece) => {
    const img = outline[k]?.image as CanvasImageSource & { width: number; height: number };
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D; x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height, N = 60, unit = PIECES[k] / H;
    const pts: THREE.Vector2[] = [new THREE.Vector2(0.001, 0)];
    for (let r = 0; r <= N; r++) {
      const py = Math.min(H - 1, Math.round(H - 1 - (r / N) * (H - 1)));
      let reach = 0;
      for (let px = 0; px < W; px++) if (d[(py * W + px) * 4 + 3] > 128) reach = Math.max(reach, Math.abs(px - W / 2));
      pts.push(new THREE.Vector2(Math.max(0.001, reach * unit * 0.92), (r / N) * PIECES[k]));
    }
    pts.push(new THREE.Vector2(0.001, PIECES[k]));
    const g = own(new THREE.LatheGeometry(pts, 48));
    project(g, new THREE.Box3(new THREE.Vector3((-W / 2) * unit, 0, 0), new THREE.Vector3((W / 2) * unit, PIECES[k], 0)));
    return g;
  };
  const made = new Map<Piece, THREE.Object3D>();
  const figure = (k: Piece) => {
    let f = made.get(k);
    if (!f) { f = MODELLED.includes(k) ? modelled(k) : new THREE.Mesh(lathed(k), glazeOf(k)); made.set(k, f); }
    return f.clone();
  };
  // SkillTree's tree: porcelain branches curving up from the trunk to each node, snow lying along their
  // tops, a glowing node in a thin cobalt ring at every fork and tip
  // (pale cobalt porcelain, so the white snow on it shows, and it stands out against the white sky)
  const bark = own(new THREE.MeshPhysicalMaterial({ color: '#b9c9e8', roughness: 0.4, clearcoat: 0.9, clearcoatRoughness: 0.12 }));
  const cobalt = own(new THREE.MeshPhysicalMaterial({ color: '#1b3a8f', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }));
  const snowCap = own(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }));
  const haloTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d') as CanvasRenderingContext2D, gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(140,175,255,0.9)'); gr.addColorStop(0.4, 'rgba(110,150,255,0.35)'); gr.addColorStop(1, 'rgba(110,150,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return own(new THREE.CanvasTexture(c));
  })();
  const skillNodes: { mat: THREE.MeshPhysicalMaterial; halo: THREE.Sprite; level: number }[] = [];
  const skillTree = () => {
    const g = new THREE.Group(), pt = SKILL_NODES.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const blob = own(new THREE.SphereGeometry(1, 20, 12));
    const branch = (a: THREE.Vector3, b: THREE.Vector3, r: number, r1 = r * 0.6) => {
      // (it leaves upward, then bends out toward the node, tapering from r to r1)
      const curve = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3(a.x + (b.x - a.x) * 0.1, (a.y + b.y) / 2 + 0.32, (a.z + b.z) / 2), b);
      const N = 24, R = 12, tube = own(new THREE.TubeGeometry(curve, N, 1, R, false)), pos = tube.attributes.position;
      for (let i = 0; i <= N; i++) {
        const c = curve.getPointAt(i / N), w = r + (r1 - r) * (i / N);
        for (let j = 0; j <= R; j++) { const k = i * (R + 1) + j; pos.setXYZ(k, c.x + (pos.getX(k) - c.x) * w, c.y + (pos.getY(k) - c.y) * w, c.z + (pos.getZ(k) - c.z) * w); }
      }
      tube.computeVertexNormals();
      g.add(new THREE.Mesh(tube, bark));
      // the snow on it: soft lumps along its top, thinning toward the end
      for (let k = 1; k < 6; k++) {
        const t = k / 6, p = curve.getPoint(t), tan = curve.getTangent(t);
        if (Math.abs(tan.y) > 0.92) continue;
        const lump = new THREE.Mesh(blob, snowCap);
        const w = r + (r1 - r) * t;
        lump.position.copy(p).add(new THREE.Vector3(0, w * 0.8, 0));
        lump.scale.set(w * 2.6, w * 0.95, w * 1.7);
        lump.rotation.z = Math.atan2(tan.y, tan.x);
        g.add(lump);
      }
    };
    // the trunk, flaring into the snow at its foot
    branch(new THREE.Vector3(0, 0, 0), pt[0], 0.26, 0.13);
    const foot = new THREE.Mesh(blob, bark); foot.scale.set(0.42, 0.2, 0.42); g.add(foot);
    for (const [i, j] of SKILL_LINKS) SKILL_NODES[j][3] === 1 ? branch(pt[i], pt[j], 0.15, 0.1) : branch(pt[i], pt[j], 0.095, 0.06);
    // the nodes
    SKILL_NODES.forEach(([, , , level], i) => {
      const r = level === 2 ? 0.2 : level === 1 ? 0.17 : 0.24;
      // (a cobalt glazed bead, like a painted Gzhel dot; it lights up bright blue when the light reaches it)
      const mat = own(new THREE.MeshPhysicalMaterial({ color: '#2f58d6', emissive: '#4f86ff', emissiveIntensity: 0, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }));
      const node = new THREE.Mesh(blob, mat); node.scale.setScalar(r); node.position.copy(pt[i]);
      const ring = new THREE.Mesh(own(new THREE.TorusGeometry(r * 1.5, 0.03, 10, 40)), cobalt); ring.position.copy(pt[i]);
      const halo = new THREE.Sprite(own(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, opacity: 0 })));
      halo.position.copy(pt[i]); halo.scale.setScalar(r * 6);
      g.add(node, ring, halo);
      skillNodes.push({ mat, halo, level });
    });
    return g;
  };

  // (turned to face the camera's side of the lake from where it stands)
  const facing = (x: number, z: number) => Math.atan2(EYE.x - x, EYE.z - z) * 0.85;

  // ---------- the islands: a snowy mound each, its landmark on top ----------
  const islandGeo = own(new THREE.LatheGeometry(
    Array.from({ length: 13 }, (_, i) => { const t = i / 12; return new THREE.Vector2(t === 1 ? 0.001 : ISLAND.r * (1.08 - 0.28 * Math.pow(t, 2.2)), ISLAND.h * Math.sin((t * Math.PI) / 2)); }),
    64,
  ));
  const islandMat = own(new THREE.MeshPhysicalMaterial({ color: '#f8fafd', roughness: 0.75, clearcoat: 0.2, clearcoatRoughness: 0.5 }));
  const houses: House[] = HOUSES.map((h0) => {
    // (on a tall screen the wide tree is a little smaller, so it fits across)
    const hs = { ...h0, x: portrait ? h0.px : h0.x, z: portrait ? h0.pz : h0.z, scale: portrait && h0.kind === 'tree' ? 0.78 : h0.scale };
    const group = new THREE.Group();
    group.position.set(hs.x, 0, hs.z);
    group.add(new THREE.Mesh(islandGeo, islandMat), shadow(ISLAND.r * 2.6, ISLAND.r * 1.9, 0.015));
    const k = KIND[hs.kind], tall = k === 'skilltree' ? SKILL_H : PIECES[k], fig = k === 'skilltree' ? skillTree() : figure(k);
    fig.position.y = ISLAND.h * 0.92; fig.rotation.y = facing(hs.x, hs.z); fig.scale.setScalar(hs.scale);
    group.add(fig, shadow(tall * (k === 'skilltree' ? 0.5 : 0.9), tall * (k === 'skilltree' ? 0.35 : 0.6), ISLAND.h + 0.01));
    scene.add(group);
    const height = ISLAND.h + tall * hs.scale;
    const front = new THREE.Vector3(EYE.x - hs.x, 0, EYE.z - hs.z).normalize();
    return { id: hs.id, group, anchor: new THREE.Vector3(hs.x, height + 0.4, hs.z), base: group.position.clone(), front, height };
  });

  // ---------- the trail: a dotted line skated across the ice, from the near shore to each island in turn ----------
  const trail = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, LAKE.z + LAKE.r * 0.95), ...houses.map((h) => h.base.clone().add(new THREE.Vector3(0, 0, ISLAND.r * 1.15)))]);
  const dots = 64, dotGeo = own(new THREE.CircleGeometry(0.07, 12)), dotMat = own(new THREE.MeshBasicMaterial({ color: '#3a5fba', transparent: true, opacity: 0.55, toneMapped: false }));
  const dotMesh = new THREE.InstancedMesh(dotGeo, dotMat, dots), m4 = new THREE.Matrix4(), flat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2), one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < dots; i++) { const p = trail.getPointAt(i / (dots - 1)); m4.compose(new THREE.Vector3(p.x, 0.025, p.z), flat, one); dotMesh.setMatrixAt(i, m4); }
  scene.add(dotMesh);

  // ---------- the penguin, out on the ice ----------
  const [px, pz] = portrait ? [2.6, 5.6] : [-6.4, 5.4];
  const pg = figure('penguin'); pg.position.set(px, 0, pz); pg.rotation.y = facing(px, pz) + 0.4;
  const pgShadow = shadow(1.2, 0.8); pgShadow.position.set(px, 0.02, pz);
  scene.add(pg, pgShadow);

  // ---------- the forest round the lake: deep rows of firs, painted and plain, nearer ones larger ----------
  const firGeo = lathed('fir1');
  const rand = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  const firs: { x: number; z: number; s: number; painted: boolean }[] = [];
  for (let i = 0; i < 160 && firs.length < 84; i++) {
    const a = -Math.PI * 0.62 + rand() * Math.PI * 1.24, d = LAKE.r * 1.35 + 2 + rand() * 13;
    const x = LAKE.x + Math.sin(a) * d * 1.25, z = LAKE.z - Math.cos(a) * d;
    if (z > EYE.z - 8) continue;
    firs.push({ x, z, s: 0.75 + rand() * 0.75 - (d - LAKE.r * 1.35) * 0.012, painted: rand() < 0.62 });
  }
  // (and a few on the near shores, framing the view)
  for (const [x, z, s] of [[-13, 9, 1.3], [-15.5, 6, 1.1], [13.5, 8.5, 1.25], [16, 5, 1.05], [-11, 12.5, 0.9], [11.5, 12, 0.85]]) firs.push({ x, z, s, painted: true });
  const up = new THREE.Vector3(0, 1, 0);
  for (const painted of [true, false]) {
    const list = firs.filter((f) => f.painted === painted);
    const inst = new THREE.InstancedMesh(firGeo, painted ? glazeOf('fir1') : plain, list.length);
    list.forEach((f, i) => { m4.compose(new THREE.Vector3(f.x, 0, f.z), new THREE.Quaternion().setFromAxisAngle(up, facing(f.x, f.z)), new THREE.Vector3(f.s, f.s, f.s)); inst.setMatrixAt(i, m4); });
    scene.add(inst);
  }

  // ---------- the camera the painting is made with ----------
  const postcard = new THREE.PerspectiveCamera(34, PAINTING_ASPECT, 0.1, 300);
  postcard.position.copy(EYE);
  postcard.lookAt(LOOK);
  postcard.updateMatrixWorld();

  // ---------- motion: the hovered island lifts a little; SkillTree's light climbs its nodes ----------
  const skillAt = houses.findIndex((h) => HOUSES.find((x) => x.id === h.id)?.kind === 'tree');
  let wave = -1, glow = 0;
  const step = (dt: number, hover: number, focus: number) => {
    houses.forEach((h, i) => {
      const lift = i === hover ? 0.12 : 0;
      h.group.position.y += (lift - h.group.position.y) * (1 - Math.exp(-dt / 90));
    });
    // While it's pointed at or visited, a light runs up from the root through each level of nodes, again
    // every few seconds; otherwise the nodes rest at a soft glow
    const on = skillAt >= 0 && (hover === skillAt || focus === skillAt);
    glow += ((on ? 1 : 0) - glow) * (1 - Math.exp(-dt / 300));
    if (on && wave < 0) wave = 0;
    if (wave >= 0) { wave += dt; if (wave > 2600) wave = on ? 0 : -1; }
    for (const n of skillNodes) {
      const u = wave < 0 ? 0 : Math.max(0, 1 - Math.abs(wave - 250 - n.level * 380) / 360);
      n.mat.emissiveIntensity = glow * 0.35 + u * 1.6;
      n.halo.material.opacity = glow * 0.25 + u * 0.7;
    }
  };
  const hit = houses.map((h) => h.group);
  const pick = (ray: THREE.Raycaster) => {
    const found = ray.intersectObjects(hit, true).find((x) => (x.object as THREE.Mesh).isMesh && (x.object as THREE.Mesh).material !== shadowMat);
    if (!found) return -1;
    return houses.findIndex((h) => { let o: THREE.Object3D | null = found.object; while (o) { if (o === h.group) return true; o = o.parent; } return false; });
  };

  await renderer.compileAsync(scene, postcard).catch(() => {});
  return {
    scene, houses, postcard, step, pick,
    dispose: () => { disposables.forEach((d) => d.dispose()); Object.values(paint).forEach((t) => t.dispose()); Object.values(outline).forEach((t) => t?.dispose()); taiga.dispose(); ice.dispose(); },
  };
}
