import { cardName, rankName, suitMark, type Card } from '@/app/data/durak';

// The Durak game's cards (Durak.tsx and its help): porcelain faces with cobalt pips (red for hearts and
// diamonds); face down, the Gzhel flower.

export const RED = new Set(['H', 'D']);

export const Flower = () => (
  <svg viewBox="0 0 50 70" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="42" height="62" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M25 9 L42 35 L25 61 L8 35 Z" fill="none" stroke="currentColor" strokeWidth="1" />
    {[0, 1, 2, 3, 4].map((k) => {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      return <circle key={k} cx={25 + Math.cos(a) * 5.4} cy={35 + Math.sin(a) * 5.4} r="3.6" fill="currentColor" />;
    })}
    <circle cx="25" cy="35" r="2.4" fill="var(--dk-cobalt)" />
    <path d="M25 14 c-5 4 -5 9 0 12 c5 -3 5 -8 0 -12 Z M25 44 c-5 3 -5 8 0 12 c5 -4 5 -9 0 -12 Z" fill="currentColor" />
  </svg>
);

export function PlayingCard({ c, down = false, className = '' }: { c?: Card; down?: boolean; className?: string }) {
  if (down || !c) return <span className={`dk-card is-down ${className}`} aria-hidden="true"><Flower /></span>;
  return (
    <span className={`dk-card${RED.has(c.s) ? ' is-red' : ''} ${className}`} data-cid={c.id}>
      <span className="dk-corner" aria-hidden="true">{rankName(c.r)}<br />{suitMark[c.s]}</span>
      <span className="dk-pip" aria-hidden="true">{suitMark[c.s]}</span>
      <span className="sr-only">{cardName(c)}</span>
    </span>
  );
}
