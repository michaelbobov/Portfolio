import type { ReactNode } from 'react';
import { CaseHero, CaseShell, Choice, Choices, Glance, NextCase, Outcome, Process, Section } from '@/app/components/case/Case';
import MotionVideo from '@/app/components/MotionVideo';
import '../case.css';

// Inkling case study: the app in motion, everything it does at a glance, the two weeks as steps, each
// decision under the recording that shows it, and where it stands. Videos are real recordings (sample data).

// The tour is the wide hero; the decision clips are cropped to the window so the app reads at column width
const video = (name: string, label: string, [width, height] = [1680, 1206]) => (
  <MotionVideo src={`/inkling-${name}.mp4`} poster={`/inkling-${name}.jpg`} width={width} height={height} label={label} />
);

// What it does, as labeled lists in the margin-and-column rhythm the Outcome section uses
const CAPABILITIES: { label: string; items: ReactNode[] }[] = [
  {
    label: 'Capture',
    items: [
      '⌥Space from any app, or the box at the bottom of the window; typed or spoken',
      'Reads notes the way people text: “tmrw 11;30”, “in an hour”, shorthand and typos',
      'When something it needs is missing, one quick question with the likely answers as buttons',
    ],
  },
  {
    label: 'Sort',
    items: [
      'Events, to-dos, ideas and notes, each filed in its own place',
      'Prep a note implies (“need gear before then”) becomes a to-do under the event',
      'Repeats, business-idea tags, and it remembers when you change a type',
    ],
  },
  {
    label: 'Calendar & iPhone',
    items: [
      'Events go to Calendar and to-dos to Reminders, so they’re on the iPhone and Watch',
      'Two-way: finish or edit something in Reminders and Inkling updates',
      'Ideas and notes can go to their own Reminders lists too, if you turn that on',
      'A Today agenda that runs into the week, and Day, Week and Month views',
    ],
  },
  {
    label: 'Alarms',
    items: [
      'Any item can ring on the Mac like a call, with Stop and Snooze',
      'Your choice per item, with a default in Settings; ringing works on the Mac today, and the iPhone gets a standard alert until the iPhone app',
      'Quiet hours, three snoozes at most, and silence for anything already late',
    ],
  },
  {
    label: 'Email',
    items: [
      'Reads Gmail, read-only, for appointments, travel, bills, deliveries and deadlines',
      'Read by the on-device model; each find waits for one click to add, unless you turn on auto-add',
    ],
  },
  {
    label: 'Think',
    items: [
      'A conversation about each idea, with starters like “Break down the business”',
      'Save key points as a note under the idea; next steps become to-dos',
      'Ideas you haven’t touched come back under Worth revisiting',
    ],
  },
];

export default function InklingCaseStudy() {
  return (
    <CaseShell>
      <CaseHero
        name="Inkling"
        year="2026"
        media={video('tour', 'Inkling demo: a note becomes a lunch and its to-do, the lunch on the calendar, an alarm turned on and stopped, and a reservation from email added to the calendar', [2100, 900])}
      />

      <Glance
        name="Inkling"
        claim="Text yourself anything. Inkling turns it into plans, reminders and alarms you’ll actually see."
        summary="Inkling is a Mac app for everything you’d normally text yourself and forget. Type or say it the way you would to a friend, and on-device AI works out what it is: an event goes on your calendar, a to-do becomes a reminder, and an idea gets a place to grow. It syncs to Calendar and Reminders on your iPhone, rings like an alarm on your Mac when you ask it to, and finds plans in your email for you to approve."
        facts={[
          { label: 'Role', value: 'Designer and developer' },
          { label: 'Team', value: 'Solo, built with Claude in Xcode' },
          { label: 'Timeline', value: '2 weeks, idea to working app' },
          { label: 'Platform', value: 'macOS 26, on-device Apple Intelligence' },
        ]}
        status="PRE-LAUNCH"
        note="Videos use the real app with sample data. The top video combines a screen recording with separate captures of the Calendar and From Email pages and SwiftUI preview renders of the editor and alarm; the alarm toggle and Stop are shown as those views’ before and after states, not recorded. The email shots are captures of the running app, before and after a real Add. Typing is sped up and the model’s wait is cut short; the camera moves, step labels and cursor are added in the edit. Tested on my own notes and sample emails; no outside users yet."
        problem="I text myself plans, errands and half-formed business ideas, then never see them again. The text doesn’t know it’s a dentist appointment, nothing reminds me, and the good ideas sink under the grocery lists. Every app I tried wanted me to decide where a thought goes before I’d finished having it."
        did="I designed and built one box that does the sorting. On-device AI reads a messy note, works out the date and time, asks a quick question only when something’s missing, and files it into Calendar, Reminders, or Inkling’s own idea and note lists. Around that box I built the rest of the loop: a Today agenda and calendar views, alarms you choose per item, suggestions from email, and a place to think ideas through."
        outcome="A working app that turns one line of text into an event and the to-do it implied, both on your iPhone too, plus an alarm on the Mac if you want one. On 46 new notes the rules were never tuned on, it filed 41 as the right type; on the 13 sample emails I tuned it on, the email reader now invents nothing; a live inbox is next."
      />

      <Section id="what-it-does" label="What it does" title="One box in; everything filed where you’ll see it.">
        <div className="cs-outcome">
          {CAPABILITIES.map((group) => (
            <div key={group.label} className="cs-row">
              <h3 className="cs-label">{group.label}</h3>
              <ul className="cs-outcome-list">{group.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Process
        title="Two weeks, from a texting habit to a working Mac app."
        steps={[
          {
            name: 'The habit',
            quote: { text: 'dub seminar tmrw 11;30 need gear before then', who: 'A real note, typed fast' },
            did: 'Started from how I actually text myself: lowercase, shorthand, typos, and a prep step buried in the same line.',
            found: 'Any fix had to work on notes like this one, not clean sentences.',
          },
          {
            name: 'Capture',
            pics: [{ src: '/inkling-followup.jpg', alt: 'Inkling asking “What time is dentist?” with 9:00 AM, 12:00 PM, 6:00 PM and All day as answers, and Skip.', width: 1680, height: 1206 }],
            did: 'One box: ⌥Space from any app, or the same box at the bottom of the window, typed or spoken.',
            found: 'One place to type, wherever you are.',
          },
          {
            name: 'Sort',
            flows: [
              { who: 'Development batches', steps: ['21 of 30', '29 of 30', '141 of 143'] },
              { who: 'Unseen check', steps: ['41 of 46'] },
            ],
            did: 'Ran batches of my own messy notes through the on-device model and fixed each miss, counting notes filed as the right type. Then I checked it on 46 new notes the rules had never been tuned on.',
            found: 'The model over-used “event”; clear wording rules fixed most of it.',
          },
          {
            name: 'Connect',
            pics: [{ src: '/inkling-today.png', alt: 'Inkling’s Today: a greeting, counts, the next thing up, and sections for just captured, overdue, today, tomorrow and later this week.', width: 1030, height: 1444 }],
            did: 'Wired it into Calendar and Reminders both ways so it reaches the iPhone, then added the Today agenda, calendar views, alarms and email.',
            found: 'A thought is only captured if it shows up where you already look.',
          },
          {
            name: 'Think',
            pics: [{ src: '/inkling-think.jpg', alt: 'A chat about the idea “Build an app that lets roommates split chores”, with key points saved and three next steps to turn into to-dos.', width: 1680, height: 1206 }],
            did: 'Turned “elaborate” into a conversation about each idea that leaves key points and to-dos behind.',
            found: 'The thinking stays with the idea, not in a chat you lose.',
          },
        ]}
      />

      <Section id="decisions" label="Key decisions" title="Fast to capture, careful about what it assumes.">
        <Choices>
          <Choice
            n={1}
            title="Ask only when it matters, one question at a time."
            why="A missing time decides where a note goes and when it rings, so Inkling asks, with the likely answers as buttons and Skip always there. Anything it can work out, it does: “tmrw 11;30” is tomorrow at 11:30, and “in an hour” is an hour from now. It never asks more than three times about one note."
            media={video('followup', 'Inkling in the real app: “dentist tuesday” gets one question, What time is dentist?, and tapping 12:00 PM files it')}
            caption="“dentist tuesday” gets one question; a tap files it."
          />
          <Choice
            n={2}
            title="Built for how people actually write."
            why="Clean test sentences said the sorting worked. My own notes said otherwise: written the way I really text myself, most of them came back as to-dos. A cautious spell-check that leaves names and jargon alone, plus reading past “I need to…”, took that set to 41 of 42. It also reads the prep hidden in a note, so “bring her book back” becomes a to-do before lunch."
            media={video('capture', 'Inkling in the real app: “lunch w maya fri 1230, bring her book back” becomes Lunch with Maya on Friday at 12:30 PM, with a to-do to bring her book back before it')}
            caption="One messy line becomes an event and the to-do it implied."
          />
          <Choice
            n={3}
            title="Alarms that are yours to turn on."
            why="A reminder that only pops up is easy to swipe away, so any item can ring on the Mac like a call. Because that’s intrusive, it’s entirely the person’s call: alarms are off until you turn one on for that item, on the Mac, the iPhone or both, and Inkling only asks “Ring as an alarm?” when your note mentions one. It starts soft and builds, stops by itself after a minute by default, rings one at a time, allows three snoozes, and stays silent in quiet hours or for anything already late. Ringing on the iPhone arrives with the iPhone app; until then the phone gets a standard alert."
            shots={[{ img: { src: '/inkling-alarm.png', alt: 'Inkling’s Mac alarm for “Library”: the time, the note, Stop and Snooze 9 min, and one more alarm waiting.', width: 800, height: 380 } }]}
            caption="Stop, snooze, and a hint when another alarm is waiting."
          />
          <Choice
            n={4}
            title="Email as suggestions, not surprises."
            why="Email is full of plans and mostly noise. Inkling reads Gmail read-only, on the Mac, and only suggests things with a specific date: appointments, travel, bills, deliveries and deadlines. Nothing is added until you click Add, unless you turn on auto-add. Testing on sample emails caught the model copying an example from its own instructions, turning a package update into “Flight to Denver”. Now it has to quote the date from the email itself, a title can’t name anything the email doesn’t, and anything whose time has passed is left out. On my 13 test emails it went from 11 fully right to all 13, but those are the emails I fixed it against, and it hasn’t been tested on a live inbox yet."
            media={video('email', 'Inkling in the real app: From Email lists what it found in a sample inbox; clicking Add on the Lupa reservation puts it on Saturday in the Week view')}
            caption="Five suggestions from a sample inbox of seven; Add puts the reservation on the calendar. The newsletter and a passed deadline were left out."
          />
          <Choice
            n={5}
            title="Ideas aren’t facts, so they get their own place."
            why="Gate codes and restaurant tips were filling the Ideas list, and the nudge to revisit forgotten ideas was asking about a gate code. Splitting Ideas (things to develop) from Notes (things to keep) fixed both. Business ideas get their own tag and section, so they don’t sit beside gift ideas."
            media={video('ideas', 'Inkling in the real app: an app idea typed in shorthand lands in Just captured, then under Business on the Ideas page')}
            caption="A business idea lands under Business, apart from errands and notes."
          />
          <Choice
            n={6}
            title="Thinking that leaves something behind."
            why="A chat about an idea is only worth having if you can come back to it. Save key points turns the conversation into a note under the idea, and each suggested next step becomes a to-do in one click. Replies are kept short on purpose: the small on-device model rambles when it’s allowed to."
            media={video('think', 'Inkling in the real app: a chat about a roommate chores app, the reply naming its weakest point and a cheap test, then key points saved with three next steps')}
            caption="A real reply, sped up while it writes, then saved as key points and a to-do."
          />
        </Choices>
      </Section>

      <Outcome
        title="A working Mac app, getting ready to ship."
        shippedLabel="Working now"
        shipped={[
          'Capture from any app with ⌥Space, typed or spoken',
          'On-device sorting into events, to-dos, ideas and notes, with short follow-up questions',
          'Two-way sync with Calendar and Reminders, so events and to-dos reach the iPhone',
          'Mac alarms per item, with quiet hours and snooze limits',
          'Suggestions from Gmail, read on the Mac',
          'Idea chats that save key points and to-dos',
        ]}
        measure={['How often a note needs re-filing', 'How many captured thoughts get acted on', 'How often email suggestions are added versus dismissed', 'Whether nudges bring old ideas back to life']}
        next={[
          'An iPhone app, so alarms can ring on the phone',
          'Google’s app verification, so anyone can connect Gmail, and testing on real inboxes',
          'Cleaner titles: “app idea: split grocery bills w roommates…” should file as the idea, not the shorthand',
          'Signing and notarizing for a public download',
        ]}
        learned="The AI wasn’t the hard part; trust was. That’s why alarms are off until you choose them, email is a suggestion until you add it, and a missing time gets a question instead of a guess."
      />

      <NextCase href="/work/spotify-loop" name="Spotify Loop," line="replay one part of a song without leaving Spotify." />
    </CaseShell>
  );
}
