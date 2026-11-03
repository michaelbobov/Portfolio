import { CaseHeader, CaseShell, Choice, Choices, NextCase, Outcome, Prose, Section, Step, Steps } from '@/app/components/case/Study';
import MotionVideo from '@/app/components/MotionVideo';
import '../study.css';

// Spotify Loop case study: what it is and the facts, the feature in motion, then the problem, the week's
// process, the three decisions and where it stands. Every claim is from the original write-up or its
// artifacts; unsourced market statistics and the unattributed quote are left out.
export default function SpotifyLoopCaseStudy() {
  return (
    <CaseShell>
      <CaseHeader
        name="Spotify Loop"
        subtitle="Replay one part of a song without leaving Spotify."
        facts={[
          { label: 'Role', value: 'Product designer, UX research' },
          { label: 'Team', value: 'Solo' },
          { label: 'Timeline', value: '1 week, 2025' },
          { label: 'Platform', value: 'Mobile' },
        ]}
        status="CONCEPT"
        note="Conceptual exploration. Not affiliated with Spotify. Logos used for design critique only."
        media={
          <MotionVideo
            src="/spotify-loop-overview.mp4"
            poster="/spotify-loop-overview.jpg"
            width={2100}
            height={900}
            label="Spotify Loop feature overview: turning on loop, dragging the start and end handles to the part that repeats, adjusting it, saving, and the Saved Loops library"
          />
        }
      />

      <Section n={1} id="overview" title="Overview">
        <Prose>
          <p>Spotify Loop is a feature concept I designed in a week: a way to loop one section of a song inside Spotify’s mobile player.</p>
          <p>I worked on it alone, from research to a hi-fi prototype. It hasn’t shipped, and I haven’t tested the hi-fi prototype yet.</p>
        </Prose>
      </Section>

      <Section n={2} id="problem" title="The problem">
        <Prose>
          <p>Spotify has no way to loop part of a song. People learning a riff or replaying a favorite drop scrub the progress bar back by hand, which is tedious and imprecise on a phone. Or they leave for a tool like PractAid or Moises.ai, which breaks the listening flow.</p>
          <p>
            Spotify’s own community forum has a feature request for it:{' '}
            <a href="https://community.spotify.com/t5/Live-Ideas/Timed-Loop-AB-repeat-within-a-song/idi-p/5648839" target="_blank" rel="noopener noreferrer">
              “Timed Loop (AB repeat within a song)”<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </Prose>
      </Section>

      <Section n={3} id="process" title="Process">
        <Steps>
          <Step title="Research">
            <p>I read threads in r/guitar, r/LearnGuitar and r/spotify to see how people work around the gap, and reviewed the looping tools they use instead. None of the tools I reviewed worked inside Spotify’s mobile player, so people had to switch apps or move to a desktop.</p>
          </Step>
          <Step title="Journey map" pics={[{ src: '/spotifyloopjourney.png', alt: 'Spotify Loop journey map: each step of trying to replay part of a song, with how the listener feels today and with Spotify Loop.', width: 884, height: 740 }]}>
            <p>I mapped what happens when someone tries to replay one part of a song, step by step, and how they feel at each point. The low point is leaving Spotify to find a looping app, then switching back and forth.</p>
          </Step>
          <Step title="User flow" pics={[{ src: '/SpotifyFlowchart.png', alt: 'Spotify Loop user flow: open Spotify, the Now Playing screen, press Loop, then repeat the full song or drag markers to select a custom loop and adjust them until it plays.', width: 4217, height: 1054 }]}>
            <p>I charted the flow from opening a song to a loop playing. Turning on loop selects the whole track; dragging the start and end markers narrows it to the part you want, and you can keep adjusting until it sounds right. Repeating the whole song is the simpler path.</p>
          </Step>
          <Step title="Lo-fi testing" pics={[{ src: '/looplowfi.png', alt: 'Spotify Loop lo-fi prototype screens: setting a loop, the highlighted section, the loop button, and saved loops.', width: 1180, height: 830 }]}>
            <p>I showed a lo-fi prototype to a few friends to check loop creation, visual feedback and the button’s placement. It was informal, but two things came out of it:</p>
            <ul>
              <li>A subtle highlight band showed them clearly which part loops.</li>
              <li>They found the loop button easily next to the Bluetooth button.</li>
            </ul>
          </Step>
          <Step title="Hi-fi prototype">
            <p>I designed the final screens in Spotify’s own visual language, so the feature looks like it was always there, and built a hi-fi prototype.</p>
          </Step>
        </Steps>
      </Section>

      <Section n={4} id="decisions" title="Design decisions">
        <Choices>
          <Choice
            n={1}
            title="Handles on the timeline, not a waveform"
            shots={[{ phone: true, img: { src: '/Loop Set.png', alt: 'Spotify Loop: a section set from 0:42 to 1:17 with two handles; only that part repeats.', width: 393, height: 852 } }]}
            caption="A start at 0:42 and an end at 1:17; only that part repeats."
          >
            <p>I chose not to show a waveform. It adds visual complexity, and the feature is as much for fans replaying a favorite part as for musicians practicing one. Two handles on the progress bar people already know work on a small screen, and a highlight band shows the looped part without covering the album art.</p>
          </Choice>
          <Choice
            n={2}
            title="Put the loop button next to Bluetooth"
            shots={[
              { phone: true, img: { src: '/Now Playing Screen.png', alt: 'The Spotify player before Loop.', width: 393, height: 852 } },
              { phone: true, img: { src: '/Loop Active.png', alt: 'Spotify Loop on: the whole track highlights and the loop button, next to Bluetooth, turns green.', width: 393, height: 852 } },
            ]}
            caption="Before, and with loop on: the whole track lights up."
          >
            <p>The player’s bottom row already holds quick actions, so the button fits there without adding anything new to the screen. The friends who tried the lo-fi prototype found it easily, and the same option is in the ⋯ menu for people who look there first.</p>
          </Choice>
          <Choice
            n={3}
            title="Let people save their loops"
            shots={[
              { phone: true, img: { src: '/Loop Saved.png', alt: 'Spotify Loop: a toast confirming the loop was added to Saved Loops.', width: 393, height: 852 } },
              { phone: true, img: { src: '/Saved Loops.png', alt: 'The Saved Loops library, each loop with its start and end time.', width: 393, height: 852 } },
            ]}
            caption="A toast confirms the save; each saved loop keeps its start and end."
          >
            <p>People come back to the same drop or chorus, so saving turns a one-off action into part of their library.</p>
          </Choice>
        </Choices>
      </Section>

      <Outcome
        n={5}
        shippedLabel="What I made"
        shipped={['A hi-fi prototype: turn on loop, then drag two handles to the part you want', 'Two ways in: the player and the ⋯ menu', 'A Saved Loops library']}
        next={['User-test the hi-fi prototype', 'Let people share loops as short snippets', 'Add playlists of favorite sections', 'Add “Your most-looped moments” to Spotify Wrapped']}
        learned="People were already scrubbing back to the same spot by hand. Most of the design was making that one move easier, in a player they already know."
      />

      <NextCase href="/work/versum" name="Versum Health" line="Helping uninsured patients and dental students find each other." img={{ src: "/versum-overview.jpg", width: 2100, height: 900 }} />
    </CaseShell>
  );
}
