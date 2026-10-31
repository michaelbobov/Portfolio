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
            <p>I’m a product designer in Seattle, and I build what I design: from the first conversation with the people who need it to the code that ships.</p>
            <p>
              I co-founded <Link href="/work/versum">Versum Health</Link>, a marketplace where uninsured patients book care from supervised dental
              students. On the side I designed and built <Link href="/side-projects#ez-recipe">EZ Recipe</Link>, live at ezrecipe.app, and{' '}
              <Link href="/side-projects#pdf-penguin">PDF Penguin</Link>, a PDF-to-JSON tool I made because EZ Recipe needed it.
            </p>
            <p>
              I’m Russian American, with a deep love for Japan, and above all a maker. My other About site is a Windows 3.1 desktop you can play
              games on; it’s with my <Link href="/side-projects">side projects</Link>, and <Link href="/how-i-work">how I work</Link> is one doll over.
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
