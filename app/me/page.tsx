'use client';

import { useEffect } from 'react';

export default function MePage() {
  useEffect(() => {
    // Redirect to the external site
    window.location.href = 'https://mishaos1-9z8a073im-michaelbobov-gmailcoms-projects.vercel.app/';
  }, []);

  return (
    <main className="bg-[#FAFAF8] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </main>
  );
}

