import Link from 'next/link';
import TileVideo from '@/app/components/TileVideo';
import { ArrowRight } from '@/app/components/icons';
import type { Project } from '@/app/data/projects';
import './work-bento.css';

// Work as a bento, in the side projects' tile system (hp.css .sx): Versum, the lead case study, across the
// top; Inkling and Spotify Loop side by side under it. Each tile is one colour all over with its words on
// it, what the product does, my role, and the project's overview recording running off the edge
// (its play / pause in the tile's corner, clear of the crop); the whole tile is the link to its case study
// (stretched on its name).

export default function WorkBento({ projects }: { projects: Project[] }) {
  return (
    <div className="sx wb">
      {projects.map((p) => {
        const m = p.motion;
        return (
          <article key={p.id} id={p.id} className={`sx-tile is-link wb-tile wb-${p.id}`}>
            <div className="sx-words">
              <p className="sx-tags">
                <span className={`sx-status${/live/i.test(p.status) ? ' is-live' : ' is-pre'}`}>{p.status}</span>
                <span className="sx-tag">{p.platform} · {p.year}</span>
              </p>
              <h2 className="sx-name"><Link className="sx-link" href={p.link}>{p.name}</Link></h2>
              <p className="sx-line">{p.headline}</p>
              {/* (what the product does, in a sentence: the headline alone doesn't say) */}
              <p className="sx-fact wb-summary">{p.summary}</p>
              <p className="sx-fact">{p.meta}</p>
              <span className="sx-cta" aria-hidden="true">Read the case study <ArrowRight size={16} strokeWidth={2.25} /></span>
            </div>
            <TileVideo src={m.src} poster={m.poster} width={m.width} height={m.height} label={m.label} />
          </article>
        );
      })}
    </div>
  );
}
