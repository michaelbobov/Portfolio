import type { CSSProperties } from 'react';
import Link from 'next/link';
import { SiteBar } from '@/app/components/Site';
import IntroStage from '@/app/components/IntroStage';
import DollSet from '@/app/components/DollSet';
import AboutDoll from '@/app/components/AboutDoll';
import FeaturedWork from '@/app/components/FeaturedWork';
import type { Project } from '@/app/components/FeaturedWork';
import { ArrowDown } from '@/app/components/icons';
import { INTRO } from '@/app/data/intro';
import './hp.css';

// "Design, one layer deeper": Michael designs, then goes the layer further and builds it. The page
// is a matryoshka opened in order: one doll in the hero that opens into the set, each project nested
// in three layers, how he works as rings closing in on code, then the innermost layer (a doll that
// opens onto his About site). The bar and the close ("Let's open something") are the shared ones
// (Site.tsx). Every fact comes from the case studies.


const projects: Project[] = [
  {
    id: 'versum',
    name: 'Versum Health',
    meta: 'Co-founder · Product lead',
    problem: 'Uninsured patients put off dental care, and dental students can’t find the patients they need to graduate.',
    tags: ['Web', 'Healthcare marketplace'],
    year: '2025',
    insight: 'I had to pay people off the street a lot of money just to get them a free cleaning.',
    quote: { who: 'A practicing dental hygienist, on getting through school' },
    core: 'Live MVP',
    coreLine: 'Patients search and book; students manage schedules and messages.',
    tint: '#dde8fb',
    shots: [
      { src: '/Student2.png', w: 1470, h: 894, kind: 'browser', at: [6, 13, 58] },
      { src: '/Student5.png', w: 1558, h: 902, kind: 'browser', at: [40, 33, 54] },
    ],
    link: '/work/versum',
    live: 'https://versumhealth.com/',
  },
  {
    id: 'ez-recipe',
    name: 'EZ Recipe',
    meta: 'Founder · Design and build',
    problem: 'Recipe apps assume you’ll go shopping. Home cooks start from what’s already in the fridge.',
    tags: ['Web app', 'Consumer AI'],
    year: '2025',
    insight: 'Cooking communities kept asking how to use what they already had.',
    core: 'Live',
    coreLine: 'At ezrecipe.app, reworked after real use so the recipe shows before its picture.',
    tint: '#d5eee1',
    shots: [
      { src: '/HiFiHomeApp.png', w: 393, h: 852, kind: 'phone', at: [26, 9, 22] },
      { src: '/HiFiViewRecipe.png', w: 393, h: 852, kind: 'phone', at: [53, 19, 22] },
    ],
    link: '/work/ez-recipe',
    live: 'https://ezrecipe.app',
  },
  {
    id: 'pdf-penguin',
    name: 'PDF Penguin',
    meta: 'Founder · Design and build',
    problem: 'Getting a table out of a PDF meant selecting areas by hand or writing parser rules first.',
    tags: ['Web app', 'AI developer tool'],
    year: '2025',
    insight: 'I was the first user: every tool I tried asked for setup before it gave me anything.',
    core: 'MVP in 2 weeks',
    coreLine: 'Drop in a PDF, say what you need in plain words, get clean JSON.',
    tint: '#ece2fc',
    shots: [{ src: '/highfipengu2.png', w: 1728, h: 1117, kind: 'browser', at: [8, 12, 96] }],
    link: '/work/pdf-penguin',
  },
  {
    id: 'spotify-loop',
    name: 'Spotify Loop',
    meta: 'Product designer · Unofficial concept',
    problem: 'To replay one part of a song, people scrub by hand or leave Spotify altogether.',
    tags: ['Mobile', 'Feature design'],
    year: '2025',
    insight: 'Musicians had already built their own workarounds.',
    core: 'Loop in 2 taps',
    coreLine: 'A hi-fi concept inside Spotify’s own design language, with saved loops.',
    tint: '#e2f3e7',
    shots: [
      { src: '/Loop Set.png', w: 393, h: 852, kind: 'phone', at: [17, 18, 19] },
      { src: '/Loop Active.png', w: 393, h: 852, kind: 'phone', at: [40.5, 9, 19], video: '/demospotifyloop.mp4' },
      { src: '/Saved Loops.png', w: 393, h: 852, kind: 'phone', at: [64, 18, 19] },
    ],
    link: '/work/spotify-loop',
  },
];

// How he works, outside in: four rings closing in on the smallest doll
const RINGS = [
  { name: 'Listen', line: 'Talk with the people who have the problem, on every side of it, before any sketch.' },
  { name: 'Frame', line: 'Name the real problem, then agree on what better means.' },
  { name: 'Design', line: 'Flows, states and prototypes, put in front of real people.' },
  { name: 'Build', line: 'Then I ship it myself: React and AI APIs, down to the last detail.' },
];

// Ring order (CSS reads --i)
const step = (i: number) => ({ '--i': i }) as CSSProperties;
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <IntroStage className="hp">
      <SiteBar />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className="hp-wrap hp-hero">
          <div className="hp-hero-copy">
            {/* One layer at a time: "Design," and "one layer" peel up from under their masks as a doll
                comes out; "deeper." arrives from depth, letter by letter */}
            <h1 className="hp-h1">
              <span className="hp-line"><span style={at(INTRO.design)}>Design,</span></span>{' '}
              <span className="hp-line"><em style={at(INTRO.layer)}>one layer</em></span>{' '}
              <span className="hp-line hp-deep">
                <span aria-hidden="true">
                  {Array.from('deeper.').map((ch, i) => (
                    <span key={i} className="hp-ch" style={at(INTRO.deeper + i * INTRO.letter)}>{ch}</span>
                  ))}
                </span>
                <span className="sr-only">deeper.</span>
              </span>
            </h1>
            <p className="hp-lede hp-rise" style={at(INTRO.lede)}>
              I design products, then go one layer further and build them, from the first conversation to shipped code.
              Product designer in Seattle; I co-founded <Link href="/work/versum">Versum Health</Link>, and designed and built{' '}
              <Link href="/work/ez-recipe">EZ Recipe</Link> and <Link href="/work/pdf-penguin">PDF Penguin</Link>.
            </p>
            <a href="#work" className="hp-btn hp-rise" style={at(INTRO.button)}>
              See the work <ArrowDown size={18} strokeWidth={2.25} />
            </a>
          </div>
          <DollSet />
        </section>

        <section id="work" className="hp-wrap hp-section scroll-mt-6" aria-labelledby="work-title">
          <div className="hp-head">
            <h2 id="work-title" className="hp-h2 hp-h2-stack">Selected <em>work.</em></h2>
            <p className="hp-head-note">Four projects, each opened in layers: the problem people had, the insight inside it, and the outcome at the core.</p>
          </div>
          <FeaturedWork projects={projects} />
        </section>

        <section className="hp-wrap hp-section hp-how" aria-labelledby="how-title">
          <div className="hp-rings" aria-hidden="true">
            {RINGS.map((r, i) => (
              <span key={r.name} className="hp-ring" style={step(i)}>
                <span className="hp-ring-name">{r.name}</span>
              </span>
            ))}
            <span className="hp-ring-core"><em>Code</em></span>
          </div>
          <div>
            <h2 id="how-title" className="hp-h2">Code is the <em>smallest</em> doll.</h2>
            <p className="hp-how-lede">How I work, outside in: past the mockup, until it ships.</p>
            <dl className="hp-how-list">
              {RINGS.map((r) => (
                <div key={r.name}>
                  <dt>{r.name}</dt>
                  <dd>{r.line}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The innermost layer: a doll in a doll-shaped frame that opens onto his About site */}
        <section className="hp-wrap hp-section" aria-labelledby="me-title">
          <div className="hp-me">
            <AboutDoll href="https://about.michaelbobov.com/" />
            <div className="hp-me-copy">
              <p className="hp-label">The innermost layer</p>
              <h2 id="me-title" className="hp-me-title">Hi, I’m Michael. <em>There’s one more layer.</em></h2>
              <p className="hp-me-text">The work is the outside. Open the doll to meet the person who made it.</p>
            </div>
          </div>
        </section>

      </main>

    </IntroStage>
  );
}
