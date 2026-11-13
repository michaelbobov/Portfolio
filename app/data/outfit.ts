// His doll's clothes, as data: each garment is a kind from a small catalogue, made in 3D as a smooth
// designer-toy piece fitted to the doll's own outline (Outfit3D), in the real colours, pattern and
// material from his photo. The same records
// make the wardrobe: an outfit is a list of garments, and any garment can be worn again or mixed.

export const KINDS = {
  head: ['beanie', 'cap'],
  top: ['tee', 'shirt', 'sweater', 'hoodie'],
  outer: ['jacket', 'puffer', 'coat', 'vest'],
  bottom: ['trousers', 'jeans'],
  shoes: ['sneakers', 'boots'],
  accessory: ['glasses', 'sunglasses', 'scarf'],
} as const;
export type Slot = keyof typeof KINDS;
export type Kind = (typeof KINDS)[Slot][number];
export const SLOTS = Object.keys(KINDS) as Slot[];
/** stripes: across (a Breton tee); vstripes: up and down (a striped shirt) */
export const PATTERNS = ['solid', 'stripes', 'vstripes', 'check', 'knit', 'denim'] as const;
export type Pattern = (typeof PATTERNS)[number];
/** What it's made of: decides how it takes the light (Outfit3D) */
export const FABRICS = ['cotton', 'knit', 'fleece', 'denim', 'canvas', 'wool', 'nylon', 'leather', 'suede', 'acetate', 'metal'] as const;
export type Fabric = (typeof FABRICS)[number];

export type Garment = {
  slot: Slot;
  kind: Kind;
  /** Main colour, #rrggbb */
  color: string;
  /** Second colour, for stripes, checks, a cap's brim, a shoe's sole; null if none */
  color2: string | null;
  pattern: Pattern;
  fabric: Fabric;
  /** An outer layer or shirt worn open (what's under it shows down the middle) */
  open: boolean;
  /** A pompom on a beanie, a hood on a hoodie or jacket */
  extra: boolean;
  /** In plain words, for the "Today's fit" card ("navy puffer jacket, worn open") */
  label: string;
};
export type Outfit = Garment[];

export const SLOT_LABEL: Record<Slot, string> = { head: 'Head', top: 'Top', outer: 'Outerwear', bottom: 'Bottom', shoes: 'Shoes', accessory: 'Accessory' };

/** What a kind is usually made of, when nothing says otherwise */
export const DEFAULT_FABRIC: Record<Kind, Fabric> = {
  beanie: 'knit', cap: 'cotton', tee: 'cotton', shirt: 'cotton', sweater: 'knit', hoodie: 'fleece',
  jacket: 'canvas', puffer: 'nylon', coat: 'wool', vest: 'nylon', trousers: 'canvas', jeans: 'denim',
  sneakers: 'canvas', boots: 'leather', glasses: 'acetate', sunglasses: 'acetate', scarf: 'wool',
};

const HEX = /^#[0-9a-f]{6}$/i;
const slotOf = (kind: unknown) => SLOTS.find((s) => (KINDS[s] as readonly string[]).includes(kind as string));

/** Accepts only well-formed garments (from a request or the model): known kinds, real colours, at most
 *  one per slot except accessories (up to three), worn in slot order */
export function cleanOutfit(input: unknown): Outfit {
  const out: Outfit = [];
  for (const raw of Array.isArray(input) ? input : []) {
    if (!raw || typeof raw !== 'object') continue;
    const g = raw as Record<string, unknown>;
    const slot = slotOf(g.kind);
    if (!slot || typeof g.color !== 'string' || !HEX.test(g.color)) continue;
    const taken = out.filter((o) => o.slot === slot).length;
    if (taken >= (slot === 'accessory' ? 3 : 1)) continue;
    const kind = g.kind as Kind;
    out.push({
      slot,
      kind,
      color: g.color.toLowerCase(),
      color2: typeof g.color2 === 'string' && HEX.test(g.color2) ? g.color2.toLowerCase() : null,
      pattern: (PATTERNS as readonly string[]).includes(g.pattern as string) ? (g.pattern as Pattern) : 'solid',
      fabric: (FABRICS as readonly string[]).includes(g.fabric as string) ? (g.fabric as Fabric) : DEFAULT_FABRIC[kind],
      open: g.open === true,
      extra: g.extra === true,
      label: (typeof g.label === 'string' && g.label.trim() ? g.label.trim() : kind).slice(0, 80),
    });
  }
  return out.sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
}

/** Outfits for the preview page: the one in his photo (public/michael.jpeg), and two more */
export const SAMPLES: { name: string; outfit: Outfit }[] = [
  {
    name: 'His photo',
    outfit: cleanOutfit([
      { kind: 'shirt', color: '#f4f2ec', color2: '#c9c8c4', pattern: 'vstripes', fabric: 'cotton', label: 'white and grey striped button-up' },
      { kind: 'sunglasses', color: '#f4c400', color2: '#1d1f22', pattern: 'solid', fabric: 'acetate', label: 'yellow oval sunglasses' },
    ]),
  },
  {
    name: 'Rainy Seattle',
    outfit: cleanOutfit([
      { kind: 'beanie', color: '#7d8590', pattern: 'knit', fabric: 'knit', label: 'grey ribbed beanie' },
      { kind: 'sweater', color: '#e9e4d8', pattern: 'solid', fabric: 'fleece', label: 'oatmeal sweatshirt' },
      { kind: 'puffer', color: '#22325a', pattern: 'solid', fabric: 'nylon', label: 'navy puffer jacket, zipped up' },
      { kind: 'jeans', color: '#4a6a9a', pattern: 'denim', label: 'mid-blue jeans' },
      { kind: 'sneakers', color: '#f2f2ee', color2: '#d9d6cc', pattern: 'solid', label: 'white sneakers' },
    ]),
  },
  {
    name: 'Studio day',
    outfit: cleanOutfit([
      { kind: 'cap', color: '#1d1f24', color2: '#1d1f24', pattern: 'solid', label: 'black cap' },
      { kind: 'tee', color: '#f1ead8', color2: '#26365e', pattern: 'stripes', label: 'navy and cream striped T-shirt' },
      { kind: 'jacket', color: '#4a6890', pattern: 'solid', fabric: 'denim', open: true, label: 'denim jacket, worn open' },
      { kind: 'trousers', color: '#c9b48f', pattern: 'solid', label: 'khaki trousers' },
      { kind: 'boots', color: '#5a3b26', color2: '#2a1d14', pattern: 'solid', fabric: 'leather', label: 'brown leather boots' },
      { kind: 'glasses', color: '#202020', pattern: 'solid', label: 'black glasses' },
      { kind: 'scarf', color: '#b4532f', color2: '#e9d9c3', pattern: 'check', label: 'rust check scarf' },
    ]),
  },
];

