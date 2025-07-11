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
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className={`text-4xl font-light ${dancingScript.className} text-black hover:text-black/90 transition-colors`}>
            mb.
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

        {/* Project Overview Section */}
        <motion.section
          ref={setSectionRef('overview')}
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Overview
          </h2>
          <div className="space-y-8">
            <div>
              <p className="text-gray-600 leading-relaxed">
                While developing my cooking assistant app, Chefie, I needed a way to extract structured ingredient and nutrition data from USDA PDFs. The datasets were available, but they were formatted as complex, unstructured PDFs that were difficult to work with programmatically. Existing tools were unreliable or too technical, so I built a clean, AI-powered tool for parsing and exporting PDF data into usable JSON.
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                  Founder
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                  Product Designer (UX & UI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                  Frontend Developer (React, TailwindCSS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Problem & Goal
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              The biggest issue with existing PDF parsers was that they were overly technical — requiring specialized setup, manual formatting, command-line usage, or developer-only integrations. Tools like Tabula and Adobe's OCR exports were powerful but inaccessible to non-technical users. Many required users to predefine table structures or fiddle with JSON schemas before seeing results, which added friction for those just trying to extract usable information from documents.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Additionally, tools often failed with scanned documents or image-based PDFs, offering inconsistent or incomplete results. Even when they worked, the interfaces were cluttered and required unnecessary steps or downloads.
            </p>
            <p className="text-gray-600 leading-relaxed">
              I set out to design a tool that required zero onboarding: drag, drop, type what you want — and get clean JSON instantly. No setup. No training. Just output.
            </p>
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Design Process
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 1: Research</h3>
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
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 3: Ideation</h3>
              <div className="mb-4">
                <Image 
                  src="/sketchpdfpenguin.png"
                  alt="PDF Penguin Initial Sketches"
                  width={800}
                  height={600}
                  className="w-full rounded-lg"
                />
              </div>
              <p className="text-gray-600 leading-relaxed">
                I had a clear mental model of how the product should behave, so I quickly sketched a basic 2-panel layout idea: Upload (left) → Output (right), supported by a flexible prompt box to direct the AI. The goal was instant clarity, minimal onboarding, and the ability to adjust the output on the fly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 4: Design</h3>
              <p className="text-gray-600 leading-relaxed">
                With a clear layout already in mind, I moved directly into high-fidelity interface development using Vercel. Rather than spending time on static design tools, I focused on live iteration — adjusting spacing, labels, and user flows in context. This allowed me to make real-time decisions based on how the interface behaved, rather than just how it looked. Cursor supported this process by helping structure responsive components and quickly refine interactive behaviors.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 5: Testing & Iteration</h3>
              <p className="text-gray-600 leading-relaxed">
                Each time I implemented a new UI or prompt behavior, I tested it by uploading different document types — invoices, receipts, reports — and refining the prompt UX to guide the AI parser. After discovering poor output from vague prompts, I added a customizable instruction field and clarified the placeholder text to guide user input.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Step 6: Development & Launch</h3>
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

        {/* Key User Flow Section */}
        <motion.section
          ref={setSectionRef('flow')}
          id="flow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Key User Flow
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              The PDF Penguin homepage was intentionally designed to reflect the product's core promise: instant transformation of unstructured PDFs into usable data.
            </p>
            {/* User Flow Diagram */}
            <div className="my-8 flex justify-center">
              <Image 
                src="/userflow.png"
                alt="PDF Penguin User Flow Diagram"
                width={900}
                height={400}
                className="w-full max-w-2xl border border-gray-200 shadow-lg rounded-xl"
              />
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Upload a PDF — Users drag and drop a file or click to upload directly into the left-side panel.</li>
              <li>Customize the Output — A prompt input field allows users to describe exactly what kind of data they want to extract.</li>
              <li>Receive Structured JSON — The right-side panel displays the generated JSON output in real time.</li>
            </ol>
            <p className="text-gray-600 leading-relaxed">
              This flow was designed to minimize user friction, reduce the need for technical knowledge, and deliver immediate visual feedback. The layout and design decisions prioritize first-time usability while giving power users flexibility to define their output format.
            </p>
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
          className="max-w-4xl mx-auto mb-24"
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Challenges & Lessons Learned
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-900">Challenge</h3>
              <p className="text-gray-600">
                Users were uploading low-resolution or scanned PDFs that caused inconsistent parsing and frustrating results.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-900">Solution</h3>
              <p className="text-gray-600">
                I added a prompt customization field to guide the AI, and included light UX copy to educate users on how to phrase good instructions or prepare better PDFs.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-900">Lesson</h3>
              <p className="text-gray-600">
                AI isn't magic — but good UX can make it feel like it is. The best tools support both ideal and messy inputs, and guide users through uncertainty.
              </p>
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Future Improvements
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
              Add user authentication and upload history saving
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
              Allow exports to CSV and XML formats
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
              Improve support for low-quality scanned PDFs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
              Mobile-responsive improvements
            </li>
          </ul>
        </motion.section>

        {/* Impact Section */}
        <motion.section
          ref={setSectionRef('impact')}
          id="impact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
            Impact
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Since building PDF Penguin, I've used it to power real-time parsing for multiple EZ Recipe recipes and shared it with other developers who've since used it in document-heavy workflows. It's now a core part of my toolset and continues to inspire ideas for standalone API-based parsing services.
          </p>
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

      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-1/2 -translate-y-1/2 h-auto w-64 hidden md:block">
        <div className="flex flex-col gap-4 py-8 pr-8 pl-4 border-r border-gray-200">
          {['overview', 'problem', 'design', 'flow', 'build', 'challenges', 'future', 'impact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === section 
                  ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
} 