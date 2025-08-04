'use client';

import { motion } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';
import CurrentFlow from './CurrentFlow';

export default function ControlCircuit() {
  const { state } = useMotorControl();

  const isLive = state.currentFlow && state.mcbClosed;

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
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(71, 85, 105)" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Title */}
        <text x="150" y="25" textAnchor="middle" className="fill-blue-400 text-sm font-semibold">
          Control Circuit
        </text>

        {/* Phase Line */}
        <text x="30" y="65" className="fill-white text-xs">Phase</text>
        <motion.line 
          x1="80" y1="60" x2="220" y2="60" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* MCB */}
        <text x="30" y="105" className="fill-white text-xs">MCB</text>
        <motion.circle 
          cx="150" cy="100" r="15" 
          fill="none" 
          stroke={state.mcbClosed ? (isLive ? "#ef4444" : "#22c55e") : "#ef4444"} 
          strokeWidth="2"
          animate={{ 
            scale: state.mcbClosed ? 1 : 0.8,
            strokeWidth: state.mcbClosed ? 2 : 3 
          }}
        />
        <motion.line 
          x1="135" y1="100" x2="165" y2="100" 
          stroke={state.mcbClosed ? (isLive ? "#ef4444" : "#22c55e") : "#ef4444"} 
          strokeWidth="3"
          animate={{ 
            rotate: state.mcbClosed ? 0 : 30,
            originX: "150px",
            originY: "100px"
          }}
        />

        {/* Vertical line from MCB to O/L */}
        <motion.line 
          x1="150" y1="115" x2="150" y2="140" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* Overload Relay */}
        <text x="30" y="155" className="fill-white text-xs">O/L</text>
        <motion.g
          animate={{ 
            scale: state.overloadTripped ? [1, 1.1, 1] : 1,
            opacity: state.overloadTripped ? 0.6 : 1
          }}
          transition={{ repeat: state.overloadTripped ? Infinity : 0, duration: 1 }}
        >
          <path 
            d="M 135 145 L 165 155 L 165 165 L 135 155 Z" 
            fill="none" 
            stroke={state.overloadTripped ? "#ef4444" : (isLive ? "#ef4444" : "#64748b")} 
            strokeWidth="2"
          />
        </motion.g>

        {/* Vertical line from O/L to STOP */}
        <motion.line 
          x1="150" y1="170" x2="150" y2="195" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* STOP Button */}
        <text x="20" y="215" className="fill-red-400 text-xs font-semibold">STOP PB</text>
        <motion.rect 
          x="135" y="200" width="30" height="20" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="2" 
          rx="3"
        />
        <motion.line 
          x1="140" y1="210" x2="160" y2="210" 
          stroke="#ef4444" 
          strokeWidth="3"
        />

        {/* Vertical line from STOP to START */}
        <motion.line 
          x1="150" y1="220" x2="150" y2="245" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* START Button */}
        <text x="15" y="265" className="fill-green-400 text-xs font-semibold">START PB</text>
        <motion.circle 
          cx="130" cy="260" r="8" 
          fill="none" 
          stroke="#22c55e" 
          strokeWidth="2"
        />
        <motion.line 
          x1="138" y1="260" x2="150" y2="260" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* Horizontal line to contactor coil */}
        <motion.line 
          x1="150" y1="260" x2="190" y2="260" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* Auxiliary Contact (Holding contact) */}
        <motion.line 
          x1="190" y1="260" x2="190" y2="280" 
          stroke={isLive && state.isContactorEnergized ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />
        <motion.rect 
          x="185" y="275" width="10" height="15" 
          fill="none" 
          stroke={state.isContactorEnergized ? "#22c55e" : "#64748b"} 
          strokeWidth="2"
        />
        <text x="200" y="285" className="fill-white text-xs">C</text>
        <motion.line 
          x1="190" y1="290" x2="190" y2="310" 
          stroke={isLive && state.isContactorEnergized ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />
        <motion.line 
          x1="190" y1="310" x2="150" y2="310" 
          stroke={isLive && state.isContactorEnergized ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* Vertical line to contactor */}
        <motion.line 
          x1="150" y1="275" x2="150" y2="420" 
          stroke={isLive ? "#ef4444" : "#64748b"} 
          strokeWidth="3"
        />

        {/* Contactor Coil */}
        <text x="30" y="435" className="fill-white text-xs">CONTACTOR</text>
        <motion.circle 
          cx="150" cy="440" r="12" 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="2"
        />
        <text x="145" y="445" className="fill-white text-xs font-bold">C</text>
        
        {/* Contactor energized animation */}
        <motion.circle 
          cx="150" cy="440" r="18" 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="1"
          opacity={state.isContactorEnergized ? 0.7 : 0}
          animate={{ 
            scale: state.isContactorEnergized ? [1, 1.2, 1] : 1,
            opacity: state.isContactorEnergized ? [0.7, 0.3, 0.7] : 0
          }}
          transition={{ repeat: state.isContactorEnergized ? Infinity : 0, duration: 1.5 }}
        />

        {/* A1 Terminal */}
        <text x="160" y="450" className="fill-gray-400 text-xs">A1</text>

        {/* Coil to Neutral */}
        <motion.line 
          x1="150" y1="455" x2="150" y2="520" 
          stroke="#64748b" 
          strokeWidth="3"
        />

        {/* Neutral */}
        <text x="30" y="535" className="fill-blue-400 text-xs">NEUTRAL</text>
        <motion.line 
          x1="80" y1="530" x2="220" y2="530" 
          stroke="#3b82f6" 
          strokeWidth="3"
        />
        <text x="160" y="545" className="fill-gray-400 text-xs">A2</text>

        {/* Current Flow Animation */}
        {isLive && <CurrentFlow />}
      </svg>
    </div>
  );
}
