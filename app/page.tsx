'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-rose-100 to-amber-100">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-40">
          <motion.h1 
            className="text-4xl font-light font-brush"
            animate={{
              color: [
                '#5A4E6D', // muted plum
                '#4A3E5D', // darker plum
                '#5A4E6D', // muted plum
                '#6A5E7D', // lighter plum
                '#5A4E6D', // muted plum
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
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
          className="text-center"
        >
          <div className="mb-8">
            <motion.h2 
              className="text-7xl font-light mb-6"
              animate={{
                color: [
                  '#5A4E6D', // muted plum
                  '#4A3E5D', // darker plum
                  '#5A4E6D', // muted plum
                  '#6A5E7D', // lighter plum
                  '#5A4E6D', // muted plum
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              michael bobov
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              Turning ideas into intuitive products through AI, design, and fast iteration.
            </p>
            <Link 
              href="#work"
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-200/50 hover:bg-emerald-200/70 text-gray-700 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              View Work
              <svg 
                className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 