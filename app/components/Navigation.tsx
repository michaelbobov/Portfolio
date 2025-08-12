'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isWorkPage = pathname.startsWith('/work/');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const projects = [
    { href: '/work/pdf-penguin', label: 'PDF Penguin' },
    { href: '/work/spotify-loop', label: 'Spotify Loop' },
    { href: '/work/ez-recipe', label: 'EZ Recipe' },
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
    const isWorkLink = link.label === 'Work';
    const href = isWorkLink ? '/#work' : link.href;
    // Smooth scroll if on homepage
    const handleWorkClick = (e: React.MouseEvent) => {
      if (isWorkLink && pathname === '/') {
        e.preventDefault();
        const el = document.getElementById('work');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // If not on homepage, let Next.js handle navigation
    };
    
    const textColorClass = isWorkPage 
      ? 'text-black/80 hover:text-black' 
      : 'text-white/80 hover:text-white';
    const activeColorClass = isWorkPage 
      ? 'text-black' 
      : 'text-white';
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredLink(link.href)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <Link
          href={href}
          onClick={handleWorkClick}
          className={`${textColorClass} transition-colors ${
            (pathname === link.href || (isWorkLink && pathname === '/' && typeof window !== 'undefined' && window.location.hash === '#work')) ? activeColorClass : ''
          }`}
        >
          {link.label}
        </Link>
        {/* Improved hover bridge and dropdown structure */}
        {link.hasDropdown && hoveredLink === link.href && (
          <>
            <div
              className="absolute left-0 top-full w-full h-6 z-10"
              style={{ pointerEvents: 'auto' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full pt-2 w-48 z-20"
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl py-2">
                {link.dropdownItems?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 ${isWorkPage ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'} hover:bg-white/10 transition-colors`}
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
  );
} 