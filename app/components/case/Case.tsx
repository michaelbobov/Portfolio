import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullSizeLink from '@/app/components/FullSizeLink';
import { SiteBar } from '@/app/components/Site';
import { ArrowLeft, ArrowRight } from '@/app/components/icons';

// Building blocks for the case-study pages. Every block sits on one grid: a narrow left margin for
// small labels and a single content column, so the page has one strong line running down it. Everything
// reads straight down; nothing scrolls sideways, and there are no cards. Styles: app/work/case.css.

export type Status = 'LIVE' | 'LIVE MVP' | 'PRE-LAUNCH' | 'CONCEPT';

type Img = { src: string; alt: string; width: number; height: number };
type Pic = Img & { /** object-position, for a crop */ position?: string };

// A picture that opens at full size, with no visible label
function Zoom({ img, className = '', sizes }: { img: Pic; className?: string; sizes: string }) {
  return (
    <a className={`cs-zoom ${className}`} href={encodeURI(img.src)} target="_blank" rel="noopener noreferrer">
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} quality={90} style={img.position ? { objectPosition: img.position } : undefined} />
      <span className="sr-only"> (opens full size in a new tab)</span>
    </a>
  );
}

// The top of a case study: one quiet line, then the work itself
export function CaseHero({ name, year, link, media }: { name: string; year: string; link?: { href: string; label: string }; media: ReactNode }) {
  return (
    <header className="cs-hero cs-col">
      <p className="cs-line">
        <span>{name}</span>
        <span>({year})</span>
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </p>
      <div className="cs-frame cs-motion">{media}</div>
    </header>
  );
}

// How each status reads on the page
const STATUS: Record<Status, { label: string; tone: 'live' | 'pre' | 'concept' }> = {
  LIVE: { label: 'Live', tone: 'live' },
  'LIVE MVP': { label: 'Live MVP', tone: 'live' },
  'PRE-LAUNCH': { label: 'Pre-launch', tone: 'pre' },
  CONCEPT: { label: 'Concept', tone: 'concept' },
};

// The claim and the short version in the column, the facts in the margin beside them
export function Glance({
  name,
  claim,
  summary,
  facts,
  status,
  note,
  problem,
  did,
  outcome,
}: {
  name: string;
  claim: string;
  summary: string;
  facts: { label: string; value: ReactNode }[];
  status: Status;
  /** Small print under the facts */
  note?: ReactNode;
  problem: ReactNode;
  did: ReactNode;
  outcome: ReactNode;
}) {
  const { label, tone } = STATUS[status];
  return (
    <section className="cs-glance cs-col" aria-labelledby="glance-title">
      <div className="cs-glance-head">
        <h1 id="glance-title" className="cs-claim">
          <span className="sr-only">{name}: </span>
          {claim}
        </h1>
        <p className="cs-summary">{summary}</p>
      </div>
      <div className="cs-glance-rail">
        <dl className="cs-facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div>
            <dt>Status</dt>
            <dd><span className={`cs-chip cs-chip-${tone}`}>{label}</span></dd>
          </div>
        </dl>
        {note && <p className="cs-note">{note}</p>}
      </div>
      <dl className="cs-story">
        <div><dt>The problem</dt><dd>{problem}</dd></div>
        <div><dt>What I did</dt><dd>{did}</dd></div>
        <div><dt>The outcome</dt><dd>{outcome}</dd></div>
      </dl>
    </section>
  );
}

// A section: its label in the margin, its one sentence in the column
export function Section({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="cs-section cs-col" id={id} aria-labelledby={`${id}-title`}>
      <div className="cs-row">
        <p className="cs-label" aria-hidden="true">{label}</p>
        <h2 id={`${id}-title`} className="cs-h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

type Step = {
  name: string;
  did: ReactNode;
  /** What came out of it, marked in gold */
  found?: ReactNode;
  /** The step's artifact: pictures (each opens full size), a quote, or the flows as text */
  pics?: Pic[];
  quote?: { text: string; who: string };
  flows?: { who: string; steps: string[] }[];
};

// The process, as a list: each step's name in the margin, what I did and found, and its artifact
export function Process({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <Section id="process" label="Process" title={title}>
      <ol className="cs-steps">
        {steps.map((st) => (
          <li key={st.name} className="cs-row">
            <h3 className="cs-step-name">{st.name}</h3>
            <div className="cs-step-body">
              <div>
                {st.quote && (
                  <figure className="cs-step-quote">
                    <blockquote>“{st.quote.text}”</blockquote>
                    <figcaption>{st.quote.who}</figcaption>
                  </figure>
                )}
                <p className="cs-step-did">{st.did}</p>
                {st.flows?.map((f) => (
                  <p key={f.who} className="cs-step-flow"><span>{f.who}</span> {f.steps.join(' → ')}</p>
                ))}
                {st.found && <p className="cs-step-found">{st.found}</p>}
              </div>
              {st.pics && (
                <div className="cs-step-pics">
                  {st.pics.map((p) => <Zoom key={p.src} img={p} sizes="(min-width: 768px) 220px, 90vw" />)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// A key decision: the decision and why in the margin, the screen it produced in the column (or a motion
// piece, via `media`). Without either, the why takes the column instead.
export function Choice({ n, title, why, shots, media, caption }: { n: number; title: string; why: ReactNode; shots?: { img: Pic; phone?: boolean }[]; media?: ReactNode; caption?: ReactNode }) {
  const phones = shots?.some((x) => x.phone);
  const heading = (
    <h3 className="cs-choice-title">
      <span className="sr-only">Decision {n}: </span>
      {title}
    </h3>
  );
  if (!shots?.length && !media) {
    return (
      <div className="cs-row cs-choice">
        {heading}
        <p className="cs-choice-why is-main">{why}</p>
      </div>
    );
  }
  return (
    <div className="cs-row cs-choice">
      <div>
        {heading}
        <p className="cs-choice-why">{why}</p>
      </div>
      <figure className={`cs-choice-media${phones ? ' is-phones' : ''}`}>
        <div className="cs-choice-shots">
          {media ? <div className="cs-frame cs-motion cs-motion-natural">{media}</div> : shots?.map((x) => <Zoom key={x.img.src} img={x.img} className="cs-frame" sizes={phones ? '(min-width: 768px) 220px, 44vw' : '(min-width: 768px) 750px, 100vw'} />)}
        </div>
        {caption && <figcaption className="cs-caption">{caption}</figcaption>}
      </figure>
    </div>
  );
}

export function Choices({ children }: { children: ReactNode }) {
  return <div className="cs-choices">{children}</div>;
}

const Chevron = () => (
  <svg className="cs-details-chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// More choices, folded away like Read more: "More" in the margin, the line in the column, and once
// open, the extra choices on the full grid
export function MoreChoices({ label, list, children }: { label: string; list: string; children: ReactNode }) {
  return (
    <details className="cs-details cs-more-choices">
      <summary className="cs-row">
        <span className="cs-label" aria-hidden="true">More</span>
        <span className="cs-more-line">
          <span className="cs-details-label">{label}</span>
          <span className="sr-only">: </span>
          <span className="cs-details-list">{list}</span>
          <Chevron />
        </span>
      </summary>
      <Choices>{children}</Choices>
    </details>
  );
}

// Where it stands: what shipped, what I'd measure, what's next, and the one thing I learned
// `shippedLabel` names the first list when "Shipped" isn't accurate yet (a pre-launch app)
export function Outcome({ title, shipped, shippedLabel = 'Shipped', measure, next, learned }: { title: string; shipped: ReactNode[]; shippedLabel?: string; measure?: ReactNode[]; next: ReactNode[]; learned: ReactNode }) {
  const row = (label: string, items: ReactNode[]) => (
    <div className="cs-row">
      <h3 className="cs-label">{label}</h3>
      <ul className="cs-outcome-list">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
  return (
    <Section id="outcome" label="Outcome" title={title}>
      <div className="cs-outcome">
        {row(shippedLabel, shipped)}
        {measure && row('What I’ll measure', measure)}
        {row('Next', next)}
        <div className="cs-row">
          <h3 className="cs-label">What I learned</h3>
          <p className="cs-learned">{learned}</p>
        </div>
      </div>
    </Section>
  );
}

// A framed screenshot with a caption that names what it shows
export function Figure({ img, caption, priority = false }: { img: Img; caption?: ReactNode; priority?: boolean }) {
  return (
    <figure className="cs-figure">
      <FullSizeLink src={img.src}>
        <span className="cs-frame">
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 768px) 750px, 100vw" priority={priority} quality={90} />
        </span>
      </FullSizeLink>
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}

// Depth for readers who want it: closed by default, native and keyboard-friendly
export function ProcessDetails({ list, children }: { list: string; children: ReactNode }) {
  return (
    <div className="cs-more cs-col cs-row">
      <p className="cs-label" aria-hidden="true">More</p>
      <details className="cs-details">
        <summary>
          <span className="cs-details-label">Read more</span>
          <span className="sr-only">: </span>
          <span className="cs-details-list">{list}</span>
          <Chevron />
        </summary>
        <div className="cs-details-body">{children}</div>
      </details>
    </div>
  );
}

// The close: the next project, as one sentence
export function NextCase({ href, name, line }: { href: string; name: string; line: string }) {
  return (
    <nav className="cs-next cs-col cs-row" aria-label="Next case study">
      <p className="cs-label" aria-hidden="true">Next</p>
      <div>
        <p className="cs-next-title">
          <Link href={href} className="cs-next-link">
            {name} {line}
            <ArrowRight size={22} strokeWidth={1.75} />
          </Link>
        </p>
        <Link href="/work" className="cs-allwork">
          <ArrowLeft size={15} />
          All work
        </Link>
      </div>
    </nav>
  );
}

// Page shell: the shared bar, then the article (the skip link's target); the shared close follows
export function CaseShell({ children }: { children: ReactNode }) {
  return (
    <main className="cs">
      <SiteBar />
      <article id="main-content" tabIndex={-1} className="site-wrap focus:outline-none">
        {children}
      </article>
    </main>
  );
}
