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
        <p className="text-gray-400 text-sm mb-2">
          © 2024 Michael Bobov. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm">
          <a 
            href="mailto:michaelbobov@gmail.com" 
            className="hover:text-white transition-colors"
          >
            michaelbobov@gmail.com
          </a>
        </p>
      </div>
    </motion.footer>
  );
}











