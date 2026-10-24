'use client';

import { usePathname } from 'next/navigation';
import { Document, External, Mail } from '@/app/components/icons';

// The close: the name returns at full width, one row of ways to reach Michael, one plain line.
// The same everywhere; case studies only sit a little closer to their last panel.
export default function Footer() {
  const pathname = usePathname();
  const caseStudy = pathname?.startsWith('/work/') ?? false;
  // The homepage closes with its own invitation and footer row
  if (pathname === '/') return null;
  const wrap = caseStudy ? 'wf-wrap wf-foot-cs' : 'wf-wrap';

  return (
    <footer className={`${wrap} w-full wf-foot`}>
      <p className="wf-foot-name">Michael Bobov</p>
      <ul className="wf-foot-links">
        <li>
          <a href="mailto:michaelbobov@gmail.com">
            <Mail size={18} />
            michaelbobov@gmail.com
          </a>
        </li>
        <li>
          <a href="/Michael Bobov - Product Designer.pdf" target="_blank" rel="noopener noreferrer">
            <Document size={18} />
            Resume<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href="https://about.michaelbobov.com/">
            <External size={18} />
            About
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/michael-bobov-94b61b202/" target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
      <p className="wf-foot-note">Product designer in Seattle</p>
    </footer>
  );
}
