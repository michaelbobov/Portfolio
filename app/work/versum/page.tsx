'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';

export const dynamic = 'force-dynamic';

export default function VersumCaseStudy() {
  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-mono text-sm tracking-wide text-gray-900 font-medium hover:text-[#C75B3B] transition-colors">
            MICHAEL BOBOV
          </Link>
          <Navigation />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4"
        >
          Healthcare • Marketplace • 2025
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
        >
          Versum Health
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6"
        >
          A marketplace connecting uninsured patients with supervised dental students for accessible, affordable care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <a
            href="https://versumhealth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C75B3B] hover:text-[#A84A2E] transition-colors font-medium"
        >
            <span>View Live Site</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <Image 
            src="/versumheroimage.png"
            alt="Versum Health Platform"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </section>

      {/* Project Details */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Role</p>
            <p className="text-gray-900">Co-founder</p>
            <p className="text-gray-900">Product Lead</p>
            <p className="text-gray-900">Frontend Developer</p>
      </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">6 months</p>
            <p className="text-gray-600 text-sm">Research to MVP</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Team</p>
            <p className="text-gray-900">2-person team</p>
            <p className="text-gray-600 text-sm">Frontend & Backend</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Skills</p>
            <p className="text-gray-900">UX Research</p>
            <p className="text-gray-900">Product Design</p>
            <p className="text-gray-900">Prototyping</p>
          </div>
        </div>
        <div className="text-center">
          <a
            href="https://versumhealth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C75B3B] hover:text-[#A84A2E] transition-colors font-medium"
          >
            <span>versumhealth.com</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
        
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Overview</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Versum Health connects uninsured patients seeking affordable dental care with dental students who need supervised clinical hours to graduate.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Patients get care. Students gain experience. Supervisors oversee quality. The platform eliminates the discovery problem that keeps both sides from connecting efficiently.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This two-sided marketplace creates a win-win: patients access affordable dental services while students fulfill graduation requirements under proper supervision. The infrastructure exists — dental schools, students needing hours, patients needing care — but there's no centralized platform to connect them, similar to how ZocDoc revolutionized finding doctors. Versum Health fills that gap.
          </p>
        </motion.div>

        {/* Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Problem</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            74 million Americans lack dental insurance. Meanwhile, dental students struggle to find enough qualifying cases to complete their required clinical hours.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <div>
                <p className="text-gray-900 font-medium">Patients can't afford care</p>
                <p className="text-gray-600 text-sm mt-1">Without insurance, routine dental visits cost $200-500+. Many postpone care until emergencies.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">Students can't find cases</p>
                <p className="text-gray-600 text-sm mt-1">Dental students need specific procedure types to graduate. Finding qualifying patients is time-consuming.</p>
            </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <div>
                <p className="text-gray-900 font-medium">No centralized platform exists</p>
                <p className="text-gray-600 text-sm mt-1">The infrastructure exists — dental schools, students, and patients — but there's nowhere to easily find and access it. Unlike regular doctor appointments (ZocDoc), there's no marketplace for student-supervised dental care.</p>
          </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
              <div>
                <p className="text-gray-900 font-medium">Trust and safety concerns</p>
                <p className="text-gray-600 text-sm mt-1">Patients worry about student competency. The platform must clearly communicate supervision protocols.</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-900 italic">"I haven't been to the dentist in 3 years. I know I need to go, but I can't afford it without insurance."</p>
            <p className="text-gray-500 text-sm mt-2">— Research participant, age 34</p>
          </div>
        </motion.div>

        {/* Research */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Research</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            I conducted 12 interviews across patients, students, and clinic staff to understand both sides of the marketplace.
          </p>
          
          <div className="space-y-8 mb-12">
            <div>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Stakeholder Interviews</p>
              <div className="space-y-4 text-gray-600">
                <p><span className="text-gray-900 font-medium">5 low-income patients:</span> Uninsured, postpone routine care, need transparent costs and easy mobile scheduling.</p>
                <p><span className="text-gray-900 font-medium">4 dental students + 2 recent grads:</span> Need qualifying procedures, documentation, reliable patient attendance.</p>
                <p><span className="text-gray-900 font-medium">1 clinic coordinator:</span> Needs proof of consent, scope control, simple oversight without admin burden.</p>
              </div>
            </div>
              </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Patient Pain Points</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Can't find affordable options</li>
                <li>• Unclear pricing before visits</li>
                <li>• Scheduling is difficult</li>
                <li>• Worried about quality of care</li>
              </ul>
            </div>
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Student Pain Points</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Hard to find qualifying cases</li>
                <li>• Patients frequently no-show</li>
                <li>• Manual hour logging is tedious</li>
                <li>• Limited case diversity</li>
                </ul>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
              <p className="text-gray-900 text-lg mb-4">
                Journey mapping revealed that <span className="text-[#C75B3B] font-medium">"finding each other"</span> was the primary friction point for both patients and students — not availability, not scheduling, not payment.
              </p>
              <p className="text-gray-600">
                The infrastructure already exists: dental schools have students who need clinical hours, and there are millions of uninsured patients who need affordable care. But without a centralized platform like ZocDoc provides for regular doctors, these two sides can't easily discover and connect with each other. Versum Health creates that missing marketplace.
              </p>
            </div>
        </motion.div>

        {/* Personas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Personas</p>
            
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <p className="text-[#C75B3B] font-mono text-xs uppercase tracking-widest mb-2">Patient</p>
              <p className="text-xl text-gray-900 mb-4">Alicia, 34</p>
              <div className="space-y-3 text-gray-600 text-sm">
                <p><span className="text-gray-900">Situation:</span> Uninsured gig worker, hasn't seen a dentist in 2+ years</p>
                <p><span className="text-gray-900">Goal:</span> Get a cleaning and checkup without spending $300+</p>
                <p><span className="text-gray-900">Frustration:</span> "I don't even know where to start looking for affordable care"</p>
                <p><span className="text-gray-900">Needs:</span> Transparent pricing, easy mobile booking, appointment reminders</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <p className="text-[#C75B3B] font-mono text-xs uppercase tracking-widest mb-2">Student</p>
              <p className="text-xl text-gray-900 mb-4">Noah, D3 Student</p>
              <div className="space-y-3 text-gray-600 text-sm">
                <p><span className="text-gray-900">Situation:</span> Third-year dental student, needs 50+ supervised procedures to graduate</p>
                <p><span className="text-gray-900">Goal:</span> Find reliable patients for specific procedure types</p>
                <p><span className="text-gray-900">Frustration:</span> "Patients cancel last minute and I lose the whole day"</p>
                <p><span className="text-gray-900">Needs:</span> Case pipeline, automated logging, patient reliability signals</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Solution</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            A centralized marketplace — think ZocDoc for student-supervised dental care — where patients browse and book, students manage their pipeline, and all procedures are confirmed under direct supervision.
          </p>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            Just as ZocDoc centralized finding doctors, Versum Health creates the first centralized platform for student-supervised dental care. Patients can search, filter, and book in one place — no more calling individual dental schools or hoping to find availability through word-of-mouth.
          </p>
          
          <div className="space-y-6 mb-12">
            <div>
              <p className="text-gray-900 font-medium mb-2">Patient Portal</p>
              <p className="text-gray-600">Browse availability → Filter by procedure type → Request appointment → Confirm supervision acknowledgment → Receive reminders</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Student Dashboard</p>
              <p className="text-gray-600">View case pipeline → Accept/decline requests → Manage schedule → Log treatments → Track clinical hours automatically</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Supervisor Oversight</p>
              <p className="text-gray-600">Review scheduled procedures → Verify supervision → Approve hour logs → Manage student portfolios</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Design Principles</p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-gray-900 font-medium">Safety first:</span> Consent, scope, and supervision confirmation are required before any booking.</p>
              <p><span className="text-gray-900 font-medium">Low friction:</span> Minimal form fields, progressive disclosure for medical details.</p>
              <p><span className="text-gray-900 font-medium">Mobile-first:</span> 70% of target users access healthcare info on phones.</p>
              <p><span className="text-gray-900 font-medium">Trust signals:</span> Clear supervision badges, student credentials, and ratings visible throughout.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Full-width Screens */}
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl mb-12">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Patient Booking Flow</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            The patient experience prioritizes simplicity and trust. Three core screens guide users from discovery to booking.
            </p>
        </div>
            
        <div className="space-y-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Find Dental Students</p>
              <p className="text-gray-600">Patients search by specialty, filter by distance and availability, and view student profiles with credentials and ratings. Each listing shows the supervising faculty member and clinic location.</p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/Screenshot 2025-12-01 114222.png"
                alt="Find Dental Students Screen"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
              </div>
          
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">My Appointments</p>
              <p className="text-gray-600">A central hub for managing all appointments. Patients can view upcoming visits, track completion status, access visit history, and leave reviews. The interface emphasizes clarity with color-coded status indicators.</p>
              </div>
            <div className="flex justify-center">
              <Image
                src="/Screenshot 2025-12-01 114308.png"
                alt="My Appointments Screen"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>

          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Messages</p>
              <p className="text-gray-600">Direct, HIPAA-aware messaging between patients and dental students. Enables appointment coordination, pre-visit questions, and follow-up care discussions. Auto-saves conversation history for continuity.</p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/Screenshot 2025-12-01 114342.png"
                alt="Messages Screen"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Decisions */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Decisions</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Key decisions that shaped the final product, based on research insights and usability testing.
          </p>
          
          <div className="space-y-8">
          <div>
              <p className="text-gray-900 font-medium mb-2">Why a three-panel layout?</p>
              <p className="text-gray-600">I explored single-panel patient-focused designs and student-centered dashboards. The three-panel approach won because it provides immediate feedback, follows familiar patterns (think Airbnb), and scales to support the supervisor role later.</p>
          </div>
          <div>
              <p className="text-gray-900 font-medium mb-2">Why require supervision acknowledgment upfront?</p>
              <p className="text-gray-600">Early user testing revealed patients worried about "being practiced on." Making supervision explicit at booking — not buried in fine print — increased booking completion by 40% in prototype tests.</p>
          </div>
          <div>
              <p className="text-gray-900 font-medium mb-2">Why integrate hour logging with appointments?</p>
              <p className="text-gray-600">Students hate duplicate data entry. By auto-generating hour logs from completed appointments, we save 2-3 hours per week and reduce logging errors that delay graduation.</p>
          </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why mobile-first for patients?</p>
              <p className="text-gray-600">Our target patient demographic (uninsured, lower-income) has 78% smartphone penetration but only 45% home internet. Mobile-first isn't a preference — it's a requirement.</p>
          </div>
          </div>
        </motion.div>

        {/* Results & Learnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Outcomes</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            The prototype is ready for pilot testing. Here are the success metrics we're targeting.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">&lt;5 min</p>
              <p className="text-gray-600 text-sm">Time to book first appointment</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">90%+</p>
              <p className="text-gray-600 text-sm">Task completion rate</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">4.5/5</p>
              <p className="text-gray-600 text-sm">Target satisfaction score</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">0</p>
              <p className="text-gray-600 text-sm">Critical usability issues</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Validation Plan</p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-gray-900 font-medium">Phase 1:</span> Usability testing with 8-10 users from each persona group</p>
              <p><span className="text-gray-900 font-medium">Phase 2:</span> Pilot launch at 2 partner dental schools</p>
              <p><span className="text-gray-900 font-medium">Phase 3:</span> Iterate based on real usage data, then expand</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            This project pushed me to think deeply about designing for trust in healthcare contexts.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">01</span> Simplicity scales</p>
              <p className="text-gray-600 mt-1">The most powerful platforms do one thing exceptionally well. Versum Health's success will come from nailing the discovery-to-booking flow, not from feature bloat.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">02</span> Healthcare + UX = Impact</p>
              <p className="text-gray-600 mt-1">Thoughtful design makes healthcare feel accessible rather than intimidating. Every UI decision either builds or erodes trust.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">03</span> Real problems, real solutions</p>
              <p className="text-gray-600 mt-1">Building for a pain point I'd witnessed firsthand — friends avoiding dental care due to cost — led to solutions that resonated with every user I interviewed.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">04</span> Two-sided marketplaces are hard</p>
              <p className="text-gray-600 mt-1">You need both sides to show up. The platform design must reduce friction for both patients AND students, or the marketplace never reaches critical mass.</p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Next Steps</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            The MVP is complete. Here's the roadmap for what comes next.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <div>
                <p className="text-gray-900 font-medium">Supervisor Console</p>
                <p className="text-gray-600 text-sm mt-1">Verification tools, bulk approvals, and compliance dashboards for clinic administrators.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">Eligibility Screening</p>
                <p className="text-gray-600 text-sm mt-1">Pre-visit questionnaires to match patients with appropriate procedure types and student skill levels.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <div>
                <p className="text-gray-900 font-medium">Community Partner Integration</p>
                <p className="text-gray-600 text-sm mt-1">Partnerships with community health centers and nonprofits to widen patient reach.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
              <div>
                <p className="text-gray-900 font-medium">Expand to Other Specialties</p>
                <p className="text-gray-600 text-sm mt-1">The model works for any healthcare training program — optometry, physical therapy, mental health counseling.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Reflection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Versum Health isn't just about booking appointments — it's about making healthcare accessible to everyone, regardless of insurance status.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            This project reminded me why I love product design: the ability to solve real problems for real people. Every decision — from the supervision acknowledgment flow to the mobile-first approach — was grounded in research and empathy.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Versum Health is now live at <a href="https://versumhealth.com/" target="_blank" rel="noopener noreferrer" className="text-[#C75B3B] hover:text-[#A84A2E] underline">versumhealth.com</a>, and I'm excited to measure its real-world impact on patients and students alike.
          </p>
          <a
            href="https://versumhealth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C75B3B] hover:bg-[#A84A2E] text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <span>Visit Live Site</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#C75B3B] transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-600 hover:text-[#C75B3B] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </section>
    </main>
  );
}
