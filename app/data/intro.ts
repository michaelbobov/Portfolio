// The hero intro, one timeline for the words and the dolls (in ms from first paint). The set opens at
// `open`; each round, a doll's lid lifts and `lead` later the next doll starts rising out of it, one
// round every `step`. Each headline line starts as its doll starts rising: "one layer" with the
// second doll, "deeper." with the third (its letters run on as the littlest comes out).
export const DOLL_INTRO = { open: 700, step: 520, lead: 120 };
const rises = (round: number) => DOLL_INTRO.open + (round - 1) * DOLL_INTRO.step + DOLL_INTRO.lead;

export const INTRO = {
  design: 80,
  layer: rises(1),
  deeper: rises(2),
  /** Delay between the letters of "deeper." */
  letter: 110,
  lede: rises(2) + 300,
  button: rises(2) + 420,
};
