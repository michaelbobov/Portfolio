'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  actor, aiAttack, aiDefend, attack, canAttack, cardName, deal, defend, defenderOf, defendsAt, pass, sorted, suitMark, take, unbeaten,
  rankName, type Card, type Game,
} from '@/app/data/durak';
import { COLORS, DollAvatar, colorOf, type Look } from '@/app/components/DurakDoll';
import { PlayingCard, RED } from '@/app/components/DurakCards';
import DurakSetup from '@/app/components/DurakSetup';
import DurakHelp from '@/app/components/DurakHelp';
import './durak.css';

// An easter egg on the homepage: a playing card peeking up from the corner of the page (or just type
// "durak" anywhere). The card grows into a full-screen table: first "make your doll" (DurakSetup: a colour,
// a photo from the camera for its face, how many play), then a game of Durak (data/durak) for two to five
// seats: you along the bottom, the computer's dolls (Michael first) along the top, the deck with its trump
// turned up, the table and the discard in the middle. The computer takes its turns on its own, a beat apart.

const AI_MS = 1100;
const COLOR_KEY = 'durak-doll-color', PLAYERS_KEY = 'durak-players';
// The computer's dolls, in order of who sits down
const BOTS = [{ name: 'Michael', color: 'snow', michael: true }, { name: 'Anya', color: 'poppy' }, { name: 'Misha', color: 'meadow' }, { name: 'Dasha', color: 'plum' }];

/** A row of cards overlapping more the more there are */
const fan = (n: number) => ({ '--ov': n <= 6 ? 0.12 : Math.min(0.72, 1 - 5.6 / n) } as CSSProperties);
const fanDown = (n: number) => ({ '--ov': n <= 2 ? 0.3 : Math.min(0.8, 1 - 3.4 / n) } as CSSProperties);

/** A playable card tilts a little towards the pointer */
const tilt = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const b = e.currentTarget, r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  b.style.setProperty('--ry', `${(x - 0.5) * 24}deg`);
  b.style.setProperty('--rx', `${(0.5 - y) * 20}deg`);
};
const untilt = (e: PointerEvent<HTMLElement>) => ['--ry', '--rx'].forEach((v) => e.currentTarget.style.removeProperty(v));
const colorHex = (id?: string) => colorOf(id ?? 'gzhel').body;
const PETALS = ['#ffffff', '#2a4fae', '#f0c25a', '#c23b30', '#9bb4de'];
const label = (c: Card) => `${rankName(c.r)}${suitMark[c.s]}`;
type Entry = { id: number; who: number | null; text: string };

/** One player's seat: their doll, name, card count, and whose turn it is */
function Seat({ name, look, michael, count, acting, role, fool }: { name: string; look: Look; michael?: boolean; count: number; acting: boolean; role: string; fool: boolean }) {
  // (the count's badge pops only when a card leaves the hand)
  const prev = useRef(count);
  const drop = count < prev.current;
  useEffect(() => { prev.current = count; });
  return (
    <div className={`dk-seat${acting ? ' is-acting' : ''}${role === 'safe' ? ' is-safe' : ''}`}>
      <DollAvatar look={look} michael={michael} fool={fool} className="dk-av" />
      <p className="dk-name">{name}<span>{role}</span></p>
      <span key={count} className={`dk-badge${drop ? ' is-drop' : ''}`} aria-label={`${count} cards`}>{count}</span>
    </div>
  );
}

export default function Durak() {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const egg = useRef<HTMLButtonElement | null>(null);
  const closing = useRef(false);
  const [shown, setShown] = useState(false);
  const [stage, setStage] = useState<'setup' | 'play'>('setup');
  const [help, setHelp] = useState(false);
  const [g, setG] = useState<Game | null>(null);
  const [look, setLook] = useState<Look>({ color: 'gzhel', face: null });
  const [players, setPlayers] = useState(2);
  const [log, setLog] = useState<Entry[]>([]);
  const logId = useRef(0);

  // (their colour and table size are remembered; their face never is)
  useEffect(() => {
    try {
      const c = localStorage.getItem(COLOR_KEY), n = Number(localStorage.getItem(PLAYERS_KEY));
      if (c) setLook((l) => ({ ...l, color: c }));
      if (n >= 2 && n <= 5) setPlayers(n);
    } catch { /* none */ }
  }, []);
  const change = (l: Look) => { setLook(l); try { localStorage.setItem(COLOR_KEY, l.color); } catch { /* none */ } };
  const choose = (n: number) => { setPlayers(n); try { localStorage.setItem(PLAYERS_KEY, String(n)); } catch { /* none */ } };

  // Everyone at the table: you, then the computer's dolls (in colours that aren't yours)
  const seats = useMemo(() => {
    const taken = new Set([look.color]);
    return [{ name: 'You', look, michael: false }, ...BOTS.slice(0, players - 1).map((b) => {
      let color = b.color;
      if (!b.michael && taken.has(color)) color = COLORS.find((c) => !taken.has(c.id))?.id ?? color;
      taken.add(color);
      return { name: b.name, look: { color, face: null } as Look, michael: !!b.michael };
    })];
  }, [look, players]);

  // The table opens out of the corner card, and shuts back into it
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The card is what you follow: it lifts out of the corner to the middle of the screen, turns on its edge, and
  // the table opens from that spot as a circle. Closing runs back: the circle shuts, the card turns back and
  // flies home. (Reduced motion: it just opens and shuts.)
  const busy = useRef(false);
  const cardClone = () => {
    const card = egg.current?.querySelector<HTMLElement>('.dk-card');
    if (!card) return null;
    const r = card.getBoundingClientRect(), clone = card.cloneNode(true) as HTMLElement;
    clone.classList.add('dk-fly');
    Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
    clone.style.setProperty('--cw', `${r.width}px`);
    return { clone, r };
  };
  const dim = () => {
    const el = document.createElement('div');
    el.className = 'dk-dim';
    document.body.append(el);
    return el;
  };
  const CENTER = (r: DOMRect, size: number) => ({ dx: window.innerWidth / 2 - (r.left + r.width / 2), dy: window.innerHeight / 2 - (r.top + r.height / 2), sc: size / r.height });
  const open = () => {
    const d = dialog.current, c = reduced() ? null : cardClone();
    if (!d || d.open || busy.current) return;
    setStage(g && !g.fool ? 'play' : 'setup');
    setHelp(false);
    setShown(true);
    if (!c || !egg.current) { d.showModal(); return; }
    busy.current = true;
    const { clone, r } = c, shade = dim(), { dx, dy, sc } = CENTER(r, 230);
    document.body.append(clone);
    egg.current.style.visibility = 'hidden';
    shade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out', fill: 'forwards' });
    // lift to the middle, straightening
    clone.animate([{ translate: '0 0', scale: 1, rotate: '-12deg' }, { translate: `${dx}px ${dy - 18}px`, scale: sc * 1.08, rotate: '0deg', offset: 0.72 }, { translate: `${dx}px ${dy}px`, scale: sc, rotate: '0deg' }], { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }).finished.then(() => {
      // turn on its edge
      return clone.animate([{ transform: 'perspective(900px) rotateY(0deg)' }, { transform: 'perspective(900px) rotateY(90deg)' }], { duration: 380, easing: 'cubic-bezier(0.55, 0, 0.8, 0.4)', fill: 'forwards' }).finished;
    }).then(() => {
      // and the table opens from where it stood
      d.style.clipPath = 'circle(0px at 50% 50%)';
      d.showModal();
      clone.remove();
      shade.remove();
      d.animate([{ clipPath: 'circle(0px at 50% 50%)' }, { clipPath: 'circle(80% at 50% 50%)' }], { duration: 850, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }).finished.finally(() => { d.style.clipPath = ''; busy.current = false; });
    }).catch(() => { clone.remove(); shade.remove(); d.style.clipPath = ''; if (!d.open) d.showModal(); busy.current = false; });
  };
  const close = () => {
    const d = dialog.current;
    if (!d || !d.open || busy.current) return;
    const c = reduced() ? null : cardClone();
    const home = () => { if (egg.current) egg.current.style.visibility = ''; busy.current = false; };
    if (!c) { d.close(); home(); return; }
    busy.current = true;
    const { clone, r } = c, { dx, dy, sc } = CENTER(r, 230);
    d.animate([{ clipPath: 'circle(80% at 50% 50%)' }, { clipPath: 'circle(0px at 50% 50%)' }], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished.then(() => {
      // the card, edge-on in the middle, turns back to face you, and goes home
      const shade = dim();
      shade.style.opacity = '1';
      Object.assign(clone.style, { transform: 'perspective(900px) rotateY(90deg)', translate: `${dx}px ${dy}px`, scale: String(sc) });
      document.body.append(clone);
      d.close();
      shade.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-in', fill: 'forwards' });
      return clone.animate([{ transform: 'perspective(900px) rotateY(90deg)' }, { transform: 'perspective(900px) rotateY(0deg)' }], { duration: 360, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)', fill: 'forwards' }).finished.then(() => {
        clone.style.transform = '';
        return clone.animate([{ translate: `${dx}px ${dy}px`, scale: sc, rotate: '0deg' }, { translate: '0 0', scale: 1, rotate: '-12deg' }], { duration: 660, easing: 'cubic-bezier(0.55, 0, 0.2, 1)', fill: 'forwards' }).finished;
      }).then(() => { clone.remove(); shade.remove(); });
    }).then(home, () => { clone.remove(); document.querySelectorAll('.dk-dim').forEach((e) => e.remove()); if (d.open) d.close(); home(); });
  };

  // ---------- cards on the move ----------
  // Every change to the game goes through commit (or fresh, for a new deal). Before it, the table is
  // measured: where each face-up card is, where the dolls and the deck are. After React has drawn the new
  // state, the layout effect below flies each card that moved from where it was: a card from a hand over the
  // table in an arc, a defending card slamming down on its attacker with a ring, the cards you draw out of
  // the deck, and the deal, which fans out of the deck to every seat. When a bout ends, clones of the
  // table's cards (ghosts) sweep away to the discard or to whoever takes them.
  const gRef = useRef<Game | null>(null);
  gRef.current = g;
  type Flight = { deal: boolean; before: Map<string, DOMRect>; mover: number | null; seats: Map<number, DOMRect>; counts: number[]; taker: number };
  const flight = useRef<Flight | null>(null);
  const spin = (i: number) => (i % 2 ? 1 : -1);
  const snapshot = (cur: Game | null, next: Game, deal: boolean) => {
    const d = dialog.current;
    if (!d || reduced()) return;
    const before = new Map<string, DOMRect>();
    d.querySelectorAll<HTMLElement>('.dk-card[data-cid]:not(.dk-ghost)').forEach((el) => before.set(el.dataset.cid as string, el.getBoundingClientRect()));
    const seats = new Map<number, DOMRect>();
    d.querySelectorAll<HTMLElement>('.dk-opp').forEach((el, k) => seats.set(k + 1, (el.querySelector('.dk-hand') ?? el).getBoundingClientRect()));
    const taker = cur && cur.taking ? defenderOf(cur) : -1;
    flight.current = { deal, before, mover: cur && !deal ? actor(cur) : null, seats, counts: deal || !cur ? next.hands.map(() => 0) : cur.hands.map((h) => h.length), taker };
    // the table clears: its cards sweep away as ghosts, to the discard or to whoever takes them
    if (!deal && cur && cur.hands.length === next.hands.length && cur.table.length > 0 && next.table.length === 0 && taker !== 0) {
      const to = d.querySelector(taker > 0 ? `.dk-opp:nth-child(${taker}) .dk-seat` : '.dk-out')?.getBoundingClientRect();
      if (to) d.querySelectorAll<HTMLElement>('.dk-pair .dk-card').forEach((el, i) => {
        const r = el.getBoundingClientRect(), ghost = el.cloneNode(true) as HTMLElement;
        ghost.classList.add('dk-ghost');
        ghost.removeAttribute('data-cid');
        Object.assign(ghost.style, { left: `${r.left}px`, top: `${r.top}px`, transform: getComputedStyle(el).transform });
        d.append(ghost);
        const dx = to.left + to.width / 2 - (r.left + r.width / 2), dy = to.top + to.height / 2 - (r.top + r.height / 2);
        const a = ghost.animate([
          { translate: '0 0', scale: 1, rotate: '0deg', opacity: 1 },
          { translate: `${dx}px ${dy}px`, scale: 0.55, rotate: `${spin(i) * 28}deg`, opacity: 0, offset: 1 },
        ], { duration: 760, delay: i * 80, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'both' });
        a.finished.then(() => ghost.remove(), () => ghost.remove());
      });
    }
  };
  // What just happened, in a line or two for the little log (diffing the game before and after)
  const describe = (cur: Game, next: Game): Omit<Entry, 'id'>[] => {
    const name = (i: number) => seats[i]?.name ?? '';
    const out: Omit<Entry, 'id'>[] = [];
    const def = defenderOf(cur), who = actor(cur);
    if (next.table.length > cur.table.length && who !== null) {
      const c = next.table[next.table.length - 1].a;
      out.push({ who, text: `${who === 0 ? 'You' : name(who)} ${cur.table.length === 0 ? 'lead' : 'add'}${who === 0 ? '' : 's'} ${label(c)}` });
    } else if (next.table.some((p, k) => p.d && !cur.table[k]?.d) && next.table.length === cur.table.length) {
      const k = next.table.findIndex((p, i) => p.d && !cur.table[i]?.d);
      out.push({ who: def, text: `${def === 0 ? 'You beat' : `${name(def)} beats`} it · ${label(next.table[k].d as Card)}` });
    } else if (next.taking && !cur.taking) {
      out.push({ who: def, text: `${def === 0 ? 'You take' : `${name(def)} takes`}` });
    } else if (next.table.length === 0 && cur.table.length > 0) {
      const n = cur.table.reduce((a, p) => a + (p.d ? 2 : 1), 0);
      out.push(cur.taking ? { who: def, text: `${def === 0 ? 'You took' : `${name(def)} took`} ${n}` } : { who: null, text: `${n} cards out` });
    }
    if (next.fool !== null && cur.fool === null) out.push({ who: null, text: next.fool === 'draw' ? 'A draw' : `${next.fool === 0 ? 'You are' : `${name(next.fool)} is`} the durak` });
    return out;
  };
  const note = (entries: Omit<Entry, 'id'>[], reset = false) => setLog((l) => [...(reset ? [] : l), ...entries.map((e) => ({ ...e, id: ++logId.current }))].slice(-6));
  const commit = (next: Game) => {
    const cur = gRef.current;
    snapshot(cur, next, false);
    if (cur) note(describe(cur, next));
    setG(next);
  };
  const fresh = () => {
    const next = deal(players);
    snapshot(null, next, true);
    note([{ who: null, text: `New deal · trumps ${suitMark[next.trump.s]}` }], true);
    setG(next);
  };

  useLayoutEffect(() => {
    const f = flight.current;
    flight.current = null;
    const d = dialog.current, cur = gRef.current;
    if (!f || !d || !cur || reduced()) return;
    const mid = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    const deck = d.querySelector('.dk-deck')?.getBoundingClientRect();
    /** Flies a card from a point to where it now is: up and over (lift), turning, and landing with a small bump */
    const fly = (el: HTMLElement, from: { x: number; y: number }, o: { delay?: number; lift?: number; rot?: number; ms?: number; scale?: number; ring?: boolean } = {}) => {
      const { delay = 0, lift = 80, rot = 16, ms = 900, scale = 0.9, ring = false } = o;
      const rect = el.getBoundingClientRect(), to = mid(rect), dx = from.x - to.x, dy = from.y - to.y;
      const frames = (shadow: boolean): Keyframe[] => [
        { translate: `${dx}px ${dy}px`, scale, rotate: `${rot}deg`, ...(shadow ? { filter: 'drop-shadow(0 4px 4px rgba(0,0,0,.3))' } : {}) },
        { translate: `${dx * 0.42}px ${dy * 0.42 - lift}px`, scale: 1.22, rotate: `${rot * 0.35}deg`, ...(shadow ? { filter: 'drop-shadow(0 28px 22px rgba(0,0,0,.42))' } : {}), offset: 0.55 },
        { translate: '0 0', scale: 1.07, rotate: '0deg', ...(shadow ? { filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.35))' } : {}), offset: 0.84 },
        { translate: '0 0', scale: 1, rotate: '0deg', ...(shadow ? { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' } : {}) },
      ];
      el.animate(frames(true), { duration: ms, delay, easing: 'cubic-bezier(0.33, 0.8, 0.4, 1)', fill: 'backwards' });
      if (ring) window.setTimeout(() => {
        if (!d.isConnected) return;
        const c = mid(el.getBoundingClientRect()), r = document.createElement('span');
        r.className = 'dk-ring';
        Object.assign(r.style, { left: `${c.x}px`, top: `${c.y}px` });
        d.append(r);
        r.animate([{ scale: 0.3, opacity: 0.8 }, { scale: 1.5, opacity: 0 }], { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).finished.then(() => r.remove(), () => r.remove());
      }, delay + ms * 0.84);
    };
    const slide = (el: HTMLElement, from: DOMRect) => {
      const to = el.getBoundingClientRect(), dx = from.left - to.left, dy = from.top - to.top;
      el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    };
    const at = deck ? mid(deck) : null;
    let draw = 0;

    // yours: a card that moved (re-spaced in the hand, or taken in from the table), or came out of the deck
    d.querySelectorAll<HTMLElement>('.dk-row.is-yours .dk-card[data-cid]').forEach((el) => {
      const was = f.before.get(el.dataset.cid as string);
      if (was) {
        const now = el.getBoundingClientRect();
        if (Math.hypot(was.left - now.left, was.top - now.top) > 14) {
          // (taken in off the table: it flies; moved along in the hand: it slides)
          if (was.top < now.top - 40 && was.top < window.innerHeight * 0.66) fly(el, mid(was), { lift: 40, rot: -8, scale: 1, ms: 800, delay: draw++ * 90 });
          else slide(el, was);
        }
      } else if (at) fly(el, at, { delay: f.deal ? draw++ * 170 : 700 + draw++ * 130, lift: 60, rot: f.deal ? -24 : 18 });
    });
    // the table: your card arcs over from your hand, theirs from their seat; a defender slams down with a ring
    let t = 0;
    d.querySelectorAll<HTMLElement>('.dk-pair .dk-card[data-cid]').forEach((el) => {
      const was = f.before.get(el.dataset.cid as string);
      const over = el.classList.contains('is-over');
      if (was) { if (Math.hypot(was.left - el.getBoundingClientRect().left, was.top - el.getBoundingClientRect().top) > 14) fly(el, mid(was), { ring: over, lift: 130, ms: 1150, rot: -14 }); return; }
      const seat = f.mover != null ? f.seats.get(f.mover) : undefined;
      if (seat) fly(el, mid(seat), { ring: over, rot: spin(t++) * 20, scale: 0.55, lift: 100, ms: 1100 });
    });
    // theirs: cards dealt or drawn come out of the deck; the ones an opponent takes just appear as the ghosts land
    d.querySelectorAll<HTMLElement>('.dk-opp').forEach((opp, k) => {
      const seat = k + 1, now = cur.hands[seat]?.length ?? 0, add = now - (f.counts[seat] ?? 0);
      if (add <= 0) return;
      const els = Array.from(opp.querySelectorAll<HTMLElement>('.dk-hand .dk-card')).slice(-add);
      els.forEach((el, i) => {
        if (f.taker === seat) el.animate([{ opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1 }], { duration: 450, delay: 700 + i * 60, easing: 'ease-out', fill: 'backwards' });
        else if (at) fly(el, at, { delay: f.deal ? (draw + i * 6 + k) * 110 : 700 + i * 120, lift: 50, rot: 20, ms: 850 });
      });
    });
  }, [g]);

  // Typing "durak" (outside a field) deals too
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    let typed = '';
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1 || el?.closest('input, textarea, select, [contenteditable]')) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'durak') { typed = ''; openRef.current(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---------- whose move ----------
  const who = g ? actor(g) : null;
  const def = g ? defenderOf(g) : -1;
  const answering = !!g && who === def && unbeaten(g) > 0 && !g.taking; // the defender, with a card to beat
  const leading = !!g && who !== null && g.table.length === 0;
  const throwing = !!g && who !== null && g.table.length > 0 && !answering;
  const playable = (c: Card) => {
    if (!g || who !== 0) return false;
    return answering ? defendsAt(g, c) >= 0 : canAttack(g, 0, c);
  };
  const youCanThrow = !!g && who === 0 && throwing && g.hands[0].some((c) => canAttack(g, 0, c));

  // The computer's turns: attack, throw in, answer or take, pass; yours too when you've nothing to throw in
  useEffect(() => {
    if (!g || !shown || stage !== 'play' || help || who === null) return;
    let next: (() => Game) | null = null;
    if (who !== 0) {
      if (answering) { const m = aiDefend(g); next = () => (m ? defend(g, m.i, m.c) : take(g)); }
      else { const c = aiAttack(g, who); next = () => (c ? attack(g, who, c) : pass(g)); }
    } else if (throwing && !youCanThrow) next = () => pass(g);
    if (!next) return;
    const play = next;
    const t = window.setTimeout(() => commit(play()), who === 0 ? 1100 : AI_MS);
    return () => window.clearTimeout(t);
  }, [g, shown, stage, help, who, answering, throwing, youCanThrow]);

  const playCard = (c: Card) => {
    if (!g || !playable(c)) return;
    commit(answering ? defend(g, defendsAt(g, c), c) : attack(g, 0, c));
  };

  const nm = (i: number) => seats[i]?.name ?? '';
  let say = '', button: { label: string; act: () => void } | null = null;
  if (g && g.fool === null) {
    if (g.done[0]) say = 'You’re safe! Watching the rest…';
    else if (who === 0 && leading) say = 'Your attack';
    else if (who === 0 && answering) { say = 'Beat it, or take'; button = { label: 'Take', act: () => commit(take(g)) }; }
    else if (who === 0 && throwing) {
      say = !youCanThrow ? 'Nothing to add…' : g.taking ? `${nm(def)} is taking: add more?` : 'Throw in, or pass';
      if (youCanThrow) button = { label: g.taking ? 'Let them take' : g.attacker === 0 ? 'Done' : 'Pass', act: () => commit(pass(g)) };
    } else if (g.taking && def === 0) say = 'You’re taking them…';
    else if (who !== null) say = `${nm(who)}…`;
  }
  const roleOf = (i: number) => {
    if (!g) return '';
    if (g.done[i]) return 'safe';
    if (i === g.attacker) return 'attacking';
    if (i === def) return 'defending';
    return '';
  };
  const trumpName = g ? cardName(g.trump).split(' of ')[1] : '';
  const foolSeat = g && typeof g.fool === 'number' ? seats[g.fool] : null;
  const start = () => { if (!g || g.fool !== null || g.hands.length !== players) fresh(); setStage('play'); };
  const resume = !!g && g.fool === null && g.hands.length === players;

  return (
    <>
      <button ref={egg} type="button" className="dk-egg" onClick={open} aria-label="Play Durak, the Russian card game" title="Fancy a game of cards?">
        <span className="dk-card" aria-hidden="true"><span className="dk-corner">6<br />{suitMark.S}</span><span className="dk-pip">{suitMark.S}</span></span>
      </button>

      <dialog ref={dialog} className="dk" aria-labelledby="dk-title" onClose={() => setShown(false)} onCancel={(e) => { e.preventDefault(); close(); }}>
        {shown && (
          <>
            <button type="button" className="dk-close" onClick={close} aria-label="Close the game">×</button>
            <div className="dk-tools">
              <button type="button" className="dk-change" onClick={() => setHelp(true)}>How to play</button>
              {stage === 'play' && <button type="button" className="dk-change is-doll" onClick={() => setStage('setup')}>Change my doll</button>}
            </div>

            {stage === 'setup' || !g ? (
              <DurakSetup look={look} onChange={change} players={players} onPlayers={choose} onHelp={() => setHelp(true)} onDone={start} cta={resume ? 'Back to the game' : 'Deal me in'} />
            ) : (
              <div className="dk-board">
                <h2 id="dk-title" className="sr-only">Durak, the fool: you against {seats.slice(1).map((s) => s.name).join(', ')}</h2>

                <div className="dk-opps" data-n={players - 1}>
                  {seats.slice(1).map((s, k) => (
                    <div key={s.name} className="dk-opp">
                      <Seat name={s.name} look={s.look} michael={s.michael} count={g.hands[k + 1].length} acting={who === k + 1} role={roleOf(k + 1)} fool={g.fool === k + 1} />
                      <div className="dk-hand" style={fanDown(g.hands[k + 1].length)} aria-label={`${s.name}’s hand: ${g.hands[k + 1].length} cards`} role="img">
                        {g.hands[k + 1].map((c) => <PlayingCard key={c.id} down />)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dk-middle">
                  <div className="dk-deck" aria-label={`${g.deck.length ? `Deck: ${g.deck.length} cards` : 'Deck empty'}; trumps are ${trumpName}`} role="img">
                    {g.deck.length > 0 && <PlayingCard c={g.trump} className="dk-trump" />}
                    {g.deck.length > 1 && <PlayingCard down />}
                    {g.deck.length === 0 && <span className={`dk-trump-mark${RED.has(g.trump.s) ? ' is-red' : ''}`}>{suitMark[g.trump.s]}</span>}
                    <span className="dk-count">{g.deck.length ? g.deck.length : 'trumps'}</span>
                  </div>

                  <ul className={`dk-table${g.taking ? (def === 0 ? ' is-taking to-you' : ' is-taking to-them') : ''}`} aria-label="The table">
                    {g.table.map((p) => (
                      <li key={p.a.id} className="dk-pair">
                        <PlayingCard c={p.a} className={p.a.s === g.trump.s ? 'is-trump' : ''} />
                        {p.d && <PlayingCard c={p.d} className={`is-over${p.d.s === g.trump.s ? ' is-trump' : ''}`} />}
                      </li>
                    ))}
                  </ul>

                  <div className="dk-out" aria-label={`Discarded: ${g.out} cards`} role="img">
                    {g.out > 0 && <><PlayingCard down className="is-a" /><PlayingCard down className="is-b" /></>}
                    <span className="dk-count">{g.out}</span>
                  </div>
                </div>

                <ol className="dk-log" aria-label="What happened" aria-live="polite">
                  {log.slice(-5).map((e, i, arr) => (
                    <li key={e.id} className={e.who === null ? 'is-note' : ''} style={{ opacity: i === arr.length - 1 ? 1 : 0.5 }}>
                      {e.who !== null && <i style={{ background: colorHex(seats[e.who]?.look.color) }} aria-hidden="true" />}
                      {e.text}
                    </li>
                  ))}
                </ol>

                <div className="dk-say">
                  <p aria-live="polite">{say}</p>
                  {button && <button type="button" className="dk-btn" onClick={button.act}>{button.label}</button>}
                </div>

                <div className="dk-row is-yours">
                  <Seat name="You" look={look} count={g.hands[0].length} acting={who === 0} role={roleOf(0)} fool={g.fool === 0} />
                  <ul className="dk-hand" style={fan(g.hands[0].length)} aria-label="Your hand">
                    {sorted(g.hands[0], g.trump.s).map((c) => {
                      const ok = playable(c);
                      return (
                        <li key={c.id}>
                          <button type="button" className={`dk-play${ok ? ' is-ok' : ''}${c.s === g.trump.s ? ' is-trump' : ''}`} disabled={!ok} onPointerMove={tilt} onPointerLeave={untilt} onClick={() => playCard(c)}>
                            <PlayingCard c={c} className={c.s === g.trump.s ? 'is-trump' : ''} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {g.fool !== null && (
                  <div className="dk-result" role="status">
                    {g.fool !== 0 && g.fool !== 'draw' && (
                      <div className="dk-confetti" aria-hidden="true">
                        {Array.from({ length: 16 }, (_, i) => (
                          <span key={i} style={{ left: `${(i * 37) % 100}%`, background: PETALS[i % PETALS.length], animationDelay: `${((i * 53) % 100) / 80}s`, animationDuration: `${1.8 + ((i * 29) % 10) / 14}s`, '--sway': `${((i * 17) % 7) - 3}vw` } as CSSProperties} />
                        ))}
                      </div>
                    )}
                    <DollAvatar look={foolSeat ? foolSeat.look : look} michael={!!foolSeat?.michael} fool={g.fool !== 'draw'} className="dk-big" />
                    <h3>{g.fool === 0 ? 'Durak! That’s you.' : g.fool === 'draw' ? 'A draw.' : 'You’re safe!'}</h3>
                    <p>{g.fool === 0 ? 'You’re the fool this time.' : g.fool === 'draw' ? 'Nobody’s the fool.' : `${foolSeat?.name} is the fool.`}</p>
                    <div className="dk-camrow">
                      <button type="button" className="dk-btn is-go" onClick={fresh}>Deal again</button>
                      <button type="button" className="dk-btn is-quiet" onClick={() => setStage('setup')}>Change the table</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {help && <DurakHelp onClose={() => setHelp(false)} />}
          </>
        )}
      </dialog>
    </>
  );
}
