import { EMAIL, RESUME } from '@/app/components/Site';
import { PROJECTS, SIDE, type Project } from '@/app/data/projects';

// The homepage dock (HomeShell, HomeDock): the site's sections as tabs, each a set of app icons on the
// dome, the way round the homepage. The arrows at the ends of the dock, and the words in the bar on top,
// switch tabs: Work (the case studies), Side Projects, About (him, his résumé, how to reach him). Pointing
// at an icon shows it in the window. Every fact comes from the project data (data/projects.ts); the icons
// are drawn in DockIcon.
export type DockMedia =
  | { kind: 'video'; src: string; poster: string; label: string; position?: string }
  | { kind: 'image'; src: string; alt: string; fit?: 'cover' | 'contain'; position?: string }
  | { kind: 'note'; title: string; lines: string[] };
export type DockItem = {
  id: string;
  name: string;
  /** A shorter name for under its icon, where the name is long */
  label?: string;
  /** Where it stands: status · platform · year */
  meta: string;
  line: string;
  href?: string;
  external?: boolean;
  cta: string;
  media: DockMedia;
};
export type DockTab = { id: string; label: string; href: string; more: string; items: DockItem[]; featured: string };

const proj = (id: string) => PROJECTS.find((p) => p.id === id) as Project;
const side = (id: string) => SIDE.find((s) => s.id === id)!;
// (what the product does: its summary up to the colon, where it starts listing)
const firstPart = (s: string) => { const t = s.split(':')[0].trim(); return /[.!?]$/.test(t) ? t : `${t}.`; };

const study = (id: string, position?: string, line?: string): DockItem => {
  const p = proj(id);
  return {
    id, name: p.name, meta: `${p.status} · ${p.platform} · ${p.year}`, line: line ?? firstPart(p.summary),
    href: p.link, cta: 'View case study',
    media: { kind: 'video', src: p.motion.src, poster: `/projects/poster-${id}.webp`, label: p.motion.label, position },
  };
};
const st = side('skilltree'), ez = side('ez-recipe'), ab = side('about-site');

export const TABS: DockTab[] = [
  {
    id: 'work', label: 'Work', href: '/work', more: 'All work', featured: 'versum',
    items: [
      study('inkling', '34% 50%', 'A Mac app that files a thought the way you’d text it to yourself: as an event, a to-do, an idea or a note.'),
      study('versum', '52% 40%'),
      study('spotify-loop', '50% 45%'),
      { id: 'intent-os', name: 'Intent OS', meta: 'In progress', line: 'The case study is on its way.', cta: 'Case study soon',
        media: { kind: 'image', src: '/projects/thumb-intent.webp', alt: '', fit: 'contain' } },
    ],
  },
  {
    id: 'side', label: 'Side Projects', href: '/side-projects', more: 'All side projects', featured: 'skilltree',
    items: [
      { id: 'ez-recipe', name: ez.name, meta: `${ez.status} · ${ez.tag}`, line: firstPart(ez.line), href: ez.href, external: true, cta: 'Visit ezrecipe.app',
        media: { kind: 'image', src: ez.shots[0].src, alt: ez.shots[0].alt, fit: 'contain' } },
      { id: 'skilltree', name: st.name, meta: `${st.status} · VS Code`, line: `${st.line.split(', with')[0]}.`, href: st.href, cta: 'See SkillTree',
        media: { kind: 'image', src: '/projects/shot-skilltree.webp', alt: st.shots[0].alt, position: '0% 0%' } },
      { id: 'about-site', name: ab.name, label: 'Retro desktop', meta: ab.tag, line: `${ab.line.split(', a retro')[0]}.`, href: ab.href, external: true, cta: 'Open the desktop',
        media: { kind: 'image', src: ab.shots[0].src, alt: ab.shots[0].alt, position: '50% 50%' } },
    ],
  },
  {
    id: 'about', label: 'About', href: '/about', more: 'More about me', featured: 'about-me',
    items: [
      { id: 'resume', name: 'Résumé', meta: 'PDF', line: 'My experience and skills, in one document.', href: RESUME, external: true, cta: 'Open résumé',
        media: { kind: 'image', src: '/home/resume.webp', alt: 'The first page of Michael Bobov’s résumé.', position: '50% 0%' } },
      { id: 'about-me', name: 'About me', meta: 'Product designer · Seattle', line: 'Who I am and how I work.', href: '/about', cta: 'Read about me',
        media: { kind: 'image', src: '/about/portrait.webp', alt: 'Michael Bobov.', fit: 'contain' } },
      { id: 'contact', name: 'Contact', meta: 'Email · LinkedIn', line: 'For work, a question, or just to say hello.', href: '/contact', cta: 'Say hello',
        media: { kind: 'note', title: 'Say hello.', lines: [EMAIL.replace('mailto:', ''), 'linkedin.com/in/michael-bobov-94b61b202'] } },
    ],
  },
];

export const ALL_ITEMS = TABS.flatMap((t) => t.items);
