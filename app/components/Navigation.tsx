'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const workButtonRef = useRef<HTMLButtonElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasMobileMenuOpen = useRef(false);

  // Make everything behind the open mobile menu inert
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    // Walk up from the menu and mark every sibling along the way, so only the menu stays live
    const background: Element[] = [];
    let node: Element | null = overlayRef.current;
    while (node && node !== document.body) {
      const parent: Element | null = node.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== node && !sibling.hasAttribute('inert')) background.push(sibling);
      }
      node = parent;
    }
    background.forEach((el) => el.setAttribute('inert', ''));
    return () => {
      background.forEach((el) => el.removeAttribute('inert'));
    };
  }, [isMobileMenuOpen]);

  // Close the mobile menu if the viewport grows past the lg breakpoint
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
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

  // Move focus into the mobile menu when it opens, and back to the hamburger when it closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      closeButtonRef.current?.focus();
    } else if (wasMobileMenuOpen.current) {
      hamburgerRef.current?.focus({ preventScroll: true });
    }
    wasMobileMenuOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsWorkDropdownOpen(false);
  }, [pathname]);

  // Close mobile menu and dropdown on Escape
  useEffect(() => {
    if (!isMobileMenuOpen && !isWorkDropdownOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Return focus to WORK if it was inside the dropdown
        if (isWorkDropdownOpen && dropdownRef.current?.contains(document.activeElement)) {
          workButtonRef.current?.focus();
        }
        setIsMobileMenuOpen(false);
        setIsWorkDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, isWorkDropdownOpen]);

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

  const projects = [
    { href: '/work/versum', label: 'Versum Health' },
    { href: '/work/pdf-penguin', label: 'PDF Penguin' },
    { href: '/work/spotify-loop', label: 'Spotify Loop' },
    { href: '/work/ez-recipe', label: 'EZ Recipe' },
  ];

  // Keep Tab / Shift+Tab inside the mobile menu panel
  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  };

  // Close the dropdown when keyboard focus moves outside it
  const handleDropdownBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !event.currentTarget.contains(next)) {
      setIsWorkDropdownOpen(false);
    }
  };

  // Mobile menu
  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          ref={overlayRef}
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
            aria-labelledby="mobile-menu-title"
            id="mobile-menu"
            ref={panelRef}
            onKeyDown={handlePanelKeyDown}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-80 max-w-[88vw] bg-[#FAFAF8] shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <span id="mobile-menu-title" className="font-mono text-sm tracking-wide text-gray-900 font-medium">MENU</span>
                  <button
                    ref={closeButtonRef}
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
                      className="block font-mono text-sm text-[#B5502F] hover:text-[#A84A2E] transition-colors"
                    >
                      WORK
                    </Link>
                    <a
                      href="https://about.michaelbobov.com/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      ABOUT
                    </a>
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
                    <span className="font-mono text-xs text-gray-500 tracking-wide">PROJECTS</span>
                    <div className="mt-3 space-y-3">
                      {projects.map((project) => (
                        <Link
                          key={project.href}
                          href={project.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-700 hover:text-[#B5502F] transition-colors"
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
                <span className="font-mono text-xs text-gray-500">© {new Date().getFullYear()} Michael Bobov</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Hamburger button
  const hamburgerButton = (
    <button
      ref={hamburgerRef}
      onClick={() => setIsMobileMenuOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Open menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
      type="button"
    >
      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  return (
    <>
      <div className="flex items-center gap-8">
        {hamburgerButton}
        <div className="hidden lg:flex items-center gap-8">
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsWorkDropdownOpen(true)}
            onMouseLeave={() => setIsWorkDropdownOpen(false)}
            onBlur={handleDropdownBlur}
          >
            <button
              ref={workButtonRef}
              type="button"
              onClick={() => setIsWorkDropdownOpen(!isWorkDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={isWorkDropdownOpen}
              className="font-mono text-sm text-[#B5502F] hover:text-[#A84A2E] transition-colors flex items-center gap-1"
            >
              WORK
              <svg
                className={`w-4 h-4 transition-transform ${isWorkDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                  className="absolute top-full left-0 pt-2 z-50"
      >
                  {/* pt-2 keeps the hover area continuous between WORK and the panel */}
                  <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    {projects.map((project) => (
                      <Link
                        key={project.href}
                        href={project.href}
                        onClick={() => setIsWorkDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B5502F] transition-colors"
                      >
                        {project.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="https://about.michaelbobov.com/" className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors">ABOUT</a>
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
      {mobileMenu}
    </>
  );
}
