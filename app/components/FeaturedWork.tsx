import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoopVideo from '@/app/components/LoopVideo';
import { ArrowRight, ArrowUpRight } from '@/app/components/icons';

/** One real screen from the project, framed and placed on the core's stage */
export type Shot = {
  src: string;
  w: number;
  h: number;
  kind: 'browser' | 'phone';
  /** Left, top and width, as % of the stage width (left, width) and height (top) */
  at: [number, number, number];
  /** A silent looping video played inside the frame; src is then its poster */
  video?: string;
};

export type Project = {
  id: string;
  name: string;
  /** Role and year */
  meta: string;
  /** Layer 1: what was broken, and for whom */
  problem: string;
  tags: string[];
  year: string;
  /** Layer 2: the insight inside it; a quote when it is someone's words */
  insight: string;
  quote?: { who: string };
  /** Layer 3, the core: the outcome in a few words and one plain line, over the real screens */
  core: string;
  coreLine: string;
  tint: string;
  shots: Shot[];
  link: string;
  /** Only for projects with a real live URL (taken from the case study) */
  live?: string;
};

// Selected work: each project opened in layers, like the dolls. Layer 1 is the project (the problem,
// what kind of work, the way in); layer 2, a lighter panel inside it, holds the insight; layer 3 is
// the core: the outcome, over the project's real screens composed on a soft tint of its colour (the
// Loop demo plays in its middle phone). Each card is its own solid purple. The whole card is one
// link (a stretched link on the name); "Live site" sits above it, so no anchors nest.
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <ol className="nw">
      {projects.map((p, i) => (
        <li key={p.id} className={`nw-card nw-t${(i % 4) + 1}`}>
          <div className="nw-l1">
            <p className="nw-meta">{p.meta}</p>
            <h3 className="nw-name">
              <Link href={p.link} className="nw-link">{p.name}</Link>
            </h3>
            <p className="nw-problem">{p.problem}</p>
            <ul className="nw-tags" aria-label="Kind of work">
              {p.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <span className="nw-actions">
              <span className="nw-read" aria-hidden="true">Read the case study <ArrowRight size={16} strokeWidth={2.25} /></span>
              {p.live && (
                <a className="nw-live" href={p.live} target="_blank" rel="noopener noreferrer">
                  Live site<span className="sr-only">: {p.name} (opens in a new tab)</span>
                  <ArrowUpRight size={14} strokeWidth={2.25} />
                </a>
              )}
            </span>
          </div>
          <div className="nw-l2">
            <p className="nw-label">Layer 2 · The insight · {p.year}</p>
            {p.quote ? (
              <figure className="nw-insight">
                <blockquote>“{p.insight}”</blockquote>
                <figcaption>{p.quote.who}</figcaption>
              </figure>
            ) : (
              <p className="nw-insight">{p.insight}</p>
            )}
            <div className="nw-l3" style={{ background: p.tint }}>
              <p className="nw-core-row">
                <span className="nw-label">Layer 3 · The core</span>
                <span className="nw-core">{p.core}</span>
                <span className="nw-core-line">{p.coreLine}</span>
              </p>
              <div className="nw-stage" aria-hidden="true">
                {p.shots.map((s, k) => (
                  <span
                    key={s.src}
                    className={`nw-shot nw-shot-${s.kind}`}
                    style={{ left: `${s.at[0]}%`, top: `${s.at[1]}%`, width: `${s.at[2]}%`, aspectRatio: `${s.w} / ${s.h}`, '--k': k } as CSSProperties}
                  >
                    {s.video ? (
                      <LoopVideo src={s.video} poster={s.src} />
                    ) : (
                      <Image src={s.src} alt="" width={s.w} height={s.h} sizes={`(max-width: 999px) ${Math.round(s.at[2])}vw, ${Math.round(s.at[2] * 0.6)}vw`} quality={90} />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
