'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { LAYERS, SHAPE } from '@/app/data/layers';
import KhokhlomaPlate from '@/app/components/Khokhloma';

// "Open me!": how Michael works, as a matryoshka family drawn like a folk-painted set in the site's
// comic ink. Each doll is a layer, outside in (data/layers): mama holds a phone (what ships), papa
// a switch (how it feels), the kid a paper prototype (how it's proven), the girl a pencil (how
// it's shaped) and the littlest a heart (who it's for). Each click, the doll says her layer, twists
// her top half, lifts it to show the hollow wooden inside, and the next doll rises out while the
// empty shell fades away. Under the doll, a row of little dolls and the layer's name show where you
// are; the "What I bring" band further down lists every layer for those who never click. The
// littlest one is solid: she hands over the résumé, and the next click stacks them all back up.
// The visible doll's eyes follow the pointer and blink now and then; on a mouse, a twist cursor
// shows over the dolls and the top half lifts a little to show the seam. Phones: bubbles stack under
// it. Keyboard: Enter / Space. Everything runs on refs and Web Animations; React never
// re-renders per click, and every timer, listener, frame and FX node is cleaned up on unmount.

const RESUME = '/Michael Bobov - Product Designer.pdf';
const COLORS = ['#ffd84d', '#ff8fb8', '#c9b6ff', '#ffffff'];
// Folk-paint colours in the site's family: grape and lilac lead, with folk red, yellow and pink
const RED = '#ff5d5d', GRAPE_D = '#6a35e8', LILAC = '#c9b6ff', YELLOW = '#ffd84d', PINK = '#ff8fb8';
const SKIN = '#ffe6d2', HAIR = '#5a3a22', WOOD = '#f2c48d', HOLLOW = '#a8672f';
// Biggest first: width as a share of the biggest. What each one says is its layer (data/layers).
const DOLLS = [
  { size: 1 },
  { size: 0.82 },
  { size: 0.67 },
  { size: 0.55 },
  { size: 0.45 },
];
const LAST = DOLLS.length - 1;
// The doll's outline (SHAPE, from data/layers) splits at the waist, y = 150
const SCARF = 'M100 8C140 8 160 38 160 76C160 96 152 104 154 116C140 130 120 136 100 136S60 130 46 116C48 104 40 96 40 76C40 38 60 8 100 8Z';
const HAIR_CAP = 'M100 8C140 8 160 38 160 76C160 92 156 100 150 106H50C44 100 40 92 40 76C40 38 60 8 100 8Z';
const FRINGE = 'M64 76C66 52 84 42 100 44C116 42 134 52 136 76C128 60 114 52 100 56C86 52 72 60 64 76Z';
const SLEEVES = 'M30 160C30 186 52 200 78 196L80 182C62 184 48 176 44 158ZM170 160C170 186 148 200 122 196L120 182C138 184 152 176 156 158Z';
// Where desktop bubbles sit around the doll (% of the stage), and which way each tail points
const SLOTS = [
  { x: -10, y: 2, t: 'br' }, { x: 60, y: -2, t: 'bl' }, { x: 64, y: 74, t: 'tl' },
  { x: -8, y: 76, t: 'tr' }, { x: 70, y: 44, t: 'l' }, { x: -18, y: 40, t: 'r' },
] as const;
const TAIL: Record<string, [string, string, string, string, string]> = {
  br: ['calc(100% - 48px)', 'calc(100% - 9px)', '45deg', '85%', '100%'],
  bl: ['30px', 'calc(100% - 9px)', '45deg', '15%', '100%'],
  tl: ['30px', '-12px', '225deg', '15%', '0%'],
  tr: ['calc(100% - 48px)', '-12px', '225deg', '85%', '0%'],
  l: ['-12px', 'calc(50% - 10px)', '135deg', '0%', '50%'],
  r: ['calc(100% - 8px)', 'calc(50% - 10px)', '-45deg', '100%', '50%'],
};
const OPEN_LABEL = 'Open the nesting doll to hear what Michael does';
const STACK_LABEL = 'Stack the nesting dolls back up';

// ---------- painting kit ----------
const ink: CSSProperties = { stroke: 'var(--wf-ink)' };
const inkFill: CSSProperties = { fill: 'var(--wf-ink)' };
const Dots = ({ id, bg, dot, gap = 16, r = 2.4 }: { id: string; bg: string; dot: string; gap?: number; r?: number }) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
    <rect width={gap} height={gap} fill={bg} />
    <circle cx={gap / 4} cy={gap / 4} r={r} fill={dot} />
    <circle cx={(gap * 3) / 4} cy={(gap * 3) / 4} r={r} fill={dot} />
  </pattern>
);
const Body = ({ fill }: { fill: string }) => <path d={SHAPE} fill={fill} strokeWidth="5" style={ink} />;
const Face = ({ brows = false }: { brows?: boolean }) => (
  <>
    <ellipse cx="100" cy="82" rx="37" ry="39" fill={SKIN} strokeWidth="4" style={ink} />
    <circle cx="74" cy="101" r="9" fill="#ff8fb8" opacity=".85" />
    <circle cx="126" cy="101" r="9" fill="#ff8fb8" opacity=".85" />
    {brows && <path d="M75 64Q84 58 93 63M107 63Q116 58 125 64" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />}
  </>
);
const Nose = () => <path d="M97 95Q100 98 103 95" fill="none" strokeWidth="2.5" strokeLinecap="round" style={ink} />;
const Lips = () => <path d="M93 106c3-3 5-3 7 0 2-3 4-3 7 0-2 5-5 7-7 7s-5-2-7-7Z" fill="#e5484d" strokeWidth="2" strokeLinejoin="round" style={ink} />;
const Smile = () => <path d="M89 104Q100 114 111 104" fill="none" stroke="#e5484d" strokeWidth="3.5" strokeLinecap="round" />;
const Hands = ({ y = 190, x = 20 }: { y?: number; x?: number }) => (
  <>
    <circle cx={100 - x} cy={y} r="8" fill={SKIN} strokeWidth="3" style={ink} />
    <circle cx={100 + x} cy={y} r="8" fill={SKIN} strokeWidth="3" style={ink} />
  </>
);
// A bow: two dotted loops, a knot and two tails
const Bow = ({ y, fill, s = 1 }: { y: number; fill: string; s?: number }) => (
  <g transform={`translate(100 ${y}) scale(${s})`} strokeWidth="3" strokeLinejoin="round" style={ink}>
    <path d="M-4 2L-14 22L-3 19ZM4 2L14 22L3 19Z" fill={fill} />
    <path d="M0 0C-14-16-34-10-32 2-30 14-12 16 0 0ZM0 0C14-16 34-10 32 2 30 14 12 16 0 0Z" fill={fill} />
    <ellipse rx="7" ry="6" fill={fill} />
  </g>
);
// Lacquer shine on the head and the lower body
const Shine = () => (
  <path d="M58 46c8-14 20-22 34-26M27 214c-2-10 0-18 4-26" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" strokeLinecap="round" />
);
// A folk zigzag band, clipped to the body by whoever draws it
const zigzag = (y: number) => `M16 ${y}${' l8 -6 l8 6'.repeat(11)}`;

// What each doll looks like: patterns for <defs>, and the painting (all but the eyes, which move)
// calm: the bodies are painted plain and only the scarves keep their dots
function paint(i: number, id: string, calm: boolean): { defs: ReactNode; art: ReactNode } {
  const clip = `url(#${id}-s)`;
  const pat = (name: string, plain: string) => (calm ? plain : `url(#${id}-${name})`);
  switch (i) {
    case 0: // mama, with a phone: what ships
      return {
        defs: <>
          <Dots id={`${id}-dress`} bg={RED} dot={YELLOW} />
          <Dots id={`${id}-scarf`} bg={YELLOW} dot={RED} gap={18} r={2.6} />
          <Dots id={`${id}-blouse`} bg="#fff" dot={GRAPE_D} gap={10} r={1.6} />
        </>,
        art: <>
          <Body fill={pat('dress', RED)} />
          <g clipPath={clip}>
            <path d="M40 126C70 146 130 146 160 126L176 166C130 182 70 182 24 166Z" fill={pat('blouse', '#fff')} strokeWidth="4" style={ink} />
            <path d="M18 236q8.5-9 17 0t17 0 17 0 17 0 17 0 17 0 17 0 17 0 17 0 17 0" fill="none" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
          </g>
          <Body fill="none" />
          <path d={SLEEVES} fill={pat('blouse', '#fff')} strokeWidth="4" style={ink} />
          <path d={SCARF} fill={`url(#${id}-scarf)`} strokeWidth="4" style={ink} />
          <path d={FRINGE} fill={HAIR} strokeWidth="3" strokeLinejoin="round" style={ink} />
          <Face />
          <Nose />
          <Lips />
          <Bow y={136} fill={`url(#${id}-scarf)`} />
          {/* A phone with a little app on it: what ships */}
          <rect x="83" y="158" width="34" height="56" rx="7" strokeWidth="3.5" style={{ ...inkFill, ...ink }} />
          <rect x="87.5" y="164" width="25" height="42" rx="3" fill={LILAC} />
          <rect x="91" y="169" width="18" height="10" rx="2" fill="#fff" />
          <path d="M91 186h18M91 192h12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="200" r="3" fill={YELLOW} />
          <path d="M128 158l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill={YELLOW} strokeWidth="2" strokeLinejoin="round" style={ink} />
          <Hands />
          <Shine />
        </>,
      };
    case 1: { // papa, with a switch: how it feels
      const patch = [[YELLOW, RED], [LILAC, YELLOW], [PINK, LILAC], [RED, YELLOW], [YELLOW, LILAC], [LILAC, PINK], [PINK, RED], [RED, LILAC], [YELLOW, PINK]];
      return {
        defs: <Dots id={`${id}-shirt`} bg={GRAPE_D} dot={YELLOW} />,
        art: <>
          <Body fill={pat('shirt', GRAPE_D)} />
          <g clipPath={clip}>
            <rect x="0" y="234" width="200" height="30" fill={RED} />
            <path d="M16 234H184M76 238V256M124 238V256" fill="none" strokeWidth="4" style={ink} />
          </g>
          <Body fill="none" />
          {/* A patchwork vest */}
          {patch.map(([a, b], k) => {
            const x = 64 + (k % 3) * 24, y = 148 + Math.floor(k / 3) * 27;
            return (
              <g key={k}>
                <rect x={x} y={y} width="24" height="27" fill={a} />
                <path d={k % 2 ? `M${x} ${y}h24v27Z` : `M${x} ${y + 27}h24V${y}Z`} fill={b} />
              </g>
            );
          })}
          <path d="M64 148h72v81H64ZM88 148v81M112 148v81M64 175h72M64 202h72" fill="none" strokeWidth="3" style={ink} />
          <path d={HAIR_CAP} fill={HAIR} strokeWidth="4" style={ink} />
          <Face brows />
          <path d="M62 90C60 130 78 162 100 164 122 162 140 130 138 90 130 106 118 112 100 110 82 112 70 106 62 90Z" fill={HAIR} strokeWidth="4" strokeLinejoin="round" style={ink} />
          <path d="M80 124q4 10 0 20M100 128q4 12 0 24M120 124q4 10 0 20" fill="none" stroke="#7a5236" strokeWidth="3" strokeLinecap="round" />
          <path d="M82 106C88 98 97 100 100 104 103 100 112 98 118 106 111 112 104 110 100 107 96 110 89 112 82 106Z" fill="#3e2716" strokeWidth="2.5" strokeLinejoin="round" style={ink} />
          <ellipse cx="100" cy="95" rx="8" ry="7" fill={SKIN} strokeWidth="3" style={ink} />
          {/* A switch, flipped on: how it feels */}
          <rect x="70" y="180" width="60" height="30" rx="15" fill={YELLOW} strokeWidth="4" style={ink} />
          <circle cx="114" cy="195" r="10.5" fill="#fff" strokeWidth="3.5" style={ink} />
          <Hands y={195} x={33} />
          <Shine />
        </>,
      };
    }
    case 2: // the kid, with a paper prototype: how it's proven
      return {
        defs: null,
        art: <>
          <Body fill="#fff" />
          <g clipPath={clip}>
            <path d={`${zigzag(146)}${zigzag(218)}`} fill="none" stroke={RED} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="0" y="226" width="200" height="40" fill={GRAPE_D} />
            <path d="M16 226H184M74 230V256M126 230V256" fill="none" strokeWidth="4" style={ink} />
          </g>
          <Body fill="none" />
          <path d={SLEEVES} fill="#fff" strokeWidth="4" style={ink} />
          <path d={HAIR_CAP} fill={HAIR} strokeWidth="4" style={ink} />
          <Face brows />
          <path d="M94 46q6-6 12 0" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
          <Nose />
          <Smile />
          {/* A paper prototype on a sticky note: how it's proven */}
          <g transform="rotate(-6 100 188)">
            <rect x="76" y="160" width="48" height="56" rx="3" fill={YELLOW} strokeWidth="3.5" style={ink} />
            <rect x="82" y="166" width="36" height="14" rx="2" fill="#fff" strokeWidth="2.5" style={ink} />
            <path d="M82 188h36M82 196h24M82 204h30" fill="none" strokeWidth="2.5" strokeLinecap="round" style={ink} />
          </g>
          <Hands x={21} />
          <Shine />
        </>,
      };
    case 3: // the girl, with a pencil: how it's shaped
      return {
        defs: <>
          <Dots id={`${id}-dress`} bg={LILAC} dot="#fff" gap={14} r={2.2} />
          <Dots id={`${id}-scarf`} bg={RED} dot="#fff" gap={14} r={2.2} />
        </>,
        art: <>
          <Body fill={pat('dress', LILAC)} />
          <g clipPath={clip}>
            <path d="M18 236q8.5-9 17 0t17 0 17 0 17 0 17 0 17 0 17 0 17 0 17 0 17 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </g>
          <path d={SLEEVES} fill={PINK} strokeWidth="4" style={ink} />
          <path d={SCARF} fill={`url(#${id}-scarf)`} strokeWidth="4" style={ink} />
          <path d={FRINGE} fill={HAIR} strokeWidth="3" strokeLinejoin="round" style={ink} />
          <Face />
          <Nose />
          <Lips />
          <Bow y={136} fill={`url(#${id}-scarf)`} s={0.8} />
          {/* A pencil: how it's shaped */}
          <g transform="rotate(-38 100 190)" strokeWidth="3.5" strokeLinejoin="round" style={ink}>
            <rect x="62" y="181" width="13" height="18" rx="3" fill="#ff8fb8" />
            <rect x="73" y="181" width="8" height="18" fill="#cfcad9" />
            <rect x="81" y="181" width="44" height="18" fill={YELLOW} />
            <path d="M125 181L142 190L125 199Z" fill={WOOD} />
            <path d="M136 187L142 190L136 193Z" style={inkFill} />
          </g>
          <Hands y={192} x={25} />
          <Shine />
        </>,
      };
    default: // the littlest, with a heart: who it's for
      return {
        defs: <>
          <Dots id={`${id}-dress`} bg={PINK} dot="#fff" gap={13} r={2.2} />

        </>,
        art: <>
          <Body fill={pat('dress', PINK)} />
          <path d={SCARF} fill={`url(#${id}-dress)`} strokeWidth="4" style={ink} />
          <path d={FRINGE} fill={HAIR} strokeWidth="3" strokeLinejoin="round" style={ink} />
          <Face />
          <Nose />
          <Lips />
          {/* A heart: who it's for */}
          <path d="M100 206C78 192 70 181 72 170 74 159 89 156 100 167 111 156 126 159 128 170 130 181 122 192 100 206Z" fill="#e0362c" strokeWidth="4" strokeLinejoin="round" style={ink} />
          <path d="M82 168c2-4 6-6 10-5" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3.5" strokeLinecap="round" />
          <Shine />
        </>,
      };
  }
}

// Big blue folk eyes looking up a little. The irises follow the pointer inside the whites.
const Eyes = ({ id, lashes }: { id: string; lashes: boolean }) => (
  <>
    {[84, 116].map((cx, k) => {
      const o = k ? 1 : -1; // toward the outer corner
      return (
        <g key={cx}>
          <clipPath id={`${id}-e${k}`}><ellipse cx={cx} cy="84" rx="10" ry="12" /></clipPath>
          <ellipse cx={cx} cy="84" rx="10" ry="12" fill="#fff" />
          <g clipPath={`url(#${id}-e${k})`}>
            <g className="pupil">
              <circle cx={cx} cy="82" r="7" fill="#3d8bff" strokeWidth="2" style={ink} />
              <circle cx={cx} cy="82" r="3.4" style={inkFill} />
              <circle cx={cx + 2.4} cy="79.4" r="1.8" fill="#fff" />
            </g>
          </g>
          <ellipse cx={cx} cy="84" rx="10" ry="12" fill="none" strokeWidth="2.5" style={ink} />
          {/* A heavier upper lid along the top of the white, with lashes flicking out at the outer corner */}
          <path d={`M${cx - 10} 83Q${cx} 64 ${cx + 10} 83`} fill="none" strokeWidth="3.5" strokeLinecap="round" style={ink} />
          {lashes && <path d={`M${cx + o * 8.5} 77l${o * 4.5}-2.5M${cx + o * 5.5} 73.5l${o * 2.5}-4`} fill="none" strokeWidth="2.5" strokeLinecap="round" style={ink} />}
          {/* Shut: skin over the eye and a sleepy curve */}
          <g className="md-lid">
            <ellipse cx={cx} cy="82" rx="16" ry="17" fill={SKIN} />
            <path d={`M${cx - 10} 84Q${cx} 92 ${cx + 10} 84${lashes ? `M${cx + o * 9} 85.5l${o * 4} 3` : ''}`} fill="none" strokeWidth="3.5" strokeLinecap="round" style={ink} />
          </g>
        </g>
      );
    })}
  </>
);

type Plate = 'khokhloma' | 'plain' | 'none';

function Doll({ i, uid, calm }: { i: number; uid: string; calm: boolean }) {
  const { size } = DOLLS[i], id = `${uid}-${i}`;
  const { defs, art } = paint(i, id, calm);
  return (
    <svg
      className={`md-doll${i === LAST ? ' is-solid' : ''}`}
      viewBox="0 0 200 260"
      aria-hidden="true"
      focusable="false"
      style={{ width: `${size * 100}%`, left: `${(1 - size) * 50}%`, zIndex: 100 - 2 * i, visibility: i ? 'hidden' : undefined }}
    >
      <defs>
        <clipPath id={`${id}-t`}><rect x="-20" y="-20" width="240" height="171" /></clipPath>
        <clipPath id={`${id}-b`}><rect x="-20" y="149" width="240" height="131" /></clipPath>
        <clipPath id={`${id}-s`}><path d={SHAPE} /></clipPath>
        {defs}
        <g id={`${id}-art`}>{art}</g>
      </defs>
      {/* One painting, cut at the waist into the two halves that come apart */}
      <g className="md-bot">
        <use href={`#${id}-art`} clipPath={`url(#${id}-b)`} />
      </g>
      <g className="md-top">
        <use href={`#${id}-art`} clipPath={`url(#${id}-t)`} />
        {/* Where it twists open; the littlest one is solid */}
        {i < LAST && <rect x="0" y="147.5" width="200" height="3.5" clipPath={`url(#${id}-s)`} style={inkFill} />}
        <Eyes id={id} lashes={i !== 1} />
      </g>
    </svg>
  );
}

// The hollow wooden inside of a doll's bottom half. It sits just behind the next doll, so that one
// rises out in front of the back rim but behind the front of the shell.
const Hollow = ({ i }: { i: number }) => (
  <svg
    className="md-hollow"
    viewBox="0 0 200 260"
    aria-hidden="true"
    focusable="false"
    style={{ width: `${DOLLS[i].size * 100}%`, left: `${(1 - DOLLS[i].size) * 50}%`, zIndex: 97 - 2 * i, visibility: 'hidden' }}
  >
    <g className="md-in">
      <path d="M30 150A70 15 0 0 1 170 150Z" fill={WOOD} strokeWidth="3" style={ink} />
      <path d="M40 150A60 11 0 0 1 160 150Z" fill={HOLLOW} />
    </g>
  </svg>
);

// calm: plain bodies, dots only on the scarves. plate: what hangs behind the dolls.
export default function Matryoshka({ calm = false, plate = 'khokhloma' }: { calm?: boolean; plate?: Plate }) {
  const uid = `md${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const buddyRef = useRef<HTMLButtonElement | null>(null);
  const dollsRef = useRef<HTMLSpanElement | null>(null);
  const stackRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const meterRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const saidRef = useRef<HTMLParagraphElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const stage = stageRef.current, buddy = buddyRef.current, stack = stackRef.current, box = dollsRef.current;
    const label = labelRef.current, said = saidRef.current, mlist = listRef.current, meter = meterRef.current;
    const cursor = cursorRef.current;
    if (!stage || !buddy || !stack || !box || !label || !said || !mlist || !meter || !cursor) return;
    const meterDolls = Array.from(meter.querySelectorAll<SVGSVGElement>('.md-meter-doll'));
    const meterName = meter.querySelector('.md-meter-name') as HTMLSpanElement;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 899px)');
    const dolls = Array.from(stack.querySelectorAll<SVGSVGElement>('.md-doll'));
    const hollows = Array.from(stack.querySelectorAll<SVGSVGElement>('.md-hollow'));

    // ---------- bookkeeping, so unmount leaves nothing behind ----------
    let alive = true;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms);
      timers.add(id);
      return id;
    };
    const off: Array<() => void> = [];
    const listen = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      off.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    // ---------- the visible doll's eyes follow the pointer, and it blinks now and then ----------
    let level = 0, busy = false, px = -1, py = -1;
    const look = (x: number, y: number) => {
      const doll = dolls[level], r = doll.getBoundingClientRect(), sx = r.width / 200;
      doll.querySelectorAll<SVGGElement>('.pupil').forEach((p, k) => {
        const ex = r.left + (k ? 116 : 84) * sx, ey = r.top + 82 * sx;
        const a = Math.atan2(y - ey, x - ex), d = Math.min(3, Math.hypot(x - ex, y - ey) / 40);
        p.setAttribute('transform', `translate(${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})`);
      });
    };
    listen(window, 'pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      if (!narrow.matches) look(px, py);
    }, { passive: true });
    const blink = () => {
      if (!reduce.matches) {
        buddy.classList.add('blink');
        later(() => buddy.classList.remove('blink'), 140);
      }
      later(blink, 2600 + Math.random() * 3800);
    };
    later(blink, 1800 + Math.random() * 2400);

    // ---------- speech and thought bubbles ----------
    let slot = 0, shown = 0, cIdx = 0;
    const live: HTMLElement[] = [];
    const retire = (b: Element) => { b.classList.add('out'); later(() => b.remove(), 220); };
    const speak = (resume = false) => {
      shown++;
      const b = document.createElement('div');
      b.className = 'md-bubble';
      if (resume) {
        b.append(`${LAYERS[level].line} `);
        const a = document.createElement('a');
        a.href = RESUME;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Here’s my résumé';
        b.append(a, '.');
        said.textContent = `${LAYERS[level].line} Here’s my résumé.`;
      } else {
        const t = LAYERS[level].line;
        b.textContent = t;
        said.textContent = t;
      }
      const r = Math.random() * 10 - 5;
      b.style.setProperty('--r', `${r.toFixed(1)}deg`);
      b.style.setProperty('--r0', `${(r * 3).toFixed(1)}deg`);
      b.style.setProperty('--bc', COLORS[cIdx++ % COLORS.length]);
      const think = !narrow.matches && shown % 3 === 0;
      if (think) b.classList.add('think');
      if (narrow.matches) {
        b.style.setProperty('--ox', '15%');
        b.style.setProperty('--oy', '0%');
        mlist.prepend(b);
        while (mlist.children.length > 3) retire(mlist.lastElementChild as Element);
        return;
      }
      const s = SLOTS[slot++ % SLOTS.length];
      const [tailX, tailY, tailR, ox, oy] = TAIL[s.t];
      Object.assign(b.style, { left: `${s.x}%`, top: `${s.y}%` });
      b.style.setProperty('--tx', tailX);
      b.style.setProperty('--ty', tailY);
      b.style.setProperty('--tr', tailR);
      b.style.setProperty('--ox', ox);
      b.style.setProperty('--oy', oy);
      if (think) {
        // Thought-bubble circles trail toward the doll instead of a pointed tail
        const down = oy === '100%', up = oy === '0%', left = ox !== '85%' && ox !== '100%';
        const c1 = down ? [`calc(${ox} - 8px)`, 'calc(100% + 6px)'] : up ? [`calc(${ox} - 8px)`, '-24px'] : left ? ['-24px', 'calc(50% - 8px)'] : ['calc(100% + 6px)', 'calc(50% - 8px)'];
        const c2 = down ? [`calc(${ox} - 18px)`, 'calc(100% + 24px)'] : up ? [`calc(${ox} - 18px)`, '-40px'] : left ? ['-40px', 'calc(50% + 6px)'] : ['calc(100% + 24px)', 'calc(50% + 6px)'];
        b.style.setProperty('--cx1', c1[0]);
        b.style.setProperty('--cy1', c1[1]);
        b.style.setProperty('--cx2', c2[0]);
        b.style.setProperty('--cy2', c2[1]);
      }
      stage.appendChild(b);
      // Keep it inside the page: nudge a bubble that would run past either edge of the viewport.
      // Measured from layout (offsetLeft/Width), since the pop-in scale would skew a client rect.
      const left = stage.getBoundingClientRect().left + b.offsetLeft;
      const right = left + b.offsetWidth;
      const vw = document.documentElement.clientWidth;
      if (right > vw - 16) b.style.left = `${b.offsetLeft - (right - (vw - 16))}px`;
      else if (left < 16) b.style.left = `${b.offsetLeft + (16 - left)}px`;
      live.push(b);
      while (live.length > 4) retire(live.shift() as HTMLElement);
    };

    // ---------- open, the littlest one, and stacking back up ----------
    const settle = (next: number) => {
      [...dolls, ...hollows].forEach((d) => d.getAnimations({ subtree: true }).forEach((a) => a.cancel()));
      dolls.forEach((d, i) => { d.style.visibility = i === next ? '' : 'hidden'; });
      hollows.forEach((h) => { h.style.visibility = 'hidden'; });
      box.style.setProperty('--fs', String(DOLLS[next].size));
      level = next;
      meterDolls.forEach((d, i) => d.classList.toggle('is-on', i === next));
      meterName.textContent = LAYERS[next].name;
      busy = false;
      if (px >= 0 && !narrow.matches) look(px, py);
    };
    const open = () => {
      const cur = dolls[level], next = dolls[level + 1], hollow = hollows[level];
      speak();
      next.style.visibility = '';
      if (reduce.matches) { settle(level + 1); return; }
      busy = true;
      hollow.style.visibility = '';
      box.style.setProperty('--fs', String(DOLLS[level + 1].size));
      const tilt = Math.random() < 0.5 ? -1 : 1;
      const top = cur.querySelector('.md-top') as SVGGElement, bot = cur.querySelector('.md-bot') as SVGGElement;
      const at = (x: number, y: number, deg: number) => `translate(${x}px, ${y}px) rotate(${deg}deg)`;
      // Twist, twist, lift straight up to show the hollow inside, then it floats off
      top.animate([
        { transform: at(0, 0, 0), opacity: 1 },
        { transform: at(0, 0, -6 * tilt), opacity: 1, offset: 0.09 },
        { transform: at(0, 0, 5 * tilt), opacity: 1, offset: 0.18 },
        { transform: at(0, 0, 0), opacity: 1, offset: 0.26, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        { transform: at(0, -48, 0), opacity: 1, offset: 0.55, easing: 'ease-in' },
        { transform: at(0, -72, 0), opacity: 0 },
      ], { duration: 720, fill: 'both' });
      // The bottom half and its hollow settle down and fade as the next doll comes up
      const away = [
        { transform: at(0, 0, 0), opacity: 1 },
        { transform: at(0, 10, 0), opacity: 0 },
      ];
      const awayT: KeyframeAnimationOptions = { duration: 300, delay: 460, easing: 'ease-in', fill: 'both' };
      bot.animate(away, awayT);
      (hollow.firstElementChild as SVGGElement).animate(away, awayT);
      // The next doll rises out of the shell (the stack clips at the floor), with a small overshoot
      next.animate([
        { transform: 'translateY(34%)' },
        { transform: 'translateY(-5%)', offset: 0.7 },
        { transform: 'translateY(0)' },
      ], { duration: 520, delay: 440, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
      later(() => settle(level + 1), 920);
    };
    const littlest = () => {
      if (!reduce.matches) {
        dolls[level].animate([
          { transform: 'rotate(0deg)' }, { transform: 'rotate(-5deg)', offset: 0.25 },
          { transform: 'rotate(4deg)', offset: 0.55 }, { transform: 'rotate(-2deg)', offset: 0.8 }, { transform: 'rotate(0deg)' },
        ], { duration: 460, easing: 'ease-in-out' });
      }
      speak(true);
      label.textContent = 'Stack again!';
      buddy.setAttribute('aria-label', STACK_LABEL);
    };
    const restack = () => {
      settle(0);
      label.textContent = 'Open me!';
      buddy.setAttribute('aria-label', OPEN_LABEL);
      if (reduce.matches) return;
      busy = true;
      dolls[0].animate([
        { transform: 'translateY(-60px) scale(0.9)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 },
      ], { duration: 520, easing: 'cubic-bezier(0.34, 1.7, 0.64, 1)' });
      later(() => { busy = false; }, 400);
    };

    // ---------- the twist cursor: on a fine pointer over the dolls, a badge with a twist arrow
    // replaces the pointer; pressing turns it the way a hand twists a doll open. On the littlest
    // one, once she has spoken, it becomes a stack arrow.
    let cRaf = 0, cx = 0, cy = 0;
    const place = () => { cRaf = 0; cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; };
    const fineMouse = (e: PointerEvent) => e.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    listen(buddy, 'pointerenter', (e) => {
      if (!fineMouse(e)) return;
      cx = e.clientX; cy = e.clientY; place();
      buddy.classList.add('has-cursor'); cursor.classList.add('on');
    });
    listen(buddy, 'pointermove', (e) => {
      if (!fineMouse(e)) return;
      cx = e.clientX; cy = e.clientY;
      if (!cRaf) cRaf = requestAnimationFrame(place);
    }, { passive: true });
    listen(buddy, 'pointerleave', () => { buddy.classList.remove('has-cursor'); cursor.classList.remove('on', 'press'); });
    listen(buddy, 'pointerdown', () => cursor.classList.add('press'));
    listen(window, 'pointerup', () => cursor.classList.remove('press'));
    off.push(() => cancelAnimationFrame(cRaf));

    let spent = false;
    listen(buddy, 'click', () => {
      if (busy) return;
      if (spent) { spent = false; restack(); cursor.classList.remove('stack'); return; }
      if (level < LAST) open();
      else { spent = true; littlest(); cursor.classList.add('stack'); }
    });

    return () => {
      alive = false;
      off.forEach((fn) => fn());
      timers.forEach((id) => window.clearTimeout(id));
      [...dolls, ...hollows].forEach((d) => d.getAnimations({ subtree: true }).forEach((a) => a.cancel()));
      buddy.classList.remove('blink', 'has-cursor');
    };
  }, []);

  return (
    <div className="md-stage" ref={stageRef}>
      <button
        ref={buddyRef}
        className="md-buddy"
        type="button"
        aria-label={OPEN_LABEL}
        aria-describedby={`${uid}-said`}
      >
        <span className="md-dolls" ref={dollsRef}>
          {/* A khokhloma plate hangs behind the dolls and turns a little when you hover them */}
          {plate !== 'none' && <KhokhlomaPlate className="md-plate" plain={plate === 'plain'} />}
          <span className="md-floor" />
          <span className="md-stack" ref={stackRef}>
            {DOLLS.map((_, i) => <Doll key={i} i={i} uid={uid} calm={calm} />)}
            {DOLLS.slice(0, LAST).map((_, i) => <Hollow key={i} i={i} />)}
          </span>
        </span>
        {/* Where you are: the set, biggest to smallest, with the open one in colour, and its layer */}
        <span className="md-meter" aria-hidden="true" ref={meterRef}>
          <span className="md-meter-set">
            {LAYERS.map((l, i) => (
              <svg key={l.name} className={`md-meter-doll${i === 0 ? ' is-on' : ''}`} viewBox="0 0 200 260" style={{ height: `${28 - i * 3}px` }}>
                <path d={SHAPE} fill={l.color} stroke="var(--wf-ink)" strokeWidth="16" />
              </svg>
            ))}
          </span>
          <span className="md-meter-name">{LAYERS[0].name}</span>
        </span>
        <span className="md-label" aria-hidden="true" ref={labelRef}>Open me!</span>
      </button>
      <div className="md-list" ref={listRef} />
      <p className="sr-only" id={`${uid}-said`} ref={saidRef} aria-live="polite" />
      {/* The outer box only moves with the mouse; the badge inside does the showing and squeezing */}
      <div className="md-cursor" ref={cursorRef} aria-hidden="true">
        <span className="md-cursor-badge">
          <svg className="md-cursor-twist" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4.5h-4.5" /></svg>
          <svg className="md-cursor-stack" viewBox="0 0 24 24"><path d="M12 19V6m-5 5 5-5 5 5M6 22h12" /></svg>
        </span>
      </div>
    </div>
  );
}
