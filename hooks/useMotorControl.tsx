'use client';

import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

export enum MotorState {
  STOPPED = 'stopped',
  STARTING = 'starting',
  RUNNING = 'running',
  STOPPING = 'stopping',
  FAULT = 'fault'
}

interface MotorControlState {
  motorState: MotorState;
  isContactorEnergized: boolean;
  currentFlow: boolean;
  motorRPM: number;
  runningTime: number;
  faultCondition: string | null;
  mcbClosed: boolean;
  overloadTripped: boolean;
}

type MotorAction = 
  | { type: 'START_MOTOR' }
  | { type: 'STOP_MOTOR' }
  | { type: 'EMERGENCY_STOP' }
  | { type: 'RESET_FAULT' }
  | { type: 'TRIP_OVERLOAD' }
  | { type: 'CLOSE_MCB' }
  | { type: 'OPEN_MCB' }
  | { type: 'UPDATE_RUNTIME' }
  | { type: 'SET_RPM'; payload: number }
  | { type: 'RESET_RUNTIME' };

const initialState: MotorControlState = {
  motorState: MotorState.STOPPED,
  isContactorEnergized: false,
  currentFlow: false,
  motorRPM: 0,
  runningTime: 0,
  faultCondition: null,
  mcbClosed: true,
  overloadTripped: false,
};

const MotorContext = createContext<MotorContextType | undefined>(undefined);

export function MotorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(motorReducer, initialState);
  const [rpmInterval, setRpmInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.motorState === MotorState.STARTING) {
      interval = setInterval(() => {
        dispatch({ type: 'SET_RPM', payload: Math.min(state.motorRPM + 50, 1500) });
      }, 100);
    } else if (state.motorState === MotorState.STOPPING) {
      interval = setInterval(() => {
        dispatch({ type: 'SET_RPM', payload: Math.max(state.motorRPM - 75, 0) });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.motorState, state.motorRPM]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: 'UPDATE_RUNTIME' });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const contextValue: MotorContextType = {
    state,
    startMotor: () => dispatch({ type: 'START_MOTOR' }),
    stopMotor: () => dispatch({ type: 'STOP_MOTOR' }),
    emergencyStop: () => {
      if (rpmInterval) {
        clearInterval(rpmInterval);
      }
      dispatch({ type: 'EMERGENCY_STOP' });
    },
    resetFault: () => dispatch({ type: 'RESET_FAULT' }),
    tripOverload: () => dispatch({ type: 'TRIP_OVERLOAD' }),
    toggleMCB: () => dispatch({ type: state.mcbClosed ? 'OPEN_MCB' : 'CLOSE_MCB' }),
    resetRuntime: () => dispatch({ type: 'RESET_RUNTIME' }),
  };

  return (
    <MotorContext.Provider value={contextValue}>
      {children}
    </MotorContext.Provider>
  );
}

function motorReducer(state: MotorControlState, action: MotorAction): MotorControlState {
  switch (action.type) {
    case 'START_MOTOR':
      if (!state.mcbClosed || state.overloadTripped) {
        return { ...state, faultCondition: 'Cannot start: MCB open or overload tripped' };
      }
      return {
        ...state,
        motorState: MotorState.STARTING,
        isContactorEnergized: true,
        currentFlow: true,
        faultCondition: null,
      };

    case 'STOP_MOTOR':
      return {
        ...state,
        motorState: MotorState.STOPPING,
        isContactorEnergized: false,
        currentFlow: false,
      };

    case 'EMERGENCY_STOP':
      return {
        ...state,
        motorState: MotorState.STOPPED,
        isContactorEnergized: false,
        currentFlow: false,
        motorRPM: 0,
      };

    case 'TRIP_OVERLOAD':
      return {
        ...state,
        motorState: MotorState.FAULT,
        isContactorEnergized: false,
        currentFlow: false,
        overloadTripped: true,
        faultCondition: 'Motor overload tripped',
      };

    case 'CLOSE_MCB':
      return { ...state, mcbClosed: true };

    case 'OPEN_MCB':
      return {
        ...state,
        mcbClosed: false,
        motorState: MotorState.STOPPED,
        isContactorEnergized: false,
        currentFlow: false,
      };

    case 'RESET_FAULT':
      return {
        ...state,
        motorState: MotorState.STOPPED,
        overloadTripped: false,
        faultCondition: null,
      };

    case 'SET_RPM':
      const newState = { ...state, motorRPM: action.payload };
      if (action.payload >= 1450 && state.motorState === MotorState.STARTING) {
        newState.motorState = MotorState.RUNNING;
      } else if (action.payload === 0 && state.motorState === MotorState.STOPPING) {
        newState.motorState = MotorState.STOPPED;
      }
      return newState;

    case 'UPDATE_RUNTIME':
      return {
        ...state,
        runningTime: state.motorState === MotorState.RUNNING ? state.runningTime + 1 : state.runningTime,
      };
    case 'RESET_RUNTIME':
      return { ...state, runningTime: 0 };

    default:
      return state;
  }
}

interface MotorContextType {
  state: MotorControlState;
  startMotor: () => void;
  stopMotor: () => void;
  emergencyStop: () => void;
  resetFault: () => void;
  tripOverload: () => void;
  toggleMCB: () => void;
  resetRuntime: () => void;
}

export function useMotorControl() {
  const context = useContext(MotorContext);
  if (context === undefined) {
    throw new Error('useMotorControl must be used within a MotorProvider');
  }
  return context;
}
