import IntroStage from '@/app/components/IntroStage';
import DollSet from '@/app/components/DollSet';
import Durak from '@/app/components/Durak';
import PostcardBar from '@/app/components/PostcardBar';
import Landscape from '@/app/components/Landscape';
import ProjectStrip from '@/app/components/ProjectStrip';
import { NOW } from '@/app/data/now';
import './hp.css';
import './postcard.css';

// The homepage, a living postcard: his name huge in an italic serif, set behind four matryoshka dolls
// (the way in: Projects, About, Play, Contact, the same as the bar on top), a red sun behind the name and,
// behind it all, a print of where he is (Landscape, data/places.ts), with a little paper label saying so.
// Straight under it, the work as torn-paper cards (ProjectStrip), with a playing card tucked behind them
// that deals a game of Durak. Styles: postcard.css (and the dolls' own in hp.css).
export default function Home() {
  return (
    <IntroStage className="hp hp-home pc">
      <PostcardBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className="pc-hero" aria-labelledby="hero-title">
          <Landscape initial={NOW.place} />
          <h1 id="hero-title" className="pc-name">Michael Bobov</h1>
          <p className="pc-role">Product Designer &amp; Builder</p>
          <div className="pc-set">
            <DollSet />
          </div>
        </section>
        <ProjectStrip>
          {/* (an easter egg: the card tucked behind the projects deals a game of Durak) */}
          <Durak />
        </ProjectStrip>
        {/* Credit for the December hats (CC BY 3.0), shown only while they are (hp.css) */}
        <p className="hp-credit">
          Santa hat: <a href="https://poly.pizza/m/84MpXMAPNQ" target="_blank" rel="noopener noreferrer">“Santa Hat” by J-Toastie<span className="sr-only"> (opens in a new tab)</span></a>,{' '}
          <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0<span className="sr-only"> (opens in a new tab)</span></a>
        </p>
      </main>
    </IntroStage>
  );
}
