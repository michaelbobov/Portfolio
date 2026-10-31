import Link from 'next/link';
import { ArrowUpRight } from '@/app/components/icons';
import { SHAPE } from '@/app/data/layers';

// The frame every page shares: the bar on top (the mark and the name; LinkedIn, Email and the résumé)
// and the close at the bottom (an invitation to open something, then one slim row). The sections are
// in the floating nav (Dock.tsx), not the bar. Styles: site.css.
export const EMAIL = 'mailto:michaelbobov@gmail.com';
export const RESUME = '/Michael Bobov - Product Designer.pdf';
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';

export function SiteBar() {
  return (
    <header className="site-wrap sb">
      <Link href="/" className="sb-brand" aria-label="Michael Bobov, product designer: home">
        {/* The mark: the homepage set in miniature, a big doll and the next one out beside it, each with
            a face. On hover the little one hops. */}
        <svg className="sb-mark" viewBox="0 0 330 260" aria-hidden="true" focusable="false">
          <g className="sb-mark-small">
            <path d={SHAPE} transform="translate(178 104) scale(0.6)" fill="#c4b5fd" />
            <ellipse cx="238" cy="155" rx="17" ry="19" fill="#fff8f2" />
          </g>
          <path d={SHAPE} fill="#8b5cf6" />
          <ellipse cx="100" cy="86" rx="29" ry="32" fill="#fff8f2" />
          <path d="M60 46c8-15 20-24 34-28" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="10" strokeLinecap="round" />
        </svg>
        <span className="sb-id" aria-hidden="true">
          <span className="sb-name">Michael Bobov</span>
          <span className="sb-role">Product designer</span>
        </span>
      </Link>
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
        <h2 id="end-title" className="sc-title">Let’s open <em className="sweep">something.</em></h2>
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
