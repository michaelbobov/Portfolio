'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Navigation from '@/app/components/Navigation';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export const dynamic = 'force-dynamic';

export default function PDFPenguinCaseStudy() {
  const [activeSection, setActiveSection] = useState('overview');
  const sections = useRef<{ [key: string]: HTMLElement | null }>({});
  const [isManualScroll, setIsManualScroll] = useState(false);

  // Function to determine which section is most visible
  const determineActiveSection = () => {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.pageYOffset;
    
    // Find the section that is most visible in the viewport
    let bestSection = activeSection;
    let bestVisibility = 0;

    Object.entries(sections.current).forEach(([id, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Check if section is in viewport
        if (rect.bottom > 0 && rect.top < windowHeight) {
          // Calculate how much of the section is visible
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;
          
          // Give extra weight to sections that are more centered
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
          const centerWeight = Math.max(0, 1 - distanceFromCenter / (windowHeight / 2));
          
          const totalScore = visibilityRatio + centerWeight * 0.3;
          
          if (totalScore > bestVisibility) {
            bestVisibility = totalScore;
            bestSection = id;
          }
        }
      }
    });

    return bestSection;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;
      
      const newActiveSection = determineActiveSection();
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualScroll, activeSection]);



  const scrollToSection = (sectionId: string) => {
    const section = sections.current[sectionId];
    if (section) {
      setIsManualScroll(true);
      setActiveSection(sectionId);

      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset manual scroll after animation
      setTimeout(() => {
        setIsManualScroll(false);
      }, 1000);
    }
  };

  const setSectionRef = (sectionId: string) => (el: HTMLElement | null) => {
    sections.current[sectionId] = el;
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
          PDF Penguin
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
        >
          AI-powered PDF to JSON conversion for structured, usable data
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-center mb-24 text-gray-500 italic"
        >
          A comprehensive document processing tool that transforms unstructured PDF data into clean, structured JSON for developers and data analysts.
        </motion.p>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto"
        >
          <Image 
            src="/mockuuups-macknook-air.png"
            alt="PDF Penguin Interface on MacBook Air"
            width={1200}
            height={675}
            className="w-full"
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
              {['overview', 'problem', 'design', 'build', 'challenges', 'reflections', 'future', 'final'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === section 
                      ? 'bg-blue-50 text-[#4A90E2] font-medium border-l-2 border-[#4A90E2]' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {section === 'overview' && 'Project Summary'}
                  {section === 'problem' && 'Problem Statement'}
                  {section === 'design' && 'Design Process'}
                  {section === 'build' && 'Build Process'}
                  {section === 'challenges' && 'Challenges & Lessons'}
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
                className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            🎯 Project Summary
          </h2>
          <div className="space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-[#4A90E2]">
              <h3 className="text-lg font-medium mb-2 text-gray-900">TL;DR</h3>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Problem: Non‑technical users struggle to extract structured data from PDFs quickly.</li>
                <li>Solution: Drag‑drop PDF → prompt desired structure → instant JSON output.</li>
                <li>Success criteria: time‑to‑first‑output ≤ 10s, ≥ 90% parse success for common docs, clear fallback for scans.</li>
              </ul>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                While developing my recipe generator app, EZ Recipe, I needed a way to extract structured ingredient and nutrition data from USDA PDFs. The datasets were available, but they were formatted as complex, unstructured PDFs that were difficult to work with programmatically. Existing tools were unreliable or too technical, so I built a clean, AI-powered tool for parsing and exporting PDF data into usable JSON.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                PDF Penguin has since evolved into a standalone product with broader application across document-heavy industries.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">My Role</h3>
              <p className="text-gray-600 leading-relaxed">
                This was a completely solo project, where I handled every aspect from product vision to deployment.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  Founder
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  Product Designer (UX & UI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  Frontend Developer (React, TailwindCSS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  AI Integration (Vision Models)
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Problem & Goal Section */}
        <motion.section
          ref={setSectionRef('problem')}
          id="problem"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Problem & Goal
          </h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium mb-4 text-[#4A90E2]">Problem</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
              The biggest issue with existing PDF parsers was that they were overly technical — requiring specialized setup, manual formatting, command-line usage, or developer-only integrations. Tools like Tabula and Adobe's OCR exports were powerful but inaccessible to non-technical users. Many required users to predefine table structures or fiddle with JSON schemas before seeing results, which added friction for those just trying to extract usable information from documents.
            </p>
              <p className="text-gray-600 leading-relaxed mb-4">
              Additionally, tools often failed with scanned documents or image-based PDFs, offering inconsistent or incomplete results. Even when they worked, the interfaces were cluttered and required unnecessary steps or downloads.
            </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h5 className="font-medium text-[#4A90E2] mb-3">Success Metrics</h5>
                <ul className="text-gray-700 divide-y divide-gray-200 rounded-md overflow-hidden">
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>≤ 10s time-to-first-output</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>90%+ parse success rate for common documents</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>Clear fallback guidance for scanned PDFs</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>Zero setup required for first use</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-gray-300 bg-white">
                  <h5 className="font-medium text-gray-900 mb-2">Before (Current Tools)</h5>
                  <p className="text-gray-600 leading-relaxed">Users spend 15+ minutes manually copying data from PDFs, dealing with complex setup, or getting inconsistent results from existing parsers.</p>
                </div>
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-[#4A90E2] bg-[#4A90E2]/5">
                  <h5 className="font-medium text-[#4A90E2] mb-2">After (PDF Penguin)</h5>
                  <p className="text-gray-700 leading-relaxed">Drag, drop, type what you want — and get clean JSON in 10 seconds. No setup. No training. Just output.</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 my-8" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">PDF Penguin</h3>
            <p className="text-gray-600 leading-relaxed">
              I set out to design a tool that required zero onboarding: drag, drop, type what you want — and get clean JSON instantly. No setup. No training. Just output.
            </p>
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Design Process
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 1: Empathize & Research</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                I explored a range of existing PDF parsing tools including Tabula, Adobe Acrobat's OCR export, and DocParser. While all three were technically capable, they presented significant barriers for non-technical users — requiring either installation, rule-building, or an understanding of export settings and schemas. I tested each one by attempting to extract structured data without relying on documentation or setup guides, simulating the experience of a first-time user with minimal technical background.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Across the board, I encountered slow onboarding, confusing interfaces, and results that required multiple adjustments or retries. Even simple use cases like "extract table data" demanded upfront learning or configuration. These pain points reinforced a clear gap in the space: a need for a tool that provides structure, flexibility, and results — without setup or specialized knowledge.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The table below summarizes how PDF Penguin compares to these tools, based on that usability-first evaluation.
              </p>
              <div className="my-6 flex justify-center">
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-gray-500">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border-2 border-gray-500 px-4 py-3 text-left font-medium text-gray-900">Category</th>
                        <th className="border-2 border-gray-500 px-4 py-3 text-left font-medium text-gray-900">Tabula (Open Source)</th>
                        <th className="border-2 border-gray-500 px-4 py-3 text-left font-medium text-gray-900">Adobe Acrobat Export</th>
                        <th className="border-2 border-gray-500 px-4 py-3 text-left font-medium text-gray-900">DocParser</th>
                        <th className="border-2 border-gray-500 px-4 py-3 text-left font-medium text-[#4A90E2]">PDF Penguin</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">How to Use</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Install app → select table area → export</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Open PDF → Export To (Excel/Word) → fix formatting</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Create parser → define rules/schema → run</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">Drag & drop PDF → describe output in plain language → copy JSON</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Ease of Use</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Manual area selection every time — long PDFs are painful</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Export menus are cluttered; results vary per doc</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Requires technical rule-building</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">Zero setup — natural prompts, instant results</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Learning Curve</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Steep — geared to developers</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Moderate — still need guides/tutorials</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">High — requires schema expertise</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">None — works instantly</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Setup Time</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">10–15 mins for first export; longer for large PDFs</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">5–10 mins per document, plus fixing errors</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">15–30 mins upfront per parser</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">&lt;10s to first output</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Output Quality</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Raw, messy tables — struggles with multi-page PDFs</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Exports often break formatting; images/tables distort</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Accurate only if rules are perfect; brittle if format changes</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">Clean, structured JSON every time</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Falls Short On…</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Tedious with long/multi-page PDFs; messy copy-paste cleanup</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Time wasted fixing Excel/Word errors; inconsistent exports</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">High upfront effort, breaks when PDF layout changes</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">Designed to handle any PDF instantly</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-gray-500 px-4 py-3 font-medium text-gray-900">Target Audience</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Developers tinkering on small files</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Business users with patience for cleanup</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600">Technical ops/data teams</td>
                        <td className="border-2 border-gray-500 px-4 py-3 text-gray-600 font-medium text-[#4A90E2]">Anyone — including non-technical users</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-gray-600 text-sm mt-3">
                    <strong className="text-gray-900">Findings:</strong> Competing tools work well but expect users to know setup, schemas, and exports. PDF Penguin is the fastest and simplest to operate: drag & drop, describe the structure, copy clean JSON.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 2: Define</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                PDFs are the universal standard for sharing information, but they weren’t designed for easy data extraction. From our research, one theme was clear: the biggest barrier with existing tools wasn’t raw technical capability — it was usability.
              </p>
              <p className="text-gray-600 leading-relaxed mb-2">
                <span className="font-medium text-gray-900">Tabula</span> required manually drawing boxes around tables, a painful process on long or multi-page PDFs.
              </p>
              <p className="text-gray-600 leading-relaxed mb-2">
                <span className="font-medium text-gray-900">Adobe Acrobat</span> exported to Word or Excel, but the formatting often broke, leaving users to waste time fixing errors.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                <span className="font-medium text-gray-900">DocParser</span> offered accuracy, but only after heavy upfront investment in parser setup, schema design, and ongoing maintenance whenever the PDF layout changed.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Across all of these, the “define” step was the bottleneck: users were forced to either manually mark up data, accept inaccurate exports, or engineer schemas. None of these approaches fit the needs of non-technical users who just want structured data quickly.
              </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 className="text-gray-900 font-medium mb-2">Problem Statement</h4>
                <p className="text-gray-700 leading-relaxed">
                  Extracting structured data from PDFs today is slow, technical, and inconsistent. Users need a solution that requires no setup, no manual definition, and no technical expertise — while still delivering clean, structured outputs instantly.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 3: Ideate</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                I brainstormed multiple UI approaches, including <strong>single-page processing</strong> (streamlined but potentially overwhelming), <strong>wizard-style multi-step</strong> (guided but slow), and <strong>two-panel layout</strong> (immediate feedback, familiar pattern).
              </p>
              
              <div className="mb-6 flex justify-center">
                <Image 
                  src="/sketchpdfpenguin.png"
                  alt="PDF Penguin Initial Sketches"
                  width={600}
                  height={450}
                  className="w-full max-w-2xl rounded-lg"
                />
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                I decided to move forward with a two-panel layout. This structure offered the clearest balance of simplicity and control: users could upload a PDF on the left while immediately seeing the structured output on the right. Unlike a single-page or wizard flow, the two-panel model provided instant feedback without overwhelming users with steps or clutter.
              </p>

              {/* User Flow Chart */}
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4 text-gray-900">User Flow Mapping</h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  With this direction in place, the next step was to validate how users would actually move through the product. To do this, I mapped out the complete user flow — from uploading a file, to defining the output, to copying the final JSON. This flow chart helped surface potential friction points and confirm that the two-panel design supported a smooth, low-effort experience.
                </p>
                <div className="flex justify-center">
                  <Image 
                    src="/pdfpenguinflow.png"
                    alt="PDF Penguin User Flow Chart showing the step-by-step process of uploading, processing, and extracting data from PDFs"
                    width={400}
                    height={200}
                    className="w-full max-w-md border border-gray-200 shadow-lg rounded-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mt-3 italic">
                  💡 The flow shows the complete user journey from upload to structured output
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 4: Prototype & Design</h3>
              <p className="text-gray-600 leading-relaxed">
                With a clear layout concept from the ideation phase, I began prototyping to test the interface flow and validate the user experience. I started with low-fidelity wireframes to quickly iterate on the core interaction patterns before moving into high-fidelity development.
              </p>
            </div>

            {/* Lo-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Lo-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                With the concept validated through research, I moved into rapid prototyping to test the interface flow. The low-fi wireframes focused on three key aspects: the upload process, prompt customization, and JSON output display within the clean, minimal interface.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/pengu1lowfi.png"
                      alt="PDF Penguin Low-Fi Prototype 1 - Upload Interface"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-300"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">1. Upload Interface</h6>
                  <p className="text-gray-600">Clean drag-and-drop area with clear visual feedback for file uploads.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/pengu2lowfi.png"
                      alt="PDF Penguin Low-Fi Prototype 2 - JSON Output"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-300"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">2. JSON Output</h6>
                  <p className="text-gray-600">Structured data display with syntax highlighting and copy functionality.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/pengu3lowfi.png"
                      alt="PDF Penguin Low-Fi Prototype 3 - Library View"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">3. Library</h6>
                  <p className="text-gray-600">Saved documents and parsed data organized in a clean library interface.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/pengu4lowfi.png"
                      alt="PDF Penguin Low-Fi Prototype 4 - Library Document View"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">4. Library Document View</h6>
                  <p className="text-gray-600">Viewing and managing individual documents from the library with parsed data.</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Key Insights from Lo-Fi Testing:</h5>
                  <p className="text-gray-600 leading-relaxed">
                    Users preferred a two-panel layout for immediate visual feedback, the prompt field needed clear placeholder text to guide effective AI instructions, and error states required helpful messaging to guide users toward successful parsing.
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Refinements Made:</h5>
                  <p className="text-gray-600 leading-relaxed">
                    I simplified the upload process to drag-and-drop only, added contextual placeholder text with examples, and integrated clear error messaging with actionable next steps for users.
                  </p>
                </div>
              </div>
            </div>

            {/* High-Fidelity Prototypes */}
            <div className="mt-12">
              <h4 className="text-xl font-medium mb-6 text-gray-900">High-Fidelity Prototypes</h4>
              <p className="text-gray-600 leading-relaxed mb-8">
                Based on the low-fidelity testing insights, I created polished high-fidelity prototypes that refined the visual design, improved the user experience, and prepared for final development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/highfipengu1.png"
                      alt="PDF Penguin High-Fi Prototype 1 - Upload Interface"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-300"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">1. Upload Interface</h6>
                  <p className="text-gray-600">Clean, modern upload experience with drag-and-drop functionality, output format dropdown selection, and clear visual feedback.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/highfipengu2.png"
                      alt="PDF Penguin High-Fi Prototype 2 - JSON Output"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-300"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">2. JSON Output</h6>
                  <p className="text-gray-600">Structured data display with syntax highlighting and copy functionality.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/highfipengu3.png"
                      alt="PDF Penguin High-Fi Prototype 3 - Library View"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">3. Library</h6>
                  <p className="text-gray-600">Saved documents and parsed data organized in a clean library interface with color-coded file categories in the top left.</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <Image
                      src="/highfipengu4.png"
                      alt="PDF Penguin High-Fi Prototype 4 - Library Document View"
                      width={1200}
                      height={1400}
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      priority
                      quality={100}
                    />
                  </div>
                  <h6 className="text-lg font-medium text-gray-900 mb-2">4. Library Document View</h6>
                  <p className="text-gray-600">Specific document view showing detailed information with download and copy functionality for parsed data.</p>
                </div>
              </div>
              
              {/* Figma Prototype Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Try the interactive prototype:</p>
                <a 
                  href="https://www.figma.com/proto/6gUB6gR6ATucf890UPjQO6/Pdf-Pengu?node-id=14-418&t=O1XBikXg0ng6HNMv-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Open Figma Prototype
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 5: Test & Iterate</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Each time I implemented a new UI or prompt behavior, I tested it by uploading different document types — invoices, receipts, reports — and refining the prompt UX to guide the AI parser. After discovering poor output from vague prompts, I added a customizable instruction field and clarified the placeholder text to guide user input.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Once the interface flow and AI behavior were reliable, I built the full app in Cursor with a React + TailwindCSS frontend, integrated OCR and OpenAI APIs, and deployed it via Vercel. The result is a working product with real users, capable of turning even messy PDFs into structured data in seconds.
              </p>
            </div>
            {/* Final Product Screenshot */}
            <div className="my-8 flex justify-center">
              <Image 
                src="/pdf-penguin.png"
                alt="PDF Penguin Final Product Screenshot"
                width={1200}
                height={600}
                className="w-full max-w-3xl rounded-xl"
              />
            </div>
          </div>
        </motion.section>



        {/* Build Process Section */}
        <motion.section
          ref={setSectionRef('build')}
          id="build"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Build Process
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              This project was coded entirely using Cursor, an AI-native coding environment. I leveraged its inline generation, autocompletion, and iterative coding features to build and refine the full frontend and backend without switching tools. Cursor's fluid AI-assisted workflow allowed me to move quickly from concept to implementation, especially in structuring the prompt logic and dynamic output panel.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Frontend: React + TailwindCSS</li>
              <li>Backend: AI pipeline integrating OCR and OpenAI API for document parsing</li>
              <li>Deployment: Vercel</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              The AI interprets user instructions from a prompt field and uses document layout detection to output structured key-value JSON data, even from unstructured or scanned documents.
            </p>
          </div>
        </motion.section>

        {/* Challenges & Lessons Section */}
        <motion.section
          ref={setSectionRef('challenges')}
          id="challenges"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Challenges & Lessons Learned
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900">Challenge: Designing a Two-Click PDF Converter</h3>
              <p className="text-gray-600 mb-3">
                The main challenge was keeping the experience as minimal as possible. Many converters overload users with extra steps — multiple menus, settings, or upsells — which slows them down. The goal for PDF Penguin was clear: users should be able to upload their file and get the converted result in just two clicks.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-900 mb-2">Lesson Learned</h4>
                <p className="text-blue-800">
                  Stripping down features is harder than adding them. I had to carefully decide what was essential (upload → convert → download) and what could be excluded or postponed. This exercise taught me that simplicity isn't about doing less work — it's about making tough design choices to keep the user's path frictionless.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900">Challenge: Guiding Without Overwhelming</h3>
              <p className="text-gray-600 mb-3">
                Even with a simple flow, users still need a sense of control (e.g., naming the file or choosing output format). Adding these options without cluttering the interface was a balancing act.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-900 mb-2">Lesson Learned</h4>
                <p className="text-blue-800">
                  Clear defaults and progressive disclosure are key. By setting smart defaults, users can complete their task quickly, while still having the option to customize if needed.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900">Challenge: Maintaining Trust and Reliability</h3>
              <p className="text-gray-600 mb-3">
                Because file conversion involves sensitive documents, users need to trust the process. Any hiccup — like unclear status indicators or unexpected results — could break that trust.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-900 mb-2">Lesson Learned</h4>
                <p className="text-blue-800">
                  Feedback and transparency build confidence. Simple loading indicators, confirmation messages, and a visible "library" of past conversions reassured users that their files were safe and the process worked as expected.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Reflections & Takeaways Section */}
        <motion.section
          ref={setSectionRef('reflections')}
          id="reflections"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            🧠 Reflections & Takeaways
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              PDF Penguin might seem like a simple tool, but it addresses a fundamental gap in document processing. From data analysts to developers, people need to extract structured information from unstructured documents quickly and reliably. This tool empowers users to transform messy PDFs into usable data without technical barriers.
            </p>
            <blockquote className="text-gray-700 italic border-l-4 border-[#4A90E2] pl-4">
              "I just need to get this table data into a spreadsheet, but the PDF is a mess."
            </blockquote>
            <p className="text-gray-600 leading-relaxed">
              As a designer and developer, this project taught me the value of solving real problems with simple solutions. Sometimes the best tools are the ones that eliminate complexity rather than adding features.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Key Learnings</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  <span><strong>AI + UX = Magic</strong> – The combination of AI capabilities with thoughtful user experience design can create tools that feel almost magical to use.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  <span><strong>Simplicity Scales</strong> – The most powerful tools are often the simplest ones. PDF Penguin's success comes from doing one thing exceptionally well.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                  <span><strong>Real Problems, Real Solutions</strong> – Building tools to solve your own problems often leads to solutions that resonate with others facing similar challenges.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Future Improvements Section */}
        <motion.section
          ref={setSectionRef('future')}
          id="future"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            📈 Future Enhancements
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
              Add user authentication and upload history saving
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
              Allow exports to CSV and XML formats
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
              Improve support for low-quality scanned PDFs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
              Mobile-responsive improvements
            </li>
          </ul>
        </motion.section>

        {/* Final Thoughts Section */}
        <motion.section
          ref={setSectionRef('final')}
          id="final"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            📍 Final Thoughts
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              This case study pushed me to think deeply about the intersection of AI capabilities and user experience design. PDF Penguin is about more than document processing — it's about making powerful technology accessible to everyone, regardless of their technical background.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since building PDF Penguin, I've used it to power real-time parsing for multiple EZ Recipe recipes and shared it with other developers who've since used it in document-heavy workflows. It's now a core part of my toolset and continues to inspire ideas for standalone API-based parsing services.
            </p>
            <div className="bg-[#4A90E2]/5 rounded-lg p-6 border border-[#4A90E2]/20">
              <h4 className="text-lg font-medium mb-3 text-[#4A90E2]">Impact & Results</h4>
              <p className="text-gray-700 leading-relaxed">
                PDF Penguin has successfully achieved its core goals: reducing time-to-first-output to under 10 seconds, achieving high parse success rates for common document types, and providing a zero-setup experience that works for both technical and non-technical users. The tool has become an essential part of my development workflow and has been adopted by other developers facing similar document processing challenges.
              </p>
            </div>
          </div>
        </motion.section>
        </div>
      </div>
    </main>
  );
} 