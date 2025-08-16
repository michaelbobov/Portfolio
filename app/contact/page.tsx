'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from '../components/WavyBackground';
import { useState } from 'react';
import Link from 'next/link';

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    window.location.href = `mailto:michaelbobov@gmail.com?subject=Contact from Portfolio: ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen relative">
      <WavyBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex justify-between items-center mb-32">
          <Link href="/">
            <motion.h1 
              className={`text-4xl font-light ${dancingScript.className} text-white hover:text-white/90 transition-colors`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { duration: 0.5 }
              }}
            >
              MB
            </motion.h1>
          </Link>
          <Navigation />
        </div>

        <div className="flex flex-col items-center justify-center">
          <main className="w-full max-w-lg bg-white/80 rounded-xl shadow-xl p-8 mt-4 backdrop-blur-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Contact Me</h1>
            {submitted ? (
              <div className="text-green-600 text-center font-semibold">Thank you for reaching out! Please check your email client to send the message.</div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={5}
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] text-white font-semibold py-3 rounded shadow hover:opacity-90 transition"
                >
                  Send Email
                </button>
              </form>
            )}
          </main>
        </div>

        {/* Book a Call Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white/80 rounded-xl shadow-xl p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Book a Call</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Prefer to chat? I'm available for portfolio reviews, design discussions, or just to connect. 
              Let's find a time that works for both of us.
            </p>
            <div className="text-center">
              <a
                href="https://cal.com/mbobov/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
              >
                Schedule a Call
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 