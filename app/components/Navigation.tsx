'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isWorkPage = pathname.startsWith('/work/');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Work Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work</h3>
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <Link
                          key={project.href}
                          href={project.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.label}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {project.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* About Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                    <div className="space-y-3">
                      <Link
                        href="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          About Me
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Learn more about my background
                        </div>
                      </Link>
                      <a
                        href="/Michael Bobov - Product Designer.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          Resume
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Take a look at my resume
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
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