'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Navigation from '@/app/components/Navigation';
import { Dancing_Script } from 'next/font/google';
// Removed shadcn/ui components to avoid hydration issues

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export const dynamic = 'force-dynamic';

export default function SpotifyLoopCaseStudy() {
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
        <main className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className={`text-4xl font-light ${dancingScript.className} text-black hover:text-black/90 transition-colors`}>
            MB
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
          Spotify Loop
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
        >
          Adding Micro Looping to Music Listening
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-center mb-24 text-gray-500 italic"
        >
          A feature addition case study for Spotify that enhances how users interact with their favorite parts of songs.
        </motion.p>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-3">
            Conceptual exploration. This project is not affiliated with, endorsed by, or sponsored by Spotify. Logos and brand references are used solely for design critique and education.
          </div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto"
        >
          <Image 
            src="/spotifyloopmockup.png"
            alt="Spotify Loop Interface Mockup"
            width={1200}
            height={675}
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
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === section 
                      ? 'bg-green-50 text-[#1DB954] font-medium border-l-2 border-[#1DB954]' 
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
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🎯 Project Summary
          </h2>
          <div className="space-y-8">
            {/* TL;DR */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-[#1DB954]">
              <h3 className="text-lg font-medium mb-2 text-gray-900">TL;DR</h3>
              <p className="text-gray-600 leading-relaxed">
                Spotify doesn’t let users loop a specific song segment. Spotify Loop adds a minimal, native interaction to set start/end points and replay that moment. It improves practice, study, and enjoyment without cluttering the player. Next: validate discoverability, speed to loop, and satisfaction.
              </p>
            </div>

            {/* Constraints & Collaboration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Constraints</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Must preserve Spotify’s minimal player UI; no clutter.</li>
                  <li>Mobile‑first gesture design; accessible touch targets.</li>
                  <li>API feasibility and performance assumptions noted for concept.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Collaboration & Feedback</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Feedback from music learners/guitar communities on precision vs. speed.</li>
                  <li>Peer critique led to surfacing controls in a swipe‑up drawer.</li>
                  <li>Planned usability tasks informed success metrics (time‑to‑loop, task success).</li>
                </ul>
              </div>
            </div>

            {/* Problem (moved up) */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-[#1DB954]">Problem</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Spotify lacks a native way to loop specific song segments. Users who want to repeat a chorus, vocal phrase, or musical riff must rely on external tools, scrub the progress bar imprecisely, or leave the app—fragmenting the listening experience.
              </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h5 className="font-medium text-[#1DB954] mb-3">Success Metrics</h5>
                <ul className="text-gray-700 divide-y divide-gray-200 rounded-md overflow-hidden">
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    <span>Reduce time-to-first-loop discovery to under 5 seconds</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    <span>Enable loop creation in under 3 drags on average</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    <span>80%+ task success for set/adjust/remove loop in testing</span>
                  </li>
                  <li className="flex items-start gap-2 p-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    <span>Satisfaction ≥ 4/5 for clarity and control</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-gray-300 bg-white">
                  <h5 className="font-medium text-gray-900 mb-2">Before (Current)</h5>
                  <p className="text-gray-600 leading-relaxed">Users scrub back and forth or use third‑party tools. It’s imprecise, breaks flow, and often takes them out of Spotify.</p>
                </div>
                <div className="p-5 rounded-lg border border-gray-100 border-l-4 border-l-[#1DB954] bg-[#1DB954]/5">
                  <h5 className="font-medium text-[#1DB954] mb-2">After (With Loop)</h5>
                  <p className="text-gray-700 leading-relaxed">Drag to set start/end points, instant replay, saveable loops—keeps users in Spotify with minimal cognitive load.</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 my-8" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Spotify Loop</h3>
              <p className="text-gray-600 leading-relaxed">
                An exploratory UX case study focused on enhancing user interaction within Spotify by allowing users to loop specific song segments. Targeted toward users who obsess over hooks, breakdowns, or instrumental sections, this feature adds a layer of personalization to passive listening. With music becoming increasingly social, emotional, and interactive, this feature bridges the gap between static playback and dynamic user expression.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">My Role</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                This was a self-initiated case study to improve a widely used consumer product. Roles: Product Designer (UX/UI), UX Researcher, and Interaction Designer.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                The goal was to apply product thinking, research, and design skills to augment an existing product with a minimal yet emotionally impactful feature.
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
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🔍 Design Process
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
                <h5 className="font-medium text-gray-900 mb-3">Reddit & User Communities</h5>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>r/guitar:</strong> "It's a pain moving the slider in Spotify over and over again… always starting at a slightly different spot."</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>r/LearnGuitar / r/Music:</strong> Developers created tools like PractAid to loop Spotify segments because "there's no feature" natively. "PractAid lets Spotify Premium users loop segments of songs for music practice."</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>r/spotify:</strong> Casual fans admit to looping full tracks mentally: "If I find a song I really like I'll literally listen to it on loop the entire day."</span>
                </li>
              </ul>
            </div>

            <div>
                <h5 className="font-medium text-gray-900 mb-3">External Research</h5>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span>A YouGov study (2022) showed 68% of musicians aged 16–34 use streaming platforms to practice, and 41% said they needed extra tools for segment replay.</span>
                </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span>Moises.ai and AudioStretch have grown to millions of users, signifying widespread demand.</span>
                </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span>YouTube Looper plugins see over 500K weekly users—a clear sign of consistent, cross-platform demand for segment looping.</span>
                </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Competitive Analysis</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                To understand how others solve segment looping, I reviewed popular tools in the music learning and listening space. The goal was to identify common interaction patterns, friction points, and opportunities to create a simpler, more native experience for Spotify users.
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border-2 border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Product / Platform</th>
                      <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Loop Creation Method</th>
                      <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Strengths</th>
                      <th className="border-2 border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Weaknesses / Gaps</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">Moises.ai</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Drag start/end markers on waveform</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Visual clarity, precise selection</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Requires leaving Spotify; heavier UI; learning curve for casual users</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">AudioStretch</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Drag handles along a waveform timeline</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Fine control over playback speed and loop points</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">App-switching disrupts flow; not integrated with streaming</td>
                    </tr>
                    <tr>
                      <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">YouTube Looper Plugins</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Enter timestamps or click "Loop" button on video</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Simple; works in browser</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Lacks tactile mobile gesture control; not native to music streaming</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">PractAid (Spotify API)</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Drag to set A/B points in separate app</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Designed for practice use</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Relies on Spotify Premium; UX feels external and segmented</td>
                    </tr>
                    <tr>
                      <td className="border-2 border-gray-300 px-4 py-3 font-medium text-gray-900">GarageBand / DAWs</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Drag region selection in editing timeline</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Extremely precise</td>
                      <td className="border-2 border-gray-300 px-4 py-3 text-gray-600">Overkill for casual listening; high cognitive load</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h5 className="font-medium text-[#1DB954] mb-3">Key Insights from Competitive Review</h5>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>Integration Gap</strong> – None of the reviewed tools work natively inside Spotify's mobile player, forcing app-switching or desktop-only workflows.</span>
                </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>Discovery Problem</strong> – Most loop functions are hidden behind menus or require technical knowledge (e.g., typing timestamps).</span>
                </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>Precision vs. Speed Tradeoff</strong> – Waveform dragging is powerful for musicians but slower and more complex for everyday listeners.</span>
                </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                    <span><strong>Emotional Engagement</strong> – Existing tools focus on practice/utility; few consider looping as a form of casual music enjoyment or social expression.</span>
                </li>
              </ul>
              </div>

              <div className="mt-6 p-4 bg-[#1DB954]/5 rounded-lg border border-[#1DB954]/20">
                <h5 className="font-medium text-[#1DB954] mb-2">Design Opportunity</h5>
                <p className="text-gray-700 leading-relaxed">
                  Spotify Loop can combine the speed of drag-to-set markers with native integration, removing friction and keeping the core Spotify experience intact—while still serving both learners and casual listeners.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Journey Map Comparison</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                To visualize the user experience with segment looping before and after Spotify Loop, I created a journey map to identify emotional pain points and moments of opportunity in the current workflow.
              </p>
              
              <div className="overflow-hidden rounded-lg mb-6 max-w-2xl mx-auto">
                <Image 
                  src="/spotifyloopjourney.png"
                  alt="Spotify Loop User Journey Map"
                  width={1200}
                  height={675}
                  className="w-full"
                  quality={100}
                />
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                The journey map reveals how users currently struggle with app-switching, imprecise scrubbing, and fragmented experiences when trying to loop song segments. Spotify Loop addresses these pain points by providing a native, intuitive solution that keeps users engaged within the platform.
              </p>
            </div>


          </div>

          {/* Step 2: Define */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">2. Define</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Problem Statement</h4>
              <blockquote className="text-gray-700 italic border-l-4 border-[#1DB954] pl-4">
                How might we allow users to seamlessly loop a segment of a song within Spotify, enhancing their listening experience without disrupting the platform's clean UI or passive user flows?
              </blockquote>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Design Philosophy</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Spotify is beloved for its minimal, smooth experience. We didn't want to change that. Instead of a redesign, this feature is an <em>addition</em> — something optional, discoverable, and complementary to existing controls.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We framed this around two beliefs: <strong>respect the music</strong> so listeners never lose access to full tracks or feel forced into looping mode, and <strong>empower deeper interaction</strong> so listeners can linger on the moments that move them — the beat drop, the lyric, the solo.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Constraints & Design Requirements</h4>
              <p className="text-gray-600 leading-relaxed">
                The loop feature must not interfere with the default play/pause/seek experience, should be intuitive for new users and accessible on mobile, and must not add visual clutter to the now-playing screen.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Stories</h4>
              <p className="text-gray-600 leading-relaxed">
                The feature serves three key user types: listeners who want to loop specific parts without leaving Spotify, music learners who need to hear sections repeatedly for study, and casual users who don't want the feature to interfere with their normal listening experience.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Design Opportunity</h4>
              <p className="text-gray-600 leading-relaxed">
                Repetitive listening is part of music enjoyment, yet the interface for looping is awkward or absent. Spotify can embrace this behavior and enhance user delight with a micro-interaction that feels magical, not mechanical.
              </p>
            </div>
          </div>

          {/* Step 3: Ideate */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">3. Ideate</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              I brainstormed multiple UI approaches, including <strong>waveform-based loop selection</strong> (visually appealing but technically demanding), <strong>tap-to-set markers</strong> (simple, scalable, and familiar), and <strong>press-and-drag timeline interaction</strong> (an intuitive touch gesture).
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Final Concept: Tap-to-Loop Interaction</h4>
              <p className="text-gray-600 leading-relaxed">
                The final concept is a tap-to-loop interaction: tap once to set the start, tap again to set the end, and a loop icon appears when active. Tapping the icon disables the loop. On mobile, loop controls live in a swipe-up drawer under the progress bar to keep the main player clean while making the feature easy to reach.
              </p>
            </div>

            {/* User Flow Chart */}
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Flow Mapping</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                To ensure the interaction felt intuitive, I mapped out the complete user journey from discovering the loop feature to successfully creating and managing loops. This flow chart helped identify potential friction points and validate the tap-to-set interaction pattern.
              </p>
              <div className="flex justify-center">
                <a 
                  href="/SpotifyFlowchart.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:scale-110 transition-transform duration-300"
                >
                  <Image 
                    src="/SpotifyFlowchart.png"
                    alt="Spotify Loop User Flow Chart showing the step-by-step process of creating and managing loops"
                    width={1200}
                    height={1400}
                    className="w-full max-w-5xl rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    quality={100}
                    priority
                  />
                </a>
              </div>
              <p className="text-sm text-gray-500 text-center mt-3 italic">
                💡 Click image to open in full size for better readability
              </p>
            </div>
          </div>

          {/* Step 4: Prototype & Design */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">4. Prototype & Design</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Design Goals</h4>
              <p className="text-gray-600 leading-relaxed">
                The design aims to seamlessly integrate loop UI with minimal cognitive load, show clear visual feedback when a loop is active, and ensure touch-friendliness for mobile users.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Loop Feature Breakdown</h4>
              <p className="text-gray-600 leading-relaxed">
                The loop feature works through a simple tap-to-set interaction: users tap once to set a start point, then tap again to set an end point, with a light band appearing on the timeline. While the loop is active, only that segment plays on repeat, and users can exit with one tap. At any point, users can toggle off loop mode to resume full playback, ensuring the original song experience is preserved. Loops can also be saved to a dedicated "Looped Segments" tab under the track, accessible like bookmarks.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Where We Placed It (and Why)</h4>
              <p className="text-gray-600 leading-relaxed">
                On mobile, loop controls live inside a swipe-up drawer under the progress bar. This keeps the default UI clean while making the feature easily accessible — similar to lyrics or the queue.
              </p>
            </div>

            {/* Lo-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Lo-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                With the concept validated through research, I moved into rapid prototyping to test the interaction flow. The low-fi wireframes focused on three key aspects: the loop creation process, visual feedback during loop playback, and the placement of controls within Spotify's existing interface.
              </p>
              
              <div className="overflow-hidden rounded-lg mb-6">
                <Image
                  src="/looplowfi.png"
                  alt="Spotify Loop Low-Fi Prototype showing wireframes of loop interaction flow and timeline controls"
                  width={1200}
                  height={900}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Key Insights from Lo-Fi Testing:</h5>
                  <p className="text-gray-600 leading-relaxed">
                    Users preferred tap-to-set over drag interactions for precision, a subtle highlight band communicated the looped segment most clearly without conflicting with album art, and a swipe-up drawer kept loop controls discoverable while preserving the main player’s simplicity.
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Refinements Made:</h5>
                  <p className="text-gray-600 leading-relaxed">
                    I simplified loop creation to two taps, added a brief confirmation to prevent accidental loops, and integrated loop controls alongside the existing playback buttons for familiarity.
                  </p>
                </div>
              </div>
            </div>

            {/* Transition to Hi-Fi */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#1DB954]/10 to-[#1DB954]/5 rounded-lg border-l-4 border-[#1DB954]">
              <h4 className="text-lg font-medium mb-3 text-gray-900">Moving to High-Fidelity Design</h4>
              <p className="text-gray-600 leading-relaxed">
                With the interaction flow validated through low-fi testing, I began translating the wireframes into polished, pixel-perfect designs that would feel native to Spotify's design system. The focus shifted from functionality to visual refinement, micro-interactions, and ensuring the feature felt like a natural extension of the existing interface.
              </p>
            </div>

            {/* Hi-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Hi-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Spotify Loop is a feature that allows users to create and play custom loops of their favorite song segments. Users can set start and end points on any track, then play just that section on repeat. This feature is perfect for learning lyrics, practicing instruments, or simply enjoying your favorite parts of a song.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h5 className="text-lg font-medium mb-4 text-gray-900">How Spotify Loop Works</h5>
                  
                  {/* Core Loop Functionality */}
                  <div className="flex justify-center gap-6 mb-8">
                    <div className="text-center w-64">
                      <div className="mb-4">
                        <Image 
                          src="/Now Playing Screen.png"
                          alt="Now Playing Screen - Default Spotify Interface"
                          width={300}
                          height={600}
                          className="w-full rounded-2xl"
                        />
                      </div>
                      <h6 className="font-medium text-gray-900 mb-2">1. Now Playing</h6>
                      <p className="text-sm text-gray-600">The standard Spotify interface with the new loop button positioned below the main playback controls, seamlessly integrated into the existing player layout.</p>
                    </div>
                    
                    <div className="text-center w-64">
                      <div className="mb-4">
                        <Image 
                          src="/Loop Active.png"
                          alt="Loop Active - Playing the Loop"
                          width={300}
                          height={600}
                          className="w-full rounded-2xl"
                        />
                      </div>
                      <h6 className="font-medium text-gray-900 mb-2">2. Set Loop Points</h6>
                      <p className="text-sm text-gray-600">Users drag to set start and end points, creating a highlighted segment on the progress bar that will loop.</p>
                    </div>
                    
                    <div className="text-center w-64">
                      <div className="mb-4">
                        <Image 
                          src="/Loop Set.png"
                          alt="Loop Set - Setting Loop Points"
                          width={300}
                          height={600}
                          className="w-full rounded-2xl"
                        />
                      </div>
                      <h6 className="font-medium text-gray-900 mb-2">3. Loop Active</h6>
                      <p className="text-sm text-gray-600">The selected segment plays on repeat, with clear visual indicators showing the loop is active and the current position.</p>
                    </div>
                  </div>

                  {/* Saving and Library Features */}
                  <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center w-64">
                      <div className="mb-4">
                        <Image 
                          src="/Loop Saved.png"
                          alt="Loop Saved - Confirmation Message"
                          width={300}
                          height={600}
                          className="w-full rounded-2xl"
                        />
                      </div>
                      <h6 className="font-medium text-gray-900 mb-2">4. Loop Saved</h6>
                      <p className="text-sm text-gray-600">When loop mode is active, it counts as a new song and saves separately from previously saved versions, creating a unique entry in your library.</p>
                    </div>

                    <div className="text-center w-64">
                      <div className="mb-4">
                        <Image 
                          src="/Saved Loops.png"
                          alt="Saved Loops - Library View"
                          width={300}
                          height={600}
                          className="w-full rounded-2xl"
                        />
                      </div>
                      <h6 className="font-medium text-gray-900 mb-2">5. Saved Loops</h6>
                      <p className="text-sm text-gray-600">Access all your saved loops in a dedicated library, with search functionality and the ability to organize your favorite song segments.</p>
                    </div>
                  </div>
              </div>

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Design System Integration:</h5>
                    <p className="text-gray-600 leading-relaxed">
                      We used Spotify’s signature green (#1DB954) for loop indicators and controls to maintain brand consistency and accessibility, applied the platform’s font hierarchy and spacing for rhythm and readability, and designed icons that match existing stroke weights and visual style.
                    </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Micro-Interactions & Polish:</h5>
                    <p className="text-gray-600 leading-relaxed">
                      The experience includes smooth animations for loop creation and playback transitions, subtle haptic feedback aligned with Spotify’s interaction patterns, and loading/error states that feel native to the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Video */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">How It Works</h4>
              <div className="my-8 flex justify-center">
                <video 
                  src="/demospotifyloop.mp4"
                  controls
                  className="w-full max-w-4xl rounded-2xl shadow-lg"
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.playbackRate = 1.4;
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              

              
              {/* Figma Prototype Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Try the interactive prototype:</p>
                <a 
                  href="https://www.figma.com/proto/APV5Da77NcsnpvY3mE6jV5/Spotify-Loop?node-id=25-1004&t=CqXXYuWbfhTKuK1r-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Open Figma Prototype
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Microcopy</h4>
              <p className="text-gray-600 leading-relaxed">
                Microcopy highlights include: “Set loop start”, “Set loop end”, “Loop this section?”, and “Loop on / Loop off”.
              </p>
            </div>
          </div>

          {/* Step 5: Test & Iterate */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">5. Test & Iterate</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              With the Figma prototype complete, I'm ready to validate the loop interaction design through comprehensive user testing and technical feasibility assessment.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Success Metrics</h4>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Task completion rate &gt; 90% for loop creation</li>
                  <li>Time to set first loop &lt; 15 seconds</li>
                  <li>User satisfaction score &gt; 4/5</li>
                  <li>Zero critical usability issues</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h4 className="text-lg font-medium mb-3 text-gray-900">Technical Considerations</h4>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Integration with existing Spotify player API</li>
                  <li>Loop state persistence across track changes</li>
                  <li>Performance impact on playback engine</li>
                  <li>Cross-platform consistency (iOS/Android)</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Implementation Strategy</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                The feature would be implemented as a phased rollout: first to Premium users as a beta feature, then gradually expanded based on usage data and feedback. This approach allows for iterative improvement and risk mitigation.
              </p>
              <div className="bg-[#1DB954]/5 rounded-lg p-4 border border-[#1DB954]/20">
                <h5 className="font-medium text-[#1DB954] mb-2">Business Impact</h5>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Implementing a native segment‐looping feature could significantly boost Spotify's key metrics. Highly engaged listeners – such as musicians and active learners – would spend more time in-app repeating favorite parts of songs. This deeper engagement has been linked to better business outcomes: Spotify research shows that users with more diverse listening habits are ~25% more likely to convert from Free to Premium <a href="https://research.atspotify.com/2020/12/algorithmic-effects-on-the-diversity-of-consumption-on-spotify" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(research.atspotify.com)</a>, and similarly have 10–20% lower churn <a href="https://research.atspotify.com/2020/12/algorithmic-effects-on-the-diversity-of-consumption-on-spotify" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(research.atspotify.com)</a>. By keeping practice-minded users engaged in Spotify (instead of using external tools), the loop feature helps drive these positive trends. In practice, real users already seek this functionality; for example, one musician built a third-party app to loop Spotify segments "to alleviate my own pain point" <a href="https://www.reddit.com/r/LearnGuitar/comments/t4pb15/practaid_aids_music_practice_by_ab_looping/#:~:text=I%20created%20PractAid%20to%20alleviate,it%20in%20Audacity%20for%20looping" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(reddit.com)</a>, illustrating clear demand.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Higher user engagement and retention:</strong> Allowing loops lets users linger on beloved song moments, increasing session time. More engaged listening correlates with higher retention and satisfaction <a href="https://research.atspotify.com/2020/12/algorithmic-effects-on-the-diversity-of-consumption-on-spotify#:~:text=The%20above%20plot%20shows%20how,diversity%20in%20their%20music%20consumption" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(research.atspotify.com)</a> <a href="https://research.atspotify.com/2020/12/algorithmic-effects-on-the-diversity-of-consumption-on-spotify" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(research.atspotify.com)</a>. This means users are likely to stay in the app longer and return more often, reducing drop-off. As one Reddit user noted, musicians "literally listen to [a song] on loop the entire day" when they love a part, indicating that built-in looping would capitalize on this behavior.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Increased Premium conversion:</strong> Adding a sought-after feature enhances Premium's value proposition. Many practice-oriented users already need Spotify Premium to use external loop tools (e.g. PractAid requires Premium <a href="https://www.reddit.com/r/LearnGuitar/comments/t4pb15/practaid_aids_music_practice_by_ab_looping/#:~:text=I%20created%20PractAid%20to%20alleviate,it%20in%20Audacity%20for%20looping" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(reddit.com)</a>). By natively providing looping (initially to Premium users), Spotify could encourage free users in this niche to upgrade. With 626M monthly users and 246M paid subscribers (≈39% conversion) <a href="https://newsroom.spotify.com/2024-07-23/spotify-reports-second-quarter-2024-earnings/#:~:text=,Y%2FY%20to%20%E2%82%AC3.8%20billion" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(newsroom.spotify.com)</a>, even a small bump in conversion rate among engaged users would translate to millions in additional subscription revenue.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Market demand validation:</strong> The huge adoption of third-party loop and practice apps shows broad user interest. For example, Moises.ai (an AI practice app with looping) boasts over 60 million users worldwide <a href="https://www.prnewswire.com/news-releases/moises-gets-behind-musics-most-authentic-moments-by-supporting-nprs-tiny-desk-302495992.html#:~:text=Selected%20by%20Apple%20as%20the,currently%20available%20in%2033%20languages" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(prnewswire.com)</a>, and Looper for YouTube has ~400K users <a href="https://chrome.google.com/webstore/detail/looper-for-youtube/iggpfpnahkgpnindfkdncknoldgnccdg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(chrome.google.com)</a>. These figures illustrate that many people rely on looping tools for learning and enjoyment. A native Spotify loop taps directly into this proven market, reducing friction and potentially drawing users from these external solutions back into Spotify.
                </p>
              </div>
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🧠 Reflections & Takeaways
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Spotify Loop might seem like a small tweak, but it aligns with evolving user behavior. From TikTok loops to study playlists, people want music to be modular, not just linear. This feature empowers listeners to connect more deeply with songs by focusing on moments.
            </p>
            <blockquote className="text-gray-700 italic border-l-4 border-[#1DB954] pl-4">
              "I love the drop at 1:42 — I wish I could just stay there."
            </blockquote>
            <p className="text-gray-600 leading-relaxed">
              As a designer, this project taught me the value of zooming in: finding overlooked behaviors and building features that feel obvious once they exist.
            </p>
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            📈 Future Enhancements
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Planned enhancements include saving loops as mini-bookmarks tied to tracks, sharing loops with visual/audio snippets, creating playlists of favorite segments, and adding loop insights to Wrapped (e.g., “Your most-looped moments”).
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
          className="mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            📍 Final Thoughts
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This case study pushed me to think deeply about micro-interactions and user emotion. Spotify is about more than streaming — it's about how music fits into life. Looping gives users more expressive power in how they listen, learn, and love their favorite tracks.
          </p>
        </motion.section>
        </div>
      </div>
    </main>
  );
} 