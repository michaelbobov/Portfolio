import type { CSSProperties } from 'react';
import { SiteBar } from '@/app/components/Site';
import IntroStage from '@/app/components/IntroStage';
import DollSet from '@/app/components/DollSet';
import { INTRO } from '@/app/data/intro';
import './hp.css';

// "Design, one layer deeper": the homepage is one sentence with the matryoshka in the middle of it.
// The words arrive one layer at a time as the set opens, and the four dolls are the way in (Work,
// Side projects, How I work, and the littlest, About me), mirrored by the nav at the bottom. The
// bar is the shared one (Site.tsx); the shared close is left off this page.
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <IntroStage className="hp">
      <SiteBar />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* One sentence with the dolls in the middle of it: "Design," on one side, "one layer deeper."
            on the other. Screen readers get the sentence whole. */}
        <section className="hp-wrap hp-stage" aria-labelledby="hero-title">
          <h1 id="hero-title" className="sr-only">Design, one layer deeper.</h1>
          <div className="hp-side hp-side-l" aria-hidden="true">
            <p className="hp-word"><span className="hp-line"><span style={at(INTRO.design)}>Design,</span></span></p>
          </div>
          <DollSet />
          <div className="hp-side hp-side-r">
            <p className="hp-word" aria-hidden="true">
              <span className="hp-line"><em className="sweep" style={at(INTRO.layer)}>one layer</em></span>
              <span className="hp-line hp-deep">
                {Array.from('deeper.').map((ch, i) => (
                  <span key={i} className="hp-ch" style={at(INTRO.deeper + i * INTRO.letter)}>{ch}</span>
                ))}
              </span>
            </p>
          </div>
        </section>
      </main>
    </IntroStage>
  );
}
