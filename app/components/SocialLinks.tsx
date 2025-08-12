'use client';

import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

export default function SocialLinks() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('mailto:michaelbobov@gmail.com?subject=Contact from Portfolio', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-row gap-2 z-50">
      <a
        href="#"
        onClick={handleEmailClick}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Email"
      >
        <FaEnvelope className="text-gray-700 text-xl" />
      </a>
      <a
        href="https://www.linkedin.com/in/michael-bobov-94b61b202/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="LinkedIn"
      >
        <FaLinkedin className="text-gray-700 text-xl" />
      </a>
    </div>
  );
} 