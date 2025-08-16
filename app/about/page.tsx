'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from '../components/WavyBackground';
import Link from 'next/link';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function AboutPage() {
  return (
    <main className="min-h-screen relative">
      <WavyBackground />

      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="flex justify-between items-center mb-16">
          <Link href="/">
            <motion.h1 
              className={`text-4xl font-light ${dancingScript.className} text-white hover:text-white/90 transition-colors`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ opacity: { duration: 0.5 } }}
            >
              MB
            </motion.h1>
          </Link>
          <Navigation />
        </div>

        <section className="mx-auto max-w-3xl bg-white/85 rounded-2xl shadow-xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">About</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            I’m a product designer focused on AI‑powered consumer experiences. I move fast from concept to clarity—framing the problem, validating the approach, and iterating with working prototypes. My work spans UX research, interaction design, and front‑end implementation when needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Strengths</h3>
              <ul className="text-gray-700 space-y-2">
                <li>Problem framing & opportunity mapping</li>
                <li>Low‑to‑high fidelity prototyping</li>
                <li>Data‑informed iteration & metrics</li>
                <li>AI feature design & prompt UX</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tools</h3>
              <ul className="text-gray-700 space-y-2">
                <li>Figma, Framer Motion</li>
                <li>React, TailwindCSS</li>
                <li>OpenAI APIs, OCR pipelines</li>
                <li>Vercel, Next.js</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:michaelbobov@gmail.com?subject=Portfolio — Let’s talk"
              className="bg-[#4A3F8C] hover:bg-[#3c3270] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Email me
            </a>
            <a
              href="/resume.pdf"
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors"
              download
            >
              Download resume
            </a>
            <a
              href="https://www.linkedin.com/in/michael-bobov-94b61b202/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors"
            >
              Connect on LinkedIn
            </a>
            <a
              href="https://cal.com/mbobov/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors"
            >
              Book a call
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}


