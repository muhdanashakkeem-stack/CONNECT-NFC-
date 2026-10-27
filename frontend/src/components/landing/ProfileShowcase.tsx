'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ThemeMode = 'authority' | 'obsidian' | 'emerald' | 'wine' | 'carbon';

interface ThemeConfig {
  name: string;
  subTitle: string;
  bannerGradient: string;
  cardGradient: string;
  accentColor: string;
  borderClass: string;
  accentText: string;
}

const THEMES: Record<ThemeMode, ThemeConfig> = {
  authority: {
    name: 'CREATIVE AUTHORITY',
    subTitle: 'ROYAL INDIGO · 13.56 MHZ',
    bannerGradient: 'from-[#0d1b2a] via-[#1a2e66] to-[#0d1b2a]',
    cardGradient: 'from-[#0d1b2a] via-[#1a2e66] to-[#0a1120]',
    accentColor: '#ff6b35',
    borderClass: 'border-[#1e3a8a]/60',
    accentText: 'text-[#ff6b35]',
  },
  obsidian: {
    name: 'OBSIDIAN NOIR',
    subTitle: 'OBSIDIAN NOIR · 13.56 MHZ',
    bannerGradient: 'from-[#191919] via-[#111111] to-[#0a0a0a]',
    cardGradient: 'from-[#1f1e1d] via-[#141414] to-[#0a0a0a]',
    accentColor: '#e5e2e1',
    borderClass: 'border-[#353534]',
    accentText: 'text-stone-300',
  },
  emerald: {
    name: 'MIDNIGHT EMERALD',
    subTitle: 'ROYAL MIDNIGHT EMERALD · SPEC',
    bannerGradient: 'from-[#0c2417] via-[#06110c] to-[#020504]',
    cardGradient: 'from-[#0c2417] via-[#06110c] to-[#020504]',
    accentColor: '#10b981',
    borderClass: 'border-emerald-800/40',
    accentText: 'text-emerald-400',
  },
  wine: {
    name: 'MIDNIGHT WINE',
    subTitle: 'IMPERIAL MIDNIGHT WINE · RESERVE',
    bannerGradient: 'from-[#8f0d11] via-[#5c080b] to-[#1a060a]',
    cardGradient: 'from-[#8f0d11] via-[#5c080b] to-[#1a060a]',
    accentColor: '#ff9f94',
    borderClass: 'border-[#940e12]/60',
    accentText: 'text-[#ffb4ab]',
  },
  carbon: {
    name: 'CARBON & GOLD',
    subTitle: 'DEEP CARBON & CHAMPAGNE GOLD',
    bannerGradient: 'from-[#242424] via-[#1c1b1b] to-[#7a643e]/40',
    cardGradient: 'from-[#242424] via-[#1c1b1b] to-[#141414]',
    accentColor: '#d5c39c',
    borderClass: 'border-[#7a643e]/40',
    accentText: 'text-[#d5c39c]',
  },
};

export const ProfileShowcase: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('authority');
  const [isSimulatingTap, setIsSimulatingTap] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const theme = THEMES[activeTheme];

  const handleSimulateTap = () => {
    setIsSimulatingTap(true);
    setShowToast(true);

    setTimeout(() => {
      setIsSimulatingTap(false);
    }, 1200);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <section className="w-full bg-[#f5f0eb] text-[#1c1b1b] py-space-xl transition-colors" id="profile-showcase">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col mb-space-lg">
          <span className="font-label-md text-label-md uppercase tracking-[0.24em] text-[#78716c] font-semibold mb-2">
            Your Digital Business Profile
          </span>
          <h2
            className="text-display-lg text-[#1c1b1b] max-w-2xl leading-tight"
            style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif", fontWeight: 700 }}
          >
            Everything You Need, <br />
            <span className="italic font-normal text-[#940e12]">In One Place.</span>
          </h2>
          <p className="font-body-lg text-body-lg text-[#57534e] max-w-2xl mt-space-sm leading-relaxed">
            Traditional paper cards get lost, discarded, or outdated within 48 hours. Your CONNECT NFC digital destination synchronizes contacts, links, catalogs, and meeting calendars straight into the recipient&apos;s phone with zero app friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left: Feature Grid & Interactive Controls */}
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">contact_page</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">1-Tap vCard Save</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Downloads verified contact details straight to iOS Contacts or Android Address Book.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">link</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Curated Social Hub</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Showcase LinkedIn, WhatsApp Concierge, portfolio reels, and calendar bookings.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">insights</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Analytics & Heatmaps</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Real-time tap analytics, geo-locations, link CTR, and lead attribution reports.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">quickreply</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Reciprocal Lead Exchange</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Permits prospective clients to immediately send their info back to your CRM.
                </p>
              </div>
            </div>

            <div className="pt-space-xs flex flex-wrap items-center gap-space-sm">
              <Link
                href="#contact"
                className="px-space-md py-3 rounded-DEFAULT bg-[#1c1b1b] text-white hover:bg-black font-label-md text-label-md uppercase tracking-[0.2em] shadow-md transition-all"
              >
                Create Your Digital Profile
              </Link>
              <button
                onClick={handleSimulateTap}
                className="px-space-md py-3 rounded-DEFAULT bg-white text-[#1c1b1b] hover:bg-[#ede7df] font-label-md text-label-md uppercase tracking-[0.2em] shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px] text-[#940e12]">sensors</span>
                <span>Simulate Instant Tap</span>
              </button>
            </div>
          </div>

          {/* Right: Ultra High-Fidelity Smartphone Mockup with Real Tap Wave Simulation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center w-full">
              {/* Tap wave animation */}
              <div
                className={`absolute -top-10 -left-4 w-28 h-28 rounded-full bg-secondary-container/20 animate-ping pointer-events-none transition-opacity duration-300 ${
                  isSimulatingTap ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>

              {/* Mini Card Preview with rich dark finish */}
              <div
                className={`hidden sm:flex absolute -left-8 bottom-12 z-20 w-40 h-24 rounded-lg p-3 bg-gradient-to-br ${theme.cardGradient} shadow-2xl flex-col justify-between text-white transform -rotate-12 hover:rotate-0 transition-all duration-300 border ${theme.borderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-sm" style={{ color: theme.accentColor }}>
                    contactless
                  </span>
                  <span className="text-[8px] tracking-[0.2em] uppercase text-[#93c5fd]">ENCRYPTED NFC</span>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: theme.accentColor }}>
                    {theme.name}
                  </div>
                  <div className="text-[7px] text-[#93c5fd]/80 uppercase tracking-wider">{theme.subTitle}</div>
                </div>
              </div>

              {/* Phone Frame: Compact, refined vertical height */}
              <div className="w-[300px] sm:w-[320px] rounded-[38px] bg-[#1a1918] p-2.5 shadow-[0_26px_52px_-10px_rgba(0,0,0,0.9)] relative border border-[#2a2a2a]">
                <div className="w-full rounded-[30px] bg-[#0e0e0e] text-white overflow-hidden flex flex-col relative pb-4">
                  {/* Dynamic Island */}
                  <div className="w-full flex justify-center pt-2 pb-1 bg-[#0e0e0e]">
                    <div className="w-20 h-4 rounded-full bg-black flex items-center justify-between px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="material-symbols-outlined text-[10px] text-gray-400">lock</span>
                    </div>
                  </div>

                  {/* Header Banner */}
                  <div
                    className={`h-16 w-full bg-gradient-to-r ${theme.bannerGradient} relative transition-all duration-500 border-b ${theme.borderClass}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-[#1a2e66] via-[#ff6b35] to-[#ffa07a]">
                        <div className="w-full h-full rounded-full bg-[#0d1b2a] flex items-center justify-center text-primary font-bold text-base shadow-inner">
                          <span className="material-symbols-outlined text-xl text-[#ff6b35]">account_circle</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Body */}
                  <div className="pt-8 px-3 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6b35]/20 border border-[#ff6b35]/40 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse"></span>
                      <span className="font-label-sm text-[8px] uppercase tracking-[0.16em] text-[#ff6b35] font-semibold">
                        Creative Authority Edition
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <h4 className="font-headline-sm text-title-md text-white font-semibold">Executive Identity</h4>
                      <span className="material-symbols-outlined text-[#ff6b35] text-[14px]">verified</span>
                    </div>

                    <p className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-[#93c5fd] mt-0.5">
                      DIRECTOR · PRIVATE OFFICE
                    </p>
                    <p className="font-body-sm text-[11px] text-gray-300 mt-1 max-w-[210px] leading-tight">
                      Tap to establish instant direct connection and exchange encrypted credentials.
                    </p>

                    <div className="w-full grid grid-cols-2 gap-1.5 mt-3">
                      <button
                        onClick={handleSimulateTap}
                        className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#ff6b35] to-[#ff5722] hover:opacity-95 text-white font-label-sm text-[10px] tracking-wider uppercase flex items-center justify-center gap-1 shadow-[0_2px_10px_rgba(255,107,53,0.4)] transition-all font-semibold"
                      >
                        <span className="material-symbols-outlined text-[13px]">save</span> Save vCard
                      </button>
                      <button className="py-1.5 px-2 rounded-lg bg-[#0d1b2a] hover:bg-[#1a2e66] text-white border border-[#1e3a8a]/60 font-label-sm text-[10px] tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm transition-colors">
                        <span className="material-symbols-outlined text-[13px] text-[#ff6b35]">calendar_today</span> Schedule
                      </button>
                    </div>

                    <div className="w-full flex flex-col gap-1.5 mt-2.5">
                      <div className="w-full py-2 px-2.5 rounded-lg bg-[#0d1b2a]/90 hover:bg-[#132238] flex items-center justify-between text-left transition-colors border border-[#1e3a8a]/40 group">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#ff6b35] text-[16px]">call</span>
                          <span className="font-body-sm text-[12px] text-white font-medium">Encrypted Direct Voice</span>
                        </div>
                        <span className="material-symbols-outlined text-[#93c5fd] text-xs">arrow_forward</span>
                      </div>
                      <div className="w-full py-2 px-2.5 rounded-lg bg-[#0d1b2a]/90 hover:bg-[#132238] flex items-center justify-between text-left transition-colors border border-[#1e3a8a]/40 group">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#ff6b35] text-[16px]">alternate_email</span>
                          <span className="font-body-sm text-[12px] text-white font-medium">Executive Messaging</span>
                        </div>
                        <span className="material-symbols-outlined text-[#93c5fd] text-xs">arrow_forward</span>
                      </div>
                      <div className="w-full py-2 px-2.5 rounded-lg bg-[#0d1b2a]/90 hover:bg-[#132238] flex items-center justify-between text-left transition-colors border border-[#1e3a8a]/40 group">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#ff6b35] text-[16px]">key</span>
                          <span className="font-body-sm text-[12px] text-white font-medium">Cryptographic Public Key</span>
                        </div>
                        <span className="material-symbols-outlined text-[#93c5fd] text-xs">download</span>
                      </div>
                    </div>

                    {/* Toast */}
                    <div
                      className={`mt-2 w-full py-1 px-2 rounded bg-[#0d1b2a] border border-[#ff6b35]/30 text-[#ff6b35] font-label-sm text-[10px] flex items-center justify-center gap-1 transition-opacity duration-300 ${
                        showToast ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> NFC Handshake Authenticated (0.18s)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Dark Color Finishes Bar */}
            <div className="mt-4 flex flex-col items-center gap-2 bg-white/80 p-3 rounded-xl border border-[#e5e0d8] shadow-sm max-w-[340px] w-full">
              <div className="flex items-center justify-between w-full px-1">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#78716c] font-semibold">
                  Atelier Luxury Finishes
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/15 text-[#ff5722] font-label-sm text-[8px] uppercase tracking-wider font-bold">
                  Active Mix
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTheme('authority')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-tr from-[#0d1b2a] via-[#1a2e66] to-[#ff6b35] flex items-center justify-center transition-transform hover:scale-110 shadow-md relative ${
                    activeTheme === 'authority' ? 'ring-2 ring-[#ff6b35] ring-offset-2' : ''
                  }`}
                  title="Creative Authority (Royal Indigo & Sunset Orange)"
                >
                  {activeTheme === 'authority' && <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>}
                </button>
                <button
                  onClick={() => setActiveTheme('obsidian')}
                  className={`w-8 h-8 rounded-full bg-[#0c0d12] flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                    activeTheme === 'obsidian' ? 'ring-2 ring-stone-400 ring-offset-2' : ''
                  }`}
                  title="Obsidian Noir"
                >
                  {activeTheme === 'obsidian' && <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>}
                </button>
                <button
                  onClick={() => setActiveTheme('emerald')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#0c2417] via-[#06110c] to-[#020504] flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                    activeTheme === 'emerald' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`}
                  title="Royal Midnight Emerald"
                >
                  {activeTheme === 'emerald' && <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>}
                </button>
                <button
                  onClick={() => setActiveTheme('wine')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#8f0d11] via-[#5c080b] to-[#1a060a] flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                    activeTheme === 'wine' ? 'ring-2 ring-[#940e12] ring-offset-2' : ''
                  }`}
                  title="Imperial Midnight Wine"
                >
                  {activeTheme === 'wine' && <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>}
                </button>
                <button
                  onClick={() => setActiveTheme('carbon')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#242424] via-[#1c1b1b] to-[#7a643e]/40 flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                    activeTheme === 'carbon' ? 'ring-2 ring-stone-400 ring-offset-2' : ''
                  }`}
                  title="Deep Carbon & Champagne Gold"
                >
                  {activeTheme === 'carbon' && <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>}
                </button>
              </div>
              <span className="text-[11px] font-body-sm text-[#78716c] text-center font-medium">
                <span className="text-[#ff5722] font-semibold">{theme.name}</span> · Luxury Atelier Standard
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
