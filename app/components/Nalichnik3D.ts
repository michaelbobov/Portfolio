import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { BOX, FOCUS, OPEN, PIECES, SHUTTERS, STAGE, frameSvg, shutterSvg, type Focus } from '@/app/data/nalichnik';

// The carved window in three.js: the frame's pieces extruded to different depths (so the carving stands in
// relief), lacquered like the dolls and painted with the window's carving; a recessed opening with a
// picture behind a pane of glass (setPhoto: swapped while the shutters are shut); and two shutters on hinges that swing open on a spring, overshooting and
// settling, casting soft shadows into the recess. The window tilts a little after the pointer. It renders
// only while something moves.


const svgImage = (svg: string, scale: number) => new Promise<HTMLCanvasElement>((ok, no) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    (c.getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0, c.width, c.height);
    ok(c);
  };
  img.onerror = no;
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
});

export type Window3D = { setOpen: (open: boolean) => void; setPhoto: (img: HTMLImageElement, focus?: Focus) => void; ready: Promise<void>; dispose: () => void };

export function createWindow(canvas: HTMLCanvasElement, opts: { open?: boolean; reduce?: boolean } = {}): Window3D {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.45;
  scene.add(new THREE.HemisphereLight('#f4f8ff', '#7d8db0', 1.0));
  const key = new THREE.DirectionalLight('#ffffff', 2.2);
  key.position.set(-180, 260, 420);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -260, right: 260, top: 300, bottom: -300, near: 10, far: 1200 });
  key.shadow.radius = 6;
  key.shadow.bias = -0.0008;
  scene.add(key);
  const own: { dispose: () => void }[] = [renderer, pmrem, env];

  // The window's own group, centred on its box: x right, y up (the drawing's y is down), z towards you
  const win = new THREE.Group();
  scene.add(win);
  const cx = BOX.w / 2, cy = BOX.h / 2;
  const at = (x: number, y: number) => new THREE.Vector2(x - cx, cy - y);

  // ---------- the frame ----------
  const frameMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.42, clearcoat: 0.9, clearcoatRoughness: 0.18 });
  const sideMat = new THREE.MeshPhysicalMaterial({ color: '#f4f2ee', roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  own.push(frameMat, sideMat);
  const loader = new SVGLoader();
  PIECES.forEach((p) => {
    const parsed = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${p.d}"/></svg>`);
    parsed.paths.forEach((path) => SVGLoader.createShapes(path).forEach((shape) => {
      const g = new THREE.ExtrudeGeometry(shape, { depth: p.depth, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 0.9, bevelSegments: 2, curveSegments: 24 });
      // into the window's axes (y up), its painted face's uv the drawing's box
      // (turned over about x, not mirrored, so its faces still face out; then stood on z = 0)
      g.translate(-cx, -cy, 0); g.scale(1, -1, -1); g.translate(0, 0, p.depth);
      const pos = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + cx) / BOX.w, (pos.getY(i) + cy) / BOX.h);
      const m = new THREE.Mesh(g, [frameMat, sideMat]);
      m.castShadow = m.receiveShadow = true;
      win.add(m);
      own.push(g);
    }));
  });

  // ---------- the recess, the picture, and the glass ----------
  const DEPTH = 18;
  const o = at(OPEN.x + OPEN.w / 2, OPEN.y + OPEN.h / 2);
  const wallMat = new THREE.MeshStandardMaterial({ color: '#e9edf3', roughness: 0.8 });
  own.push(wallMat);
  [[OPEN.w, 2, 0, OPEN.h / 2], [OPEN.w, 2, 0, -OPEN.h / 2], [2, OPEN.h, -OPEN.w / 2, 0], [2, OPEN.h, OPEN.w / 2, 0]].forEach(([w, h, x, y]) => {
    const g = new THREE.BoxGeometry(w, h, DEPTH);
    const m = new THREE.Mesh(g, wallMat);
    m.position.set(o.x + x, o.y + y, -DEPTH / 2);
    m.receiveShadow = true;
    win.add(m); own.push(g);
  });
  const photoMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, emissive: '#ffffff', emissiveIntensity: 0.45 });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(OPEN.w, OPEN.h), photoMat);
  photo.position.set(o.x, o.y, -DEPTH);
  photo.receiveShadow = true;
  win.add(photo); own.push(photo.geometry, photoMat);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.1, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(OPEN.w, OPEN.h), glassMat);
  glass.position.set(o.x, o.y, -4);
  win.add(glass); own.push(glass.geometry, glassMat);

  // ---------- the shutters, hinged on the frame's outer edges, painted on both sides ----------
  const HALF = SHUTTERS.w / 2, T = 5;
  const leaves = (['l', 'r'] as const).map((side) => {
    const faceMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.42, clearcoat: 0.9, clearcoatRoughness: 0.18 });
    own.push(faceMat);
    const g = new THREE.BoxGeometry(HALF - 1, SHUTTERS.h - 2, T);
    // faces: +x, -x, +y, -y, front (+z), back (-z)
    const m = new THREE.Mesh(g, [sideMat, sideMat, sideMat, sideMat, faceMat, faceMat]);
    m.castShadow = m.receiveShadow = true;
    const hinge = new THREE.Group();
    const h = at(side === 'l' ? SHUTTERS.x : SHUTTERS.x + SHUTTERS.w, SHUTTERS.y + SHUTTERS.h / 2);
    // (in front of the pilasters, so they close over them)
    hinge.position.set(h.x, h.y, 14 + T / 2);
    m.position.x = side === 'l' ? HALF / 2 : -HALF / 2;
    hinge.add(m);
    win.add(hinge);
    own.push(g);
    return { side, hinge, faceMat, angle: 0, vel: 0 };
  });

  // ---------- the camera: the whole stage in view ----------
  const camera = new THREE.PerspectiveCamera(24, 1, 10, 5000);
  const fit = () => {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const sw = STAGE.x1 - STAGE.x0, sh = STAGE.y1 - STAGE.y0;
    const t = Math.tan(((camera.fov / 2) * Math.PI) / 180);
    const dist = Math.max(sh / 2 / t, sw / 2 / t / camera.aspect);
    camera.position.set(0, (cy - (STAGE.y0 + STAGE.y1) / 2), dist);
    camera.lookAt(0, camera.position.y, 0);
    camera.updateProjectionMatrix();
  };
  fit();

  // ---------- paint it ----------
  const texture = (src: TexImageSource) => { const t = new THREE.Texture(src as HTMLCanvasElement); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; };
  const ready = Promise.all([svgImage(frameSvg(false), 4), svgImage(shutterSvg('l'), 4), svgImage(shutterSvg('r'), 4)]).then(([frame, sl, sr]) => {
    const tex = (src: TexImageSource) => { const t = texture(src); own.push(t); return t; };
    frameMat.map = tex(frame); frameMat.needsUpdate = true;
    leaves[0].faceMat.map = tex(sl); leaves[1].faceMat.map = tex(sr);
    leaves.forEach((l) => { l.faceMat.needsUpdate = true; });
    render();
  });

  // The picture, covering the opening: cropped to it round its focus (the texture's v runs up, the
  // picture's y down)
  let photoTex: THREE.Texture | null = null;
  const setPhoto = (img: HTMLImageElement, focus: Focus = FOCUS) => {
    const p = texture(img), ia = img.naturalWidth / img.naturalHeight, oa = OPEN.w / OPEN.h;
    if (ia > oa) { p.repeat.set(oa / ia, 1); p.offset.set((1 - oa / ia) * focus.x, 0); } else { p.repeat.set(1, ia / oa); p.offset.set(0, (1 - ia / oa) * (1 - focus.y)); }
    photoMat.map = p; photoMat.emissiveMap = p; photoMat.needsUpdate = true;
    photoTex?.dispose();
    photoTex = p;
    render();
  };

  // ---------- motion: shutters on springs, a little tilt after the pointer ----------
  let target = opts.open ? 1 : 0, peek = 0, raf = 0, last = 0;
  const OPEN_ANGLE = (166 * Math.PI) / 180, PEEK_ANGLE = (12 * Math.PI) / 180;
  if (opts.open) leaves.forEach((l) => { l.angle = OPEN_ANGLE; });
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const render = () => {
    leaves.forEach((l) => { l.hinge.rotation.y = (l.side === 'l' ? -1 : 1) * l.angle; });
    win.rotation.set(tilt.x, tilt.y, 0);
    renderer.render(scene, camera);
  };
  const frame = (now: number) => {
    const dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;
    let moving = false;
    leaves.forEach((l, i) => {
      const goal = target * OPEN_ANGLE + (target ? 0 : peek * PEEK_ANGLE);
      // a lightly damped spring: it swings past, then settles (the right leaf a beat behind)
      const k = 70 - i * 6, c = 9.5;
      l.vel += (k * (goal - l.angle) - c * l.vel) * dt;
      l.angle += l.vel * dt;
      if (Math.abs(goal - l.angle) > 0.001 || Math.abs(l.vel) > 0.001) moving = true;
    });
    tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 6);
    tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 6);
    if (Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) > 0.0005) moving = true;
    render();
    if (moving) raf = requestAnimationFrame(frame); else { raf = 0; last = 0; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const setOpen = (open: boolean) => {
    target = open ? 1 : 0;
    if (opts.reduce) { leaves.forEach((l) => { l.angle = target * OPEN_ANGLE; l.vel = 0; }); render(); return; }
    kick();
  };

  const onMove = (e: PointerEvent) => {
    if (opts.reduce || e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.22;
    tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.14;
    peek = 1;
    kick();
  };
  const onLeave = () => { tilt.tx = tilt.ty = 0; peek = 0; kick(); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  const ro = new ResizeObserver(() => { fit(); render(); });
  ro.observe(canvas);

  return {
    setOpen,
    setPhoto,
    ready,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      win.traverse((x) => { const m = x as THREE.Mesh; if (m.isMesh) m.geometry.dispose(); });
      own.forEach((x) => x.dispose());
      photoTex?.dispose();
    },
  };
}
