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
          🔁 Spotify Loop
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

        {/* Hero Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto"
        >
          <div className="bg-gray-100 rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">[Insert Hero Image: Interface mockup or key screen showing the looping interaction]</p>
          </div>
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
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🎯 Project Summary
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Spotify Loop</h3>
              <p className="text-gray-600 leading-relaxed">
                An exploratory UX case study focused on enhancing user interaction within Spotify by allowing users to loop specific song segments. Targeted toward users who obsess over hooks, breakdowns, or instrumental sections, this feature adds a layer of personalization to passive listening. With music becoming increasingly social, emotional, and interactive, this feature bridges the gap between static playback and dynamic user expression.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">My Role</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                This was a self-initiated case study to improve a widely used consumer product:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Product Designer (UX/UI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  UX Researcher
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Interaction Designer
                </li>
              </ul>
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🔍 Design Process
          </h2>
          
          {/* Step 1: Empathize & Research */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">1. Empathize & Research</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Behavior Discovery</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                To understand user needs, I conducted a multi-channel research study:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Reddit Analysis:</strong> Threads from r/spotify, r/WeAreTheMusicMakers, and r/Music revealed frequent user requests to replay favorite parts of a song. A common pain point was the inability to loop 15-30 seconds of audio, especially for studying lyrics, learning instruments, vibing to beats, or working.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Twitter/X Search:</strong> I found dozens of user complaints asking why Spotify doesn't support looping part of a song. Most workarounds involved using third-party apps or screen recording.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>YouTube Comment Mining:</strong> Under popular lo-fi and ambient tracks, many users asked for timestamps or loop features for "the perfect 20 seconds."</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Survey & Guerrilla Interviews</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                To further validate need, I conducted a short survey and 5 informal interviews with Spotify users. I asked:
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Do you ever replay the same part of a song over and over? Why?
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  How do you currently do that on Spotify?
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Would you use a loop feature if it existed?
                </li>
              </ul>
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-medium text-gray-900 mb-3">Key Results:</h5>
                <ul className="space-y-2 text-gray-600">
                  <li>• 80% said they replay parts of a song multiple times a week.</li>
                  <li>• 60% use the progress bar to scrub back manually.</li>
                  <li>• 100% said a built-in looping feature would be helpful or "amazing."</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Market Scan & Competitive Audit</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  <strong>YouTube</strong> has loop features built-in.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  <strong>SoundCloud</strong> allows users to loop full tracks but not segments.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  <strong>Spotify competitors</strong> like Apple Music or Tidal lack partial looping too.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  <strong>Third-party tools</strong> like Looper for Spotify and Chrome extensions are proof of demand but suffer from bad UX and lack native integration.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                <strong>Conclusion:</strong> Users are clearly hacking Spotify to loop parts of songs. This represents unmet demand for a natively supported, well-designed feature.
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
              <p className="text-gray-600 leading-relaxed mb-4">
                We framed this around two beliefs:
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Respect the music.</strong> Listeners shouldn't lose access to full tracks or feel forced into looping mode.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Empower deeper interaction.</strong> Listeners should be able to <em>linger</em> on the moments that move them — the beat drop, the lyric, the solo.</span>
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                So instead of modifying how Spotify plays music overall, <strong>Loop</strong> becomes a personal layer — a way to mark and revisit moments. The default remains intact. If no loop is set, playback is normal. If a loop is saved, it becomes available as an <em>overlay feature</em>, like shuffle or crossfade.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Constraints & Design Requirements</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Must not interfere with the default play/pause/seek experience.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Should be intuitive for new users and accessible on mobile.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Must not add visual clutter to the now-playing screen.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Stories</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span>As a listener, I want to loop a specific part of a song without leaving Spotify.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span>As a music learner, I want to hear a section repeatedly to study lyrics or melody.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span>As a casual user, I don't want this feature to get in my way unless I choose to use it.</span>
                </li>
              </ul>
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
              I brainstormed multiple UI approaches:
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                <strong>Waveform-based loop selection</strong> – visually appealing but technically demanding.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                <strong>Tap-to-set markers</strong> – simple, scalable, and familiar.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                <strong>Press-and-drag timeline interaction</strong> – intuitive touch interaction.
              </li>
            </ul>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Final Concept: Tap-to-Loop Interaction</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Users tap once to set a loop start point.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Tap again to set the loop end.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  A loop icon appears when active.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Tapping the icon disables the loop.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  On mobile, loop controls live in a swipe-up drawer under the progress bar.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4: Prototype & Design */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">4. Prototype & Design</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Design Goals</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Seamlessly integrate loop UI with minimal cognitive load.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Show clear visual feedback when loop is active.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Ensure touch-friendliness for mobile users.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Loop Feature Breakdown</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Set a Loop:</strong> Tap once to set a start point. Tap again to set an end point. A light band appears on the timeline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Play Behavior:</strong> While loop is active, only that segment plays on repeat. Exit the loop with one tap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Full Track Playback:</strong> At any point, users can toggle off loop mode and resume full playback — ensuring the original song experience is preserved.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Save for Later:</strong> Loops can be saved to a dedicated "Looped Segments" tab under the track, accessible like bookmarks.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Where We Placed It (and Why)</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                  <span><strong>Mobile:</strong> Loop controls live inside a swipe-up drawer under the progress bar. This keeps the default UI clean while making the feature easily accessible — similar to lyrics or the queue.</span>
                </li>
              </ul>
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
                  className="w-full h-auto"
                  priority
                  quality={95}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Key Insights from Lo-Fi Testing:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Timeline Interaction:</strong> Users preferred tap-to-set over drag interactions for precision. The wireframes showed clear start/end markers that users could easily understand.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Visual Feedback:</strong> The looped segment needed clear visual distinction — a subtle highlight band proved more effective than color changes that could interfere with album artwork.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Control Placement:</strong> The swipe-up drawer concept worked well, keeping the main player clean while making loop controls discoverable and accessible.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Refinements Made:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Simplified the loop creation to two taps instead of three
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Added a confirmation step to prevent accidental loops
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Integrated loop controls with existing playback buttons
                    </li>
                  </ul>
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
                The high-fidelity design phase focused on creating a seamless visual experience that felt native to Spotify. I studied Spotify's design tokens, color palette, typography, and interaction patterns to ensure the loop feature would integrate naturally with the existing interface.
              </p>
              
              <div className="bg-gray-100 rounded-lg p-12 text-center mb-6">
                <p className="text-gray-500 text-lg">[Insert Hi-Fi Prototype: Final polished interface with loop controls and visual feedback]</p>
              </div>

              <div className="space-y-4 text-gray-600">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Design System Integration:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Color Palette:</strong> Used Spotify's signature green (#1DB954) for loop indicators and controls, maintaining brand consistency while ensuring accessibility.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Typography:</strong> Applied Spotify's font hierarchy and spacing to maintain visual rhythm and readability across all loop-related text elements.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
                      <span><strong>Iconography:</strong> Designed loop icons that complement Spotify's existing icon set, using consistent stroke weights and visual style.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Micro-Interactions & Polish:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Smooth animations for loop creation and playback transitions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Haptic feedback patterns that match Spotify's existing interactions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                      Loading states and error handling that feel native to the platform
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Demo GIF */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">How It Works</h4>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">[Insert 5-second GIF: Demo showing user setting loop points and the segment playing on repeat]</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Microcopy</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  "Set loop start"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  "Set loop end"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  "Loop this section?"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  "Loop on / Loop off"
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5: Test */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">5. Test (Planned)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To test the viability and usability of the feature, I plan to:
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                Create a clickable Figma prototype
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                Run 1:1 usability sessions with 5 Spotify users
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                Tasks: Set a loop, turn it off, and adjust loop points
              </li>
            </ul>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">What I'll Measure:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Time to discover loop controls
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Accuracy of setting desired loop
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                  Qualitative satisfaction
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Interaction Preview */}
        <motion.section
          ref={setSectionRef('interaction')}
          id="interaction"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            🔄 Interaction Preview
          </h2>
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">[Insert short prototype video showing user setting and looping a segment of a song]</p>
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
          className="max-w-4xl mx-auto mb-24"
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            📈 Future Enhancements
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
              <span>Save loops as "mini-bookmarks" tied to tracks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
              <span>Share loops on social media with visual/audio snippets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
              <span>Create playlists of favorite segments (loop compilations)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 flex-shrink-0"></span>
              <span>Add loop insights to Wrapped ("Your most-looped moments")</span>
            </li>
          </ul>
        </motion.section>

        {/* Final Thoughts */}
        <motion.section
          ref={setSectionRef('final')}
          id="final"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#1DB954] font-medium mb-8 uppercase tracking-wide">
            📍 Final Thoughts
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This case study pushed me to think deeply about micro-interactions and user emotion. Spotify is about more than streaming — it's about how music fits into life. Looping gives users more expressive power in how they listen, learn, and love their favorite tracks.
          </p>
        </motion.section>
      </div>
    </main>
  );
} 