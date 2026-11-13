import type { CSSProperties } from 'react';
import { SiteBar } from '@/app/components/Site';
import IntroStage from '@/app/components/IntroStage';
import DollSet from '@/app/components/DollSet';
import SnowBackdrop from '@/app/components/SnowBackdrop';
import SnowToggle from '@/app/components/SnowToggle';
import SnowballThrow from '@/app/components/SnowballThrow';
import NowLine from '@/app/components/NowLine';
import GlassName from '@/app/components/GlassName';
import VillageZoom from '@/app/components/VillageZoom';
import Village from '@/app/components/Village';
import { INTRO } from '@/app/data/intro';
import { getWeather } from '@/app/data/now';
import './hp.css';

// The homepage: the name at the top with a live sentence under it (where he is, the time and weather
// there, what he's doing), and under
// it the matryoshka set, painted in Gzhel, which opens into the three ways in (Work, Side projects, and
// the littlest, About me), each labelled underneath, mirrored by the nav at the bottom. Scrolling (or
// clicking the Work doll) flies into the village painted on the Work doll, where the houses are the case
// studies. Why the
// dolls ("Design, one layer deeper.") is told on the About page. Behind it, a cold gradient, or snow if
// you switch it on (SnowToggle, SnowBackdrop). The
// bar is the shared one without the name in it, since the name is right here; the shared close is left
// off.
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export default async function Home() {
  const weather = await getWeather();
  return (
    <IntroStage className="hp hp-home">
      <SnowballThrow />
      {/* The first screen stays pinned while you scroll, which flies you into the village on the Work doll's
          belly; the village (its houses are the case studies) is the page you arrive in (VillageZoom) */}
      <VillageZoom>
        <SnowBackdrop />
        <SiteBar brand={false} />
        <SnowToggle />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <section className="hp-wrap hp-stage" aria-labelledby="hero-title">
            {/* The live sentence, and the name, huge, in frosted glass, behind the dolls (hp.css) */}
            <header className="hp-name">
              <GlassName id="hero-title" words={['Michael', 'Bobov']} delay={INTRO.sign} />
              <NowLine delay={INTRO.role} weather={weather} />
            </header>
            <div className="hp-set">
              <span className="hp-floor" aria-hidden="true" />
              <DollSet />
            </div>
          </section>
          <Village />
          {/* Credit for the December hats (CC BY 3.0), shown only while they are (hp.css) */}
          <p className="hp-credit">
            Santa hat: <a href="https://poly.pizza/m/84MpXMAPNQ" target="_blank" rel="noopener noreferrer">“Santa Hat” by J-Toastie<span className="sr-only"> (opens in a new tab)</span></a>,{' '}
            <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0<span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        </main>
      </VillageZoom>
    </IntroStage>
  );
}
