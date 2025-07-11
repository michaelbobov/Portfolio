'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from './components/WavyBackground';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

// Project data with platform information
const projects = [
  {
    id: 'pdf-penguin',
    title: 'PDF Penguin',
    description: 'AI-powered PDF to JSON conversion for structured, usable data.',
    tags: ['AI INTEGRATION', 'DATA PROCESSING'],
    image: '/pdf-penguin.png',
    link: '/work/pdf-penguin',
    bgColor: 'bg-[#E3F2FF]',
    buttonColor: 'bg-[#0088E0] hover:bg-[#0070B8]',
    platforms: ['web'] // Web-based tool
  },
  {
    id: 'spotify-loop',
    title: 'Spotify Loop',
    description: 'Adding micro looping to music listening - a feature addition case study for Spotify that enhances how users interact with their favorite parts of songs.',
    tags: ['UX DESIGN', 'FEATURE DESIGN'],
    image: '/spotify-loop.png',
    link: '/work/spotify-loop',
    bgColor: 'bg-[#E8F5E8]',
    buttonColor: 'bg-[#1DB954] hover:bg-[#1AA34A]',
    platforms: ['mobile'] // Mobile app feature
  },
  {
    id: 'ez-recipe',
    title: 'EZ Recipe',
    description: 'Smart cooking with what you have - a comprehensive recipe and meal planning solution.',
    tags: ['RECIPE APP', 'MEAL PLANNING'],
    image: '/ezrecipeappinterface.png',
    link: '/work/ez-recipe',
    bgColor: 'bg-[#FFF3D6]',
    buttonColor: 'bg-[#FFB800] hover:bg-[#E6A600]',
    platforms: ['web'] // Web-based application
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash === '#work') {
      const el = document.getElementById('work');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to ensure DOM is ready
      }
    }
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => 
        project.platforms.includes(activeFilter)
      ));
    }
  }, [activeFilter]);

  const filterOptions = [
    { id: 'all', label: 'All Projects' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'web', label: 'Web' }
  ];

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
          <div className="mb-8 relative">
            <motion.div 
              className="mb-6 -mt-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 }
              }}
            >
              <div className="h-[360px] md:h-[405px] lg:h-[450px] relative">
                <img 
                  src="/name.png" 
                  alt="Name" 
                  className="max-w-screen w-full h-[360px] md:h-[405px] lg:h-[450px] object-contain mx-auto ml-8"
                />
              </div>
            </motion.div>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 -mt-36"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Turning ideas into intuitive products through AI, design, and fast iteration.
            </motion.p>
            <button
              onClick={() => {
                const el = document.getElementById('work');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg group -mt-36"
              type="button"
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
            </button>
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
      <section id="work" className="relative mt-32 scroll-mt-24">
        <div className="absolute inset-x-0 top-0 bg-white w-full h-[150%] -z-10 -mt-24">
          <div className="h-40 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="container mx-auto px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20 -mt-28">
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
                className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
              >
                A collection of projects showcasing my approach to product design and problem-solving
              </motion.p>
              
              {/* Filter Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveFilter(option.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === option.id
                        ? 'bg-[#4A3F8C] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </div>
            
            {/* Dynamic Projects */}
            <div className="space-y-12">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className={`${project.bgColor} rounded-[32px] p-12 shadow-xl`}
                >
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2">
                      <img 
                        src={project.image} 
                        alt={`${project.title} Application Interface`} 
                        className="w-full h-auto rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(project.image)}
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <h3 className="text-4xl font-semibold mb-4">{project.title}</h3>
                      <p className="text-gray-600 uppercase tracking-wider text-sm mb-6">
                        {project.tags.join(' • ')}
                      </p>
                      <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        {project.description}
                      </p>
                      <Link 
                        href={project.link}
                        className={`inline-block ${project.buttonColor} text-white px-8 py-3 rounded-xl transition-colors text-lg`}
                      >
                        Read Case Study
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Enlarged project preview"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
} 