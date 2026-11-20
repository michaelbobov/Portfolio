'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Leaves its children off some pages. By default the postcard pages, which have their own bar on top
// (PostcardBar) and close (PostcardClose): the homepage, Projects and Contact. `on` names other pages: the
// glass bar at the bottom (Dock) is left off only the homepage, which has its own (HomeShell).
const POSTCARD = ['/', '/work', '/contact'];
export default function HideOnHome({ children, on = POSTCARD }: { children: ReactNode; on?: string[] }) {
  return on.includes(usePathname() ?? '') ? null : <>{children}</>;
}
