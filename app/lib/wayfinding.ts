'use client';

import { useEffect, useState } from 'react';

// Shared bits for the wayfinding homepage: stations, local-time formatting, sky colour.

export type Station = {
  code: string;
  num: string;
  en: string;
  kana: string;
  note: string;
  tz: string;
  color: string;
};

export const STATIONS: Station[] = [
  { code: 'SEA', num: '01', en: 'Seattle', kana: 'シアトル', note: 'Home', tz: 'America/Los_Angeles', color: 'var(--wf-sea)' },
  { code: 'TYO', num: '02', en: 'Tokyo', kana: 'とうきょう', note: 'Favorite place', tz: 'Asia/Tokyo', color: 'var(--wf-tyo)' },
];

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(key: string, options: Intl.DateTimeFormatOptions) {
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', options);
    formatters.set(key, f);
  }
  return f;
}

/** "10:42 AM" */
export const timeIn = (tz: string, now: Date) =>
  formatter(`t:${tz}`, { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(now);

/** "22:42" (compact, for narrow screens; station timetables are 24-hour anyway) */
export const time24In = (tz: string, now: Date) =>
  formatter(`t24:${tz}`, { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);

export const hourIn = (tz: string, now: Date) =>
  Number(formatter(`h:${tz}`, { timeZone: tz, hour: 'numeric', hourCycle: 'h23' }).format(now));

export const dayIn = (tz: string, now: Date) =>
  formatter(`d:${tz}`, { timeZone: tz, weekday: 'short' }).format(now);

/** The colour of the sky right now, by local hour: night, dawn, day, dusk. */
export const skyFor = (h: number) =>
  h < 5 || h >= 21 ? '#1f2a4d' : h < 7 ? '#f1b49c' : h < 17 ? '#9cc6e8' : '#e8956f';

/**
 * Current time, refreshed every `everyMs`. Null until mounted so server and client markup match.
 */
export function useNow(everyMs = 15000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}
