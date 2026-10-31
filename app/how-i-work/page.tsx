import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteBar } from '@/app/components/Site';
import SectionHead from '@/app/components/SectionHead';
import { ArrowRight } from '@/app/components/icons';
import { RINGS } from '@/app/data/projects';
import '../hp.css';

// How I work, behind the third doll: the process as rings closing in on code, then each step with an
// example from the work and a link to the case study it comes from
export const metadata: Metadata = {
  title: 'How I work',
  description: 'Listen, frame, design, build: how I take a product from the first conversation to shipped code, with an example of each from my work.',
  alternates: { canonical: '/how-i-work' },
};

const step = (i: number) => ({ '--i': i }) as CSSProperties;

export default function HowIWorkPage() {
  return (
    <div className="hp">
      <SiteBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="how-title">
        <SectionHead doll={2} id="how-title" title={<>How I <em>work.</em></>} note="Outside in, like the dolls: past the mockup, until it ships." />
        <section className="hp-wrap sp-body hp-how" aria-labelledby="rings-title">
          <div className="hp-rings" aria-hidden="true">
            {RINGS.map((r, i) => (
              <span key={r.name} className="hp-ring" style={step(i)}>
                <span className="hp-ring-name">{r.name}</span>
              </span>
            ))}
            <span className="hp-ring-core"><em>Code</em></span>
          </div>
          <div>
            <h2 id="rings-title" className="hp-h2">Code is the <em>smallest</em> doll.</h2>
            <p className="hp-how-lede">Most design stops a layer early. I keep going: four steps, each one inside the last.</p>
          </div>
        </section>
        <ol className="hp-wrap sp-later hw">
          {RINGS.map((r) => (
            <li key={r.name} className="hw-step">
              <h3 className="hw-name">{r.name}</h3>
              <p className="hw-line">{r.line}</p>
              <p className="hw-example">{r.example}</p>
              <Link className="hw-from" href={r.from.href}>
                From {r.from.label} <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
