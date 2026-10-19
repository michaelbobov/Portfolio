import { dailyStops } from '@/app/data/dailyStops';

// Exit-sign list of everyday places. Renders nothing until app/data/dailyStops.ts has entries.
export default function DailyStops() {
  const cities = dailyStops.filter((c) => c.stops.length > 0);
  if (cities.length === 0) return null;

  return (
    <section className="wf-section" aria-labelledby="daily-stops-title">
      <div className="wf-head">
        <h2 id="daily-stops-title">Daily stops</h2>
        <span>Exits · <span lang="ja" className="wf-jp">出口</span></span>
      </div>
      <div className="wf-two">
        {cities.map((c) => (
          <div key={c.city}>
            <div className="wf-city">{c.city} · {c.note}</div>
            <ul className="wf-exits">
              {c.stops.map((s) => (
                <li key={`${s.exit}-${s.what}`}>
                  <span className="wf-x"><span className="sr-only">Exit </span>{s.exit}</span>
                  <span className="wf-what">{s.what}</span>
                  <span className="wf-spot">{s.spot}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
