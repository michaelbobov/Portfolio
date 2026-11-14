import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Download } from '@/app/components/icons';
import { SIDE, type SideTile } from '@/app/data/projects';
import './skilltree-tile.css';

// Side projects as a bento, lighter than the case studies' wide cards: tiles of different sizes, each
// one colour all over with its words on it, the pictures tilted and running off the edges. SkillTree
// opens the bento as one full-width tile linking to its own page, then EZ Recipe across the width, then
// the two experiments side by side. Each tile is one link (stretched on its name).
const tile = (id: string) => SIDE.find((t) => t.id === id) as SideTile;

export default function SideProjects() {
  return (
    <div className="sx">
      <Tile t={tile('skilltree')} eager />
      <Tile t={tile('ez-recipe')} eager />
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
        {(t.cta || t.download) && (
          <div className="sx-actions">
            {/* (a real link of its own, above the tile's stretched link) */}
            {t.download && (
              <a className="sx-download" href={t.download.href} download>
                <Download size={17} strokeWidth={2.25} /> {t.download.label}
                <span className="sr-only"> {t.name} ({t.download.note})</span>
              </a>
            )}
            {t.cta && (
              <span className="sx-cta" aria-hidden="true">
                {t.cta} {t.external ? <ArrowUpRight size={15} strokeWidth={2.25} /> : <ArrowRight size={16} strokeWidth={2.25} />}
              </span>
            )}
          </div>
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
