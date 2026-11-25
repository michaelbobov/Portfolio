'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Leaves its children off some pages. By default MichaelOS's: the desktop and the pages that open as windows on
// it (the (os) route group: the homepage, Work, Side Projects, About), which have the menu bar and no footer.
// `on` names other pages, by the start of their path: the old glass bar at the bottom (Dock) is left off
// those and the case studies too, whose frame has the MichaelOS menu bar on top (OsFrame).
export const OS_PAGES = ['/', '/work', '/side-projects', '/about', '/contact'];
export default function HideOnHome({ children, on = OS_PAGES, under = [] }: { children: ReactNode; on?: string[]; under?: string[] }) {
  const path = usePathname() ?? '';
  return on.includes(path) || under.some((u) => path.startsWith(u)) ? null : <>{children}</>;
}
