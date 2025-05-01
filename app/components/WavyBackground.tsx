'use client';

import React from 'react';

export default function WavyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5500] via-[#9747FF] to-[#5CE1E6]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6] to-[#5CE1E6] opacity-50" />
      </div>
      
      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(255, 85, 0, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(151, 71, 255, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 100% 50%, rgba(59, 130, 246, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(92, 225, 230, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(220, 38, 38, 1) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Additional color spots for vibrancy */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(255, 85, 0, 0.7) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(151, 71, 255, 0.7) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.7) 0%, transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(92, 225, 230, 0.7) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(220, 38, 38, 0.8) 0%, transparent 40%)
          `
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Blur overlay for softer edges */}
      <div className="absolute inset-0 backdrop-blur-[30px]" />
    </div>
  );
} 