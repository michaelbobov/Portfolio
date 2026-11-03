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
  /** Role, exactly as the case study's header says it */
  meta: string;
  /** Where it runs: Web, Mac, Mobile */
  platform: string;
  year: string;
  /** Where it stands: Live, Live MVP, Pre-launch, Concept */
  status: string;
  /** The claim, from the case study: the card's headline */
  headline: string;
  /** One sentence more */
  summary: string;
  /** The stage: its colour (the purple family, a different tone per project, picked for the app's own
      colours) and the product's real screens, back to front */
  stage: string;
  shots: Shot[];
  /** A feature overview: a silent 21:9 loop on the stage's own colour, shown in place of the shots.
      contain keeps all of it in view on narrower stages, for a wide subject like a browser window */
  motion?: { src: string; poster: string; width: number; height: number; label: string; contain?: boolean };
  link: string;
  /** Only for projects with a real live URL (taken from the case study) */
  live?: string;
};

// A project card: the product on a coloured stage on top, the words below on the dark card. Below, one
// two-tone headline (the project's name, then its claim in a softer tone), one sentence, then one plain
// line with the same four fields on every card, matching the case study's header: role · platform ·
// year · status. The way in sits at the bottom right. No stats: the details live in the case study. The
// whole card is one link (a stretched link on the headline); "Live site" sits above it, so no anchors nest. Motion is CSS only (hp.css): on hover
// the screens rise and the arrow moves.
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <ol className="pc-list">
      {projects.map((p) => (
        <li key={p.id} className="pc">
          <div className="pc-stage" style={{ '--stage': p.stage } as CSSProperties}>
            {p.motion ? (
              <MotionVideo
                className={`pc-motion${p.motion.contain ? ' is-contain' : ''}`}
                src={p.motion.src}
                poster={p.motion.poster}
                width={p.motion.width}
                height={p.motion.height}
                label={p.motion.label}
              />
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
              <h3 className="pc-name">
                <Link href={p.link} className="pc-link"><span className="pc-title">{p.name}.</span> {p.headline}</Link>
              </h3>
              <p className="pc-summary">{p.summary}</p>
              <p className="pc-meta">
                {p.meta} · {p.platform} · {p.year} ·{' '}
                <span className={`pc-state${/live/i.test(p.status) ? ' is-live' : /pre/i.test(p.status) ? ' is-pre' : ''}`}>{p.status}</span>
              </p>
            </div>
            <div className="pc-side">
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
