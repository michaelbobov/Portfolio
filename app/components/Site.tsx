import Link from 'next/link';
import { ArrowUpRight } from '@/app/components/icons';

// The frame every page shares: the bar on top (the name; LinkedIn, Email and the résumé)
// and the close at the bottom (an invitation to build something, then one slim row). The sections are
// in the floating nav (Dock.tsx), not the bar. Styles: site.css.
export const EMAIL = 'mailto:michaelbobov@gmail.com';
export const RESUME = '/Michael Bobov - Product Designer.pdf';
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';

/** `brand`: off on the homepage, where the name is the hero */
export function SiteBar({ brand = true }: { brand?: boolean }) {
  return (
    <header className="site-wrap sb">
      {brand && (
        <Link href="/" className="sb-brand" aria-label="Michael Bobov, product designer: home">
          {/* The name, in the titles' face */}
          <span className="sb-name" aria-hidden="true">Michael Bobov</span>
          <span className="sb-role" aria-hidden="true">Product designer</span>
        </Link>
      )}
      <ul className="sb-end">
        <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
        <li><a href={EMAIL}>Email</a></li>
        <li><a href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="sr-only"> (PDF, opens in a new tab)</span></a></li>
      </ul>
    </header>
  );
}

export function SiteClose() {
  return (
    <footer className="site-wrap sc">
      <section className="sc-end" aria-labelledby="end-title">
        <h2 id="end-title" className="sc-title">Let’s build <em className="sweep">something.</em></h2>
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
          <li><Link href="/about">About</Link></li>
        </ul>
      </div>
    </footer>
  );
}
