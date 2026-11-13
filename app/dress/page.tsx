import type { Metadata } from 'next';
import { isSignedIn } from '@/app/lib/dress/auth';
import DressApp from './DressApp';
import './dress.css';

// His private page for the doll's outfit of the day: photo → what's visible → painted doll → publish.
// Not linked from anywhere, not indexed, behind a passcode.
export const metadata: Metadata = {
  title: 'Today’s fit',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export const dynamic = 'force-dynamic';

export default function DressPage() {
  return <DressApp signedIn={isSignedIn()} />;
}
