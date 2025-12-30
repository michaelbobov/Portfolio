'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';

// Project data
const projects = [
  {
    id: 'versum',
    title: 'Versum Health',
    description: 'Healthcare marketplace connecting patients with dental students',
    tags: ['Healthcare', 'Marketplace'],
    heroImage: '/versumheroimage.png',
    link: '/work/versum',
    color: '#E8E4F0',
    accent: '#6B5B95',
    year: '2025'
  },
  {
    id: 'pdf-penguin',
    title: 'PDF Penguin',
    description: 'AI-powered document processing tool',
    tags: ['AI', 'Developer Tools'],
    heroImage: '/pdfpenguinhero.png',
    link: '/work/pdf-penguin',
    color: '#E3F2FF',
    accent: '#4A90E2',
    year: '2025'
  },
  {
    id: 'spotify-loop',
    title: 'Spotify Loop',
    description: 'Feature addition concept for micro-looping',
    tags: ['Mobile', 'Feature Design'],
    heroImage: '/spotifyloophero.png',
    link: '/work/spotify-loop',
    color: '#E8F5E9',
    accent: '#1DB954',
    year: '2025'
  },
  {
    id: 'ez-recipe',
    title: 'EZ Recipe',
    description: 'Constraint-based recipe generator',
    tags: ['Consumer', 'AI'],
    heroImage: '/ezrecipehero.png',
    link: '/work/ez-recipe',
    color: '#FFF8E1',
    accent: '#FFB800',
    year: '2025'
  }
];

// Animated word rotator component
function AnimatedWordRotator() {
  const words = ['builds', 'designs', 'ships', 'iterates', 'creates'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEllipsis, setShowEllipsis] = useState(false);
  const [ellipsisCount, setEllipsisCount] = useState(0);

  useEffect(() => {
    let ellipsisInterval: NodeJS.Timeout;
    
    const mainInterval = setInterval(() => {
      // Show ellipsis first
      setShowEllipsis(true);
      setEllipsisCount(0);
      
      // Animate ellipsis one by one
      ellipsisInterval = setInterval(() => {
        setEllipsisCount((prev) => {
          if (prev >= 2) {
            clearInterval(ellipsisInterval);
            return 2;
          }
          return prev + 1;
        });
      }, 250); // Each dot appears every 250ms
      
      // After all ellipsis dots appear, change word
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setShowEllipsis(false);
        setEllipsisCount(0);
      }, 1000); // Show ellipsis for 1000ms total
    }, 3000); // Change word every 3 seconds

    return () => {
      clearInterval(mainInterval);
      if (ellipsisInterval) clearInterval(ellipsisInterval);
    };
  }, []);

  return (
    <span className="font-serif italic text-[#C75B3B] inline-block min-w-[120px] md:min-w-[140px]">
      <AnimatePresence mode="wait">
        {showEllipsis ? (
          <motion.span
            key="ellipsis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: i <= ellipsisCount ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                .
              </motion.span>
            ))}
          </motion.span>
        ) : (
          <motion.span
            key={words[currentIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-block"
          >
            {words[currentIndex]}.
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Preload and prepare audio
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.load();
      
      // Test if audio can play (for debugging)
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log('Audio is ready to play');
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
    }
  }, []);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (audioRef.current) {
      try {
        // Wait for duration to be available
        if (isNaN(audioRef.current.duration) || audioRef.current.duration === 0) {
          await new Promise((resolve) => {
            const checkDuration = () => {
              if (!isNaN(audioRef.current!.duration) && audioRef.current!.duration > 0) {
                resolve(true);
              } else {
                setTimeout(checkDuration, 100);
              }
            };
            checkDuration();
          });
        }
        
        // Calculate middle point
        const middleTime = audioRef.current.duration / 2;
        audioRef.current.currentTime = middleTime;
        audioRef.current.volume = 0.7;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise.then(() => {
            console.log('Audio playing from middle');
            // Stop after 0.5 seconds
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
            }, 500);
          }).catch((error) => {
            console.error('Play promise rejected:', error);
          });
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
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
      <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900">
              <span className="font-serif">I'm Michael, a product</span>
              <br />
              <span className="font-serif">designer who </span>
              <AnimatedWordRotator />
            </h1>
          </motion.div>

          {/* Right - Sticky Note Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="-mt-16 lg:-mt-20 flex justify-center lg:justify-start items-start lg:ml-8"
          >
            <Link 
              href="/me"
              className="relative block"
            >
              <Image
                src={isHovered ? "/postitbend.png" : "/stickynote.png"}
                alt="Sticky Note"
                width={350}
                height={350}
                className="w-auto h-auto max-w-[260px] md:max-w-[320px] transition-none"
                priority
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-handwriting text-gray-800 text-2xl md:text-3xl pointer-events-none"
                style={{ 
                  transform: 'translate(-50%, -50%) rotate(-4deg)',
                  zIndex: 5
                }}
              >
                me
              </div>
              <div
                className="absolute cursor-pointer"
                style={{ 
                  top: '20%', 
                  left: '20%', 
                  width: '60%', 
                  height: '60%',
                  zIndex: 10
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <audio
                ref={audioRef}
                src="/sounds/Book Page Turn Flip Sound Effect.mp3"
                preload="auto"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="container mx-auto px-6 md:px-12 lg:px-20 pt-0 pb-24 md:pb-32 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Label */}
          <div className="mb-8 md:mb-12">
            <span className="font-mono text-sm text-gray-400 tracking-wide">SELECTED WORK</span>
          </div>

          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* First Project - Large Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-7"
            >
              <Link href={projects[0].link} className="group block">
                <div 
                  className="relative aspect-[4/3] overflow-hidden transition-all duration-500 group-hover:shadow-2xl mb-4"
                  style={{ backgroundColor: projects[0].color }}
                >
                  <Image
                    src={projects[0].heroImage}
                    alt={projects[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl md:text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#C75B3B] transition-colors">
                      {projects[0].title}
                    </h3>
                    <p className="text-sm text-gray-500 font-sans">
                      {projects[0].tags.join(' · ')}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#C75B3B] flex-shrink-0">{projects[0].year}</span>
                </div>
              </Link>
            </motion.div>

            {/* Second Project - Small Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-5"
            >
              <Link href={projects[1].link} className="group block">
                <div 
                  className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden transition-all duration-500 group-hover:shadow-2xl mb-4"
                  style={{ backgroundColor: projects[1].color }}
                >
                  <Image
                    src={projects[1].heroImage}
                    alt={projects[1].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl md:text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#C75B3B] transition-colors">
                      {projects[1].title}
                    </h3>
                    <p className="text-sm text-gray-500 font-sans">
                      {projects[1].tags.join(' · ')}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#C75B3B] flex-shrink-0">{projects[1].year}</span>
                </div>
              </Link>
            </motion.div>

            {/* Third Project - Small Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-5"
            >
              <Link href={projects[2].link} className="group block">
                <div 
                  className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden transition-all duration-500 group-hover:shadow-2xl mb-4"
                  style={{ backgroundColor: projects[2].color }}
                >
                  <Image
                    src={projects[2].heroImage}
                    alt={projects[2].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl md:text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#C75B3B] transition-colors">
                      {projects[2].title}
                    </h3>
                    <p className="text-sm text-gray-500 font-sans">
                      {projects[2].tags.join(' · ')}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#C75B3B] flex-shrink-0">{projects[2].year}</span>
                </div>
              </Link>
            </motion.div>

            {/* Fourth Project - Large Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-7"
            >
              <Link href={projects[3].link} className="group block">
                <div 
                  className="relative aspect-[4/3] overflow-hidden transition-all duration-500 group-hover:shadow-2xl mb-4"
                  style={{ backgroundColor: projects[3].color }}
                >
                  <Image
                    src={projects[3].heroImage}
                    alt={projects[3].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl md:text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#C75B3B] transition-colors">
                      {projects[3].title}
                    </h3>
                    <p className="text-sm text-gray-500 font-sans">
                      {projects[3].tags.join(' · ')}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#C75B3B] flex-shrink-0">{projects[3].year}</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
            Let's work together.
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl">
            Currently open to new opportunities. If you're looking for a designer who can also build, let's talk.
          </p>
          <a 
            href="mailto:michael@michaelbobov.com" 
            className="inline-flex items-center gap-2 font-mono text-sm text-[#C75B3B] hover:text-[#A84A2E] transition-colors group"
          >
            <span>GET IN TOUCH</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </section>
    </main>
  );
}
