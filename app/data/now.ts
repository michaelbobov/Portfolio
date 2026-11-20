// Where Michael is and what he's on, for the live line on the homepage (NowLine). Edit this when you
// travel or move on to something new: the city, its time zone (an IANA name, so the local time is right,
// daylight saving included), roughly where it is (for the weather there; city-level, a couple of
// decimals), and a few words on what you're doing, lowercase like the rest of the line. `place` picks the
// homepage's landscape (data/places.ts). (Later this can come from his phone's location instead of by hand.)
export const NOW = {
  place: 'seattle',
  city: 'seattle',
  timeZone: 'America/Los_Angeles',
  lat: 47.61,
  lon: -122.33,
  doing: 'building inkling',
};

// The weather in that city now, from Open-Meteo (free, no key), fetched by the server at most every 30
// minutes, so visitors' browsers never call it. Null if it can't be had; the line just leaves it out.
const WORDS: [number, string][] = [
  [0, 'clear'], [1, 'mostly clear'], [2, 'partly cloudy'], [3, 'cloudy'], [45, 'foggy'], [48, 'foggy'],
  [51, 'drizzly'], [53, 'drizzly'], [55, 'drizzly'], [56, 'icy drizzle'], [57, 'icy drizzle'],
  [61, 'rainy'], [63, 'rainy'], [65, 'pouring'], [66, 'icy rain'], [67, 'icy rain'],
  [71, 'snowing'], [73, 'snowing'], [75, 'snowing hard'], [77, 'snowing'], [80, 'showery'], [81, 'showery'],
  [82, 'pouring'], [85, 'snow showers'], [86, 'snow showers'], [95, 'stormy'], [96, 'stormy'], [99, 'stormy'],
];
// Which of the homepage's skies a WMO weather code is (WeatherLayer): clear, cloudy, fog, rain, snow
export type WeatherKind = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow';
export const kindOf = (c: number): WeatherKind =>
  c <= 1 ? 'clear' : c <= 3 ? 'cloudy' : c === 45 || c === 48 ? 'fog' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow' : 'rain';
/** One hour of the forecast (or of the last day): when it starts (ms since 1970) and what weather it is */
export type WeatherHour = { t: number; kind: WeatherKind; temp: number };
export async function getWeather(): Promise<{ temp: number; words: string; kind: WeatherKind; hours: WeatherHour[] } | null> {
  try {
    // (now, and hour by hour from yesterday to tomorrow: dragging across the homepage's sky runs through
    // the real weather of those hours)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${NOW.lat}&longitude=${NOW.lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&past_days=1&forecast_days=2&temperature_unit=fahrenheit&timezone=auto`;
    // (never holds the page up: if Open-Meteo is slow or down, the sentence just goes without the weather)
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const j = await res.json();
    const t = j?.current?.temperature_2m, c = j?.current?.weather_code;
    if (typeof t !== 'number') return null;
    // (its hours are local times there; the offset makes them instants)
    const off = (j?.utc_offset_seconds ?? 0) * 1000;
    const times: string[] = j?.hourly?.time ?? [], codes: number[] = j?.hourly?.weather_code ?? [], temps: number[] = j?.hourly?.temperature_2m ?? [];
    const hours = times.map((s, i) => ({ t: Date.parse(`${s}:00Z`) - off, kind: kindOf(codes[i]), temp: Math.round(temps[i]) })).filter((h) => !Number.isNaN(h.t));
    return { temp: Math.round(t), words: WORDS.find(([k]) => k === c)?.[1] ?? '', kind: kindOf(c), hours };
  } catch {
    return null;
  }
}
