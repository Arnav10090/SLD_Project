'use client';

import { motion } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';
import MotorAnimation from './MotorAnimation';

export default function PowerCircuit() {
  const { state } = useMotorControl();

  const isLive = state.currentFlow && state.mcbClosed && state.isContactorEnergized;

  return (
    <div className="w-full h-[600px] relative">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 300 600" 
        className="border border-slate-600 rounded-lg bg-slate-900/30"
      >
        {/* Background grid */}
        <defs>
          <pattern id="powerGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(71, 85, 105)" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#powerGrid)" />

        {/* Title */}
        <text x="150" y="25" textAnchor="middle" className="fill-red-400 text-sm font-semibold">
          Power Circuit
        </text>

        {/* Three Phase Supply */}
        <text x="70" y="55" className="fill-red-400 text-xs font-bold">R</text>
        <text x="150" y="55" className="fill-yellow-400 text-xs font-bold">Y</text>
        <text x="230" y="55" className="fill-blue-400 text-xs font-bold">B</text>

        {/* Phase Lines */}
        <motion.line 
          x1="75" y1="60" x2="75" y2="580" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />
        <motion.line 
          x1="150" y1="60" x2="150" y2="580" 
          stroke={isLive ? "#eab308" : "#64748b"} 
          strokeWidth="3"
        />
        <motion.line 
          x1="225" y1="60" x2="225" y2="580" 
          stroke={isLive ? "#3b82f6" : "#64748b"} 
          strokeWidth="3"
        />

        {/* MCB */}
        <rect x="50" y="80" width="200" height="40" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5"/>
        <text x="55" y="75" className="fill-white text-xs">MCB</text>

        {/* MCB Individual Switches */}
        <motion.circle 
          cx="75" cy="100" r="8" 
          fill="none" 
          stroke={state.mcbClosed ? (isLive ? "#ef4444" : "#22c55e") : "#ef4444"} 
          strokeWidth="2"
        />
        <motion.circle 
          cx="150" cy="100" r="8" 
          fill="none" 
          stroke={state.mcbClosed ? (isLive ? "#eab308" : "#22c55e") : "#ef4444"} 
          strokeWidth="2"
        />
        <motion.circle 
          cx="225" cy="100" r="8" 
          fill="none" 
          stroke={state.mcbClosed ? (isLive ? "#3b82f6" : "#22c55e") : "#ef4444"} 
          strokeWidth="2"
        />

        {/* L1, L2, L3 Labels */}
        <text x="70" y="135" className="fill-gray-400 text-xs">L1</text>
        <text x="145" y="135" className="fill-gray-400 text-xs">L2</text>
        <text x="220" y="135" className="fill-gray-400 text-xs">L3</text>

        {/* Contactor */}
        <rect x="50" y="150" width="200" height="60" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5"/>
        <text x="250" y="165" className="fill-gray-400 text-xs">A1</text>

        {/* Contactor Contacts */}
        <motion.g
          animate={{ 
            y: state.isContactorEnergized ? 5 : 0,
            opacity: state.isContactorEnergized ? 1 : 0.7
          }}
          transition={{ duration: 0.3 }}
        >
          <rect x="67" y="165" width="16" height="25" fill={state.isContactorEnergized ? "#22c55e" : "#64748b"} rx="2"/>
          <rect x="142" y="165" width="16" height="25" fill={state.isContactorEnergized ? "#22c55e" : "#64748b"} rx="2"/>
          <rect x="217" y="165" width="16" height="25" fill={state.isContactorEnergized ? "#22c55e" : "#64748b"} rx="2"/>
        </motion.g>

        <text x="255" y="185" className="fill-white text-xs font-bold">C</text>
        <text x="250" y="205" className="fill-gray-400 text-xs">A2</text>

        {/* Overload Relay */}
        <rect x="50" y="250" width="200" height="60" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5"/>
        <text x="255" y="265" className="fill-gray-400 text-xs">O/L</text>

        {/* Overload Elements */}
        <motion.g
          animate={{ 
            scale: state.overloadTripped ? [1, 1.1, 1] : 1,
            opacity: state.overloadTripped ? 0.6 : 1
          }}
          transition={{ repeat: state.overloadTripped ? Infinity : 0, duration: 1 }}
        >
          <path d="M 67 270 L 83 280 L 83 290 L 67 280 Z" fill="none" stroke={state.overloadTripped ? "#ef4444" : "#64748b"} strokeWidth="2"/>
          <path d="M 142 270 L 158 280 L 158 290 L 142 280 Z" fill="none" stroke={state.overloadTripped ? "#ef4444" : "#64748b"} strokeWidth="2"/>
          <path d="M 217 270 L 233 280 L 233 290 L 217 280 Z" fill="none" stroke={state.overloadTripped ? "#ef4444" : "#64748b"} strokeWidth="2"/>
        </motion.g>

        {/* T1, T2, T3 Labels */}
        <text x="70" y="325" className="fill-gray-400 text-xs">T1</text>
        <text x="145" y="325" className="fill-gray-400 text-xs">T2</text>
        <text x="220" y="325" className="fill-gray-400 text-xs">T3</text>

        {/* Motor Terminal Block */}
        <rect x="50" y="350" width="200" height="60" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5"/>
        <text x="255" y="365" className="fill-gray-400 text-xs">TB</text>

        {/* U, V, W Labels */}
        <text x="70" y="385" className="fill-gray-400 text-xs">U</text>
        <text x="150" y="385" className="fill-gray-400 text-xs">V</text>
        <text x="225" y="385" className="fill-gray-400 text-xs">W</text>

        {/* Motor */}
        <MotorAnimation />

        {/* Power flow indicators */}
        {isLive && (
          <>
            {/* Phase current indicators */}
            <motion.circle 
              cx="75" cy="450" r="3" 
              fill="#ef4444"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <motion.circle 
              cx="150" cy="450" r="3" 
              fill="#eab308"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            />
            <motion.circle 
              cx="225" cy="450" r="3" 
              fill="#3b82f6"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
