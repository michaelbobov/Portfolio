import type { ReactNode } from 'react';
import GlassName from '@/app/components/GlassName';

// The top of a section page, set like the homepage's name so the pages read as one site: centered, the
// title in the same frosted glass (with the window onto the snow under the pointer), a short note under
// it. (Which doll you opened shows in the nav at the bottom.)
export default function SectionHead({ id, title, note }: { doll?: number; id: string; title: string; note: ReactNode }) {
  return (
    <header className="hp-wrap sp-head">
      <GlassName id={id} words={title.split(' ')} className="gt-page" />
      <p className="sp-note">{note}</p>
    </header>
  );
}
