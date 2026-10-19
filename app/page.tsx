import type { CSSProperties } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import IntroStage from '@/app/components/IntroStage';
import StationSign from '@/app/components/StationSign';
import RouteMap from '@/app/components/RouteMap';
import type { RouteStop } from '@/app/components/RouteMap';
import DailyStops from '@/app/components/DailyStops';
import TransferSign from '@/app/components/TransferSign';
import HeroNav from '@/app/components/HeroNav';
import HeroPhotos from '@/app/components/HeroPhotos';
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
    fit: 'contain',
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

const years = Array.from(new Set(projects.map((p) => p.year))).sort();
const routeNote =
  years.length === 1
    ? `${projects.length} stops, all from ${years[0]}`
    : `${projects.length} stops, from ${years[0]} to ${years[years.length - 1]}`;

// Headline lines rise in a stagger; odd lines are indented on wider screens, the last is a quieter note
const line = (i: number): CSSProperties => ({ '--i': i } as CSSProperties);

export default function Home() {
  return (
    <IntroStage className="wf-home">
      {/* Without script the bar is not fixed, so it scrolls away with the photo instead of sitting white on the ground */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.wf-topbar{position:absolute}</style>' }} />
      <HeroNav>
        <nav aria-label="Primary" className="wf-wrap flex justify-between items-center gap-4 py-[22px] text-sm">
          <Link href="/" className="font-semibold whitespace-nowrap">
            Michael Bobov
          </Link>
          <Navigation />
        </nav>
      </HeroNav>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <div className="wf-hero">
          <div className="wf-hero-band" data-hero>
            <HeroPhotos />
            <div className="wf-hero-scrim" aria-hidden="true" />
            <div className="wf-wrap wf-hero-copy">
              <h1 className="wf-lines">
                <span style={line(0)}><span>I&apos;m Michael,</span></span>
                <span className="wf-in" style={line(1)}><span>a product designer</span></span>
                <span style={line(2)}><span>in Seattle. I ship</span></span>
                <span className="wf-in" style={line(3)}><span>what I design.</span></span>
                <span className="wf-dim" style={line(4)}>
                  <span>Co-founding <Link href="/work/versum">Versum Health</Link>.</span>
                </span>
              </h1>
            </div>
          </div>
          <div className="wf-wrap wf-hero-signwrap">
            <StationSign />
          </div>
        </div>

        <div className="wf-wrap">
          <section id="work" className="wf-section scroll-mt-24" aria-labelledby="work-title">
            <div className="wf-head">
              <h2 id="work-title">Selected work</h2>
              <p>{routeNote}</p>
            </div>
            <RouteMap stops={projects} />
          </section>
        </div>

        {/* Full bleed: the transfer sign hangs over real platform footage */}
        <section className="wf-section" aria-labelledby="transfer-title" data-route-end>
          <h2 id="transfer-title" className="sr-only">Transfer</h2>
          <TransferSign />
        </section>

        <div className="wf-wrap">
          <DailyStops />
        </div>
      </main>
    </IntroStage>
  );
}
