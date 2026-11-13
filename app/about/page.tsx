import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteBar, EMAIL, RESUME } from '@/app/components/Site';
import AboutDoll from '@/app/components/AboutDoll';
import TodaysFit from '@/app/components/TodaysFit';
import GlassName from '@/app/components/GlassName';
import { ArrowUpRight } from '@/app/components/icons';
import '../hp.css';

// Me, behind the littlest doll. A doll in a half-round frame (it bounces and spins on hover, and opens on
// a click), why the dolls (he's Russian, and one designer holds several jobs), who he is, and the ways to
// reach him; then the site's one sentence.
export const metadata: Metadata = {
  title: 'About',
  description: 'Michael Bobov, a product designer in Seattle who builds what he designs.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="hp">
      <SiteBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="me-title">
        <section className="hp-wrap ab">
          <div className="ab-photo">
            <AboutDoll />
            <TodaysFit />
          </div>
          <div className="ab-copy">
            <p className="hp-label">About me</p>
            <GlassName id="me-title" words={['Hi,', 'I’m', 'Michael.']} className="gt-about" />
            <p className="ab-lead">
              The matryoshkas are here because I’m Russian American. They also describe how I work: I’m one product designer with a researcher,
              a prototyper and a front-end developer inside.
            </p>
            <p>
              I’m based in Seattle and co-founded <Link href="/work/versum">Versum Health</Link>. I like taking a product from the first
              conversation with the people who need it to the code that ships it.
            </p>
            <p>
              Outside work, I love Japan. For a less serious version of this page, try my{' '}
              <a href="https://about.michaelbobov.com/" target="_blank" rel="noopener noreferrer">other About site<span className="sr-only"> (opens in a new tab)</span></a>,
              a Windows 3.1 desktop where you can play Minesweeper.
            </p>
            <ul className="ab-links">
              <li>
                <a href={RESUME} target="_blank" rel="noopener noreferrer">
                  Résumé <ArrowUpRight size={14} strokeWidth={2.25} /><span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </li>
              <li><a className="is-quiet" href={EMAIL}>Email</a></li>
              <li>
                <a className="is-quiet" href="https://www.linkedin.com/in/michael-bobov-94b61b202/" target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* The site's one sentence (the dolls are explained at the top) */}
        <section className="hp-wrap ab-why" aria-labelledby="why-title">
          <h2 id="why-title" className="ab-why-title">Design, <em className="sweep">one layer</em> deeper.</h2>
        </section>
      </main>
    </div>
  );
}
