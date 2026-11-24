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
  section; one click or tap on an app opens it.
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
- **System pieces (`HomeOS.tsx`):** his mark opens About this desktop ("MichaelOS"); right-click the sky
  for Daytime / Golden hour / Dusk / Night, back to the live sky, the screensaver, Spotlight, copy link;
  `/` or ⌘K opens Spotlight; the screensaver runs the day by until anything moves.

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

## Ideas to come back to

- His own look for the system, beyond Apple's: window chrome and the menu bar in his own material and
  colours (colour changes go to Codex first), his own window buttons, a short boot moment.
- The Welcome window in full screen as a book whose pages turn.

- A collage of his photos, sketches and places as an app of its own (a Photos window in About); needs his photos.
- More of the studio as navigation: objects on the desk as the ways into sections.
- Sky colours in the interface (chrome, dock tint) taken from the current sky.

Implementation: `app/components/HomeShell.tsx`, `app/components/HomeDock.tsx`, `app/home.css`,
`app/data/dock.ts`.
