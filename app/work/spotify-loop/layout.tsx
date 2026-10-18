import type { Metadata } from 'next';

const title = 'Spotify Loop concept';
const description = 'A concept for looping specific song segments natively within Spotify.';
const path = '/work/spotify-loop';

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
