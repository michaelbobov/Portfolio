'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from './components/WavyBackground';
import Image from 'next/image';

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
    heroImage: '/pdfpenguinhero.png', // Using the new hero image
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
    image: '/spotifyloopmockup.png',
    heroImage: '/spotifyloophero.png', // Using the new hero image
    link: '/work/spotify-loop',
    bgColor: 'bg-green-100',
    buttonColor: 'bg-[#1DB954] hover:bg-[#1AA34A]',
    platforms: ['mobile'] // Mobile app feature
  },
  {
    id: 'ez-recipe',
    title: 'EZ Recipe',
    description: 'Smart cooking with what you have - a comprehensive recipe and meal planning solution.',
    tags: ['RECIPE APP', 'MEAL PLANNING'],
    image: '/ezrecipelaptop.png',
    heroImage: '/ezrecipehero.png', // Hero image for EZ Recipe
    link: '/work/ez-recipe',
    bgColor: 'bg-[#eaf3cf]',
    buttonColor: 'bg-[#FFB800] hover:bg-[#E6A600]',
    platforms: ['web'] // Web-based application
  },
  {
    id: 'versum',
    title: 'Versum Health',
    description: 'Connecting uninsured patients with supervised dental students for accessible care.',
    tags: ['HEALTHCARE', 'MARKETPLACE'],
    image: '/mockuuups-macknook-air.png',
    heroImage: '/versumhero.png', // Using the new hero image
    link: '/work/versum',
    bgColor: 'bg-purple-100',
    buttonColor: 'bg-[#4A3F8C] hover:bg-[#3C3274]',
    platforms: ['web'],
    passwordProtected: true,
    password: 'versum2026' // Updated password
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [passwordModal, setPasswordModal] = useState<{isOpen: boolean, projectId: string | null}>({isOpen: false, projectId: null});
  const [passwordInput, setPasswordInput] = useState('');

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

  const handleProjectClick = (project: any) => {
    if (project.passwordProtected) {
      setPasswordModal({isOpen: true, projectId: project.id});
    } else {
      window.location.href = project.link;
    }
  };

  const handlePasswordSubmit = () => {
    const project = projects.find(p => p.id === passwordModal.projectId);
    if (project && passwordInput === project.password) {
      setPasswordModal({isOpen: false, projectId: null});
      setPasswordInput('');
      window.location.href = project.link;
    } else {
      alert('Incorrect password');
    }
  };

  const closePasswordModal = () => {
    setPasswordModal({isOpen: false, projectId: null});
    setPasswordInput('');
  };

  const filterOptions = [
    { id: 'all', label: 'All Projects' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'web', label: 'Web' }
  ];

  return (
    <main className="relative flex flex-col">
      <WavyBackground />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-20 pb-32 flex-1">
        <h1 className="sr-only">Michael Bobov — Product Designer</h1>
        <div className="flex justify-between items-center mb-16 md:mb-24 lg:mb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.5 }
            }}
          >
            <Image 
              src="/whiteinitals.png"
              alt="MB - Michael Bobov"
              width={80}
              height={80}
              className="w-16 h-16"
              priority
            />
          </motion.div>
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
              <div className="h-[280px] md:h-[360px] lg:h-[405px] xl:h-[450px] relative">
                <img 
                  src="/name.png" 
                  alt="Michael Bobov — Product Designer" 
                  className="max-w-screen w-full h-[280px] md:h-[360px] lg:h-[405px] xl:h-[450px] object-contain mx-auto ml-2 md:ml-4 lg:ml-8"
                />
              </div>
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 -mt-24 md:-mt-32 lg:-mt-36"
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
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg group -mt-24 md:-mt-32 lg:-mt-36"
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


      </div>

      {/* Projects Section */}
      <section id="work" className="relative mt-32 scroll-mt-24">
        <div className="absolute inset-x-0 top-0 bg-white w-full h-full -z-10 -mt-24">
        </div>
        <div className="container mx-auto px-4 pt-20 pb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12 md:mb-16 lg:mb-20 -mt-16 md:-mt-20 lg:-mt-28">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#4A3F8C] mb-4"
              >
                Some of my work
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12"
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
            
            {/* Dynamic Projects - 2x2 Grid with Flip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="group perspective-1000 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative w-full h-96 md:h-[28rem] lg:h-[32rem] transform-style-preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front of card - Hero Image with Project Info Overlay */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="relative rounded-3xl h-full overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <Image
                          src={project.heroImage}
                          alt={`${project.title} Hero`}
                          fill
                          className="object-cover"
                          priority={index < 2}
                        />
                        {/* Subtle hover hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="text-white text-sm font-medium">
                              Hover to explore
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card - Screenshot with overlay */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="relative rounded-3xl h-full overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        {/* Screenshot as background */}
                        {project.id === 'ez-recipe' ? (
                          <Image
                            src="/ezrecipelaptop.png"
                            alt="EZ Recipe Laptop Interface"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Image
                            src={project.image}
                            alt={`${project.title} Interface`}
                            fill
                            className={project.id === 'pdf-penguin' ? 'object-contain' : 'object-cover'}
                          />
                        )}
                        {/* Dark overlay with content */}
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                          <div className="text-center">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-white/90 uppercase tracking-wider text-sm md:text-base mb-4">
                              {project.tags.join(' • ')}
                            </p>
                            <div className={`inline-block ${project.buttonColor} text-white px-6 py-3 rounded-xl transition-colors text-base font-medium`}>
                              {project.passwordProtected ? 'Enter Password' : 'Read Case Study'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Removed faux footer section; real Footer is in root layout */}

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
            <Image
              src={selectedImage}
              alt="Enlarged project preview"
              width={1600}
              height={900}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Password Modal */}
      {passwordModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePasswordModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Password Required</h3>
            <p className="text-gray-600 mb-6">
              This project is password protected. Please enter the password to continue.
            </p>
            <div className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Enter
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
} 