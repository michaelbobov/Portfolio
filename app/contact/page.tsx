'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import { Dancing_Script } from 'next/font/google';
import WavyBackground from '../components/WavyBackground';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <main className="relative">
      <WavyBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex justify-between items-center mb-32">
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { duration: 0.5 }
              }}
              className="hover:opacity-90 transition-opacity"
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
      </div>
    </main>
  );
} 