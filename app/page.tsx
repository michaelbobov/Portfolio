import type { CSSProperties } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import IntroStage from '@/app/components/IntroStage';
import WorkList from '@/app/components/WorkList';
import type { WorkItem } from '@/app/components/WorkList';
import { ArrowRight } from '@/app/components/icons';
import { offTheClock } from '@/app/data/offTheClock';
import './home.css';

// Selected work, in order
const projects: (WorkItem & { year: string })[] = [
  {
    id: 'versum',
    title: 'Versum Health',
    description: 'Co-founded a two-sided marketplace connecting uninsured patients with supervised dental students. Live MVP.',
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
    heroImage: '/ezrecipehero.png',
    link: '/work/ez-recipe',
    role: 'Consumer AI',
    status: 'Live',
    live: true,
    year: '2025'
  },
  {
    id: 'pdf-penguin',
    title: 'PDF Penguin',
    description: 'Drag-and-drop tool that turns messy PDFs into structured JSON using plain-language prompts.',
    heroImage: '/pdfpenguinhero.png',
    link: '/work/pdf-penguin',
    role: 'Developer tool',
    status: 'Pre-launch',
    live: false,
    year: '2025'
  },
  {
    id: 'spotify-loop',
    title: 'Spotify Loop',
    description: 'Unofficial concept: native song-section looping inside Spotify’s mobile player.',
    heroImage: '/spotifyloophero.png',
    link: '/work/spotify-loop',
    role: 'Feature concept',
    status: 'Concept',
    live: false,
    year: '2025'
  }
];

const years = Array.from(new Set(projects.map((p) => p.year))).sort();
const workNote =
  years.length === 1
    ? `${projects.length} projects, all from ${years[0]}`
    : `${projects.length} projects, from ${years[0]} to ${years[years.length - 1]}`;

// What Michael is doing now
const today = [
  { what: 'Co-founding Versum Health', when: '2025–' },
  { what: 'Designing and building AI tools', when: 'Ongoing' },
];

// Headline lines rise in a stagger; odd lines are indented on wider screens
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
        </div>

        <section id="work" className="wf-section scroll-mt-6" aria-labelledby="work-title">
          <div className="wf-head">
            <h2 id="work-title">Selected work</h2>
            <p>{workNote}</p>
          </div>
          <WorkList items={projects} />
        </section>

        <section className="wf-section" aria-labelledby="more-title">
          <h2 id="more-title" className="sr-only">About</h2>
          <a className="wf-more" href="https://about.michaelbobov.com/">
            <span className="wf-more-line">
              <span className="wf-more-text">More about me</span>
              <ArrowRight size={40} className="wf-more-arrow" />
            </span>
            <span className="wf-more-url">about.michaelbobov.com</span>
          </a>
        </section>

        <section className="wf-section wf-now">
          <div>
            <h2>Today</h2>
            <ul className="wf-list">
              {today.map((t) => (
                <li key={t.what}>
                  <span>{t.what}</span>
                  <span className="wf-list-note">{t.when}</span>
                </li>
              ))}
            </ul>
          </div>
          {offTheClock.length > 0 && (
            <div>
              <h2>Off the clock</h2>
              <ul className="wf-list">
                {offTheClock.map((t) => (
                  <li key={t.what}>
                    <span>{t.what}</span>
                    {t.note && <span className="wf-list-note">{t.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </IntroStage>
  );
}
