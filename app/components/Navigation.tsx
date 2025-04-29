'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navLinks = [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  if (isHome) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex space-x-12"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-4xl font-light text-gray-700 hover:text-gray-900 transition-colors font-brush">
        mb.
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex space-x-8"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-gray-600 hover:text-gray-900 transition-colors ${
              pathname === link.href ? 'text-gray-900' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </div>
  );
} 