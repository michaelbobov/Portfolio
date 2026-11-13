"""Fits a downloaded jacket (made for a person) onto his matryoshka doll (app/components/Outfit3D.ts).

Run with Blender:
  Blender -b --factory-startup -P scripts/outfit-fit.py -- <folder of downloaded .glb> public/outfit

The doll has no arms, so the sleeves go. Every horizontal slice of the jacket's torso is then mapped
onto the matching slice of the doll's body (its lathe outline, the same numbers as DollScene): the
slice's own width and depth become the doll's radius there, plus a few units, so the quilting, seams,
zip and collar keep their shape while the jacket hugs the doll. It comes out in the doll's own units
(no scaling at runtime), cut at the waist into 'upper' (rides on the lid) and 'lower', with its colour
textures made grey for tinting. Sources and credits: app/data/outfit.ts (MODEL_CREDITS).
"""
import bpy, bmesh, math, os, sys
import numpy as np
from mathutils import Vector

FLOOR, WAIST = 252.0, 150.0
TEX = 1024
MAX_FACES = 40000

# The doll's outline (DollScene's SEGS): the right half, as cubic segments in the 200 × 260 box
SEGS = [
    [(100, 8), (140, 8), (160, 38), (160, 76)],
    [(160, 76), (160, 96), (152, 104), (154, 116)],
    [(154, 116), (158, 136), (184, 160), (184, 200)],
    [(184, 200), (184, 236), (166, 252), (150, 252)],
]
OUT = []
for p0, p1, p2, p3 in SEGS:
    for i in range(1 if OUT else 0, 41):
        t = i / 40; u = 1 - t
        x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
        OUT.append((x - 100, y))
OY = np.array([p[1] for p in OUT]); OR = np.array([p[0] for p in OUT])
radius_at = lambda y: np.interp(y, OY, OR)

# prefix → name: the doll garment it becomes; top, hem: its heights on the doll's drawing (y down);
#   off: how far out its outer surface sits (layers: a shirt under a sweater under a jacket); dip: how far
#   in a quilt valley or seam may go; sleeves: 'parts' (separate sleeve pieces, dropped) or 'cut' (cut
#   off where the arms branch away from the torso); plain: drop its own print, keep its shape and folds;
#   hang: keep separate sleeves, empty, lying down the doll's sides and forward over its belly
JACKETS = {
    '30': dict(name='puffer', top=112.0, hem=210.0, off=6.0, dip=2.2, sleeves='parts', hang=True),
    # (tried and dropped: a denim jacket and a button-up shirt; their shape comes from shoulders, arms
    #  and collars, which a matryoshka hasn't got, so moulded onto it they read as lumpy wraps)
    't13': dict(name='sweater', top=114.0, hem=214.0, off=3.6, dip=1.4, sleeves='cut', plain=True),
}

src, out = sys.argv[sys.argv.index('--') + 1:][:2]


def grey(img):
    if max(img.size) > TEX:
        k = TEX / max(img.size); img.scale(int(img.size[0] * k), int(img.size[1] * k))
    px = np.array(img.pixels[:], dtype=np.float32).reshape(-1, 4)
    lum = px[:, 0] * 0.2126 + px[:, 1] * 0.7152 + px[:, 2] * 0.0722
    top = np.percentile(lum, 97) or 1.0
    lum = np.clip(lum / top, 0, 1) ** 0.85
    px[:, 0] = px[:, 1] = px[:, 2] = lum
    img.pixels = px.ravel().tolist(); img.pack()


for prefix, J in JACKETS.items():
    name, top, hem, off, dip = J['name'], J['top'], J['hem'], J['off'], J['dip']
    files = [f for f in os.listdir(src) if f.startswith(prefix + '-') and f.endswith('.glb')]
    if not files:
        print(f'SKIP {name}'); continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(src, files[0]))
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    allpts = np.array([v.co[:] for o in meshes for v in o.data.vertices])
    cx = (allpts[:, 0].min() + allpts[:, 0].max()) / 2
    width = allpts[:, 0].max() - allpts[:, 0].min()
    kept = []
    arms = {}  # side (+1 right, -1 left) → the sleeve's points and its parts, kept to hang (hang)
    if J['sleeves'] == 'parts':
        # The sleeves (and their cuffs) are separate parts lying out to the sides
        for o in meshes:
            xs = np.array([v.co.x for v in o.data.vertices])
            mid = (xs.min() + xs.max()) / 2 - cx
            if abs(mid) > 0.26 * width:
                if J.get('hang'):
                    arms.setdefault(1 if mid > 0 else -1, []).append(o)
                else:
                    bpy.data.objects.remove(o, do_unlink=True)
            else:
                kept.append(o)
    else:
        kept = meshes
    # Each kept sleeve as one object (its pieces and cuff joined), set aside until the body is fitted
    arm_obs = {}
    for side, parts in arms.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts: o.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]
        if len(parts) > 1: bpy.ops.object.join()
        arm_obs[side] = bpy.context.view_layer.objects.active
    bpy.ops.object.select_all(action='DESELECT')
    for o in kept: o.select_set(True)
    bpy.context.view_layer.objects.active = kept[0]
    if len(kept) > 1: bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    for o in list(bpy.context.scene.objects):
        if o != ob and o not in arm_obs.values(): bpy.data.objects.remove(o, do_unlink=True)

    if arm_obs:
        # The armholes the sleeves came out of, closed (their sleeves now lie elsewhere): the open loops
        # out at the sides, not the neck or the hem
        bm = bmesh.new(); bm.from_mesh(ob.data)
        edges = [e for e in bm.edges if e.is_boundary]
        seen, closed = set(), 0
        for e in edges:
            if e in seen: continue
            loop, todo = [], [e]
            while todo:
                f = todo.pop()
                if f in seen: continue
                seen.add(f); loop.append(f)
                for v in f.verts:
                    todo += [g for g in v.link_edges if g.is_boundary and g not in seen]
            c = sum((v.co for f in loop for v in f.verts), Vector()) / (2 * len(loop))
            if abs(c.x - cx) > 0.12 * width and len(loop) > 12:
                # filled with a fan of small faces (not one flat one), so the patch follows the body's
                # curve once fitted instead of cutting straight across beneath it
                fs = bmesh.ops.holes_fill(bm, edges=loop, sides=0)['faces']
                fs = bmesh.ops.poke(bm, faces=fs)['faces']
                bmesh.ops.subdivide_edges(bm, edges=list({e for f in fs for e in f.edges}), cuts=4, use_grid_fill=True)
                closed += 1
        bm.to_mesh(ob.data); bm.free()
        print(f'  {name}: closed {closed} armholes')

    if J['sleeves'] == 'cut':
        # Sleeves attached: at each height, the torso is the cloth reached from the middle without a gap;
        # arms held out from the body leave one. Above the armpits the arm joins on, so the shoulders are
        # held to a little wider than the body below. Everything further out goes.
        P0 = np.array([v.co[:] for v in ob.data.vertices])
        z0_, z1_ = P0[:, 2].min(), P0[:, 2].max()
        HB, XB = 40, 96
        hb_ = np.minimum(((P0[:, 2] - z0_) / (z1_ - z0_) * HB).astype(int), HB - 1)
        xb_ = np.clip(((P0[:, 0] - cx) / width * XB + XB / 2).astype(int), 0, XB - 1)
        reach = np.zeros(HB)
        for b in range(HB):
            occ = np.zeros(XB, bool); occ[xb_[hb_ == b]] = True
            if not occ.any(): continue
            mid = XB // 2; l = r = mid
            while l > 0 and (occ[l - 1] or occ[max(l - 2, 0)]): l -= 1
            while r < XB - 1 and (occ[r + 1] or occ[min(r + 2, XB - 1)]): r += 1
            reach[b] = max(mid - l, r - mid) / XB * width
        body = np.median(reach[: HB // 2][reach[: HB // 2] > 0])
        cap = np.where(np.arange(HB) < HB // 2, np.minimum(reach, body * 1.1), np.minimum(reach, body * 1.22))
        bm = bmesh.new(); bm.from_mesh(ob.data)
        far = [v for v in bm.verts if abs(v.co.x - cx) > cap[min(int((v.co.z - z0_) / (z1_ - z0_) * HB), HB - 1)] * 1.02]
        bmesh.ops.delete(bm, geom=far, context='VERTS')
        bm.to_mesh(ob.data); bm.free()
        print(f'  {name}: body half-width {body:.3f}, removed {len(far)} sleeve vertices')

    if J.get('plain'):
        # Its own print goes (the site paints colour and pattern); shape, folds and normal maps stay
        for slot in ob.material_slots:
            m = slot.material
            bsdf = m and m.use_nodes and next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if bsdf and bsdf.inputs['Base Color'].is_linked:
                m.node_tree.links.remove(bsdf.inputs['Base Color'].links[0])
            if bsdf: bsdf.inputs['Base Color'].default_value = (0.92, 0.92, 0.92, 1)

    me = ob.data
    P = np.array([v.co[:] for v in me.vertices])
    cx, cy = np.median(P[:, 0]), np.median(P[:, 1])
    z0, z1 = np.percentile(P[:, 2], 1), np.percentile(P[:, 2], 99)
    # The jacket's outer surface, measured all the way round each slice: its distance from the middle at
    # every height and angle (the furthest point there), smoothed over a few quilt bands so the bumps
    # stay bumps. Each point is then moved along its own direction so that surface lands on the doll.
    HB, AB = 48, 72
    hraw = (P[:, 2] - z0) / (z1 - z0)  # not clipped: a collar above the top keeps going up the neck
    hb = np.clip((np.clip(hraw, 0, 1) * HB).astype(int), 0, HB - 1)
    dx, dy = P[:, 0] - cx, P[:, 1] - cy
    ang = np.arctan2(dx, -dy)  # 0 at the front
    ab = ((ang + np.pi) / (2 * np.pi) * AB).astype(int) % AB
    rho = np.hypot(dx, dy)
    env = np.zeros((HB, AB))
    np.maximum.at(env, (hb, ab), rho)
    # fill holes from neighbours round the slice, then from the slices above and below
    for b in range(HB):
        row = env[b]; ok = row > 0
        if ok.sum() >= 2:
            xs = np.flatnonzero(ok)
            env[b] = np.interp(np.arange(AB), np.concatenate([xs - AB, xs, xs + AB]), np.tile(row[ok], 3))
    for a in range(AB):
        col = env[:, a]; ok = col > 0
        if ok.any():
            env[:, a] = np.interp(np.arange(HB), np.flatnonzero(ok), col[ok])
    def smooth(m, n, axis, wrap):
        k = np.exp(-0.5 * (np.arange(-2 * n, 2 * n + 1) / n) ** 2); k /= k.sum()
        pad = np.concatenate([m.take(range(-2 * n, 0), axis), m, m.take(range(0, 2 * n), axis)], axis) if wrap else \
            np.concatenate([np.repeat(m.take([0], axis), 2 * n, axis), m, np.repeat(m.take([-1], axis), 2 * n, axis)], axis)
        return np.apply_along_axis(lambda r: np.convolve(r, k, 'valid'), axis, pad)
    env = smooth(smooth(env, 4, 0, False), 3, 1, True)
    ydoll = hem - hraw * (hem - top)
    R = radius_at(ydoll) + off
    # The outer surface lands on R; anything further in (a quilt valley, a seam, the lining) keeps its
    # depth only up to `dip` units, eased, so a valley never sinks into the shirt or the doll beneath
    d = np.clip(1 - rho / np.maximum(env[hb, ab], 1e-6), 0, 1) * R
    scale = (R - dip * np.tanh(d / dip)) / np.maximum(rho, 1e-6)
    NEW = np.stack([dx * scale, dy * scale, FLOOR - ydoll], axis=1)
    for v, c in zip(me.vertices, NEW):
        v.co = Vector(c)
    me.update()

    if arm_obs:
        # How much the body grew, at the chest, so the sleeves keep in proportion with it
        chest = (hb >= HB * 0.55) & (hb <= HB * 0.75)
        grow = float(np.median(scale[chest])) * 0.56
        y0, y1 = top + 1, hem - 12
        for side, arm in arm_obs.items():
            A = np.array([v.co[:] for v in arm.data.vertices])
            m = A.mean(axis=0)
            _, _, vt = np.linalg.svd(A - m, full_matrices=False)
            ax = vt[0] if vt[0][2] < 0 else -vt[0]  # along the sleeve, shoulder to cuff (downwards)
            outward = np.array([side, 0.0, 0.0]); e1 = outward - ax * (outward @ ax); e1 /= np.linalg.norm(e1)
            e2 = np.cross(ax, e1)
            t = (A - m) @ ax; q1 = (A - m) @ e1; q2 = (A - m) @ e2
            tau = (t - t.min()) / (t.max() - t.min())
            r_arm = np.percentile(np.hypot(q1, q2), 95) * grow
            def path(tt):
                y = y0 + tt * (y1 - y0)
                phi = side * np.radians(108 - 52 * tt)  # from just behind the side (over the armhole), round towards the front
                rc = radius_at(y) + off + r_arm * 0.45  # pressed into the jacket a little, so it lies against it
                return np.stack([rc * np.sin(phi), FLOOR - y, rc * np.cos(phi)], -1), phi
            C, phi = path(tau)
            Cn, _ = path(np.minimum(tau + 0.01, 1.0)); Cp, _ = path(np.maximum(tau - 0.01, 0.0))
            T = Cn - Cp; T /= np.linalg.norm(T, axis=1, keepdims=True)
            N = np.stack([np.sin(phi), np.zeros_like(phi), np.cos(phi)], -1)
            N -= T * np.sum(N * T, axis=1, keepdims=True); N /= np.linalg.norm(N, axis=1, keepdims=True)
            B = np.cross(T, N)
            D = C + grow * (q1[:, None] * N + q2[:, None] * B)  # in the doll's frame: x, y up, z front
            for v, c in zip(arm.data.vertices, D):
                v.co = Vector((c[0], -c[2], c[1]))  # back to Blender's: z up, front −y
            arm.data.update()
        bpy.ops.object.select_all(action='DESELECT')
        ob.select_set(True)
        for a in arm_obs.values(): a.select_set(True)
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.join()
        me = ob.data

    faces = len(me.polygons)
    if faces > MAX_FACES:
        mod = ob.modifiers.new('cut', 'DECIMATE'); mod.ratio = MAX_FACES / faces
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.shade_smooth()

    # Colour textures to grey for tinting
    for slot in ob.material_slots:
        m = slot.material
        if not m or not m.use_nodes: continue
        bsdf = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if bsdf and bsdf.inputs['Base Color'].is_linked:
            n = bsdf.inputs['Base Color'].links[0].from_node
            if n.type == 'TEX_IMAGE' and n.image: grey(n.image)
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and max(n.image.size) > TEX:
                k = TEX / max(n.image.size); n.image.scale(int(n.image.size[0] * k), int(n.image.size[1] * k)); n.image.pack()

    # Cut at the waist: 'upper' above it (rides on the lid), 'lower' below
    lower = ob.copy(); lower.data = ob.data.copy(); bpy.context.scene.collection.objects.link(lower)
    ob.name, lower.name = 'upper', 'lower'
    for o, keep_above in ((ob, True), (lower, False)):
        bm = bmesh.new(); bm.from_mesh(o.data)
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, FLOOR - WAIST), plane_no=(0, 0, 1),
                               clear_inner=keep_above, clear_outer=not keep_above)
        bm.to_mesh(o.data); bm.free()

    path = os.path.join(out, f'{name}.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_image_format='JPEG', export_apply=True, export_yup=True)
    print(f'JACKET {name}: {faces} faces, {os.path.getsize(path) // 1024} KB, parts kept {len(kept)}')
