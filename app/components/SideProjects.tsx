import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from '@/app/components/icons';
import { SIDE, type SideTile } from '@/app/data/projects';

// Side projects as a bento, lighter than the case studies' wide cards: tiles of different sizes, each
// one colour all over with its words on it, the pictures tilted and running off the edges. The two
// products first (EZ Recipe the big one), then a gold note and the two experiments. A tile with
// somewhere to go is one link (stretched on its name); PDF Penguin isn't public yet, so it isn't one.
const tile = (id: string) => SIDE.find((t) => t.id === id) as SideTile;

export default function SideProjects() {
  return (
    <div className="sx">
      <Tile t={tile('ez-recipe')} eager />
      <Tile t={tile('pdf-penguin')} eager />
      <div className="sx-tile sx-note">
        <p className="sx-note-label">One layer led to the next</p>
        <p className="sx-note-line">PDF Penguin exists because EZ Recipe needed it.</p>
      </div>
      <Tile t={tile('about-site')} />
      <Tile t={tile('matryoshka')} />
    </div>
  );
}

// eager: the tiles in the first screen load their pictures at once, not on scroll
function Tile({ t, eager = false }: { t: SideTile; eager?: boolean }) {
  const name = !t.href ? t.name : t.external ? (
    <a className="sx-link" href={t.href} target="_blank" rel="noopener noreferrer">{t.name}<span className="sr-only"> (opens in a new tab)</span></a>
  ) : (
    <Link className="sx-link" href={t.href}>{t.name}</Link>
  );
  return (
    <article id={t.id} className={`sx-tile sx-${t.id}${t.href ? ' is-link' : ''}`}>
      <div className="sx-words">
        <p className="sx-tags">
          {t.status && <span className={`sx-status${/live/i.test(t.status) ? ' is-live' : ' is-pre'}`}>{t.status}</span>}
          <span className="sx-tag">{t.tag}</span>
        </p>
        <h3 className="sx-name">{name}</h3>
        <p className="sx-line">{t.line}</p>
        {t.fact && <p className="sx-fact">{t.fact}</p>}
        {t.cta && (
          <span className="sx-cta" aria-hidden="true">
            {t.cta} {t.external ? <ArrowUpRight size={15} strokeWidth={2.25} /> : <ArrowRight size={16} strokeWidth={2.25} />}
          </span>
        )}
      </div>
      <div className="sx-media">
        {t.shots.map((s, k) => (
          <span key={s.src} className={`sx-shot sx-shot-${k}`}>
            <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 999px) 60vw, 30vw" quality={90} priority={eager} />
          </span>
        ))}
      </div>
    </article>
  );
}
