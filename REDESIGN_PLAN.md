# Living Postcard: audit and plan

Source: Michael's brief and concept image (2026-11-18). This is phase 1. Nothing on the site has changed yet. Each later phase ships on its own and gets reviewed with Playwright screenshots (desktop 1440, phone 390).

Principle from the brief: **the dolls are the signature interaction, the typography sets the identity, the landscape tells the story, the projects prove the ability.** Anything that serves none of these goes.

---

## 1. Audit: what exists today

| Area | Where | State |
|---|---|---|
| Homepage | `app/page.tsx`, `app/hp.css` | Frosted-glass "Michael Bobov" (GlassName), live sentence (NowLine: time and weather in Seattle), 3 dolls with glass pill labels, Snow switch, snowball cursor, Durak card in the corner. **Nothing below the first screen.** |
| Dolls | `DollSet.tsx` (DOM: links, opening cascade, click transitions), `DollScene.ts` (three.js: lathed hollow dolls, painted Gzhel textures, gaze and blink, hover moves hop / flip / spin, lid peek), `FlatDoll.tsx` (SVG fallback, no-WebGL path), `data/dolls.ts` | Solid and well built. Reduced motion is handled. The About doll turns round and its face window opens into the About portrait. The littlest doll never opens (his rule). |
| Doll art | `public/dolls/*` | Work = cobalt ground with a cream flower; Side projects = winter village; About = his face. Only 3 dolls; the lily doll (doll-3) was removed and is in git (`fb1df00`). |
| Inner nav | `Dock.tsx` (liquid-glass bottom bar), `Site.tsx` (top bar: mark, name, LinkedIn / Email / Résumé; close "Let's build something.") | Works well. Glass. |
| Work | `app/work/page.tsx`, `WorkBento.tsx`, `TileVideo.tsx` | Versum, Inkling, Spotify Loop, with 21:9 overview loops. |
| Case studies | `components/case/Study.tsx`, `StudyZoom.tsx`, `app/work/study.css`, `app/work/{versum,inkling,spotify-loop}` | Editorial system (centred header, numbered sections, 680px column, pictures that open in place). Geist. Review loop and filler check are already set up. |
| Side projects | `SideProjects.tsx`, `app/side-projects/**` | EZ Recipe, SkillTree (own page + .vsix), about.michaelbobov.com, the matryoshka. |
| About | `app/about/page.tsx` | Ruled hero, his cut-out portrait, facts strip, three nested panels, carved storybook window (Nalichnik / Nalichnik3D). |
| Play-like things | `Durak*.tsx`, `data/durak.ts`, `SnowballThrow`, snow mode | Durak is a full card game (2–5 seats, a doll avatar). Uncommitted. |
| Contact | `mailto:` links only | No contact page. |
| Data | `data/projects.ts` (PROJECTS, SIDE) | Source of truth. **No "Orbit" or "Intent OS" anywhere in the repo or its history.** |

## 2. Keep, redesign, simplify, remove

**Keep (as is, restyled where needed)**
- The 3D doll engine: lathe bodies, painted textures, gaze, blink, hover moves, opening cascade, flat fallback, reduced-motion paths.
- The About doll's turn into his photo, and the About page's content and storybook window.
- Project data, overview recordings (MotionVideo / TileVideo), the case-study components and their review workflow.
- Durak (it becomes Play's centrepiece), SkillTree pages and downloads, seasonal hats (December is close).
- Skip link, focus rings, reduced-motion handling, no-WebGL fallback.
- NowLine's location and time data, reused as the landscape caption ("Currently in Seattle, WA").

**Redesign**
- Homepage: cream paper ground, oversized serif name behind the dolls, red sun, the location landscape, 4 dolls, a top nav (Projects · About · Play · Contact + Résumé), torn-paper project previews right under the hero.
- Doll labels: glass pills become a small contextual label beside the doll, on hover or focus only. A hand-drawn yellow crayon outline draws itself round the doll.
- Inner-page nav: the top paper nav replaces the glass Dock (the brief rules out glassmorphism).
- Work → "Projects" (URL stays `/work`); Side projects → "Play" (`/play`, redirect from `/side-projects`).
- New Contact destination (`/contact`): a postcard with email, LinkedIn and résumé.
- Case studies: one design system on the paper tokens, with the brief's sections, filled only from his sources.

**Simplify**
- One display face (the serif) plus one text face, plus a typewriter mono for small labels. Drop the fonts nobody uses after that (Bricolage, maybe Instrument Serif).
- Motion: one moment of delight per interaction (his own lesson from the doll-dive rounds).

**Remove from the homepage (code stays in git)**
- Frosted GlassName (shine band, hover window), Snow switch, snow backdrop and flakes, Snow3D, snowball cursor and throw. They belong to the snow world and compete with the postcard.

## 3. Conflicts with earlier decisions

These come from Michael's own brief or image, so they win, but each reverses something he once chose:

1. **Serif name.** In November he rejected every serif for titles. The concept uses a high-contrast italic serif. Phase 2 tests 3–4 faces side by side before committing.
2. **Glass.** He loved the frosted name and the liquid-glass Dock. The brief says no glassmorphism, so both retire.
3. **Palette.** Snow white / Gzhel blue becomes cream paper + cobalt with restrained red and yellow. The dolls stay Gzhel cobalt, so they still belong.
4. **"The littlest never opens"** vs **"each doll opens"**. Proposal: the littlest (Contact) stays solid; when picked it hops and a postcard slides out from behind it. That is an opening without opening the doll.
5. **Which doll is him.** He's the littlest today; About is doll 2 in the new order. Proposal: keep his face on the About doll (doll 2) and keep the turn-into-photo transition.
6. **Doll faces.** The concept shows closed-eye, rosy-cheek faces. He picked the quiet "face A" for being less feminine. Keep face A unless he says otherwise.
7. **Projects strip** in the image shows Orbit and Intent OS, which don't exist in the repo. Until he supplies them: Versum Health, Inkling, Spotify Loop, SkillTree.

## 4. Phases

Each phase: build → Playwright screenshots desktop + phone → critique (hierarchy, type, spacing, interaction clarity) → his review → commit.

**Phase 0. Checkpoint.** Commit the current uncommitted work (Durak, Nalichnik, About, doll faces, SkillTree 0.2.1) so every phase can be reverted cleanly.

**Phase 2. Homepage layout and typography.**
- Tokens: `--paper #F3EAD9`, `--paper-deep`, `--ink #16161A`, `--cobalt #2445B5`, `--poppy #E2412B`, `--crayon #F4B813`; paper grain as a tiled texture.
- Name: italic serif, about 15vw, ink, behind the dolls; the red screen-print sun behind the name's middle.
- "Product Designer & Builder" in tracked typewriter mono, with a short rule under it.
- Top nav: serif roman words with a crayon underline on the current page; Résumé as an ink pill.
- Test fonts side by side (Google, all free): Playfair Display Italic (closest to the image), Bodoni Moda Italic, DM Serif Display Italic, Instrument Serif Italic. Mono: IBM Plex Mono vs Courier Prime.

**Phase 3. Matryoshka interaction.**
- 4 dolls: 1 Projects (the big flower), 2 About (him), 3 Play (domes or winter village), 4 Contact (small flower). New paintings by Codex in the existing face formula, cream-ground Gzhel to match the concept.
- States: default, hover (crayon outline draws round the silhouette in about 420 ms with ease-out, then three spark ticks pop; label slides in beside it; the existing hover move plays), focus (same outline, no move), active (press scale .97), visited/current.
- The outline follows the doll: DollScene writes each doll's on-screen lift and scale to CSS variables every frame, so the crayon line rides along with the hop.
- Crayon line: the doll's own outline path offset outward, a hand wobble from an SVG turbulence filter, a crayon-grain mask from the generated texture, drawn with stroke-dashoffset. Exit is a 160 ms fade, not a reverse draw.
- Opening + transition per doll: Projects lifts its lid and the page scrolls down to the project strip (it's right there), then /work; About turns round into his photo (existing); Play throws its lid (existing flip) → /play; Contact hops and a postcard slides out → /contact.
- Touch: tap = the doll's move + go. Phones show small typewriter captions under the dolls, because hover doesn't exist there. The top nav mirrors the doll order everywhere.
- Reduced motion: no hops, no drawing; the outline and label simply appear; navigation is instant.

**Phase 4. Adaptive landscape.**
- `app/data/places.ts`: `{ id, caption, layers: [{ src, depth, offset }], sun }`, `CURRENT_PLACE = 'seattle'` (edit one line; `?place=` previews others). A plain hills "fallback" landscape is used if a place is missing or fails to load.
- `Landscape.tsx`: layers as one-ink transparent images used as **CSS masks filled with `--cobalt`**, so every place is exactly on palette and can be recoloured in one token. AVIF/WebP, 1x/2x, lazy-loaded non-current places, a 600 ms crossfade between places, a small pointer parallax (off with reduced motion and on touch).
- Places: Seattle (Rainier, Space Needle, firs), Southern California (mountains, palms), Japan (Fuji and a pagoda, or another place he names), Switzerland (Alps, chalet). Only the landscape and caption change; type, dolls and projects stay fixed.

**Phase 5. Project gallery.**
- Torn-paper cards under the hero: Versum (yellow), Inkling (cobalt), Spotify Loop (cream), SkillTree (black), each with a real preview (the overview poster, playing its loop on hover), a spot illustration, the status chip (Live MVP / Pre-launch / Concept / Pre-release), and a link to its case study.
- Torn edges from generated paper edges used as masks, so they fit any card width.
- Phones: a 2×2 grid, then stacked. No sideways scrolling (he dislikes it).

**Phase 6. Case-study system.**
- Shared sections: Context and problem · My role · Research and constraints · Key decisions · Iterations and prototypes · Outcome and evidence · Reflection and next steps. A section with no source material stays out, and goes onto a list of questions for him.
- On the paper tokens; product screens on plain grounds so the work leads. Titles stay Geist inside case studies (his November call) unless the Phase 2 serif test changes his mind.
- Runs `case-study-check --build` and the Codex review loop.

**Phase 7. Mobile.** Name on two lines, dolls as large as the width allows, landscape cropped to the sides, nav as 4 words + Résumé, gallery 2×2.

**Phase 8. Accessibility, performance, QA.** Focus order dolls → nav → gallery, labels on every doll link, contrast on paper, LCP image priority (name is text, landscape preloaded), fonts subset with `display: swap`, three.js still lazy, total homepage image weight target under 600 KB, Playwright pass at 1440 / 1024 / 768 / 390.

## 5. Assets (Codex image tool, scratchpad first, then `public/` once approved)

| Asset | How it's made | Phase |
|---|---|---|
| Seattle far (Rainier, foothills, Sound) and near (Space Needle, skyline, firs) | One cobalt ink on white paper, converted to a transparent ink layer (`scratchpad/pw/ink.mjs`) | 2 / 4 |
| Red sun | One red ink screen print, same conversion | 2 |
| Paper grain | Tileable cream paper | 2 |
| Crayon kit (underlines, doll loop, spark ticks, fill swatch) | Yellow wax crayon on flat magenta, keyed (`key.mjs`) | 2 / 3 |
| Paper UI (ink pills, torn cream labels, torn coloured scraps) | On flat magenta, keyed | 2 / 5 |
| Doll paintings 1–4 | Existing face formula, cream-ground Gzhel | 3 |
| Spot illustrations (tooth, Inkling, loop, tree) | One ink each, converted | 5 |
| SoCal, Japan, Switzerland, fallback layers | Same two-layer one-ink method | 4 |

## 6. His answers (2026-11-18) and status

- 3D dolls stay (not the flat bench). Intent OS is real (no material in the repo yet: needs its description, role, status and screens). Orbit isn't real yet, so it's out; Inkling took its card. Japan is a place he went to (Fuji + Chureito pagoda for now; other places later). The project cards use his concept's art, redrawn by Codex at high resolution. Durak's cards are restyled to the postcard. **Location tracking comes later**: `NOW.place` (data/now.ts) is the one value it has to set.
- **Done (phases 2–4 first pass, homepage only):** paper + grain, Playfair italic name, red sun, Seattle and Japan two-layer prints (`?place=japan`), top nav with crayon underline, Résumé ink pill, "Currently in" label, 4 3D dolls (Projects, About = him, Play, Contact = littlest, hops, never opens), crayon outline on hover/focus that rides each hop, paper tag labels (under the dolls on touch), torn-paper project strip, Durak card tucked behind it, a Contact postcard page.
- **Next:** a painting for the Contact doll (it reuses the blueberry doll); /play replacing /side-projects; the inner pages (Projects, About, Play, case studies) moved onto the paper tokens and top nav, the glass Dock retired; Durak's table; the Needle's saucer; live location.

- **2026-11-18 round 2 (his notes):** three dolls, not four: Projects, Play, and him, the littlest (About, which is also how to reach him; Contact stays in the nav). Dolls glazed warm ivory (a cream tint over the paintings) with a cobalt under-shade (blue rim and bounce light, cobalt floor shadow). The landscape is a 2:1 band from 30% down, anchored right and fading out to the left, so the Space Needle and the peaks always show. The sun sets behind each place's mountains (a sky mask per place); `?sun=off` hides it.

- **Round 3:** hover highlights (crayon + hop, shut), click opens; cobalt halftone ground under the dolls, bluer shading, bigger dolls over the name; Durak table in postcard materials.

## 7. Open questions for Michael

1. Intent OS: one line on what it is, your role, its status, and any screens, so it can have a card that links somewhere.
2. Which other places (Southern California? Switzerland?), and which exact spots?
3. Keep the sun, or `?sun=off`?
