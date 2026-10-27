'use client';

import React from 'react';
import Link from 'next/link';

export default function PublicCardView({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col items-center justify-center p-4">
      {/* Smartphone frame */}
      <div className="w-[330px] rounded-[40px] bg-[#1a1918] p-3 shadow-[0_36px_72px_rgba(0,0,0,0.8)] border border-[#2a2a2a] relative">
        <div className="w-full rounded-[32px] bg-[#121212] text-white overflow-hidden flex flex-col pb-6">
          {/* Dynamic Island Header */}
          <div className="w-full flex justify-center pt-2 pb-1 bg-[#121212]">
            <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="material-symbols-outlined text-[11px] text-gray-400">lock</span>
            </div>
          </div>

          {/* Banner */}
          <div className="h-20 w-full bg-gradient-to-r from-[#1f1e1d] via-[#141414] to-[#261517] relative">
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-amber-400 via-stone-400 to-amber-200">
                <img
                  alt="Executive Portrait"
                  className="w-full h-full object-cover rounded-full"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-10 px-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-1">
              <h1 className="font-display-md text-lg text-white font-semibold">
                {slug.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </h1>
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            </div>
            <p className="font-label-sm text-[11px] uppercase tracking-[0.16em] text-[#cbb892] mt-0.5">
              SPEED NFC // PRIVATE CLIENT
            </p>
            <p className="font-body-sm text-xs text-gray-400 mt-1 max-w-[240px]">
              Managing Partner & Founder · Vance & Partners Advisory
            </p>

            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => alert('vCard downloaded to phone contacts!')}
                className="py-2 px-2 rounded-lg bg-[#940e12] text-white font-label-sm text-xs tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">save</span> Save Contact
              </button>
              <a
                href="mailto:concierge@speednfc.com"
                className="py-2 px-2 rounded-lg bg-[#242424] text-white font-label-sm text-xs tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">mail</span> Direct Email
              </a>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4 text-xs">
              <a
                href="#"
                className="w-full py-2.5 px-3 rounded-lg bg-[#1f1e1d] hover:bg-[#282726] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">chat</span>
                  <span className="text-white font-medium">WhatsApp Direct</span>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
              </a>
              <a
                href="#"
                className="w-full py-2.5 px-3 rounded-lg bg-[#1f1e1d] hover:bg-[#282726] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">work</span>
                  <span className="text-white font-medium">LinkedIn Network</span>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-outline hover:text-white font-label-sm uppercase tracking-wider">
          Powered by SPEED NFC Bespoke Hardware
        </Link>
      </div>
    </div>
  );
}
