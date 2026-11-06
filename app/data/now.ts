// Where Michael is and what he's on, for the live line on the homepage (NowLine). Edit this when you
// travel or move on to something new: the city, its time zone (an IANA name, so the local time is right,
// daylight saving included), roughly where it is (for the weather there; city-level, a couple of
// decimals), and a few words on what you're doing, lowercase like the rest of the line.
export const NOW = {
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
export async function getWeather(): Promise<{ temp: number; words: string } | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${NOW.lat}&longitude=${NOW.lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const j = await res.json();
    const t = j?.current?.temperature_2m, c = j?.current?.weather_code;
    if (typeof t !== 'number') return null;
    return { temp: Math.round(t), words: WORDS.find(([k]) => k === c)?.[1] ?? '' };
  } catch {
    return null;
  }
}
