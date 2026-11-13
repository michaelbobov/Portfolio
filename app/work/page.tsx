import type { Metadata } from 'next';
import { SiteBar } from '@/app/components/Site';
import SectionHead from '@/app/components/SectionHead';
import WorkBento from '@/app/components/WorkBento';
import { WORK } from '@/app/data/projects';
import '../hp.css';

// Work, behind the biggest doll: the main case studies, as a bento (WorkBento)
export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies: Versum Health, a healthcare marketplace I co-founded, and Spotify Loop, a feature concept.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <div className="hp">
      <SiteBar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none" aria-labelledby="work-title">
        <SectionHead doll={0} id="work-title" title="Selected work." note="Each project opened in layers: the problem people had, the insight inside it, and the outcome at the core." />
        <div className="hp-wrap sp-body">
          <WorkBento projects={WORK} />
        </div>
      </main>
    </div>
  );
}
