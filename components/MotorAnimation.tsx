'use client';

import { motion } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';

export default function MotorAnimation() {
  const { state } = useMotorControl();

  const getRotationSpeed = () => {
    const normalizedRPM = state.motorRPM / 1500; // Normalize to 0-1
    return normalizedRPM * 2; // Max 2 seconds per rotation
  };

  const isRunning = state.motorState === MotorState.RUNNING || state.motorState === MotorState.STARTING;

  return (
    <g transform="translate(150, 480)">
      {/* Motor Housing */}
      <motion.circle 
        cx="0" cy="0" r="45" 
        fill="url(#motorGradient)" 
        stroke="#64748b" 
        strokeWidth="3"
        animate={{
          boxShadow: isRunning ? "0 0 20px rgba(34, 197, 94, 0.5)" : "none"
        }}
      />

      {/* Motor gradient definition */}
      <defs>
        <radialGradient id="motorGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>
      </defs>

      {/* Motor Rotor */}
      <motion.g
        animate={{
          rotate: isRunning ? 360 : 0,
        }}
        transition={{
          duration: getRotationSpeed() || 2,
          repeat: isRunning ? Infinity : 0,
          ease: "linear",
        }}
      >
        {/* Rotor Core */}
        <circle cx="0" cy="0" r="25" fill="#374151" stroke="#6b7280" strokeWidth="2"/>
        
        {/* Rotor Bars */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="0" y1="-20" x2="0" y2="-30"
            stroke="#9ca3af"
            strokeWidth="2"
            transform={`rotate(${i * 45})`}
            animate={{
              opacity: isRunning ? [0.5, 1, 0.5] : 0.5
            }}
            transition={{
              duration: 0.5,
              repeat: isRunning ? Infinity : 0,
              delay: i * 0.1
            }}
          />
        ))}

        {/* Center Shaft */}
        <circle cx="0" cy="0" r="8" fill="#6b7280"/>
        
        {/* Shaft indicator */}
        <motion.line 
          x1="0" y1="0" x2="0" y2="-6" 
          stroke="#ef4444" 
          strokeWidth="2"
          animate={{
            opacity: isRunning ? [1, 0.3, 1] : 1
          }}
          transition={{
            duration: 0.3,
            repeat: isRunning ? Infinity : 0
          }}
        />
      </motion.g>

      {/* Motor Name Plate */}
      <rect x="-30" y="15" width="60" height="20" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="2"/>
      <text x="0" y="25" textAnchor="middle" className="fill-white text-xs">3Φ MOTOR</text>
      <text x="0" y="35" textAnchor="middle" className="fill-gray-400 text-xs">1.5kW</text>

      {/* Running indicator */}
      <motion.circle 
        cx="35" cy="-35" r="4" 
        fill={isRunning ? "#22c55e" : "#64748b"}
        animate={{
          scale: isRunning ? [1, 1.3, 1] : 1,
          opacity: isRunning ? [1, 0.7, 1] : 0.5
        }}
        transition={{
          duration: 1,
          repeat: isRunning ? Infinity : 0
        }}
      />

      {/* RPM Display */}
      <motion.text 
        x="0" y="-60" 
        textAnchor="middle" 
        className="fill-white text-sm font-mono"
        animate={{
          opacity: isRunning ? 1 : 0.5
        }}
      >
        {Math.round(state.motorRPM)} RPM
      </motion.text>
    </g>
  );
}
