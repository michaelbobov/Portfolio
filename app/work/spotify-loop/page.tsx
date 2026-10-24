import Navigation from '@/app/components/Navigation';
import {
  CaseHero,
  CaseShell,
  Decision,
  Decisions,
  Figure,
  MetaGrid,
  NextCase,
  PhoneRow,
  ProcessDetails,
  Prose,
  Section,
  Tldr,
} from '@/app/components/case/Case';
import '../case.css';

// Spotify Loop case study. Copy follows the PM review (§3.4). Unsourced market statistics and the
// unattributed quote are left out; early artifacts that show a drag interaction are marked.
export default function SpotifyLoopCaseStudy() {
  return (
    <CaseShell nav={<Navigation />}>
      <CaseHero
        kicker="Mobile · Feature design · 2025"
        name="Spotify Loop"
        claim="replay one part of a song without leaving Spotify"
        summary="A one-week, self-initiated concept for looping a section of a song inside Spotify’s mobile player, in two taps, with a library of saved loops."
      />
      <p className="cs-col cs-muted cs-disclaimer">Conceptual exploration. Not affiliated with Spotify. Logos used for design critique only.</p>
      <MetaGrid
        items={[
          { label: 'Role', lines: ['Product Designer', 'UX Researcher'] },
          { label: 'Timeline', lines: ['1 week', 'Concept to prototype'] },
          { label: 'Team', lines: ['Solo Project', 'Self-initiated'] },
          { label: 'Skills', lines: ['UX Research', 'Interaction Design', 'Prototyping'] },
        ]}
      />
      <Tldr
        status="CONCEPT"
        rows={[
          { label: 'Problem', text: 'Spotify can’t loop part of a song. Musicians and fans scrub the progress bar by hand or leave for tools like Moises.ai.' },
          { label: 'How I found it', text: 'Guitar and Spotify subreddits (“It’s a pain moving the slider over and over”), plus a review of looping tools. None worked inside Spotify’s mobile player.' },
          { label: 'Solution and why', text: 'Tap the timeline for a start, again for an end. The loop button joins the quick-action row next to Bluetooth, so there’s no new menu.' },
          { label: 'Outcome', text: 'A hi-fi prototype: 2 taps to loop, handles to adjust, saved loops. Not yet tested at hi-fi.' },
        ]}
      />
      <Figure
        size="hero"
        priority
        img={{ src: '/spotifyloopmockup.png', alt: 'Two phones: the Spotify player with a loop set from 0:42 to 1:17, and a Saved Loops library listing the same song.', width: 1500, height: 1125 }}
        caption="A loop set on the player (right) and saved in the library (left)."
      />

      <Section id="problem" label="The problem" title="To replay one part of a song, people scrub by hand or leave Spotify.">
        <Prose>
          <p>Scrubbing back and forth is slow and imprecise, especially on a phone. The alternative is an external tool like PractAid or Moises.ai, which breaks the listening flow and means juggling apps. It matters to anyone learning lyrics, practicing an instrument or replaying the best part of a track.</p>
        </Prose>
      </Section>

      <Section id="found" label="How I found it" title="Musicians had already built their own workarounds.">
        <Prose>
          <p>On r/guitar: “It’s a pain moving the slider over and over…” On r/LearnGuitar, developers had built tools like PractAid because “there’s no feature.” On r/spotify: “I’ll literally listen to it on loop the entire day.” I then reviewed the tools people use for looping. None worked inside Spotify’s mobile player, so people switch apps or move to desktop.</p>
        </Prose>
      </Section>

      <Section id="solution" label="Solution and why" title="Two taps to loop, inside the controls people already use." decisions>
        <Prose>
          <p>Turn on the loop button and the whole track highlights. Tap the timeline to set a start, tap again to set an end, and only that section repeats. Drag the handles to fine-tune, and tap the button again to stop. Save a loop to find it later in Saved Loops. The same option lives in the ⋯ menu.</p>
        </Prose>
        <Decisions>
          <Decision n={1} title="Tap to set, not a waveform selector.">
            <p>Tapping mirrors the progress bar people already know and works on a small screen. Waveforms add clutter casual listeners don’t need; a highlight band is enough. Lo-fi testers found tapping more precise than dragging.</p>
          </Decision>
          <Decision n={2} title="The loop button sits next to Bluetooth, with a backup in the ⋯ menu.">
            <p>That row already holds quick actions, so the button is visible without adding UI. The ⋯ menu is there for people who prefer that route.</p>
          </Decision>
          <Decision n={3} title="Saved loops.">
            <p>People come back to the same drop or the same chorus. Saving loops turns a one-off action into part of their library.</p>
          </Decision>
        </Decisions>
      </Section>

      <Section id="screens" label="Screens" title="From loop on to saved, in four states.">
        <PhoneRow
          label="Spotify Loop states"
          items={[
            { img: { src: '/Loop Active.png', alt: 'Spotify Loop hi-fi: loop on, with the whole track highlighted and a green loop button next to Bluetooth', width: 393, height: 852 }, caption: 'Loop on: the whole track highlights and the loop button, next to Bluetooth, turns green.' },
            { img: { src: '/Loop Set.png', alt: 'Spotify Loop hi-fi: a section set between 0:42 and 1:17 with two handles', width: 393, height: 852 }, caption: 'Section set: two handles mark 0:42 to 1:17, and only that part repeats.' },
            { img: { src: '/Loop Saved.png', alt: 'Spotify Loop hi-fi: a toast confirming the loop was added to Saved Loops', width: 393, height: 852 }, caption: 'Saved: a toast confirms “Added to Saved Loops.”' },
            { img: { src: '/Saved Loops.png', alt: 'Spotify Loop hi-fi: the Saved Loops library, each loop with its start and end time', width: 393, height: 852 }, caption: 'Each saved loop keeps its start and end time.' },
          ]}
        />
      </Section>

      <Section id="outcome" label="Outcome" title="A one-week concept, ready to test.">
        <Prose>
          <p>The result is a hi-fi prototype: a loop in 2 taps, two ways in (the main player and the ⋯ menu), and a Saved Loops library. It’s unofficial and hasn’t been tested at hi-fi yet.</p>
        </Prose>
      </Section>

      <Section id="learned" label="What I learned" title="The best additions feel native, not bolted on.">
        <Prose>
          <p>Spotify has a design language, and a new feature has to fit it. That’s why the loop button lives in the row where Spotify already puts quick actions. Next ideas: sharing loops, playlists of favorite sections, and “your most-looped moments” in Wrapped.</p>
        </Prose>
      </Section>

      <ProcessDetails list="journey map · user flow · lo-fi · before">
        <h3>Journey map</h3>
        <p className="cs-note">Early concept used drag; testing moved it to tap.</p>
        <Figure
          size="narrow"
          img={{ src: '/spotifyloopjourney.png', alt: 'Spotify Loop user journey map: emotional pain points and moments of opportunity while trying to replay part of a song.', width: 884, height: 740 }}
        />
        <h3>User flow</h3>
        <p className="cs-note">Early concept used drag; testing moved it to tap.</p>
        <Figure
          img={{ src: '/SpotifyFlowchart.png', alt: 'Spotify Loop user flow chart, from opening a song to saving a loop.', width: 4217, height: 1054 }}
        />
        <h3>Lo-fi</h3>
        <Figure
          size="narrow"
          img={{ src: '/looplowfi.png', alt: 'Spotify Loop lo-fi prototype: loop creation, visual feedback and control placement.', width: 1180, height: 830 }}
        />
        <h3>Before</h3>
        <PhoneRow
          label="The player before Loop"
          items={[{ img: { src: '/Now Playing Screen.png', alt: 'Spotify Loop hi-fi: now playing screen with the loop button', width: 393, height: 852 }, caption: 'The now-playing screen before a loop is set.' }]}
        />
      </ProcessDetails>

      <NextCase
        href="/work/versum"
        name="Versum Health,"
        line="helping uninsured patients and dental students find each other."
        img="/versumheroimage.png"
        bg="#020401"
        fit="contain"
      />
    </CaseShell>
  );
}
