'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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

// Types for motor control state
interface MotorControlState {
  motorState: 'STOPPED' | 'STARTING' | 'RUNNING' | 'STOPPING' | 'EMERGENCY_STOP';
  mcbClosed: boolean;
  overloadTripped: boolean;
  currentFlow: boolean;
  runningTime: number;
  motorRPM: number;
  motorTemperature: number;
  systemCurrent: number;
  faultCondition: string | null;
}

// Import the actual useMotorControl hook
import { useMotorControl } from '@/hooks/useMotorControl';

// Map the motor state to the expected format
const mapMotorState = (state: any) => ({
  motorState: state.motorState,
  mcbClosed: state.mcbClosed,
  overloadTripped: state.overloadTripped,
  currentFlow: state.currentFlow,
  runningTime: state.runningTime,
  motorRPM: state.motorRPM,
  motorTemperature: state.motorTemperature,
  systemCurrent: state.systemCurrent,
  faultCondition: state.faultCondition,
  isEmergencyStopActive: state.isEmergencyStopActive,
  isContactorEnergized: state.isContactorEnergized,
  isStartButtonPressed: state.isStartButtonPressed,
  isStopButtonPressed: state.isStopButtonPressed,
});

// Custom hook to adapt the useMotorControl for the ControlPanel component
const useAdaptedMotorControl = () => {
  const { state, ...actions } = useMotorControl();
  
  const adaptedState = mapMotorState(state);
  
  return {
    state: adaptedState,
    pressStartButton: () => {
      actions.pressStartButton();
    },
    pressStopButton: () => {
      actions.pressStopButton();
    },
    triggerEmergencyStop: actions.triggerEmergencyStop,
    resetEmergencyStop: actions.resetEmergencyStop,
    toggleMCB: actions.toggleMCB,
    resetOverload: actions.resetOverload,
    resetRuntime: actions.resetRuntime,
  };
};

// Types
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps {
  children: React.ReactNode;
  side?: string;
}

// UI Components
const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', size = 'default', onClick, disabled = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-11 px-8',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    outline: 'text-foreground border border-input',
  };
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Tooltip: React.FC<TooltipProps> = ({ children }) => <>{children}</>;
const TooltipProvider: React.FC<TooltipProps> = ({ children }) => <>{children}</>;
const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, asChild }) => <>{children}</>;
const TooltipContent: React.FC<TooltipContentProps> = ({ children, side }) => null;

const cn = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ');

// Format time in HH:MM:SS
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00:00';
  
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  return [hours, minutes, secs]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
};

export default function ControlPanel() {
  // Get motor control state and actions
  const { 
    state, 
    pressStartButton, 
    pressStopButton, 
    triggerEmergencyStop, 
    resetEmergencyStop, 
    toggleMCB, 
    resetOverload,
    resetRuntime 
  } = useAdaptedMotorControl();
  
  // State for active button and animations
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Extract state values with proper destructuring
  const {
    motorState,
    mcbClosed,
    overloadTripped,
    currentFlow,
    runningTime,
    motorRPM,
    motorTemperature,
    systemCurrent,
    faultCondition,
  } = state;

  // Computed state values
  const isRunning = motorState === 'RUNNING';
  const isStarting = motorState === 'STARTING';
  const isStopping = motorState === 'STOPPING';
  const isEmergency = motorState === 'EMERGENCY_STOP';
  const isStopped = motorState === 'STOPPED';
  const isReadyToStart = mcbClosed && !overloadTripped && !isEmergency && isStopped;

  // Status helpers
  const getStatusColor = () => {
    if (isEmergency) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (overloadTripped) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (isRunning) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (isStarting) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = () => {
    if (isEmergency) return 'Emergency Stop';
    if (overloadTripped) return 'Overload Tripped';
    if (isRunning) return 'Running';
    if (isStarting) return 'Starting...';
    if (isStopping) return 'Stopping...';
    return 'Stopped';
  };

  const handleStartPress = () => {
    if (!isReadyToStart) return;
    pressStartButton();
    setActiveButton('start');
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleStopPress = () => {
    pressStopButton();
    setActiveButton('stop');
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleEmergencyStop = () => {
    if (isEmergency) {
      resetEmergencyStop();
    } else {
      triggerEmergencyStop();
    }
    setActiveButton('emergency');
    setTimeout(() => setActiveButton(null), 300);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Status Bar */}
          <div className="mb-4">
            <div className={`p-4 rounded-xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between ${getStatusColor()} border backdrop-blur-xl shadow-lg`}>
              <div className="flex items-center mb-2 sm:mb-0">
                {isEmergency ? (
                  <AlertTriangle className="w-6 h-6 mr-3 animate-pulse" />
                ) : overloadTripped ? (
                  <AlertCircle className="w-6 h-6 mr-3 animate-pulse" />
                ) : isRunning ? (
                  <Activity className="w-6 h-6 mr-3 animate-pulse" />
                ) : isStarting ? (
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                ) : (
                  <Power className="w-6 h-6 mr-3" />
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Motor Control Dashboard</h1>
                  <p className="text-sm opacity-80">Industrial Control System v2.1</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`h-3 w-3 rounded-full ${
                  isRunning
                    ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/60'
                    : isStarting || isStopping
                    ? 'bg-blue-400 animate-pulse shadow-lg shadow-blue-400/60'
                    : isEmergency || overloadTripped
                    ? 'bg-red-400 animate-pulse shadow-lg shadow-red-400/60'
                    : 'bg-slate-500'
                }`} />
                <Badge className={cn(
                  "px-3 py-1 text-sm font-bold",
                  isRunning ? "bg-green-500/20 text-green-400 border-green-500/50" :
                  isStarting || isStopping ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                  isEmergency || overloadTripped ? "bg-red-500/20 text-red-400 border-red-500/50" :
                  "bg-slate-500/20 text-slate-400 border-slate-500/50"
                )}>
                  {getStatusText().toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content - Single Column Layout */}
          <div className="flex flex-col space-y-4">
            {/* Controls Section */}
            <div className="space-y-4">
              
              {/* System Status */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center">
                    <Signal className="h-5 w-5 text-emerald-400 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* MCB and Current Flow Status */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 font-medium">MAIN CIRCUIT BREAKER</span>
                        <div className={`w-3 h-3 rounded-full ${mcbClosed ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-500'}`}></div>
                      </div>
                      <div className={`text-lg font-bold ${mcbClosed ? 'text-green-400' : 'text-gray-400'}`}>
                        {mcbClosed ? 'POWER ON' : 'POWER OFF'}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 font-medium">CURRENT FLOW</span>
                        <div className={`w-3 h-3 rounded-full ${currentFlow ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50' : 'bg-gray-500'}`}></div>
                      </div>
                      <div className={`text-lg font-bold ${currentFlow ? 'text-blue-400' : 'text-gray-400'}`}>
                        {currentFlow ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </div>

                  {/* Runtime Display */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-400">Runtime</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-blue-400 hover:bg-blue-500/10 h-6 px-2"
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
                    <div className="text-xl font-mono font-bold text-white">
                      {formatTime(runningTime)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control Buttons */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center">
                    <Settings className="h-5 w-5 text-blue-400 mr-2" />
                    Motor Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  {/* Start/Stop Buttons */}
                  <div className="space-y-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleStartPress}
                          disabled={!isReadyToStart || isStarting || isStopping}
                          className={cn(
                            'relative h-12 w-full rounded-lg font-bold text-white transition-all duration-300 overflow-hidden',
                            'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
                            'transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/30',
                            (!isReadyToStart || isStarting || isStopping) && 'opacity-50 cursor-not-allowed hover:scale-100',
                            isStarting && 'animate-pulse',
                            activeButton === 'start' && 'scale-95'
                          )}
                        >
                          <div className="h-full flex items-center justify-center space-x-2">
                            {isStarting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Starting...</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-5 w-5" />
                                <span className="text-sm">START MOTOR</span>
                              </>
                            )}
                          </div>
                        </button>
                      </TooltipTrigger>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleStopPress}
                          disabled={!isRunning && !isStarting && !isStopping}
                          className={cn(
                            'relative h-12 w-full rounded-lg font-bold text-white transition-all duration-300 overflow-hidden',
                            'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400',
                            'focus:outline-none focus:ring-2 focus:ring-red-400/50',
                            'transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/30',
                            (!isRunning && !isStarting && !isStopping) && 'opacity-50 cursor-not-allowed hover:scale-100',
                            isStopping && 'animate-pulse',
                            activeButton === 'stop' && 'scale-95'
                          )}
                        >
                          <div className="h-full flex items-center justify-center space-x-2">
                            {isStopping ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Stopping...</span>
                              </>
                            ) : (
                              <>
                                <Square className="h-5 w-5" />
                                <span className="text-sm">STOP MOTOR</span>
                              </>
                            )}
                          </div>
                        </button>
                      </TooltipTrigger>
                    </Tooltip>
                  </div>

                  {/* System Controls */}
                  <div className="space-y-3 pt-3 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      className="w-full h-10 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 text-sm"
                      onClick={toggleMCB}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {mcbClosed ? 'OPEN MCB' : 'CLOSE MCB'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-10 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 text-sm"
                      onClick={resetOverload}
                      disabled={!overloadTripped}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      RESET OVERLOAD
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Stop */}
              <Card className={cn(
                'backdrop-blur-xl border-2 transition-all duration-300 shadow-xl',
                isEmergency 
                  ? 'bg-red-500/20 border-red-500/60 shadow-red-500/20' 
                  : 'bg-slate-900/80 border-slate-700/50'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-red-400" />
                    <span className="font-bold text-white text-sm">Emergency Control</span>
                  </div>
                  <Button
                    className={cn(
                      'w-full h-12 font-bold transition-all duration-300 text-sm',
                      isEmergency 
                        ? 'bg-red-500/20 border-2 border-red-400 text-red-400 hover:bg-red-500/30' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/30',
                      activeButton === 'emergency' && 'scale-95'
                    )}
                    onClick={handleEmergencyStop}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {isEmergency ? 'RESET EMERGENCY' : 'EMERGENCY STOP'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <Activity className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">Live Motor Metrics</CardTitle>
                        <CardDescription className="text-slate-400">
                          Real-time performance monitoring
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-sm text-slate-400 font-medium">LIVE</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-9">
                  
                  {/* Primary Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Speed Metric */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge variant="outline" className="text-xs py-1 px-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                          {motorState}
                        </Badge>
                        <Badge variant="outline" className="text-xs py-1 px-2 bg-blue-500/10 border-blue-500/30 text-blue-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(runningTime)}
                        </Badge>
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-white mb-2">
                          {Math.round(motorRPM)}
                        </div>
                        <div className="text-sm text-slate-400">RPM</div>
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
                            animate={{ width: `${Math.min(100, (motorRPM / 1500) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Temperature Metric */}
                    <div className={cn(
                      "rounded-xl p-6 border backdrop-blur-sm",
                      motorTemperature > 70 
                        ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20' 
                        : motorTemperature > 50 
                          ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20'
                          : 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20'
                    )}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={cn(
                          "p-2 rounded-lg border",
                          motorTemperature > 70 
                            ? 'bg-red-500/20 border-red-500/30' 
                            : motorTemperature > 50 
                              ? 'bg-amber-500/20 border-amber-500/30'
                              : 'bg-emerald-500/20 border-emerald-500/30'
                        )}>
                          <Thermometer className={cn(
                            "h-6 w-6",
                            motorTemperature > 70 ? 'text-red-400' : 
                            motorTemperature > 50 ? 'text-amber-400' : 'text-emerald-400'
                          )} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Temperature</h3>
                          <p className="text-xs text-slate-400">Motor heat level</p>
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-white mb-2">
                          {Math.round(motorTemperature)}
                        </div>
                        <div className="text-sm text-slate-400">°C</div>
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
                              motorTemperature > 70 
                                ? 'bg-gradient-to-r from-red-500 to-orange-400' 
                                : motorTemperature > 50 
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                  : 'bg-gradient-to-r from-emerald-500 to-green-400'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (motorTemperature / 100) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-600/50">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Cpu className="h-5 w-5 text-purple-400 mr-2" />
                      Electrical Parameters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Current */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className={cn(
                              "h-5 w-5",
                              currentFlow ? 'text-yellow-400' : 'text-slate-500'
                            )} />
                            <span className="text-sm font-medium text-slate-300">System Current</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {systemCurrent.toFixed(1)}
                            <span className="text-sm font-normal text-slate-400 ml-1">A</span>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (systemCurrent / 20) * 100)}%` }}
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
                            "text-sm font-bold px-3 py-1 rounded-lg",
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

              {/* System Status Overview */}
              <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">System Status Overview</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className={`h-3 w-3 rounded-full mb-2 ${mcbClosed ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400'}`} />
                      <span className="text-slate-400 text-xs mb-1">MCB</span>
                      <span className={`font-bold text-sm ${mcbClosed ? 'text-green-400' : 'text-red-400'}`}>
                        {mcbClosed ? 'CLOSED' : 'OPEN'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className={`h-3 w-3 rounded-full mb-2 ${!overloadTripped ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 animate-pulse'}`} />
                      <span className="text-slate-400 text-xs mb-1">Overload</span>
                      <span className={`font-bold text-sm ${!overloadTripped ? 'text-green-400' : 'text-red-400'}`}>
                        {overloadTripped ? 'TRIPPED' : 'OK'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className={`h-3 w-3 rounded-full mb-2 ${currentFlow ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50' : 'bg-slate-500'}`} />
                      <span className="text-slate-400 text-xs mb-1">Current</span>
                      <span className={`font-bold text-sm ${currentFlow ? 'text-yellow-400' : 'text-slate-400'}`}>
                        {currentFlow ? 'FLOW' : 'NO FLOW'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className={`h-3 w-3 rounded-full mb-2 ${
                        isRunning ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 
                        isEmergency ? 'bg-red-400 animate-pulse shadow-lg shadow-red-400/50' : 
                        'bg-slate-500'
                      }`} />
                      <span className="text-slate-400 text-xs mb-1">Motor</span>
                      <span className={`font-bold text-sm ${
                        isRunning ? 'text-green-400' : 
                        isEmergency ? 'text-red-400' : 
                        'text-slate-400'
                      }`}>
                        {motorState}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alert Messages */}
          <AnimatePresence>
            {(faultCondition || isEmergency || overloadTripped) && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className={cn(
                  'mt-6 p-4 rounded-xl flex items-center space-x-4 backdrop-blur-xl border shadow-2xl',
                  isEmergency
                    ? 'bg-red-500/10 border-red-500/40 shadow-red-500/20'
                    : overloadTripped
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-amber-500/20'
                    : 'bg-blue-500/10 border-blue-500/40 shadow-blue-500/20'
                )}
              >
                <div className={cn(
                  'p-3 rounded-lg flex-shrink-0',
                  isEmergency ? 'bg-red-500/20' : overloadTripped ? 'bg-amber-500/20' : 'bg-blue-500/20'
                )}>
                  <AlertCircle className={cn(
                    'h-6 w-6',
                    isEmergency ? 'text-red-400' : overloadTripped ? 'text-amber-400' : 'text-blue-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-lg">
                    {isEmergency ? 'EMERGENCY STOP ACTIVATED' : overloadTripped ? 'MOTOR OVERLOAD DETECTED' : 'SYSTEM NOTICE'}
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    {faultCondition || 
                     (overloadTripped ? 'Motor protection activated - reset required before restart' : 
                      'System requires attention')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {isEmergency && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetEmergencyStop}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Reset
                    </Button>
                  )}
                  {overloadTripped && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetOverload}
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}