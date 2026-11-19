import Image from 'next/image';
import Link from 'next/link';
import { RESUME } from '@/app/components/Site';

// The top of the postcard pages: his MB mark, then the ways in, in the dolls' order (Projects, Play, About),
// Contact, and the résumé as a pill of black ink. Pointing at a word draws a yellow crayon line
// under it (postcard.css); the page you're on keeps its line. It's also the plain way round the site for
// anyone who doesn't use the dolls (and on every screen size).
export const SECTIONS = [
  { href: '/work', label: 'Projects' },
  { href: '/side-projects', label: 'Play' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function PostcardBar({ current }: { current?: string }) {
  return (
    <header className="pc-bar">
      <Link href="/" className="pc-mark" aria-label="Michael Bobov: home">
        <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
      </Link>
      <nav aria-label="Site">
        <ul className="pc-nav">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} aria-current={current === s.href ? 'page' : undefined}>{s.label}</Link>
            </li>
          ))}
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
