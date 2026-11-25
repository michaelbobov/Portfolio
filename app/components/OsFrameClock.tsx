'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { SunDial } from '@/app/components/HomeOS';
import { skyBodies, skyPhase, sunElevation } from '@/app/data/sun';

// The live part of the frame (OsFrame) of the pages outside the desktop: the menu bar (its items come from
// OsFrame as children), the signature at its end (the sun dial and the time in Seattle; a click goes to the
// desktop) and the strip of sky under it. The time of day, the painting for it and the bar's night colours all
// come from the same tick, once on load and then each minute, so they always agree with the clock, though the
// page itself was rendered at build time. Until the page has loaded there's no time shown and no sky yet (it
// fades in), so neither the server's time nor a wrong sky ever shows.
const ORDER = ['day', 'golden', 'dusk', 'night'] as const;
type Scenes = { dusk: string; day?: string; golden?: string; night?: string };
type Now = { p: number; up: boolean; day: string; time: string; scene?: string; night: boolean };

export default function OsFrameTop({ scenes, timeZone, lat, lon, children }: { scenes?: Scenes; timeZone: string; lat: number; lon: number; children: ReactNode }) {
  const [now, setNow] = useState<Now | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date(), b = skyBodies(d, lat, lon), phase = skyPhase(sunElevation(d, lat, lon));
      setNow({
        p: b.up ? b.day : b.night, up: b.up,
        day: new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone }).format(d).replace(',', ''),
        time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(d),
        scene: scenes?.[ORDER[Math.min(3, Math.round(phase))]] ?? scenes?.dusk,
        // (after dark the bar turns to dark glass and cream words, as on the desktop)
        night: phase > 2.45,
      });
    };
    tick();
    const t = window.setInterval(tick, 60000);
    return () => window.clearInterval(t);
  }, [scenes, timeZone, lat, lon]);
  return (
    <div className="os-frame-top" style={{ '--nt': now?.night ? 1 : 0 } as CSSProperties}>
      <header className="os-bar">
        {children}
        <Link className="os-mi os-sig is-wide" href="/" title="The time in Seattle: back to the desktop">
          {now && <><SunDial p={now.p} up={now.up} /><span className="os-day">{now.day} </span>{now.time}</>}
        </Link>
      </header>
      <div className={`os-frame-sky${now?.scene ? ' is-on' : ''}`} style={now?.scene ? { backgroundImage: `url(${now.scene})` } : undefined} aria-hidden="true" />
    </div>
  );
}
