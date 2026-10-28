import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FullSizeLink from '@/app/components/FullSizeLink';
import { SiteBar } from '@/app/components/Site';
import { ArrowLeft, ArrowUpRight } from '@/app/components/icons';

// Building blocks for the case-study pages, in the homepage's world: the dark grape ground, panels
// as steps in tone (no outlines, no hard shadows), Bricolage for display, Geist for text, and the
// claim under the name as the one serif-italic accent. Styles live in app/work/case.css.

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

// Role / Timeline / Team / Skills, kept near the top in a compact grid
export function MetaGrid({ items }: { items: { label: string; lines: string[] }[] }) {
  return (
    <dl className="cs-meta cs-col">
      {items.map((it) => (
        <div key={it.label}>
          <dt>{it.label}</dt>
          {it.lines.map((l) => (
            <dd key={l}>{l}</dd>
          ))}
        </div>
      ))}
    </dl>
  );
}

// How each status reads on the page
const STATUS: Record<Status, { label: string; tone: 'live' | 'pre' | 'concept' }> = {
  LIVE: { label: 'Live', tone: 'live' },
  'LIVE MVP': { label: 'Live MVP', tone: 'live' },
  'PRE-LAUNCH': { label: 'Pre-launch', tone: 'pre' },
  CONCEPT: { label: 'Concept', tone: 'concept' },
};

// The short version: four rows in one panel, its title and the status chip on top
export function Tldr({ status, rows }: { status: Status; rows: { label: string; text: ReactNode }[] }) {
  const { label, tone } = STATUS[status];
  return (
    <section className="cs-tldr cs-col" aria-labelledby="tldr-title">
      <div className="cs-tldr-head">
        <h2 id="tldr-title" className="cs-tldr-title">The short version</h2>
        <span className={`cs-chip cs-chip-${tone}`}>{label}</span>
      </div>
      <dl className="cs-tldr-rows">
        {rows.map((r) => (
          <div key={r.label} className="cs-tldr-row">
            <dt>{r.label}</dt>
            <dd>{r.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// A section: a small grape label, then the claim as the H2
export function Section({
  id,
  label,
  title,
  children,
  decisions = false,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  decisions?: boolean;
}) {
  return (
    <section className="cs-section" id={id} aria-labelledby={`${id}-title`} data-decisions={decisions || undefined}>
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

export function Decision({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="cs-decision">
      <p className="cs-decision-tag" aria-hidden="true">Decision {n}</p>
      <h3 className="cs-decision-title">
        <span className="sr-only">Decision {n}: </span>
        {title}
      </h3>
      <div className="cs-decision-body">{children}</div>
    </div>
  );
}

export function Decisions({ children }: { children: ReactNode }) {
  return <div className="cs-decisions cs-col">{children}</div>;
}

// A verbatim, attributed quote, as a quiet speech bubble (at most one per page)
export function Quote({ children, who }: { children: ReactNode; who: string }) {
  return (
    <figure className="cs-quote">
      <blockquote>{children}</blockquote>
      <figcaption>{who}</figcaption>
    </figure>
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
          Process details
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
}: {
  href: string;
  name: string;
  line: string;
  img: string;
  bg: string;
  fit?: 'contain' | 'cover';
  /** object-position for a cropped image, e.g. '50% 30%' */
  position?: string;
}) {
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
      <Link href="/#work" className="cs-allwork">
        <ArrowLeft size={18} />
        All work
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
