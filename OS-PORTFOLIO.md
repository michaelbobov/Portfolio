# The homepage as an operating system

Michael's goal (2026-11-23): the portfolio is his own kind of operating system. The homepage is a
desktop, not a landing page. Everything new on it should feel like part of that system, and still be
easy for a recruiter to get through in one click.

## What already works this way

- **The menu bar:** a strip of glass across the top, as a Mac's. His mark is the system menu (About this
  desktop); then Work, Side Projects, About, Résumé; at the right Search, Mission Control, the weather there
  (a button: tries the other weathers) and the clock there. It replaced the website header and the glass
  tab bar at the bottom (2026-11-23), so the page reads as a desktop, not a site. On a phone it keeps the
  pages, the résumé and the time.
- **The desktop:** a painted sky of Seattle that follows the real time of day and weather, with a drawn sun
  and moon that travel across it (the sun crosses from the left and sets behind the mountain's right
  shoulder, where the golden-hour painting glows; the moon takes the same path by night, lit as it really is
  that night). Dragging the sky runs the day forward or back as a time-lapse (the first easter egg): the
  clouds race and streak, backwards when dragged back, the sun and moon cross, the menu bar's clock runs.
- **The dock:** a dome of liquid glass with the current section's apps on its rim, each with its name under
  it, after the Mac dock (magnifies under the pointer). The arrows at the rim's ends change the dock's
  section; one click or tap on an app opens it. Hover trials of its own, in place of the Mac magnifying,
  are behind `?hover=a|b|c` (a: the tile lifts and casts its shadow where the real sun puts it; b: it
  turns toward the pointer as the light slides across it; c: nothing moves, the light catches its rim).
  The default stays the magnifying until Michael picks one.
- **The bottom is only the dock:** the apps and their names. No hint line, no link bar (the pages are in
  the menu bar); a line shows only after the window's been closed, to bring Welcome back.
- **Windows:** one main browser window with tabs. Tabs and dock icons can be dragged out into windows of
  their own, moved, brought to the front, closed, and dropped back into the tab bar.
- **The Welcome window:** a painted studio (his desk, his Gzhel doll) whose light follows the sky. Its
  panes are cut out of the painting, so the view through them is the page's real sky behind the window:
  move the window and the mountain moves in it; rain runs down the glass, snow frosts its corners, fog
  mists it, the lamp reflects in it at night. The desk's objects are ways in (sketchbook: case studies,
  doll: about me, mug: say hello, plant: side projects).
- **Window behaviour:** the title bar moves the window (double-click sends it home); the red button
  closes it, sinking it behind the dome as the glass ripples; a click on an app brings it back up.
- **The icons:** round badges of tinted glass (he chose round over the squircle, a doll silhouette and no
  tile; the Gzhel porcelain set was tried and rejected as worse, backup in
  `~/Projects/references/home-icons-v3-tinted/`).
- **The studio is a painted diorama:** the empty-desk painting and each object as cut-out layers (all three
  lights, `public/home/desk/`). With the pointer, the room shifts a little and the objects about twice as
  far, against the real sky outside, which stays still; a soft light follows. Pointed at, an object lifts
  slightly and shows its name. (Per-object wobbles, sways and steam were tried and rejected as cheap.)
- **Project previews:** the project's own recording, full in the window, panning a few px with the pointer.
  (A three-piece collage was tried and cut: the extra pieces were too small to read.)
- **Living sky:** the sea of clouds in the paintings moves (`SkyFlow.tsx`, a WebGL flow map masked by
  `public/home/cloud-flow.png`: red the sea of clouds, green the high wisps by day, blue the mountain, cut
  out so it never moves); the far mist drifts behind the mountain, the near mist in front. SkyFlow draws
  from copies of the golden and night paintings with the painted sun and moon taken out
  (`*-clear.webp`, made by `~/Projects/references/home-assets/inpaint-sun-moon.mjs`); the CSS layers
  underneath, used without WebGL or with reduced motion, keep the painted ones.
- **Tabs:** pointing shows an app in one passing tab; a tab stays only for a project the visitor has opened
  this session (remembered in sessionStorage), one they clicked, or a window dropped back in. Closing a tab,
  its window of its own, or the whole window forgets it, so a closed tab never comes back.
- **Mission Control (F3, ⌃↑, the right-end button, or the menu):** every project at once as small windows in
  rows by section, the page blurred behind; pointed at, a window lifts and plays its recording; a click
  opens it. The best overview for a recruiter.
- **Full screen:** the Welcome window's green button fills the screen with the whole room and the framed
  mountain through the panes; Escape leaves.
- **Not a Mac copy (2026-11-23):** Michael finds Mac-replica OS portfolios overdone. Keep the conventions
  people know (dock, windows, a close button), but the signature pieces are his own: window controls are an
  ink capsule, not traffic lights; search is "Find"; About MichaelOS is laid out as the maker's mark on the
  base of a piece of porcelain (a cobalt stamp with his mark and "MichaelOS · Seattle edition" round it),
  not as About This Mac. Don't add more macOS-signature pieces as the default.
- **System pieces (`HomeOS.tsx`):** his mark opens About MichaelOS; right-click the sky
  for Daytime / Golden hour / Dusk / Night, back to the live sky, the screensaver, Spotlight, copy link;
  `/` or ⌘K opens Spotlight; the screensaver runs the day by until anything moves.

## The pages are windows (2026-11-24)

Work, Side Projects and About open as big windows on the desktop, not as pages of a website: the (os) route
group's layout (`app/(os)/layout.tsx`) holds HomeShell, so the sky, the menu bar and the dock stay put as you
go between them, and each route's content opens in HomeOS's PageWindow (it rises in; its close sinks it
behind the dome and goes home; its enlarge fills the screen; its body scrolls; the dock stays in front). The
homepage is the desktop with no window up. Contact is About's last part (`/about#contact`); `/contact`
redirects there. Each window's header is set alike: a mono label, the title in the serif italic of his name.
The case studies and SkillTree stay pages for reading, framed by MichaelOS (OsFrame): the same menu bar on
top, a thin strip of Seattle's sky at this hour under it, dark glass after dark. The menu bar's styles are
shared in `app/os-bar.css`. The previews (?weather=, ?hour=, ?nav=, ?dock=row) are read in HomeShell; ?place=
is gone with the move.

## Principles

1. **One click to the work.** Whatever is playful, a recruiter can always reach a case study from the
   dock in one click, and the way is visible without exploring.
2. **Things behave like things.** Windows move, close, sink into the dock, and come back. Glass bends
   what's behind it. The sky outside the studio window is the real sky behind it.
3. **The world is live.** Time of day and weather in Seattle reach everything: the sky, the studio's
   light, the view through its glass, rain on its window.
4. **Calm by default, delight on contact.** Nothing animates for its own sake at rest; interactions
   (drag, close, hover) get the rich motion. Reduced motion keeps the states without the travel.
5. **Personal, not decorative.** Matryoshka, Gzhel and Seattle appear where they mean something (his
   mark, the doll on his desk, the view), never as ornament for its own sake.

## Recruiter check (2026-11-23)

Audit found: "Work" in the bar did nothing on the homepage; no app names visible; the first screen showed
no work; phones needed two taps with the picture a third hidden; Welcome couldn't come back after a close;
loose windows could cover the dock. All fixed the same day: the bar is real links, names are always under
the apps, one tap opens, the phone window is taller and less covered, "open Welcome" after a close (focus
goes to the dock), loose windows rise off the dock and come back on screen after a resize. Later that day
the bottom link bar became the menu bar at the top (same links).

## Restraint (how it stays an OS without overwhelming)

One visible way per task; only the clouds move at rest; power features are hidden and never required;
stop adding tricks, edit instead. Novelty lives in the world (sky, studio, glass), not in the wayfinding.

## His own, not a Mac's (2026-11-23)

Keep Apple's grammar (bar on top, windows, dock at the foot), because it's what makes the desktop usable at
once; replace the vocabulary. Done: the menu bar in his mono, with a sun dial beside the time (where the sun,
or the moon, is on its way across the sky); the windows' own buttons (one glass capsule, close and enlarge,
in ink) in place of the three coloured dots; his own names (All work, Find, About MichaelOS) in place of
Mission Control, Spotlight and About This Mac; the windows' shadows fall away from the drawn sun and swing
round as the day is dragged. Find is a labelled field in the menu bar. Contact is in the menu bar. The title
bar says what the project shown is ("Case study" and its line).

The dock's hover is his own idea (2026-11-24): the icons are magnetic. Near the pointer (around the dock
and a little above it) each is pulled toward it on a spring, reaching for it (stretched a little its way) and
growing; the nearest wins the pull, so neighbours lean in without colliding; let go, they spring back with a
small overshoot. It has depth: the glyph reaches further than its glass, the icon stretches with its speed
(elastic on the way, round once it arrives), a glint slides to the side the pointer is on, its shadow on the
dome shrinks as it lifts, a press squeezes it. Nearing the dock no longer lifts the window (one thing answers
the pointer there). The Mac's magnifying is kept only to compare (?hover=mag), with b7's trials (?hover=a|b|c).
A porcelain-cream title bar with a cobalt active tab was tried the same day and turned down ("aesthetic no
good"): the window chrome stays neutral frosted glass.

Recruiter trim (2026-11-24, after an overwhelm review: every place had 3–5 ways in on one screen, and
"Side Projects" and "About" were written twice): the bar is the site, the dock is the work, so nothing in the
bar repeats the dock. The bar lost its All-work grid button (All work stays on F3, the right-click menu and
Find), and Find is a small "Find" chip. Under the dock, one quiet label names what's on it ("CASE STUDIES",
in the mono of the line above his name) instead of the arrows naming their neighbours; the arrows explain
themselves on hover. Projects whose case study isn't out say "soon" under their name. To compare,
`?dock=row`: the dock as one row of his work (the case studies, then the side projects, each group labelled),
on a flatter rim, with no arrows or sections; a phone shows the case studies only.

The bar works as an OS's (2026-11-24): his mark is the system's menu (About MichaelOS, Find, All work, Play
the day, Start screensaver, Copy link). His signature sits in the middle of the bar, not at the right where a
Mac keeps its clock: the sun dial and the time there. It opens the Sky panel, MichaelOS's own control over the
world rather than the machine: the time in Seattle, sunrise and sunset, tonight's moon, the weather; show the
sky at day, golden hour, dusk or night; try a weather; Play the day (24 hours in nine seconds as a time-lapse,
then back; anything pressed stops it); Back to now. The pages stay plain links on the left for recruiters.
Below 1100px wide the signature moves to the bar's right end; phones show their own clock.
The Sky panel has its own motion and controls, not a Mac's segmented ones: it opens out of the signature as a
circle widening from the sun dial (460 ms), its rows rising in after it, and folds back into it (180 ms); its
dial's sun or moon travels along the arc to where it is, and swings across when the time changes; the time of
day is a track with four stops, a small sun gliding along it on a spring (a moon at night); the weathers are
five glyphs with a halo sliding to the one showing, the one chosen bouncing; Play the day is a ring, a dashed
orbit turning round it when pointed at. Pointed at, the signature's sun path marches along its dashes; the
system menu's items cascade in.

Three ways round the projects, to choose between (`?nav=`): **dock** (default; the arrows name the section
they go to), **menus** (the menu bar's Work / Side Projects / About open as menus of their projects, each
with what it is), **folders** (a folder per section and Résumé.pdf on the desktop; a folder opens as a
window listing its projects). Phones keep the dock in all three (menus work there too).

## Ideas to come back to

- More of his own look: window chrome in his own material and colours (colour changes go to Codex first),
  a short boot moment.
- The Welcome window in full screen as a book whose pages turn.

- A collage of his photos, sketches and places as an app of its own (a Photos window in About); needs his photos.
- More of the studio as navigation: objects on the desk as the ways into sections.
- Sky colours in the interface (chrome, dock tint) taken from the current sky.

Implementation: `app/(os)/layout.tsx`, `app/components/HomeShell.tsx`, `app/components/HomeDock.tsx`,
`app/components/HomeOS.tsx`, `app/components/OsFrame.tsx`, `app/home.css`, `app/os-bar.css`, `app/data/dock.ts`.
