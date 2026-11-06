import { CaseHeader, CaseShell, Choice, Choices, NextCase, Outcome, Prose, Quote, Section, Step, Steps } from '@/app/components/case/Study';
import MotionVideo from '@/app/components/MotionVideo';
import '../study.css';

// Inkling case study: what it is and the facts, the app in motion, then the problem, the two weeks as
// steps, five decisions with the recordings that show them, and where it stands. Facts come from the
// earlier Inkling page (written against the app in the author's Xcode sessions), the recordings, and
// the screens in public/inkling-screens; all of it uses sample data.

// The tour is the wide hero; the decision clips are cropped to the window so the app reads at column width
const video = (name: string, label: string, [width, height] = [1680, 1206]) => (
  <MotionVideo src={`/inkling-${name}.mp4`} poster={`/inkling-${name}.jpg`} width={width} height={height} label={label} />
);

const screen = (name: string) => `/inkling-screens/${name}.png`;

export default function InklingCaseStudy() {
  return (
    <CaseShell>
      <CaseHeader
        name="Inkling"
        subtitle="For everything you text yourself and forget."
        facts={[
          { label: 'Role', value: 'Designer and developer' },
          { label: 'Team', value: 'Solo, built with Claude in Xcode' },
          { label: 'Timeline', value: '2 weeks, 2026' },
          { label: 'Platform', value: 'macOS 26' },
        ]}
        status="PRE-LAUNCH"
        note="Recordings and screens show the app with sample data. The top video joins SwiftUI preview renders of the ⌥Space popup, editor and alarm with captures of the Calendar and From Email pages, on macOS’s own wallpaper. The popup’s confirmation is the one the model gave for that note in a recorded run, and the typing is animated in the app’s own font over its empty field. The inbox shows the sample emails as plain cards; each tag is what the email reader returned for that email, and the highlight is the date wording it quoted. The alarm switch and Stop are before and after states, not recorded. I added the camera moves, step labels and cursor in the edit."
        media={video('tour', 'Inkling demo: a note typed into the ⌥Space popup becomes a lunch and its to-do, the lunch on the calendar, an alarm turned on that later rings on the Mac and is stopped, and the email reader going through a sample inbox, quoting a reservation’s date, and adding it to the calendar', [2100, 900])}
      />

      <Section n={1} id="overview" title="Overview">
        <Prose>
          <p>Inkling is a Mac app for the things you’d normally text yourself. You type or say a thought the way you’d text a friend, and an on-device model works out what it is. Events go to Calendar and to-dos to Reminders, so they reach your iPhone, while ideas and notes get their own lists in the app.</p>
          <p>I designed and built it alone in two weeks, writing the code with Claude in Xcode. It works end to end on my Mac and hasn’t launched. On 46 new notes it had never been tuned on, it filed 41 as the right type. All of my testing so far has used my own notes and sample emails.</p>
        </Prose>
      </Section>

      <Section n={2} id="problem" title="The problem">
        <Prose>
          <p>I text myself plans, errands and half-formed business ideas, then never see them again. The text doesn’t know it’s a dentist appointment, nothing reminds me, and the good ideas sink under the grocery lists.</p>
          <p>Every app I tried wanted me to decide where a thought goes before I’d finished having it. My notes look like this:</p>
        </Prose>
        <Quote text="dub seminar tmrw 11;30 need gear before then" who="A real note of mine, typed fast" />
        <Prose>
          <p>That one line holds an event, a time with a typo in it, and a to-do that has to happen first. Whatever I built had to read notes like it.</p>
        </Prose>
      </Section>

      <Section n={3} id="process" title="Process">
        <Steps>
          <Step
            title="One box, from any app"
            pics={[
              { src: screen('popup-idle'), alt: 'Inkling’s capture box, empty, with the placeholder “What’s on your mind?” and a microphone button.', width: 1040, height: 256, size: 520, caption: 'Empty: type or speak.' },
              { src: screen('popup-follow-up'), alt: 'The capture box after “dentist tuesday”: “What time is Dentist?”, with 9:00 AM, 12:00 PM, 6:00 PM and All day as buttons, Skip, and a field to type an answer.', width: 1040, height: 480, size: 520, caption: 'Missing a time: one question, with likely answers.' },
              { src: screen('popup-confirmed'), alt: 'The capture box after “gym monday 7am”: “Gym” added to Calendar, Mon 7:00 AM, every week.', width: 1040, height: 344, size: 520, caption: 'Filed: the confirmation names what it made, where and when.' },
            ]}
          >
            <p>I started with one place to type, wherever you are. ⌥Space opens a small box over any app, for typing or speaking a thought, and pressing it again expands it into the full window. The same box sits at the bottom of that window.</p>
          </Step>
          <Step
            title="Sorting, tested on my own notes"
            flows={[
              { who: 'Tuning', steps: ['21 of 30', '29 of 30', '141 of 143'] },
              { who: 'New notes', steps: ['41 of 46'] },
            ]}
          >
            <p>I ran batches of my own messy notes through the on-device model and fixed each miss, scoring a note right when Inkling filed it as the right type. The model called too many things events, and clearer rules about wording fixed most of that. Then I checked it on 46 new notes I hadn’t tuned the rules on.</p>
          </Step>
          <Step
            title="Into Calendar, Reminders and Today"
            pics={[
              { src: screen('today'), alt: 'Inkling’s Today view: the date and a greeting, counts of overdue items, to-dos, events and ideas, the next event with its prep, then Just captured, Overdue and Today.', width: 2080, height: 1480, caption: 'Today: the next thing up with its prep, what just came in, and what’s late.' },
              { src: screen('calendar-week'), alt: 'Inkling’s Week view for November 1 to 7: Pay electric bill as an all-day to-do, Get gear at 3:00 PM before Dub seminar at 3:30 PM, Call landlord on Thursday and Dentist on Friday.', width: 2080, height: 1480, caption: 'The Week view: events in blue, to-dos in orange, and the prep to-do before the seminar.' },
            ]}
          >
            <p>A captured thought only helps if it shows up where you already look. I connected Inkling to Calendar and Reminders in both directions: events and to-dos reach the iPhone and Watch, and finishing or editing one in Reminders updates Inkling. Then I built Today and the Day, Week and Month views around them.</p>
          </Step>
        </Steps>
      </Section>

      <Section n={4} id="decisions" title="Design decisions">
        <Choices>
          <Choice
            n={1}
            title="Ask one question, and only when it matters"
            media={video('followup', 'Inkling in the real app: “dentist tuesday” gets one question, What time is dentist?, and tapping 12:00 PM files it')}
            caption="“dentist tuesday” gets one question; a tap files it."
          >
            <p>A missing time decides where a note goes and when it rings, so Inkling asks for it, with the likely answers as buttons and Skip always there. Anything it can work out, it does: “tmrw 11;30” is tomorrow at 11:30, and “in an hour” is an hour from now. It never asks more than three times about one note.</p>
          </Choice>
          <Choice
            n={2}
            title="Read notes the way people write them"
            media={video('capture', 'Inkling in the real app: “lunch w maya fri 1230, bring her book back” becomes Lunch with Maya on Friday at 12:30 PM, with a to-do to bring her book back before it')}
            caption="One messy line becomes an event and the to-do it implied."
          >
            <p>Clean test sentences said the sorting worked. When I wrote notes the way I text myself, most came back as to-dos. A cautious spell-check that leaves names and jargon alone, plus reading past “I need to…”, took that set to 41 of 42.</p>
            <p>It also reads the prep hidden in a note. In “lunch w maya fri 1230, bring her book back”, the book becomes a to-do filed under the lunch and due before it.</p>
          </Choice>
          <Choice
            n={3}
            title="Alarms stay off until you turn one on"
            shots={[
              { img: { src: screen('editor-alarm-off-section'), alt: 'The Alarm section of an item’s editor: Ring on this Mac and Ring on iPhone both off, and “Off: you get a normal notification.”', width: 960, height: 284 } },
              { img: { src: '/inkling-alarm.png', alt: 'Inkling’s Mac alarm for “Library”: the time, the note, Stop and Snooze 9 min, and one more alarm waiting.', width: 800, height: 380 } },
            ]}
            caption="Every item’s alarm starts off. When one rings: Stop, Snooze, and a line saying another alarm is waiting."
          >
            <p>A reminder that only pops up is easy to swipe away, so any item can ring on the Mac like a call. Because that’s intrusive, it’s the person’s choice: nothing rings until you turn it on for that item, and Inkling only asks “Ring as an alarm?” when a note mentions one.</p>
            <p>The sound starts soft and builds, and stops by itself after a minute by default. Alarms ring one at a time, and snooze works three times. An alarm that comes due in quiet hours, or while the Mac was asleep, shows without sound. Ringing on the iPhone needs the iPhone app; until then the phone gets a standard alert.</p>
          </Choice>
          <Choice
            n={4}
            title="Suggestions from email wait for your click"
            media={video('email', 'Inkling in the real app: From Email lists what it found in a sample inbox; clicking Add on the Lupa reservation puts it on Saturday in the Week view')}
            caption="Five suggestions from a sample inbox of seven; Add puts the reservation on the calendar. It left out a newsletter and a deadline that had passed."
          >
            <p>Email is full of plans and mostly noise. Inkling reads Gmail read-only, on the Mac, and only suggests things with a specific date: appointments, travel, bills, deliveries and deadlines. It adds nothing until you click Add, unless you turn on auto-add.</p>
            <p>Testing on sample emails caught the model copying an example from its own instructions, which turned a package update into “Flight to Denver”. Now it has to quote the date from the email itself, a title can’t name anything the email doesn’t, and anything already past is left out. On my 13 test emails it went from 11 fully right to all 13, but I fixed it against those same emails, and it hasn’t read a live inbox yet.</p>
          </Choice>
          <Choice
            n={5}
            title="Ideas get their own list, and a chat to work on them"
            media={video('think', 'Inkling in the real app: a chat about a roommate chores app, the reply naming its weakest point and a cheap test, then key points saved with three next steps')}
            caption="A real reply, sped up while it writes, then saved as key points and a to-do."
          >
            <p>Gate codes and restaurant tips were filling the Ideas list, and the nudge to revisit forgotten ideas was asking about a gate code. Splitting Ideas (things to develop) from Notes (things to keep) fixed both. Business ideas get their own tag and section, so they don’t sit beside gift ideas.</p>
            <p>Each idea also has a chat, which is only worth having if you can come back to it. Save key points turns the conversation into a note under the idea, and each suggested next step becomes a to-do in one click. I kept replies short on purpose, because the small on-device model rambles when it’s allowed to.</p>
          </Choice>
        </Choices>
      </Section>

      <Outcome
        n={5}
        shippedLabel="Working now"
        shipped={[
          'Capture from any app with ⌥Space, typed or spoken',
          'On-device sorting into events, to-dos, ideas and notes, with short follow-up questions',
          'Two-way sync with Calendar and Reminders, so events and to-dos reach the iPhone',
          'Mac alarms you turn on per item, with quiet hours and a snooze limit',
          'Suggestions from Gmail, read on the Mac',
          'Idea chats that save key points and to-dos',
        ]}
        measure={['How often a note needs re-filing', 'How many captured thoughts get acted on', 'How often people add email suggestions versus dismiss them', 'Whether nudges bring old ideas back to life']}
        next={[
          'An iPhone app, so alarms can ring on the phone',
          'Google’s app verification, so anyone can connect Gmail without their own Google client ID, then tests on real inboxes',
          'Cleaner titles from shorthand: “app idea: split grocery bills w roommates…” should become the idea itself',
          'Signing and notarizing for a public download',
        ]}
        learned="The hardest part to design was trust. That’s why alarms stay off until you choose one, email stays a suggestion until you add it, and a missing time gets a question instead of a guess."
      />

      <NextCase href="/work/spotify-loop" name="Spotify Loop" line="Replay one part of a song without leaving Spotify." img={{ src: '/spotify-loop-overview.jpg', width: 2100, height: 900 }} />
    </CaseShell>
  );
}
