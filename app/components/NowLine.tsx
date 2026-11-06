'use client';

import { useEffect, useState } from 'react';
import { NOW } from '@/app/data/now';
import './now.css';

// The live line under the name on the homepage, in Michael's voice: his role and city, the time and the
// weather there and what he's doing (data/now.ts), as one lowercase sentence; late at night there, it
// says he's probably asleep.
// The time is worked out in the visitor's browser and kept current; until then (and without script) the
// sentence starts from the city.
const parts = (tz: string) => {
  const d = new Date();
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d).toLowerCase();
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: tz }).format(d));
  return { time, night: hour >= 23 || hour < 7 };
};

export default function NowLine({ delay, weather }: { delay: number; weather: { temp: number; words: string } | null }) {
  const [now, setNow] = useState<{ time: string; night: boolean } | null>(null);
  useEffect(() => {
    const tick = () => setNow(parts(NOW.timeZone));
    tick();
    const t = window.setInterval(tick, 20000);
    return () => window.clearInterval(t);
  }, []);
  const sky = weather ? `${weather.temp}°${weather.words ? ` and ${weather.words}` : ''}` : '';
  return (
    <p className="hp-now" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      <span>
        <span className="hp-now-dot" aria-hidden="true" />
        product designer in {NOW.city}.
        {now && <> it’s <span className="hp-now-time">{now.time}</span> here{sky ? <>, {sky}</> : null}.</>}
        {now?.night ? <> probably asleep.</> : <> {NOW.doing}.</>}
      </span>
    </p>
  );
}
