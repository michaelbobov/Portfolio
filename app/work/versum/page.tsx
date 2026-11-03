import { CaseHeader, CaseShell, Choice, Choices, NextCase, Outcome, Prose, Quote, Section, Step, Steps } from '@/app/components/case/Study';
import MotionVideo from '@/app/components/MotionVideo';
import '../study.css';

// Versum Health case study: what it is and the facts, the live site in motion, then the problem, the
// process, four decisions and where it stands. Every fact is from the author's own write-ups
// (versum-case-study.md and the earlier page); nothing is measured that wasn't.
export default function VersumCaseStudy() {
  return (
    <CaseShell>
      <CaseHeader
        name="Versum Health"
        subtitle="Helping uninsured patients and dental students find each other."
        facts={[
          { label: 'Role', value: 'Co-founder, product lead, frontend' },
          { label: 'Team', value: '2 co-founders' },
          { label: 'Timeline', value: '6 months, 2025' },
          { label: 'Platform', value: 'Web' },
        ]}
        status="LIVE MVP"
        link={{ href: 'https://versumhealth.com/', label: 'versumhealth.com' }}
        media={
          <MotionVideo
            src="/versum-overview.mp4"
            poster="/versum-overview.jpg"
            width={2100}
            height={900}
            label="Versum feature overview: the live site in English and Spanish, then a student’s dashboard, calendar, time slots and services"
          />
        }
      />

      <Section n={1} id="overview" title="Overview">
        <Prose>
          <p>Versum Health is a booking marketplace that connects uninsured patients with dental students, who need patients for the supervised procedures they must complete to graduate. Patients get affordable care, students get the cases they need, and supervisors oversee the work.</p>
          <p>I co-founded Versum with a backend developer. I led the product, designed it and built the frontend. The MVP is live at versumhealth.com with booking, scheduling and messaging. Outreach to dental schools has started, and there’s no usage data yet.</p>
        </Prose>
      </Section>

      <Section n={2} id="problem" title="The problem">
        <Prose>
          <p>Uninsured patients often put off dental care until it becomes an emergency, because they can’t afford it. Dental students need specific procedures to graduate and struggle to find patients for them.</p>
          <p>The students and patients I talked to had no shared place to find each other. Versum is meant to be that place, the way ZocDoc is for regular doctors.</p>
        </Prose>
      </Section>

      <Section n={3} id="process" title="Process">
        <Steps>
          <Step title="Talking to both sides">
            <p>I talked with uninsured patients and dental students about how they find each other today. A practicing dental hygienist told me they almost didn’t graduate because they couldn’t find enough patients. One potential patient books through a friend who’s a dental hygienist, and knows most people don’t have that connection.</p>
            <Quote text="I had to pay people off the street a lot of money just to get them a free cleaning." who="A practicing dental hygienist, on getting through school" />
            <p>On both sides, the biggest problem was finding each other. Availability, scheduling and payment mattered too, but that came first, so it became the focus of the MVP.</p>
          </Step>
          <Step
            title="Proto-personas"
            pics={[
              { src: '/versumpersona1.jpg', alt: 'Proto-persona Alicia, a financially stretched caregiver who needs affordable, transparent dental care.', width: 1024, height: 1024, caption: 'Alicia, 34, uninsured: needs to know the price up front.' },
              { src: '/versumpersona2.jpg', alt: 'Proto-persona Noah, a third-year dental student who needs qualifying patients and fewer no-shows.', width: 1024, height: 1024, caption: 'Noah, 23, dental student: needs patients who show up.' },
              { src: '/versumpersona3.jpg', alt: 'Proto-persona Elena, a Spanish-speaking senior who needs care explained in her language.', width: 1024, height: 1024, caption: 'Elena, 70, speaks only Spanish: needs care explained in it.' },
            ]}
          >
            <p>I turned what I heard into three proto-personas. Together they showed that price and trust decide whether a match turns into a booking.</p>
          </Step>
          <Step
            title="User flows"
            flows={[
              { who: 'Patient', steps: ['Find', 'Filter', 'Request'] },
              { who: 'Student', steps: ['Accept', 'Schedule', 'Log'] },
            ]}
          >
            <p>I mapped one flow for each side. The two flows meet at the booking request. Supervisor approvals are planned for a later version.</p>
          </Step>
          <Step
            title="Design and build"
            pics={[
              { src: '/Student2.png', alt: 'Versum student schedule: a January calendar with a legend for available slots, patient bookings, confirmed and pending appointments.', width: 1470, height: 894, caption: 'Students click a future date on their calendar to add time slots.' },
              { src: '/Student3.png', alt: 'Versum: the Manage Time Slots dialog for a day, with a start and end time and an Add Time Slot button.', width: 1466, height: 893, caption: 'Adding time slots for one day.' },
            ]}
          >
            <p>I designed it search-first, with price and supervision visible before anyone books, then built the frontend in React, TypeScript and Tailwind while my co-founder built the backend.</p>
          </Step>
        </Steps>
      </Section>

      <Section n={4} id="decisions" title="Design decisions">
        <Choices>
          <Choice n={1} title="Two ways to search: by need or by student">
            <p>Some patients know what they need, like a cleaning; others want to choose a person. The Find tab supports both, so neither group has to work around the other’s way of searching.</p>
          </Choice>
          <Choice
            n={2}
            title="A tab for each job instead of one dashboard"
            shots={[{ img: { src: '/versum-messages.png', alt: 'Versum Messages tab: a list of conversations beside the selected one.', width: 1576, height: 899 } }]}
            caption="Messages has its own tab (student side; the name is blurred)."
          >
            <p>I considered a single dashboard, but people come to Versum with different goals. Find, Appointments and Messages each do one job, which keeps every screen focused.</p>
          </Choice>
          <Choice
            n={3}
            title="Show free cleanings before booking"
            shots={[{ img: { src: '/Student5.png', alt: 'Versum student profile: school and graduation year, About Me, and a Services Offered list including dental cleaning.', width: 1558, height: 902 } }]}
            caption="A student’s profile, where they list services such as cleanings. The patient’s view of the card isn’t shown."
          >
            <p>Cost is a major barrier for uninsured patients. Students say during onboarding whether they offer free cleanings, and patients see it on the student’s card, so there are no surprises later.</p>
          </Choice>
          <Choice
            n={4}
            title="Upcoming and past visits on one screen"
            shots={[{ img: { src: '/Student1.png', alt: 'Versum dashboard with Upcoming Appointments and Past Appointments tabs side by side.', width: 1481, height: 877 } }]}
            caption="The same pattern on the student dashboard: Upcoming and Past are tabs on one screen."
          >
            <p>Booking the next visit often needs context from the last one. Upcoming and past appointments sit side by side as tabs on the same screen, so history is one click away instead of on a separate page.</p>
          </Choice>
        </Choices>
      </Section>

      <Outcome
        n={5}
        shipped={['Patient search and booking', 'Student scheduling and messaging', 'Live at versumhealth.com']}
        measure={['Time to book a first appointment, aiming for under 5 minutes', 'Task completion, aiming for 90% or more', 'Satisfaction, aiming for 4.5 out of 5', 'No-show rate']}
        next={[
          'Usability tests with 8 to 10 people from each group, then pilots at partner dental schools',
          'A supervisor console for verification and approvals',
          'Eligibility screening, and partnerships with community health centers',
        ]}
        learned="I started Versum because I’d watched friends skip the dentist over cost. I didn’t expect the dental students to be just as stuck, trying to find patients so they could graduate."
      />

      <NextCase href="/work/inkling" name="Inkling" line="For everything you text yourself and forget." img={{ src: "/inkling-tour.jpg", width: 2100, height: 900 }} />
    </CaseShell>
  );
}
