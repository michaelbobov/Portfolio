import type { CSSProperties } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import IntroStage from '@/app/components/IntroStage';
import ComicKeyword from '@/app/components/ComicKeyword';
import PunchBuddy from '@/app/components/PunchBuddy';
import SkillStickers from '@/app/components/SkillStickers';
import FeaturedWork from '@/app/components/FeaturedWork';
import LivingTitle from '@/app/components/LivingTitle';
import type { Project } from '@/app/components/FeaturedWork';
import { ArrowRight } from '@/app/components/icons';
import { offTheClock } from '@/app/data/offTheClock';
import './home.css';

// Featured work, laid out as a comic page: wide, two halves, wide. Every fact comes from the
// project descriptions and case studies; live URLs only where the case study links one.
const projects: Project[] = [
  {
    id: 'versum',
    name: 'Versum Health',
    number: 'CASE STUDY 01',
    lead: 'Versum Health:',
    rest: 'a two-sided marketplace connecting uninsured patients with supervised dental students.',
    meta: 'Co-founder · Live MVP',
    ticker: ['LIVE MVP', 'CO-FOUNDER', 'HEALTHCARE', 'MARKETPLACE', '6 MONTHS', '2025'],
    link: '/work/versum',
    live: 'https://versumhealth.com/',
    heroImage: '/versumheroimage.png',
    bg: '#020401',
    fit: 'contain',
    size: 'wide',
  },
  {
    id: 'ez-recipe',
    name: 'EZ Recipe',
    number: 'CASE STUDY 02',
    lead: 'EZ Recipe, live with 400+ recipes generated:',
    rest: 'an AI recipe generator built around what’s already in your kitchen.',
    meta: 'Founder · Live',
    ticker: ['LIVE', 'FOUNDER', 'CONSUMER AI', '400+ RECIPES', '2 MONTHS', '2025'],
    link: '/work/ez-recipe',
    live: 'https://ezrecipe.app',
    heroImage: '/ezrecipehero.png',
    bg: '#cfe8de',
    fit: 'cover',
    size: 'half',
  },
  {
    id: 'pdf-penguin',
    name: 'PDF Penguin',
    number: 'CASE STUDY 03',
    lead: 'PDF Penguin turns messy PDFs into structured JSON',
    rest: 'with drag-and-drop and plain-language prompts.',
    meta: 'Founder · Pre-launch',
    ticker: ['PRE-LAUNCH', 'FOUNDER', 'AI', 'DEVELOPER TOOLS', '2 WEEKS', '2025'],
    link: '/work/pdf-penguin',
    heroImage: '/pdfpenguinhero.png',
    bg: '#4a2a7a',
    fit: 'cover',
    size: 'half',
  },
  {
    id: 'spotify-loop',
    name: 'Spotify Loop',
    number: 'CASE STUDY 04',
    lead: 'Spotify Loop:',
    rest: 'an unofficial concept for native song-section looping inside Spotify’s mobile player.',
    meta: 'Product designer · Concept',
    ticker: ['CONCEPT', 'UNOFFICIAL', 'MOBILE', 'FEATURE DESIGN', '1 WEEK', '2025'],
    link: '/work/spotify-loop',
    heroImage: '/spotifyloophero.png',
    bg: '#2b2b2b',
    fit: 'cover',
    size: 'wide',
  },
];

// What Michael is doing now
const today = [
  { what: 'Co-founding Versum Health', when: '2025–' },
  { what: 'Designing and building AI tools', when: 'Ongoing' },
];

// Headline words pop up one after another (CSS reads --i for the stagger)
const word = (i: number): CSSProperties => ({ '--i': i } as CSSProperties);

// "messy ideas": each letter gets a fixed tilt (deg) and nudge (em) from a seeded list, so the
// mess is stable across renders; hovering tidies them into a straight line (home.css)
const MESS = [
  [-7, 0.04], [5, -0.05], [-3, 0.02], [9, -0.03], [-5, 0.06],
  [6, -0.02], [-9, 0.05], [3, -0.06], [-6, 0.01], [8, 0.04], [-4, -0.04],
];
const messy = (text: string) =>
  Array.from(text).map((ch, i) =>
    ch === ' ' ? (
      ' '
    ) : (
      <span key={i} className="mc" style={{ '--mr': `${MESS[i % MESS.length][0]}deg`, '--my': `${MESS[i % MESS.length][1]}em` } as CSSProperties}>
        {ch}
      </span>
    )
  );

// Splits a short phrase into letter spans for the hover "jelly" on "More about me!"
const letters = (text: string) =>
  Array.from(text).map((ch, i) => (
    <span key={i} className="ch">
      {ch}
    </span>
  ));

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
          <div className="wf-hero-copy">
            {/* An editorial mix: serif italics for the small words, heavy grotesk for the name, deliberately
                messy letters for "messy ideas" (hover tidies them), and the comic burst at the end.
                Screen readers get the full sentence; the drawn words are visual only. */}
            <h1 className="wf-ed-h1">
              <span className="sr-only">
                Hi, I&apos;m Michael, a product designer in Seattle. I turn messy ideas into real products, live apps and shipped code.
              </span>
              <span className="wf-ed" aria-hidden="true">
                <span className="wf-w ed-s" style={word(0)}>Hi,</span>{' '}
                <span className="wf-w ed-g ed-shadow" style={word(1)}>I&apos;m Michael.</span>{' '}
                <span className="wf-w ed-s" style={word(2)}>I turn</span>{' '}
                <span className="wf-w ed-g ed-messy" style={word(3)}>{messy('messy ideas')}</span>{' '}
                {/* "into" stays on the burst's line */}
                <span className="ed-nowrap">
                  <span className="wf-w ed-s" style={word(4)}>into</span>
                  <span className="wf-w" style={word(5)}><ComicKeyword /></span>
                </span>
              </span>
            </h1>
            {/* A comic narration caption */}
            <Link href="/work/versum" className="wf-caption">
              <span className="wf-caption-kicker">MEANWHILE…</span>
              <span className="wf-caption-text">
                Co-founding Versum Health
                <ArrowRight size={20} />
              </span>
            </Link>
          </div>
          <PunchBuddy />
        </div>

        <section className="wf-skills" aria-labelledby="skills-title">
          <SkillStickers />
        </section>

        <section id="work" className="wf-section scroll-mt-6" aria-labelledby="work-title">
          <LivingTitle id="work-title" text="Featured Work" className="wf-giant" />
          <FeaturedWork projects={projects} />
        </section>

        <section className="wf-section wf-more-sec" aria-labelledby="more-title">
          <h2 id="more-title" className="sr-only">About</h2>
          <a className="wf-more" href="https://about.michaelbobov.com/">
            <span className="wf-more-line">
              <span className="wf-more-speed" aria-hidden="true"><i /><i /><i /></span>
              <span className="sr-only">More about me</span>
              {/* A small sticker mix; the letters jelly on hover */}
              <span className="wf-more-text" aria-hidden="true">
                <span className="mx-x">{letters('MORE')}</span>{' '}
                <span className="mx-y">{letters('about')}</span>{' '}
                <span className="mx-z">{letters('me!')}</span>
              </span>
              <ArrowRight size={48} strokeWidth={2.5} className="wf-more-arrow" />
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
