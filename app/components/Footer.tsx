'use client';

import { usePathname } from 'next/navigation';
import { Document, External, Mail } from '@/app/components/icons';

// The close: the name returns at full width, one row of ways to reach Michael, one plain line.
// On case studies it lines up with their content container instead of the homepage wrap.
export default function Footer() {
  const pathname = usePathname();
  const caseStudy = pathname?.startsWith('/work/') ?? false;
  const wrap = caseStudy ? 'container mx-auto px-6 md:px-12 lg:px-20 wf-foot-cs' : 'wf-wrap';

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
      {/* The homepage hero photos are CC BY (credit required); the CC0 platform clip is credited anyway */}
      {pathname === '/' && (
        <p className="wf-foot-credits">
          Station photos:{' '}
          <a href="https://commons.wikimedia.org/w/index.php?curid=35447866">&ldquo;Southbound Link arriving at Mount Baker&rdquo;</a>{' '}
          by Chas Redmond, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>;{' '}
          <a href="https://commons.wikimedia.org/w/index.php?curid=80412716">
            &ldquo;JR Ikebukuro Yamanote Line platform and platform doors&rdquo;
          </a>{' '}
          by Nesnad, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>; both via Wikimedia Commons.
          Converted to black and white. Platform footage:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Tokyo_-_Kawagoe_train_passing_by_platform.webm">
            &ldquo;Tokyo - Kawagoe train passing by platform&rdquo;
          </a>{' '}
          by franck injapan, CC0, via Wikimedia Commons.
        </p>
      )}
    </footer>
  );
}
