'use client';

import { useEffect } from 'react';

export default function MePage() {
  useEffect(() => {
    // Redirect to the external site
    window.location.href = 'https://about.michaelbobov.com/';
  }, []);

  return (
    <main className="bg-[#FAFAF8] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </main>
  );
}

