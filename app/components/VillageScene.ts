import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HOUSES, PAINTING_ASPECT, SKY } from '@/app/data/village';

// The side-projects world: a snowy village seen from above, one winding path running up through it past a
// landmark for each side project, in the tour's order: EZ Recipe's cabin with its steaming pot, SkillTree's
// tree, and at the end of the path the about-site's hut on chicken legs. A porcelain penguin stands by the
// frozen pond, and a few plain white firs give it rhythm; the places are the only painted things.
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

/** One side project's place: where it stands, which way the camera sees it from, where its label hangs */
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
const PIECES = { cabin: 3.0, hut: 4.0, penguin: 1.7, fir1: 4.4, fir2: 2.3 } as const;
type Piece = keyof typeof PIECES;
const MODELLED: Piece[] = ['cabin', 'hut', 'penguin'];
const TURNED: Piece[] = ['fir1', 'fir2'];
const KIND: Record<string, Piece | 'skilltree'> = { house: 'cabin', tree: 'skilltree', hut: 'hut' };
/** SkillTree's tree, as a diagram: its nodes (x, y, depth, level) in front view, and the branches between them */
const SKILL_NODES: [number, number, number, number][] = [
  [0, 1.45, 0, 0],
  [-1.3, 2.55, 0.2, 1], [0, 2.95, -0.15, 1], [1.3, 2.55, 0.2, 1],
  [-2.0, 3.45, 0.1, 2], [-0.85, 3.95, 0.3, 2], [0, 4.35, 0, 2], [0.85, 3.95, 0.3, 2], [2.0, 3.45, 0.1, 2],
];
const SKILL_LINKS: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [3, 7], [3, 8]];
const SKILL_H = 4.6;
/** The ground painting covers G × G world units round the middle; beyond it, plain snow */
const G = 24;
/** Where the camera that paints her window stands, and looks */
const EYE = new THREE.Vector3(0, 17, 35), LOOK = new THREE.Vector3(0, 0.9, -3.1);

const loadTex = (src: string) => new THREE.TextureLoader().loadAsync(src).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });
type Assets = { paint: Record<Piece, THREE.Texture>; outline: Partial<Record<Piece, THREE.Texture>>; models: Partial<Record<Piece, THREE.Object3D>>; ground: THREE.Texture };
let assets: Promise<Assets> | null = null;
const keyed = <T,>(keys: Piece[], list: T[]) => Object.fromEntries(keys.map((k, i) => [k, list[i]]));
/** Fetch the paintings and models (once); call early to warm the cache */
export const loadVillageAssets = () => (assets ??= Promise.all([
  Promise.all((Object.keys(PIECES) as Piece[]).map((k) => loadTex(`/village/${k}-paint.webp`))),
  Promise.all(TURNED.map((k) => loadTex(`/village/${k}.webp`))),
  Promise.all(MODELLED.map((k) => new GLTFLoader().loadAsync(`/village/models/${k}.glb`).then((g) => g.scene))),
  loadTex('/village/ground.webp'),
]).then(([paint, outline, models, ground]) => ({
  paint: keyed(Object.keys(PIECES) as Piece[], paint) as Record<Piece, THREE.Texture>,
  outline: keyed(TURNED, outline), models: keyed(MODELLED, models), ground,
})));

export async function createVillage(renderer: THREE.WebGLRenderer): Promise<Village> {
  const { paint, outline, models, ground } = await loadVillageAssets();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(SKY, 48, 110);
  const disposables: { dispose: () => void }[] = [];
  const own = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  // ---------- light: a soft studio for the porcelain's glaze ----------
  const pmrem = own(new THREE.PMREMGenerator(renderer));
  scene.environment = own(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
  scene.environmentIntensity = 0.45;
  const sun = new THREE.DirectionalLight('#ffffff', 1.1);
  sun.position.set(-4, 7, 6);
  scene.add(sun, new THREE.HemisphereLight('#ffffff', '#c9d7f0', 1.35));

  // ---------- the snowfield: the ground painting in the middle, its edges fading into plain snow ----------
  const span = 90;
  ground.wrapS = ground.wrapT = THREE.ClampToEdgeWrapping;
  ground.repeat.set(span / G, span / G);
  ground.offset.set(-(span / G - 1) / 2, -(span / G - 1) / 2);
  const fieldMat = own(new THREE.MeshBasicMaterial({ map: ground, toneMapped: false }));
  fieldMat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      vec2 e = min(vMapUv, 1.0 - vMapUv);
      diffuseColor.rgb = mix(vec3(0.97, 0.98, 0.995), diffuseColor.rgb, smoothstep(0.0, 0.07, min(e.x, e.y)));`);
  };
  const field = new THREE.Mesh(own(new THREE.PlaneGeometry(span, span)), fieldMat);
  field.rotation.x = -Math.PI / 2;
  scene.add(field);

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


  // ---------- the places, one per side project, standing on the snow, turned to the front of the village ----------
  const houses: House[] = HOUSES.map((hs) => {
    const group = new THREE.Group();
    group.position.set(hs.x, 0, hs.z);
    const k = KIND[hs.kind], tall = k === 'skilltree' ? SKILL_H : PIECES[k], fig = k === 'skilltree' ? skillTree() : figure(k);
    fig.rotation.y = Math.atan2(-hs.x * 0.5, 22 - hs.z); fig.scale.setScalar(hs.scale);
    group.add(fig, shadow(tall * (k === 'skilltree' ? 0.5 : 0.95), tall * (k === 'skilltree' ? 0.35 : 0.7)));
    scene.add(group);
    const height = tall * hs.scale;
    // (seen from the front of the village; the hut at the end of the path from the front left, so the places
    // before it on the path aren't in the way)
    const front = hs.kind === 'hut' ? new THREE.Vector3(-0.5, 0, 1).normalize() : new THREE.Vector3(-hs.x * 0.4, 0, 22 - hs.z).normalize();
    return { id: hs.id, group, anchor: new THREE.Vector3(hs.x, height + 0.35, hs.z), base: group.position.clone(), front, height };
  });

  // ---------- the penguin by the frozen pond, and a few plain white firs, for rhythm and depth ----------
  const stand = (k: Piece, x: number, z: number, sc: number) => {
    const f = MODELLED.includes(k) ? figure(k) : new THREE.Mesh(lathed(k), plain);
    f.position.set(x, 0, z); f.rotation.y = Math.atan2(-x * 0.5, 22 - z); f.scale.setScalar(sc);
    const sh = shadow(PIECES[k] * 0.6 * sc, PIECES[k] * 0.45 * sc); sh.position.set(x, 0.02, z);
    scene.add(f, sh);
  };
  stand('penguin', 4.4, 5.2, 1);
  const FIRS: [Piece, number, number, number][] = [
    ['fir1', -8.2, -3, 1.1], ['fir2', -6.6, 5.4, 0.9], ['fir1', 8.6, -7.6, 1.2], ['fir2', 7.6, 1.2, 0.85], ['fir1', -3.4, -14, 1],
  ];
  FIRS.forEach(([k, x, z, sc]) => stand(k, x, z, sc));

  // ---------- the camera the painting is made with ----------
  const postcard = new THREE.PerspectiveCamera(34, PAINTING_ASPECT, 0.1, 300);
  postcard.position.copy(EYE);
  postcard.lookAt(LOOK);
  postcard.updateMatrixWorld();

  // ---------- motion: the hovered place lifts a little; SkillTree's light climbs its nodes ----------
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
    dispose: () => { disposables.forEach((d) => d.dispose()); Object.values(paint).forEach((t) => t.dispose()); Object.values(outline).forEach((t) => t?.dispose()); ground.dispose(); },
  };
}
