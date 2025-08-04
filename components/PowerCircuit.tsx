'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';
import { cn } from '@/lib/utils';
import MotorAnimation from './MotorAnimation';

// Type definitions
interface CurrentFlowProps {
  isActive: boolean;
  phase: string;
  x: number;
  y: number;
  delay?: number;
}

interface StatusBadgeProps {
  isActive: boolean;
  x: number;
  y: number;
  label: string;
  isFault?: boolean;
}

// Animated current flow component
const CurrentFlow: React.FC<CurrentFlowProps> = ({ isActive, x, y, delay = 0 }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={4}
          fill="#3b82f6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -40],
            transition: { 
              duration: 1.5, 
              repeat: Infinity, 
              delay,
              ease: 'linear'
            }
          }}
          exit={{ opacity: 0, scale: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
};

// Component status indicator
const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, x, y, label, isFault = false }) => {
  return (
    <g>
      <circle 
        cx={x} 
        cy={y} 
        r={8} 
        fill={isFault ? '#ef4444' : isActive ? '#10b981' : '#6b7280'}
        className="transition-colors duration-300"
      />
      {isFault && (
        <text 
          x={x} 
          y={y + 4} 
          textAnchor="middle" 
          className="text-xs font-bold fill-white"
        >
          !
        </text>
      )}
      <text 
        x={x + 15} 
        y={y + 5} 
        className="text-xs fill-gray-300"
      >
        {label}
      </text>
    </g>
  );
};

interface PowerCircuitProps {
  // Add any props that PowerCircuit component might receive
}

const PowerCircuit: React.FC<PowerCircuitProps> = () => {
  const { state, toggleMCB, resetOverload } = useMotorControl();

  const isLive = state.currentFlow && state.mcbClosed && state.isContactorEnergized;
  const isStarting = state.motorState === MotorState.STARTING;
  const isRunning = state.motorState === MotorState.RUNNING;
  const isStopping = state.motorState === MotorState.STOPPING;
  const isEmergency = state.motorState === MotorState.EMERGENCY_STOP;
  const isOverload = state.motorState === MotorState.OVERLOAD;
  
  // Calculate motor rotation based on state
  const motorRotation = isRunning ? 360 : isStarting ? 180 : 0;
  const motorAnimation = {
    rotate: motorRotation,
    transition: { 
      duration: isRunning ? 3 : isStarting ? 1.5 : 0.5,
      repeat: isRunning || isStarting ? Infinity : 0,
      ease: 'linear' as const
    }
  };

  return (
    <div className="w-full h-[600px] relative">
      {/* Status indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div className={cn(
          "flex items-center px-3 py-1 rounded-full text-xs font-medium",
          isEmergency ? "bg-red-500/20 text-red-400" :
          isOverload ? "bg-amber-500/20 text-amber-400" :
          isRunning ? "bg-green-500/20 text-green-400" :
          isStarting ? "bg-blue-500/20 text-blue-400" :
          "bg-gray-500/20 text-gray-400"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full mr-2",
            isEmergency ? "bg-red-400" :
            isOverload ? "bg-amber-400" :
            isRunning ? "bg-green-400" :
            isStarting ? "bg-blue-400" : "bg-gray-400"
          )} />
          {state.motorState}
        </div>
      </div>

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
          
          {/* Gradient for active power lines */}
          <linearGradient id="powerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          
          {/* Glow effect for active components */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#powerGrid)" />

        {/* Title */}
        <text x="150" y="25" textAnchor="middle" className="fill-blue-400 text-sm font-semibold">
          Power Circuit - {state.motorState}
        </text>

        {/* Three Phase Supply with Animation */}
        <g className={cn("transition-opacity", isLive ? "opacity-100" : "opacity-50")}>
          <text x="70" y="55" className="fill-red-400 text-xs font-bold">
            <animate 
              attributeName="opacity" 
              values="1;0.5;1" 
              dur="2s" 
              repeatCount="indefinite"
              begin={isLive ? "0s" : undefined}
            />
            R
          </text>
          <text x="150" y="55" className="fill-yellow-400 text-xs font-bold">
            <animate 
              attributeName="opacity" 
              values="1;0.5;1" 
              dur="2s" 
              begin={isLive ? "0.2s" : undefined}
              repeatCount="indefinite"
            />
            Y
          </text>
          <text x="230" y="55" className="fill-blue-400 text-xs font-bold">
            <animate 
              attributeName="opacity" 
              values="1;0.5;1" 
              dur="2s" 
              begin={isLive ? "0.4s" : undefined}
              repeatCount="indefinite"
            />
            B
          </text>

          {/* Phase Lines with current flow animation */}
          <motion.line 
            x1="75" y1="60" x2="75" y2="580" 
            stroke={isLive ? "#ef4444" : "#4b5563"} 
            strokeWidth="3"
            strokeDasharray={isLive ? "5,3" : "none"}
            strokeDashoffset={isLive ? 100 : 0}
          >
            {isLive && (
              <animate 
                attributeName="stroke-dashoffset" 
                from="100" 
                to="0" 
                dur="2s" 
                repeatCount="indefinite"
              />
            )}
          </motion.line>
          
          <motion.line 
            x1="150" y1="60" x2="150" y2="580" 
            stroke={isLive ? "#eab308" : "#4b5563"} 
            strokeWidth="3"
            strokeDasharray={isLive ? "5,3" : "none"}
            strokeDashoffset={isLive ? 100 : 0}
          >
            {isLive && (
              <animate 
                attributeName="stroke-dashoffset" 
                from="100" 
                to="0" 
                dur="2s" 
                begin="0.2s"
                repeatCount="indefinite"
              />
            )}
          </motion.line>
          
          <motion.line 
            x1="225" y1="60" x2="225" y2="580" 
            stroke={isLive ? "#3b82f6" : "#4b5563"} 
            strokeWidth="3"
            strokeDasharray={isLive ? "5,3" : "none"}
            strokeDashoffset={isLive ? 100 : 0}
          >
            {isLive && (
              <animate 
                attributeName="stroke-dashoffset" 
                from="100" 
                to="0" 
                dur="2s" 
                begin="0.4s"
                repeatCount="indefinite"
              />
            )}
          </motion.line>
          
          {/* Current flow indicators */}
          {isLive && (
            <>
              <CurrentFlow isActive={isLive} phase="R" x={75} y={100} delay={0} />
              <CurrentFlow isActive={isLive} phase="Y" x={150} y={100} delay={0.2} />
              <CurrentFlow isActive={isLive} phase="B" x={225} y={100} delay={0.4} />
            </>
          )}
        </g>

        {/* MCB with interactive toggle */}
        <g className="cursor-pointer" onClick={toggleMCB}>
          <motion.rect 
            x="60" 
            y="70" 
            width="30" 
            height="20" 
            rx="2" 
            fill={state.mcbClosed ? "#10b981" : "#ef4444"}
            className={cn(
              "transition-all duration-300",
              state.mcbClosed ? "hover:shadow-[0_0_15px_#10b981]" : "hover:shadow-[0_0_15px_#ef4444]"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <text 
            x="75" 
            y="84" 
            textAnchor="middle" 
            className={cn(
              "text-xs font-bold transition-colors",
              state.mcbClosed ? "fill-white" : "fill-gray-200"
            )}
          >
            {state.mcbClosed ? 'ON' : 'OFF'}
          </text>
          
          {/* Status indicator */}
          <StatusBadge 
            x={95} 
            y={80} 
            label="MCB" 
            isActive={state.mcbClosed}
            isFault={!state.mcbClosed && (isRunning || isStarting)}
          />
        </g>
        <text x="55" y="75" className="fill-white text-xs">MCB</text>

        {/* Contactor */}
        <g>
          <motion.rect 
            x="60" 
            y="150" 
            width="30" 
            height="20" 
            rx="2" 
            fill={state.isContactorEnergized ? "#3b82f6" : "#4b5563"}
            className={cn(
              "transition-all duration-300",
              state.isContactorEnergized ? "shadow-[0_0_15px_#3b82f6]" : ""
            )}
            animate={{
              scale: state.isContactorEnergized ? [1, 1.02, 1] : 1,
              boxShadow: state.isContactorEnergized ? "0 0 20px #3b82f6" : "none"
            }}
            transition={{
              duration: 2,
              repeat: state.isContactorEnergized ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          <text 
            x="75" 
            y="164" 
            textAnchor="middle" 
            className={cn(
              "text-xs font-bold transition-colors",
              state.isContactorEnergized ? "fill-white" : "fill-gray-400"
            )}
          >
            C
          </text>
          
          {/* Status indicator */}
          <StatusBadge 
            x={95} 
            y={160} 
            label="Contactor" 
            isActive={state.isContactorEnergized}
            isFault={!state.isContactorEnergized && (isRunning || isStarting)}
          />
          
          {/* Contactor coil indicator */}
          <motion.rect 
            x="130" 
            y="145" 
            width="40" 
            height="30" 
            rx="4"
            fill="none"
            stroke={state.isContactorEnergized ? "#3b82f6" : "#4b5563"}
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <text 
            x="150" 
            y="166" 
            textAnchor="middle" 
            className={cn(
              "text-xs font-bold transition-colors",
              state.isContactorEnergized ? "text-blue-400" : "text-gray-500"
            )}
          >
            Coil
          </text>
        </g>

        {/* Overload Relay */}
        <g>
          <motion.rect 
            x="60" 
            y="230" 
            width="30" 
            height="20" 
            rx="2" 
            fill={state.overloadTripped ? "#ef4444" : "#22c55e"}
            className={cn(
              "transition-all duration-300",
              state.overloadTripped ? "shadow-[0_0_15px_#ef4444]" : ""
            )}
            animate={{
              scale: state.overloadTripped ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: state.overloadTripped ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          <text 
            x="75" 
            y="244" 
            textAnchor="middle" 
            className={cn(
              "text-xs font-bold transition-colors",
              state.overloadTripped ? "fill-white" : "fill-white"
            )}
          >
            OL
          </text>
          
          {/* Status indicator */}
          <StatusBadge 
            x={95} 
            y={240} 
            label={state.overloadTripped ? "TRIPPED" : "Normal"} 
            isActive={!state.overloadTripped}
            isFault={state.overloadTripped}
          />
          
          {/* Overload reset button */}
          <motion.rect 
            x="130" 
            y="225" 
            width="40" 
            height="20" 
            rx="4"
            fill={state.overloadTripped ? "#ef4444" : "#4b5563"}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (state.overloadTripped) resetOverload();
            }}
            whileHover={state.overloadTripped ? { scale: 1.05 } : {}}
            whileTap={state.overloadTripped ? { scale: 0.95 } : {}}
          />
          <text 
            x="150" 
            y="238" 
            textAnchor="middle" 
            className={cn(
              "text-xs font-bold transition-colors cursor-pointer",
              state.overloadTripped ? "text-white" : "text-gray-500"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (state.overloadTripped) resetOverload();
            }}
          >
            {state.overloadTripped ? "RESET" : "NORMAL"}
          </text>
        </g>

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

export default PowerCircuit;
