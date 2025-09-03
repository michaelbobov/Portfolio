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
              {['overview', 'design', 'ideate', 'prototype', 'test', 'reflections', 'future', 'final'].map((section) => (
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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Constraints</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Solo project; limited time box for v1.</li>
                  <li>Mixed‑quality inputs (scans vs. digital PDFs).</li>
                  <li>Model/OCR variability; must guide user prompts.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Collaboration & Feedback</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Peer dev feedback on output schema clarity → added copy and examples.</li>
                  <li>Early testers (friends/Discord) struggled with vague prompts → added placeholder guidance.</li>
                  <li>Iterated UX on empty/error states after scan failures.</li>
                </ul>
              </div>
            </div>
            {/* Problem (moved up) */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-[#4A90E2]">Problem</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                While developing my cooking assistant app, Chefie, I needed a way to extract structured ingredient and nutrition data from USDA PDFs. The datasets were available, but they were formatted as complex, unstructured PDFs that were difficult to work with programmatically. Existing tools were unreliable or too technical, requiring specialized setup, manual formatting, command-line usage, or developer-only integrations.
              </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h5 className="font-medium text-[#4A90E2] mb-3">Success Metrics</h5>
                <ul className="text-gray-700 divide-y divide-gray-200 rounded-md overflow-hidden">
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>Time-to-first-output ≤ 10 seconds</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>≥ 90% parse success for common document types</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>Clear fallback guidance for scanned documents</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                    <span>Zero technical setup required for first-time users</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-gray-300 bg-white">
                  <h5 className="font-medium text-gray-900 mb-2">Before (Existing Tools)</h5>
                  <p className="text-gray-600 leading-relaxed">Users struggled with complex setup, technical interfaces, and inconsistent results. Tools like Tabula and Adobe's OCR exports were powerful but inaccessible to non-technical users.</p>
                </div>
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-[#4A90E2] bg-[#4A90E2]/5">
                  <h5 className="font-medium text-[#4A90E2] mb-2">After (PDF Penguin)</h5>
                  <p className="text-gray-700 leading-relaxed">Drag, drop, describe what you want in plain language, and get structured JSON instantly—no setup, no learning curve, just results.</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 my-8" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">PDF Penguin</h3>
              <p className="text-gray-600 leading-relaxed">
                An AI-powered document processing tool that transforms unstructured PDF data into clean, structured JSON for developers and data analysts. PDF Penguin has evolved from a personal solution into a standalone product with broader application across document-heavy industries.
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
            🔍 Design Process
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
                <Image
                  src="/featurecomparison.png"
                  alt="Feature Comparison of PDF Tools"
                  width={1200}
                  height={600}
                  className="w-full max-w-3xl border border-gray-200 shadow-lg rounded-xl"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 2: Define</h3>
              <p className="text-gray-600 leading-relaxed">
                The research made one thing clear: the biggest barrier wasn't technical capability — it was usability. Most tools assumed the user had experience with templates, schemas, or parsing rules. I defined the core product need as creating a parsing tool that eliminated setup entirely. PDF Penguin would focus on a single principle: let users describe what they want in plain language, and deliver results instantly — simple to use, with no learning curve.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 3: Ideate</h3>
              <p className="text-gray-600 leading-relaxed">
                I brainstormed multiple UI approaches, including <strong>single-page processing</strong> (streamlined but potentially overwhelming), <strong>wizard-style multi-step</strong> (guided but slow), and <strong>two-panel layout</strong> (immediate feedback, familiar pattern).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 4: Prototype & Design</h3>
              <p className="text-gray-600 leading-relaxed">
                With a clear layout concept from the ideation phase, I began prototyping to test the interface flow and validate the user experience. I started with low-fidelity wireframes to quickly iterate on the core interaction patterns before moving into high-fidelity development.
              </p>
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            💡 Ideate
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Final Concept: Two-Panel Layout</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                The final concept is a two-panel layout: Upload (left) → Output (right), supported by a flexible prompt box to direct the AI. The goal was instant clarity, minimal onboarding, and the ability to adjust the output on the fly.
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
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-4 text-gray-900">Design Philosophy</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  PDF Penguin is built around one core principle: <strong>zero friction, maximum clarity</strong>. Instead of complex setup or technical configuration, users describe what they want in plain language and get structured results instantly.
                </p>
            <p className="text-gray-600 leading-relaxed">
                  We framed this around two beliefs: <strong>respect the user's time</strong> so they never have to learn complex interfaces or wait through lengthy processes, and <strong>empower data extraction</strong> so anyone can turn messy documents into usable structured data.
                </p>
              </div>
            </div>

            {/* User Flow Chart */}
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Flow Mapping</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                To ensure the interaction felt intuitive, I mapped out the complete user journey from uploading a PDF to receiving structured JSON output. This flow chart helped identify potential friction points and validate the drag-and-drop interaction pattern.
              </p>
              <div className="flex justify-center">
              <Image 
                  src="/pdfpenguinflow.png"
                  alt="PDF Penguin User Flow Chart showing the step-by-step process of uploading, processing, and extracting data from PDFs"
                width={900}
                height={400}
                className="w-full max-w-2xl border border-gray-200 shadow-lg rounded-xl"
              />
            </div>
              <p className="text-sm text-gray-500 text-center mt-3 italic">
                💡 The flow shows the complete user journey from upload to structured output
              </p>
            </div>
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            🎨 Prototype & Design
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Design Goals</h3>
              <p className="text-gray-600 leading-relaxed">
                The design aims to provide immediate visual feedback, show clear processing states, and ensure the interface feels intuitive for both technical and non-technical users.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">How PDF Penguin Works</h3>
              <p className="text-gray-600 leading-relaxed">
                PDF Penguin works through a simple three-step process: users drag and drop a PDF, describe what data they want to extract in plain language, and receive structured JSON output instantly. The AI interprets user instructions and uses document layout detection to output structured key-value data, even from unstructured or scanned documents.
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

            {/* Hi-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Hi-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                PDF Penguin is a tool that allows users to extract structured data from any PDF document. Users can upload a PDF, describe what data they want to extract in plain language, and receive clean JSON output instantly. This feature is perfect for data analysts, developers, and anyone who needs to work with document data.
              </p>
              
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

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Design System Integration:</h5>
            <p className="text-gray-600 leading-relaxed">
                    We used a clean, minimal design system with clear visual hierarchy, applied consistent spacing and typography for readability, and designed the interface to feel familiar and approachable for non-technical users.
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Micro-Interactions & Polish:</h5>
            <p className="text-gray-600 leading-relaxed">
                    The experience includes smooth animations for file upload and processing states, clear visual feedback during AI processing, and helpful error states that guide users toward successful outcomes.
            </p>
                </div>
              </div>
            </div>


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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            🧪 Test & Validation
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Build Process</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                This project was coded entirely using Cursor, an AI-native coding environment. I leveraged its inline generation, autocompletion, and iterative coding features to build and refine the full frontend and backend without switching tools. Cursor's fluid AI-assisted workflow allowed me to move quickly from concept to implementation, especially in structuring the prompt logic and dynamic output panel.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Frontend: React + TailwindCSS</li>
                <li>Backend: AI pipeline integrating OCR and OpenAI API for document parsing</li>
                <li>Deployment: Vercel</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Success Metrics</h4>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Time-to-first-output ≤ 10 seconds</li>
                  <li>≥ 90% parse success for common document types</li>
                  <li>User satisfaction score ≥ 4/5</li>
                  <li>Zero technical setup required</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Technical Considerations</h4>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Integration with OpenAI Vision API</li>
                  <li>OCR processing for scanned documents</li>
                  <li>Performance optimization for large files</li>
                  <li>Error handling and user guidance</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Challenges & Solutions</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
                  <h5 className="text-lg font-medium mb-2 text-gray-900">Challenge</h5>
              <p className="text-gray-600">
                Users were uploading low-resolution or scanned PDFs that caused inconsistent parsing and frustrating results.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
                  <h5 className="text-lg font-medium mb-2 text-gray-900">Solution</h5>
              <p className="text-gray-600">
                I added a prompt customization field to guide the AI, and included light UX copy to educate users on how to phrase good instructions or prepare better PDFs.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
                  <h5 className="text-lg font-medium mb-2 text-gray-900">Lesson</h5>
              <p className="text-gray-600">
                AI isn't magic — but good UX can make it feel like it is. The best tools support both ideal and messy inputs, and guide users through uncertainty.
              </p>
                </div>
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

        {/* Future Enhancements Section */}
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
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Planned enhancements include user authentication and upload history saving, support for additional export formats (CSV, XML), improved handling of low-quality scanned documents, and mobile-responsive improvements for on-the-go document processing.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Short-term Roadmap</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>User accounts and document history</span>
                  </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>CSV and XML export options</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>Batch processing capabilities</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Long-term Vision</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>API access for developers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>Advanced OCR for complex layouts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2 flex-shrink-0"></span>
                    <span>Integration with popular tools (Slack, Notion)</span>
            </li>
          </ul>
              </div>
            </div>
          </div>
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

        {/* Scroll to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center mb-16"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
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
        </motion.div>
        </div>
      </div>
    </main>
  );
} 