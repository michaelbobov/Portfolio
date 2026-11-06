import type { ReactNode } from 'react';

// The top of a section page, set like the case studies' headers so the two read as one site: centered,
// the title in Geist and a short note under it. (Which doll you opened shows in the nav at the bottom.)
export default function SectionHead({ id, title, note }: { doll?: number; id: string; title: ReactNode; note: ReactNode }) {
  return (
    <header className="hp-wrap sp-head">
      <h1 id={id} className="sp-title">{title}</h1>
      <p className="sp-note">{note}</p>
    </header>
  );
}
