import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullSizeLink from '@/app/components/FullSizeLink';
import { SiteBar } from '@/app/components/Site';
import { ArrowLeft, ArrowUpRight } from '@/app/components/icons';

// Building blocks for the case-study pages, in the homepage's world: the dark grape ground, panels
// as steps in tone (no outlines, no hard shadows), Bricolage for headings, Geist for text. Styles live
// in app/work/case.css.

export type Status = 'LIVE' | 'LIVE MVP' | 'PRE-LAUNCH' | 'CONCEPT';

export function CaseHero({
  kicker,
  name,
  claim,
  summary,
  link,
}: {
  kicker: string;
  name: string;
  claim: string;
  summary: string;
  link?: { href: string; label: string };
}) {
  return (
    <header className="cs-hero cs-col">
      <p className="cs-kicker">{kicker}</p>
      <h1 className="cs-h1">
        {name}
        <span className="sr-only">: </span>
        <span className="cs-claim">{claim}</span>
      </h1>
      <p className="cs-summary">{summary}</p>
      {link && (
        <a className="cs-live" href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
          <ArrowUpRight size={16} strokeWidth={2.25} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
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

// At a glance: what a reviewer needs in one screen. The facts (role, team, time, where it stands),
// then the problem, what I did and the outcome, two or three sentences each.
export function Glance({
  facts,
  status,
  problem,
  did,
  outcome,
}: {
  facts: { label: string; value: ReactNode }[];
  status: Status;
  problem: ReactNode;
  did: ReactNode;
  outcome: ReactNode;
}) {
  const { label, tone } = STATUS[status];
  return (
    <section className="cs-glance cs-col-wide" aria-labelledby="glance-title">
      <h2 id="glance-title" className="sr-only">At a glance</h2>
      <dl className="cs-glance-facts">
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
      <div className="cs-glance-story">
        <div>
          <h3>The problem</h3>
          <p>{problem}</p>
        </div>
        <div>
          <h3>What I did</h3>
          <p>{did}</p>
        </div>
        <div className="is-outcome">
          <h3>The outcome</h3>
          <p>{outcome}</p>
        </div>
      </div>
    </section>
  );
}

// A section: a small grape label, then the claim as the H2
export function Section({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="cs-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="cs-col">
        <p className="cs-label" aria-hidden="true">{label}</p>
        <h2 id={`${id}-title`} className="cs-h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="cs-prose cs-col">{children}</div>;
}

type Pic = Img & { fit?: 'cover' | 'contain'; bg?: string; /** object-position, for a crop */ position?: string };
type Step = {
  name: string;
  did: ReactNode;
  /** What came out of it, marked in gold */
  found?: ReactNode;
  /** The step's artifact: pictures (each opens full size), a quote, or a flow as chips */
  pics?: Pic[];
  quote?: { text: string; who: string };
  flows?: { who: string; steps: string[] }[];
};

// A picture that opens at full size, with no visible label (for small artifacts and decision screens)
function Zoom({ img, className = '', sizes }: { img: Pic; className?: string; sizes: string }) {
  return (
    <a className={`cs-zoom ${className}`} href={encodeURI(img.src)} target="_blank" rel="noopener noreferrer" style={img.bg ? { background: img.bg } : undefined}>
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} quality={90} className={img.fit === 'contain' ? 'is-contain' : undefined} style={img.position ? { objectPosition: img.position } : undefined} />
      <span className="sr-only"> (opens full size in a new tab)</span>
    </a>
  );
}

// The process, kept in view: one row of steps, each with its artifact, what I did and what I found
export function Process({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <section className="cs-section" id="process" aria-labelledby="process-title">
      <div className="cs-col">
        <p className="cs-label" aria-hidden="true">Process</p>
        <h2 id="process-title" className="cs-h2">{title}</h2>
      </div>
      <ol className="cs-steps cs-col-wide" style={{ '--n': steps.length } as CSSProperties}>
        {steps.map((st) => (
          <li key={st.name} className="cs-step">
            <div className="cs-step-media">
              {st.pics ? (
                <div className={`cs-step-pics is-${st.pics.length}`}>
                  {st.pics.map((p) => <Zoom key={p.src} img={p} sizes="(min-width: 1100px) 220px, (min-width: 600px) 45vw, 90vw" />)}
                </div>
              ) : st.quote ? (
                <figure className="cs-step-quote">
                  <blockquote>“{st.quote.text}”</blockquote>
                  <figcaption>{st.quote.who}</figcaption>
                </figure>
              ) : st.flows ? (
                <div className="cs-step-flows">
                  {st.flows.map((f) => (
                    <div key={f.who}>
                      <p>{f.who}</p>
                      <ol>{f.steps.map((x) => <li key={x}>{x}</li>)}</ol>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <h3 className="cs-step-name">{st.name}</h3>
            <p className="cs-step-did">{st.did}</p>
            {st.found && <p className="cs-step-found">{st.found}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

// A key decision, shown with the screen it produced: the decision and why on one side, the screens
// (and a caption) on the other
export function Choice({ n, title, why, shots, caption }: { n: number; title: string; why: ReactNode; shots?: { img: Pic; phone?: boolean }[]; caption?: ReactNode }) {
  const phones = shots?.some((x) => x.phone);
  return (
    <div className={`cs-choice${shots?.length ? '' : ' is-text'}`}>
      <div className="cs-choice-text">
        <p className="cs-choice-tag" aria-hidden="true">Decision {n}</p>
        <h3 className="cs-choice-title">
          <span className="sr-only">Decision {n}: </span>
          {title}
        </h3>
        <p className="cs-choice-why">{why}</p>
      </div>
      {shots?.length ? (
        <figure className={`cs-choice-media${phones ? ' is-phones' : ''}`}>
          <div className="cs-choice-shots">
            {shots.map((x) => <Zoom key={x.img.src} img={x.img} className="cs-frame" sizes={phones ? '(min-width: 900px) 220px, 42vw' : '(min-width: 900px) 600px, 90vw'} />)}
          </div>
          {caption && <figcaption className="cs-caption">{caption}</figcaption>}
        </figure>
      ) : null}
    </div>
  );
}

export function Choices({ children }: { children: ReactNode }) {
  return <div className="cs-choices cs-col-wide">{children}</div>;
}

// Where it stands: what shipped, what I'd measure, what's next, and the one thing I learned
export function Outcome({ title, shipped, measure, next, learned }: { title: string; shipped: ReactNode[]; measure?: ReactNode[]; next: ReactNode[]; learned: ReactNode }) {
  const col = (h: string, items: ReactNode[]) => (
    <div>
      <h3>{h}</h3>
      <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
  return (
    <section className="cs-section" id="outcome" aria-labelledby="outcome-title">
      <div className="cs-col">
        <p className="cs-label" aria-hidden="true">Outcome</p>
        <h2 id="outcome-title" className="cs-h2">{title}</h2>
      </div>
      <div className={`cs-outcome cs-col-wide${measure ? ' has-3' : ''}`}>
        {col('Shipped', shipped)}
        {measure && col('What I’ll measure', measure)}
        {col('Next', next)}
      </div>
      <p className="cs-learned cs-col-wide"><span>What I learned</span>{learned}</p>
    </section>
  );
}

type Img = { src: string; alt: string; width: number; height: number };

// A framed screenshot with a caption that names what it shows. No tilt, zoom or halftone.
export function Figure({
  img,
  caption,
  size = 'media',
  priority = false,
}: {
  img: Img;
  caption?: ReactNode;
  size?: 'hero' | 'media' | 'narrow';
  priority?: boolean;
}) {
  const sizes = size === 'hero' ? '(min-width: 920px) 800px, 100vw' : size === 'narrow' ? '(min-width: 760px) 680px, 100vw' : '(min-width: 1040px) 960px, 100vw';
  return (
    <figure className={`cs-figure cs-figure-${size}`}>
      <FullSizeLink src={img.src}>
        <span className="cs-frame">
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} priority={priority} quality={90} />
        </span>
      </FullSizeLink>
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}

// A row of phone screens (a scroll-snap row on small screens), each with its own caption
export function PhoneRow({ items, label }: { items: { img: Img; caption?: ReactNode }[]; label: string }) {
  return (
    <ul className="cs-phones" aria-label={label}>
      {items.map((it) => (
        <li key={it.img.src}>
          <figure className="cs-figure cs-figure-phone">
            <FullSizeLink src={it.img.src}>
              <span className="cs-frame">
                <Image src={it.img.src} alt={it.img.alt} width={it.img.width} height={it.img.height} sizes="(min-width: 760px) 240px, 70vw" quality={90} />
              </span>
            </FullSizeLink>
            {it.caption && <figcaption className="cs-caption">{it.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  );
}

// Depth for readers who want it: closed by default, native and keyboard-friendly
export function ProcessDetails({ list, children }: { list: string; children: ReactNode }) {
  return (
    <details className="cs-details cs-col-wide">
      <summary>
        <span className="cs-details-label">
          More from the process
        </span>
        <span className="sr-only">: </span>
        <span className="cs-details-list">{list}</span>
        <svg className="cs-details-chev" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="cs-details-body">{children}</div>
    </details>
  );
}

// The close: a panel like the homepage's work panels, handing the reader to the next project
export function NextCase({
  href,
  name,
  line,
  img,
  bg,
  fit = 'cover',
  position,
  section = 'work',
}: {
  href: string;
  name: string;
  line: string;
  img: string;
  bg: string;
  fit?: 'contain' | 'cover';
  /** object-position for a cropped image, e.g. '50% 30%' */
  position?: string;
  /** Where "back" goes: the section this case study lives in */
  section?: 'work' | 'side';
}) {
  const back = section === 'side' ? { href: '/side-projects', label: 'All side projects' } : { href: '/work', label: 'All work' };
  return (
    <nav className="cs-next cs-col-wide" aria-label="Next case study">
      <div className="cs-next-panel">
        <div className="cs-next-media" style={{ background: bg }}>
          <Image src={img} alt="" fill sizes="(min-width: 1200px) 1120px, 100vw" className={fit === 'contain' ? 'object-contain' : 'object-cover'} style={position ? { objectPosition: position } : undefined} />
        </div>
        <div className="cs-next-body">
          <p className="cs-next-title">
            <Link href={href} className="cs-next-link">
              <b>Next: {name}</b> {line}
            </Link>
          </p>
          <span className="cs-next-btn" aria-hidden="true">
            Read it <ArrowUpRight size={18} strokeWidth={2.25} />
          </span>
        </div>
      </div>
      <Link href={back.href} className="cs-allwork">
        <ArrowLeft size={18} />
        {back.label}
      </Link>
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
