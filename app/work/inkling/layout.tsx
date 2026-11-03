import type { Metadata } from 'next';

const title = 'Inkling';
const description = 'A Mac app for people who text themselves and forget: type or say a thought, and on-device AI files it as an event, a to-do, an idea or a note.';
const path = '/work/inkling';

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
