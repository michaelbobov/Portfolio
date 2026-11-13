import type { Outfit } from '@/app/data/outfit';

// The doll that is Michael: the homepage set's littlest (DOLLS / DOLL_ART[ME]). It wears his outfit of
// the day as 3D clothes over its painting (Outfit3D), the latest one he published from /dress. Only
// this doll is ever dressed; the others are never touched.

/** Which doll in DOLLS / DOLL_ART is him */
export const ME = 2;

/** His hair (3D, Outfit3D): light brown, curtain bangs parted in the middle */
export const HAIR = '#8f6440';

/** A published outfit, as visitors see it */
export type PublicOutfit = {
  id: string;
  /** When he took the photo (ISO) */
  date: string;
  outfit: Outfit;
  /** Whether he chose to show the photo with it */
  photo: boolean;
};
