import { useId } from 'react';
import { SHAPE } from '@/app/data/layers';

// The player's doll in the Durak game (Durak.tsx): a matryoshka drawn flat on the same 200 × 260 outline
// as the homepage dolls, in a colour they pick, with a face window in the middle: a drawn face by
// default, their own photo from the camera, or (for the computer's seat) Michael, as on his doll.

export type Look = { color: string; face: string | null };
export const COLORS = [
  { id: 'gzhel', name: 'Gzhel blue', body: '#4d6cb0', scarf: '#6f8ccb', deep: '#1f3a7a' },
  { id: 'poppy', name: 'Poppy red', body: '#c8483c', scarf: '#e0685b', deep: '#7d211b' },
  { id: 'meadow', name: 'Meadow green', body: '#3f8a5e', scarf: '#5fae80', deep: '#1f5236' },
  { id: 'sun', name: 'Sunflower', body: '#dba22f', scarf: '#f0c25a', deep: '#8a5d0d' },
  { id: 'rose', name: 'Rose', body: '#d1769a', scarf: '#e79bb8', deep: '#84324f' },
  { id: 'plum', name: 'Plum', body: '#7a4a9e', scarf: '#9a6cc0', deep: '#43245f' },
  { id: 'snow', name: 'Snow', body: '#f1f4fa', scarf: '#d3def0', deep: '#3a5fb0' },
];
export const colorOf = (id: string) => COLORS.find((c) => c.id === id) ?? COLORS[0];

// Michael's cut-out photo and the circle of it that is his face (shares of its width), as on his doll
const ME = { src: '/me.webp', cx: 610 / 1254, cy: 560 / 1254, r: 315 / 1254 };
const FACE = { x: 100, y: 520 / 6, r: 29 };

const Flower = ({ y, fill, heart }: { y: number; fill: string; heart: string }) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      return <circle key={k} cx={(100 + Math.cos(a) * 12).toFixed(1)} cy={(y + Math.sin(a) * 12).toFixed(1)} r="8.5" fill={fill} />;
    })}
    <circle cx="100" cy={y} r="6.5" fill={heart} />
  </g>
);

export function DollAvatar({ look, michael = false, fool = false, className = '' }: { look: Look; michael?: boolean; fool?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  const c = colorOf(look.color);
  const light = c.id === 'snow';
  const { x, y, r } = FACE;
  const W = r / ME.r;
  return (
    <svg className={`dk-doll ${className}`} viewBox="0 0 200 260" aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <clipPath id={`${id}b`}><path d={SHAPE} /></clipPath>
        <clipPath id={`${id}f`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
      <ellipse cx="100" cy="254" rx="70" ry="7" fill="#0b1640" opacity="0.28" />
      <path d={SHAPE} fill={c.body} />
      <g clipPath={`url(#${id}b)`}>
        {/* the scarf, the apron, and a soft shine down the left */}
        <path d="M0 0H200V124C150 112 50 112 0 124Z" fill={c.scarf} />
        <path d="M0 150C60 160 140 160 200 150V260H0Z" fill={c.body} opacity="0.55" />
        <ellipse cx="100" cy="203" rx="44" ry="42" fill={light ? '#ffffff' : '#fbf9f4'} />
        <Flower y={203} fill={c.deep} heart={light ? '#9bb4de' : c.scarf} />
        <path d="M60 196C54 205 56 214 60 220M140 196C146 205 144 214 140 220" fill="none" stroke={c.deep} strokeWidth="1.6" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <circle key={k} cx={22 + k * 26} cy="238" r="2.6" fill={c.deep} opacity="0.7" />)}
        <ellipse cx="58" cy="100" rx="9" ry="46" fill="#fff" opacity="0.2" transform="rotate(8 58 100)" />
      </g>
      <path d={SHAPE} fill="none" stroke={c.deep} strokeWidth="2" strokeLinejoin="round" />
      {/* the face window: a porcelain band round it, then the face */}
      <circle cx={x} cy={y} r={r + 3.4} fill="#fbf9f4" stroke={c.deep} strokeWidth="0.9" />
      <circle cx={x} cy={y} r={r} fill={michael ? '#e9eef6' : '#f2c9a5'} />
      <g clipPath={`url(#${id}f)`}>
        {michael && <image href={ME.src} x={x - ME.cx * W} y={y - ME.cy * W} width={W} height={W} />}
        {!michael && look.face && <image href={look.face} x={x - r} y={y - r} width={r * 2} height={r * 2} preserveAspectRatio="xMidYMid slice" />}
        {!michael && !look.face && (
          <g>
            <path d="M70 88C68 64 84 56 100 56C116 56 132 64 130 88C124 76 112 70 100 70C88 70 76 76 70 88Z" fill="#7a4a2a" />
            <circle cx="90" cy="91" r="2.3" fill="#2b1d16" />
            <circle cx="110" cy="91" r="2.3" fill="#2b1d16" />
            <circle cx="84" cy="99" r="4.6" fill="#e58f86" opacity="0.5" />
            <circle cx="116" cy="99" r="4.6" fill="#e58f86" opacity="0.5" />
            <path d="M93 101Q100 107 107 101" fill="none" stroke="#9c4a3f" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}
      </g>
      {/* the fool's cap, with its bells */}
      {fool && (
        <g className="dk-cap">
          <path d="M58 44L34 2L80 26L100 -10L120 26L166 2L142 44Z" fill="#c23b30" stroke="#7d211b" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M56 44H144" stroke="#fbf9f4" strokeWidth="6" strokeLinecap="round" />
          {[[34, 2], [100, -10], [166, 2]].map(([bx, by]) => <circle key={bx} cx={bx} cy={by} r="6" fill="#f0c25a" stroke="#8a5d0d" strokeWidth="1.2" />)}
        </g>
      )}
    </svg>
  );
}
