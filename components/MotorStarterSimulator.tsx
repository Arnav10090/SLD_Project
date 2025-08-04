'use client';

import { motion } from 'framer-motion';
import ControlCircuit from './ControlCircuit';
import PowerCircuit from './PowerCircuit';
import ControlPanel from './ControlPanel';
import StatusDisplay from './StatusDisplay';
import { useMotorControl } from '@/hooks/useMotorControl';

export default function MotorStarterSimulator() {
  const { state } = useMotorControl();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            DOL Motor Starter
            <span className="block text-2xl lg:text-3xl font-normal text-blue-400 mt-2">
              Control Circuit Simulator
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Control Circuit */}
          <motion.div
            className="xl:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Control Circuit
              </h2>
              <ControlCircuit />
            </div>
          </motion.div>

          {/* Power Circuit */}
          <motion.div
            className="xl:col-span-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                Power Circuit
              </h2>
              <PowerCircuit />
            </div>
          </motion.div>

          {/* Control Panel & Status */}
          <motion.div
            className="xl:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                Control Panel
              </h2>
              <ControlPanel />
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                System Status
              </h2>
              <StatusDisplay />
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.footer
          className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-sm">
            Interactive DOL Motor Starter Simulation • Educational Purpose
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
