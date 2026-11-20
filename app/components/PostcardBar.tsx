import Image from 'next/image';
import Link from 'next/link';
import { RESUME } from '@/app/components/Site';

// The top of the postcard pages: his MB mark (home) and the résumé as a pill of black ink. The ways round
// the site are the glass bar at the bottom of every page (Dock), so the top stays quiet. (`current` and
// `home` are kept for the pages that still pass them.)
export default function PostcardBar(_props: { current?: string; home?: boolean }) {
  return (
    <header className="pc-bar">
      <Link href="/" className="pc-mark" aria-label="Michael Bobov: home">
        <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
      </Link>
      <nav aria-label="Site">
        <ul className="pc-nav">
          <li>
            <a className="pc-pill" href={RESUME} target="_blank" rel="noopener noreferrer">
              Résumé <span aria-hidden="true">↗</span><span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
