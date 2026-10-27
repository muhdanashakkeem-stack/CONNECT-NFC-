'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/context';

export const BackendStatusPill: React.FC = () => {
  const { backendOnline, checkHealth } = useAuth();

  return (
    <div
      onClick={() => checkHealth()}
      title="Click to recheck backend status on port 5000"
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-outline-variant/40 text-xs font-mono cursor-pointer hover:border-secondary transition-all"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          backendOnline === true
            ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
            : backendOnline === false
            ? 'bg-amber-400 animate-pulse'
            : 'bg-stone-500'
        }`}
      />
      <span className="text-[11px] text-on-surface-variant font-label-sm tracking-wider uppercase">
        {backendOnline === true
          ? 'Backend :5000 Online'
          : backendOnline === false
          ? 'Backend :5000 Standby'
          : 'Connecting :5000...'}
      </span>
    </div>
  );
};
