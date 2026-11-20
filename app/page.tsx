import HomeShell, { type Scenes } from '@/app/components/HomeShell';
import type { Weather } from '@/app/components/WeatherLayer';
import { getWeather, NOW } from '@/app/data/now';
import { placeOf } from '@/app/data/places';
import { skyPhase, sunElevation } from '@/app/data/sun';
import './postcard.css';
import './home.css';

// The homepage, after Dia's: a painted sky of where Michael is, at its real time of day (data/places.ts,
// NOW.place; ?place= previews another), his name, a window onto his work standing in a dome of liquid glass,
// the work as apps on the dome's rim in tabs (Work, Side Projects, About). All of it is in HomeShell; this
// works out, on the server, which place, which sky and what weather to start with.
export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const asked = typeof searchParams?.place === 'string' ? searchParams.place : null;
  const place = placeOf(asked ?? NOW.place);
  const fallback = placeOf(null);
  const scenes: Scenes = place.scenes ?? fallback.scenes ?? { dusk: '' };
  // The real weather there (Open-Meteo, fetched at most every 30 minutes; none if it can't be had). Previews:
  // ?weather=clear|cloudy|rain|snow|fog tries one; ?hour=21 starts the sky at that hour there
  const live = await getWeather();
  const w = typeof searchParams?.weather === 'string' ? searchParams.weather : '';
  const weather: Weather | undefined = (['clear', 'cloudy', 'fog', 'rain', 'snow'] as string[]).includes(w) ? (w as Weather) : undefined;
  const hour = typeof searchParams?.hour === 'string' && /^\d{1,2}(\.\d+)?$/.test(searchParams.hour) ? Number(searchParams.hour) : undefined;
  const phase0 = skyPhase(sunElevation(new Date(), NOW.lat, NOW.lon));
  return <HomeShell caption={place.caption} timeZone={NOW.timeZone} lat={NOW.lat} lon={NOW.lon} scenes={scenes} phase0={phase0} live={live} weather={weather} hour={hour} />;
}
