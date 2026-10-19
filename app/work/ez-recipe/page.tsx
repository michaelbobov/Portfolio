'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import FullSizeLink from '@/app/components/FullSizeLink';

export default function EZRecipeCaseStudy() {
  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-mono text-sm tracking-wide text-gray-900 font-medium hover:text-[#B5502F] transition-colors">
            MICHAEL BOBOV
          </Link>
          <Navigation />
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" tabIndex={-1} className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 focus:outline-none">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4"
        >
          Consumer • AI • 2025
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
        >
          EZ Recipe
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6"
        >
          Constraint-based recipe generation using ingredients, goals, and preferences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 mb-8"
        >
          <a
            href="https://ezrecipe.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#B5502F] hover:text-[#A84A2E] transition-colors font-medium"
        >
            <span>View Live Site</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* TL;DR */}
        <div className="max-w-4xl bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">TL;DR</h2>
          <dl className="grid md:grid-cols-3 gap-6 text-sm">
            <div><dt className="text-gray-900 font-medium mb-1">Problem</dt><dd className="text-gray-600">Recipe apps assume you’ll shop for the recipe. Home cooks need meals that fit what’s already in their kitchen, their time, and their goals.</dd></div>
            <div><dt className="text-gray-900 font-medium mb-1">What I did</dt><dd className="text-gray-600">As solo founder, designer, and full-stack developer, I researched, designed, and shipped an AI recipe generator built around six constraint questions in 2 months.</dd></div>
            <div><dt className="text-gray-900 font-medium mb-1">Outcome</dt><dd className="text-gray-600">Live at ezrecipe.app · 400+ recipes generated · 4.5/5 user rating · 67% faster perceived wait after a testing-driven fix.</dd></div>
          </dl>
        </div>

        {/* Project Details */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Role</p>
            <p className="text-gray-900">Founder</p>
            <p className="text-gray-900">Product Designer</p>
            <p className="text-gray-900">Full-Stack Developer</p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">2 months</p>
            <p className="text-gray-600 text-sm">Concept to launch</p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Team</p>
            <p className="text-gray-900">Solo Project</p>
            <p className="text-gray-600 text-sm">End-to-end ownership</p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Skills</p>
            <p className="text-gray-900">UX Research</p>
            <p className="text-gray-900">Product Design</p>
            <p className="text-gray-900">AI Integration</p>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <Image 
            src="/ezrecipelaptop.png"
            alt="EZ Recipe Platform"
            width={2400}
            height={1700}
            className="w-full h-auto -mt-8 md:-mt-32"
            sizes="(min-width: 1536px) 1376px, 100vw"
            priority
          />
        </motion.div>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Overview</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            EZ Recipe reframes cooking as solving for real-world constraints: ingredients on hand, dietary needs, time available, and cooking style.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Home cooks consistently struggle to figure out what to make with what they already have, and most recipe apps still assume you’ll shop for the recipe rather than cook from your pantry.
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Problem</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Home cooks struggle to make meals with what they already have. Recipe apps deliver endless static recipes with no connection to actual pantry contents.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">01</span>
              <div>
                <p className="text-gray-900 font-medium">Ingredient mismatches</p>
                <p className="text-gray-600 text-sm mt-1">Recipes require ingredients users don't have, forcing grocery trips or substitutions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">No constraint awareness</p>
                <p className="text-gray-600 text-sm mt-1">Apps don't consider dietary goals, time limits, or available ingredients.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">03</span>
              <div>
                <p className="text-gray-900 font-medium">Choice paralysis</p>
                <p className="text-gray-600 text-sm mt-1">Too many options without clear guidance leads to decision fatigue.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">04</span>
            <div>
                <p className="text-gray-900 font-medium">Food waste</p>
                <p className="text-gray-600 text-sm mt-1">Leftover ingredients go unused because there's no easy way to find recipes that use them.</p>
            </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-900 italic">"I have chicken, rice, and some vegetables. What can I make without going to the store?"</p>
            <p className="text-gray-500 text-sm mt-2">— Common user frustration</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Research</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            I analyzed Reddit communities and industry research to validate the opportunity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border-l-2 border-[#B5502F] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">User Communities</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li><span className="text-gray-900 font-medium">r/CookingForBeginners:</span> Overwhelmed by complex recipes</li>
                <li><span className="text-gray-900 font-medium">r/EatCheapAndHealthy:</span> Need help using leftover ingredients</li>
              </ul>
            </div>
            <div className="border-l-2 border-[#B5502F] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Market Signals</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Growing demand for simple, practical meal solutions</li>
                <li>• Users want recipes using ingredients they already have</li>
                <li>• Increased focus on eating at home to save money</li>
              </ul>
            </div>
            </div>
            
          {/* Competitive Analysis */}
          <div className="mb-8">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Competitive Analysis</p>
            <div className="flex justify-center">
                <Image 
                  src="/featurecompezrecipe.png"
                alt="EZ Recipe Feature Comparison"
                width={1514}
                height={999}
                className="max-w-3xl w-full h-auto"
                sizes="(min-width: 768px) 768px, 100vw"
                quality={95}
              />
            </div>
            </div>
            
            <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
            <p className="text-gray-900 text-lg">
              <span className="text-[#B5502F] font-medium">Constraint-based cooking</span> — Users want solutions that adapt to what they actually have, not recipes that require shopping trips.
              </p>
            </div>
        </motion.div>

        {/* Personas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Personas</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">Jessica, 36, is a working mother of two who wants to eat better, save money, and waste less food without planning elaborate meals.</p>
          
          <div className="flex justify-center">
                <Image 
                  src="/ezrecipepersona.png"
              alt="Persona: Jessica Rhomes, 36, working mother of two in California. Goals: cook healthy meals without constant grocery trips, stay on budget, reduce food waste. Frustrations: recipe apps assume she has everything on hand; time wasted scrolling irrelevant recipes. Needs: a fast way to turn fridge and pantry leftovers into full meals."
              width={960}
              height={540}
              className="max-w-3xl w-full h-auto"
              sizes="(min-width: 768px) 768px, 100vw"
              quality={95}
                />
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">User Journey</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Mapping Jessica's meal planning experience.
          </p>
          <div>
            <a href="/ezrecipejourneymap.png" target="_blank" rel="noopener noreferrer" className="block overflow-x-auto" aria-label="Open the user journey map at full size">
              <Image
                src="/ezrecipejourneymap.png"
                alt="EZ Recipe User Journey Map"
                width={5829}
                height={3561}
                className="max-w-3xl w-full h-auto mx-auto"
                sizes="(min-width: 768px) 768px, 100vw"
                quality={95}
              />
            </a>
            <p className="text-xs text-gray-500 mt-2">Open full size ↗</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Solution</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            A constraint-based questionnaire: input ingredients, set preferences, get AI-generated recipes that adapt to what you have.
            </p>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-gray-900 font-medium mb-2">Set Constraints</p>
              <p className="text-gray-600">Time of day → Cuisine → Servings → Time limit → Calories → Food style</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Input Ingredients</p>
              <p className="text-gray-600">Add manually or scan → Edit quantities → View available options</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Generate & Save</p>
              <p className="text-gray-600">AI generates personalized recipes → Review substitutions → Save favorites</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Design Principles</p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-gray-900 font-medium">Frictionless first-time use:</span> No logins, no long setup, just start cooking.</p>
              <p><span className="text-gray-900 font-medium">Constraint-aware layout:</span> Emphasize available ingredients and adjustable filters.</p>
              <p><span className="text-gray-900 font-medium">Mobile-friendly:</span> Designed for one-handed use in kitchen environments.</p>
                  </div>
                </div>
        </motion.div>
      </section>

      {/* Design Process */}
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl mb-12">
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Process</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            From sketches to high-fidelity prototypes.
                </p>
              </div>
              
        <div className="space-y-16">
          {/* Initial Sketches */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <h3 className="text-gray-900 font-medium text-lg mb-2">Initial Sketches</h3>
              <p className="text-gray-600">Exploring layout concepts and user flows with pen and paper.</p>
            </div>
            <div className="flex justify-center">
                    <Image 
                src="/ezrecipesketch.jpeg"
                alt="EZ Recipe Wireframe Sketch"
                width={2510}
                height={2926}
                className="max-w-3xl w-full h-auto"
                sizes="(min-width: 768px) 768px, 100vw"
                quality={95}
                    />
                  </div>
                </div>

          {/* Low-Fi Prototypes */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <h3 className="text-gray-900 font-medium text-lg mb-2">Lo-Fi Prototypes</h3>
              <p className="text-gray-600">Testing the constraint selection and recipe generation flow.</p>
                  </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <FullSizeLink src="/Home App.png" className="max-w-[200px] w-full">
                <Image src="/Home App.png" alt="EZ Recipe lo-fi wireframe: home screen" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/Sevings select.png" className="max-w-[200px] w-full">
                <Image src="/Sevings select.png" alt="EZ Recipe lo-fi wireframe: servings and preferences" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/View Recipe Saved.png" className="max-w-[200px] w-full">
                <Image src="/View Recipe Saved.png" alt="EZ Recipe lo-fi wireframe: recipe detail" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/Saved-1.png" className="max-w-[200px] w-full">
                <Image src="/Saved-1.png" alt="EZ Recipe lo-fi wireframe: saved recipes" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
            </div>
            <div className="max-w-4xl">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Testing Insights</p>
              <ul className="text-gray-600 space-y-2">
                <li>• Dropdown menus preferred over text input for constraints</li>
                <li>• Ingredient input needed autocomplete suggestions</li>
                <li>• Recipe cards needed clear visual hierarchy</li>
              </ul>
            </div>
          </div>

          {/* High-Fi Prototypes */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <h3 className="text-gray-900 font-medium text-lg mb-2">High-Fidelity Prototypes</h3>
              <p className="text-gray-600">Polished designs ready for development.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <FullSizeLink src="/HiFiHomeApp.png" className="max-w-[200px] w-full">
                <Image src="/HiFiHomeApp.png" alt="EZ Recipe hi-fi design: home screen" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/HiFiSevingsselect.png" className="max-w-[200px] w-full">
                <Image src="/HiFiSevingsselect.png" alt="EZ Recipe hi-fi design: servings and preferences" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/HiFiViewRecipe.png" className="max-w-[200px] w-full">
                <Image src="/HiFiViewRecipe.png" alt="EZ Recipe hi-fi design: recipe detail" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
              <FullSizeLink src="/HiFiSaved.png" className="max-w-[200px] w-full">
                <Image src="/HiFiSaved.png" alt="EZ Recipe hi-fi design: saved recipes" width={393} height={852} className="w-full h-auto" sizes="200px" quality={95} />
              </FullSizeLink>
            </div>
          </div>
        </div>
      </section>

      {/* User Testing */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-t border-gray-200"
        >
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">User Testing</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Testing the live product with real users.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-900 font-medium mb-2">Image loading bottleneck</p>
            <p className="text-gray-600">During family testing of the live platform, recipes were taking too long to generate because images were generating alongside the recipe text. We changed the flow so images load after the recipe is ready — reducing perceived wait time by 67% and improving satisfaction.</p>
          </div>
        </motion.div>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Decisions</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            Key decisions that shaped the product.
          </p>
          
          <div className="space-y-8">
            <div>
              <p className="text-gray-900 font-medium mb-2">Why 6 constraint questions instead of fewer?</p>
              <p className="text-gray-600">Users have diverse needs. Some care about calories, others about cuisine. Six questions with smart defaults let users customize without overwhelming first-time users.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why AI generation instead of a recipe database?</p>
              <p className="text-gray-600">Databases can't adapt to arbitrary ingredient combinations. AI generates unique recipes for any pantry, eliminating the "no results found" dead end.</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Outcomes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">400+</p>
              <p className="text-gray-600 text-sm">Recipes generated</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">4.5/5</p>
              <p className="text-gray-600 text-sm">User rating</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">67%</p>
              <p className="text-gray-600 text-sm">Faster perceived wait</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#B5502F] mb-2">85%</p>
              <p className="text-gray-600 text-sm">Easy save/retrieve</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            What I learned building this product.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#B5502F]">01</span> Great tools reduce decisions without reducing control</p>
              <p className="text-gray-600 mt-1">By narrowing input fields and focusing outputs, EZ Recipe creates confidence, not choice paralysis.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#B5502F]">02</span> Constraint-based design works</p>
              <p className="text-gray-600 mt-1">Users want solutions that adapt to their reality, not recipes that require perfect conditions.</p>
                </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#B5502F]">03</span> Real user testing reveals bottlenecks</p>
              <p className="text-gray-600 mt-1">Testing with family on the live product uncovered the image generation bottleneck that wouldn't have been obvious in prototype testing. Real usage surfaces real problems.</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">01</span>
              <p className="text-gray-600">User login and meal history tracking</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">02</span>
              <p className="text-gray-600">Expanded support for allergies and intolerances</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">03</span>
              <p className="text-gray-600">Improved mobile scanning features</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#B5502F] font-mono text-sm">04</span>
              <p className="text-gray-600">Export-to-grocery list function</p>
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
          <h2 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</h2>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            EZ Recipe challenged me to think not just as a designer, but as a home cook, nutrition-aware user, and product strategist.
          </p>
          <p className="text-gray-600 leading-relaxed">
            It taught me to embrace constraint-based design and create systems that guide without dictating. What started as a design case study is now a live application serving real users at <a href="https://ezrecipe.app" target="_blank" rel="noopener noreferrer" className="text-[#B5502F] hover:text-[#A84A2E] underline">ezrecipe.app</a>.
          </p>
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="text-gray-600 hover:text-[#B5502F] transition-colors flex items-center gap-2">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <Link href="/work/versum" className="text-gray-600 hover:text-[#B5502F] transition-colors">Next: Versum Health →</Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            className="text-gray-600 hover:text-[#B5502F] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </section>
      </main>
    );
} 
