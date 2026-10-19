'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="mailto:michaelbobov@gmail.com"
            className="hover:text-white transition-colors"
          >
            michaelbobov@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/michael-bobov-94b61b202/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </motion.footer>
  );
}











