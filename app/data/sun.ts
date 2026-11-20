// Where the sun is over a place right now, for the homepage's sky (HomeShell): its elevation above the
// horizon in degrees (negative below it), from the standard low-precision solar position (good to a
// fraction of a degree, plenty for choosing a painting). And which painting that is: the sky runs day →
// golden hour → dusk → night as the sun goes down (and back in the morning), so `skyPhase` gives a number
// from 0 (day) to 3 (night); a fraction is a crossfade between two paintings.
const RAD = Math.PI / 180;

export function sunElevation(date: Date, lat: number, lon: number): number {
  const d = date.getTime() / 86400000 - 10957.5; // days since J2000.0 (2000-01-01 12:00 UTC)
  const g = (357.529 + 0.98560028 * d) * RAD; // mean anomaly
  const q = 280.459 + 0.98564736 * d; // mean longitude, degrees
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD; // ecliptic longitude
  const e = (23.439 - 0.00000036 * d) * RAD; // obliquity
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const gmst = (((18.697374558 + 24.06570982441908 * d) % 24) + 24) % 24; // hours
  const ha = (gmst * 15 + lon) * RAD - ra;
  const la = lat * RAD;
  return Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha)) / RAD;
}

// The sun's elevation at which each painting is fully shown: day from 12° up; golden hour with the sun
// just over the horizon (2°); dusk in civil twilight (−5°); night from nautical twilight (−12°) down.
const KEYS = [12, 2, -5, -12];
export function skyPhase(elevation: number): number {
  if (elevation >= KEYS[0]) return 0;
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i], b = KEYS[i + 1];
    if (elevation >= b) return i + (a - elevation) / (a - b);
  }
  return KEYS.length - 1;
}
