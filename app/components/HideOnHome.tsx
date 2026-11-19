'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Leaves its children (the shared close, and the dock) off the postcard pages, which have their own bar
// on top (PostcardBar): the homepage, where the dolls are the navigation, and Contact
const POSTCARD = new Set(['/', '/contact']);
export default function HideOnHome({ children }: { children: ReactNode }) {
  return POSTCARD.has(usePathname()) ? null : <>{children}</>;
}
