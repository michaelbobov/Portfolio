import type { Metadata } from 'next';
import Link from 'next/link';
import ClickCard from '@/app/components/ClickCard';
import PostcardBar from '@/app/components/PostcardBar';
import PostcardClose from '@/app/components/PostcardClose';
import ProjectTile, { type Tile } from '@/app/components/ProjectTile';
import { PROJECTS, SIDE, type Project } from '@/app/data/projects';
import '../hp.css';
import '../postcard.css';
import './projects.css';

// Projects, behind the biggest doll: the quiet page after the expressive homepage. A nearly empty hero; the
// four projects with something real to show, two by two, each led by its own poster or screenshot in full
// colour (the work gives the page its colour), crossfading into its muted overview loop when you point at
// it (ProjectTile); then the rest as ruled rows, each with a small one-ink print. Every fact comes from the
// project data (data/projects.ts); what has no case study yet says so.
export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work by Michael Bobov: Versum Health, a healthcare marketplace he co-founded; Inkling, a Mac app; the Spotify Loop concept; SkillTree, a VS Code extension; and smaller projects.',
  alternates: { canonical: '/work' },
};

const proj = (id: string) => PROJECTS.find((p) => p.id === id) as Project;
const side = (id: string) => SIDE.find((s) => s.id === id)!;
// (what the product does: its summary up to the colon, where it starts listing)
const firstPart = (s: string) => { const t = s.split(':')[0].trim(); return /[.!?]$/.test(t) ? t : `${t}.`; };

// (each cover is the first frame of the project's overview recording, at 2:1: only empty backdrop is trimmed)
const COVER: Record<string, { alt: string; position?: string }> = {
  versum: { alt: 'Versum Health’s homepage: “Creating Universal Access to Free Healthcare”, with Get Free Care and Provide Care buttons.' },
  inkling: { alt: 'Inkling: “lunch w maya fri 1230, bring her book back”, typed once and filed as a calendar event and a reminder. One thought, two items.', position: '30% 50%' },
  'spotify-loop': { alt: 'Spotify Loop in the player: Mas Que Nada, with the part that repeats marked in green on the progress bar.' },
};
// (a shorter line where the summary is long, in its own words: Inkling's names what a thought is filed as)
const LINE: Record<string, string> = {
  inkling: 'A Mac app that files a thought the way you’d text it to yourself: as an event, a to-do, an idea to develop or a note to keep.',
};
const study = (id: string): Tile => {
  const p = proj(id);
  return {
    id, name: p.name, href: p.link, meta: `${p.status} · ${p.platform} · ${p.year}`, line: LINE[id] ?? firstPart(p.summary), role: p.meta,
    cover: { src: `/projects/poster-${id}.webp`, ...COVER[id] },
    video: { src: p.motion.src, label: p.motion.label },
  };
};
const st = side('skilltree');
const TILES: Tile[] = [
  study('versum'),
  study('inkling'),
  study('spotify-loop'),
  {
    id: 'skilltree', name: st.name, href: st.href!, meta: `${st.status} · VS Code`, line: `${st.line.split(', with')[0]}.`, role: st.fact!,
    cover: { src: '/projects/shot-skilltree.webp', alt: st.shots[0].alt, position: '50% 0%' },
  },
];

type Row = { id: string; name: string; note: string; line?: string; href?: string; external?: boolean; art?: string };
const ez = side('ez-recipe'), ab = side('about-site');
const MORE: Row[] = [
  { id: 'intent-os', name: 'Intent OS', note: 'Case study soon', art: '/projects/thumb-intent.webp' },
  { id: 'orbit', name: 'Orbit', note: 'Case study soon', art: '/projects/thumb-orbit.webp' },
  { id: 'ez-recipe', name: ez.name, note: `${ez.status} · ${ez.tag}`, line: firstPart(ez.line), href: ez.href, external: true, art: '/projects/thumb-ezrecipe.webp' },
  { id: 'about-site', name: ab.name, note: ab.tag, line: `${ab.line.split(', a retro')[0]}.`, href: ab.href, external: true, art: '/projects/thumb-about-site.webp' },
];

export default function ProjectsPage() {
  return (
    <div className="hp pc pc-inner">
      <PostcardBar current="/work" />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="pj-title">
        <header className="pj-hero">
          <h1 id="pj-title" className="pj-title">Selected Work</h1>
          <p className="pj-sub">Product design, interactive systems, and experiments.</p>
        </header>

        <ul className="pt-grid">
          {TILES.map((t, i) => <li key={t.id} id={t.id}><ProjectTile t={t} eager={i < 2} /></li>)}
        </ul>

        <section className="pj-more" aria-labelledby="pj-more-title">
          <h2 id="pj-more-title" className="pj-more-title">More work</h2>
          <ul className="pr-list">
            {MORE.map((s) => (
              <li key={s.id} className={`pr${s.href ? '' : ' is-soon'}`}>
                <ClickCard className="pr-in">
                  <span className="pr-art" aria-hidden="true">{s.art && <img src={s.art} alt="" width={720} height={480} loading="lazy" decoding="async" />}</span>
                  <div className="pr-words">
                    <h3 className="pr-name">
                      {!s.href ? s.name : s.external
                        ? <a href={s.href} target="_blank" rel="noopener noreferrer" data-main="">{s.name}<span className="sr-only"> (opens in a new tab)</span></a>
                        : <Link href={s.href} data-main="">{s.name}</Link>}
                    </h3>
                    {s.line && <p className="pr-line">{s.line}</p>}
                  </div>
                  <p className="pr-note">{s.note}</p>
                  <span className="pr-arrow" aria-hidden="true">{s.href ? '↗' : ''}</span>
                </ClickCard>
              </li>
            ))}
          </ul>
          <p className="pj-side">More of what I build on the side is in <Link href="/side-projects">Play</Link>.</p>
        </section>
      </main>
      <PostcardClose />
    </div>
  );
}
