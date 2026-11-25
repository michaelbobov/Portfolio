import Image from 'next/image';
import Link from 'next/link';
import OsFrameTop from '@/app/components/OsFrameClock';
import { RESUME } from '@/app/components/Site';
import { NOW } from '@/app/data/now';
import { placeOf } from '@/app/data/places';
import '@/app/os-bar.css';

// The frame of the pages outside MichaelOS's desktop (the case studies, SkillTree): the same menu bar on top
// (his mark goes home to the desktop; the site's pages, Contact, the résumé; his signature, the sun dial and
// the time there, in the middle), and under it a strip of the sky as it is in Seattle now, the painting of
// this time of day, fading into the page. The reading below is the page's own. Styles: os-bar.css.
// The pages are rendered once, at build time, so the time of day (the sky, the night bar, the clock) is
// worked out in the browser, in OsFrameTop, from one tick a minute.
// `current` is the section the page belongs to (a case study: /work): its link is lit, but not announced as
// the current page, since the page is inside it rather than it.
export default function OsFrame({ current }: { current?: string }) {
  const place = placeOf(NOW.place);
  const pages = [{ href: '/work', label: 'Work' }, { href: '/side-projects', label: 'Side Projects' }, { href: '/about', label: 'About' }];
  return (
    <OsFrameTop scenes={place.scenes} timeZone={NOW.timeZone} lat={NOW.lat} lon={NOW.lon}>
      <nav className="os-bar-l" aria-label="Main">
        <Link className="os-mi os-mark" href="/" aria-label="MichaelOS: the desktop (home)">
          <Image src="/mb-mark.png" alt="" width={129} height={160} priority />
        </Link>
        {pages.map((p) => <Link key={p.href} className="os-mi" href={p.href} data-on={current === p.href ? '' : undefined}>{p.label}</Link>)}
        <Link className="os-mi" href="/about#contact">Contact</Link>
        <a className="os-mi" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="os-out" aria-hidden="true">↗</span><span className="sr-only"> (PDF, opens in a new tab)</span></a>
      </nav>
      <div className="os-bar-r" />
    </OsFrameTop>
  );
}
