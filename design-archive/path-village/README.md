# Path village (the version before the island), saved 2026-11-13

What it was: the Side projects doll's window showed a painted snowfield seen from above, with one winding
path running up past the places, in tour order: EZ Recipe's cabin with its pot on the left, SkillTree's fir on
the right, the about-site's hut on chicken legs at the end of the path, and the penguin by a frozen pond.
Around them, a few plain white firs. Labels showed on hover; the tour bar was the only navigation.
Michael liked it ("I honestly didn't mind it"); the close views were the strong part, the overview less so.

Screens: `screens/` (the village, a tour stop, the doll).

How it differed from the island version in code (`app/components/VillageScene.ts`, `app/data/village.ts`):

- Ground: `assets/ground.webp` (a top-down painting with the path and pond) on a 24 × 24 plane, its edges
  faded into snow, instead of the ice lake.
- Places (`HOUSES`): ez-recipe (-3.6, 1.8), skilltree (3.5, -4.4), about-site (0.4, -10.4); penguin at
  (4.4, 5.2); plain firs at (-8.2,-3), (-6.6,5.4), (8.6,-7.6), (7.6,1.2), (-3.4,-14).
- Camera that paints the window: position (0, 17, 35), looking at (0, 0.9, -3.1), fov 34.
- Earlier, busier variants also used `assets/backdrop.webp` (painted forest horizon), `models/church.glb`
  with `assets/church-paint.webp`, and `assets/fir2.webp` (a small round fir).
- `assets/doll-themed-arch.png` + `window-mask-themed-arch.png`: the dense, winter-themed doll redesign with
  a big arched window (replaced by the calm one, which is still in use).
