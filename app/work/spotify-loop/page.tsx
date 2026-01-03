'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';

export const dynamic = 'force-dynamic';

export default function SpotifyLoopCaseStudy() {
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
          Mobile • Feature Design • 2025
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
        >
          Spotify Loop
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6"
        >
          Adding micro-looping to music listening — loop specific song segments natively within Spotify.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-500">
            Conceptual exploration. Not affiliated with Spotify. Logos used for design critique only.
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <Image 
            src="/spotifyloopmockup.png"
            alt="Spotify Loop Interface"
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
            <p className="text-gray-900">Product Designer</p>
            <p className="text-gray-900">UX Researcher</p>
      </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">2 months</p>
            <p className="text-gray-600 text-sm">Concept to prototype</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Team</p>
            <p className="text-gray-900">Solo Project</p>
            <p className="text-gray-600 text-sm">Self-initiated</p>
            </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Skills</p>
            <p className="text-gray-900">UX Research</p>
            <p className="text-gray-900">Interaction Design</p>
            <p className="text-gray-900">Prototyping</p>
          </div>
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
            Spotify Loop adds native segment looping to Spotify. Set start and end points, replay that moment on repeat.
          </p>
              <p className="text-gray-600 leading-relaxed">
            Perfect for learning lyrics, practicing instruments, or simply enjoying your favorite parts of a song. This exploratory UX case study focuses on enhancing user interaction for listeners who obsess over hooks, breakdowns, and instrumental sections.
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
            Spotify lacks a native way to loop specific song segments. Users must rely on external tools or scrub the progress bar imprecisely.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <div>
                <p className="text-gray-900 font-medium">No native segment looping</p>
                <p className="text-gray-600 text-sm mt-1">Users leave Spotify for external tools like PractAid or Moises.ai, breaking flow.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
            <div>
                <p className="text-gray-900 font-medium">Imprecise scrubbing</p>
                <p className="text-gray-600 text-sm mt-1">Manually scrubbing back and forth is tedious and inaccurate, especially on mobile.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
            <div>
                <p className="text-gray-900 font-medium">Fragmented experience</p>
                <p className="text-gray-600 text-sm mt-1">App-switching disrupts listening and requires managing multiple tools.</p>
            </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-900 italic">"I love the drop at 1:42 — I wish I could just stay there."</p>
            <p className="text-gray-500 text-sm mt-2">— User research insight</p>
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
            I analyzed Reddit communities, external research, and competitive tools to validate the opportunity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">User Communities</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li><span className="text-gray-900 font-medium">r/guitar:</span> "It's a pain moving the slider over and over..."</li>
                <li><span className="text-gray-900 font-medium">r/LearnGuitar:</span> Developers created tools like PractAid because "there's no feature"</li>
                <li><span className="text-gray-900 font-medium">r/spotify:</span> "I'll literally listen to it on loop the entire day"</li>
              </ul>
            </div>
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Market Signals</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 68% of musicians 16–34 use streaming to practice (YouGov)</li>
                <li>• 41% need extra tools for segment replay</li>
                <li>• Moises.ai and AudioStretch have millions of users</li>
                <li>• YouTube Looper: 500K+ weekly users</li>
                </ul>
              </div>
            </div>

            <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
            <p className="text-gray-900 text-lg">
              <span className="text-[#C75B3B] font-medium">Integration gap</span> — No reviewed tools work natively inside Spotify's mobile player, forcing app-switching or desktop-only workflows.
                </p>
              </div>
        </motion.div>

        {/* User Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">User Journey</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Mapping emotional pain points and moments of opportunity.
              </p>
          <div className="flex justify-center">
                <Image 
                  src="/spotifyloopjourney.png"
                  alt="Spotify Loop User Journey Map"
              width={1920}
              height={1280}
              className="max-w-3xl w-full h-auto"
              quality={95}
                />
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
            Tap-to-loop: tap once to set start, tap again to set end. Loop controls live in a swipe-up drawer to keep the player clean.
          </p>

          {/* User Flow */}
          <div className="mb-8">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">User Flow</p>
            <div className="flex justify-center">
              <Image
                src="/SpotifyFlowchart.png"
                alt="Spotify Loop User Flow Chart"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-gray-900 font-medium mb-2">Set Loop Points</p>
              <p className="text-gray-600">Tap timeline to set start → Tap again to set end → Loop activates</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Play & Adjust</p>
              <p className="text-gray-600">Segment plays on repeat → Drag handles to adjust → Tap icon to disable</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Save & Access</p>
              <p className="text-gray-600">Save loops to library → Access in "Looped Segments" tab</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Design Principles</p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-gray-900 font-medium">Respect the music:</span> Full tracks always accessible, looping is additive.</p>
              <p><span className="text-gray-900 font-medium">Minimal UI:</span> Loop controls hidden in drawer, preserving Spotify's clean interface.</p>
              <p><span className="text-gray-900 font-medium">Empower interaction:</span> Let users linger on moments that move them.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Design Process */}
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl mb-12">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Process</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            From low-fidelity wireframes to polished prototypes.
              </p>
            </div>

        <div className="space-y-16">
          {/* Low-Fi Prototype */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Lo-Fi Prototype</p>
              <p className="text-gray-600">Testing loop creation, visual feedback, and control placement.</p>
            </div>
            <div className="flex justify-center mb-6">
                <Image
                  src="/looplowfi.png"
                alt="Spotify Loop Low-Fi Prototype"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
                />
              </div>
            <div className="max-w-4xl">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Testing Insights</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Tap-to-set preferred over drag for precision</li>
                <li>• Subtle highlight band best for showing looped segment</li>
                <li>• Swipe-up drawer kept controls discoverable but minimal</li>
              </ul>
                </div>
              </div>

          {/* High-Fi Screens */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">High-Fidelity Prototypes</p>
              <p className="text-gray-600">Polished designs ready for user testing.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Image src="/Now Playing Screen.png" alt="Now Playing" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Loop Set.png" alt="Loop Set" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Loop Active.png" alt="Loop Active" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Loop Saved.png" alt="Loop Saved" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Saved Loops.png" alt="Saved Loops Library" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
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
            Key decisions that shaped the feature.
              </p>
              
              <div className="space-y-8">
                <div>
              <p className="text-gray-900 font-medium mb-2">Why tap-to-set instead of waveform selection?</p>
              <p className="text-gray-600">Waveforms are powerful but complex. Tap-to-set mirrors the familiar progress bar interaction users already know. It's simple, scalable, and works on small mobile screens.</p>
              </div>
                <div>
              <p className="text-gray-900 font-medium mb-2">Why a swipe-up drawer for controls?</p>
              <p className="text-gray-600">Loop controls must be accessible but not intrusive. A drawer preserves Spotify's minimal aesthetic while keeping the feature discoverable for power users.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why include a saved loops library?</p>
              <p className="text-gray-600">Users develop favorites — the same drop, the same chorus. Saving loops turns a feature into a personalized listening experience tied to their music identity.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why not show waveforms by default?</p>
              <p className="text-gray-600">Waveforms add visual complexity that casual listeners don't need. The highlight band is enough to communicate the looped segment without cluttering album art.</p>
            </div>
          </div>
        </motion.div>

        {/* Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Outcomes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">&lt;5s</p>
              <p className="text-gray-600 text-sm">Feature discovery time</p>
              </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">2 taps</p>
              <p className="text-gray-600 text-sm">Loop creation</p>
              </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">90%+</p>
              <p className="text-gray-600 text-sm">Target task completion</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">4.5/5</p>
              <p className="text-gray-600 text-sm">Target satisfaction</p>
            </div>
          </div>
        </motion.div>

        {/* Learnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            What this project taught me.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">01</span> Micro-interactions matter</p>
              <p className="text-gray-600 mt-1">Small features that feel obvious once they exist can significantly enhance user delight. The best additions feel native, not bolted on.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">02</span> Respect existing patterns</p>
              <p className="text-gray-600 mt-1">Spotify has a design language. Any new feature must harmonize with it, not fight it. The swipe-up drawer was inspired by Spotify's existing conventions.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">03</span> Zoom in to find opportunities</p>
              <p className="text-gray-600 mt-1">Finding overlooked behaviors and building features that feel obvious once they exist creates real value. Spotify Loop emerged from observing what people already try to do.</p>
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
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <p className="text-gray-600">Saving loops as mini-bookmarks tied to tracks</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <p className="text-gray-600">Sharing loops with visual/audio snippets</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <p className="text-gray-600">Creating playlists of favorite segments</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
              <p className="text-gray-600">Adding loop insights to Wrapped ("Your most-looped moments")</p>
            </div>
          </div>
        </motion.div>

        {/* Final Thoughts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Spotify Loop might seem like a small tweak, but it aligns with evolving user behavior. From TikTok loops to study playlists, people want music to be modular, not just linear.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This project taught me the value of zooming in: finding overlooked behaviors and building features that feel obvious once they exist. Looping gives users more expressive power in how they listen, learn, and love their favorite tracks.
          </p>
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-[#C75B3B] transition-colors flex items-center gap-2">
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
