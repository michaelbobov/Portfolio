import type { CSSProperties } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import IntroStage from '@/app/components/IntroStage';
import StationSign from '@/app/components/StationSign';
import RouteMap from '@/app/components/RouteMap';
import type { RouteStop } from '@/app/components/RouteMap';
import DailyStops from '@/app/components/DailyStops';
import './home.css';

// Project data, in route order (MB01–MB04)
const projects: (RouteStop & { year: string })[] = [
  {
    id: 'versum',
    title: 'Versum Health',
    description: 'Co-founded a two-sided marketplace connecting uninsured patients with supervised dental students. Live MVP.',
    tags: ['Healthcare', 'Marketplace'],
    heroImage: '/versumheroimage.png',
    link: '/work/versum',
    role: 'Co-founder',
    status: 'Live MVP',
    live: true,
    bg: '#020401',
    year: '2025'
  },
  {
    id: 'ez-recipe',
    title: 'EZ Recipe',
    description: 'AI recipe generator built around what’s already in your kitchen. Live, with 400+ recipes generated.',
    tags: ['Consumer', 'AI'],
    heroImage: '/ezrecipehero.png',
    link: '/work/ez-recipe',
    role: 'Consumer AI',
    status: 'Live',
    live: true,
    bg: '#cfe8de',
    year: '2025'
  },
  {
    id: 'pdf-penguin',
    title: 'PDF Penguin',
    description: 'Drag-and-drop tool that turns messy PDFs into structured JSON using plain-language prompts.',
    tags: ['AI', 'Developer Tools'],
    heroImage: '/pdfpenguinhero.png',
    link: '/work/pdf-penguin',
    role: 'Developer tool',
    status: 'Pre-launch',
    live: false,
    bg: '#4a2a7a',
    year: '2025'
  },
  {
    id: 'spotify-loop',
    title: 'Spotify Loop',
    description: 'Unofficial concept: native song-section looping inside Spotify’s mobile player.',
    tags: ['Mobile', 'Feature Design'],
    heroImage: '/spotifyloophero.png',
    link: '/work/spotify-loop',
    role: 'Feature concept',
    status: 'Concept',
    live: false,
    bg: '#2b2b2b',
    year: '2025'
  }
];

const years = Array.from(new Set(projects.map((p) => p.year))).join(', ');

// Headline lines; odd lines are indented, the last is dimmed
const line = (i: number): CSSProperties => ({ '--i': i } as CSSProperties);

export default function Home() {
  return (
    <IntroStage className="wf-home">
      <header className="wf-wrap">
        <nav aria-label="Primary" className="flex justify-between items-center gap-4 py-[22px] text-sm">
          <Link href="/" className="font-semibold whitespace-nowrap">
            Michael Bobov
          </Link>
          <Navigation />
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="wf-wrap focus:outline-none">
        <div className="wf-hero">
          <h1 className="wf-lines">
            <span style={line(0)}><span>I&apos;m Michael,</span></span>
            <span className="wf-in" style={line(1)}><span>a product designer</span></span>
            <span style={line(2)}><span>in Seattle. I ship</span></span>
            <span className="wf-in" style={line(3)}><span>what I design.</span></span>
            <span className="wf-dim" style={line(4)}>
              <span>Co-founding <Link href="/work/versum">Versum Health</Link>.</span>
            </span>
          </h1>
          <StationSign />
        </div>

        <section id="work" className="wf-section scroll-mt-6" aria-labelledby="work-title">
          <div className="wf-head">
            <h2 id="work-title">Selected work</h2>
            <span>{projects.length} stops · {years}</span>
          </div>
          <RouteMap stops={projects} />
        </section>

        <section className="wf-section" aria-labelledby="transfer-title">
          <div className="wf-head">
            <h2 id="transfer-title">Transfer</h2>
            <span lang="ja" className="wf-jp">乗換</span>
          </div>
          <a className="wf-transfer" href="https://about.michaelbobov.com/">
            <span className="wf-kanji" aria-hidden="true">乗換</span>
            <span>
              <span className="wf-t1">More about me</span>
              <br />
              <span className="wf-t2">about.michaelbobov.com</span>
            </span>
            <span className="wf-go" aria-hidden="true">→</span>
          </a>
        </section>

        <DailyStops />
      </main>
    </IntroStage>
  );
}
