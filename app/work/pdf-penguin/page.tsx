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

    return mostVisibleSection;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        
        // Check if we're at the bottom of the page
        const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100;
        
        if (isAtBottom) {
          setActiveSection('future');
          return;
        }

        // Update active section based on visibility
        const newActiveSection = determineActiveSection();
        if (newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
        }
      },
      { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-80px 0px 0px 0px' // Removed bottom margin to better detect bottom sections
      }
    );

    Object.values(sections.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isManualScroll, activeSection]);

  // Handle scroll events for more accurate section detection
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isManualScroll) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Check if we're at the bottom of the page
        const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100;
        
        if (isAtBottom) {
          setActiveSection('future');
        } else {
          const newActiveSection = determineActiveSection();
          if (newActiveSection !== activeSection) {
            setActiveSection(newActiveSection);
          }
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex space-x-12"
          >
            <Link href="/work" className="text-black/80 hover:text-black transition-colors">
              Work
            </Link>
            <Link href="/about" className="text-black/80 hover:text-black transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-black/80 hover:text-black transition-colors">
              Contact
            </Link>
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-light text-center mb-16 tracking-tight text-gray-900"
        >
          PDF Penguin
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
        >
          PDF to JSON made simple - Transform your documents into structured data with AI
        </motion.p>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl mb-24 max-w-5xl mx-auto"
        >
          <Image 
            src="/pdf-penguin.png"
            alt="PDF Penguin Interface"
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
          <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide text-center">
            Project Overview
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Project Length</h3>
              <p className="text-gray-600 leading-relaxed">3-month development cycle</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Goal</h3>
              <p className="text-gray-600 leading-relaxed">
                Create an AI-powered tool that converts PDF documents into structured JSON data, making it easier for developers to extract and work with information from PDFs.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Roles and Tools Grid */}
        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto mb-24">
          {/* Roles Section */}
          <motion.section
            ref={setSectionRef('role')}
            id="role"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
              Roles
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                Product Design
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                Frontend Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                AI Integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                UX Research
              </li>
            </ul>
          </motion.section>

          {/* Tools Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
              Tools
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                React + Next.js
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                TailwindCSS
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                OpenAI API
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                Framer Motion
              </li>
            </ul>
          </motion.section>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-32 pb-32">
          {/* Problem Section */}
          <motion.section
            ref={setSectionRef('problem')}
            id="problem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
              Problem & Goal
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Existing PDF parsers were either overly technical, unreliable with scanned documents, or lacked a clean user flow.
                I wanted to design a simple, intuitive solution: upload a PDF, describe the structure you want, and get JSON instantly.
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
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-6 uppercase tracking-wide">
              Design Process
            </h2>
            <div className="space-y-4">
              {['Research', 'Ideation', 'Wireframes', 'Prototyping', 'Iterations'].map((phase) => (
                <div key={phase} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{phase}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {phase === 'Research' && 'Analyzed existing tools like Tabula and Adobe OCR exports. Identified pain points in current solutions.'}
                    {phase === 'Ideation' && 'Sketched flows for a 2-panel layout: Upload (left) → JSON Output (right).'}
                    {phase === 'Wireframes' && 'Created initial drafts in Figma. Focused on clarity and minimum clicks.'}
                    {phase === 'Prototyping' && 'Used Cursor AI and Vercel v0 to rapidly prototype the frontend.'}
                    {phase === 'Iterations' && 'Added customization options based on early user feedback.'}
                  </p>
                </div>
              ))}
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
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
              Build Process
            </h2>
            <div className="prose prose-lg max-w-none">
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Frontend built with React and TailwindCSS for a responsive, modern interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">AI pipeline integrating OCR and OpenAI API for intelligent document parsing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Deployed on Vercel for reliable, scalable performance</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Challenges Section */}
          <motion.section
            ref={setSectionRef('challenges')}
            id="challenges"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-6 uppercase tracking-wide">
              Challenges & Lessons
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Challenge</h3>
                <p className="text-gray-600 leading-relaxed">
                  Handling scanned PDFs with poor OCR quality.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Solution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Added a customizable prompt field and user guidance for best file practices.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Lesson</h3>
                <p className="text-gray-600 leading-relaxed">
                  Exceptional UX accounts for imperfect real-world conditions, not just ideal flows.
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
          >
            <h2 className="text-2xl text-[#4A90E2] font-medium mb-8 uppercase tracking-wide">
              Future Improvements
            </h2>
            <div className="prose prose-lg max-w-none">
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Add user authentication and upload history saving</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Allow exports to CSV and XML formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Improve support for low-quality scanned PDFs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] mt-2.5"></span>
                  <span className="leading-relaxed">Mobile-responsive improvements</span>
                </li>
              </ul>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-1/2 -translate-y-1/2 h-auto w-64 hidden md:block">
        <div className="flex flex-col gap-4 py-8 pr-8 pl-4 border-r border-gray-200">
          {['overview', 'role', 'problem', 'design', 'build', 'challenges', 'future'].map((section) => (
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