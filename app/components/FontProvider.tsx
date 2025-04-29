'use client';

import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default function FontProvider() {
  return (
    <style jsx global>{`
      :root {
        --font-brush: ${dancingScript.style.fontFamily};
      }
    `}</style>
  );
} 