'use client';

import { motion } from 'framer-motion';
import { useMotorControl, MotorState } from '@/hooks/useMotorControl';
import { Play, Square, AlertTriangle, RotateCcw, Zap, Rewind } from 'lucide-react';

export default function ControlPanel() {
  const { state, startMotor, stopMotor, emergencyStop, resetFault, toggleMCB, resetRuntime } = useMotorControl();

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  return (
    <div className="space-y-6">
      {/* Main Control Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* START Button */}
        <motion.button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg 
                     shadow-lg border-2 border-green-500 flex items-center justify-center space-x-2
                     disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          onClick={startMotor}
          disabled={state.motorState === MotorState.RUNNING || state.motorState === MotorState.STARTING || !state.mcbClosed || state.overloadTripped}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {state.motorState === MotorState.STARTING ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw size={20} />
            </motion.div>
          ) : (
            <Play size={20} />
          )}
          <span>START</span>
          
          {/* Button press effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{ opacity: 0.2 }}
            transition={{ duration: 0.1 }}
          />
        </motion.button>

        {/* STOP Button */}
        <motion.button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg 
                     shadow-lg border-2 border-red-500 flex items-center justify-center space-x-2
                     relative overflow-hidden"
          onClick={stopMotor}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Square size={20} />
          <span>STOP</span>
          
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{ opacity: 0.2 }}
            transition={{ duration: 0.1 }}
          />
        </motion.button>
      </div>

      {/* Emergency Controls */}
      <div className="grid grid-cols-1 gap-3">
        {/* Emergency Stop */}
        <motion.button
          className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-4 rounded-lg 
                     shadow-lg border-2 border-red-700 flex items-center justify-center space-x-2
                     relative overflow-hidden"
          onClick={emergencyStop}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AlertTriangle size={18} />
          <span>EMERGENCY STOP</span>
          
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{ opacity: 0.3 }}
            transition={{ duration: 0.1 }}
          />
        </motion.button>

        {/* MCB Toggle */}
        <motion.button
          className={`${state.mcbClosed ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'} 
                     text-white font-bold py-3 px-4 rounded-lg shadow-lg border-2 
                     ${state.mcbClosed ? 'border-yellow-500' : 'border-gray-500'} 
                     flex items-center justify-center space-x-2 relative overflow-hidden`}
          onClick={toggleMCB}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Zap size={18} />
          <span>{state.mcbClosed ? 'OPEN MCB' : 'CLOSE MCB'}</span>
          
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{ opacity: 0.2 }}
            transition={{ duration: 0.1 }}
          />
        </motion.button>

        {/* Reset Runtime Timer Button */}
        {state.motorState !== MotorState.RUNNING && (
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg border-2 border-blue-500 flex items-center justify-center space-x-2 relative overflow-hidden"
            onClick={resetRuntime}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Rewind size={18} />
            <span>RESET RUNTIME</span>

            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              whileTap={{ opacity: 0.2 }}
              transition={{ duration: 0.1 }}
            />
          </motion.button>
        )}

        {/* Reset Fault */}
        {(state.overloadTripped || state.faultCondition) && (
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg 
                       shadow-lg border-2 border-blue-500 flex items-center justify-center space-x-2
                       relative overflow-hidden"
            onClick={resetFault}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RotateCcw size={18} />
            <span>RESET FAULT</span>
            
            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              whileTap={{ opacity: 0.2 }}
              transition={{ duration: 0.1 }}
            />
          </motion.button>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-600">
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${
              state.motorState === MotorState.RUNNING ? 'bg-green-500' : 
              state.motorState === MotorState.STARTING ? 'bg-yellow-500' : 
              state.motorState === MotorState.FAULT ? 'bg-red-500' : 'bg-gray-500'
            }`}
            animate={{
              scale: state.motorState === MotorState.RUNNING ? [1, 1.2, 1] : 1,
              opacity: state.motorState === MotorState.FAULT ? [1, 0.5, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: (state.motorState === MotorState.RUNNING || state.motorState === MotorState.FAULT) ? Infinity : 0
            }}
          />
          <span className="text-sm text-gray-300">Power</span>
        </div>

        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${state.isContactorEnergized ? 'bg-orange-500' : 'bg-gray-500'}`}
            animate={{
              scale: state.isContactorEnergized ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 0.8,
              repeat: state.isContactorEnergized ? Infinity : 0
            }}
          />
          <span className="text-sm text-gray-300">Contactor</span>
        </div>
      </div>
    </div>
  );
}
