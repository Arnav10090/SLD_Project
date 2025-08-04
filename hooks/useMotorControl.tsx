'use client';

import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

export enum MotorState {
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  FAULT = 'FAULT',
  EMERGENCY_STOP = 'EMERGENCY_STOP',
  OVERLOAD = 'OVERLOAD'
}

interface MotorControlState {
  // Motor state
  motorState: MotorState;
  motorRPM: number;
  ratedRPM: number;
  
  // Control circuit
  isContactorEnergized: boolean;
  isStartButtonPressed: boolean;
  isStopButtonPressed: boolean;
  isEmergencyStopActive: boolean;
  
  // Power circuit
  currentFlow: boolean;
  mcbClosed: boolean;
  overloadTripped: boolean;
  
  // Status and monitoring
  runningTime: number; // in seconds
  startTime: number | null;
  faultCondition: string | null;
  
  // System status
  systemVoltage: number;
  systemCurrent: number;
  motorTemperature: number;
}

type MotorAction = 
  // User actions
  | { type: 'PRESS_START_BUTTON' }
  | { type: 'RELEASE_START_BUTTON' }
  | { type: 'PRESS_STOP_BUTTON' }
  | { type: 'RELEASE_STOP_BUTTON' }
  | { type: 'TRIGGER_EMERGENCY_STOP' }
  | { type: 'RESET_EMERGENCY_STOP' }
  | { type: 'TOGGLE_MCB' }
  | { type: 'RESET_OVERLOAD' }
  | { type: 'RESET_RUNTIME' }
  
  // System actions
  | { type: 'TRIP_OVERLOAD' }
  | { type: 'UPDATE_RUNTIME' }
  | { type: 'UPDATE_MOTOR_STATE'; payload: Partial<MotorControlState> }
  | { type: 'SET_RPM'; payload: number };

const RATED_RPM = 1480; // Standard 4-pole motor at 50Hz
const START_TIME_MS = 2000; // Time for motor to reach full speed

const initialState: MotorControlState = {
  // Motor state
  motorState: MotorState.STOPPED,
  motorRPM: 0,
  ratedRPM: RATED_RPM,
  
  // Control circuit
  isContactorEnergized: false,
  isStartButtonPressed: false,
  isStopButtonPressed: false,
  isEmergencyStopActive: false,
  
  // Power circuit
  currentFlow: false,
  mcbClosed: true,
  overloadTripped: false,
  
  // Status and monitoring
  runningTime: 0,
  startTime: null,
  faultCondition: null,
  
  // System status
  systemVoltage: 400, // 400V 3-phase
  systemCurrent: 0,
  motorTemperature: 25, // °C
};

const MotorContext = createContext<MotorContextType | undefined>(undefined);

export function MotorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(motorReducer, initialState);
  const [rpmInterval, setRpmInterval] = useState<NodeJS.Timeout>();
  const [runtimeInterval, setRuntimeInterval] = useState<NodeJS.Timeout>();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Handle motor RPM changes with smooth acceleration/deceleration
  useEffect(() => {
    // If emergency stop is active, ensure motor is stopped immediately
    if (state.motorState === MotorState.EMERGENCY_STOP) {
      if (state.motorRPM > 0) {
        // Force immediate stop by directly dispatching an update
        dispatch({ type: 'SET_RPM', payload: 0 });
      }
      // Clear any running intervals
      if (rpmInterval) clearInterval(rpmInterval);
      if (runtimeInterval) clearInterval(runtimeInterval);
      return;
    }
    
    if (state.motorState === MotorState.STARTING) {
      // Calculate target RPM based on time since start
      const startTimestamp = state.startTime || Date.now();
      
      const updateRPM = () => {
        const now = Date.now();
        const elapsed = now - startTimestamp;
        const progress = Math.min(elapsed / START_TIME_MS, 1);
        
        // Ease-in-out function for smooth acceleration
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        const progressEased = easeInOutCubic(progress);
        const newRPM = Math.round(RATED_RPM * progressEased);
        
        dispatch({ type: 'SET_RPM', payload: newRPM });
        
        if (progress >= 1) {
          dispatch({ type: 'UPDATE_MOTOR_STATE', payload: { motorState: MotorState.RUNNING } });
        }
      };
      
      const interval = setInterval(updateRPM, 50);
      setRpmInterval(interval);
      
      return () => clearInterval(interval);
      
    } else if (state.motorState === MotorState.STOPPING) {
      // Smooth deceleration when stopping
      const stopTimestamp = Date.now();
      const startRPM = state.motorRPM;
      
      const updateStop = () => {
        const now = Date.now();
        const elapsed = now - stopTimestamp;
        const progress = Math.min(elapsed / (START_TIME_MS * 0.8), 1); // Slightly faster stop
        
        // Ease-out function for smooth deceleration
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const progressEased = easeOutCubic(progress);
        
        const newRPM = Math.round(startRPM * (1 - progressEased));
        dispatch({ type: 'SET_RPM', payload: newRPM });
        
        if (progress >= 1) {
          dispatch({ type: 'UPDATE_MOTOR_STATE', payload: { 
            motorState: state.motorState === MotorState.EMERGENCY_STOP 
              ? MotorState.EMERGENCY_STOP 
              : MotorState.STOPPED,
            motorRPM: 0,
            currentFlow: false,
            isContactorEnergized: false
          }});
        }
      };
      
      const interval = setInterval(updateStop, 30);
      setRpmInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [state.motorState, state.startTime]);

  // Handle runtime updates
  useEffect(() => {
    if (state.motorState === MotorState.RUNNING) {
      const interval = setInterval(() => {
        dispatch({ type: 'UPDATE_RUNTIME' });
      }, 1000);
      setRuntimeInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (runtimeInterval) {
      clearInterval(runtimeInterval);
      setRuntimeInterval(undefined);
    }
  }, [state.motorState]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (rpmInterval) clearInterval(rpmInterval);
      if (runtimeInterval) clearInterval(runtimeInterval);
    };
  }, [rpmInterval, runtimeInterval]);

  // Public API methods
  const pressStartButton = () => dispatch({ type: 'PRESS_START_BUTTON' });
  const releaseStartButton = () => dispatch({ type: 'RELEASE_START_BUTTON' });
  const pressStopButton = () => dispatch({ type: 'PRESS_STOP_BUTTON' });
  const releaseStopButton = () => dispatch({ type: 'RELEASE_STOP_BUTTON' });
  const triggerEmergencyStop = () => dispatch({ type: 'TRIGGER_EMERGENCY_STOP' });
  const resetEmergencyStop = () => dispatch({ type: 'RESET_EMERGENCY_STOP' });
  const toggleMCB = () => dispatch({ type: 'TOGGLE_MCB' });
  const tripOverload = () => dispatch({ type: 'TRIP_OVERLOAD' });
  const resetOverload = () => dispatch({ type: 'RESET_OVERLOAD' });
  const resetRuntime = () => dispatch({ type: 'RESET_RUNTIME' });

  return (
    <MotorContext.Provider
      value={{
        state,
        // Button actions
        pressStartButton,
        releaseStartButton,
        pressStopButton,
        releaseStopButton,
        triggerEmergencyStop,
        resetEmergencyStop,
        // System controls
        toggleMCB,
        tripOverload,
        resetOverload,
        resetRuntime,
      }}
    >
      {children}
    </MotorContext.Provider>
  );
}

// Helper function to stop all motor operations immediately
const getEmergencyStopState = (state: MotorControlState): MotorControlState => ({
  ...state,
  motorState: MotorState.EMERGENCY_STOP,
  motorRPM: 0,
  isContactorEnergized: false,
  currentFlow: false,
  isEmergencyStopActive: true,
  faultCondition: 'EMERGENCY STOP ACTIVATED',
  isStartButtonPressed: false,
  isStopButtonPressed: false,
  startTime: null
});

function motorReducer(state: MotorControlState, action: MotorAction): MotorControlState {
  switch (action.type) {
    // User actions
    case 'PRESS_START_BUTTON':
      // Can only start if: MCB closed, not in emergency stop, not already running, and no overload
      if (!state.mcbClosed) {
        return { ...state, faultCondition: 'Cannot start: MCB is open' };
      }
      if (state.isEmergencyStopActive) {
        return { ...state, faultCondition: 'Cannot start: Emergency stop is active' };
      }
      if (state.overloadTripped) {
        return { ...state, faultCondition: 'Cannot start: Overload tripped - reset required' };
      }
      if (state.motorState === MotorState.RUNNING) {
        return state; // Already running
      }
      
      return {
        ...state,
        isStartButtonPressed: true,
        isStopButtonPressed: false,
        motorState: MotorState.STARTING,
        isContactorEnergized: true, // Contactor pulls in
        currentFlow: true,
        startTime: Date.now(),
        faultCondition: null,
      };

    case 'RELEASE_START_BUTTON':
      // Start button is momentary, but contactor stays energized through auxiliary contact
      return {
        ...state,
        isStartButtonPressed: false,
      };

    case 'PRESS_STOP_BUTTON':
      return {
        ...state,
        isStopButtonPressed: true,
        isStartButtonPressed: false,
        motorState: MotorState.STOPPING,
        isContactorEnergized: false, // Breaks the contactor coil circuit
        currentFlow: false,
      };

    case 'RELEASE_STOP_BUTTON':
      return {
        ...state,
        isStopButtonPressed: false,
      };

    case 'TRIGGER_EMERGENCY_STOP':
      // Return the emergency stop state immediately
      return getEmergencyStopState(state);

    case 'RESET_EMERGENCY_STOP':
      return {
        ...state,
        isEmergencyStopActive: false,
        faultCondition: null,
        motorState: MotorState.STOPPED, // Reset to stopped state after emergency
        motorRPM: 0, // Ensure RPM is 0
      };

    case 'TOGGLE_MCB':
      const newMCBState = !state.mcbClosed;
      if (!newMCBState) { // Opening MCB
        return {
          ...state,
          mcbClosed: false,
          motorState: MotorState.STOPPED,
          isContactorEnergized: false,
          currentFlow: false,
          faultCondition: 'MCB opened',
        };
      } else { // Closing MCB
        return {
          ...state,
          mcbClosed: true,
          faultCondition: null,
        };
      }

    case 'TRIP_OVERLOAD':
      return {
        ...state,
        motorState: MotorState.OVERLOAD,
        isContactorEnergized: false,
        currentFlow: false,
        overloadTripped: true,
        faultCondition: 'OVERLOAD: Motor current exceeded safe limits',
      };

    case 'RESET_OVERLOAD':
      return {
        ...state,
        motorState: MotorState.STOPPED,
        overloadTripped: false,
        faultCondition: null,
      };

    case 'SET_RPM':
      // Update RPM and handle state transitions
      const rpm = Math.max(0, Math.min(action.payload, RATED_RPM));
      let newState = { ...state, motorRPM: rpm };
      
      // State transitions based on RPM
      if (rpm >= RATED_RPM * 0.95 && state.motorState === MotorState.STARTING) {
        newState.motorState = MotorState.RUNNING;
      } else if (rpm === 0) {
        if (state.motorState === MotorState.STOPPING) {
          newState.motorState = MotorState.STOPPED;
        } else if (state.motorState === MotorState.EMERGENCY_STOP) {
          newState.motorState = MotorState.EMERGENCY_STOP;
        }
      }
      
      // Update system current based on RPM (simplified model)
      if (rpm > 0) {
        const loadFactor = 0.2 + (rpm / RATED_RPM) * 0.8; // 20-100% load
        newState.systemCurrent = 5 * loadFactor; // 0-5A scale
        newState.motorTemperature = Math.min(90, 25 + (rpm / RATED_RPM) * 65); // 25-90°C
      } else {
        newState.systemCurrent = 0;
        newState.motorTemperature = Math.max(25, state.motorTemperature - 0.1); // Cool down
      }
      
      return newState;

    case 'UPDATE_RUNTIME':
      if (state.motorState === MotorState.RUNNING) {
        return {
          ...state,
          runningTime: state.runningTime + 1,
        };
      }
      return state;

    case 'RESET_RUNTIME':
      return {
        ...state,
        runningTime: 0,
        startTime: state.motorState === MotorState.RUNNING ? Date.now() : null,
      };

    case 'UPDATE_MOTOR_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

interface MotorContextType {
  // Current state
  state: MotorControlState;
  
  // Button actions
  pressStartButton: () => void;
  releaseStartButton: () => void;
  pressStopButton: () => void;
  releaseStopButton: () => void;
  triggerEmergencyStop: () => void;
  resetEmergencyStop: () => void;
  
  // System controls
  toggleMCB: () => void;
  tripOverload: () => void;
  resetOverload: () => void;
  resetRuntime: () => void;
}

export function useMotorControl() {
  const context = useContext(MotorContext);
  if (context === undefined) {
    throw new Error('useMotorControl must be used within a MotorProvider');
  }
  return context;
}
