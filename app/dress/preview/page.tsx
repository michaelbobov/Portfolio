import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSignedIn } from '@/app/lib/dress/auth';
import OutfitPreview from './OutfitPreview';
import './preview.css';

// A private look at the 3D clothes on his doll, in two sample outfits. Signed in only (in development
// it's open, for working on the clothes); to anyone else it doesn't exist.
export const metadata: Metadata = {
  title: 'Doll outfits, preview',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export const dynamic = 'force-dynamic';

export default function PreviewPage() {
  if (process.env.NODE_ENV === 'production' && !isSignedIn()) notFound();
  return <OutfitPreview />;
}
