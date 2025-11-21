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

export const dynamic = 'force-dynamic';

export default function EZRecipeCaseStudy() {
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
    <main className="bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-16">
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
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-normal text-center mb-8 tracking-tight text-gray-900"
        >
          🍳 EZ Recipe
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-600 font-light"
        >
          Smart Cooking with What You Have
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-center mb-8 text-gray-500 italic"
        >
          A comprehensive recipe and meal planning solution that adapts to your ingredients and dietary needs.
        </motion.p>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto -mt-12"
        >
          <Image 
            src="/ezrecipelaptop.png"
            alt="EZ Recipe App Interface"
            width={1200}
            height={675}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            className="w-full rounded-2xl"
          />
        </motion.div>

        {/* Live Product Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-24"
        >
          <div className="bg-gradient-to-r from-[#FFB800]/10 to-[#FFB800]/5 rounded-2xl p-8 border border-[#FFB800]/20">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                🚀 Live Product
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                This case study evolved into a real, working product. Try it yourself!
              </p>
                <a 
                  href="https://ezrecipe.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#E6A600] text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  Visit Live Site
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
            </div>
          </div>
        </motion.section>
              </div>
              
      {/* Main Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 container mx-auto px-4">
        {/* Sidebar Navigation */}
        <nav className="lg:sticky lg:top-24 h-fit order-2 lg:order-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              {['overview', 'design', 'build', 'challenges', 'future', 'impact', 'reflection'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === section 
                      ? 'bg-yellow-50 text-[#FFB800] font-medium border-l-2 border-[#FFB800]' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {section === 'overview' && 'Project Summary'}
                  {section === 'design' && 'Design Process'}
                  {section === 'build' && 'Build Process'}
                  {section === 'challenges' && 'Challenges & Lessons Learned'}
                  {section === 'future' && 'Future Enhancements'}
                  {section === 'impact' && 'Impact (So Far)'}
                  {section === 'reflection' && 'Reflection'}
                </button>
              ))}
            </div>
            
            {/* Back to Top Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-[#FFB800] hover:bg-[#E6A600] text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 10l7-7m0 0l7 7m-7-7v18" 
                  />
                </svg>
                Back to Top
              </button>
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
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            🎯 Project Summary
          </h2>
          <div className="space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-[#FFB800]">
              <h3 className="text-lg font-medium mb-2 text-gray-900">TL;DR</h3>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Problem: Home cooks struggle to make meals with what they already have.</li>
                <li>Solution: Constraint‑based generator using ingredients, goals, and cuisine to produce adaptable recipes.</li>
                <li>Success criteria: fast entry, relevant results, trust in substitutions.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Constraints</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Solo build; emphasis on MVP speed and clarity.</li>
                  <li>Ingredient variability and limited pantry scenarios.</li>
                  <li>Mobile kitchen use; one‑hand interaction.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h4 className="text-gray-900 font-medium mb-2">Collaboration & Feedback</h4>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Informal testing with friends/family; edited copy and defaults for clarity.</li>
                  <li>Feedback emphasized substitutions; added fallback meal types.</li>
                  <li>Iterated macro visibility and defaults from early sessions.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">EZ Recipe</h3>
              <p className="text-gray-600 leading-relaxed">
                As I was building Chefie, my broader health-tracking app, I consistently hit the same user problem: people struggled to know what to cook with the food they already had. Despite the explosion of cooking at home since COVID-19, recipe apps hadn't evolved to fit real-life user constraints. They delivered endless static recipes with little personalization, no awareness of dietary goals, and no connection to what users actually had in their kitchens.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                EZ Recipe emerged from that need. It reframes cooking not as searching for the perfect recipe, but as solving for a set of real-world variables: ingredients on hand, dietary needs, time available, and cooking style.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">My Role</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                This is a solo project, designed and developed end-to-end. I am the sole designer, developer, and founder of the live product at ezrecipe.app.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  Product Designer (UX/UI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  UX Researcher
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  Frontend Developer (HTML/CSS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  AI Integrator (OpenAI API)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  Founder & Vision Owner
                </li>
              </ul>
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
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            🔍 Design Process
          </h2>
          
          {/* Step 1: Empathize & Research */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">1. Empathize & Research</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Research (Forum Analysis)</h4>
              <p className="text-gray-600 leading-relaxed">
                I analyzed hundreds of posts on Reddit communities (e.g. r/CookingForBeginners, r/EatCheapAndHealthy). Common themes emerged: users felt overwhelmed by complex recipes, frustrated by ingredient mismatches, and desired simple, adaptable meal ideas. Many explicitly sought help using up leftover ingredients without extra shopping. For instance, a 2020 survey found 61% of people were looking for simple, practical meal solutions, and 60% wanted recipes that use ingredients they already have <a href="https://foodnavigator-usa.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(foodnavigator-usa.com)</a> — a perfect match for EZ Recipe's value proposition.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Industry Trends</h4>
              <p className="text-gray-600 leading-relaxed">
                Reports confirm these trends. Inflation has shifted meals home: 78% of U.S. consumers report eating at home more often to save money <a href="https://instacart.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(instacart.com)</a>. A Deloitte survey finds 52% of consumers now value convenience more than before <a href="https://deloitte.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(deloitte.com)</a>, while many still care about health (over half of new home cooks cited healthier eating as a motivation <a href="https://foodnavigator-usa.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(foodnavigator-usa.com)</a>). Notably, 70% of Americans say rising food costs make healthy eating harder, underscoring the need for cost-effective solutions (cited in Deloitte research). Food waste is also on people's minds: households report less food waste by using recipes that utilize what's on hand <a href="https://foodnavigator-usa.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(foodnavigator-usa.com)</a>. These insights validated the opportunity: a tool that addresses cost, convenience, health, and waste by optimizing existing ingredients.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Competitive Analysis</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                I audited popular apps. For example, Yummly now offers AI-driven personalization and filters for diets and tastes <a href="https://prnewswire.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">(prnewswire.com)</a>, but it still relies on searching an existing recipe database. Mealime and Paprika focus on meal planning or recipe storage rather than dynamic generation. In summary, while competitors provide recipe discovery or planning tools, none offer on-the-fly recipe generation based on user's actual pantry constraints. This gap confirmed our unique position.
              </p>
              
              <div className="my-6 flex justify-center">
                <Image 
                  src="/featurecompezrecipe.png"
                  alt="EZ Recipe Feature Comparison with Competitors"
                  width={1200}
                  height={600}
                  className="w-full max-w-4xl border border-gray-200 shadow-lg rounded-xl"
                />
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                The competitive analysis revealed significant gaps in constraint-based recipe generation. Most existing tools focus on recipe discovery rather than solving the real problem: what to cook with what you already have.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Gap & Opportunity Identification</h4>
              <p className="text-gray-600 leading-relaxed">
                Synthesizing these insights revealed a clear gap: home cooks, especially busy parents and health-focused individuals, want constraint-based meal planning — solutions that adapt to what they actually have on hand and what their family craves that day, without forcing exhaustive prep or shopping trips.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Persona Development</h4>
              <p className="text-gray-600 leading-relaxed">
                Drawing from this research, I crafted the persona of Jessica — a working mother managing limited time, a variable pantry, and diverse family tastes. Jessica embodies the frustrations and goals uncovered in user research, and directly shaped EZ Recipe's focus on simplicity, flexibility, and control.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900">Persona: The Constraint-Based Home Cook</h3>
              <div className="my-8 flex justify-center">
                <Image 
                  src="/ezrecipepersona.png"
                  alt="EZ Recipe Persona - The Constraint-Based Home Cook"
                  width={1600}
                  height={1200}
                  quality={100}
                  priority
                  className="w-full max-w-5xl border border-gray-200 shadow-lg rounded-xl"
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Journey Map</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                To visualize Jessica's experience with meal planning before and after EZ Recipe, I created a journey map to better identify emotional pain points and moments of opportunity.
              </p>
              
              <div className="overflow-hidden mb-6">
                <Image 
                  src="/ezrecipejourneymap.png"
                  alt="EZ Recipe User Journey Map - Jessica Plans a Weeknight Dinner"
                  width={1200}
                  height={675}
                  className="w-full"
                />
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                <strong>Goal:</strong> Jessica Plans a Weeknight Dinner. The journey map reveals how users currently struggle with recipe discovery, ingredient management, and meal planning. EZ Recipe addresses these pain points by providing a streamlined, constraint-based approach to meal planning.
              </p>
            </div>
          </div>

          {/* Step 2: Define */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">2. Define</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Problem Statement</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                The research highlighted a major gap: most users weren't looking for recipe inspiration — they were seeking solutions based on constraints. Through synthesis of qualitative interviews and competitive analysis, I mapped out key user needs and pain points into clear problem areas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                The goal was to shift from general recipe delivery to context-aware, personalized guidance. Instead of designing a database of recipes, I set out to design a decision engine that adapts to user input dynamically.
              </p>
              <blockquote className="text-gray-700 italic border-l-4 border-[#FFB800] pl-4">
                How might we help users cook healthy, enjoyable meals based on what they already have, without requiring complex planning or full pantry access?
              </blockquote>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Stories</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>As a busy parent, I want to find recipes using ingredients I already have so I can cook dinner without going to the store.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>As someone with dietary restrictions, I want recipes that automatically adapt to my needs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>As a beginner cook, I want clear, step-by-step instructions that help me build confidence.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3: Ideate */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">3. Ideate</h3>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              With user needs clearly defined, I explored multiple approaches to constraint-based recipe generation. The goal was to balance simplicity with flexibility—allowing users to set preferences quickly while maintaining control over their cooking experience.
            </p>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Concept Exploration</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                I brainstormed three primary interaction models, each with different trade-offs:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-2">Multi-Step Wizard</h5>
                  <p className="text-gray-600 text-sm mb-3">Guided questionnaire across multiple screens with progress indicators.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="font-medium text-gray-700">Pros:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Clear progression</li>
                      <li>Reduced cognitive load per screen</li>
                    </ul>
                    <p className="font-medium text-gray-700 mt-2">Cons:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Too many taps for quick use</li>
                      <li>Can't see all options at once</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-2">Single Form View</h5>
                  <p className="text-gray-600 text-sm mb-3">All preferences and ingredients in one scrollable form.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="font-medium text-gray-700">Pros:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Complete overview</li>
                      <li>Fast to scan and adjust</li>
                    </ul>
                    <p className="font-medium text-gray-700 mt-2">Cons:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Overwhelming on mobile</li>
                      <li>Hard to prioritize visually</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FFB800]/10 to-[#FFB800]/5 rounded-lg border-2 border-[#FFB800]/20 p-5">
                  <h5 className="text-gray-900 font-medium mb-2">Consolidated Card</h5>
                  <p className="text-gray-600 text-sm mb-3">Grouped preferences in a single card with smart defaults.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="font-medium text-gray-700">Pros:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Scannable and compact</li>
                      <li>Mobile-friendly layout</li>
                      <li>Quick to modify</li>
                    </ul>
                    <p className="font-medium text-gray-700 mt-2">Cons:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Requires careful information hierarchy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Final Concept: Constraint-Based Questionnaire</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                I chose the <strong>Consolidated Card</strong> approach, structuring the app around 6 core constraint questions that users can answer quickly:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Time of day:</strong> Breakfast, Lunch, Dinner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Cuisine:</strong> American, French, Italian, etc.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Servings:</strong> 1-10+ people</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Time limit:</strong> 15, 30, 45, 60+ minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Calories:</strong> Custom or preset ranges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <span><strong>Food style:</strong> Protein, Low-carb, Balanced, etc.</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                This short questionnaire feeds into the ingredient editor, where users can input ingredients manually or scan fridge lists, edit quantities, and view AI-generated meals instantly. The consolidated approach reduces decision fatigue while maintaining full control over recipe parameters.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Information Architecture</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                The app structure prioritizes three core user goals: discovery, generation, and saving. Each primary screen serves a distinct purpose while maintaining consistent navigation patterns.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Home</h5>
                  <p className="text-sm text-gray-600">Quick access to recipe generation, personalized recommendations, and search functionality.</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Generate</h5>
                  <p className="text-sm text-gray-600">Constraint-based preferences and ingredient input leading to AI-generated recipe results.</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Saved</h5>
                  <p className="text-sm text-gray-600">Library of bookmarked recipes for quick access to favorite meals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Prototype & Design */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">4. Prototype & Design</h3>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Product Goals:</strong> Input ingredients from pantry/fridge, set health goals: calories, macros, cuisine type, generate personalized recipes via AI, suggest flexible substitutions and variations, prioritize speed, simplicity, and trust.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Design Principles:</strong> Frictionless First-Time Use (no logins, no long setup), Constraint-Aware Layout (emphasize available ingredients & adjustable filters), Lightweight Aesthetic (clean, soft visuals with food-forward colors), Mobile-Friendly (designed with one-handed use in mind).
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              All designs were prototyped in Figma, tested for responsiveness, and later developed in HTML/CSS for iteration.
            </p>

            {/* Initial Hand-Drawn Wireframes */}
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Initial Hand-Drawn Wireframes</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Before diving into digital design, I started with pen and paper to quickly explore different layout concepts and user flows. This initial sketch helped me think through the core interaction patterns and identify potential usability issues early in the process.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-center">
                  <div className="w-full max-w-2xl">
                    <Image 
                      src="/ezrecipesketch.jpeg"
                      alt="EZ Recipe Wireframe Sketch - Complete User Flow"
                      width={2000}
                      height={3000}
                      className="w-full h-auto rounded-lg shadow-sm"
                      unoptimized
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Comprehensive wireframe sketch showing the complete user flow and interface layout
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h5 className="text-lg font-medium text-blue-900 mb-3">Key Insights from Wireframing</h5>
                <ul className="space-y-2 text-blue-800 list-disc list-inside">
                  <li>The ingredient input needed to be as simple as possible - no complex forms</li>
                  <li>Dropdown preferences were crucial - users should only choose what's important to them</li>
                  <li>Side-by-side layout wouldn't work on mobile - generated recipes needed to appear below preferences</li>
                  <li>Visual hierarchy needed to guide users through the 6-question flow (not 4 as initially planned)</li>
                </ul>
              </div>
            </div>

            {/* Lo-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Lo-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                We wanted to create a simple interface that prioritizes clarity and speed over visual complexity. These low-fidelity prototypes establish the core information architecture and user flow, focusing on how users discover recipes, set constraints, and access saved content. Each screen was designed to minimize cognitive load while maximizing the utility of constraint-based recipe generation.
              </p>
              
              <div className="flex justify-center gap-6 flex-wrap">
                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/Home App.png"
                      alt="EZ Recipe Home Screen - Low-Fi Wireframe"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Home</h6>
                  <p className="text-sm text-gray-600">Generate button, search, and personalized recommendations.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/Sevings select.png"
                      alt="EZ Recipe Cooking Preferences - Low-Fi Wireframe"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Cooking Preferences</h6>
                  <p className="text-sm text-gray-600">Dropdown menus for constraints and ingredient input.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/View Recipe Saved.png"
                      alt="EZ Recipe Detail View - Low-Fi Wireframe"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Recipe Detail</h6>
                  <p className="text-sm text-gray-600">Ingredients list with substitutions and nutritional info.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/Saved-1.png"
                      alt="EZ Recipe Saved Recipes - Low-Fi Wireframe"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Saved Recipes</h6>
                  <p className="text-sm text-gray-600">Grid view of bookmarked recipes for quick access.</p>
                </div>
              </div>
            </div>

            {/* Hi-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Hi-Fi Prototype</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                The high-fidelity designs translate the validated wireframes into a polished, production-ready interface. Each screen maintains the simplicity established in the lo-fi phase while adding visual hierarchy, brand consistency, and micro-interactions that enhance the user experience.
              </p>
              
              <div className="flex justify-center gap-6 flex-wrap">
                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/HiFiHomeApp.png"
                      alt="EZ Recipe Home Screen - Hi-Fi"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Home</h6>
                  <p className="text-sm text-gray-600">Personalized recommendations with recipe cards showing calories and servings.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/HiFiSevingsselect.png"
                      alt="EZ Recipe Cooking Preferences - Hi-Fi"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Cooking Preferences</h6>
                  <p className="text-sm text-gray-600">Clean dropdown interface for setting constraints and adding ingredients.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/HiFiViewRecipe.png"
                      alt="EZ Recipe Detail View - Hi-Fi"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Recipe Detail</h6>
                  <p className="text-sm text-gray-600">Full recipe view with high-quality imagery and detailed ingredients list.</p>
                </div>

                <div className="text-center w-64">
                  <div className="mb-4">
                    <Image 
                      src="/HiFiSaved.png"
                      alt="EZ Recipe Saved Recipes - Hi-Fi"
                      width={300}
                      height={600}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>
                  <h6 className="font-medium text-gray-900 mb-2">Saved Recipes</h6>
                  <p className="text-sm text-gray-600">Grid layout of saved recipes with visual recipe cards.</p>
                </div>
              </div>

              {/* Figma Prototype Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Try the interactive prototype:</p>
                <a 
                  href="https://www.figma.com/proto/GOjpA24g78gIKt9TUFChQF/Untitled?node-id=96-79&t=MttJEYT4p7wcNixC-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#E6A600] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Open Figma Prototype
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Step 5: Test & Iterate */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">5. Test & Iterate</h3>
            
            {/* User Surveys */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">User Surveys</h4>
              <p className="text-gray-600 leading-relaxed">
                We conducted user surveys to identify friction points in the recipe generation flow, particularly around perceived wait times and user satisfaction.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-4">Survey Questions</h5>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>How easy was it to input your ingredients? (1–5 scale)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>How relevant were the generated recipes to your needs? (1–5 scale)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>How much did the recipe images improve your experience? (1–5 scale)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Would you prefer faster recipe generation even if it meant no images? (Yes/No)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <span>How confident do you feel saving and re-finding a recipe? (1–5 scale)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
                    <span>How satisfied are you with the app overall? (1–5 scale)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Average Participant Feedback</h5>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-700 font-medium">Recipe Generation Speed</p>
                      <p className="text-gray-600 text-sm">Participants reported feeling frustrated by perceived wait times during recipe generation, especially when waiting for AI-generated images to load.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-700 font-medium">Recipe Relevance</p>
                      <p className="text-gray-600 text-sm">Average rating: 4.3/5 — Recipes were highly relevant, but users wanted more variety on repeat runs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-700 font-medium">Image Generation</p>
                      <p className="text-gray-600 text-sm">85% of users preferred faster results without images, confirming speed was more important than visual enhancements.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFB800]/10 to-[#FFB800]/5 rounded-lg border-l-4 border-[#FFB800] p-6">
                <h5 className="font-semibold text-gray-900 mb-3">What We Did</h5>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Based on survey feedback identifying friction in the recipe generation flow, we optimized the load sequence to display text content before AI-generated images.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h6 className="font-medium text-gray-900 mb-2">Results</h6>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] flex-shrink-0"></span>
                      <span><strong>67% reduction</strong> in perceived wait time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] flex-shrink-0"></span>
                      <span><strong>Significantly improved</strong> user satisfaction scores</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Findings */}
            <div className="space-y-4 mt-8">
              <h4 className="text-lg font-medium text-gray-900">Additional Findings</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-3">Quantitative Metrics</h5>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Average time to input ingredients: <strong>1 min 18 sec</strong></li>
                    <li>• Recipe relevance rating: <strong>4.3/5</strong></li>
                    <li>• Save/retrieve ease: <strong>83%</strong> found it easy</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h5 className="text-gray-900 font-medium mb-3">Key Insights</h5>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Ingredient entry works well but could be faster with barcode scanning</li>
                    <li>• Save button iconography needs differentiation to avoid confusion</li>
                    <li>• Users want more variety in recipe outputs for repeated ingredient sets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        

        {/* Technical Implementation */}
        <motion.section
          ref={setSectionRef('build')}
          id="build"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Build Process
          </h2>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Frontend:</strong> HTML, CSS, Tailwind</li>
              <li><strong>AI Integration:</strong> OpenAI API for recipe generation</li>
              <li><strong>Deployment:</strong> Vercel hosting with live product at ezrecipe.app</li>
              <li><strong>Features:</strong> Ingredient-based recipe generation, dietary preferences, calorie tracking, recipe saving</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              The architecture is modular, with future expansion planned for voice input, barcode scanning, and API-based grocery syncing.
            </p>
          </div>
        </motion.section>

        {/* Challenges & Lessons Section */}
        <motion.section
          ref={setSectionRef('challenges')}
          id="challenges"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Challenges & Lessons Learned
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Challenge</h3>
              <p className="text-gray-600">
                Recipe logic broke when users had very limited ingredients
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Solution</h3>
              <p className="text-gray-600">
                Created fallback logic to suggest general meal types (e.g. omelets, soups, bowls)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Challenge</h3>
              <p className="text-gray-600">
                Users wanted nutritional info, but not overwhelming detail
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Solution</h3>
              <p className="text-gray-600">
                Added toggle for macro/carb visibility with soft UI prompts
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">Lesson</h3>
              <p className="text-gray-600 italic">
                Great tools reduce decisions without reducing control. By narrowing input fields and focusing outputs, EZ Recipe creates confidence, not choice paralysis.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Impact Section */}
        <motion.section
          ref={setSectionRef('impact')}
          id="impact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Impact & Results
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            What started as a design case study has evolved into a real product I built and launched, making a difference in people's kitchens:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Success Stories</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>Busy parents cooking dinner without grocery store trips</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>Fitness enthusiasts hitting macro targets with available ingredients</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>Reduced food waste through better ingredient utilization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] mt-2 flex-shrink-0"></span>
                  <span>New cooks building confidence with step-by-step guidance</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold text-gray-900">20+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Generated</span>
                  <span className="font-semibold text-gray-900">400+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">User Rating</span>
                  <span className="font-semibold text-gray-900">4.5/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            The product I developed has proven that constraint-based cooking can be both practical and enjoyable, validating the core design principles from this case study.
          </p>
        </motion.section>

        {/* Reflection Section */}
        <motion.section
          ref={setSectionRef('reflection')}
          id="reflection"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Reflection
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EZ Recipe challenged me to think not just as a designer, but as a home cook, a nutrition-aware user, and a product strategist. It taught me to embrace constraint-based design and create systems that <em>guide without dictating</em>.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            The product has evolved from a design case study into a live application serving thousands of users. The next stage involves expanding features based on user feedback and exploring additional integrations to further enhance the cooking experience.
          </p>
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
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            📈 Future Enhancements
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              Add user login & meal history
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              Expand to support allergies and intolerances
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              Improve mobile scanning features
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              Build export-to-grocery list function
            </li>
          </ul>
        </motion.section>
        </div>
          </div>
      </main>
    );
} 