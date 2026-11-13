import * as THREE from 'three';
import { WAIST } from '@/app/data/dolls';
import { DEFAULT_FABRIC, type Fabric, type Garment, type Kind, type Outfit } from '@/app/data/outfit';
import { FLOOR, OUTLINE, radiusAt } from '@/app/components/DollScene';

// His doll's clothes in 3D, fitted to the doll itself: every garment is grown out of the doll's own
// outline (the lathe profile it's spun from) by a few box units, so a T-shirt hugs the body, a jacket
// sits over the T-shirt, a beanie fits the crown. Like the doll, the clothes are cut at the waist:
// what's above goes on the lid (and lifts with it when the doll opens), what's below stays on the base.
// Coordinates are the doll's: box units, y up from the floor (FLOOR − y in the drawing's terms).
//
// Each garment takes the light the way its material does (FINISH): cotton and knit matte with a soft
// sheen at the edges, a nylon puffer with a slight shine, leather a soft gloss, acetate glasses glossy.
const FINISH: Record<Fabric, THREE.MeshPhysicalMaterialParameters> = {
  cotton: { roughness: 0.88, sheen: 0.6, sheenRoughness: 0.6 },
  knit: { roughness: 0.95, sheen: 1, sheenRoughness: 0.35 },
  fleece: { roughness: 1, sheen: 1, sheenRoughness: 0.25 },
  denim: { roughness: 0.85, sheen: 0.3, sheenRoughness: 0.7 },
  canvas: { roughness: 0.82, sheen: 0.35, sheenRoughness: 0.6 },
  wool: { roughness: 0.95, sheen: 0.9, sheenRoughness: 0.4 },
  nylon: { roughness: 0.32, clearcoat: 0.35, clearcoatRoughness: 0.3, sheen: 0.2, sheenRoughness: 0.5 },
  leather: { roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.28 },
  suede: { roughness: 1, sheen: 0.8, sheenRoughness: 0.5 },
  acetate: { roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 },
  metal: { roughness: 0.28, metalness: 1 },
};

const TILE = 10; // a pattern repeats every 10 box units
const P = (r: number, y: number) => new THREE.Vector2(Math.max(r, 0.01), FLOOR - y);

// ---------- the doll's outline, grown outwards ----------
/** The outline between heights y0 and y1 (drawing coordinates, y down), as (r, y) points */
function outline(y0: number, y1: number) {
  const pts = [{ r: radiusAt(y0), y: y0 }];
  for (const p of OUTLINE) if (p.y > y0 + 0.4 && p.y < y1 - 0.4) pts.push(p);
  pts.push({ r: radiusAt(y1), y: y1 });
  return pts;
}
/** That outline pushed out along its normal by off(y) (so the crown grows upwards, the sides outwards) */
function grown(y0: number, y1: number, off: (y: number) => number) {
  const pts = outline(y0, y1);
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dr = b.r - a.r, dy = b.y - a.y, len = Math.hypot(dr, dy) || 1;
    const d = off(p.y);
    return P(p.r + (dy / len) * d, p.y - (dr / len) * d);
  });
}

// ---------- patterns ----------
function pattern(g: Garment) {
  if (g.pattern === 'solid') return null;
  const S = 256, c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const base = new THREE.Color(g.color), two = g.color2 ?? `#${base.clone().offsetHSL(0, 0, -0.18).getHexString()}`;
  x.fillStyle = g.color; x.fillRect(0, 0, S, S);
  if (g.pattern === 'stripes') {
    x.fillStyle = two; x.fillRect(0, 0, S, S * 0.42);
  } else if (g.pattern === 'check') {
    x.globalAlpha = 0.55; x.fillStyle = two;
    x.fillRect(0, S * 0.3, S, S * 0.4); x.fillRect(S * 0.3, 0, S * 0.4, S);
    x.globalAlpha = 0.5; x.fillStyle = `#${base.clone().offsetHSL(0, 0, -0.25).getHexString()}`;
    x.fillRect(0, S * 0.48, S, S * 0.04); x.fillRect(S * 0.48, 0, S * 0.04, S);
  } else if (g.pattern === 'knit') {
    // Ribs: four to a tile, darker in the furrows
    for (let k = 0; k < 4; k++) {
      const gr = x.createLinearGradient((k * S) / 4, 0, ((k + 1) * S) / 4, 0);
      gr.addColorStop(0, 'rgba(0,0,0,0.22)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.06)'); gr.addColorStop(1, 'rgba(0,0,0,0.22)');
      x.fillStyle = gr; x.fillRect((k * S) / 4, 0, S / 4, S);
    }
  } else if (g.pattern === 'denim') {
    // Twill: fine diagonals, and a little fleck
    x.strokeStyle = 'rgba(255,255,255,0.13)'; x.lineWidth = 3;
    for (let k = -S; k < S * 2; k += 16) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + S, S); x.stroke(); }
    for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; x.fillRect(Math.random() * S, Math.random() * S, 2, 2); }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Pattern coordinates by position on the doll: round the body, and up it, a tile every TILE units */
function wrapUV(g: THREE.BufferGeometry, around: number) {
  const pos = g.attributes.position, uv = g.attributes.uv;
  const n = Math.max(1, Math.round((2 * Math.PI * around) / TILE));
  for (let i = 0; i < pos.count; i++) {
    const phi = Math.atan2(pos.getX(i), pos.getZ(i));
    uv.setXY(i, (phi / (2 * Math.PI) + 0.5) * n, pos.getY(i) / TILE);
  }
  uv.needsUpdate = true;
}

// ---------- real models (public/outfit, prepared by scripts/outfit-models.py) ----------
// Hats and shoes are real 3D models (CC BY, credits in data/outfit), made one unit wide, with
// a grey colour texture that's tinted to the colour in his photo. Each is fitted to the doll: a hat's
// rim round the head above the brows (squashed only if it would stand too tall on the doll's short
// crown), shoes standing at the front of the base, half out of it.
/** fit: places a model made one unit wide; a jacket fitted in Blender (scripts/outfit-fit.py) is already
 *  in the doll's units, cut into 'upper' and 'lower' at the waist (split). when: whether this model
 *  suits the garment (a zipped-up model can't be worn open). */
type Fit = { url: string; fit?: (o: THREE.Object3D, box: THREE.Box3) => void; split?: boolean; when?: (g: Garment) => boolean };
const hat = (rim: number, room: number) => (o: THREE.Object3D, box: THREE.Box3) => {
  const w = 2 * radiusAt(rim) * 1.07, size = box.getSize(new THREE.Vector3());
  o.scale.set(w, Math.min(w, ((rim - 8) * room) / size.y), w);
  // Its back against the back of the head, so a brim reaches out in front instead of pulling the crown
  // forward off the head
  o.position.set(0, FLOOR - rim - 1.5, -w / 2 - box.min.z * w);
  o.rotation.x = -0.05;
};
const shoes = (width: number) => (o: THREE.Object3D) => {
  o.scale.setScalar(width);
  o.position.set(0, 0, radiusAt(246) + 18);
};
const MODELS: Partial<Record<Kind, Fit>> = {
  beanie: { url: '/outfit/beanie.glb', fit: hat(60, 1.3) },
  cap: { url: '/outfit/cap.glb', fit: hat(56, 1.2) },
  sneakers: { url: '/outfit/sneakers.glb', fit: shoes(54) },
  boots: { url: '/outfit/boots.glb', fit: shoes(50) },
  puffer: { url: '/outfit/puffer.glb', split: true, when: (g) => !g.open },
  sweater: { url: '/outfit/sweater.glb', split: true },
  hoodie: { url: '/outfit/sweater.glb', split: true },
};

/** Pattern coordinates on a fitted model, in a second set (uv1) so its own maps keep theirs: round the
 *  doll and up it, a tile every TILE units, as on the drawn garments */
function wrapUV1(g: THREE.BufferGeometry) {
  if (g.attributes.uv1) return;
  const pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
  const n = Math.round((2 * Math.PI * 80) / TILE);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (Math.atan2(pos.getX(i), pos.getZ(i)) / (2 * Math.PI) + 0.5) * n;
    uv[i * 2 + 1] = pos.getY(i) / TILE;
  }
  g.setAttribute('uv1', new THREE.BufferAttribute(uv, 2));
}
const loaded = new Map<string, Promise<THREE.Object3D>>();
const loadModel = (url: string) => {
  if (!loaded.has(url)) {
    loaded.set(url, import('three/examples/jsm/loaders/GLTFLoader.js')
      .then(({ GLTFLoader }) => new GLTFLoader().loadAsync(url))
      .then((g) => g.scene));
  }
  return loaded.get(url) as Promise<THREE.Object3D>;
};

// ---------- the builder ----------
/** Dresses a doll (buildDoll's group and head). `fadable`: made see-through-able from the start, for a
 *  doll that fades (three.js would otherwise stall a frame recompiling). Returns how to take it all off
 *  again, and how to fade it with the doll. Real models arrive a moment later; onChange says when. */
export function wearOutfit(doll: { group: THREE.Object3D; head: THREE.Object3D }, outfit: Outfit, fadable = false, onChange?: () => void) {
  const upper = new THREE.Group(), lower = new THREE.Group();
  upper.name = 'outfit-upper'; lower.name = 'outfit-lower';
  const own: { dispose: () => void }[] = [];

  const mats: THREE.Material[] = [];
  let off = false;
  const material = (color: string, fabric: Fabric, map: THREE.Texture | null = null) => {
    const c = new THREE.Color(color);
    const m = new THREE.MeshPhysicalMaterial({
      color: c, map, side: THREE.DoubleSide, transparent: fadable,
      sheenColor: c.clone().lerp(new THREE.Color('#ffffff'), 0.35),
      ...FINISH[fabric],
      ...((fabric === 'knit' || fabric === 'fleece' || fabric === 'wool') && map ? { bumpMap: map, bumpScale: 0.6 } : {}),
    });
    own.push(m); mats.push(m);
    if (map) own.push(map);
    return m;
  };
  /** A darker shade of a colour, for ribbing and seams */
  const shade = (color: string, by = -0.08) => `#${new THREE.Color(color).offsetHSL(0, 0, by).getHexString()}`;

  const add = (mesh: THREE.Mesh, y: number) => {
    own.push(mesh.geometry);
    (y < WAIST ? upper : lower).add(mesh);
    return mesh;
  };

  /** A garment's shell between heights y0 and y1: `off` units out from the doll, `thick` thick, open at
   *  the front by `gap` radians if it's worn open. Split at the waist, the top half on the lid. */
  const shell = (y0: number, y1: number, off: (y: number) => number, thick: number, mat: THREE.Material, gap = 0) => {
    const cuts = y0 < WAIST && y1 > WAIST ? [[y0, WAIST], [WAIST, y1]] : [[y0, y1]];
    for (const [a, b] of cuts) {
      const outer = grown(a, b, (y) => off(y) + thick), inner = grown(a, b, off).reverse();
      const loop = [...outer, ...inner, outer[0].clone()];
      const g = gap
        ? new THREE.LatheGeometry(loop, 96, gap, Math.PI * 2 - gap * 2)
        : new THREE.LatheGeometry(loop, 96, Math.PI, Math.PI * 2);
      wrapUV(g, radiusAt((a + b) / 2) + off((a + b) / 2));
      add(new THREE.Mesh(g, mat), (a + b) / 2);
      // An open garment's cut edges, closed so it reads as cloth with a thickness, not a hollow
      if (gap) {
        const shape = new THREE.Shape(loop.slice(0, -1));
        for (const phi of [gap, Math.PI * 2 - gap]) {
          const cap = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat);
          cap.rotation.y = phi - Math.PI / 2;
          add(cap, (a + b) / 2);
        }
      }
    }
  };
  /** A rolled edge round the doll at height y (a collar, a hem, a cuff), open at the front by gap */
  const ring = (y: number, off: number, tube: number, mat: THREE.Material, gap = 0) => {
    const R = radiusAt(y) + off;
    const g = new THREE.TorusGeometry(R, tube, 12, 96, Math.PI * 2 - gap * 2);
    const m = new THREE.Mesh(g, mat);
    m.rotation.x = -Math.PI / 2;
    const holder = new THREE.Group();
    holder.add(m);
    holder.position.y = FLOOR - y;
    holder.rotation.y = gap - Math.PI / 2;
    own.push(g);
    (y < WAIST ? upper : lower).add(holder);
  };
  const even = (v: number) => () => v;

  /** A real model for this garment: placed, tinted, and its material's finish set by fabric. If it
   *  can't load, the drawn one stands in. */
  function model(g: Garment, m: Fit) {
    loadModel(m.url).then((scene) => {
      if (off) return;
      const o = scene.clone(true);
      const box = new THREE.Box3().setFromObject(o);
      const fabric = g.fabric ?? DEFAULT_FABRIC[g.kind];
      o.traverse((c) => {
        const mesh = c as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        const t = mat.clone();
        t.color.set(g.color);
        // Stripes, checks: painted on in the doll's own coordinates, over the model's shape and folds
        const tex = m.split ? pattern(g) : null;
        if (tex) {
          wrapUV1(mesh.geometry);
          tex.channel = 1;
          t.map = tex; t.color.set('#ffffff');
          own.push(tex);
        }
        if (!t.roughnessMap) t.roughness = FINISH[fabric].roughness ?? t.roughness;
        t.metalness = FINISH[fabric].metalness ?? 0;
        t.transparent = fadable || t.transparent;
        // (a model that arrives while the doll is faded comes in faded)
        if (fadable) { t.opacity = faded; t.depthWrite = faded > 0.98; }
        mesh.material = t;
        own.push(t); mats.push(t);
      });
      if (m.split) {
        // (looked up before moving: moving one changes the children being searched)
        const top = o.getObjectByName('upper'), bottom = o.getObjectByName('lower');
        if (top) upper.add(top);
        if (bottom) lower.add(bottom);
      } else {
        m.fit?.(o, box);
        (g.slot === 'shoes' ? lower : upper).add(o);
      }
      onChange?.();
    }).catch(() => {
      if (off) return;
      procedural(g);
      onChange?.();
    });
  }

  function procedural(g: Garment) {
    const fabric = g.fabric ?? DEFAULT_FABRIC[g.kind];
    const main = material(g.color, fabric, pattern(g));
    // Ribbing, hems, seams: a shade darker; knit ribbing on knitwear
    const trim = material(shade(g.color), fabric === 'fleece' || fabric === 'knit' ? 'knit' : fabric);

    switch (g.kind) {
      // ---- head ----
      case 'beanie': {
        // Slouchy: fuller towards the crown, then a folded cuff with rolled edges
        shell(8, 50, (y) => 1 + 5.5 * (1 - Math.min(1, Math.max(0, (y - 8) / 40))) ** 1.4, 2.2, main);
        const cuff = material(g.color, 'knit', pattern({ ...g, pattern: 'knit' }));
        shell(44, 61, even(3), 3.2, cuff);
        ring(44.5, 4.6, 1.7, cuff);
        ring(60.5, 4.6, 1.7, cuff);
        if (g.extra) {
          const pom = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 3), material(g.color2 ?? g.color, 'fleece'));
          pom.position.y = FLOOR - 8 + 3.2 + 6;
          add(pom, 0);
        }
        break;
      }
      case 'cap': {
        shell(8, 54, even(0.8), 1.8, main);
        const r = radiusAt(54);
        // The brim tips down over the brow, so it reads from a shelf-height camera
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.6, 48, 1, false, -Math.PI / 2, Math.PI), material(g.color2 ?? g.color, fabric));
        brim.scale.set(r * 0.92, 1, r + 30);
        brim.position.y = FLOOR - 54;
        brim.rotation.x = 0.3;
        add(brim, 0);
        const button = new THREE.Mesh(new THREE.SphereGeometry(2.6, 16, 10), main);
        button.position.y = FLOOR - 8 + 2.4;
        add(button, 0);
        break;
      }
      // ---- top ----
      case 'tee':
      case 'shirt':
      case 'sweater':
      case 'hoodie': {
        const hem = 216;
        shell(117, hem, even(0.6), 1.4, main);
        ring(117.5, 1.6, g.kind === 'tee' || g.kind === 'shirt' ? 1.3 : 1.9, g.kind === 'tee' || g.kind === 'shirt' ? main : trim);
        if (g.kind === 'sweater' || g.kind === 'hoodie') ring(hem - 1, 2.2, 1.9, trim);
        if (g.kind === 'shirt') shirtFront(main, g.open);
        if (g.kind === 'hoodie' || g.extra) hood(g.color, fabric);
        break;
      }
      // ---- outer ----
      case 'jacket':
      case 'puffer':
      case 'coat':
      case 'vest': {
        const gap = g.open ? 0.36 : 0;
        const hem = g.kind === 'coat' ? 236 : 208;
        const quilted = g.kind === 'puffer' || (g.kind === 'vest' && fabric === 'nylon');
        const off = quilted
          ? (y: number) => 2.6 + 2.4 * Math.abs(Math.sin((Math.PI * (y - 113)) / 15))
          : even(2.6);
        shell(113, hem, off, 2, main, gap);
        if (g.kind !== 'vest') ring(113, quilted ? 6.5 : 5, quilted ? 3.4 : 2.6, main, gap);
        ring(hem, off(hem) + 2, 1.5, trim, gap);
        if (!g.open) {
          // A zip down the front
          const zip = new THREE.Mesh(new THREE.BoxGeometry(0.9, hem - 116, 0.8), material('#3a3a3a', 'metal'));
          zip.position.set(0, FLOOR - (113 + hem) / 2, radiusAt((113 + hem) / 2) + off(160) + 2.2);
          add(zip, 160);
        }
        if (g.extra) hood(g.color, fabric);
        break;
      }
      // ---- bottom ----
      case 'trousers':
      case 'jeans': {
        shell(210, 247, even(0.4), 1.2, main);
        ring(211, 1.8, 1.1, trim);
        break;
      }
      // ---- shoes: two toes peeking out at the front of the base ----
      case 'sneakers':
      case 'boots': {
        const tall = g.kind === 'boots' ? 1.5 : 1;
        for (const sx of [-1, 1]) {
          const x = sx * 14, z = radiusAt(246) - 3;
          const upperPart = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), main);
          upperPart.scale.set(10, 6.5 * tall, 14);
          upperPart.position.set(x, 2.2, z);
          add(upperPart, 250);
          const sole = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 32), material(g.color2 ?? shade(g.color, -0.2), 'leather'));
          sole.scale.set(10.4, 2.4, 14.4);
          sole.position.set(x, 1.2, z);
          add(sole, 250);
        }
        break;
      }
      // ---- accessories ----
      case 'glasses': {
        const ey = 89, dx = 13.5, rad = 7.6, r = radiusAt(ey);
        for (const sx of [-1, 1]) {
          const x = sx * dx, z = Math.sqrt(r * r - x * x) + 1.8;
          const rim = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.95, 10, 40), main);
          rim.position.set(x, FLOOR - ey, z);
          rim.rotation.y = Math.atan2(x, z);
          add(rim, 0);
        }
        const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, dx * 2 - rad * 2 + 1, 10), main);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, FLOOR - ey + 1.5, r + 2.6);
        add(bridge, 0);
        break;
      }
      case 'scarf': {
        const knot = new THREE.Mesh(new THREE.TorusGeometry(radiusAt(119) + 6.5, 6.5, 14, 96), main);
        wrapUV(knot.geometry, radiusAt(119) + 6.5);
        knot.rotation.set(-Math.PI / 2, 0, 0.0);
        knot.position.y = FLOOR - 119;
        add(knot, 119);
        // Two ends hanging down the front, leaning out with the body
        [[-15, 0.08, 0], [-4, -0.05, 6]].forEach(([x, tilt, drop]) => {
          const len = 46 - drop;
          const end = new THREE.Mesh(new THREE.CapsuleGeometry(4.8, len, 6, 16), main);
          wrapUV(end.geometry, 6);
          end.scale.set(1.5, 1, 0.4);
          const yc = 122 + len / 2 + drop;
          end.position.set(x, FLOOR - yc, Math.sqrt(Math.max(0, radiusAt(yc) ** 2 - x * x)) + 5.5);
          end.rotation.set(-0.5, Math.atan2(x, radiusAt(yc)), tilt);
          add(end, 0);
        });
        break;
      }
    }
  }

  for (const g of outfit) {
    const m = MODELS[g.kind];
    if (m && (!m.when || m.when(g))) {
      model(g, m);
      // A hoodie is the sweatshirt with its hood; a jacket can have one too
      if (g.kind === 'hoodie' || (g.extra && g.slot === 'outer')) hood(g.color, g.fabric ?? DEFAULT_FABRIC[g.kind]);
    } else procedural(g);
  }

  // A shirt's collar points, lying on the chest, and its buttons down the front (unless worn open)
  function shirtFront(mat: THREE.Material, open: boolean) {
    const tri = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(11, 0), new THREE.Vector2(1.5, -13)]);
    for (const sx of [-1, 1]) {
      const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 1.1, bevelEnabled: false }), mat);
      flap.scale.x = sx;
      flap.position.set(sx * 1.5, FLOOR - 117, radiusAt(121) + 2.2);
      flap.rotation.set(-0.55, 0, sx * -0.15);
      add(flap, 0);
    }
    if (open) return;
    const bm = material('#f4f1ea', 'acetate');
    for (let y = 132; y <= 204; y += 18) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 8), bm);
      b.scale.z = 0.5;
      b.position.set(0, FLOOR - y, radiusAt(y) + 2.1);
      add(b, y);
    }
  }

  // A hood lying round the back of the neck
  function hood(color: string, fabric: Fabric) {
    const R = radiusAt(118) + 5;
    const g = new THREE.TorusGeometry(R, 7.5, 14, 48, Math.PI);
    const m = new THREE.Mesh(g, material(color, fabric));
    m.rotation.x = -Math.PI / 2 + 0.3;
    m.position.y = FLOOR - 116;
    add(m, 0);
  }

  doll.head.add(upper);
  doll.group.add(lower);
  let faded = 1;
  return {
    dispose: () => {
      off = true;
      upper.removeFromParent(); lower.removeFromParent();
      own.forEach((o) => o.dispose());
    },
    fade: (a: number) => {
      if (!fadable || a === faded) return;
      faded = a;
      mats.forEach((m) => { m.opacity = a; m.depthWrite = a > 0.98; });
    },
  };
}
