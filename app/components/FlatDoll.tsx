import { SHAPE } from '@/app/data/layers';
import { DOLLS, FRINGE, GOLD, INK, SCARF } from '@/app/data/dolls';

// The flat (SVG) matryoshka: the homepage set before its 3D one is drawn (or without WebGL), the
// About page's doll, and the doll beside each section title. Plain markup, so it renders on the
// server and pulls in nothing else.

/** How long a flat doll stays hidden waiting for its 3D one (DollSet, AboutDoll) before it shows */
export const FLAT_AFTER = 1600;

// A five-petal folk flower in the doll's deepest tone
const Flower = ({ y, r, fill, heart }: { y: number; r: number; fill: string; heart: string }) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      return <circle key={k} cx={(100 + Math.cos(a) * r * 1.35).toFixed(1)} cy={(y + Math.sin(a) * r * 1.35).toFixed(1)} r={r} fill={fill} />;
    })}
    <circle cx="100" cy={y} r={r * 0.9} fill={heart} />
  </g>
);

// One doll, split at the waist into a top half that can lift and a bottom half that stays
// The waist is cut along the front half of an ellipse, the way you see the rim of a cup from a little
// above: the bottom half's top edge is that front lip, the lid's bottom edge matches it, and the
// opening behind it (DollInside) is a separate layer, so a doll coming out sits inside the cup.
const LIP = 'A70 11 0 0 0 170 150';
export function FlatDoll({ i, prefix, className = '', shadow = true }: { i: number; prefix: string; className?: string; shadow?: boolean }) {
  const { body, shade, scarf, apron, deep } = DOLLS[i];
  const id = `${prefix}-${i}`, solid = apron === null;
  return (
    <svg className={`ds-doll${solid ? ' is-solid' : ''} ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-t`}><path d="M-20 -40H220V150H170A70 11 0 0 1 30 150H-20Z" /></clipPath>
        <clipPath id={`${id}-b`}><path d={`M-20 150H30${LIP}H220V280H-20Z`} /></clipPath>
        {/* For the turn: the painted front stays inside the body, the face inside the headscarf */}
        <clipPath id={`${id}-s`}><path d={SHAPE} /></clipPath>
        <clipPath id={`${id}-h`}><path d={SCARF} /></clipPath>
      </defs>
      {shadow && <ellipse cx="100" cy="255" rx="66" ry="5" fill={INK} opacity=".45" />}
      <g className="ds-bot">
        <path d={SHAPE} fill={solid ? body : shade} clipPath={`url(#${id}-b)`} />
        {/* The front lip of the rim, catching the light */}
        {!solid && <path d={`M30 150${LIP}`} fill="none" stroke={body} strokeWidth="3" />}
        {/* The painted front (apron and flower): it travels round the body when the doll turns */}
        <g clipPath={`url(#${id}-s)`}>
          <g className="ds-front">
            {apron && <ellipse cx="100" cy="203" rx="44" ry="42" fill={apron} />}
            <Flower y={solid ? 196 : 203} r={solid ? 9 : 11} fill={deep} heart={GOLD} />
          </g>
        </g>
        <path d="M30 222c-3-14 0-28 8-40" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g className="ds-top">
        <path d={SHAPE} fill={body} clipPath={`url(#${id}-t)`} />
        <path d={SCARF} fill={scarf} />
        {/* The face: it travels round the head with the front, leaving the back of the scarf */}
        <g clipPath={`url(#${id}-h)`}>
          <g className="ds-face">
            <ellipse cx="100" cy="86" rx="29" ry="32" fill="#fff8f2" />
            <path d={FRINGE} fill={deep} />
            <circle cx="90" cy="88" r="3.4" fill={INK} />
            <circle cx="110" cy="88" r="3.4" fill={INK} />
            <circle cx="84" cy="100" r="5" fill="#ff9fc4" opacity=".6" />
            <circle cx="116" cy="100" r="5" fill="#ff9fc4" opacity=".6" />
          </g>
        </g>
        <path d="M58 46c8-15 20-24 34-28" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// The inside of a doll's bottom half: the rim seen from above and the dark opening. It is its own
// layer, behind the doll that sits inside and in front of nothing, so that doll is in the cup.
export function DollInside({ i, className = '' }: { i: number; className?: string }) {
  const { body, deep } = DOLLS[i];
  return (
    <svg className={`ds-in ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="150" rx="69" ry="11" fill={body} />
      <ellipse cx="100" cy="151" rx="61" ry="8.5" fill={deep} />
    </svg>
  );
}
