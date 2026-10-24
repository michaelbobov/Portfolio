import Navigation from '@/app/components/Navigation';
import {
  CaseHero,
  CaseShell,
  Decision,
  Decisions,
  Figure,
  MetaGrid,
  NextCase,
  ProcessDetails,
  Prose,
  Quote,
  Section,
  Tldr,
} from '@/app/components/case/Case';
import '../case.css';

// Versum Health case study. Copy follows the PM review (case-study-pm-review.md §3.1), keeping
// only what the page itself supports; open questions for Michael are left out, not shown.
export default function VersumCaseStudy() {
  return (
    <CaseShell nav={<Navigation />}>
      <CaseHero
        kicker="Healthcare · Marketplace · 2025"
        name="Versum Health"
        claim="helping uninsured patients and dental students find each other"
        summary="I co-founded Versum and designed and built its booking marketplace, which connects uninsured patients with supervised dental students who need patients to graduate."
        link={{ href: 'https://versumhealth.com/', label: 'versumhealth.com' }}
      />
      <MetaGrid
        items={[
          { label: 'Role', lines: ['Co-founder', 'Product Lead', 'Frontend Developer'] },
          { label: 'Timeline', lines: ['6 months', 'Research to MVP'] },
          { label: 'Team', lines: ['2-person team', 'Frontend & Backend'] },
          { label: 'Skills', lines: ['UX Research', 'Product Design', 'Prototyping'] },
        ]}
      />
      <Tldr
        status="LIVE MVP"
        rows={[
          { label: 'Problem', text: 'Uninsured patients delay dental care because of cost. Dental students can’t find the patients they need to graduate. Neither side can find the other.' },
          { label: 'How I found it', text: 'I’d seen friends skip dental care over cost. Then I talked to people on both sides. A hygienist almost didn’t graduate; she paid strangers to take free cleanings.' },
          { label: 'Solution and why', text: 'A booking marketplace: patients search by need or by student, see free cleanings, and book; students post availability. Finding each other was the blocker, so search leads.' },
          { label: 'Outcome', text: 'MVP live at versumhealth.com with booking, scheduling and messaging. Outreach to dental schools started. No usage data yet; usability tests and pilots are next.' },
        ]}
      />
      <Figure
        size="hero"
        priority
        img={{ src: '/versumheroimage.png', alt: 'The Versum Health website on a laptop: “Creating Universal Access to Free Healthcare”, with Get Free Care and Provide Care buttons.', width: 2400, height: 1161 }}
        caption="Two front doors on the live site: get care as a patient, or provide care as a student."
      />

      <Section id="problem" label="The problem" title="Patients can’t afford care, students can’t find patients, and neither can find the other.">
        <Prose>
          <p>
            Without insurance, a routine dental visit is expensive, so many people wait until it’s an emergency. Dental students need specific procedures to graduate, and finding patients who qualify takes time. Schools, students and patients all exist, but there’s no single place to find and book care with a supervised student. Patients who do find one worry about being treated by a student, so supervision has to be obvious.
          </p>
        </Prose>
      </Section>

      <Section id="found" label="How I found it" title="Both sides described the same gap: they couldn’t find each other.">
        <Prose>
          <p>This started with friends who avoided the dentist because of cost. Then I talked with people on both sides of the marketplace.</p>
        </Prose>
        <Quote who="Practicing dental hygienist">
          “I really struggled to get patients to fulfill my clinical hours and almost didn’t graduate. I had to pay people off the street a lot of money just to get them a free cleaning.”
        </Quote>
        <Prose>
          <p>A potential patient books cleanings through a friend who’s a hygienist. She knows most people don’t have that connection.</p>
          <p>
            On the patient side, the pain points were finding affordable options, not knowing the price before a visit, and worrying about quality. On the student side: finding qualifying cases, frequent no-shows and logging hours by hand. Under both lists was the same gap: no shared place to meet. Price and trust decide whether a match becomes a booking.
          </p>
        </Prose>
      </Section>

      <Section id="solution" label="Solution and why" title="Search first, with trust and price visible before anyone books." decisions>
        <Prose>
          <p>
            Think Zocdoc, but for care from supervised dental students. Patients search, filter and book in one place instead of calling schools or relying on word of mouth. Students set availability, accept or decline requests and manage their schedule. Supervisor tools are planned.
          </p>
        </Prose>
        <Decisions>
          <Decision n={1} title="Two ways to search, by need or by person.">
            <p>Some patients know what they need (“I need a cleaning”); others pick a provider. The Find tab supports both, which removes friction for each.</p>
          </Decision>
          <Decision n={2} title="Separate tabs for Find, Appointments and Messages.">
            <p>I considered one dashboard. People arrive with different goals, so each screen does one job.</p>
          </Decision>
          <Decision n={3} title="Free cleanings shown on the student’s card.">
            <p>Cost anxiety is a major barrier for uninsured patients. Students say at onboarding whether they offer free cleanings, and patients see it before they book.</p>
          </Decision>
          <Decision n={4} title="Past and upcoming visits in one view.">
            <p>Patients often need context from earlier visits when booking the next one. Keeping both together also saves clicks.</p>
          </Decision>
        </Decisions>
      </Section>

      <Section id="screens" label="Screens" title="On the student side, availability and services are set up once.">
        <Figure
          img={{ src: '/Student2.png', alt: 'Versum student schedule: a January calendar with a legend for available slots, patient bookings, confirmed and pending appointments, and a hint to click a future date to add time slots.', width: 1470, height: 894 }}
          caption="Students manage availability on a calendar: click a future date to add time slots."
        />
        <Figure
          img={{ src: '/Student5.png', alt: 'Versum student profile: name, school and graduation year, an About Me paragraph, and a Services Offered list including dental cleaning, fluoride treatment and preventive care.', width: 1558, height: 902 }}
          caption="Students list the services they offer on their profile."
        />
      </Section>

      <Section id="outcome" label="Outcome" title="Live, and not measured yet.">
        <Prose>
          <p>
            The MVP is live at versumhealth.com with patient search and booking, student scheduling and messaging. Supervisor tools are planned. We’ve started outreach to dental schools; usability testing and pilot partnerships are next. In pilots I’ll measure time to book (target under 5 minutes), task completion (target 90%+), satisfaction (target 4.5/5) and no-show rate.
          </p>
        </Prose>
      </Section>

      <Section id="learned" label="What I learned" title="A marketplace only works if both sides show up.">
        <Prose>
          <p>
            Every screen has to remove friction for patients and for students, and in healthcare every UI choice builds or erodes trust. Next: a supervisor console for verification and approvals, then eligibility screening and partnerships with community health centers.
          </p>
        </Prose>
      </Section>

      <ProcessDetails list="proto-personas · product flows · roadmap">
        <h3>Proto-personas</h3>
        <p className="cs-muted">Synthesized from the conversations above, not individual participants.</p>
        <ul className="cs-list">
          <li><strong>Alicia, patient.</strong> An uninsured gig worker who hasn’t seen a dentist in years. Wants a cleaning and checkup she can afford. “I don’t even know where to start looking for affordable care.” Needs transparent pricing, easy booking and appointment reminders.</li>
          <li><strong>Noah, third-year dental student.</strong> Needs supervised procedures to graduate and reliable patients for specific procedure types. “Patients cancel last minute and I lose the whole day.” Needs a case pipeline, automated logging and patient reliability signals.</li>
        </ul>
        <h3>Product flows</h3>
        <ul className="cs-list">
          <li><strong>Patient:</strong> browse availability → filter by procedure type → request an appointment.</li>
          <li><strong>Student:</strong> view case pipeline → accept or decline requests → manage schedule → log treatments.</li>
          <li><strong>Supervisor (planned):</strong> review scheduled procedures → verify supervision → approve hour logs.</li>
        </ul>
        <h3>Further out</h3>
        <p>The model could work for other healthcare training programs, such as optometry, physical therapy and mental health counseling.</p>
      </ProcessDetails>

      <NextCase
        href="/work/ez-recipe"
        name="EZ Recipe,"
        line="recipes from what’s already in your kitchen."
        img="/ezrecipehero.png"
        bg="#cfe8de"
      />
    </CaseShell>
  );
}
