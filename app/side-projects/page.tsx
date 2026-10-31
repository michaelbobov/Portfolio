import type { Metadata } from 'next';
import { SiteBar } from '@/app/components/Site';
import SectionHead from '@/app/components/SectionHead';
import SideProjects from '@/app/components/SideProjects';
import '../hp.css';

// Side projects, behind the second doll: what's built on the side, as a bento of tiles (lighter than
// the case studies): the two products, a note, and the experiments.
export const metadata: Metadata = {
  title: 'Side projects',
  description: 'What I build on the side: EZ Recipe, live at ezrecipe.app, PDF Penguin, a Windows 3.1 desktop you can play games on, and the matryoshka that opens this site.',
  alternates: { canonical: '/side-projects' },
};

export default function SideProjectsPage() {
  return (
    <div className="hp">
      <SiteBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="side-title">
        <SectionHead doll={1} id="side-title" title={<>Side <em>projects.</em></>} note="What I build on the side: real products, from the first sketch to the code that ships, and experiments made for the fun of it." />
        <section className="hp-wrap sp-body" aria-label="Products and experiments">
          <SideProjects />
        </section>
      </main>
    </div>
  );
}
