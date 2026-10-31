import type { ReactNode } from 'react';
import { FlatDoll } from '@/app/components/FlatDoll';

// The top of a section page: its doll from the homepage set (so you can see which layer you opened),
// the title with its one serif-italic accent, and a short note
export default function SectionHead({ doll, id, title, note }: { doll: number; id: string; title: ReactNode; note: ReactNode }) {
  return (
    <header className="hp-wrap sp-head">
      <div className="sp-title-row">
        <span className="sp-doll" aria-hidden="true"><FlatDoll i={doll} prefix={`sp-${id}`} /></span>
        <h1 id={id} className="sp-title">{title}</h1>
      </div>
      <p className="sp-note">{note}</p>
    </header>
  );
}
