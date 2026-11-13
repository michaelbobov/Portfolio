"""Paints his doll's face: the front and back pictures the 3D doll wraps round itself (DollScene's
paint), in the designer-toy style (concept B): flat skin, a calm half smile, light stubble, small dark
eyes (sunglasses cover them on days he wears them). His hair is 3D (Outfit3D), and so are his clothes.

  python3 scripts/me-doll.py public/dolls      (needs Pillow)

Drawn in the dolls' 200 × 260 box at 5 px a unit, like the other dolls' paintings.
"""
import sys
from PIL import Image, ImageDraw

OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/dolls'
K = 5  # px per unit
W, H = 200 * K, 260 * K
SKIN = (240, 200, 166)
SKIN_SHADE = (222, 176, 142)
BODY = (244, 242, 236)
NECK = 118  # where the head meets the body, in the box


def base():
    im = Image.new('RGB', (W, H), BODY)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, NECK * K], fill=SKIN)
    return im, d


def ell(d, cx, cy, rx, ry, **kw):
    d.ellipse([(cx - rx) * K, (cy - ry) * K, (cx + rx) * K, (cy + ry) * K], **kw)


front, d = base()
# Stubble: a soft band of flecks round the mouth and along the jaw
import random
random.seed(7)
stub = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(stub)
for _ in range(1400):
    x = random.gauss(100, 15); y = random.uniform(98, 117)
    if abs(x - 100) > 24 or (abs(x - 100) < 5 and y < 101):
        continue
    r = random.uniform(0.25, 0.45)
    sd.ellipse([(x - r) * K, (y - r) * K, (x + r) * K, (y + r) * K], fill=(120, 82, 56, 70))
front.paste(stub, (0, 0), stub)
d = ImageDraw.Draw(front)
# Eyes: small, dark, a little glossy
for sx in (-1, 1):
    ell(d, 100 + sx * 13.5, 89.5, 2.5, 3.1, fill=(38, 30, 28))
    ell(d, 100 + sx * 13.5 + 0.8, 88.4, 0.8, 0.9, fill=(255, 255, 255))
# Brows (mostly under his fringe)
for sx in (-1, 1):
    d.arc([(100 + sx * 13.5 - 6) * K, 79 * K, (100 + sx * 13.5 + 6) * K, 85 * K], 200, 340, fill=(120, 84, 56), width=int(1.4 * K))
# Nose: a soft shadow under it
d.arc([95 * K, 94 * K, 105 * K, 101 * K], 30, 150, fill=SKIN_SHADE, width=int(1.2 * K))
# A calm half smile
d.arc([93 * K, 101 * K, 107 * K, 109 * K], 20, 160, fill=(176, 104, 92), width=int(1.3 * K))
front.save(f'{OUT}/me-front.webp', quality=92)

back, _ = base()
back.save(f'{OUT}/me-back.webp', quality=92)
print('painted', f'{OUT}/me-front.webp', f'{OUT}/me-back.webp')
