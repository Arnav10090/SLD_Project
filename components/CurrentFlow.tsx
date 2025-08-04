'use client';

import { motion } from 'framer-motion';

export default function CurrentFlow() {
  const flowPoints = [
    { x: 150, y: 60 },  // Start at phase
    { x: 150, y: 100 }, // MCB
    { x: 150, y: 150 }, // O/L
    { x: 150, y: 200 }, // STOP
    { x: 150, y: 260 }, // START
    { x: 150, y: 440 }, // Contactor
    { x: 150, y: 530 }, // Neutral
  ];

  return (
    <g>
      {flowPoints.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#fbbf24"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Additional flow indicators */}
      <motion.circle
        cx="190"
        cy="285"
        r="2"
        fill="#22c55e"
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </g>
  );
}
