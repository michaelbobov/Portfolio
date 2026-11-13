// The side-projects village: a porcelain Gzhel village in 3D (VillageScene), painted on the Side projects
// doll's belly (where her village always was) and flown into when that doll is clicked (VillageZoom drives
// it, DollScene draws it). Each place in it is a side project, one leading to the next.

/** Which doll wears the village: the Side projects doll, the middle of the set */
export const VILLAGE_DOLL = 1;
/** The winter sky over the village: the pale blue her window is painted with, so on the doll the world's
 *  sky runs on into the window's */
export const SKY = '#b4d2fd';

/** The places, by side project (ids as in data/projects SIDE), in the order the painted path passes them,
 *  front to back, which is the guided tour's order: EZ Recipe's cabin and steaming pot on the left,
 *  SkillTree's tree on the right, and at the end of the path the about-site's hut on chicken legs. Where
 *  each stands (world units, the front of the village toward +z), and its size. */
export const HOUSES = [
  { id: 'ez-recipe', kind: 'house', x: -3.6, z: 1.8, scale: 1 },
  { id: 'skilltree', kind: 'tree', x: 3.5, z: -4.4, scale: 1 },
  { id: 'about-site', kind: 'hut', x: 0.4, z: -10.4, scale: 1 },
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
