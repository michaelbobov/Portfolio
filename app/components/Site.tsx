import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowUpRight } from '@/app/components/icons';
import { SHAPE } from '@/app/data/layers';

// The frame every page shares: the bar on top (the name with a little doll, the nav, one action) and
// the close at the bottom (an invitation to open something, then one slim row). Styles: site.css.
export const EMAIL = 'mailto:michaelbobov@gmail.com';
export const RESUME = '/Michael Bobov - Product Designer.pdf';
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';

export function SiteBar() {
  return (
    <header className="site-wrap sb">
      <Link href="/" className="sb-brand">
        <svg className="sb-doll" viewBox="0 0 200 260" aria-hidden="true" focusable="false">
          <path d={SHAPE} fill="#8b5cf6" />
        </svg>
        Michael Bobov
      </Link>
      <div className="sb-end">
        <Navigation />
        <a className="sb-hello" href={EMAIL}>Say hello</a>
      </div>
    </header>
  );
}

export function SiteClose() {
  return (
    <footer className="site-wrap sc">
      <section className="sc-end" aria-labelledby="end-title">
        <h2 id="end-title" className="sc-title">Let’s open <em>something.</em></h2>
        <div className="sc-actions">
          <a className="site-btn" href={EMAIL}>michaelbobov@gmail.com <ArrowUpRight size={18} strokeWidth={2.25} /></a>
          <a className="sc-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span> <ArrowUpRight size={16} strokeWidth={2.25} />
          </a>
        </div>
      </section>
      <div className="sc-row">
        <p>© 2026 Michael Bobov · Product designer in Seattle</p>
        <ul>
          <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={RESUME} target="_blank" rel="noopener noreferrer">Résumé</a></li>
          <li><a href={EMAIL}>Email</a></li>
          <li><a href="https://about.michaelbobov.com/">About</a></li>
        </ul>
      </div>
    </footer>
  );
}
