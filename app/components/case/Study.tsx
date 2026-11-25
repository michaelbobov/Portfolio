import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OsFrame from '@/app/components/OsFrame';
import { ArrowLeft, ArrowRight } from '@/app/components/icons';
import Zoom, { type Pic } from '@/app/components/case/StudyZoom';
import { ReadFull, VersionSwitch } from '@/app/components/case/Versions';

// Building blocks for the Versum, Inkling and Spotify Loop case studies, laid out like a well-made
// article. A centered header (name, one line, the facts), the work in motion, then
// numbered sections in one centered reading column. Pictures break out wider than the text; design
// decisions alternate picture and text; the page ends on a card for the next project, with its picture.
// Pictures open larger in place. Each comes in two lengths (Versions.tsx): a short version on one screen,
// and the full case study. One typeface, Geist. Styles: app/work/study.css.

export type Status = 'LIVE' | 'LIVE MVP' | 'PRE-LAUNCH' | 'CONCEPT';

// `size` caps a small piece of UI (a popup, a notification) at about its real width in CSS pixels,
// so it isn't blown up to the width of the column
type StudyPic = Pic & { caption?: ReactNode; size?: number };

// How each status reads on the page
const STATUS: Record<Status, { label: string; tone: 'live' | 'pre' | 'concept' }> = {
  LIVE: { label: 'Live', tone: 'live' },
  'LIVE MVP': { label: 'Live MVP', tone: 'live' },
  'PRE-LAUNCH': { label: 'Pre-launch', tone: 'pre' },
  CONCEPT: { label: 'Concept', tone: 'concept' },
};

// The top of a case study: the name, what it is in one line, the facts, then the work in motion
export function CaseHeader({
  name,
  subtitle,
  facts,
  status,
  link,
  note,
  media,
  versions,
}: {
  name: string;
  subtitle: string;
  facts: { label: string; value: ReactNode }[];
  status: Status;
  link?: { href: string; label: string };
  /** Small print under the facts */
  note?: ReactNode;
  media: ReactNode;
  /** The switch between the short version and the full case study, above the hero (inside Versions) */
  versions?: boolean;
}) {
  const { label, tone } = STATUS[status];
  return (
    <header className="st-head">
      <h1 className="st-title">{name}</h1>
      <p className="st-subtitle">{subtitle}</p>
      <dl className="st-meta">
        {facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
        <div>
          <dt>Status</dt>
          <dd><span className={`st-chip st-chip-${tone}`}>{label}</span></dd>
        </div>
        {link && (
          <div>
            <dt>Website</dt>
            <dd>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </dd>
          </div>
        )}
      </dl>
      {note && <p className="st-note">{note}</p>}
      {versions && <VersionSwitch />}
      <div className="st-frame st-motion st-hero">{media}</div>
    </header>
  );
}

// The short version: the whole case study on one screen, each line taken from the full one. The problem,
// what I did, the design decisions by name, where it stands, and what I learned; then the way into the
// full case study.
export function ShortVersion({ problem, did, decisions, stands, learned }: { problem: ReactNode; did: ReactNode; decisions: string[]; stands: ReactNode; learned?: ReactNode }) {
  const row = (label: string, body: ReactNode) => (
    <div>
      <dt>{label}</dt>
      <dd>{body}</dd>
    </div>
  );
  return (
    <section className="st-short st-text" aria-labelledby="st-short-title">
      <h2 id="st-short-title" className="sr-only">The short version</h2>
      <dl className="st-short-list">
        {row('The problem', problem)}
        {row('What I did', did)}
        {row('Decisions', <ol className="st-short-decisions">{decisions.map((d) => <li key={d}>{d}</li>)}</ol>)}
        {row('Where it stands', stands)}
        {learned && row('What I learned', learned)}
      </dl>
      <ReadFull />
    </section>
  );
}

// A numbered section with a plain heading
export function Section({ n, id, title, children }: { n: number; id: string; title: string; children: ReactNode }) {
  return (
    <section className="st-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="st-h2 st-text">
        <span className="st-num" aria-hidden="true">{String(n).padStart(2, '0')}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Running text in the reading column: short paragraphs, and the odd list
export function Prose({ children }: { children: ReactNode }) {
  return <div className="st-prose st-text">{children}</div>;
}

export function Quote({ text, who }: { text: string; who: string }) {
  return (
    <figure className="st-quote st-text">
      <blockquote>“{text}”</blockquote>
      <figcaption>{who}</figcaption>
    </figure>
  );
}

// Pictures under a block of text, wider than the text: one, centered; several square-ish ones side by
// side; two wide screens side by side (they open larger on a click), so a pair costs one row of height;
// other sets of wide screens stacked. A stacked screen is capped at 620px tall like a single one; the
// cap goes on its figure, so the screen and its caption stay centered together.
function Pics({ pics }: { pics: StudyPic[] }) {
  const many = pics.length > 1;
  const wide = many && pics.every((p) => p.width / p.height > 1.3);
  const pair = wide && pics.length === 2 && !pics.some((p) => p.size);
  const stack = wide && !pair;
  const sizes = pair ? '(min-width: 1180px) 550px, (min-width: 800px) 48vw, 100vw' : many && !stack ? '(min-width: 900px) 330px, 50vw' : '(min-width: 1180px) 1120px, 100vw';
  return (
    <div className={`st-pics${pair ? ' is-pair' : stack ? ' is-stack' : many ? ' is-many' : ''}`}>
      {pics.map((p) => {
        const width = p.size ?? (stack ? Math.round((620 * p.width) / p.height) : undefined);
        return (
          <figure key={p.src} style={width ? { width: `min(100%, ${width}px)` } : undefined}>
            <Zoom img={p} sizes={p.size ? `${p.size}px` : sizes} fit={width || many ? undefined : 620} />
            {p.caption && <figcaption className="st-caption">{p.caption}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="st-steps">{children}</div>;
}

// One step of the process: what I did and what came of it, then its artifact
export function Step({ title, pics, flows, children }: { title: string; pics?: StudyPic[]; flows?: { who: string; steps: string[] }[]; children: ReactNode }) {
  return (
    <div className="st-step">
      <h3 className="st-h3 st-text">{title}</h3>
      <Prose>{children}</Prose>
      {flows && (
        <div className="st-flows st-text">
          {flows.map((f) => (
            <p key={f.who}><span>{f.who}</span> {f.steps.join(' → ')}</p>
          ))}
        </div>
      )}
      {pics && <Pics pics={pics} />}
    </div>
  );
}

export function Choices({ children }: { children: ReactNode }) {
  return <div className="st-choices">{children}</div>;
}

// A design decision, numbered. A recording or screens sit beside the text, alternating sides from one
// decision to the next, so each decision takes about one screen of height. Without either, the text
// sits in the reading column.
export function Choice({ n, title, shots, media, caption, children }: { n: number; title: string; shots?: { img: Pic; phone?: boolean }[]; media?: ReactNode; caption?: ReactNode; children: ReactNode }) {
  const phones = shots?.some((x) => x.phone);
  const heading = (
    <h3 className="st-h3">
      <span className="st-n">{n}.</span> {title}
    </h3>
  );
  const figcaption = caption && <figcaption className="st-caption">{caption}</figcaption>;
  const side = `st-choice is-split${n % 2 === 0 ? ' is-flip' : ''}`;
  if (media) {
    return (
      <div className={side}>
        <div className="st-choice-copy">
          {heading}
          <div className="st-prose">{children}</div>
        </div>
        <figure className="st-media">
          <div className="st-frame st-motion st-motion-natural">{media}</div>
          {figcaption}
        </figure>
      </div>
    );
  }
  if (!shots?.length) {
    return (
      <div className="st-choice st-text">
        {heading}
        <div className="st-prose">{children}</div>
      </div>
    );
  }
  return (
    <div className={side}>
      <div className="st-choice-copy">
        {heading}
        <div className="st-prose">{children}</div>
      </div>
      <figure className={`st-media${phones ? ' is-phones' : ''}`}>
        <div className="st-shots">
          {shots.map((x) => <Zoom key={x.img.src} img={x.img} sizes={phones ? '(min-width: 900px) 260px, 45vw' : '(min-width: 900px) 620px, 100vw'} fit={phones ? 460 : 540} />)}
        </div>
        {figcaption}
      </figure>
    </div>
  );
}

// Where it stands: what shipped (or was made), what I'll measure, what's next, and what I learned
export function Outcome({ n, shipped, shippedLabel = 'What shipped', measure, next, learned }: { n: number; shipped: ReactNode[]; shippedLabel?: string; measure?: ReactNode[]; next: ReactNode[]; learned: ReactNode }) {
  const group = (label: string, items: ReactNode[]) => (
    <div>
      <h3 className="st-h3">{label}</h3>
      <ul className="st-list">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
  return (
    <Section n={n} id="outcome" title="Outcome">
      <div className="st-outcome st-text">
        {group(shippedLabel, shipped)}
        {measure && group('What I’ll measure', measure)}
        {group('Next steps', next)}
      </div>
      <div className="st-learned st-text">
        <h3 className="st-h3">What I learned</h3>
        <p>{learned}</p>
      </div>
    </Section>
  );
}

// The close: a card for the next project, with its picture
export function NextCase({ href, name, line, img }: { href: string; name: string; line: string; img: { src: string; width: number; height: number } }) {
  return (
    <nav className="st-next" aria-label="Next case study">
      <Link href={href} className="st-next-card">
        <span className="st-next-copy">
          <span className="st-next-label">Next project</span>
          <span className="st-next-name">{name}</span>
          <span className="st-next-line">{line}</span>
          <span className="st-next-cta">
            View case study
            <ArrowRight size={16} strokeWidth={2} />
          </span>
        </span>
        <span className="st-next-pic">
          <Image src={img.src} alt="" fill sizes="(min-width: 900px) 650px, 100vw" quality={85} />
        </span>
      </Link>
      <Link href="/work" className="st-allwork">
        <ArrowLeft size={15} />
        All work
      </Link>
    </nav>
  );
}

// Page shell: MichaelOS's frame (its menu bar, and the sky under it: OsFrame), then the article (the skip
// link's target)
export function CaseShell({ children }: { children: ReactNode }) {
  return (
    <main className="st os-frame">
      <OsFrame current="/work" />
      <article id="main-content" tabIndex={-1} className="site-wrap focus:outline-none">
        {children}
      </article>
    </main>
  );
}
