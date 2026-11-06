// The hero intro, one timeline for the name and the dolls (in ms from when the set is shown). The name
// rises in at `sign`, the live sentence under it at `role`;
// meanwhile the dolls stand, and the set opens at `open`, once the name is nearly written: each round,
// a doll's lid lifts over `lead`, then the next doll hops out of it and lands in its place over `hop`,
// one round every `step`.
export const DOLL_INTRO = { open: 1000, step: 560, lead: 200, hop: 640 };

export const INTRO = {
  sign: 120,
  role: 520,
};
