import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteBar, EMAIL, RESUME } from '@/app/components/Site';
import { ArrowUpRight } from '@/app/components/icons';
import '../hp.css';

// Me, behind the littlest doll. The homepage's About doll flies you into its painted face, whose glaze
// melts into his photo; its window then opens out into the portrait here (DollSet). A ruled page: the
// headline and hello on the left, him standing on the hero's bottom rule on the right; a strip of where he
// is now; then his story in three parts, each a heading on the left and the words on the right.
export const metadata: Metadata = {
  title: 'About',
  description: 'Michael Bobov, a Russian-American product designer in Seattle who builds what he designs.',
  alternates: { canonical: '/about' },
};

const OTHER_ABOUT = 'https://about.michaelbobov.com/';
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

export default function AboutPage() {
  return (
    <div className="hp">
      <SiteBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="me-title">
        <div className="me">
          <section className="me-hero">
            <div className="me-intro">
              <p className="hp-label">About me</p>
              <h1 id="me-title" className="me-title">There’s more beneath the surface.</h1>
              <p className="me-hello">
                Hey, I’m Michael! I’m a Russian-American product designer, creative thinker, and someone who loves turning ideas into things
                people can actually use.
              </p>
              <ul className="ab-links">
                <li><a href={EMAIL}>Say hello</a></li>
                <li>
                  <a className="is-quiet" href={RESUME} target="_blank" rel="noopener noreferrer">
                    Résumé <ArrowUpRight size={14} strokeWidth={2.25} /><span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
                <li><a className="is-quiet" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<NewTab /></a></li>
              </ul>
            </div>
            {/* His portrait, standing on the hero's bottom rule (the homepage's About doll opens into it) */}
            <div className="me-face"><img className="me-photo" src="/me.webp" alt="Michael Bobov" width={1254} height={1254} /></div>
          </section>

          <ul className="me-facts" aria-label="Right now">
            <li><span>Studying</span>Master’s in Human-Computer Interaction + Design, University of Washington</li>
            <li><span>Building</span><Link href="/work/versum">Versum Health</Link></li>
            <li><span>Based in</span>Seattle</li>
          </ul>

          <section className="me-part" aria-labelledby="me-dolls">
            <h2 id="me-dolls">Why the nesting dolls?</h2>
            <div>
              <p>You might be wondering why there are Russian nesting dolls all over my portfolio.</p>
              <p>
                Beyond being a nod to my heritage, I like to think of design as a process of uncovering layers. What looks simple on the surface
                often has something much more interesting underneath. The more you explore, question, and understand, the closer you get to what
                really matters.
              </p>
              <p>
                <strong>That’s how I approach design.</strong> I like understanding the people behind the problem, questioning assumptions, and
                finding ways to make complicated things feel intuitive.
              </p>
              <p className="me-quote">Design, <em className="sweep">one layer</em> deeper.</p>
            </div>
          </section>

          <section className="me-part" aria-labelledby="me-now">
            <h2 id="me-now">Where I am now</h2>
            <div>
              <p>
                I’m currently pursuing my Master’s in Human-Computer Interaction + Design at the University of Washington. I’m particularly
                interested in the intersection of design, emerging technology, and human behavior.
              </p>
              <p>
                I’m also a builder at heart. Whether I’m prototyping new interactions, experimenting with AI, or building products like{' '}
                <Link href="/work/versum">Versum Health</Link>, I love taking ideas beyond Figma and making them real.
              </p>
            </div>
          </section>

          <section className="me-part" aria-labelledby="me-outside">
            <h2 id="me-outside">Outside of design?</h2>
            <div>
              <p>
                I’ve been acting since I was six, love surfing, playing guitar, exploring new places, and getting lost in creative side projects.
              </p>
              <p>
                I think those experiences are a big part of what makes me a designer. Curiosity doesn’t stop when I close my laptop.
              </p>
              <p>
                For a less serious version of this page, try my{' '}
                <a href={OTHER_ABOUT} target="_blank" rel="noopener noreferrer">other About site<NewTab /></a>, a Windows 3.1 desktop where you can
                play Minesweeper.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
