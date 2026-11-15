"""Paints his face into the About doll's round window (public/dolls/me-front.webp).

The face is a traced crop of his photo (public/me.webp): the circle at (610, 560), radius 315, of the
1254 px photo, redrawn in the sister dolls' style with every feature in place (Codex's image tool). It is
laid into the window of the blueberry doll's painting (a circle of 92 px at (299.5, 260) on the 600 × 780
painting; written at twice that, 1200 × 1560, because the homepage zoom flies right up to it), so when the homepage zoom (DollScene.zoomTo, DollSet's becomeMe) fades the photo in over the
painting, the two match feature for feature. Keep these numbers in step with ME_PHOTO and FACE_Y/FACE_R.

  python3 scripts/me-face.py scripts/assets/me-face-trace.png      (needs Pillow)
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

BASE = 'public/dolls/doll-4-front.webp'
OUT = 'public/dolls/me-front.webp'
K = 2  # written at twice the base painting's size
CX, CY, R = 299.5 * K, 260 * K, 92 * K

face = Image.open(sys.argv[1]).convert('RGB').resize((2 * R, 2 * R), Image.LANCZOS)
doll = Image.open(BASE).convert('RGB')
doll = doll.resize((doll.width * K, doll.height * K), Image.LANCZOS)
mask = Image.new('L', doll.size, 0)
ImageDraw.Draw(mask).ellipse((CX - R, CY - R, CX + R, CY + R), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.8 * K))
layer = Image.new('RGB', doll.size)
layer.paste(face, (round(CX - R), round(CY - R)))
Image.composite(layer, doll, mask).save(OUT, quality=92)
print('painted', OUT)
