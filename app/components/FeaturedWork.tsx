import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MotionVideo from '@/app/components/MotionVideo';
import { ArrowRight, ArrowUpRight } from '@/app/components/icons';

/** One real screen from the project, framed and placed on its stage */
export type Shot = {
  src: string;
  w: number;
  h: number;
  kind: 'browser' | 'phone';
  /** Left, top and width, as % of the stage's wide frame (21:9): left and width of its width, top of its height */
  at: [number, number, number];
};

export type Project = {
  id: string;
  name: string;
  /** Role */
  meta: string;
  year: string;
  /** Where it stands: Live, Live MVP, Pre-launch, Concept */
  status: string;
  /** What kind of product it is */
  tag: string;
  /** The claim, from the case study: the card's headline */
  headline: string;
  /** One sentence more */
  summary: string;
  /** Three real facts from the case study, each a short value and what it counts */
  facts: { value: string; label: string }[];
  /** The stage: its colour (the purple family, a different tone per project, picked for the app's own
      colours) and the product's real screens, back to front */
  stage: string;
  shots: Shot[];
  /** A feature overview: a silent 21:9 loop on the stage's own colour, shown in place of the shots */
  motion?: { src: string; poster: string; width: number; height: number; label: string };
  link: string;
  /** Only for projects with a real live URL (taken from the case study) */
  live?: string;
};

// A project card: the product on a coloured stage on top, the words below on the dark card. The stage
// carries where it stands and what it is; below, the project and role in the accent, the claim as the
// headline, one sentence, three facts and the way in. The whole card is one link (a stretched link on
// the headline); "Live site" sits above it, so no anchors nest. Motion is CSS only (hp.css): on hover
// the screens rise and the arrow moves.
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <ol className="pc-list">
      {projects.map((p) => (
        <li key={p.id} className="pc">
          <div className="pc-stage" style={{ '--stage': p.stage } as CSSProperties}>
            <p className="pc-tags">
              <span className={`pc-status${/live/i.test(p.status) ? ' is-live' : /pre/i.test(p.status) ? ' is-pre' : ''}`}>{p.status}</span>
              <span className="pc-tag">{p.tag}</span>
            </p>
            {p.motion ? (
              <MotionVideo className="pc-motion" {...p.motion} />
            ) : (
              // The screens, laid out on a wide frame as tall as the stage (cropped at the sides where
              // the stage is narrower, on phones, so they stay big)
              <div className="pc-shots" aria-hidden="true">
                {p.shots.map((s, k) => (
                  <span
                    key={s.src}
                    className={`pc-shot pc-shot-${s.kind}`}
                    style={{ left: `${s.at[0]}%`, top: `${s.at[1]}%`, width: `${s.at[2]}%`, aspectRatio: `${s.w} / ${s.h}`, '--k': k } as CSSProperties}
                  >
                    <Image src={s.src} alt="" width={s.w} height={s.h} sizes={`(max-width: 999px) ${Math.round(s.at[2] * 1.75)}vw, ${Math.round(s.at[2] * 0.95)}vw`} quality={90} />
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="pc-body">
            <div className="pc-words">
              <p className="pc-meta">{p.name} · {p.meta} · {p.year}</p>
              <h3 className="pc-name">
                <Link href={p.link} className="pc-link"><span className="sr-only">{p.name}: </span>{p.headline}</Link>
              </h3>
              <p className="pc-summary">{p.summary}</p>
            </div>
            <div className="pc-side">
              <dl className="pc-facts">
                {p.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="pc-actions">
                <span className="pc-read" aria-hidden="true">Read the case study <ArrowRight size={16} strokeWidth={2.25} /></span>
                {p.live && (
                  <a className="pc-live" href={p.live} target="_blank" rel="noopener noreferrer">
                    Live site<span className="sr-only">: {p.name} (opens in a new tab)</span>
                    <ArrowUpRight size={14} strokeWidth={2.25} />
                  </a>
                )}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
