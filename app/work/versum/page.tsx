import {
  CaseHero,
  CaseShell,
  Choice,
  Choices,
  Figure,
  Glance,
  NextCase,
  Outcome,
  Process,
  ProcessDetails,
  Section,
} from '@/app/components/case/Case';
import '../case.css';

// Versum Health case study, laid out to be skimmed: the work first, then everything a reviewer needs
// at a glance, the process as one visible row, each decision beside its screen, and where it stands.
// Every fact is from the case study as written; nothing is measured that wasn't.
export default function VersumCaseStudy() {
  return (
    <CaseShell>
      <CaseHero
        kicker="Healthcare · Marketplace · 2025"
        name="Versum Health"
        claim="helping uninsured patients and dental students find each other"
        summary="I co-founded Versum and designed and built its booking marketplace, which connects uninsured patients with supervised dental students who need patients to graduate."
        link={{ href: 'https://versumhealth.com/', label: 'versumhealth.com' }}
      />
      <Figure
        size="hero"
        priority
        img={{ src: '/versumheroimage.png', alt: 'The Versum Health website on a laptop: “Creating Universal Access to Free Healthcare”, with Get Free Care and Provide Care buttons.', width: 2400, height: 1161 }}
        caption="Two front doors on the live site: get care as a patient, or provide care as a student."
      />

      <Glance
        facts={[
          { label: 'Role', value: 'Co-founder, product lead, frontend' },
          { label: 'Team', value: '2 people: frontend and backend' },
          { label: 'Timeline', value: '6 months, research to MVP' },
        ]}
        status="LIVE MVP"
        problem="Uninsured patients put off dental care because of cost. Dental students need patients to graduate and can’t find them. Neither side can find the other."
        did="I talked with patients and students, framed the gap, then designed and built the frontend of a booking marketplace: patients search and book, students post availability."
        outcome="The MVP is live at versumhealth.com with booking, scheduling and messaging. Outreach to dental schools has started; there’s no usage data yet."
      />

      <Process
        title="Six months, from conversations to a live MVP."
        steps={[
          {
            name: 'Listen',
            quote: { text: 'I had to pay people off the street a lot of money just to get them a free cleaning.', who: 'A dental hygienist, on getting through school' },
            did: 'Talked with uninsured patients and dental students about how they find each other today.',
            found: 'Both sides had the same gap: no shared place to meet.',
          },
          {
            name: 'Frame',
            pics: [
              { src: '/versumpersona1.jpg', alt: 'Proto-persona Alicia, a financially stretched caregiver who needs affordable, transparent dental care.', width: 1024, height: 1024 },
              { src: '/versumpersona2.jpg', alt: 'Proto-persona Noah, a third-year dental student who needs qualifying patients and fewer no-shows.', width: 1024, height: 1024 },
              { src: '/versumpersona3.jpg', alt: 'Proto-persona Elena, a Spanish-speaking senior who needs care explained in her language.', width: 1024, height: 1024 },
            ],
            did: 'Turned the conversations into three proto-personas: a patient, a student and a Spanish-speaking senior.',
            found: 'Price and trust decide whether a match becomes a booking.',
          },
          {
            name: 'Map',
            flows: [
              { who: 'Patient', steps: ['Find', 'Filter', 'Request'] },
              { who: 'Student', steps: ['Accept', 'Schedule', 'Log'] },
            ],
            did: 'Mapped the flows for patients and students, with supervisor approvals planned.',
            found: 'Both flows meet at one step: the booking request.',
          },
          {
            name: 'Design',
            pics: [{ src: '/Student2.png', alt: 'Versum student schedule: a January calendar for setting availability.', width: 1470, height: 894 }],
            did: 'Designed it search-first, with price and supervision visible before anyone books.',
            found: 'Four decisions shaped it, below.',
          },
          {
            name: 'Build',
            pics: [{ src: '/Student1.png', alt: 'Versum student dashboard: total, upcoming and past appointments.', width: 1481, height: 877 }],
            did: 'Built the frontend and shipped the MVP.',
            found: 'Live at versumhealth.com.',
          },
        ]}
      />

      <Section id="decisions" label="Key decisions" title="Search first, with trust and price visible before anyone books.">
        <Choices>
          <Choice
            n={1}
            title="Two ways to search: by need, or by student."
            why="Some patients know what they need (“I need a cleaning”); others pick a person. Supporting both removes friction for each."
          />
          <Choice
            n={2}
            title="A tab for each job, not one dashboard."
            why="People arrive with different goals, so Find, Appointments and Messages each do one thing."
            shots={[{ img: { src: '/Student4.png', alt: 'Versum Messages tab: a list of conversations beside the selected one.', width: 1576, height: 899 } }]}
            caption="Messages has its own tab (student side)."
          />
          <Choice
            n={3}
            title="Free cleanings, shown before booking."
            why="Cost is the biggest worry for uninsured patients. Students say at onboarding whether they offer free cleanings, and patients see it on the student’s card."
            shots={[{ img: { src: '/Student5.png', alt: 'Versum student profile: school and graduation year, About Me, and a Services Offered list including dental cleaning.', width: 1558, height: 902 } }]}
            caption="Services are set once, on the student’s profile."
          />
          <Choice
            n={4}
            title="Upcoming and past visits in one view."
            why="Booking the next visit often needs context from the last one, and it saves clicks."
            shots={[{ img: { src: '/Student1.png', alt: 'Versum dashboard with Upcoming Appointments and Past Appointments tabs side by side.', width: 1481, height: 877 } }]}
            caption="The same pattern on the student dashboard."
          />
        </Choices>
      </Section>

      <Section id="screens" label="Screens" title="Students set their availability once.">
        <div className="cs-grid2">
          <Figure
            img={{ src: '/Student2.png', alt: 'Versum student schedule: a January calendar with a legend for available slots, patient bookings, confirmed and pending appointments.', width: 1470, height: 894 }}
            caption="A calendar of their availability: click a future date to add time slots."
          />
          <Figure
            img={{ src: '/Student3.png', alt: 'Versum: the Manage Time Slots dialog for a day, with a start and end time and an Add Time Slot button.', width: 1466, height: 893 }}
            caption="Adding time slots for a day."
          />
        </div>
      </Section>

      <Outcome
        title="Live, and ready to measure."
        shipped={['Patient search and booking', 'Student scheduling and messaging', 'Live at versumhealth.com']}
        measure={['Time to book: under 5 minutes', 'Task completion: 90% or more', 'Satisfaction: 4.5 out of 5', 'No-show rate']}
        next={['Usability tests and pilots with dental schools', 'A supervisor console for verification and approvals', 'Eligibility screening, and partnerships with community health centers']}
        learned="A marketplace only works if both sides show up, and in healthcare every screen builds or erodes trust."
      />

      <ProcessDetails list="proto-personas · further out">
        <h3>Proto-personas</h3>
        <p className="cs-muted">Synthesized from the conversations, not individual participants.</p>
        <ul className="cs-list">
          <li><strong>Alicia, patient.</strong> An uninsured gig worker who hasn’t seen a dentist in years. Wants a cleaning and checkup she can afford. “I don’t even know where to start looking for affordable care.” Needs transparent pricing, easy booking and appointment reminders.</li>
          <li><strong>Noah, third-year dental student.</strong> Needs supervised procedures to graduate and reliable patients for specific procedure types. “Patients cancel last minute and I lose the whole day.” Needs a case pipeline, automated logging and patient reliability signals.</li>
        </ul>
        <h3>Further out</h3>
        <p>The model could work for other healthcare training programs, such as optometry, physical therapy and mental health counseling.</p>
      </ProcessDetails>

      <NextCase
        href="/work/spotify-loop"
        name="Spotify Loop,"
        line="replay one part of a song without leaving Spotify."
        img="/spotifyloophero.png"
        bg="#2f2f2f"
      />
    </CaseShell>
  );
}
