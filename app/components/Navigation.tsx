'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (isWorkDropdownOpen) setIsWorkDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWorkDropdownOpen(false);
      }
    };

    if (isWorkDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWorkDropdownOpen]);

  const navLinks = [
    { href: '/#work', label: 'WORK' },
  ];

  const projects = [
    { href: '/work/versum', label: 'Versum Health' },
    { href: '/work/pdf-penguin', label: 'PDF Penguin' },
    { href: '/work/spotify-loop', label: 'Spotify Loop' },
    { href: '/work/ez-recipe', label: 'EZ Recipe' },
  ];

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            id="mobile-menu"
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-80 max-w-[88vw] bg-[#FAFAF8] shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <span className="font-mono text-sm tracking-wide text-gray-900 font-medium">MENU</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                    type="button"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Main Links */}
                  <div className="space-y-4">
                    <Link
                      href="/#work"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block font-mono text-sm text-[#C75B3B] hover:text-[#A84A2E] transition-colors"
                    >
                      WORK
                    </Link>
                    <a
                      href="/Michael Bobov - Product Designer.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      RESUME
                    </a>
                    </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200" />

                  {/* Projects */}
                  <div>
                    <span className="font-mono text-xs text-gray-400 tracking-wide">PROJECTS</span>
                    <div className="mt-3 space-y-3">
                      {projects.map((project) => (
                        <Link
                          key={project.href}
                          href={project.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-700 hover:text-[#C75B3B] transition-colors"
                        >
                              {project.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <span className="font-mono text-xs text-gray-400">© {new Date().getFullYear()} Michael Bobov</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Hamburger Button Component
  const HamburgerButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Open menu"
      type="button"
    >
      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  if (!mounted) {
    return (
      <div className="flex items-center gap-8">
        <HamburgerButton />
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <span key={link.href} className="font-mono text-sm text-gray-600">{link.label}</span>
          ))}
          <span className="font-mono text-sm text-gray-600">RESUME</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-8">
        <HamburgerButton />
        <div className="hidden lg:flex items-center gap-8">
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsWorkDropdownOpen(true)}
            onMouseLeave={() => setIsWorkDropdownOpen(false)}
          >
            <button
              onClick={() => setIsWorkDropdownOpen(!isWorkDropdownOpen)}
              className="font-mono text-sm text-[#C75B3B] hover:text-[#A84A2E] transition-colors flex items-center gap-1"
            >
              WORK
              <svg 
                className={`w-4 h-4 transition-transform ${isWorkDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isWorkDropdownOpen && (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
      >
                  {projects.map((project) => (
                    <Link
                      key={project.href}
                      href={project.href}
                      onClick={() => setIsWorkDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C75B3B] transition-colors"
                    >
                      {project.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a 
            href="/Michael Bobov - Product Designer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            RESUME
          </a>
        </div>
      </div>
      <MobileMenu />
    </>
  );
} 
