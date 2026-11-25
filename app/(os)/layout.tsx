import type { ReactNode } from 'react';
import HomeShell, { type Scenes } from '@/app/components/HomeShell';
import { getWeather, NOW } from '@/app/data/now';
import { placeOf } from '@/app/data/places';
import { skyPhase, sunElevation } from '@/app/data/sun';
import '../postcard.css';
import '../home.css';
import '../os-bar.css';

// MichaelOS: the desktop the homepage, Work, Side Projects and About share (OS-PORTFOLIO.md). It stays put
// as you go between them, the sky running on; each page opens as a window on it (HomeShell's PageWindow),
// and the homepage is the desktop with no page window up. This works out, on the server, the place, its
// sky and its weather (Open-Meteo, at most every 30 minutes). The previews (?weather=, ?hour=, ?nav=,
// ?dock=row) are read in HomeShell.
export const dynamic = 'force-dynamic';

export default async function OsLayout({ children }: { children: ReactNode }) {
  const place = placeOf(NOW.place);
  const fallback = placeOf(null);
  const scenes: Scenes = place.scenes ?? fallback.scenes ?? { dusk: '' };
  const live = await getWeather();
  const phase0 = skyPhase(sunElevation(new Date(), NOW.lat, NOW.lon));
  return (
    <HomeShell caption={place.caption} timeZone={NOW.timeZone} lat={NOW.lat} lon={NOW.lon} scenes={scenes} phase0={phase0} live={live}>
      {children}
    </HomeShell>
  );
}
