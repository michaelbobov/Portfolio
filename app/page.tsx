'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from './components/WavyBackground';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <WavyBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex justify-between items-center mb-32">
          <motion.h1 
            className={`text-4xl font-light ${dancingScript.className} text-white`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.5 }
            }}
          >
            mb.
          </motion.h1>
          <Navigation />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <motion.h2 
              className="text-[48px] md:text-[54px] lg:text-[60px] font-semibold tracking-[0.5px] mb-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 }
              }}
            >
              michael bobov
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Turning ideas into intuitive products through AI, design, and fast iteration.
            </motion.p>
            <Link 
              href="#work"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              View Work
              <motion.svg 
                className="w-4 h-4 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{
                  y: ["0%", "50%", "20%", "50%", "0%"]
                }}
                transition={{
                  duration: 1,
                  times: [0, 0.3, 0.5, 0.7, 1],
                  ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
                  repeat: Infinity,
                  repeatDelay: 1.5
                }}
                whileHover={{
                  y: 0,
                  transition: { 
                    duration: 0.1,
                    repeat: 0 
                  }
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </motion.svg>
            </Link>
          </div>
        </motion.div>

        {/* Featured Projects Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute left-0 right-0 -bottom-12 bg-white/10 backdrop-blur-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-medium text-white">Featured Projects</h3>
              <Link href="#work" className="text-white hover:opacity-80 transition-opacity">
                View All →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Section */}
      <section className="relative mt-32">
        <div className="absolute inset-x-0 top-0 bg-white w-full h-[150%] -z-10">
          <div className="h-40 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="container mx-auto px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-semibold text-[#4A3F8C] mb-4"
              >
                Some of my work
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                A collection of projects showcasing my approach to product design and problem-solving
              </motion.p>
            </div>
            
            {/* PDF Penguin Project */}
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-[#E3F2FF] rounded-[32px] p-12 mb-12 shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-full md:w-1/2">
                    <img 
                      src="/pdf-penguin.png" 
                      alt="PDF Penguin Application Interface" 
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-4xl font-semibold mb-4">PDF Penguin</h3>
                    <p className="text-gray-600 uppercase tracking-wider text-sm mb-6">AI INTEGRATION • DATA PROCESSING</p>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                      AI-powered PDF to JSON conversion for structured, usable data.
                    </p>
                    <Link 
                      href="/work/pdf-penguin"
                      className="inline-block bg-[#0088E0] text-white px-8 py-3 rounded-xl hover:bg-[#0070B8] transition-colors text-lg"
                    >
                      Read Case Study
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* EmotionWell Project */}
            <div className="bg-[#FFF3D6] rounded-[32px] p-12">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2">
                  <img 
                    src="/emotionwell.png" 
                    alt="EmotionWell App Screenshots" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-4xl font-semibold mb-4">EmotionWell</h3>
                  <p className="text-gray-600 uppercase tracking-wider text-sm mb-6">UX DESIGN</p>
                  <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                    A mobile app that improves emotional wellbeing through a personalized lesson plan and educational materials on emotional wellness.
                  </p>
                  <Link 
                    href="/work/emotionwell"
                    className="inline-block bg-[#FFB800] text-white px-8 py-3 rounded-xl hover:bg-[#E6A600] transition-colors text-lg"
                  >
                    Read Case Study
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 