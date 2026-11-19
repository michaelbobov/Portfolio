import type { ReactNode } from 'react';
import Link from 'next/link';
import { PROJECTS, SIDE } from '@/app/data/projects';

// The work, straight under the hero: a row of torn-paper cards, each with its own picture (Codex-painted
// from his concept: the tooth, the pen, the red flower, the skill tree, public/postcard/card-*.webp), its
// name in the hero's serif, and where it stands. A card is the link to its case study; Intent OS has none
// yet, so it says so and isn't a link. Status and platform come from the project data.
type Card = { id: string; name: string; note: string; href?: string; art: { src: string; w: number; h: number }; dark?: boolean };

const p = (id: string) => PROJECTS.find((x) => x.id === id);
const st = SIDE.find((x) => x.id === 'skilltree');
const CARDS: Card[] = [
  { id: 'versum', name: 'Versum Health', note: `${p('versum')?.status} · ${p('versum')?.platform}`, href: '/work/versum', art: { src: '/postcard/card-versum.webp', w: 960, h: 537 } },
  { id: 'inkling', name: 'Inkling', note: `${p('inkling')?.status} · ${p('inkling')?.platform}`, href: '/work/inkling', art: { src: '/postcard/card-inkling.webp', w: 960, h: 498 }, dark: true },
  { id: 'intent-os', name: 'Intent OS', note: 'Case study soon', art: { src: '/postcard/card-intent.webp', w: 960, h: 515 } },
  { id: 'skilltree', name: 'SkillTree', note: `${st?.status} · VS Code`, href: st?.href, art: { src: '/postcard/card-skilltree.webp', w: 960, h: 410 }, dark: true },
];

export default function ProjectStrip({ children }: { children?: ReactNode }) {
  return (
    <section className="pc-strip" aria-labelledby="pc-strip-title">
      <h2 id="pc-strip-title" className="sr-only">Projects</h2>
      <ul className="pc-cards">
        {CARDS.map((c) => {
          const inner = (
            <>
              <img src={c.art.src} alt="" width={c.art.w} height={c.art.h} loading="lazy" decoding="async" />
              <span className="pc-card-words">
                <span className="pc-card-name">{c.name}{c.href && <span className="pc-card-arrow" aria-hidden="true"> ↗</span>}</span>
                <span className="pc-card-note">{c.note}</span>
              </span>
            </>
          );
          return (
            <li key={c.id} className={`pc-card is-${c.id}${c.dark ? ' is-dark' : ''}`}>
              {c.href ? <Link href={c.href} className="pc-card-in">{inner}</Link> : <div className="pc-card-in is-soon">{inner}</div>}
            </li>
          );
        })}
      </ul>
      {children}
    </section>
  );
}
