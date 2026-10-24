import { useId } from 'react';

// Khokhloma, the Russian folk painting of the family mugs: gold stems curling out of grass strokes,
// gold and red leaves, clusters of red berries with a gold glint. Painted here as a round plate on
// deep grape instead of black lacquer, so it belongs to the site, with a grape and gold rim.
const GOLD = '#f5b82e', BERRY = '#e0362c', GROUND = '#2a1764', GRAPE = '#6a35e8';

const Leaf = ({ x, y, r, s = 1, fill = GOLD }: { x: number; y: number; r: number; s?: number; fill?: string }) => (
  <path d="M0 0C6-11 20-14 28-7 20 1 9 5 0 0Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={fill} />
);
const Berries = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {[[0, 0], [11, -4], [9, 8], [20, 4], [3, 11]].map(([cx, cy]) => (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r="6" fill={BERRY} />
        <circle cx={cx - 2} cy={cy - 2} r="1.6" fill={GOLD} />
      </g>
    ))}
  </g>
);
const Sprig = ({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-40 30C-20 30-10 10 0 0S20-30 40-26C52-24 54-12 46-8" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M-30 30q-6-10 2-16M-46 26q-10-2-10-12M-36 32q2 10-6 14" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
    <Leaf x={-28} y={28} r={-160} />
    <Leaf x={-12} y={16} r={-70} s={0.9} />
    <Leaf x={-4} y={4} r={150} s={0.8} fill={BERRY} />
    <Leaf x={10} y={-14} r={-80} s={0.85} />
    <Leaf x={20} y={-24} r={170} s={0.8} />
    <Berries x={44} y={-6} />
  </g>
);

// plain: the same plate with an unpainted ground, rim only
export default function KhokhlomaPlate({ className, plain = false }: { className?: string; plain?: boolean }) {
  const id = `kh${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg className={className} viewBox="0 0 420 420" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="200" height="200" patternUnits="userSpaceOnUse" x="10" y="10">
          <rect width="200" height="200" fill={GROUND} />
          <Sprig x={60} y={70} />
          <Sprig x={150} y={150} r={180} s={0.9} />
          <circle cx="132" cy="38" r="2.4" fill={GOLD} />
          <circle cx="22" cy="164" r="2.4" fill={GOLD} />
          <circle cx="100" cy="118" r="2.4" fill={GOLD} />
        </pattern>
      </defs>
      <circle cx="210" cy="210" r="206" fill={GRAPE} stroke="var(--wf-ink)" strokeWidth="5" />
      <circle cx="210" cy="210" r="192" fill={GOLD} />
      <circle cx="210" cy="210" r="186" fill={plain ? GROUND : `url(#${id})`} />
      <circle cx="210" cy="210" r="172" fill="none" stroke={GOLD} strokeWidth="2.5" />
      <path d="M78 110A150 150 0 0 1 150 52" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}
