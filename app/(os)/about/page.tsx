import type { Metadata } from 'next';
import Link from 'next/link';
import { EMAIL, RESUME } from '@/app/components/Site';
import { NOW } from '@/app/data/now';
import { placeOf } from '@/app/data/places';
import { ArrowUpRight } from '@/app/components/icons';
import Nalichnik, { type Picture } from '@/app/components/Nalichnik';
import { FlatDoll } from '@/app/components/FlatDoll';
import '@/app/hp.css';

// About me, a window on MichaelOS's desktop ((os)/layout.tsx, HomeShell's PageWindow). A ruled page: the headline and hello on the left, him standing on
// the hero's bottom rule on the right; a strip of where he is now; then his story as the set itself, three
// panels nested one inside the other, each marked with its doll. The littlest holds a carved storybook
// window: each time its shutters open there's another picture behind them. Contact is its last part
// (#contact; /contact comes here): the ways to reach him, as the Contact page had them.
export const metadata: Metadata = {
  title: 'About',
  description: 'Michael Bobov, a Russian-American product designer in Seattle who builds what he designs, and how to reach him.',
  alternates: { canonical: '/about' },
};

const OTHER_ABOUT = 'https://about.michaelbobov.com/';
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';
// Behind the window's shutters, in turn
const PICTURES: Picture[] = [
  { src: '/about/sunglasses.webp', alt: 'Michael in yellow sunglasses and a striped shirt', caption: 'Me, in yellow sunglasses.' },
  { src: '/about/the-set.webp', alt: 'The three nesting dolls from the homepage, standing in a row', caption: 'The set: Work, Side projects, and me.' },
  { src: '/playground-about.jpg', alt: 'My other About site: a Windows 3.1 desktop on an old monitor', caption: 'My other About site, a Windows 3.1 desktop.', focus: { x: 0.51, y: 0.5 } },
  { src: '/about/portrait.webp', alt: 'Michael, smiling', caption: 'Me again, smiling.' },
];
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

export default function AboutPage() {
  return (
    <div className="os-doc os-me">
        <div className="me">
          <section className="me-hero">
            <div className="me-intro">
              <p className="hp-label">About me</p>
              <h1 id="me-title" className="me-title">There’s more beneath the surface.</h1>
              <p className="me-hello">
                Hey, I’m Michael! I’m a Russian-American product designer, creative thinker, and someone who loves turning ideas into things
                people can actually use.
              </p>
              <ul className="ab-links">
                <li><a href={EMAIL}>Say hello</a></li>
                <li>
                  <a className="is-quiet" href={RESUME} target="_blank" rel="noopener noreferrer">
                    Résumé <ArrowUpRight size={14} strokeWidth={2.25} /><span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
                <li><a className="is-quiet" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<NewTab /></a></li>
              </ul>
            </div>
            {/* His portrait, standing on the hero's bottom rule (the homepage's About doll opens into it) */}
            <div className="me-face"><img className="me-photo" src="/me.webp" alt="Michael Bobov" width={1254} height={1254} /></div>
          </section>

          <ul className="me-facts" aria-label="Right now">
            <li><span>Studying</span>Master’s in Human-Computer Interaction + Design, University of Washington</li>
            <li><span>Building</span><Link href="/work/versum">Versum Health</Link></li>
            <li><span>Based in</span>Seattle</li>
          </ul>

          {/* His story, one doll inside another: each part a panel nested in the one before, marked with
              its doll (the homepage's set, biggest first), down to the littlest, which doesn't open: in it,
              a storybook window that does */}
          <div className="me-layers">
          <section className="me-layer is-outer" aria-labelledby="me-dolls">
            <header className="me-layer-head">
              <FlatDoll i={0} prefix="me-mark" className="me-mark" shadow={false} />
              <h2 id="me-dolls">Why the nesting dolls?</h2>
            </header>
            <div className="me-layer-body">
              <p>You might be wondering why there are Russian nesting dolls all over my portfolio.</p>
              <p>
                Beyond being a nod to my heritage, I like to think of design as a process of uncovering layers. What looks simple on the surface
                often has something much more interesting underneath. The more you explore, question, and understand, the closer you get to what
                really matters.
              </p>
              <p>
                <strong>That’s how I approach design.</strong> I like understanding the people behind the problem, questioning assumptions, and
                finding ways to make complicated things feel intuitive.
              </p>
            </div>

            <section className="me-layer is-middle" aria-labelledby="me-now">
              <header className="me-layer-head">
                <FlatDoll i={1} prefix="me-mark" className="me-mark" shadow={false} />
                <h2 id="me-now">Where I am now</h2>
              </header>
              <div className="me-layer-body">
                <p>
                  I’m currently pursuing my Master’s in Human-Computer Interaction + Design at the University of Washington. I’m particularly
                  interested in the intersection of design, emerging technology, and human behavior.
                </p>
                <p>
                  I’m also a builder at heart. Whether I’m prototyping new interactions, experimenting with AI, or building products like{' '}
                  <Link href="/work/versum">Versum Health</Link>, I love taking ideas beyond Figma and making them real.
                </p>
              </div>

              <section className="me-layer is-core" aria-labelledby="me-outside">
                <header className="me-layer-head">
                  <FlatDoll i={2} prefix="me-mark" className="me-mark" shadow={false} />
                  <h2 id="me-outside">Outside of design?</h2>
                </header>
                <div className="me-layer-body">
                  <p>
                    I’ve been acting since I was six, love surfing, playing guitar, exploring new places, and getting lost in creative side
                    projects.
                  </p>
                  <p>I think those experiences are a big part of what makes me a designer. Curiosity doesn’t stop when I close my laptop.</p>
                  <p>
                    For a less serious version of this page, try my{' '}
                    <a href={OTHER_ABOUT} target="_blank" rel="noopener noreferrer">other About site<NewTab /></a>, a Windows 3.1 desktop where
                    you can play Minesweeper.
                  </p>
                </div>
                <div className="me-door"><Nalichnik pictures={PICTURES} /></div>
              </section>
            </section>
          </section>
          </div>

          <section className="me-end" aria-label="One layer deeper">
            <p className="me-quote">Design, <em className="sweep">one layer</em> deeper.</p>
          </section>

          {/* Contact: the ways to reach him (the Contact page's, word for word) */}
          <section id="contact" className="os-contact" aria-labelledby="contact-title">
            <div className="os-contact-note">
              <p className="os-doc-kicker">Contact</p>
              <h2 id="contact-title" className="os-doc-title">Say hello.</h2>
              <p>I’m a product designer and builder. Write about a role, a project, or something you’re making.</p>
            </div>
            <ul className="os-contact-lines">
              <li><span>Email</span><a href={EMAIL}>michaelbobov@gmail.com</a></li>
              <li><span>LinkedIn</span><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">michael-bobov<NewTab /></a></li>
              <li><span>Résumé</span><a href={RESUME} target="_blank" rel="noopener noreferrer">PDF ↗<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li><span>Based in</span>{placeOf(NOW.place).caption}</li>
            </ul>
          </section>
        </div>
    </div>
  );
}
