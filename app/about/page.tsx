'use client';

import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(skillsRef, { once: true, amount: 0.3 });

  const skills = [
    { name: 'Product Design', description: 'End-to-end UX/UI design from research to high-fidelity prototypes' },
    { name: 'UX Research', description: 'User interviews, surveys, competitive analysis, and data-driven design decisions' },
    { name: 'Frontend Development', description: 'Building responsive interfaces with HTML, CSS, Tailwind, and modern frameworks' },
    { name: 'AI Integration', description: 'Integrating OpenAI and AI tools as creative and development accelerators' },
    { name: 'Product Building', description: 'Designing and developing real, functioning products from concept to launch' },
    { name: 'Rapid Iteration', description: 'Fast prototyping and testing cycles using AI-assisted development' },
    { name: 'Design Systems', description: 'Creating scalable, consistent design languages and component libraries' },
    { name: 'Prototyping', description: 'Interactive prototypes in Figma and code to test and validate designs' },
  ];

  const { scrollYProgress } = useScroll({
    target: horizontalScrollRef,
    offset: ["start start", "end end"]
  });

  // Calculate scroll distance based on number of skills (each card is ~90vw on mobile, 600px on desktop)
  const totalCards = skills.length + 1; // +1 for the intro card
  const scrollDistance = (totalCards - 1) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${scrollDistance}%`]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      <div className="container mx-auto px-4 pt-20 pb-24">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-16"
        >
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image 
              src="/blackinitals.png"
              alt="MB - Michael Bobov"
              width={80}
              height={80}
              className="w-16 h-16"
              priority
            />
          </Link>
          <Navigation />
        </motion.div>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-32 md:mb-40"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left Side - Image with Parallax */}
              <motion.div 
                className="flex-shrink-0"
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                  <Image 
                    src="/IMG_8226.jpg"
                    alt="Michael Bobov"
                    width={500}
                    height={500}
                    className="w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-cover rounded-2xl shadow-2xl relative z-10"
                    priority
                  />
                </div>
              </motion.div>
              
              {/* Right Side - Text */}
              <div className="flex-1 space-y-6">
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  About Me
                </motion.h1>
                <motion.div 
                  className="space-y-4 text-lg md:text-xl text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p>
                    Hi! My name is Michael. I'm a Product Designer with a focus on creating not just concepts, but <span className="font-semibold text-gray-900">real, functioning products</span>. My process goes beyond Figma — I design, build, and iterate quickly by leveraging AI as both a creative partner and a development accelerator.
                  </p>
                  <p>
                    This allows me to move from idea to working prototype faster than traditional design cycles, giving me the freedom to test, refine, and push boundaries in real time.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vision Section with Animated Lightbulb */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-32 md:mb-40"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5500]/5 via-[#9747FF]/5 to-[#5CE1E6]/5 animate-pulse"></div>
              
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                {/* Left Side - Lightbulb with Animation */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 1.2, 
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <Image 
                    src="/bulb.png"
                    alt="Lightbulb representing ideas"
                    width={300}
                    height={300}
                    className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
                  />
                </motion.div>
                
                {/* Right Side - Content */}
                <div className="flex-1">
                  <motion.h2 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    My Vision
                  </motion.h2>
                  <motion.div 
                    className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <p>
                      My goal as a product designer is to help shape the future of how humans interact with technology. Just like the first mobile apps set the standard for how people learned to navigate phones, I want to design the next generation of experiences—whether that's through AI agents living on our phones, augmented reality, wearables, or technologies we haven't fully imagined yet.
                    </p>
                    <p>
                      I see design not just as making interfaces usable, but as creating the bridges that make new technology feel natural and intuitive.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Horizontal Scroll Section - Skills */}
        <section className="mb-32 md:mb-40 h-[500px] md:h-[600px]" ref={horizontalScrollRef}>
          <div className="sticky top-24 h-[400px] md:h-[500px] overflow-hidden">
            <motion.div 
              style={{ x }}
              className="flex gap-6 md:gap-8 h-full"
            >
              <div className="flex-shrink-0 w-screen flex items-center justify-center px-4">
                <div className="max-w-4xl">
                  <motion.h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    What I Do
                  </motion.h2>
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-600"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Scroll to explore my skills and expertise
                  </motion.p>
                </div>
              </div>

              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-[90vw] md:w-[600px] flex items-center justify-center px-4"
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <motion.div 
                    className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col justify-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {skill.name}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      {skill.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Current Project - Versum */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-32 md:mb-40"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative overflow-hidden rounded-3xl p-12 md:p-16 border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#FF5500]/10 via-[#9747FF]/10 to-[#5CE1E6]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <motion.div
                  className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF5500]/10 via-[#9747FF]/10 to-[#5CE1E6]/10 rounded-full mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-sm font-semibold bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] bg-clip-text text-transparent">
                    CURRENT PROJECT
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Versum Health
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                  I designed Versum, a digital platform connecting patients with healthcare students completing supervised clinical hours. This project demonstrates my ability to create user-centered experiences that drive social impact, making healthcare more accessible while supporting the next generation of professionals.
                </p>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                  Versum addresses a critical gap in healthcare access by creating a two-sided marketplace where uninsured and low-income patients can receive quality care, while dental students gain the supervised clinical experience they need to complete their training requirements.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link 
                    href="/work/versum"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    View Case Study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats/Highlights Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-32 md:mb-40"
          ref={skillsRef}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Products Built', value: '3+' },
                { label: 'Years Designing', value: '5+' },
                { label: 'AI Projects', value: '10+' },
                { label: 'Happy Users', value: '1K+' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] bg-clip-text text-transparent mb-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section with Interactive Button */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Let's connect and build something meaningful together.
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </motion.p>
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.a 
                href="mailto:hello@michaelbobov.com" 
                className="relative overflow-hidden bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get in Touch</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0"
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
