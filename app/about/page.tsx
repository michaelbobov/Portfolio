import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteBar, EMAIL, RESUME } from '@/app/components/Site';
import AboutDoll from '@/app/components/AboutDoll';
import { ArrowUpRight } from '@/app/components/icons';
import '../hp.css';

// Me, behind the littlest doll: the innermost layer. A doll in a half-round frame (it bounces and
// spins on hover, and opens on a click), who he is, and the ways to reach him.
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
          </div>
          <div className="ab-copy">
            <p className="hp-label">The innermost layer</p>
            <h1 id="me-title" className="ab-title">Hi, I’m <em>Michael.</em></h1>
            <p className="ab-lead">I’m a product designer in Seattle, and I like the whole job: talking with the people who have the problem, designing the answer, and writing the code that ships it.</p>
            <p>
              <Link href="/work/versum">Versum Health</Link> started with friends skipping the dentist because of the cost. I co-founded it to connect
              uninsured patients with supervised dental students who need them to graduate. <Link href="/side-projects#ez-recipe">EZ Recipe</Link> came
              from home cooks asking what to make with what they already had; I shipped it on my own in two months. When it needed nutrition data
              trapped in messy PDFs, I built <Link href="/side-projects#pdf-penguin">PDF Penguin</Link> in two weeks.
            </p>
            <p>
              I’m Russian American, which is why there are matryoshkas everywhere here, and I have a deep love for Japan. For the less serious version
              of me, my{' '}
              <a href="https://about.michaelbobov.com/" target="_blank" rel="noopener noreferrer">other About site<span className="sr-only"> (opens in a new tab)</span></a>{' '}
              is a Windows 3.1 desktop you can play Minesweeper on.
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

      </main>
    </div>
  );
}
