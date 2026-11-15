'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Leaves its children off the homepage, which is only the hero: the shared close, and the dock (the
// dolls are the homepage's navigation)
export default function HideOnHome({ children }: { children: ReactNode }) {
  return usePathname() === '/' ? null : <>{children}</>;
}
