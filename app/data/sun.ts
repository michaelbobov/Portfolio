// Where the sun is over a place right now, for the homepage's sky (HomeShell): its elevation above the
// horizon in degrees (negative below it), from the standard low-precision solar position (good to a
// fraction of a degree, plenty for choosing a painting). And which painting that is: the sky runs day →
// golden hour → dusk → night as the sun goes down (and back in the morning), so `skyPhase` gives a number
// from 0 (day) to 3 (night); a fraction is a crossfade between two paintings.
const RAD = Math.PI / 180;

export function sunPosition(date: Date, lat: number, lon: number): { elevation: number; hourAngle: number; declination: number } {
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
  return {
    elevation: Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha)) / RAD,
    // (radians from noon, −π to π: negative in the morning)
    hourAngle: Math.atan2(Math.sin(ha), Math.cos(ha)),
    declination: dec,
  };
}
export const sunElevation = (date: Date, lat: number, lon: number) => sunPosition(date, lat, lon).elevation;

// Where the drawn sun and moon are in the homepage's sky paintings (SkyFlow), as a fraction of the painting
// (x from the left, y from the top). The sun crosses the sky from the left between sunrise and sunset and
// sets behind the mountain's right shoulder, where the golden-hour painting has its glow; its height follows
// its real elevation, eased so a high summer sun still stays in the picture. The moon takes the same path by
// night, from dusk to dawn (as a full moon does, opposite the sun).
export function skyBodies(date: Date, lat: number, lon: number) {
  const { elevation, hourAngle, declination } = sunPosition(date, lat, lon);
  // (half the day's length, as an hour angle: where the sun meets the horizon)
  const h0 = Math.acos(Math.min(1, Math.max(-1, -Math.tan(lat * RAD) * Math.tan(declination))));
  const at = (p: number, el: number) => ({ x: 0.554 - (1 - p) * 0.62, y: 0.664 - 0.5 * (1 - Math.exp(-el / 18)) });
  const day = (hourAngle + h0) / (2 * h0);
  const mh = Math.atan2(Math.sin(hourAngle - Math.PI), Math.cos(hourAngle - Math.PI)), m0 = Math.PI - h0;
  return { sun: at(day, elevation), moon: at((mh + m0) / (2 * m0), -elevation), elevation };
}

// How much of the moon is lit, as the fraction of its month gone by: 0 new, 0.5 full, waxing before that
// (from a new moon of 2000-01-06 18:14 UTC; the month is 29.53 days)
export const moonPhase = (date: Date) => {
  const d = (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
  return ((d / 29.530588853) % 1 + 1) % 1;
};

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
