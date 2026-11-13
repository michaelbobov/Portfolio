import type { Project } from '@/app/components/FeaturedWork';

// The case studies, behind the big doll (Work). Every fact comes from the case studies. What's built on
// the side lives in SIDE, below, behind the second doll.
export const PROJECTS: Project[] = [
  {
    id: 'versum',
    name: 'Versum Health',
    meta: 'Co-founder, product lead, frontend',
    platform: 'Web',
    year: '2025',
    status: 'Live MVP',
    headline: 'Helping uninsured patients and dental students find each other.',
    summary: 'A booking marketplace where uninsured patients get care from supervised dental students.',
    stage: '#2a4fae', // Gzhel cobalt: its white screens stand out on it
    shots: [],
    motion: {
      src: '/versum-overview.mp4',
      poster: '/versum-overview.jpg',
      width: 2100,
      height: 900,
      label: 'Versum feature overview: the live site in English and Spanish, then a student’s dashboard, calendar, time slots and services',
      contain: true,
    },
    link: '/work/versum',
    live: 'https://versumhealth.com/',
  },
  {
    id: 'inkling',
    name: 'Inkling',
    meta: 'Designer and developer',
    platform: 'Mac',
    year: '2026',
    status: 'Pre-launch',
    headline: 'For everything you text yourself and forget.',
    summary: 'A Mac app that files a thought the way you’d text it to yourself, typos and all: an event, a to-do, an idea to develop or a note to keep, with the AI running on the Mac.',
    stage: '#7f9aa6', // slate teal: the app's white windows and pastel popup stand out on it
    shots: [
      { src: '/inkling-today.png', w: 1030, h: 1444, kind: 'browser', at: [10, 12, 30] },
      { src: '/inkling-followup.png', w: 920, h: 380, kind: 'browser', at: [36, 30, 54] },
    ],
    link: '/work/inkling',
  },
  {
    id: 'spotify-loop',
    name: 'Spotify Loop',
    meta: 'Product designer, UX research',
    platform: 'Mobile',
    year: '2025',
    status: 'Concept',
    headline: 'Replay one part of a song without leaving Spotify.',
    summary: 'A self-initiated concept for looping a section of a song inside Spotify’s player, with a library of saved loops.',
    stage: '#c9d9ee', // ice: the dark player and its gold album art stand out on it
    shots: [],
    motion: {
      src: '/spotify-loop-overview.mp4',
      poster: '/spotify-loop-overview.jpg',
      width: 2100,
      height: 900,
      label: 'Spotify Loop feature overview: turning on loop, dragging the start and end handles to the part that repeats, adjusting it, saving, and the Saved Loops library',
    },
    link: '/work/spotify-loop',
  },
];

const byId = (ids: string[]) => ids.map((id) => PROJECTS.find((p) => p.id === id) as Project);
export const WORK = byId(['versum', 'inkling', 'spotify-loop']);

// Side projects, behind the second doll: what's built on the side, shown as tiles of different sizes
// (SideProjects.tsx), not as case studies. Each says where it stands and what it is, in a line or two,
// and goes straight to the thing itself where there is one. Every fact is from the old case studies.
export type SideTile = {
  id: string;
  name: string;
  /** Live, Pre-launch: products have one; experiments don't */
  status?: string;
  tag: string;
  line: string;
  /** One more fact, small */
  fact?: string;
  href?: string;
  cta?: string;
  external?: boolean;
  /** The tile's picture(s) */
  shots: { src: string; w: number; h: number; alt: string }[];
};
export const SIDE: SideTile[] = [
  {
    id: 'ez-recipe',
    name: 'EZ Recipe',
    status: 'Live',
    tag: 'Consumer AI app',
    line: 'Recipes from what’s already in your kitchen: answer six quick questions, add your ingredients, and AI writes a recipe that fits.',
    fact: 'Two months from concept to launch, designed, built and shipped on my own.',
    href: 'https://ezrecipe.app',
    cta: 'Visit ezrecipe.app',
    external: true,
    shots: [
      { src: '/ezrecipe-live-phone-home.jpg', w: 1170, h: 2532, alt: 'ezrecipe.app on a phone: “Your Preferences, Infinite Recipes”, a Start Cooking button and recipe cards.' },
      { src: '/ezrecipe-live-phone-categories.jpg', w: 1170, h: 2532, alt: 'ezrecipe.app on a phone: six food categories to cook from, from Italian Cuisine to Desserts.' },
    ],
  },
  {
    id: 'about-site',
    name: 'about.michaelbobov.com',
    tag: 'Web · Built with Cursor',
    line: 'A Windows 3.1 desktop with Minesweeper, SkiFree and a Doom-style shooter, a retro AI chat, a VHS player and eras to switch between.',
    href: 'https://about.michaelbobov.com/',
    cta: 'Open the desktop',
    external: true,
    shots: [
      { src: '/playground-about.jpg', w: 1600, h: 1000, alt: 'about.michaelbobov.com: a retro computer room with a beige CRT showing a Windows 3.1 desktop.' },
    ],
  },
  {
    id: 'matryoshka',
    name: 'The matryoshka',
    tag: 'Motion · 3D · three.js',
    line: 'The four dolls that open this site: each is its drawing’s outline turned into a hollow, lacquered shell, so one really sits inside the next.',
    href: '/',
    cta: 'Open the dolls',
    shots: [
      { src: '/matryoshka-opening.png', w: 1019, h: 570, alt: 'Four lacquered purple matryoshka dolls opening: the third has lifted its lid and the littlest is rising out of it.' },
    ],
  },
  {
    id: 'skilltree',
    name: 'SkillTree',
    status: 'Pre-release',
    tag: 'VS Code extension',
    line: 'A map of your Claude Code skills that shows which ones Claude actually uses, with Claude’s recommendations for skills that would serve you better.',
    fact: 'A free download for VS Code, built with Claude Code.',
    href: '/side-projects/skilltree',
    cta: 'See SkillTree',
    shots: [
      { src: '/side-projects/skilltree/tree-in-use.png', w: 2480, h: 1520, alt: 'The Skill Tree in VS Code sorted by last use, with recorded use counts on the skills Claude used.' },
    ],
  },
];
