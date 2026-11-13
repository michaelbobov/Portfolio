"""Prepares downloaded clothing models for his doll's 3D outfit (app/components/Outfit3D.ts).

Run with Blender:
  Blender -b --factory-startup -P scripts/outfit-models.py -- <folder of downloaded .glb> public/outfit

Each model in MODELS is imported, joined into one object, turned to face the front (+Z in glTF),
scaled to 1 unit wide, set on the point it's worn by (a hat's rim, glasses' front, shoes' toes), cut
to at most MAX_FACES, its textures shrunk to 1024 px and its colour texture made grey, so the site can
recolour it to the colour in his photo while keeping the knit, the stitching and the creases.
Sources and credits are in app/data/outfit.ts (MODEL_CREDITS); all are CC BY on Sketchfab.
"""
import bpy, bmesh, math, os, sys
import numpy as np
from mathutils import Vector

MAX_FACES = 20000
TEX = 1024

# file prefix in the download folder → (output name, how it's worn, turn about the vertical in degrees)
#   rim: a hat; its bottom rim at y = 0, centred
#   front: glasses; centred, their front at z = 0
#   toes: a pair of shoes; standing at y = 0, centred, the toes at z = 0
MODELS = {
    '01': ('cap', 'rim', 180),  # it came facing backwards
    '06': ('beanie', 'rim', 0),
    '10': ('sneakers', 'toes', 0),
    '12': ('boots', 'toes', 0),
    # (glasses: the drawn ones in Outfit3D read better; the downloaded pair has an arm flung out sideways)
}

src, out = sys.argv[sys.argv.index('--') + 1:][:2]
os.makedirs(out, exist_ok=True)


def grey(img):
    """The image as luminance, brightened so its light parts are near white (it's multiplied by a colour)"""
    if img.size[0] > TEX or img.size[1] > TEX:
        k = TEX / max(img.size)
        img.scale(max(1, int(img.size[0] * k)), max(1, int(img.size[1] * k)))
    px = np.array(img.pixels[:], dtype=np.float32).reshape(-1, 4)
    lum = px[:, 0] * 0.2126 + px[:, 1] * 0.7152 + px[:, 2] * 0.0722
    top = np.percentile(lum, 97) or 1.0
    lum = np.clip(lum / top, 0, 1) ** 0.85
    px[:, 0] = px[:, 1] = px[:, 2] = lum
    img.pixels = px.ravel().tolist()
    img.pack()


for prefix, (name, wear, turn) in MODELS.items():
    files = [f for f in os.listdir(src) if f.startswith(prefix) and f.endswith('.glb')]
    if not files:
        print(f'SKIP {name}: no {prefix}*.glb'); continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(src, files[0]))
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    # Apply every parent and transform, then one object
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if len(meshes) > 1:
        bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    for o in list(bpy.context.scene.objects):
        if o != ob:
            bpy.data.objects.remove(o, do_unlink=True)
    ob.rotation_euler = (0, 0, math.radians(turn))
    bpy.ops.object.transform_apply(rotation=True)

    # Blender is z up and its front is -y; glTF (and the doll) is y up with the front at +z
    vs = [ob.matrix_world @ v.co for v in ob.data.vertices]
    lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
    hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
    width = hi.x - lo.x
    cx, cy, cz = (lo.x + hi.x) / 2, (lo.y + hi.y) / 2, (lo.z + hi.z) / 2
    if wear == 'rim':
        anchor = Vector((cx, cy, lo.z))
    elif wear == 'front':
        anchor = Vector((cx, lo.y, cz))
    else:  # toes
        anchor = Vector((cx, lo.y, lo.z))
    for v in ob.data.vertices:
        v.co = (v.co - anchor) / width

    faces = len(ob.data.polygons)
    if faces > MAX_FACES:
        mod = ob.modifiers.new('cut', 'DECIMATE')
        mod.ratio = MAX_FACES / faces
        bpy.ops.object.modifier_apply(modifier=mod.name)

    # Colour textures to grey (normal, roughness and other maps are kept as they are)
    for slot in ob.material_slots:
        m = slot.material
        if not m or not m.use_nodes:
            continue
        bsdf = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if not bsdf:
            continue
        base = bsdf.inputs['Base Color']
        if base.is_linked:
            node = base.links[0].from_node
            if node.type == 'TEX_IMAGE' and node.image:
                grey(node.image)
        else:
            c = base.default_value
            l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            base.default_value = (l, l, l, c[3])
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and max(n.image.size) > TEX:
                k = TEX / max(n.image.size)
                n.image.scale(int(n.image.size[0] * k), int(n.image.size[1] * k)); n.image.pack()

    path = os.path.join(out, f'{name}.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=False, export_image_format='JPEG',
                              export_apply=True, export_yup=True)
    print(f'MODEL {name}: {faces} -> {len(ob.data.polygons)} faces, {os.path.getsize(path) // 1024} KB, '
          f'{len(ob.material_slots)} materials')
