'use client';

import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

export default function SocialLinks() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Try to open mailto link directly first
    const mailtoLink = 'mailto:michaelbobov@gmail.com';
    
    // Create a temporary link element and click it
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback: try window.open for browsers that support it
    try {
      window.open(mailtoLink, '_blank');
    } catch (error) {
      console.log('Mailto link opened in same window');
    }
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
        aria-label="Email (left-click to open email client, right-click to copy)"
        title="Left-click to open email client, right-click to copy email"
      >
        <FaEnvelope className="text-gray-700 text-xl" />
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Left-click: Open email • Right-click: Copy
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