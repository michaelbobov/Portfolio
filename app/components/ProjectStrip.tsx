import type { ReactNode } from 'react';
import Link from 'next/link';
import { PROJECTS, SIDE } from '@/app/data/projects';

// The work, straight under the hero: a row of torn-paper cards, each with its own picture (Codex-painted
// from his concept: the tooth, the pen, the red flower, the skill tree, public/postcard/card-*.webp), its
// name in the hero's serif, and where it stands. A card is the link to its case study; Intent OS has none
// yet, so it says so and isn't a link. Status and platform come from the project data. The Projects page
// (/work) lays the same pictures (ART) out bigger.
export type Art = { src: string; w: number; h: number };
export const ART: Record<string, Art> = {
  versum: { src: '/postcard/card-versum.webp', w: 960, h: 537 },
  inkling: { src: '/postcard/card-inkling.webp', w: 960, h: 498 },
  'intent-os': { src: '/postcard/card-intent.webp', w: 960, h: 515 },
  skilltree: { src: '/postcard/card-skilltree.webp', w: 960, h: 410 },
};

export type Card = { id: string; name: string; note: string; href?: string; dark?: boolean };

const p = (id: string) => PROJECTS.find((x) => x.id === id);
const st = SIDE.find((x) => x.id === 'skilltree');
export const CARDS: Record<string, Card> = {
  versum: { id: 'versum', name: 'Versum Health', note: `${p('versum')?.status} · ${p('versum')?.platform}`, href: '/work/versum' },
  inkling: { id: 'inkling', name: 'Inkling', note: `${p('inkling')?.status} · ${p('inkling')?.platform}`, href: '/work/inkling', dark: true },
  'intent-os': { id: 'intent-os', name: 'Intent OS', note: 'Case study soon' },
  skilltree: { id: 'skilltree', name: 'SkillTree', note: `${st?.status} · VS Code`, href: st?.href, dark: true },
};
const HOME = ['versum', 'inkling', 'intent-os', 'skilltree'];

/** One torn-paper card: its picture, its name typeset on the blank half, and where it stands */
export function PaperCard({ c }: { c: Card }) {
  const art = ART[c.id];
  const inner = (
    <>
      <img src={art.src} alt="" width={art.w} height={art.h} loading="lazy" decoding="async" />
      <span className="pc-card-words">
        <span className="pc-card-name">{c.name}{c.href && <span className="pc-card-arrow" aria-hidden="true"> ↗</span>}</span>
        <span className="pc-card-note">{c.note}</span>
      </span>
    </>
  );
  return (
    <li className={`pc-card is-${c.id}${c.dark ? ' is-dark' : ''}`}>
      {c.href ? <Link href={c.href} className="pc-card-in">{inner}</Link> : <div className="pc-card-in is-soon">{inner}</div>}
    </li>
  );
}

export default function ProjectStrip({ children }: { children?: ReactNode }) {
  return (
    <section className="pc-strip" aria-labelledby="pc-strip-title">
      <h2 id="pc-strip-title" className="pc-strip-title">Selected projects</h2>
      <ul className="pc-cards">
        {HOME.map((id) => <PaperCard key={id} c={CARDS[id]} />)}
      </ul>
      {children}
    </section>
  );
}
