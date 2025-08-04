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
  };

  const handleStartRelease = () => {
    if (isDisabled) return;
    releaseStartButton();
  };

  const handleStopPress = () => {
    if (isEmergency || isOverload) return;
    pressStopButton();
  };

  const handleStopRelease = () => {
    if (isEmergency || isOverload) return;
    releaseStopButton();
  };

  // Add pulsing animation for active states
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isStarting || isStopping) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarting, isStopping]);

  // Get status badge variant based on motor state
  const getStatusBadgeVariant = () => {
    if (isEmergency) return 'destructive';
    if (isOverload) return 'destructive';
    if (isRunning) return 'default';
    if (isStarting || isStopping) return 'secondary';
    return 'outline';
  };

  const getStatusText = () => {
    if (isEmergency) return 'Emergency Stop';
    if (isOverload) return 'Overload Tripped';
    if (isRunning) return 'Running';
    if (isStarting) return 'Starting...';
    if (isStopping) return 'Stopping...';
    return 'Stopped';
  };

  const getStatusIcon = () => {
    if (isEmergency) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (isOverload) return <CircleAlert className="h-5 w-5 text-amber-500" />;
    if (isRunning) return <CircleCheck className="h-5 w-5 text-green-500" />;
    if (isStarting || isStopping) return (
      <RotateCcw className="h-5 w-5 text-blue-500 animate-spin" />
    );
    return <CirclePause className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Bar */}
        <Card className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'h-6 w-6 rounded-full',
                  isRunning
                    ? 'bg-green-500'
                    : isStarting || isStopping
                    ? 'bg-blue-500 animate-pulse'
                    : isEmergency || isOverload
                    ? 'bg-red-500'
                    : 'bg-muted-foreground'
                )}
              />
              <div>
                <h3 className="text-lg font-medium">Motor Status</h3>
                <p className="text-sm text-muted-foreground">
                  {getStatusText()}
                </p>
              </div>
            </div>
            <Badge variant={getStatusBadgeVariant()} className="text-sm">
              <div className="flex items-center space-x-1.5">
                {getStatusIcon()}
                <span>{getStatusText().toUpperCase()}</span>
              </div>
            </Badge>
          </div>
        </Card>

        {/* Motor Metrics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Motor Metrics
            </CardTitle>
            <CardDescription>Real-time operating parameters</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 grid grid-cols-2 gap-4">
            {/* Individual Metric Cards */}
            {/* Example: Speed, Runtime, Current, Temperature */}
            {[
              {
                label: 'Speed',
                value: state.motorRPM,
                unit: 'RPM',
                icon: <Gauge className="h-6 w-6 text-blue-500" />,
                color: 'blue',
                maxValue: 1500,
              },
              {
                label: 'Runtime',
                value: formatTime(state.runningTime),
                unit: '',
                icon: <Clock className="h-6 w-6 text-amber-500" />,
                color: 'amber',
                maxValue: 60, //seconds
              },
              {
                label: 'Current',
                value: state.systemCurrent.toFixed(1),
                unit: 'A',
                icon: (
                  <Zap
                    className={cn(
                      'h-6 w-6',
                      state.currentFlow ? 'text-yellow-500' : 'text-muted-foreground'
                    )}
                  />
                ),
                color: 'yellow',
                maxValue: 20,
              },
              {
                label: 'Temperature',
                value: Math.round(state.motorTemperature),
                unit: '°C',
                icon: (
                  <Thermometer
                    className={cn(
                      'h-6 w-6',
                      state.motorTemperature > 70 ? 'text-red-500' : state.motorTemperature > 50 ? 'text-amber-500' : 'text-blue-500'
                    )}
                  />
                ),
                color: state.motorTemperature > 70 ? 'red' : state.motorTemperature > 50 ? 'amber' : 'blue',
                maxValue: 100,
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="flex flex-col p-4 bg-muted/50 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </span>
                  {metric.icon}
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    {metric.value}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {metric.unit}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-${metric.color}-500 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        (metric.value / metric.maxValue) * 100
                      )}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Control Buttons and System Controls */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Motor & System Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Motor Control Buttons */}
            <div>
              <div className="space-y-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isRunning ? 'secondary' : 'default'}
                      size="lg"
                      className={cn(
                        'h-28 w-full text-lg font-semibold transition-all duration-200 relative overflow-hidden',
                        'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600',
                        'dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700',
                        isStarting && 'animate-pulse',
                        (!isReadyToStart || isStarting || isStopping) &&
                          'opacity-50 cursor-not-allowed'
                      )}
                      onClick={handleStartPress}
                      disabled={!isReadyToStart || isStarting || isStopping}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      {isStarting ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin mb-1.5" />
                          <span>Starting...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <PlayCircle className="h-8 w-8 mb-1.5" />
                          <span>START</span>
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start the motor</p>
                    {!isReadyToStart && (
                      <p className="text-xs text-amber-500 mt-1">
                        {isEmergency
                          ? 'Emergency Stop is active'
                          : !state.mcbClosed
                          ? 'MCB is turned off'
                          : state.overloadTripped
                          ? 'Motor is in overload state'
                          : 'Motor is not ready to start'}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      className={cn(
                        'w-full h-28 text-lg font-bold transition-all',
                        (isEmergency || isOverload)
                          ? 'cursor-not-allowed'
                          : 'hover:scale-[1.02] active:scale-95'
                      )}
                      onMouseDown={handleStopPress}
                      onMouseUp={handleStopRelease}
                      onMouseLeave={handleStopRelease}
                      onTouchStart={handleStopPress}
                      onTouchEnd={handleStopRelease}
                      disabled={!isRunning && !isStarting && !isStopping}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Square className="h-8 w-8 mb-1.5" />
                        <span>STOP</span>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {(isEmergency || isOverload) ? (
                      <p>Reset emergency stop or overload first</p>
                    ) : (
                      <p>Stop the motor</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* System Controls */}
            <div className="space-y-4">
              {/* Emergency Stop */}
              <Card className={cn('border-2', isEmergency ? 'border-red-500' : '')}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                    <AlertTriangle
                      className={cn(
                        'h-5 w-5',
                        isEmergency ? 'text-red-500 animate-pulse' : 'text-amber-500'
                      )}
                    />
                    <span>Emergency Stop</span>
                  </CardTitle>
                  <CardDescription>
                    {isEmergency ? 'Emergency stop activated' : 'Press in case of emergency'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={isEmergency ? 'outline' : 'destructive'}
                    size="lg"
                    className={cn(
                      'w-full h-16 text-lg font-bold transition-all',
                      isEmergency ? 'border-red-500 text-red-500' : 'hover:scale-[1.02] active:scale-95'
                    )}
                    onClick={isEmergency ? resetEmergencyStop : triggerEmergencyStop}
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>{isEmergency ? 'RESET E-STOP' : 'EMERGENCY STOP'}</span>
                    </div>
                  </Button>
                  {isEmergency && (
                    <div className="text-center text-sm text-red-500 font-medium">
                      Emergency stop active. Press RESET to continue.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* MCB and Overload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Main Circuit Breaker</span>
                  <Badge variant={state.mcbClosed ? 'default' : 'destructive'}>
                    {state.mcbClosed ? 'CLOSED' : 'OPEN'}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12"
                  onClick={toggleMCB}
                  disabled={isEmergency || isOverload}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {state.mcbClosed ? 'OPEN MCB' : 'CLOSE MCB'}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overload Protection</span>
                  <Badge variant={state.overloadTripped ? 'destructive' : 'default'}>
                    {state.overloadTripped ? 'TRIPPED' : 'NORMAL'}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12"
                  onClick={resetOverload}
                  disabled={!state.overloadTripped}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  RESET OVERLOAD
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={resetRuntime}
              >
                <Clock className="h-4 w-4 mr-2" />
                Reset Runtime Counter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages (Improved Animation) */}
        <AnimatePresence initial={false} custom={{ y: 20 }}>
          {(state.faultCondition || isEmergency || isOverload) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                'p-4 rounded-lg flex items-start space-x-3',
                isEmergency
                  ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                  : isOverload
                  ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'
                  : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
              )}
            >
              <AlertCircle
                className={cn(
                  'h-5 w-5 mt-0.5 flex-shrink-0',
                  isEmergency ? 'text-red-500' : isOverload ? 'text-amber-500' : 'text-blue-500'
                )}
              />
              <div>
                <p className="font-medium">
                  {isEmergency ? 'EMERGENCY STOP ACTIVATED' : isOverload ? 'MOTOR OVERLOAD DETECTED' : 'SYSTEM NOTICE'}
                </p>
                <p className="text-sm">{state.faultCondition}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
