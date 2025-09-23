'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isWorkPage = pathname.startsWith('/work/');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Focus trap when menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'))
      : [];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        previouslyFocused?.focus();
      }
      if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const projects = [
    { href: '/work/pdf-penguin', label: 'PDF Penguin', description: 'AI PDF to JSON conversion' },
    { href: '/work/spotify-loop', label: 'Spotify Loop', description: 'Music segment looping feature' },
    { href: '/work/ez-recipe', label: 'EZ Recipe', description: 'Smart recipe & meal planning' },
  ];

  const navLinks = [
    { 
      href: '/work', 
      label: 'Work',
      hasDropdown: true,
      dropdownItems: projects
    },
    { 
      href: '/about', 
      label: 'About',
      hasDropdown: true,
      dropdownItems: [
        { href: '/resume.pdf', label: 'Resume', description: 'Take a look at my resume' }
      ]
    }
  ];

  const NavLink = ({ link }: { link: typeof navLinks[0] }) => {
    const isWorkLink = link.label === 'Work';
    const href = isWorkLink ? '/#work' : link.href;
    
    const handleWorkClick = (e: React.MouseEvent) => {
      if (isWorkLink && pathname === '/') {
        e.preventDefault();
        const el = document.getElementById('work');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    const textColorClass = isWorkPage 
      ? 'text-black/80 hover:text-black' 
      : 'text-white/80 hover:text-white';
    const activeColorClass = isWorkPage 
      ? 'text-black' 
      : 'text-white';
    
    const isActive = pathname === link.href || (isWorkLink && pathname === '/' && mounted && window.location.hash === '#work');
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredLink(link.href)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <Link
          href={href}
          onClick={handleWorkClick}
          className={`${textColorClass} transition-colors ${isActive ? activeColorClass : ''}`}
        >
          {link.label}
        </Link>
        
        {link.hasDropdown && hoveredLink === link.href && link.dropdownItems && mounted && (
          <div className="absolute left-0 top-full pt-2 w-40 md:w-48 z-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl py-2"
            >
              {link.dropdownItems.map((item) => {
                // Special handling for resume to open in new tab
                if (item.href === '/resume.pdf') {
                  return (
                    <a
                      key={item.href}
                      href="/Michael Bobov - Product Designer.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block px-3 md:px-4 py-2 text-sm md:text-base ${isWorkPage ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'} hover:bg-white/10 transition-colors`}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 md:px-4 py-2 text-sm md:text-base ${isWorkPage ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'} hover:bg-white/10 transition-colors`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-80 max-w-[88vw] bg-white shadow-2xl border-l border-gray-100"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="relative border-b border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white" />
                <div className="relative flex items-center justify-between p-6 pt-[max(1rem,env(safe-area-inset-top))]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-sm">
                      <span className="text-sm font-semibold">MB</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Michael Bobov</div>
                      <div className="text-xs text-gray-500">Product Designer</div>
                    </div>
                  </div>
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
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-6">
                  {/* Work Section */}
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900 tracking-wide">Work</h3>
                      <div className="mt-2 h-[3px] bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                    </div>
                    <div className="divide-y divide-gray-100">
                      {projects.map((project) => (
                        <Link
                          key={project.href}
                          href={project.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div>
                            <div className="font-normal text-gray-800 group-hover:text-blue-600 transition-colors">
                              {project.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {project.description}
                            </div>
                          </div>
                          
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900 tracking-wide">About</h3>
                      <div className="mt-2 h-[3px] bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                    </div>
                    <div className="divide-y divide-gray-100">
                      <Link
                        href="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div>
                          <div className="font-normal text-gray-800 group-hover:text-blue-600 transition-colors">
                            About Me
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Learn more about my background
                          </div>
                        </div>
                        
                      </Link>
                      <a
                        href="/Michael Bobov - Product Designer.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div>
                          <div className="font-normal text-gray-800 group-hover:text-blue-600 transition-colors">
                            Resume
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Take a look at my resume
                          </div>
                        </div>
                        
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 border-t border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="text-xs text-gray-500">© {new Date().getFullYear()} Michael Bobov</div>
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked!'); // Debug log
        setIsMobileMenuOpen(true);
      }}
      className="lg:hidden p-3 rounded-lg hover:bg-white/20 transition-colors z-50 relative cursor-pointer touch-manipulation"
      aria-label="Open menu"
      aria-haspopup="dialog"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
      type="button"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  if (!mounted) {
    return (
      <div className="flex items-center space-x-4 relative z-50">
        <HamburgerButton />
        <div className="hidden lg:flex space-x-6 lg:space-x-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-white transition-colors text-sm md:text-base">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (isHome) {
    return (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-4 relative z-50"
        >
          <HamburgerButton />
          <div className="hidden lg:flex space-x-8 lg:space-x-12">
            {navLinks.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </div>
        </motion.div>
        <MobileMenu />
      </>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4 relative z-50"
      >
        <HamburgerButton />
        <div className="hidden lg:flex space-x-6 lg:space-x-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} link={link} />
          ))}
        </div>
      </motion.div>
      <MobileMenu />
    </>
  );
} 