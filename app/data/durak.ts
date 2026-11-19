// Durak ("the fool"), the Russian card game, for two to five players: the rules and the computer's play,
// as plain functions over the game's state (Durak.tsx draws it and runs the turns). Seat 0 is the person
// at the screen; the seats run clockwise.
//
// The throw-in game: 36 cards (six to ace), six each, the deck's last card turned up for trumps. The
// attacker plays a card; the next player (the defender) beats it with a higher card of its suit, or any
// trump (a trump only with a higher trump). Then the attacker may throw in more cards of any rank already
// on the table, and so may every other player but the defender, in turn: never more than the defender can
// answer, six cards in a bout (five in the first). All beaten and nobody adds: they're discarded and the
// defender attacks next. A defender who can't (or won't) beat takes the lot and misses their turn: the
// player after them attacks. After each bout everyone draws back up to six, the attacker first and the
// defender last. Once the deck's gone, whoever runs out of cards is safe; the last one holding cards is the
// fool.

export type Suit = 'S' | 'H' | 'D' | 'C';
export type Card = { s: Suit; r: number; id: string };
export type Pair = { a: Card; d: Card | null };
export type Game = {
  deck: Card[];
  /** The trump card: the deck's last, turned face up under it */
  trump: Card;
  /** Each seat's hand */
  hands: Card[][];
  table: Pair[];
  /** How many cards are in the discard pile */
  out: number;
  attacker: number;
  /** The defender has given up this bout and will take the table */
  taking: boolean;
  /** The first bout allows one card fewer */
  first: boolean;
  /** Throw-in turns passed so far since the last card was played */
  passes: number;
  /** Seats that have got rid of every card: safe */
  done: boolean[];
  /** The seat left holding cards, or a draw, once it's over */
  fool: number | 'draw' | null;
};

export const SUITS: Suit[] = ['S', 'H', 'D', 'C'];
export const RANKS = [6, 7, 8, 9, 10, 11, 12, 13, 14];
export const rankName = (r: number) => ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' } as Record<number, string>)[r] ?? String(r);
// (text presentation: never an emoji)
export const suitMark: Record<Suit, string> = { S: '♠︎', H: '♥︎', D: '♦︎', C: '♣︎' };
export const suitName: Record<Suit, string> = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
export const cardName = (c: Card) => `${({ 11: 'jack', 12: 'queen', 13: 'king', 14: 'ace' } as Record<number, string>)[c.r] ?? c.r} of ${suitName[c.s]}`;

export const unbeaten = (g: Game) => g.table.filter((p) => !p.d).length;
export const beats = (d: Card, a: Card, trump: Suit) => (d.s === a.s ? d.r > a.r : d.s === trump);
const without = (h: Card[], c: Card) => h.filter((x) => x.id !== c.id);
const replaceAt = <T,>(list: T[], i: number, v: T) => list.map((x, k) => (k === i ? v : x));

/** The next seat clockwise from `i` still holding cards (or `i` if none) */
const nextActive = (done: boolean[], i: number) => {
  for (let k = 1; k <= done.length; k++) { const j = (i + k) % done.length; if (!done[j]) return j; }
  return i;
};
export const defenderOf = (g: Game) => nextActive(g.done, g.attacker);

/** Who may add cards this bout, in the order they're asked: the attacker, then the rest clockwise (not the defender) */
export function throwers(g: Game) {
  const def = defenderOf(g), out = [g.attacker];
  for (let j = nextActive(g.done, g.attacker); j !== g.attacker; j = nextActive(g.done, j)) if (j !== def) out.push(j);
  return out;
}

export function deal(players = 2, rand = Math.random): Game {
  const deck = SUITS.flatMap((s) => RANKS.map((r) => ({ s, r, id: `${r}${s}` })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const hands = Array.from({ length: players }, () => deck.splice(0, 6));
  const trump = deck[deck.length - 1];
  // The lowest trump leads (seat 0, if nobody holds one)
  const low = (h: Card[]) => Math.min(99, ...h.filter((c) => c.s === trump.s).map((c) => c.r));
  const lows = hands.map(low);
  const attacker = lows.indexOf(Math.min(...lows)) < 0 ? 0 : lows.indexOf(Math.min(...lows));
  return { deck, trump, hands, table: [], out: 0, attacker, taking: false, first: true, passes: 0, done: hands.map(() => false), fool: null };
}

/** Whose move it is: the attacker on an empty table, the defender while a card's unbeaten, otherwise the
 *  next thrower-in */
export function actor(g: Game): number | null {
  if (g.fool !== null) return null;
  if (g.table.length === 0) return g.attacker;
  if (unbeaten(g) > 0 && !g.taking) return defenderOf(g);
  return throwers(g)[g.passes] ?? null;
}

/** Whether this seat may put this card down now (to lead, or to throw in) */
export function canAttack(g: Game, seat: number, c: Card) {
  if (g.fool !== null || seat === defenderOf(g)) return false;
  if (g.table.length === 0) return seat === g.attacker;
  if (g.table.length >= (g.first ? 5 : 6)) return false;
  // never more unanswered cards than the defender holds
  if (unbeaten(g) >= g.hands[defenderOf(g)].length) return false;
  return g.table.some((p) => p.a.r === c.r || p.d?.r === c.r);
}

/** The table card this one would beat (the first it can), or -1 */
export function defendsAt(g: Game, c: Card) {
  if (g.fool !== null || g.taking) return -1;
  return g.table.findIndex((p) => !p.d && beats(c, p.a, g.trump.s));
}

export function attack(g: Game, seat: number, c: Card): Game {
  return { ...g, hands: replaceAt(g.hands, seat, without(g.hands[seat], c)), table: [...g.table, { a: c, d: null }], passes: 0 };
}

export function defend(g: Game, i: number, c: Card): Game {
  const def = defenderOf(g);
  return { ...g, hands: replaceAt(g.hands, def, without(g.hands[def], c)), table: g.table.map((p, k) => (k === i ? { ...p, d: c } : p)), passes: 0 };
}

export const take = (g: Game): Game => ({ ...g, taking: true, passes: 0 });

/** A thrower-in has nothing to add: the next is asked, and once all have passed the bout's over */
export function pass(g: Game): Game {
  const next = { ...g, passes: g.passes + 1 };
  return next.passes >= throwers(g).length ? endBout(next) : next;
}

/** The bout's over: the table discarded (or taken), everyone draws up to six, and the next attacker leads */
export function endBout(g: Game): Game {
  const def = defenderOf(g);
  const hands = g.hands.map((h) => [...h]);
  const cards = g.table.flatMap((p) => (p.d ? [p.a, p.d] : [p.a]));
  let out = g.out;
  if (g.taking) hands[def].push(...cards);
  else out += cards.length;
  const deck = [...g.deck];
  for (const p of [...throwers(g), def]) while (hands[p].length < 6 && deck.length) hands[p].push(deck.shift() as Card);
  const done = g.done.map((d, i) => d || (!deck.length && !hands[i].length));
  const left = done.map((d, i) => (d ? -1 : i)).filter((i) => i >= 0);
  const fool: Game['fool'] = left.length === 0 ? 'draw' : left.length === 1 ? left[0] : null;
  // The defender attacks next after a beaten bout; having taken, they miss their turn
  const attacker = g.taking || done[def] ? nextActive(done, def) : def;
  return { ...g, deck, hands, table: [], out, attacker, taking: false, first: false, passes: 0, done, fool };
}

// ---------- the computer ----------
// It plays its cheapest cards first and saves its trumps and high cards while the deck's still big.
const cost = (c: Card, trump: Suit) => c.r + (c.s === trump ? 20 : 0);
const cheapest = (cards: Card[], trump: Suit) => [...cards].sort((a, b) => cost(a, trump) - cost(b, trump))[0];

/** The card this seat would lead or throw in, or null to pass */
export function aiAttack(g: Game, seat: number): Card | null {
  const ok = g.hands[seat].filter((c) => canAttack(g, seat, c));
  if (!ok.length) return null;
  const c = cheapest(ok, g.trump.s);
  if (g.table.length === 0) return c;
  // throwing in: not trumps, or high cards, while there's plenty to draw (unless they're taking anyway)
  if (g.deck.length > 0 && c.s === g.trump.s) return null;
  if (g.deck.length > 6 && c.r >= 13 && !g.taking) return null;
  return c;
}

/** The defender's answer to the first unbeaten card, or null to take */
export function aiDefend(g: Game): { i: number; c: Card } | null {
  const i = g.table.findIndex((p) => !p.d);
  if (i < 0) return null;
  const ok = g.hands[defenderOf(g)].filter((c) => beats(c, g.table[i].a, g.trump.s));
  if (!ok.length) return null;
  const c = cheapest(ok, g.trump.s);
  // a high trump isn't worth spending on a small bout this early
  if (c.s === g.trump.s && c.r >= 12 && g.deck.length > 8 && g.table.length < 3) return null;
  return { i, c };
}

/** A hand in order: by suit, low to high, trumps last */
export function sorted(h: Card[], trump: Suit) {
  const order = (c: Card) => (c.s === trump ? 4 : SUITS.indexOf(c.s)) * 100 + c.r;
  return [...h].sort((a, b) => order(a) - order(b));
}
