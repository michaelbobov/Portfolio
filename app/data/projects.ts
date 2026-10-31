import type { Project } from '@/app/components/FeaturedWork';

// The case studies, behind the big doll (Work). Every fact comes from the case studies. What's built on
// the side lives in SIDE, below, behind the second doll.
export const PROJECTS: Project[] = [
  {
    id: 'versum',
    name: 'Versum Health',
    meta: 'Co-founder, product lead',
    year: '2025',
    status: 'Live MVP',
    tag: 'Healthcare marketplace',
    headline: 'Helping uninsured patients and dental students find each other.',
    summary: 'A booking marketplace where uninsured patients get care from supervised dental students.',
    facts: [
      { value: '6 months', label: 'research to MVP' },
      { value: '2', label: 'people, design to code' },
      { value: 'Live', label: 'at versumhealth.com' },
    ],
    stage: '#6d4aea', // violet: its white, blue-edged screens stand out on it
    shots: [
      { src: '/Student2.png', w: 1470, h: 894, kind: 'browser', at: [14, 15, 44] },
      { src: '/Student5.png', w: 1558, h: 902, kind: 'browser', at: [43, 34, 43] },
    ],
    link: '/work/versum',
    live: 'https://versumhealth.com/',
  },
  {
    id: 'spotify-loop',
    name: 'Spotify Loop',
    meta: 'Product designer',
    year: '2025',
    status: 'Concept',
    tag: 'Mobile feature design',
    headline: 'Replay one part of a song without leaving Spotify.',
    summary: 'A self-initiated concept for looping a section of a song inside Spotify’s player, with a library of saved loops.',
    facts: [
      { value: '2 taps', label: 'to set a loop' },
      { value: '1 week', label: 'concept to prototype' },
      { value: 'Tapping', label: 'beat dragging, in lo-fi tests' },
    ],
    stage: '#c4b8ed', // lavender: the dark player and its gold album art stand out on it
    shots: [],
    motion: {
      src: '/spotify-loop-overview.mp4',
      poster: '/spotify-loop-overview.jpg',
      width: 2100,
      height: 900,
      label: 'Spotify Loop feature overview: turning on loop, tapping a start and an end, fine-tuning, saving, and the Saved Loops library',
    },
    link: '/work/spotify-loop',
  },
];

const byId = (ids: string[]) => ids.map((id) => PROJECTS.find((p) => p.id === id) as Project);
export const WORK = byId(['versum', 'spotify-loop']);

// How he works, outside in: four rings closing in on the smallest doll. Each step has an example
// from the work or the side projects, with a link to where it comes from.
export const RINGS = [
  {
    name: 'Listen',
    line: 'Talk with the people who have the problem, on every side of it, before any sketch.',
    example: 'At Versum I talked with patients and with dental students. A hygienist told me she almost didn’t graduate, and had to pay strangers to take free cleanings.',
    from: { label: 'Versum Health', href: '/work/versum' },
  },
  {
    name: 'Frame',
    line: 'Name the real problem, then agree on what better means.',
    example: 'Trying the PDF tools as a first-time user, extraction wasn’t the hard part; setup was. So PDF Penguin needs none.',
    from: { label: 'PDF Penguin', href: '/side-projects#pdf-penguin' },
  },
  {
    name: 'Design',
    line: 'Flows, states and prototypes, put in front of real people.',
    example: 'For Spotify Loop, lo-fi testers found tapping more precise than dragging, so setting a loop became two taps.',
    from: { label: 'Spotify Loop', href: '/work/spotify-loop' },
  },
  {
    name: 'Build',
    line: 'Then I ship it myself: React and AI APIs, down to the last detail.',
    example: 'Real use of the live EZ Recipe showed recipes waited on their picture, so now the recipe comes first and the image loads after.',
    from: { label: 'EZ Recipe', href: '/side-projects#ez-recipe' },
  },
];

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
    id: 'pdf-penguin',
    name: 'PDF Penguin',
    status: 'Pre-launch',
    tag: 'AI developer tool',
    line: 'Messy PDF in, clean JSON out. Say what you need in plain words, instead of writing parser rules.',
    fact: 'A working MVP in two weeks, built with React, OCR and the OpenAI API.',
    shots: [
      { src: '/highfipengu2.png', w: 1728, h: 1117, alt: 'PDF Penguin: a dropped PDF on the left, the plain-words request below it, and the clean JSON it returns on the right.' },
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
];
