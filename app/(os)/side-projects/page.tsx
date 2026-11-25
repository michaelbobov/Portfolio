import type { Metadata } from 'next';
import SideProjects from '@/app/components/SideProjects';
import '@/app/hp.css';

// Side projects, a window on MichaelOS's desktop ((os)/layout.tsx, HomeShell's PageWindow): what's built on
// the side, as a bento of tiles (lighter than the case studies): the two products, a note, and the
// experiments. Its header is set like every window's (a mono label, the title in the serif italic of his name).
export const metadata: Metadata = {
  title: 'Side projects',
  description: 'What I build on the side: EZ Recipe, live at ezrecipe.app, SkillTree, a Windows 3.1 desktop you can play games on, and the matryoshka that opens this site.',
  alternates: { canonical: '/side-projects' },
};

export default function SideProjectsPage() {
  return (
    <div className="os-doc os-side">
      <header className="os-doc-head">
        <p className="os-doc-kicker">Side projects</p>
        <h1 id="side-title" className="os-doc-title">What I build on the side</h1>
        <p className="os-doc-sub">Real products, from the first sketch to the code that ships, and experiments made for the fun of it.</p>
      </header>
      <section className="sp-body" aria-labelledby="side-title">
        <SideProjects />
      </section>
    </div>
  );
}
