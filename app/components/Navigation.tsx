'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const projects = [
    { href: '/work/pdf-penguin', label: 'PDF Penguin' },
    { href: '/work/emotionwell', label: 'EmotionWell' },
  ];

  const navLinks = [
    { 
      href: '/work', 
      label: 'Work',
      hasDropdown: true,
      dropdownItems: projects
    },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const NavLink = ({ link }: { link: typeof navLinks[0] }) => {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredLink(link.href)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <Link
          href={link.href}
          className={`text-white/80 hover:text-white transition-colors ${
            pathname === link.href ? 'text-white' : ''
          }`}
        >
          {link.label}
        </Link>
        {link.hasDropdown && hoveredLink === link.href && (
          <>
            {/* Invisible hover bridge */}
            <div className="absolute -bottom-2 left-0 w-full h-2" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full pt-2 w-48"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl py-2">
                {link.dropdownItems?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    );
  };

  if (isHome) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex space-x-12"
      >
        {navLinks.map((link) => (
          <NavLink key={link.href} link={link} />
        ))}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-4xl font-light text-white hover:text-white/90 transition-colors font-brush">
        mb.
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex space-x-8"
      >
        {navLinks.map((link) => (
          <NavLink key={link.href} link={link} />
        ))}
      </motion.div>
    </div>
  );
} 