'use client';

import { motion } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';
import { Clock, Zap, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function StatusDisplay() {
  const { state } = useMotorControl();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (state.motorState) {
      case MotorState.RUNNING: return 'text-green-400';
      case MotorState.STARTING: return 'text-yellow-400';
      case MotorState.STOPPING: return 'text-orange-400';
      case MotorState.FAULT: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (state.motorState) {
      case MotorState.RUNNING: return 'MOTOR RUNNING';
      case MotorState.STARTING: return 'MOTOR STARTING';
      case MotorState.STOPPING: return 'MOTOR STOPPING';
      case MotorState.FAULT: return 'MOTOR FAULT';
      default: return 'MOTOR STOPPED';
    }
  };

  return (
    <div className="space-y-4">
      {/* Motor Status */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Motor Status</span>
          <motion.div
            animate={{
              scale: state.motorState === MotorState.RUNNING ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 1, repeat: state.motorState === MotorState.RUNNING ? Infinity : 0 }}
          >
            <Activity size={16} className={getStatusColor()} />
          </motion.div>
        </div>
        <motion.p 
          className={`text-lg font-bold ${getStatusColor()}`}
          animate={{
            opacity: state.motorState === MotorState.FAULT ? [1, 0.5, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: state.motorState === MotorState.FAULT ? Infinity : 0
          }}
        >
          {getStatusText()}
        </motion.p>
      </div>

      {/* Motor Parameters */}
      <div className="grid grid-cols-2 gap-4">
        {/* RPM */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center space-x-2 mb-1">
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs text-gray-300">Speed</span>
          </div>
          <motion.p 
            className="text-lg font-mono text-white"
            animate={{
              color: state.motorRPM > 0 ? "#22c55e" : "#64748b"
            }}
          >
            {Math.round(state.motorRPM)}
          </motion.p>
          <p className="text-xs text-gray-400">RPM</p>
        </div>

        {/* Running Time */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center space-x-2 mb-1">
            <Clock size={14} className="text-green-400" />
            <span className="text-xs text-gray-300">Runtime</span>
          </div>
          <p className="text-lg font-mono text-white">{formatTime(state.runningTime)}</p>
          <p className="text-xs text-gray-400">HH:MM:SS</p>
        </div>
      </div>

      {/* System Health */}
      <div className="space-y-2">
        <h3 className="text-sm text-gray-300 font-semibold">System Health</h3>
        
        {/* MCB Status */}
        <div className="flex items-center justify-between bg-slate-700/30 rounded p-2">
          <span className="text-sm text-gray-300">MCB</span>
          <div className="flex items-center space-x-2">
            {state.mcbClosed ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <AlertTriangle size={16} className="text-red-400" />
            )}
            <span className={`text-sm ${state.mcbClosed ? 'text-green-400' : 'text-red-400'}`}>
              {state.mcbClosed ? 'CLOSED' : 'OPEN'}
            </span>
          </div>
        </div>

        {/* Overload Status */}
        <div className="flex items-center justify-between bg-slate-700/30 rounded p-2">
          <span className="text-sm text-gray-300">Overload</span>
          <div className="flex items-center space-x-2">
            {state.overloadTripped ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle size={16} className="text-red-400" />
              </motion.div>
            ) : (
              <CheckCircle size={16} className="text-green-400" />
            )}
            <span className={`text-sm ${state.overloadTripped ? 'text-red-400' : 'text-green-400'}`}>
              {state.overloadTripped ? 'TRIPPED' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* Contactor Status */}
        <div className="flex items-center justify-between bg-slate-700/30 rounded p-2">
          <span className="text-sm text-gray-300">Contactor</span>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: state.isContactorEnergized ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.8,
                repeat: state.isContactorEnergized ? Infinity : 0
              }}
            >
              {state.isContactorEnergized ? (
                <Zap size={16} className="text-orange-400" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              )}
            </motion.div>
            <span className={`text-sm ${state.isContactorEnergized ? 'text-orange-400' : 'text-gray-400'}`}>
              {state.isContactorEnergized ? 'ENERGIZED' : 'DE-ENERGIZED'}
            </span>
          </div>
        </div>
      </div>

      {/* Fault Display */}
      {state.faultCondition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 border border-red-500 rounded-lg p-3"
        >
          <div className="flex items-center space-x-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle size={16} className="text-red-400" />
            </motion.div>
            <span className="text-sm font-semibold text-red-400">FAULT CONDITION</span>
          </div>
          <p className="text-sm text-red-300">{state.faultCondition}</p>
        </motion.div>
      )}
    </div>
  );
}
