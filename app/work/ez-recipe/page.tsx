'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';

export const dynamic = 'force-dynamic';

export default function EZRecipeCaseStudy() {
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
          className="mb-12"
        >
          <a
            href="https://ezrecipe.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C75B3B] hover:text-[#A84A2E] transition-colors font-medium"
          >
            <span>View Live Site</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

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
            <p className="text-gray-900">Founder</p>
            <p className="text-gray-900">Product Designer</p>
            <p className="text-gray-900">Full-Stack Developer</p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-gray-900">4 months</p>
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
        <div className="text-center">
          <a
            href="https://ezrecipe.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C75B3B] hover:text-[#A84A2E] transition-colors font-medium"
          >
            <span>ezrecipe.app</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
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
            EZ Recipe reframes cooking as solving for real-world constraints: ingredients on hand, dietary needs, time available, and cooking style.
          </p>
          <p className="text-gray-600 leading-relaxed">
            I built this while developing Chefie, my health-tracking app. Users consistently struggled to know what to cook with what they already had. Despite the explosion of home cooking since COVID-19, recipe apps hadn't evolved to fit real-life constraints.
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
            Home cooks struggle to make meals with what they already have. Recipe apps deliver endless static recipes with no connection to actual pantry contents.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">01</span>
              <div>
                <p className="text-gray-900 font-medium">Ingredient mismatches</p>
                <p className="text-gray-600 text-sm mt-1">Recipes require ingredients users don't have, forcing grocery trips or substitutions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <div>
                <p className="text-gray-900 font-medium">No constraint awareness</p>
                <p className="text-gray-600 text-sm mt-1">Apps don't consider dietary goals, time limits, or available ingredients.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <div>
                <p className="text-gray-900 font-medium">Choice paralysis</p>
                <p className="text-gray-600 text-sm mt-1">Too many options without clear guidance leads to decision fatigue.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
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
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Research</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            I analyzed Reddit communities and industry research to validate the opportunity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">User Communities</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li><span className="text-gray-900 font-medium">r/CookingForBeginners:</span> Overwhelmed by complex recipes</li>
                <li><span className="text-gray-900 font-medium">r/EatCheapAndHealthy:</span> Need help using leftover ingredients</li>
              </ul>
            </div>
            <div className="border-l-2 border-[#C75B3B] pl-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Market Signals</p>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 61% looking for simple, practical meal solutions</li>
                <li>• 60% want recipes using ingredients they have</li>
                <li>• 78% eating at home more to save money</li>
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
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">Key Insight</p>
            <p className="text-gray-900 text-lg">
              <span className="text-[#C75B3B] font-medium">Constraint-based cooking</span> — Users want solutions that adapt to what they actually have, not recipes that require shopping trips.
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
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Personas</p>
          
          <div className="flex justify-center mb-6">
            <Image
              src="/ezrecipepersona.png"
              alt="EZ Recipe Persona"
              width={1920}
              height={1280}
              className="max-w-3xl w-full h-auto"
              quality={95}
            />
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-[#C75B3B] font-mono text-xs uppercase tracking-widest mb-2">The Constraint-Based Home Cook</p>
            <p className="text-xl text-gray-900 mb-4">Jessica, 38</p>
            <div className="space-y-3 text-gray-600 text-sm">
              <p><span className="text-gray-900">Situation:</span> Working mother with limited time, variable pantry, diverse family tastes</p>
              <p><span className="text-gray-900">Goal:</span> Cook healthy meals using what's already in the kitchen</p>
              <p><span className="text-gray-900">Frustration:</span> "Recipe apps show me things I can't make with what I have"</p>
              <p><span className="text-gray-900">Needs:</span> Quick recipe generation, dietary preferences, ingredient flexibility</p>
            </div>
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
            Mapping Jessica's meal planning experience.
          </p>
          <div className="flex justify-center">
            <Image
              src="/ezrecipejourneymap.png"
              alt="EZ Recipe User Journey Map"
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
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Design Process</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
            From sketches to high-fidelity prototypes.
          </p>
        </div>
        
        <div className="space-y-16">
          {/* Initial Sketches */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Initial Sketches</p>
              <p className="text-gray-600">Exploring layout concepts and user flows with pen and paper.</p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/ezrecipesketch.jpeg"
                alt="EZ Recipe Wireframe Sketch"
                width={1920}
                height={1280}
                className="max-w-3xl w-full h-auto"
                quality={95}
              />
            </div>
          </div>

          {/* Low-Fi Prototypes */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-6">
              <p className="text-gray-900 font-medium text-lg mb-2">Lo-Fi Prototypes</p>
              <p className="text-gray-600">Testing the constraint selection and recipe generation flow.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Image src="/Home App.png" alt="Home Screen" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Sevings select.png" alt="Preferences" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/View Recipe Saved.png" alt="Recipe Detail" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/Saved-1.png" alt="Saved Recipes" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
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
              <p className="text-gray-900 font-medium text-lg mb-2">High-Fidelity Prototypes</p>
              <p className="text-gray-600">Polished designs ready for development.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Image src="/HiFiHomeApp.png" alt="Home Hi-Fi" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/HiFiSevingsselect.png" alt="Preferences Hi-Fi" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/HiFiViewRecipe.png" alt="Recipe Hi-Fi" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
              <Image src="/HiFiSaved.png" alt="Saved Hi-Fi" width={1920} height={1280} className="max-w-[200px] w-full h-auto" quality={95} />
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
            <div>
              <p className="text-gray-900 font-medium mb-2">Why no account required for first use?</p>
              <p className="text-gray-600">Friction kills conversion. Users get value immediately, then optionally sign up to save favorites. The product proves itself before asking for commitment.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-2">Why show text before images in recipe results?</p>
              <p className="text-gray-600">AI-generated images take time. Showing recipe text first reduced perceived wait time by 67% in testing. Users start reading while images load.</p>
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
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">400+</p>
              <p className="text-gray-600 text-sm">Recipes generated</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">4.5/5</p>
              <p className="text-gray-600 text-sm">User rating</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">67%</p>
              <p className="text-gray-600 text-sm">Faster perceived wait</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-[#C75B3B] mb-2">85%</p>
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
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Learnings</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            What I learned building this product.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">01</span> Great tools reduce decisions without reducing control</p>
              <p className="text-gray-600 mt-1">By narrowing input fields and focusing outputs, EZ Recipe creates confidence, not choice paralysis.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">02</span> Constraint-based design works</p>
              <p className="text-gray-600 mt-1">Users want solutions that adapt to their reality, not recipes that require perfect conditions.</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium"><span className="text-[#C75B3B]">03</span> Perceived speed matters more than actual speed</p>
              <p className="text-gray-600 mt-1">Showing text before images reduced perceived wait time by 67%, even though total load time was unchanged.</p>
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
              <p className="text-gray-600">User login and meal history tracking</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">02</span>
              <p className="text-gray-600">Expanded support for allergies and intolerances</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">03</span>
              <p className="text-gray-600">Improved mobile scanning features</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#C75B3B] font-mono text-sm">04</span>
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
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Final Thoughts</p>
          <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-8">
            EZ Recipe challenged me to think not just as a designer, but as a home cook, nutrition-aware user, and product strategist.
          </p>
          <p className="text-gray-600 leading-relaxed">
            It taught me to embrace constraint-based design and create systems that guide without dictating. What started as a design case study is now a live application serving real users at <a href="https://ezrecipe.app" target="_blank" rel="noopener noreferrer" className="text-[#C75B3B] hover:text-[#A84A2E] underline">ezrecipe.app</a>.
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
