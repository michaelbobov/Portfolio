'use client';

import { STATIONS, timeIn, time24In, useNow } from '@/app/lib/wayfinding';

// Live local times for Seattle and Tokyo in the top bar.
// Narrow screens get a compact 24-hour reading so the bar still fits beside the menu button.
export default function Clocks() {
  const now = useNow(15000);
  return (
    <div
      role="group"
      aria-label="Local times"
      className="wf-clocks flex gap-3 sm:gap-4 text-[13px] sm:text-sm text-wf-muted tabular-nums whitespace-nowrap"
    >
      {STATIONS.map((s) => (
        <span key={s.code}>
          <span aria-hidden="true">{s.code}</span>
          <span className="sr-only">{s.en}</span>{' '}
          <b className="font-medium text-wf-ink">
            <span className="sm:hidden">{now ? time24In(s.tz, now) : '--:--'}</span>
            <span className="hidden sm:inline">{now ? timeIn(s.tz, now) : '--:--'}</span>
          </b>
        </span>
      ))}
    </div>
  );
}
