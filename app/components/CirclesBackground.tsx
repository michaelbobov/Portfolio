'use client';

import { motion } from 'framer-motion';

export default function CirclesBackground() {
  const circles = [
    { size: 200, x: '10%', y: '20%', delay: 0, duration: 20 },
    { size: 150, x: '85%', y: '15%', delay: 2, duration: 25 },
    { size: 100, x: '20%', y: '70%', delay: 4, duration: 18 },
    { size: 180, x: '75%', y: '80%', delay: 6, duration: 22 },
    { size: 120, x: '50%', y: '10%', delay: 8, duration: 15 },
    { size: 90, x: '15%', y: '40%', delay: 10, duration: 20 },
    { size: 160, x: '80%', y: '50%', delay: 12, duration: 25 },
    { size: 110, x: '45%', y: '85%', delay: 14, duration: 18 },
  ];

  // Fixed positions for medium circles to avoid hydration mismatch
  const mediumCircles = [
    { size: 120, x: '25%', y: '30%', delay: 0, duration: 18 },
    { size: 100, x: '70%', y: '25%', delay: 2, duration: 22 },
    { size: 140, x: '15%', y: '60%', delay: 4, duration: 20 },
    { size: 110, x: '60%', y: '70%', delay: 6, duration: 19 },
    { size: 130, x: '40%', y: '15%', delay: 8, duration: 21 },
    { size: 95, x: '80%', y: '40%', delay: 10, duration: 17 },
    { size: 150, x: '30%', y: '80%', delay: 12, duration: 23 },
    { size: 105, x: '75%', y: '10%', delay: 14, duration: 18 },
    { size: 125, x: '20%', y: '45%', delay: 16, duration: 20 },
    { size: 115, x: '65%', y: '55%', delay: 18, duration: 19 },
    { size: 135, x: '45%', y: '35%', delay: 20, duration: 21 },
    { size: 100, x: '85%', y: '65%', delay: 22, duration: 18 },
    { size: 145, x: '10%', y: '75%', delay: 24, duration: 22 },
    { size: 110, x: '55%', y: '20%', delay: 26, duration: 19 },
    { size: 130, x: '35%', y: '90%', delay: 28, duration: 20 },
    { size: 120, x: '90%', y: '30%', delay: 30, duration: 21 },
  ];

  // Fixed positions for small circles
  const smallCircles = [
    { size: 45, x: '5%', y: '25%', delay: 0, duration: 15 },
    { size: 60, x: '90%', y: '35%', delay: 2, duration: 18 },
    { size: 35, x: '25%', y: '85%', delay: 4, duration: 16 },
    { size: 50, x: '70%', y: '80%', delay: 6, duration: 17 },
    { size: 40, x: '50%', y: '5%', delay: 8, duration: 19 },
    { size: 55, x: '15%', y: '55%', delay: 10, duration: 14 },
    { size: 65, x: '80%', y: '45%', delay: 12, duration: 20 },
    { size: 30, x: '40%', y: '95%', delay: 14, duration: 16 },
    { size: 70, x: '95%', y: '15%', delay: 16, duration: 18 },
    { size: 45, x: '30%', y: '40%', delay: 18, duration: 15 },
    { size: 60, x: '65%', y: '25%', delay: 20, duration: 17 },
    { size: 35, x: '10%', y: '70%', delay: 22, duration: 19 },
    { size: 50, x: '75%', y: '60%', delay: 24, duration: 16 },
    { size: 40, x: '20%', y: '10%', delay: 26, duration: 18 },
    { size: 55, x: '85%', y: '75%', delay: 28, duration: 15 },
    { size: 65, x: '35%', y: '65%', delay: 30, duration: 17 },
    { size: 45, x: '60%', y: '90%', delay: 32, duration: 19 },
    { size: 70, x: '5%', y: '50%', delay: 34, duration: 16 },
    { size: 30, x: '90%', y: '85%', delay: 36, duration: 18 },
    { size: 60, x: '25%', y: '15%', delay: 38, duration: 15 },
    { size: 50, x: '80%', y: '5%', delay: 40, duration: 17 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-gray-50 to-gray-100">
      {circles.map((circle, index) => {
        // Create an array of gradient colors from the home page
        const gradients = [
          'from-[#FF5500]/40 to-[#9747FF]/25',
          'from-[#9747FF]/40 to-[#5CE1E6]/25',
          'from-[#5CE1E6]/40 to-[#3B82F6]/25',
          'from-[#3B82F6]/40 to-[#FF5500]/25',
          'from-[#FF5500]/40 to-[#5CE1E6]/25',
          'from-[#9747FF]/40 to-[#3B82F6]/25',
          'from-[#5CE1E6]/40 to-[#FF5500]/25',
          'from-[#3B82F6]/40 to-[#9747FF]/25'
        ];
        
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br ${gradients[index % gradients.length]}`}
            style={{
              width: circle.size,
              height: circle.size,
              left: circle.x,
              top: circle.y,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: circle.duration,
              delay: circle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Medium circles with fixed positions */}
      {mediumCircles.map((circle, index) => {
        const gradients = [
          'from-[#FF5500]/35 to-[#9747FF]/20',
          'from-[#9747FF]/35 to-[#5CE1E6]/20',
          'from-[#5CE1E6]/35 to-[#3B82F6]/20',
          'from-[#3B82F6]/35 to-[#FF5500]/20',
          'from-[#FF5500]/35 to-[#5CE1E6]/20'
        ];
        
        return (
          <motion.div
            key={`medium-${index}`}
            className={`absolute rounded-full bg-gradient-to-br ${gradients[index % gradients.length]}`}
            style={{
              width: circle.size,
              height: circle.size,
              left: circle.x,
              top: circle.y,
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: circle.duration,
              delay: circle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Small circles with fixed positions */}
      {smallCircles.map((circle, index) => {
        const gradients = [
          'from-[#FF5500]/30 to-[#9747FF]/20',
          'from-[#9747FF]/30 to-[#5CE1E6]/20',
          'from-[#5CE1E6]/30 to-[#3B82F6]/20',
          'from-[#3B82F6]/30 to-[#FF5500]/20'
        ];
        
        return (
          <motion.div
            key={`small-${index}`}
            className={`absolute rounded-full bg-gradient-to-br ${gradients[index % gradients.length]}`}
            style={{
              width: circle.size,
              height: circle.size,
              left: circle.x,
              top: circle.y,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: circle.duration,
              delay: circle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
