import type { Metadata } from 'next';

const title = 'PDF Penguin case study';
const description = 'AI-powered PDF to JSON conversion for structured, usable data.';
const path = '/work/pdf-penguin';

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
