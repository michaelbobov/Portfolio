'use client';

import Image from 'next/image';
import { useState } from 'react';

// The showcase: the extension's views as a list; choosing one puts its real screenshot on the
// navy field. All five are 2x renders from SkillTree's preview harness, with the skills on the
// author's machine and use recorded by SkillTree's hooks in six real Claude Code sessions.
// Shown below 1000px; wider screens get the live demo (LiveDemo.tsx) in its place.

const VIEWS = [
  {
    id: 'in-use',
    name: 'Skills in use',
    fact: 'Sorted by last use, each skill Claude used shows how often and when. These are 8 real uses from 6 short Claude Code sessions.',
    src: '/side-projects/skilltree/tree-in-use.png',
    w: 2480,
    h: 1520,
    alt: 'The Skill Tree sorted by last use: frontend-design and emil-design-eng used twice, impeccable, web-typography, animate and pdf once each, with the time of the last use on each node.',
  },
  {
    id: 'sessions',
    name: 'Every session',
    fact: 'Each use, grouped by session, typed as a /command or invoked by Claude. No prompt text is kept.',
    src: '/side-projects/skilltree/activity.png',
    w: 1440,
    h: 1280,
    alt: 'The Activity timeline: six Claude Code sessions with eight skill uses, each marked Typed /command or Claude invoked (Skill tool).',
  },
  {
    id: 'for-you',
    name: 'For you',
    fact: 'Suggestions from what you actually use: here, more skills from the repositories behind the ones used above.',
    src: '/side-projects/skilltree/for-you.png',
    w: 2560,
    h: 1640,
    alt: 'The Marketplace’s For you group: animate-expo, choreograph and remove-animations from emilkowalski/skills, and brand-guidelines, slack-gif-creator and theme-factory from anthropics/skills, each with its reason.',
  },
  {
    id: 'market',
    name: 'The Marketplace',
    fact: '1,163 public skills from 20 GitHub repositories, each pinned to a commit, with the repository’s stars and license.',
    src: '/side-projects/skilltree/marketplace.png',
    w: 2560,
    h: 1640,
    alt: 'The SkillTree Marketplace: skill cards with repository, path, stars, category, license and date.',
  },
  {
    id: 'preview',
    name: 'Before you install',
    fact: 'The full SKILL.md and every file, read at the pinned commit before anything is copied. Scripts are flagged.',
    src: '/side-projects/skilltree/preview.png',
    w: 2560,
    h: 1800,
    alt: 'A catalog skill’s preview: pinned commit, license, install buttons, items to review and the list of files.',
  },
];

export default function Views() {
  const [active, setActive] = useState(VIEWS[0].id);
  const view = VIEWS.find((v) => v.id === active) ?? VIEWS[0];
  return (
    <section className="stx-views" aria-labelledby="stx-views-title">
      <div className="stx-views-stage" data-reveal>
        {VIEWS.map((v) => (
          <div key={v.id} className={`stx-views-shot${v.id === active ? ' is-on' : ''}`} aria-hidden={v.id !== active}>
            <Image src={v.src} width={v.w} height={v.h} alt={v.alt} sizes="(max-width: 899px) 92vw, 60vw" quality={90} />
          </div>
        ))}
      </div>
      <div className="stx-views-list">
        <h2 id="stx-views-title" className="stx-views-title" data-reveal>
          Your skills, mapped
        </h2>
        <div className="stx-views-names" role="tablist" aria-label="SkillTree views" data-reveal style={{ ['--i' as string]: 1 }}>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={v.id === active}
              className={`stx-views-name${v.id === active ? ' is-on' : ''}`}
              onClick={() => setActive(v.id)}
            >
              {v.name}
            </button>
          ))}
        </div>
        <p className="stx-views-fact" aria-live="polite" data-reveal style={{ ['--i' as string]: 2 }}>
          {view.fact}
        </p>
      </div>
    </section>
  );
}
