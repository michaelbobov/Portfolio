// The side-projects village: a porcelain Gzhel village in 3D (VillageScene), painted on the Side projects
// doll's belly (where her village always was) and flown into when that doll is clicked (VillageZoom drives
// it, DollScene draws it). Each place in it is a side project, one leading to the next.

/** Which doll wears the village: the Side projects doll, the middle of the set */
export const VILLAGE_DOLL = 1;
/** The winter sky over the lake: the soft white of the taiga panorama's own sky, so the painting's top
 *  edge melts into it */
export const SKY = '#f4f7fc';

/** The islands, by side project (ids as in data/projects SIDE), left to right across the lake in the
 *  guided tour's order: EZ Recipe's cabin and steaming pot, SkillTree's fir in the middle and further out,
 *  the about-site's hut on chicken legs. Where each stands (world units, the near shore toward +z); on a
 *  tall screen (px, pz) they zigzag back across the lake instead, so all three fit; and its landmark's size. */
export const HOUSES = [
  { id: 'ez-recipe', kind: 'house', x: -4.3, z: -1.2, px: -1.7, pz: 3.2, scale: 1 },
  { id: 'skilltree', kind: 'tree', x: 0, z: -5.6, px: 1.9, pz: -2.4, scale: 1 },
  { id: 'about-site', kind: 'hut', x: 4.3, z: -1.2, px: -1.4, pz: -8.2, scale: 1 },
] as const;

/** Where the world shows on the doll's belly, in the doll's 200 × 260 box: the simple arched window on her
 *  belly (traced off her painting, doll-2-front, into public/village/window-mask.png), all of it under her
 *  waist (150) */
export const PLAQUE = { x: 65.26, y: 152.11, w: 68.16, h: 70.79 };
/** The window's shape, so the world's painting is made in the same proportions */
export const PAINTING_ASPECT = PLAQUE.w / PLAQUE.h;
/** The share of the window (each way) the screen shows when the world takes over: well inside its frame */
export const CROP = 0.85;

/** Where the whole painting sits on a W × H screen at the handoff (px): big enough that its middle
 *  CROP-share fills the screen both ways, centred. The 3D camera ends exactly here. */
export function artRect(W: number, H: number) {
  const ratio = PLAQUE.w / PLAQUE.h;
  const w = Math.max(W / CROP, (H * ratio) / CROP), h = w / ratio;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

// ---------- the zoom, as shares of its run (0 the dolls, 1 the village) ----------
export const ZOOM = {
  /** the name, the bar and the other dolls blur and fade */
  away: [0, 0.18],
  /** the camera flies to the painting */
  fly: [0.03, 0.6],
  /** the painting's curve flattens (and its glaze gives way to the plain picture) */
  flatten: [0.36, 0.6],
  /** the village itself takes over, from the same view */
  hand: [0.6, 0.6],
  /** the camera moves on into the village, to where you can see every house */
  enter: [0.6, 1],
  /** the houses pop, one after another */
  pop: [0.68, 0.92],
  /** the labels arrive */
  labels: [0.86, 1],
} as const satisfies Record<string, readonly [number, number]>;
export const seg = (p: number, [a, b]: readonly [number, number]) => (b <= a ? (p >= b ? 1 : 0) : Math.min(1, Math.max(0, (p - a) / (b - a))));
/** How long the dive takes in, and back out (ms) */
export const DIVE_MS = 3400, RISE_MS = 2400;
