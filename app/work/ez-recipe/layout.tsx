import type { Metadata } from 'next';

const title = 'EZ Recipe case study';
const description = 'Constraint-based recipe generation using ingredients, goals, and preferences.';
const path = '/work/ez-recipe';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} — Michael Bobov`,
    description,
    url: path,
    type: 'article',
    images: [{ url: '/metadata.png', width: 1704, height: 767, alt: 'Michael Bobov — Product Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} — Michael Bobov`,
    description,
    images: ['/metadata.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
