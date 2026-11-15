import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteBar } from '@/app/components/Site';
import { ArrowDown, ArrowLeft } from '@/app/components/icons';
import SkillFinder from './SkillFinder';
import Views from './Views';
import LiveDemo from './LiveDemo';
import HowSteps from './HowSteps';
import Reveal from './Reveal';
import '../../hp.css';
import './skilltree.css';

// SkillTree's page: a VS Code extension for Claude Code skills, with its Marketplace link and download. Every number on
// the page comes from SkillTree's own repository: its catalog, its tests and its measured runs.

export const metadata: Metadata = {
  title: 'SkillTree',
  description: 'SkillTree is a free VS Code extension that maps your Claude Code skills, shows which ones Claude actually uses, and gets Claude’s recommendations for skills that would serve you better. Free on the VS Code Marketplace.',
  alternates: { canonical: '/side-projects/skilltree' },
};

const MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=michaelbobov.skilltree';
const VSIX = '/downloads/skilltree-0.2.0.vsix';

const FACTS = [
  { fig: '3,019', note: 'skills in the catalog on Nov 14, 2026, from 73 GitHub repositories, each pinned to a commit and re-indexed daily' },
  { fig: '0', note: 'skill files SkillTree runs. It reads and copies them; it never executes them' },
  { fig: '15 ms', note: 'added to a skill use while tracking is on, measured: the hook writes one line and exits' },
  { fig: '36 s', note: 'to install taste-skill’s 1,631 files, each checked against its commit' },
  { fig: '7 days', note: 'of tracking before SkillTree calls a skill unused. Nothing is inferred from a skill being installed' },
  { fig: '0', note: 'prompts stored. Tracking keeps the time, the skill, the session and the folder' },
];

export default function SkillTreePage() {
  return (
    <div className="hp stx">
      <SiteBar />
      <Reveal />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className="stx-hero" aria-labelledby="stx-title">
          <div className="stx-hero-words">
            <h1 id="stx-title" className="stx-h1">
              See your Claude skills at work.
            </h1>
            <p className="stx-lede">SkillTree maps your Claude Code skills, shows which ones Claude actually uses, and gets Claude’s recommendations for skills that would serve you better.</p>
            <div className="stx-actions">
              <a className="stx-btn" href={MARKETPLACE}>
                Install for VS Code
              </a>
              <a className="stx-textlink" href="#install">
                How to install <ArrowDown size={16} strokeWidth={2.25} />
              </a>
            </div>
            <p className="stx-meta">Free on the VS Code Marketplace · Version 0.2.0, a preview · VS Code 1.95 or later</p>
          </div>
          <div className="stx-stage">
            <div className="stx-hero-shot">
              <Image
                src="/side-projects/skilltree/hero.png"
                width={1600}
                height={1280}
                priority
                quality={90}
                sizes="(max-width: 999px) 100vw, 52vw"
                alt="SkillTree in VS Code with frontend-design selected: 2 recorded uses in 2 sessions, 1 by Claude and 1 typed, a dashed line to web-typography from the same session, and use counts on the other skills."
              />
            </div>
          </div>
        </section>

        <section className="stx-find" aria-labelledby="stx-find-title">
          <div className="stx-find-head">
            <h2 id="stx-find-title" className="stx-h2" data-reveal>
              What would serve you better?
            </h2>
            <p className="stx-statement" data-reveal style={{ ['--i' as string]: 1 }}>
              Type a request you’d give Claude. This is the matcher SkillTree uses to recommend a skill while you work, run against its whole catalog.
            </p>
          </div>
          <div data-reveal style={{ ['--i' as string]: 2 }}>
            <SkillFinder />
          </div>
        </section>

        <LiveDemo />
        <Views />

        <section className="stx-proof" aria-labelledby="stx-proof-title">
          <div className="stx-tile stx-tile-head" data-reveal>
            <h2 id="stx-proof-title" className="stx-h2">
              Numbers from real runs
            </h2>
          </div>
          {FACTS.map((f, i) => (
            <div key={f.note} className="stx-tile" data-reveal style={{ ['--i' as string]: i + 1 }}>
              <p className="stx-fig">{f.fig}</p>
              <p className="stx-fig-note">{f.note}.</p>
            </div>
          ))}
        </section>

        <section id="install" className="stx-how" aria-labelledby="stx-how-title">
          <div className="stx-how-intro">
            <h2 id="stx-how-title" className="stx-h2" data-reveal>
              Install in a minute
            </h2>
            <p className="stx-how-text" data-reveal style={{ ['--i' as string]: 1 }}>
              You need desktop VS Code 1.95 or later. Claude Code is needed for the parts that involve Claude, and Node.js for usage tracking and suggestions. Both of those are off until you turn them on.
            </p>
          </div>
          <HowSteps marketplace={MARKETPLACE} vsix={VSIX} />
        </section>

        <section className="stx-close" aria-labelledby="stx-close-title">
          <div className="stx-close-words">
            <h2 id="stx-close-title" className="stx-close-line" data-reveal>
              Map your skills.
            </h2>
            <p className="stx-close-text" data-reveal style={{ ['--i' as string]: 1 }}>
              Install it from VS Code’s Extensions view and your skills are mapped right away. Turn on tracking to see what Claude uses, and suggestions to hear what would help.
            </p>
          </div>
          <div className="stx-close-panel" data-reveal style={{ ['--i' as string]: 2 }}>
            <a className="stx-btn is-on-blue" href={MARKETPLACE}>
              Install from the VS Code Marketplace
            </a>
            <p className="stx-close-or">or in a terminal:</p>
            <pre className="stx-code">
              <code>code --install-extension michaelbobov.skilltree</code>
            </pre>
          </div>
        </section>

        <footer className="stx-foot">
          <p>
            SkillTree is a side project by Michael Bobov, built with Claude Code. The skills in its catalog belong to their authors on GitHub.
          </p>
          <Link className="stx-textlink" href="/side-projects">
            <ArrowLeft size={16} strokeWidth={2.25} /> All side projects
          </Link>
        </footer>
      </main>
    </div>
  );
}
