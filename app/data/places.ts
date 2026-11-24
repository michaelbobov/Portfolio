// The homepage's landscape follows where Michael is (NOW.place in data/now.ts). Each place is a pair of
// one-ink cobalt screen prints on white (public/postcard), cropped to 1536 × 768: the far layer (mountain,
// water) and the near one (the landmark and trees), laid on the paper with a multiply blend, so white
// becomes the paper and the ink overprints, as in a real print; and its sky, a mask of the open sky above the
// far print's ridge (white = sky, scripts made it from the print), so the sun sets behind the mountains. Only the landscape and the caption change from place to place;
// the name, the dolls and the projects stay put. To add a place: two prints made like the others (the
// middle third kept clear for the dolls), and an entry here. A place without prints falls back to
// FALLBACK. Preview another with ?place=japan.

export type Place = {
  id: string;
  /** The caption on the little paper label: "Currently in …" */
  caption: string;
  far: string;
  near: string;
  sky: string;
  /** What the landscape shows, for the description of the picture */
  alt: string;
  /** The homepage's painted sky of the place (public/home): dusk always; day, golden hour and night too
   *  where they've been painted, and then the sky follows the time of day there */
  scenes?: { dusk: string; day?: string; golden?: string; night?: string; flow?: string[] };
};

export const PLACES: Record<string, Place> = {
  seattle: {
    id: 'seattle',
    caption: 'Seattle, WA',
    far: '/postcard/seattle-far.webp',
    near: '/postcard/seattle-near.webp',
    sky: '/postcard/seattle-sky.png',
    alt: 'Seattle printed in blue ink: Mount Rainier over Puget Sound, the Space Needle and downtown, and fir trees',
    scenes: { dusk: '/home/scene-seattle.webp', day: '/home/scene-seattle-day.webp', golden: '/home/scene-seattle-golden.webp', night: '/home/scene-seattle-night.webp',
      // (the same four for the moving sky, with the painted sun and moon taken out: SkyFlow draws its own,
      // which travel; made by ~/Projects/references/home-assets/inpaint-sun-moon.mjs)
      flow: ['/home/scene-seattle-day.webp', '/home/scene-seattle-golden-clear.webp', '/home/scene-seattle.webp', '/home/scene-seattle-night-clear.webp'] },
  },
  japan: {
    id: 'japan',
    caption: 'Japan',
    far: '/postcard/japan-far.webp',
    near: '/postcard/japan-near.webp',
    sky: '/postcard/japan-sky.png',
    alt: 'Japan printed in blue ink: Mount Fuji over a lake, the Chureito pagoda among pines and cherry trees',
    scenes: { dusk: '/home/scene-japan.webp' },
  },
};

/** The sun, in the far print's own units (1536 × 768): its centre and radius. It rises above the prints' top
 *  edge (its svg reaches ABOVE units higher) and sets behind the far print's ridge (the sky mask). */
export const SUN = { cx: 860, cy: 150, r: 150 };
export const ABOVE = 320;

/** Where a place is missing or its prints fail */
export const FALLBACK = PLACES.seattle;

export const placeOf = (id?: string | null): Place => (id && PLACES[id]) || FALLBACK;
