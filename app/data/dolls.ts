// The matryoshka set's art, shared by the flat (SVG) dolls and the 3D ones. Biggest first; each is
// painted tone-on-tone in its own purple: a lighter headscarf, a fringe, an apron panel with a folk
// flower. The littlest is solid (no apron, no lid). Shapes are in the dolls' 200 × 260 box.
export const DOLLS = [
  { size: 1, body: '#8b5cf6', shade: '#7e4ef1', scarf: '#b9a2f9', apron: '#cdbdfb', deep: '#4a2a9c' },
  { size: 0.72, body: '#a78bfa', shade: '#9a7cf7', scarf: '#cbbcfc', apron: '#ddd3fd', deep: '#58389f' },
  { size: 0.52, body: '#c4b5fd', shade: '#b8a6fb', scarf: '#e0d7fe', apron: '#ece6ff', deep: '#6b49c0' },
  { size: 0.36, body: '#ede7fe', shade: '#e3dafd', scarf: '#f8f5ff', apron: null, deep: '#7c5cd6' },
] as const;
export type Doll = (typeof DOLLS)[number];
export const INK = '#140b24';
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
