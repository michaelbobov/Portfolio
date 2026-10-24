// How Michael works, as the layers of a matryoshka: outside is what people use, at the core are the
// people it's for. The hero doll speaks these lines as each layer opens and shows the open layer's
// name under it; "How I work" near the end of the page lists them all. One entry per doll, biggest
// first; colour is that doll's dress.
export const LAYERS = [
  { name: 'What ships', skills: 'Frontend dev · AI integration', color: '#ff5d5d', line: 'On the outside: a live product. I build what I design, AI included.' },
  { name: 'How it feels', skills: 'Interaction design', color: '#6a35e8', line: 'One layer in: how it feels. Every tap, state and transition.' },
  { name: 'How it’s proven', skills: 'Prototyping', color: '#ffffff', line: 'Deeper: prototypes, so ideas are tested before they ship.' },
  { name: 'How it’s shaped', skills: 'Product design', color: '#c9b6ff', line: 'Deeper still: product design. Flows, structure, the hard trade-offs.' },
  { name: 'Who it’s for', skills: 'UX research', color: '#ff8fb8', line: 'At the core: the people it’s for. Research comes first.' },
] as const;

// A matryoshka's outline in a 200 × 260 box (the hero dolls, and the little ones that stand for them)
export const SHAPE = 'M100 8C140 8 160 38 160 76C160 96 152 104 154 116C158 136 184 160 184 200C184 236 166 252 150 252H50C34 252 16 236 16 200C16 160 42 136 46 116C48 104 40 96 40 76C40 38 60 8 100 8Z';
