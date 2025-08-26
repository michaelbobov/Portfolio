'use client';

import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

export default function SocialLinks() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Direct Gmail compose URL that goes straight to email composition
    const gmailComposeUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=michaelbobov@gmail.com';
    
    // Open Gmail compose in a new tab
    window.open(gmailComposeUrl, '_blank');
  };

  const handleEmailRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('michaelbobov@gmail.com').then(() => {
      // Optional: Show a brief notification that email was copied
      alert('Email copied to clipboard: michaelbobov@gmail.com');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = 'michaelbobov@gmail.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email copied to clipboard: michaelbobov@gmail.com');
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-row gap-2 z-40">
      <a
        href="#"
        onClick={handleEmailClick}
        onContextMenu={handleEmailRightClick}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors group relative"
        aria-label="Email (left-click to open Gmail compose, right-click to copy)"
        title="Left-click to open Gmail compose, right-click to copy email"
      >
        <FaEnvelope className="text-gray-700 text-xl" />
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Left-click: Open Gmail • Right-click: Copy
        </div>
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