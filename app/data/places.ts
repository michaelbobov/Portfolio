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
};

export const PLACES: Record<string, Place> = {
  seattle: {
    id: 'seattle',
    caption: 'Seattle, WA',
    far: '/postcard/seattle-far.webp',
    near: '/postcard/seattle-near.webp',
    sky: '/postcard/seattle-sky.png',
    alt: 'Seattle printed in blue ink: Mount Rainier over Puget Sound, the Space Needle and downtown, and fir trees',
  },
  japan: {
    id: 'japan',
    caption: 'Japan',
    far: '/postcard/japan-far.webp',
    near: '/postcard/japan-near.webp',
    sky: '/postcard/japan-sky.png',
    alt: 'Japan printed in blue ink: Mount Fuji over a lake, the Chureito pagoda among pines and cherry trees',
  },
};

/** Where a place is missing or its prints fail */
export const FALLBACK = PLACES.seattle;

export const placeOf = (id?: string | null): Place => (id && PLACES[id]) || FALLBACK;
