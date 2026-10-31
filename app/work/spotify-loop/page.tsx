import { CaseHero, CaseShell, Choice, Choices, Glance, NextCase, Outcome, Process, Section } from '@/app/components/case/Case';
import MotionVideo from '@/app/components/MotionVideo';
import '../case.css';

// Spotify Loop case study, laid out to be skimmed: the feature in motion first, then everything a
// reviewer needs at a glance, the week as one visible row of steps, each decision beside its screens,
// and where it stands. Unsourced market statistics and the unattributed quote are left out.
export default function SpotifyLoopCaseStudy() {
  return (
    <CaseShell>
      <CaseHero
        kicker="Mobile · Feature design · 2025"
        name="Spotify Loop"
        claim="replay one part of a song without leaving Spotify"
        summary="A one-week, self-initiated concept for looping a section of a song inside Spotify’s mobile player, in two taps, with a library of saved loops."
      />
      <p className="cs-col cs-muted cs-disclaimer">Conceptual exploration. Not affiliated with Spotify. Logos used for design critique only.</p>
      <figure className="cs-figure cs-figure-hero cs-figure-media cs-motion">
        <span className="cs-frame">
          <MotionVideo
            src="/spotify-loop-overview.mp4"
            poster="/spotify-loop-overview.jpg"
            width={2100}
            height={900}
            label="Spotify Loop feature overview: turning on loop, tapping a start and an end, fine-tuning, saving, and the Saved Loops library"
          />
        </span>
        <figcaption className="cs-caption">The feature in 15 seconds: turn on loop, tap a start and an end, fine-tune, save it, find it in your library.</figcaption>
      </figure>

      <Glance
        facts={[
          { label: 'Role', value: 'Product designer, UX research' },
          { label: 'Team', value: 'Solo, self-initiated' },
          { label: 'Timeline', value: '1 week, concept to prototype' },
        ]}
        status="CONCEPT"
        problem="Spotify can’t loop part of a song. Musicians and fans scrub the progress bar by hand, or leave for another app."
        did="I read how people work around it, mapped the journey, tested a lo-fi prototype, and designed a two-tap loop inside Spotify’s own player."
        outcome="A hi-fi prototype: a loop in 2 taps, handles to fine-tune, and a Saved Loops library. Lo-fi testers set loops more precisely by tapping than by dragging."
      />

      <Process
        title="One week, from Reddit threads to a hi-fi prototype."
        steps={[
          {
            name: 'Research',
            quote: { text: 'It’s a pain moving the slider over and over…', who: 'r/guitar' },
            did: 'Read r/guitar, r/LearnGuitar and r/spotify, and reviewed the looping tools people use instead.',
            found: 'None of them worked inside Spotify’s mobile player.',
          },
          {
            name: 'Journey',
            pics: [{ src: '/spotifyloopjourney.png', alt: 'Spotify Loop user journey map: the pain points and openings while trying to replay part of a song.', width: 884, height: 740 }],
            did: 'Mapped where replaying one part of a song breaks down.',
            found: 'Switching apps breaks the listening flow.',
          },
          {
            name: 'Flow',
            pics: [{ src: '/SpotifyFlowchart.png', alt: 'Spotify Loop user flow, from opening a song to saving a loop.', width: 4217, height: 1054, position: 'left center' }],
            did: 'Charted the flow from opening a song to saving a loop.',
            found: 'First drafted with dragging; testing changed that.',
          },
          {
            name: 'Lo-fi test',
            pics: [{ src: '/looplowfi.png', alt: 'Spotify Loop lo-fi prototype: loop creation, visual feedback and control placement.', width: 1180, height: 830 }],
            did: 'Put a lo-fi prototype in front of testers.',
            found: 'Tapping beat dragging for precision.',
          },
          {
            name: 'Hi-fi',
            pics: [{ src: '/Loop Set.png', alt: 'Spotify Loop hi-fi: a section set between 0:42 and 1:17.', width: 393, height: 852, fit: 'contain', bg: '#2a1f08' }],
            did: 'Designed it in Spotify’s own visual language, then prototyped it.',
            found: 'A loop in 2 taps.',
          },
        ]}
      />

      <Section id="decisions" label="Key decisions" title="Two taps to loop, inside the controls people already use.">
        <Choices>
          <Choice
            n={1}
            title="Tap to set, not a waveform selector."
            why="Tapping mirrors the progress bar people already know and works on a small screen. Lo-fi testers found it more precise than dragging."
            shots={[{ phone: true, img: { src: '/Loop Set.png', alt: 'Spotify Loop: a section set from 0:42 to 1:17 with two handles; only that part repeats.', width: 393, height: 852 } }]}
            caption="A start at 0:42, an end at 1:17; only that part repeats."
          />
          <Choice
            n={2}
            title="The loop button sits next to Bluetooth."
            why="That row already holds quick actions, so the button is visible without adding UI. The ⋯ menu is a second way in."
            shots={[
              { phone: true, img: { src: '/Now Playing Screen.png', alt: 'The Spotify player before Loop.', width: 393, height: 852 } },
              { phone: true, img: { src: '/Loop Active.png', alt: 'Spotify Loop on: the whole track highlights and the loop button, next to Bluetooth, turns green.', width: 393, height: 852 } },
            ]}
            caption="Before, and with loop on: the whole track lights up."
          />
          <Choice
            n={3}
            title="Loops you can save."
            why="People come back to the same drop or the same chorus. Saving turns a one-off action into part of their library."
            shots={[
              { phone: true, img: { src: '/Loop Saved.png', alt: 'Spotify Loop: a toast confirming the loop was added to Saved Loops.', width: 393, height: 852 } },
              { phone: true, img: { src: '/Saved Loops.png', alt: 'The Saved Loops library, each loop with its start and end time.', width: 393, height: 852 } },
            ]}
            caption="A toast confirms it; each saved loop keeps its start and end."
          />
        </Choices>
      </Section>

      <Outcome
        title="A one-week concept, ready to test."
        shipped={['A hi-fi prototype: a loop in 2 taps', 'Two ways in: the player and the ⋯ menu', 'A Saved Loops library']}
        next={['Test the hi-fi prototype with musicians', 'Sharing loops', 'Playlists of favorite sections', '“Your most-looped moments” in Wrapped']}
        learned="The best additions feel native, not bolted on: the loop lives where Spotify already puts quick actions."
      />

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
