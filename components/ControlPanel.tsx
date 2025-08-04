'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMotorControl } from '@/hooks/useMotorControl';
import {
  Play,
  Square,
  AlertTriangle,
  RotateCcw,
  Zap,
  Power,
  Clock,
  Thermometer,
  Gauge,
  AlertCircle,
  CircleAlert,
  CircleCheck,
  CirclePause,
  Loader2,
  PlayCircle,
  Activity,
  Shield,
  Settings,
  MonitorSpeaker,
  Cpu,
  Battery,
  Signal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Format time in HH:MM:SS
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
};

export default function ControlPanel() {
  const {
    state,
    pressStartButton,
    releaseStartButton,
    pressStopButton,
    releaseStopButton,
    triggerEmergencyStop,
    resetEmergencyStop,
    toggleMCB,
    resetOverload,
    resetRuntime,
  } = useMotorControl();
  
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const isRunning = state.motorState === 'RUNNING';
  const isStarting = state.motorState === 'STARTING';
  const isStopping = state.motorState === 'STOPPING';
  const isEmergency = state.motorState === 'EMERGENCY_STOP';
  const isOverload = state.overloadTripped;
  const isMCBOn = state.mcbClosed;
  const isReadyToStart = isMCBOn && !isEmergency && !isOverload;
  const isDisabled = !isMCBOn || isEmergency || isOverload;

  const handleStartPress = () => {
    if (isDisabled) return;
    pressStartButton();
    setActiveButton('start');
  };

  const handleStartRelease = () => {
    if (isDisabled) return;
    releaseStartButton();
    setActiveButton(null);
  };

  const handleStopPress = () => {
    if (isEmergency || isOverload) return;
    pressStopButton();
    setActiveButton('stop');
  };

  const handleStopRelease = () => {
    if (isEmergency || isOverload) return;
    releaseStopButton();
    setActiveButton(null);
  };

  const getStatusText = () => {
    if (isEmergency) return 'Emergency Stop';
    if (isOverload) return 'Overload Tripped';
    if (isRunning) return 'Running';
    if (isStarting) return 'Starting...';
    if (isStopping) return 'Stopping...';
    return 'Stopped';
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Responsive Header */}
          <header className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 bg-slate-800/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-700/50 shadow-lg">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex-shrink-0">
                  <MonitorSpeaker className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                </div>
                <div className="ml-3 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white truncate">Motor Control Dashboard</h1>
                  <p className="text-slate-400 text-xs sm:text-sm truncate">Industrial Control System v2.1</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 w-full xs:w-auto justify-between xs:justify-normal">
                <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                  isRunning
                    ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/60'
                    : isStarting || isStopping
                    ? 'bg-blue-400 animate-pulse shadow-lg shadow-blue-400/60'
                    : isEmergency || isOverload
                    ? 'bg-red-400 animate-pulse shadow-lg shadow-red-400/60'
                    : 'bg-slate-500'
                }`} />
                <Badge className={cn(
                  "px-2.5 py-1 text-[10px] xs:text-xs font-medium whitespace-nowrap",
                  isRunning ? "bg-green-500/20 text-green-400 border-green-500/50" :
                  isStarting || isStopping ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                  isEmergency || isOverload ? "bg-red-500/20 text-red-400 border-red-500/50" :
                  "bg-slate-500/20 text-slate-400 border-slate-500/50"
                )}>
                  {getStatusText().toUpperCase()}
                </Badge>
              </div>
            </div>
          </header>

          {/* Responsive Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {/* Left Sidebar - Controls */}
            <div className="md:col-span-2 lg:col-span-1 space-y-4">
              
              {/* System Status - Compact */}
              <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-white flex items-center">
                    <Signal className="h-4 w-4 text-emerald-400 mr-2" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">MCB</span>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${state.mcbClosed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <span className={`text-xs font-bold ${state.mcbClosed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {state.mcbClosed ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Protection</span>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${state.overloadTripped ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className={`text-xs font-bold ${state.overloadTripped ? 'text-red-400' : 'text-emerald-400'}`}>
                        {state.overloadTripped ? 'TRIP' : 'OK'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-slate-400">Runtime</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-blue-400 hover:bg-blue-500/10 h-5 px-1"
                        onClick={() => {
                          resetRuntime();
                          if (isEmergency) {
                            resetEmergencyStop();
                          }
                        }}
                      >
                        {isEmergency ? 'Reset All' : 'Reset'}
                      </Button>
                    </div>
                    <div className="text-sm font-mono font-bold text-white">
                      {formatTime(state.runningTime)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control Buttons - Compact */}
              <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-white flex items-center">
                    <Settings className="h-4 w-4 text-blue-400 mr-2" />
                    Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Start/Stop Buttons */}
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onMouseDown={handleStartPress}
                          onMouseUp={handleStartRelease}
                          onMouseLeave={handleStartRelease}
                          disabled={!isReadyToStart || isStarting || isStopping}
                          className={cn(
                            'relative h-12 w-full rounded-lg font-bold text-white transition-all duration-300 overflow-hidden',
                            'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
                            'transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/30',
                            (!isReadyToStart || isStarting || isStopping) && 'opacity-50 cursor-not-allowed hover:scale-100',
                            isStarting && 'animate-pulse'
                          )}
                        >
                          <div className="h-full flex items-center justify-center space-x-2">
                            {isStarting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Starting...</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4" />
                                <span className="text-sm">START</span>
                              </>
                            )}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Start motor operation</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onMouseDown={handleStopPress}
                          onMouseUp={handleStopRelease}
                          onMouseLeave={handleStopRelease}
                          disabled={!isRunning && !isStarting && !isStopping}
                          className={cn(
                            'relative h-12 w-full rounded-lg font-bold text-white transition-all duration-300 overflow-hidden',
                            'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400',
                            'focus:outline-none focus:ring-2 focus:ring-red-400/50',
                            'transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/30',
                            (!isRunning && !isStarting && !isStopping) && 'opacity-50 cursor-not-allowed hover:scale-100',
                            isStopping && 'animate-pulse'
                          )}
                        >
                          <div className="h-full flex items-center justify-center space-x-2">
                            {isStopping ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Stopping...</span>
                              </>
                            ) : (
                              <>
                                <Square className="h-4 w-4" />
                                <span className="text-sm">STOP</span>
                              </>
                            )}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Stop motor operation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* System Controls */}
                  <div className="space-y-2 pt-2 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      className="w-full h-8 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 text-xs"
                      onClick={toggleMCB}
                      disabled={isOverload}  // Removed isEmergency from disabled condition
                    >
                      <Power className="h-3 w-3 mr-2" />
                      {state.mcbClosed ? 'OPEN MCB' : 'CLOSE MCB'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-8 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 text-xs"
                      onClick={resetOverload}
                      disabled={!state.overloadTripped}
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      RESET OVERLOAD
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Stop - Compact */}
              <Card className={cn(
                'backdrop-blur-xl border-2 transition-all duration-300',
                isEmergency 
                  ? 'bg-red-500/20 border-red-500/60 shadow-red-500/20' 
                  : 'bg-slate-900/70 border-slate-700/50'
              )}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-red-400" />
                    <span className="font-bold text-white text-sm">Emergency</span>
                  </div>
                  <Button
                    className={cn(
                      'w-full h-10 font-bold transition-all duration-300 text-xs',
                      isEmergency 
                        ? 'bg-red-500/20 border-2 border-red-400 text-red-400 hover:bg-red-500/30' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/30'
                    )}
                    onClick={isEmergency ? resetEmergencyStop : triggerEmergencyStop}
                  >
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    {isEmergency ? 'RESET' : 'E-STOP'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area - Metrics */}
            <div className="md:col-span-3 lg:col-span-4 space-y-6">
              <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-700/50 shadow-2xl h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <Activity className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">Live Motor Metrics</CardTitle>
                        <CardDescription className="text-slate-400">
                          Real-time performance monitoring
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs text-slate-400 font-medium">LIVE</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Responsive Primary Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Speed Metric - Responsive */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 sm:p-6 border border-blue-500/20 backdrop-blur-sm h-full">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
                          <Gauge className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Motor Speed</h3>
                          <p className="text-sm text-slate-400">Current RPM</p>
                        </div>
                      </div>
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-white mb-2">
                          {state.motorRPM}
                        </div>
                        <div className="text-lg text-slate-400">RPM</div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>0</span>
                          <span>1500</span>
                        </div>
                        <div className="h-4 bg-slate-800/60 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (state.motorRPM / 1500) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Temperature Metric - Responsive */}
                    <div className={cn(
                      "rounded-2xl p-4 sm:p-6 border backdrop-blur-sm h-full",
                      state.motorTemperature > 70 
                        ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20' 
                        : state.motorTemperature > 50 
                          ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20'
                          : 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20'
                    )}>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={cn(
                          "p-4 rounded-xl border",
                          state.motorTemperature > 70 
                            ? 'bg-red-500/20 border-red-500/30' 
                            : state.motorTemperature > 50 
                              ? 'bg-amber-500/20 border-amber-500/30'
                              : 'bg-emerald-500/20 border-emerald-500/30'
                        )}>
                          <Thermometer className={cn(
                            "h-8 w-8",
                            state.motorTemperature > 70 ? 'text-red-400' : 
                            state.motorTemperature > 50 ? 'text-amber-400' : 'text-emerald-400'
                          )} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Temperature</h3>
                          <p className="text-sm text-slate-400">Motor heat level</p>
                        </div>
                      </div>
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-white mb-2">
                          {Math.round(state.motorTemperature)}
                        </div>
                        <div className="text-lg text-slate-400">°C</div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>0°C</span>
                          <span>100°C</span>
                        </div>
                        <div className="h-4 bg-slate-800/60 rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-full rounded-full",
                              state.motorTemperature > 70 
                                ? 'bg-gradient-to-r from-red-500 to-orange-400' 
                                : state.motorTemperature > 50 
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                  : 'bg-gradient-to-r from-emerald-500 to-green-400'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (state.motorTemperature / 100) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Responsive Secondary Metrics */}
                  <div className="bg-slate-800/40 rounded-xl p-4 sm:p-6 border border-slate-600/50">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Cpu className="h-5 w-5 text-purple-400 mr-2" />
                      Electrical Parameters
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Current */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className={cn(
                              "h-5 w-5",
                              state.currentFlow ? 'text-yellow-400' : 'text-slate-500'
                            )} />
                            <span className="text-sm font-medium text-slate-300">System Current</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {state.systemCurrent.toFixed(1)}
                            <span className="text-sm font-normal text-slate-400 ml-1">A</span>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (state.systemCurrent / 20) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Power Status */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Battery className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-medium text-slate-300">Power Status</span>
                          </div>
                          <div className={cn(
                            "text-lg font-bold px-3 py-1 rounded-lg",
                            isRunning ? 'text-green-400 bg-green-500/20' : 'text-slate-400 bg-slate-500/20'
                          )}>
                            {isRunning ? 'ACTIVE' : 'STANDBY'}
                          </div>
                        </div>
                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-full rounded-full",
                              isRunning ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-slate-600'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: isRunning ? '100%' : '0%' }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alert Messages */}
          <AnimatePresence>
            {(state.faultCondition || isEmergency || isOverload) && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  'mt-4 p-4 rounded-xl flex items-center space-x-4 backdrop-blur-xl border shadow-2xl',
                  isEmergency
                    ? 'bg-red-500/10 border-red-500/40 shadow-red-500/20'
                    : isOverload
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-amber-500/20'
                    : 'bg-blue-500/10 border-blue-500/40 shadow-blue-500/20'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  isEmergency ? 'bg-red-500/20' : isOverload ? 'bg-amber-500/20' : 'bg-blue-500/20'
                )}>
                  <AlertCircle className={cn(
                    'h-5 w-5',
                    isEmergency ? 'text-red-400' : isOverload ? 'text-amber-400' : 'text-blue-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">
                    {isEmergency ? 'EMERGENCY STOP ACTIVATED' : isOverload ? 'MOTOR OVERLOAD DETECTED' : 'SYSTEM NOTICE'}
                  </p>
                  <p className="text-sm text-slate-300">{state.faultCondition}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}