'use client';

import React from 'react';
import Navigation from '@/app/components/Navigation';
import WavyBackground from '../components/WavyBackground';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="relative">
      <WavyBackground />

      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="flex justify-between items-center mb-16">
          <Link href="/">
            <div className="hover:opacity-90 transition-opacity">
              <img 
                src="/whiteinitals.png"
                alt="MB - Michael Bobov"
                className="w-16 h-16"
              />
            </div>
          </Link>
          <Navigation />
        </div>

                {/* Hero Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
              {/* Left Side - Text */}
              <div className="flex-1">
                                                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                   About Me
                 </h1>
                 <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                   Hi! My name is Michael. I'm a Product Designer with a focus on creating not just concepts, but real, functioning products. My process goes beyond Figma — I design, build, and iterate quickly by leveraging AI as both a creative partner and a development accelerator. This allows me to move from idea to working prototype faster than traditional design cycles, giving me the freedom to test, refine, and push boundaries in real time.
                 </p>
                 <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mt-4">
                   My goal as a product designer is to help shape the future of how humans interact with technology. Just like the first mobile apps set the standard for how people learned to navigate phones, I want to design the next generation of experiences—whether that's through ai agents living on our phones, augmented reality, wearables, or technologies we haven't fully imagined yet. I see design not just as making interfaces usable, but as creating the bridges that make new technology feel natural and intuitive.
                 </p>

              </div>
              
                             {/* Right Side - Michael Bobov Image */}
               <div className="flex-shrink-0 -mt-16 md:-mt-24 lg:-mt-32">
                 <img 
                   src="/IMG_8226.jpg"
                   alt="Michael Bobov"
                   className="w-64 h-64 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] object-cover border-4 border-white rounded-full shadow-2xl"
                 />
               </div>
            </div>
          </div>
        </section>



        {/* Bringing Ideas to Life Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                {/* Left Side - Bulb Image */}
                <div className="flex-1 flex justify-center">
                  <img 
                    src="/bulb.png"
                    alt="Lightbulb representing ideas"
                    className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
                  />
                </div>
                
                {/* Right Side - Content */}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#4A3F8C] mb-8">
                    Bringing ideas to life
                  </h2>
                  
                  <ul className="space-y-4 text-gray-700 text-base md:text-lg">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#4A3F8C] rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      Crafting user journeys and clean interfaces
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#4A3F8C] rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      Fast iteration and prototyping
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#4A3F8C] rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      Integrating AI into human-first design
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#4A3F8C] rounded-full mt-3 mr-4 flex-shrink-0"></span>
                      Building products that are both functional and delightful
                    </li>
              </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section>
          <p className="text-white text-lg md:text-xl font-medium text-center">
            Let's connect and build something meaningful together.
          </p>
        </section>
      </div>
    </main>
  );
}


