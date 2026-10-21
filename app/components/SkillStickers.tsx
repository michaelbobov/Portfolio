import type { CSSProperties } from 'react';

// "What I bring": a slim page break between the hero and the work. A full-bleed grape band, tilted
// like tape across the page, holding the heading and every skill from the case studies' "Skills"
// rows (deduped) as stickers in mixed faces. Still a plain list for assistive tech; the slap-on
// and hover peel are CSS (home.css).
const SKILLS = ['UX Research', 'Product Design', 'Prototyping', 'AI Integration', 'Interaction Design', 'Frontend Dev'];

// Face, fill and tilt per sticker, fixed so server and client markup match
const LOOKS = [
  { face: 'display', fill: 'var(--wf-pop-1)', tilt: -5 },
  { face: 'serif', fill: '#fff', tilt: 4 },
  { face: 'pixel', fill: 'var(--wf-pop-3)', tilt: -3 },
  { face: 'mono', fill: 'var(--wf-pop-6)', tilt: 5 },
  { face: 'comic', fill: 'var(--wf-pop-2)', tilt: -6 },
  { face: 'sans', fill: 'var(--wf-pop-4)', tilt: 3 },
];
const look = (tilt: number, i: number, fill?: string) =>
  ({ '--tilt': `${tilt}deg`, '--i': i, ...(fill ? { '--fill': fill } : {}) }) as CSSProperties;

export default function SkillStickers() {
  return (
    <div className="stk-band">
      <div className="stk-band-inner">
        <h2 id="skills-title" className="stk-title">
          <span className="ed-s">What I</span> <span className="ed-g">bring</span>
        </h2>
        <ul className="stk-cloud" aria-label="Skills">
          {SKILLS.slice(0, 3).map((s, i) => (
            <li key={s} className={`stk stk-${LOOKS[i].face}`} style={look(LOOKS[i].tilt, i, LOOKS[i].fill)}>{s}</li>
          ))}
          <li className="stk stk-amp" aria-hidden="true" style={look(-4, 3)}>&amp;</li>
          {SKILLS.slice(3).map((s, j) => {
            const i = j + 3;
            return <li key={s} className={`stk stk-${LOOKS[i].face}`} style={look(LOOKS[i].tilt, i + 1, LOOKS[i].fill)}>{s}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
