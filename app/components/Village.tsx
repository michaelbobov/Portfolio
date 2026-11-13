import Image from 'next/image';
import Link from 'next/link';
import { HOUSES } from '@/app/data/village';
import { SIDE } from '@/app/data/projects';

// What sits over the painted village (VillageScene, drawn by DollScene) once the Side projects doll has
// been flown into (VillageZoom): a way back, the heading, a numbered label over each place, the guided
// tour (a bar of numbered steps in the order the path passes the places, with Previous and Next), and for
// each place a card that docks beside it when the camera arrives, with the project's pictures, where it
// stands, what it is, and the way to the thing itself. Plain markup and real links: without the village
// (no script, no WebGL) it is simply a section of cards under the dolls.
const PLACES = HOUSES.map((h) => SIDE.find((t) => t.id === h.id)).filter((t) => !!t);

export default function Village() {
  return (
    <section id="side-projects" className="vz" aria-labelledby="vz-title">
      {/* The 3D village's pointer surface: hover a place, click it */}
      <div className="vz-stage" aria-hidden="true" />
      <header className="vz-head">
        <button type="button" className="vz-back">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back<span className="vz-back-more"> to the dolls</span>
        </button>
        <h2 id="vz-title" className="vz-title">Side projects</h2>
        <Link href="/side-projects" className="vz-all">All side projects</Link>
      </header>
      <ul className="vz-pins">
        {PLACES.map((t, i) => (
          <li key={t.id}>
            <a href={t.href ?? `/side-projects#${t.id}`} className="vz-pin" data-i={i} aria-describedby={`vz-card-${t.id}-line`}>
              <span className="vz-pin-num" aria-hidden="true">{i + 1}</span>
              <span className="vz-pin-name">{t.name}</span>
              <span className="vz-pin-meta">{t.tag}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="vz-cards">
        {PLACES.map((t, i) => (
          <article key={t.id} className={`vz-card vz-card-${t.id}`} data-i={i} aria-labelledby={`vz-card-${t.id}`}>
            <div className={`vz-card-media${t.shots.length > 1 ? ' is-pair' : ''}`}>
              {t.shots.map((s) => (
                <Image key={s.src} src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 699px) 90vw, 420px" loading="lazy" />
              ))}
            </div>
            <div className="vz-card-body">
              <p className="vz-card-meta">{t.status && <span className="vz-card-status">{t.status}</span>}{t.tag}</p>
              <h3 id={`vz-card-${t.id}`} className="vz-card-title">{t.name}</h3>
              <p id={`vz-card-${t.id}-line`} className="vz-card-sum">{t.line}</p>
              {t.fact && <p className="vz-card-fact">{t.fact}</p>}
              {t.href && t.cta && (
                <div className="vz-card-actions">
                  {t.external ? (
                    <a href={t.href} className="vz-cta is-out" target="_blank" rel="noopener noreferrer">{t.cta}<span className="sr-only"> (opens in a new tab)</span></a>
                  ) : (
                    <Link href={t.href} className="vz-cta">{t.cta}</Link>
                  )}
                </div>
              )}
            </div>
            <button type="button" className="vz-close" aria-label="Close, back to the whole village">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </article>
        ))}
      </div>
      {/* (said plainly, as the 3D model's license asks of machine-made content shown in public) */}
      <p className="vz-credit">The village&rsquo;s figures were painted with AI and made 3D with Tencent Hunyuan3D 2.1.</p>
      {/* The guided tour: every place, numbered in the path's order; the camera travels to the one chosen */}
      <nav className="vz-tour" aria-label="Tour of the side projects">
        <button type="button" className="vz-tour-arrow vz-step" data-step="-1" aria-label="Previous side project">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <ol className="vz-tour-steps">
          {PLACES.map((t, i) => (
            <li key={t.id}>
              <button type="button" className="vz-tour-step" data-i={i}>
                <span className="vz-tour-num" aria-hidden="true">{i + 1}</span>
                <span className="vz-tour-name">{t.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="vz-tour-arrow vz-step" data-step="1" aria-label="Next side project">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </nav>
    </section>
  );
}
