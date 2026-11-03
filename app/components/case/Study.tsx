import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteBar } from '@/app/components/Site';
import { ArrowLeft, ArrowRight } from '@/app/components/icons';
import Zoom, { type Pic } from '@/app/components/case/StudyZoom';

// Building blocks for the Versum and Spotify Loop case studies (Inkling still uses Case.tsx), laid out
// like a well-made article. A centered header (name, one line, the facts), the work in motion, then
// numbered sections in one centered reading column. Pictures break out wider than the text; design
// decisions alternate picture and text; the page ends on a card for the next project, with its picture.
// Pictures open larger in place. One typeface, Geist. Styles: app/work/study.css.

export type Status = 'LIVE' | 'LIVE MVP' | 'PRE-LAUNCH' | 'CONCEPT';

type StudyPic = Pic & { caption?: ReactNode };

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
}: {
  name: string;
  subtitle: string;
  facts: { label: string; value: ReactNode }[];
  status: Status;
  link?: { href: string; label: string };
  /** Small print under the facts */
  note?: ReactNode;
  media: ReactNode;
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
      <div className="st-frame st-motion st-hero">{media}</div>
    </header>
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
// side; several wide screens stacked
function Pics({ pics }: { pics: StudyPic[] }) {
  const many = pics.length > 1;
  const stack = many && pics.every((p) => p.width / p.height > 1.3);
  return (
    <div className={`st-pics${stack ? ' is-stack' : many ? ' is-many' : ''}`}>
      {pics.map((p) => (
        <figure key={p.src}>
          <Zoom img={p} sizes={many && !stack ? '(min-width: 900px) 330px, 50vw' : '(min-width: 1180px) 1120px, 100vw'} fit={many && !stack ? undefined : 620} />
          {p.caption && <figcaption className="st-caption">{p.caption}</figcaption>}
        </figure>
      ))}
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

// A design decision, numbered. With a screen, the screen and the text sit side by side, alternating
// sides from one decision to the next; without one, the text sits in the reading column.
export function Choice({ n, title, shots, media, caption, children }: { n: number; title: string; shots?: { img: Pic; phone?: boolean }[]; media?: ReactNode; caption?: ReactNode; children: ReactNode }) {
  const phones = shots?.some((x) => x.phone);
  const heading = (
    <h3 className="st-h3">
      <span className="st-n">{n}.</span> {title}
    </h3>
  );
  if (!media && !shots?.length) {
    return (
      <div className="st-choice st-text">
        {heading}
        <div className="st-prose">{children}</div>
      </div>
    );
  }
  return (
    <div className={`st-choice is-split${n % 2 === 0 ? ' is-flip' : ''}`}>
      <div className="st-choice-copy">
        {heading}
        <div className="st-prose">{children}</div>
      </div>
      <figure className={`st-media${phones ? ' is-phones' : ''}`}>
        <div className="st-shots">
          {media ? <div className="st-frame st-motion st-motion-natural">{media}</div> : shots?.map((x) => <Zoom key={x.img.src} img={x.img} sizes={phones ? '(min-width: 900px) 260px, 45vw' : '(min-width: 900px) 620px, 100vw'} fit={phones ? 460 : 540} />)}
        </div>
        {caption && <figcaption className="st-caption">{caption}</figcaption>}
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

// Page shell: the shared bar, then the article (the skip link's target)
export function CaseShell({ children }: { children: ReactNode }) {
  return (
    <main className="st">
      <SiteBar />
      <article id="main-content" tabIndex={-1} className="site-wrap focus:outline-none">
        {children}
      </article>
    </main>
  );
}
