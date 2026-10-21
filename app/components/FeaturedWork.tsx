import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@/app/components/icons';

export type Project = {
  id: string;
  name: string;
  /** "CASE STUDY 01" */
  number: string;
  /** The headline: bold lead (name + strongest true fact), then the rest in regular weight */
  lead: string;
  rest: string;
  /** Plain meta under the headline, e.g. "Co-founder · Live MVP" */
  meta: string;
  /** Real facts for the scrolling ticker */
  ticker: string[];
  link: string;
  /** Only for projects with a real live URL (taken from the case study) */
  live?: string;
  heroImage: string;
  /** Fill behind the image (letterbox, and while it loads) */
  bg: string;
  fit: 'contain' | 'cover';
  /** wide: full-width panel (image 16:8); half: one of a side-by-side pair (image 4:3) */
  size: 'wide' | 'half';
};

// Featured work as a comic page: framed panels with a ticker strip, the project's image, and a
// caption. The whole panel is one link (a stretched link on the title, so its accessible name is
// the headline); the "Live site" and "Read case study" pills are separate links layered above it,
// so no anchors nest. The caption comes first in the DOM (title, then pills in tab order) and CSS
// puts the image above it. Motion is CSS only (home.css): ticker, hover lift, image zoom and dots.
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <ol className="cp-page">
      {projects.map((p) => (
        <li key={p.id} className={`cp-panel cp-${p.size}`}>
          <div className="cp-ticker" aria-hidden="true">
            <div className="cp-ticker-track">
              {[0, 1].map((copy) => (
                <span key={copy} className="cp-ticker-run">
                  {Array.from({ length: 3 }, () => p.ticker)
                    .flat()
                    .map((t, i) => (
                      <span key={i}>✦ {t} </span>
                    ))}
                </span>
              ))}
            </div>
          </div>
          <div className="cp-body">
            <span className="cp-tag">{p.number}</span>
            <h3 className="cp-title">
              <Link href={p.link} className="cp-link">
                <b>{p.lead}</b> {p.rest}
              </Link>
            </h3>
            <p className="cp-meta">{p.meta}</p>
            <span className="cp-btn" aria-hidden="true">
              View case study
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </span>
          </div>
          <div className="cp-media" style={{ background: p.bg }}>
            <Image
              src={p.heroImage}
              alt=""
              fill
              sizes={p.size === 'wide' ? '(max-width: 1600px) 100vw, 1504px' : '(max-width: 767px) 100vw, 50vw'}
              className={`cp-img ${p.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
            />
            <span className="cp-dots" aria-hidden="true" />
            <span className="cp-pills">
              {p.live && (
                <Pill href={p.live} external>
                  Live site<span className="sr-only">: {p.name} (opens in a new tab)</span>
                </Pill>
              )}
              <Pill href={p.link}>
                Read case study<span className="sr-only">: {p.name}</span>
              </Pill>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Pill({ href, external = false, children }: { href: string; external?: boolean; children: ReactNode }) {
  const inner = (
    <>
      {children}
      <ArrowUpRight size={16} strokeWidth={2.25} />
    </>
  );
  return external ? (
    <a className="cp-pill" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className="cp-pill" href={href}>
      {inner}
    </Link>
  );
}
