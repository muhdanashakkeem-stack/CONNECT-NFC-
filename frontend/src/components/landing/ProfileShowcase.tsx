'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ThemeMode = 'obsidian' | 'crimson' | 'emerald' | 'titanium';

interface ThemeConfig {
  name: string;
  bannerGradient: string;
  badgeBg: string;
  badgeColor: string;
  cardGradient: string;
  subTitle: string;
}

const THEMES: Record<ThemeMode, ThemeConfig> = {
  obsidian: {
    name: 'OBSIDIAN BLACK',
    bannerGradient: 'from-[#1f1e1d] via-[#141414] to-[#261517]',
    badgeBg: 'bg-[#940e12]',
    badgeColor: 'text-white',
    cardGradient: 'from-[#1f1e1d] via-[#141414] to-[#0a0a0a]',
    subTitle: 'SPEED NFC // 13.56 MHZ',
  },
  crimson: {
    name: 'CRIMSON VELVET',
    bannerGradient: 'from-[#8f0d11] via-[#5c080b] to-[#2e0305]',
    badgeBg: 'bg-[#ffb4ab]',
    badgeColor: 'text-[#690006]',
    cardGradient: 'from-[#8f0d11] via-[#5c080b] to-[#2e0305]',
    subTitle: 'SPEED NFC // RESERVE 01',
  },
  emerald: {
    name: 'FOREST EMERALD',
    bannerGradient: 'from-[#0c2417] via-[#06110c] to-[#020504]',
    badgeBg: 'bg-emerald-500',
    badgeColor: 'text-black',
    cardGradient: 'from-[#0c2417] via-[#06110c] to-[#020504]',
    subTitle: 'ENTERPRISE // SPEC',
  },
  titanium: {
    name: 'BRUSHED TITANIUM',
    bannerGradient: 'from-[#42403c] via-[#2d2b29] to-[#1a1918]',
    badgeBg: 'bg-[#d6d0c6]',
    badgeColor: 'text-[#1c1b1b]',
    cardGradient: 'from-[#3a3937] via-[#242322] to-[#121211]',
    subTitle: 'AEROSPACE GRADE CNC',
  },
};

export const ProfileShowcase: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('obsidian');
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
          <h2 className="font-display-lg text-display-lg text-[#1c1b1b] max-w-2xl leading-tight">
            Everything You Need, <br />
            <span className="italic font-normal text-[#940e12]">In One Place.</span>
          </h2>
          <p className="font-body-lg text-body-lg text-[#57534e] max-w-2xl mt-space-sm leading-relaxed">
            Traditional paper cards get lost, discarded, or outdated within 48 hours. Your Speed NFC digital destination synchronizes contacts, links, catalogs, and meeting calendars straight into the recipient&apos;s phone with zero app friction.
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
                <span className="material-symbols-outlined text-secondary-container text-2xl">hub</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Dynamic Social Matrix</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Consolidated LinkedIn, Instagram, X, WhatsApp, WeChat, and direct Calendly links.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">pin_drop</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Office Geo-Coordinates</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  Integrated Apple and Google Maps routing for effortless headquarters arrival.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">qr_code_2</span>
                <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-semibold">Smart QR Fallback</h3>
                <p className="font-body-sm text-body-sm text-[#78716c]">
                  High-contrast vector QR code for older smartphone cameras or desktop displays.
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-white/70 shadow-sm flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-2xl">monitoring</span>
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
                type="button"
                onClick={handleSimulateTap}
                className="px-space-md py-3 rounded-DEFAULT bg-white text-[#1c1b1b] hover:bg-[#ede7df] font-label-md text-label-md uppercase tracking-[0.2em] shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px] text-[#940e12]">sensors</span>
                Simulate Instant Tap
              </button>
            </div>
          </div>

          {/* Right: Ultra High-Fidelity Smartphone Mockup with Real Tap Wave Simulation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center w-full">
              {/* Radar Wave Ping */}
              <div
                className={`absolute -top-12 -left-6 w-32 h-32 rounded-full bg-[#940e12]/20 pointer-events-none transition-opacity duration-300 ${
                  isSimulatingTap ? 'animate-ping opacity-100' : 'opacity-0'
                }`}
              />

              {/* Mini Physical Card floating next to phone */}
              <div
                className={`hidden sm:flex absolute -left-10 bottom-16 z-20 w-44 h-28 rounded-md p-3 bg-gradient-to-br ${theme.cardGradient} shadow-2xl flex-col justify-between text-white transform -rotate-12 hover:rotate-0 transition-all duration-300 border border-[#2a2a2a]`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-sm text-[#d5c39c]">contactless</span>
                  <span className="text-[8px] tracking-[0.2em] uppercase text-outline">NFC ACTIVE</span>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white font-medium">{theme.name}</div>
                  <div className="text-[7px] text-gray-400 uppercase tracking-wider">{theme.subTitle}</div>
                </div>
              </div>

              {/* Smartphone Frame */}
              <div className="w-[310px] sm:w-[340px] rounded-[42px] bg-[#1a1918] p-3 shadow-[0_36px_72px_rgba(0,0,0,0.38)] relative border border-[#2a2a2a]">
                <div className="w-full rounded-[34px] bg-[#121212] text-white overflow-hidden flex flex-col relative pb-6">
                  {/* Dynamic Island Header */}
                  <div className="w-full flex justify-center pt-2 pb-1 bg-[#121212]">
                    <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="material-symbols-outlined text-[11px] text-gray-400">lock</span>
                    </div>
                  </div>

                  {/* Profile Banner */}
                  <div className={`h-20 w-full bg-gradient-to-r ${theme.bannerGradient} relative transition-all duration-500`}>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-amber-400 via-stone-400 to-amber-200">
                        <img
                          alt="Elena Rostova Portrait"
                          className="w-full h-full object-cover rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmYmi8meknvotEJRF3uo6_R8ly-cCFoXJbW27rlfk3V53CbadpaROXiciIwCib9yh-9JHr4cejaBrj4A7YwR0evkb4SNHDFH6LCnEtuRDImWlaWlfiBDo4qnc0xYRyiadT7XNc-NL_w8kqXcet0iVFCKoFmlG6Pfe6P3snC3aUlQ0NMQnDLk-UfTbGz0Ua1f3jrVAPGcYT1o80PCh2YrHyXIEWvNMqCLn5jBb743Fuh519ZzUQ2Z_O"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pt-10 px-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1">
                      <h4 className="font-display-md text-headline-sm text-white">Speed NFC Executive</h4>
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    </div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-[#cbb892] mt-0.5">
                      SPEED NFC // PRIVATE CLIENT
                    </p>
                    <p className="font-body-sm text-body-sm text-gray-400 mt-1 max-w-[240px]">
                      Instant dynamic contactless identity. Encrypted credentials across mobile and web.
                    </p>

                    {/* Action buttons */}
                    <div className="w-full grid grid-cols-2 gap-2 mt-4">
                      <button className="py-2 px-2 rounded-lg bg-[#940e12] text-white font-label-sm text-label-sm tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">save</span> Save Contact
                      </button>
                      <button className="py-2 px-2 rounded-lg bg-[#242424] text-white font-label-sm text-label-sm tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span> Book Meet
                      </button>
                    </div>

                    {/* Links */}
                    <div className="w-full flex flex-col gap-2 mt-4">
                      <a href="#contact" className="w-full py-2.5 px-3 rounded-lg bg-[#1f1e1d] hover:bg-[#282726] flex items-center justify-between text-left transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">chat</span>
                          <span className="font-body-sm text-body-sm text-white font-medium">Direct WhatsApp Line</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
                      </a>
                      <a href="#contact" className="w-full py-2.5 px-3 rounded-lg bg-[#1f1e1d] hover:bg-[#282726] flex items-center justify-between text-left transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">work</span>
                          <span className="font-body-sm text-body-sm text-white font-medium">LinkedIn Executive Matrix</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
                      </a>
                      <a href="#contact" className="w-full py-2.5 px-3 rounded-lg bg-[#1f1e1d] hover:bg-[#282726] flex items-center justify-between text-left transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                          <span className="font-body-sm text-body-sm text-white font-medium">Speed NFC Spec Sheet PDF</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-500 text-sm">download</span>
                      </a>
                    </div>

                    {/* Tap Toast Notice */}
                    <div
                      className={`mt-3 w-full py-1.5 px-2 rounded bg-emerald-950/80 text-emerald-300 font-label-sm text-label-sm flex items-center justify-center gap-1 transition-opacity duration-300 ${
                        showToast ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      vCard Received via NFC Tap!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Finish Selector */}
            <div className="mt-4 flex flex-col items-center gap-2 bg-white/80 p-3 rounded-xl border border-[#e5e0d8] shadow-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#78716c] font-semibold">
                Select Atelier Finish & Theme
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  title="Obsidian Black"
                  onClick={() => setActiveTheme('obsidian')}
                  className={`w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center transition-transform hover:scale-110 ${
                    activeTheme === 'obsidian' ? 'ring-2 ring-[#940e12] ring-offset-2' : ''
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </button>
                <button
                  type="button"
                  title="Crimson Velvet"
                  onClick={() => setActiveTheme('crimson')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#8f0d11] to-[#2e0305] flex items-center justify-center transition-transform hover:scale-110 ${
                    activeTheme === 'crimson' ? 'ring-2 ring-[#940e12] ring-offset-2' : ''
                  }`}
                />
                <button
                  type="button"
                  title="Forest Emerald"
                  onClick={() => setActiveTheme('emerald')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#0c2417] to-[#020504] flex items-center justify-center transition-transform hover:scale-110 ${
                    activeTheme === 'emerald' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`}
                />
                <button
                  type="button"
                  title="Brushed Titanium"
                  onClick={() => setActiveTheme('titanium')}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#d6d0c6] to-[#78716c] flex items-center justify-center transition-transform hover:scale-110 ${
                    activeTheme === 'titanium' ? 'ring-2 ring-stone-400 ring-offset-2' : ''
                  }`}
                />
              </div>
              <span className="text-[11px] font-body-sm text-[#78716c]">
                Obsidian Black · Crimson Velvet · Forest Emerald · Brushed Titanium
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
