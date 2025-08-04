'use client';

import MotorStarterSimulator from '@/components/MotorStarterSimulator';
import { MotorProvider } from '@/hooks/useMotorControl';

export default function Home() {
  return (
    <MotorProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <MotorStarterSimulator />
      </div>
    </MotorProvider>
  );
}
