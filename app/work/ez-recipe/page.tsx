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
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className={`text-4xl font-light ${dancingScript.className} text-black hover:text-black/90 transition-colors`}>
            mb.
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
          className="text-lg text-center mb-24 text-gray-500 italic"
        >
          A comprehensive recipe and meal planning solution that adapts to your ingredients and dietary needs.
        </motion.p>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden mb-24 max-w-5xl mx-auto"
        >
          <Image 
            src="/ezrecipeappinterface.png"
            alt="EZ Recipe App Interface"
            width={1200}
            height={675}
            className="w-full rounded-2xl"
          />
        </motion.div>

        {/* Project Overview Section */}
        <motion.section
          ref={setSectionRef('overview')}
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            🎯 Project Summary
          </h2>
          <div className="space-y-8">
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
                This is a solo project, designed and developed end-to-end.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                  Product Designer (UX/UI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                  UX Researcher
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                  Frontend Developer (HTML/CSS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                  AI Integrator (OpenAI API)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            🔍 Design Process
          </h2>
          
          {/* Step 1: Empathize & Research */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">1. Empathize & Research</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Behavior Research</h4>
              <p className="text-gray-600 leading-relaxed">
                I analyzed hundreds of authentic user discussions on platforms like Reddit's r/EatCheapAndHealthy, r/CookingForBeginners, and r/Fitness. These conversations highlighted recurring frustrations: users often felt overwhelmed by recipe complexity, struggled with ingredient mismatches, and were unsure how to transform their existing groceries into satisfying meals. Many expressed a desire for straightforward, adaptable cooking solutions that respect their time and resources.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Market Trends & Industry Reports</h4>
              <p className="text-gray-600 leading-relaxed">
                I reviewed studies from 2020 through 2023 from trusted sources such as the Food Industry Association and Statista, which demonstrated a sharp rise in home cooking habits following the COVID-19 pandemic. While some predicted this surge would be temporary, data showed sustained engagement driven by economic inflation, increased health consciousness, and a preference for convenience. This created a ripe market for tools that support smarter, simpler home cooking.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Competitive Landscape Analysis</h4>
              <p className="text-gray-600 leading-relaxed">
                I audited popular cooking and recipe apps including Mealime, Yummly, Tasty, and Paprika. While these tools offered large recipe databases and some personalization, most assumed users had complete pantries or required extensive setup. Few addressed the core user need: generating recipes dynamically based on limited, existing ingredients combined with dietary goals and family preferences.
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
            
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">Problem Statement</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                The research highlighted a major gap: most users weren't looking for recipe inspiration — they were seeking solutions based on constraints. Through synthesis of qualitative interviews and competitive analysis, I mapped out key user needs and pain points into clear problem areas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                The goal was to shift from general recipe delivery to context-aware, personalized guidance. Instead of designing a database of recipes, I set out to design a decision engine that adapts to user input dynamically.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-medium mb-4 text-gray-900">Problem Statement</h4>
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
            <p className="text-gray-600 leading-relaxed mb-4">
              I structured the app around 4 core questions: What's your goal? (Healthy or indulgent), Calorie target? (Low, Medium, High), Protein level? (Low, Medium, High), and Cuisine preference? (American, Vegan, Chinese, etc.)
            </p>
            <p className="text-gray-600 leading-relaxed">
              This short questionnaire feeds into the ingredient editor. Users can input ingredients manually or scan fridge lists, edit quantities and remove items, and view AI-generated meals instantly.
            </p>
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
            <p className="text-gray-600 leading-relaxed">
              All designs were prototyped in Figma, tested for responsiveness, and later developed in HTML/CSS for iteration.
            </p>

            {/* Lo-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Lo-Fi Prototype</h4>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">[Insert Lo-Fi Prototype: Wireframes showing initial user flow and interface structure]</p>
              </div>
            </div>

            {/* Hi-Fi Prototype */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">Hi-Fi Prototype</h4>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">[Insert Hi-Fi Prototype: Final polished interface designs and interactions]</p>
              </div>
            </div>

            {/* Demo GIF */}
            <div className="mt-12">
              <h4 className="text-lg font-medium mb-6 text-gray-900">How It Works</h4>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">[Insert 5-second GIF: Demo showing the complete user flow from ingredient input to recipe generation]</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-900">User Experience Flow</h4>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>User inputs available ingredients and dietary preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>AI analyzes ingredients and generates personalized recipe suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>User selects a recipe and views step-by-step instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFB800] text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <span>Recipe adapts in real-time based on available ingredients and substitutions</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Step 5: Test */}
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold text-gray-900">5. Test & Iterate</h3>
            <p className="text-gray-600 leading-relaxed">
              User testing with 5–7 participants is scheduled for July 2025. Testing goals include ease of ingredient entry, relevance and clarity of generated recipes, trust in substitutions and macro logic, and overall satisfaction and confidence in using the tool.
            </p>
          </div>
        </motion.section>

        {/* Technical Implementation */}
        <motion.section
          ref={setSectionRef('technical')}
          id="technical"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Build Process
          </h2>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Frontend:</strong> HTML, CSS, Tailwind</li>
              <li><strong>Prototype:</strong> Interactive logic built with GPT-4</li>
              <li><strong>Planned:</strong> OpenAI prompt tuning for meal logic, calorie integration from USDA food database</li>
              <li><strong>Hosting:</strong> Local dev for now, Vercel deployment planned for public alpha</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              The architecture is modular, with future expansion into voice input, barcode scanning, and API-based grocery syncing.
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
          className="max-w-4xl mx-auto mb-24"
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
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Impact (So Far)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Even in its early stages, EZ Recipe has already helped:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Test users meal prep with confidence using limited groceries</li>
            <li>Simplify healthy eating for fitness-focused users</li>
            <li>Inspire a direction for future food waste reduction tools</li>
          </ul>
        </motion.section>

        {/* Reflection Section */}
        <motion.section
          ref={setSectionRef('reflection')}
          id="reflection"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl text-[#FFB800] font-medium mb-8 uppercase tracking-wide">
            Reflection
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EZ Recipe challenged me to think not just as a designer, but as a home cook, a nutrition-aware user, and a product strategist. It taught me to embrace constraint-based design and create systems that <em>guide without dictating</em>.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            The next stage is launching the MVP, testing real workflows, and iterating into something that truly adapts to modern kitchens and users' evolving lives.
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
          className="max-w-4xl mx-auto mb-24"
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

        {/* Sidebar Navigation */}
        <nav className="fixed left-0 top-1/2 -translate-y-1/2 h-auto w-64 hidden md:block">
          <div className="flex flex-col gap-4 py-8 pr-8 pl-4 border-r border-gray-200">
            {['overview', 'design', 'build', 'challenges', 'future', 'impact', 'reflection'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section 
                    ? 'bg-yellow-50 text-[#FFB800] font-medium border-l-4 border-[#FFB800]' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {section === 'overview' && 'Overview'}
                {section === 'design' && 'Design Process'}
                {section === 'build' && 'Build Process'}
                {section === 'challenges' && 'Challenges & Lessons Learned'}
                {section === 'future' && 'Future Improvements'}
                {section === 'impact' && 'Impact (So Far)'}
                {section === 'reflection' && 'Reflection'}
              </button>
            ))}
          </div>
        </nav>
      </main>
    );
} 