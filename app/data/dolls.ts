// The matryoshka dolls' art, shared by the flat (SVG) dolls and the 3D ones, in Gzhel colours after the
// snow concept, each with a lighter headscarf, a fringe, an apron panel with a folk flower. The first
// SET_SIZE are the homepage's set, biggest first: Work (cobalt), Side projects (porcelain white) and the
// littlest, About me (white). Every one opens, the littlest too (it's empty inside). After them, the lily-of-the-valley doll
// (slate teal), no longer in the set, stands beside the How I work title. Shapes are in the dolls'
// 200 × 260 box.
/** One doll's colours; a doll without an apron is solid (one piece, no lid) */
export type Doll = { size: number; body: string; shade: string; scarf: string; apron: string | null; deep: string };
export const DOLLS: readonly Doll[] = [
  { size: 1, body: '#4d6cb0', shade: '#44619f', scarf: '#5b79bb', apron: '#dfe7f4', deep: '#1f3a7a' },
  { size: 0.72, body: '#f3f6fb', shade: '#e6ecf5', scarf: '#d3def0', apron: '#ffffff', deep: '#3a5fb0' },
  { size: 0.52, body: '#f6f8fc', shade: '#edf1f8', scarf: '#dfe7f3', apron: '#ffffff', deep: '#4a6fb8' },
  { size: 0.52, body: '#8ea5b1', shade: '#8299a5', scarf: '#a7bac4', apron: '#e3ebef', deep: '#41606f' },
];
/** How many of DOLLS make the homepage's set */
export const SET_SIZE = 3;
/** Painted fronts and backs, by doll: Gzhel, drawn with Codex's image tool after the snow concept and
 *  fitted to the outline (a 200 × 260 box at 5 px a unit). The 3D dolls wrap them, the flat ones show the
 *  front; a doll without one is drawn from its colours above. */
export const DOLL_ART: ({ front: string; back: string } | null)[] = [
  { front: '/dolls/doll-1-front.webp', back: '/dolls/doll-1-back.webp' }, // Work: the big flower
  { front: '/dolls/doll-2-front.webp', back: '/dolls/doll-2-back.webp' }, // Side projects: a winter village
  { front: '/dolls/doll-4-front.webp', back: '/dolls/doll-4-back.webp' }, // About me: blueberries
  { front: '/dolls/doll-3-front.webp', back: '/dolls/doll-3-back.webp' }, // How I work's title: lily of the valley
];
export const INK = '#1b2740';
export const SKIN = '#fff8f2';
export const CHEEK = '#ff9fc4';
/** The heart of each doll's flower: folk gold, the one warm note in the set (the site's --wf-gold) */
export const GOLD = '#f0bd5a';
export const SCARF = 'M100 8C140 8 160 38 160 76C160 96 152 104 154 116C140 130 120 136 100 136S60 130 46 116C48 104 40 96 40 76C40 38 60 8 100 8Z';
export const FRINGE = 'M73 78C75 61 87 53 100 55C113 53 125 61 127 78C119 68 110 64 100 69C90 64 81 68 73 78Z';
/** Where the doll splits into lid and base (y in the doll's box) */
export const WAIST = 150;
/** The flower on the front: its centre height and petal size */
export const flowerOf = (d: Doll) => (d.apron === null ? { y: 196, r: 9 } : { y: 203, r: 11 });
