'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Navigation from '@/app/components/Navigation';

export const dynamic = 'force-dynamic';

export default function VersumCaseStudy() {
  const [activeSection, setActiveSection] = useState('overview');
  const sections = useRef<{ [key: string]: HTMLElement | null }>({});
  const [isManualScroll, setIsManualScroll] = useState(false);

  // Function to determine which section is most visible
  const determineActiveSection = () => {
    const sectionVisibility: { [key: string]: number } = {};
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const bottomOffset = 100; // Adjust for bottom of page

    Object.entries(sections.current).forEach(([id, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Special handling for sections near the bottom of the page
        const isNearBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100;
        
        if (isNearBottom && id === 'future') {
          sectionVisibility[id] = 1; // Prioritize last section when near bottom
        } else {
          // Calculate visibility ratio
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const sectionHeight = rect.height;
          const visibilityRatio = Math.max(0, visibleHeight / sectionHeight);
          sectionVisibility[id] = visibilityRatio;
        }
      }
    });

    // Find section with highest visibility
    let maxVisibility = 0;
    let mostVisibleSection = activeSection;

    Object.entries(sectionVisibility).forEach(([id, visibility]) => {
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleSection = id;
      }
    });

    if (mostVisibleSection !== activeSection && !isManualScroll) {
      setActiveSection(mostVisibleSection);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', determineActiveSection);
    return () => window.removeEventListener('scroll', determineActiveSection);
  }, [activeSection, isManualScroll]);

  const setSectionRef = (id: string) => (element: HTMLElement | null) => {
    sections.current[id] = element;
  };

  const scrollToSection = (sectionId: string) => {
    setIsManualScroll(true);
    setActiveSection(sectionId);
    const element = sections.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => setIsManualScroll(false), 1000);
  };

  return (
    <main className="bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image 
              src="/blackinitals.png"
              alt="MB - Michael Bobov"
              width={80}
              height={80}
              className="w-16 h-16"
              priority
            />
          </Link>
          <Navigation />
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-normal text-center mb-8 tracking-tight text-gray-900"
        >
          Versum Health
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
        >
          Connecting uninsured patients with dental students
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-center mb-8 text-gray-500 italic"
        >
          A platform that pairs low‑income patients with supervised student clinicians for accessible, affordable dental care.
        </motion.p>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto -mt-12"
        >
          <Image 
            src="/versumpersona1.jpg"
            alt="Versum Health Platform Interface"
            width={1200}
            height={675}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            className="w-full rounded-2xl"
          />
        </motion.div>
      </div>
      
      {/* Main Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 container mx-auto px-4">
        {/* Sidebar Navigation */}
        <nav className="lg:sticky lg:top-24 h-fit order-2 lg:order-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              {['overview', 'design', 'ideate', 'prototype', 'test', 'reflections', 'future', 'final'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-left px-3 py-4 rounded-md text-sm transition-colors min-h-[44px] flex items-center ${
                    activeSection === section 
                      ? 'bg-purple-50 text-purple-600 font-medium border-l-2 border-purple-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {section === 'overview' && 'Project Summary'}
                  {section === 'design' && 'Design Process'}
                  {section === 'ideate' && 'Ideate'}
                  {section === 'prototype' && 'Prototype & Design'}
                  {section === 'test' && 'Test & Validation'}
                  {section === 'reflections' && 'Reflections & Takeaways'}
                  {section === 'future' && 'Future Enhancements'}
                  {section === 'final' && 'Final Thoughts'}
                </button>
              ))}
            </div>
            
            {/* Back to Top Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 10l7-7m0 0l7 7m-7-7v18" 
                  />
                </svg>
                Back to Top
              </button>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="order-1 lg:order-2">

        {/* Project Overview Section */}
        <motion.section
          ref={setSectionRef('overview')}
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Project Summary
          </h2>
          
          {/* Top Section - Role, Time, Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role</h3>
              <p className="text-gray-600">Co-founder, Product Designer, Front-end Developer</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time</h3>
              <p className="text-gray-600">6 months (Research to MVP)</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product</h3>
              <p className="text-gray-600">Healthcare Access Platform</p>
            </div>
          </div>

          {/* Left/Right Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Project Vision */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Vision</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Versum Health helps uninsured or low‑income patients book free/affordable dental visits with dental students who must complete supervised clinical hours. Patients get care; students gain experience under direct supervision (overseen by supervisors in the real world).
              </p>
              <p className="text-gray-600 leading-relaxed">
                Two‑sided platform — access for patients, hours for students. The platform creates a connected marketplace where patients find care and students get clinical hours, with built-in confirmation that all procedures will be performed under direct supervision.
              </p>
            </div>

            {/* Right Side - Challenges */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Challenges</h3>
              <ol className="text-gray-600 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Patients struggle to find affordable care, students can't find enough supervised cases</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Discovery is the main bottleneck for both patients and students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Safety and supervision confirmation must be built into the platform flow</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Success Metrics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></span>
                  <span>Reduce time‑to‑care for patients who avoid treatment due to cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></span>
                  <span>Increase student clinical‑hour throughput and case diversity</span>
                </li>
              </ul>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></span>
                  <span>Ensure platform confirms all procedures will be performed under direct supervision</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></span>
                  <span>Enable loop from discovery → booking → logging end‑to‑end</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Design Process Section */}
        <motion.section
          ref={setSectionRef('design')}
          id="design"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Design Process
          </h2>
          
          {/* Step 1: Empathize & Research */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">1. Empathize & Research</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Research & Validation</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                To understand user needs and validate the opportunity, I conducted comprehensive research across multiple channels:
              </p>
              
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Stakeholder Conversations</h5>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                    <span><strong>4 dental students, 2 recent grads:</strong> "We need qualifying procedures and documentation; must manage schedule and clinical log; want reliable attendance."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                    <span><strong>1 clinic coordinator:</strong> "We need proof of consent, scope control, and sign‑offs; want simple oversight, not new administrative burden."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                    <span><strong>5 low‑income patients:</strong> "Uninsured, postpone routine care; need transparent availability and costs; prefer mobile scheduling and reminders."</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Desk Research</h5>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                    <span>Statistics on dental insurance coverage and missed care revealed significant gaps in access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                    <span>Journey mapping: "Find care" (patient) and "Find qualifying case" (student) showed discovery as the main bottleneck.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Personas</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-2">Patient (Alicia, 34)</h5>
                  <p className="text-gray-600 text-sm">Uninsured, postpones routine care; needs transparent availability and costs; prefers mobile scheduling and reminders.</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-2">Student (Noah, D3)</h5>
                  <p className="text-gray-600 text-sm">Needs qualifying procedures and documentation; must manage schedule and clinical log; wants reliable attendance; confirms all procedures will be under direct supervision.</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4">
                Two platform users drive the core IA: find, schedule, with built-in supervision confirmation (supervisors oversee in the real world).
              </p>
            </div>
          </div>

          {/* Step 2: Define */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">2. Define</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Problem Statement</h4>
              <blockquote className="text-gray-700 italic border-l-4 border-purple-600 pl-4">
                How might we allow patients to seamlessly access affordable dental care while helping students gain required clinical hours, all under proper supervision?
              </blockquote>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">How might we (HMW)</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">HMW make it easy for patients to discover and book supervised student appointments near them?</h5>
                  <p className="text-gray-600 text-sm">Reduce search friction and no‑shows.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">HMW help students source qualifying cases and log hours without duplicate data entry?</h5>
                  <p className="text-gray-600 text-sm">One action should satisfy both clinical and scheduling needs.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">HMW ensure all procedures are performed under direct supervision with clear confirmation?</h5>
                  <p className="text-gray-600 text-sm">Safety and supervision confirmation first; seamless experience second.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Ideate Section */}
        <motion.section
          ref={setSectionRef('ideate')}
          id="ideate"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Ideate
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            I brainstormed multiple UI approaches, including <strong>patient-focused booking</strong> (streamlined but potentially overwhelming), <strong>student-centered dashboard</strong> (guided but slow), and <strong>three-panel layout</strong> (immediate feedback, familiar pattern).
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium mb-4 text-gray-900">Final Concept: Three-Panel Marketplace</h4>
            <p className="text-gray-600 leading-relaxed">
              The final concept is a three-panel marketplace: patients browse and book appointments, students manage their case pipeline and log hours, and supervisors oversee the process with verification tools. Each panel serves one primary user type while maintaining visibility across the system.
            </p>
          </div>

          {/* Information Architecture */}
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4 text-gray-900">Information Architecture</h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              To ensure the interaction felt intuitive, I mapped out the complete user journey from discovering the platform to successfully completing appointments. This flow chart helped identify potential friction points and validate the three-panel approach.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h5 className="font-medium text-gray-900 mb-2">Patient Portal</h5>
                <p className="text-gray-600 text-sm">browse availability → request appointment → confirm supervision → reminders</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h5 className="font-medium text-gray-900 mb-2">Student Dashboard</h5>
                <p className="text-gray-600 text-sm">case pipeline → schedule → treatment logging → clinical hour tracking</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">
              IA mirrors the two platform users to minimize mental model conflict, with built-in supervision confirmation (supervisors oversee in the real world).
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4 text-gray-900">Design Principles</h4>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>Safety by design: consent, scope, escalation pathways are surfaced before actions.</li>
              <li>Low‑friction forms: few fields, progressive disclosure for medical details.</li>
              <li>Mobile‑first: appointments and reminders optimized for 320–768px.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Principles matched resource constraints of real clinics.
            </p>
          </div>
        </motion.section>

        {/* Prototype & Design Section */}
        <motion.section
          ref={setSectionRef('prototype')}
          id="prototype"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Prototype & Design
          </h2>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900">Design Goals</h4>
            <p className="text-gray-600 leading-relaxed">
              The design aims to seamlessly integrate healthcare access with minimal cognitive load, show clear visual feedback when appointments are active, and ensure touch-friendliness for mobile users.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900">Platform Feature Breakdown</h4>
            <p className="text-gray-600 leading-relaxed">
              The platform works through a simple three-panel approach: patients browse and book appointments, students manage their case pipeline and log hours, and supervisors oversee the process with verification tools. While appointments are active, clear visual indicators show the status, and users can manage their experience with one tap. At any point, users can toggle between panels to access different functionality, ensuring the original healthcare experience is preserved.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900">Where We Placed It (and Why)</h4>
            <p className="text-gray-600 leading-relaxed">
              The platform uses a three-panel layout that keeps the interface clean while making all functionality easily accessible — similar to modern healthcare platforms but optimized for the three-user workflow.
            </p>
          </div>

          {/* Design System Integration */}
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4 text-gray-900">Design System Integration</h4>
            <p className="text-gray-600 leading-relaxed">
              We used healthcare-appropriate colors and typography to maintain trust and accessibility, applied consistent spacing and component patterns for rhythm and readability, and designed icons that match existing healthcare platform conventions.
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4 text-gray-900">Micro-Interactions & Polish</h4>
            <p className="text-gray-600 leading-relaxed">
              The experience includes smooth animations for appointment creation and status transitions, subtle feedback aligned with healthcare platform patterns, and loading/error states that feel native to healthcare applications.
            </p>
          </div>
        </motion.section>

        {/* Test & Validation Section */}
        <motion.section
          ref={setSectionRef('test')}
          id="test"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Test & Validation
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            With the Figma prototype complete, I'm ready to validate the platform design through comprehensive user testing and technical feasibility assessment.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Success Metrics</h4>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Task completion rate &gt; 90% for appointment booking</li>
                <li>Time to book first appointment &lt; 5 minutes</li>
                <li>User satisfaction score &gt; 4/5</li>
                <li>Zero critical usability issues</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Technical Considerations</h4>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Integration with existing healthcare systems</li>
                <li>Appointment state persistence across sessions</li>
                <li>Performance impact on booking engine</li>
                <li>Cross-platform consistency (iOS/Android)</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900">Implementation Strategy</h4>
            <p className="text-gray-600 leading-relaxed mb-4">
              The platform would be implemented as a phased rollout: first to pilot clinics as a beta feature, then gradually expanded based on usage data and feedback. This approach allows for iterative improvement and risk mitigation.
            </p>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="font-medium text-purple-600 mb-2">Business Impact</h5>
              <p className="text-gray-700 leading-relaxed">
                Implementing a healthcare access platform could significantly improve patient outcomes and student training. Highly engaged users – such as patients seeking affordable care and students needing clinical hours – would benefit from streamlined access. This deeper engagement has been linked to better healthcare outcomes and educational success.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Reflections */}
        <motion.section
          ref={setSectionRef('reflections')}
          id="reflections"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Reflections & Takeaways
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Versum Health might seem like a simple platform, but it addresses a fundamental gap in healthcare access. From patients to students to supervisors, people need to connect for care and training quickly and reliably. This platform empowers users to access healthcare and gain clinical experience without traditional barriers.
            </p>
            <blockquote className="text-gray-700 italic border-l-4 border-purple-600 pl-4">
              "I just need to find affordable dental care, but everything is so expensive."
            </blockquote>
            <p className="text-gray-600 leading-relaxed">
              As a designer and developer, this project taught me the value of solving real problems with simple solutions. Sometimes the best platforms are the ones that eliminate complexity rather than adding features.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Key Learnings</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                  <span><strong>Healthcare + UX = Impact</strong> – The combination of healthcare needs with thoughtful user experience design can create platforms that feel almost magical to use.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                  <span><strong>Simplicity Scales</strong> – The most powerful platforms are often the simplest ones. Versum Health's success comes from doing one thing exceptionally well.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                  <span><strong>Real Problems, Real Solutions</strong> – Building platforms to solve your own problems often leads to solutions that resonate with others facing similar challenges.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Future Enhancements */}
        <motion.section
          ref={setSectionRef('future')}
          id="future"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Future Enhancements
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Planned enhancements include supervisor console with verification and bulk approvals, eligibility screening to protect students/patients from mis‑scoped cases, attendance equity with guardrails against preferential selection, and community partner integration to widen patient reach.
          </p>
        </motion.section>

        {/* Final Thoughts */}
        <motion.section
          ref={setSectionRef('final')}
          id="final"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-xl md:text-2xl text-purple-600 font-medium mb-6 md:mb-8 uppercase tracking-wide">
            Final Thoughts
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This case study pushed me to think deeply about the intersection of healthcare access and user experience design. Versum Health is about more than appointment booking — it's about making healthcare accessible to everyone, regardless of their insurance status or financial situation.
          </p>
        </motion.section>
        </div>
      </div>
    </main>
  );
}