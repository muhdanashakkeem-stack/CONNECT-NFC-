'use client';

import React from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container rounded-xl overflow-hidden shadow-2xl flex flex-col border border-outline-variant/40">
        <div className="p-4 flex items-center justify-between bg-surface-container-high border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              NFC Contactless Protocol Demo
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-outline hover:text-primary transition-colors p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Video Player Simulation Container */}
        <div className="p-space-lg flex flex-col items-center justify-center text-center gap-space-md min-h-[300px] bg-black">
          <div className="w-20 h-20 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary animate-pulse">
            <span className="material-symbols-outlined text-4xl">sensors</span>
          </div>
          <h4 className="font-display-md text-headline-sm text-primary">Simulated Hardware Handshake</h4>
          <p className="font-body-md text-body-md text-outline max-w-md">
            Card detected at 13.56MHz. The iOS/Android native core opens the encrypted web destination in 0.18 seconds without third-party apps.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-2 rounded-DEFAULT bg-surface-container-high text-white font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-bright transition-all"
          >
            Close Demonstration
          </button>
        </div>
      </div>
    </div>
  );
};
