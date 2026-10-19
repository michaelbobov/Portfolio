'use client';

import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

// Floats only on large screens; below lg the footer carries these links in flow
export default function SocialLinks() {
  return (
    <div className="hidden lg:flex fixed bottom-4 right-4 flex-row gap-2 z-40">
      <a
        href="mailto:michaelbobov@gmail.com"
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Email Michael"
        title="michaelbobov@gmail.com"
      >
        <FaEnvelope className="text-gray-700 text-xl" aria-hidden="true" />
      </a>
      <a
        href="https://www.linkedin.com/in/michael-bobov-94b61b202/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="LinkedIn"
      >
        <FaLinkedin className="text-gray-700 text-xl" aria-hidden="true" />
      </a>
    </div>
  );
} 
