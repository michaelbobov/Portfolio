'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// The page's live thing: type the request you'd give Claude and see what SkillTree would suggest.
// The matching is a straight port of the extension's prompt hook (src/mcp/suggest.ts in SkillTree):
// same stop words, same stemming, same rule that a skill's name must match before it is suggested.
// It runs on the catalog the extension loads, the one rebuilt daily on GitHub Pages (a trimmed copy in
// public/side-projects/skilltree, made with scripts/demo/lite-catalog.mjs in SkillTree).

type Lite = { id: string; n: string; r: string; p: string; d: string; c: string; s: number };
type Catalog = { generatedAt: string; repositories: number; count: number; skills: Lite[] };

const STOP = new Set(
  'a an and are as at be but by can could do does for from get give go has have help how i if in into is it its just let like make me my need no not now of on one or our please put really should so some than that the their them then there these this to too up us use using want was we what when where which while who why will with would you your add new nice feel look looks good better make change changes code file files project app thing things work works build fix write update also very more most way edit edits editing describe explain create remove delete run show read check implement'.split(' '),
);

function stem(word: string): string {
  let w = word.toLowerCase();
  for (const suffix of ['ations', 'ation', 'ating', 'ated', 'ates', 'ate', 'ings', 'ing', 'ions', 'ion', 'ers', 'er', 'ed', 'es', 's', 'e']) {
    if (w.length - suffix.length >= 3 && w.endsWith(suffix)) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }
  return w;
}

function keywords(text: string): Set<string> {
  const out = new Set<string>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g) ?? []) {
    const w = raw.replace(/[.]+$/, '');
    if (w.length < 3 || STOP.has(w)) continue;
    out.add(stem(w));
  }
  return out;
}

type Pick = { skill: Lite; score: number };

/** Same rule as the extension: a name match is required, and a minimum score. */
function suggest(skills: Lite[], prompt: string, max = 3): Pick[] {
  const words = keywords(prompt.slice(0, 2000));
  if (words.size === 0) return [];
  const out: Pick[] = [];
  for (const s of skills) {
    const name = keywords(s.n.replace(/[-_]/g, ' '));
    const desc = keywords(s.d);
    let nameHits = 0;
    let descHits = 0;
    words.forEach((w) => {
      if (name.has(w)) nameHits++;
      else if (desc.has(w)) descHits++;
    });
    const score = nameHits * 3 + descHits;
    if (nameHits === 0 || score < 4) continue;
    out.push({ skill: s, score });
  }
  return out.sort((a, b) => b.score - a.score || b.skill.s - a.skill.s || a.skill.id.localeCompare(b.skill.id)).slice(0, max);
}

const EXAMPLES = ['Add an entrance and exit animation to the modal', 'Fill in the PDF form in docs/', 'Write Playwright tests for the login page', 'Make a slide deck about our results', 'Refactor this function'];

const stars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(n));

export default function SkillFinder() {
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  const load = () => {
    if (started.current) return;
    started.current = true;
    fetch('/side-projects/skilltree/catalog-lite.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((c: Catalog) => setCatalog(c))
      .catch(() => setFailed(true));
  };

  // Fetch the catalog once the finder comes near the screen, not with the page.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      load();
      return;
    }
    const io = new IntersectionObserver((items) => items.some((i) => i.isIntersecting) && load(), { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const picks = useMemo(() => (catalog && query.trim().length >= 3 ? suggest(catalog.skills, query) : null), [catalog, query]);

  return (
    <div className="stx-finder" ref={root}>
      <label className="stx-ask" htmlFor="stx-q">
        Your request to Claude
      </label>
      <input
        id="stx-q"
        className="stx-input"
        type="text"
        value={query}
        autoComplete="off"
        spellCheck={false}
        placeholder="Add an entrance and exit animation to the modal"
        onFocus={load}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="stx-tries">
        <span className="stx-tries-label">Or try</span>
        {EXAMPLES.map((e) => (
          <button key={e} type="button" className={`stx-try${e === query ? ' is-on' : ''}`} onClick={() => setQuery(e)}>
            {e}
          </button>
        ))}
      </div>

      <div className="stx-answer" aria-live="polite">
        {failed ? (
          <p className="stx-quiet">The catalog didn’t load, so the finder can’t run right now.</p>
        ) : !picks ? (
          <p className="stx-quiet">
            {catalog
              ? `Searching ${catalog.count.toLocaleString()} skills from ${catalog.repositories} GitHub repositories as you type.`
              : 'The catalog loads as you reach this part of the page.'}
          </p>
        ) : picks.length === 0 ? (
          <p className="stx-quiet">
            No skill’s name matches this, so SkillTree stays quiet. It only suggests a skill when the request names what the skill does.
          </p>
        ) : (
          <ul className="stx-picks">
            {picks.map(({ skill }) => (
              <li key={skill.id} className="stx-pick">
                <svg className="stx-elbow" viewBox="0 0 22 22" aria-hidden="true">
                  <path d="M3 0 V14 Q3 19 8 19 H22" />
                </svg>
                <div>
                  <p className="stx-pick-name">{skill.n}</p>
                  <p className="stx-pick-where">
                    {skill.r}
                    {skill.s ? ` · ${stars(skill.s)} GitHub stars for the repository` : ''}
                  </p>
                  <p className="stx-pick-desc">{skill.d}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <noscript>
        <p className="stx-quiet">The finder needs JavaScript. The extension does the same matching inside VS Code.</p>
      </noscript>
    </div>
  );
}
