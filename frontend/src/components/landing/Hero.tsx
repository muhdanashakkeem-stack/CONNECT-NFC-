'use client';

import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-[#0d1410] to-surface-container-lowest pt-space-md pb-space-xl" id="home">
      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-secondary-container/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] bg-[#0c2317]/25 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center pt-space-xs pb-space-lg">
          {/* Left: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-high/70 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Next-Gen Contactless Protocol
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg text-primary tracking-tight leading-[1.08]">
              Speed NFC — <br />
              <span className="font-headline-lg italic font-normal text-tertiary-fixed">
                Your Identity, One Tap Away.
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Premium NFC business cards and digital profiles that help you connect, share your credentials, and cultivate relationships with a single frictionless tap.
            </p>

            <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
              <Link
                href="#packages"
                className="inline-flex items-center justify-center gap-2 px-space-lg py-3 rounded-DEFAULT bg-secondary-container text-on-surface font-label-md text-label-md uppercase tracking-[0.18em] shadow-[0_6px_24px_rgba(148,14,18,0.45)] hover:bg-[#a61318] transition-all transform hover:-translate-y-0.5"
              >
                Explore Packages
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="#profile-showcase"
                className="inline-flex items-center justify-center gap-2 px-space-lg py-3 rounded-DEFAULT bg-surface-container-high/70 hover:bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-[0.18em] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                Create Your Digital Profile
              </Link>
            </div>

            {/* Micro Credibility Indicators */}
            <div className="pt-space-md grid grid-cols-3 gap-space-sm max-w-lg">
              <div className="flex flex-col">
                <span className="font-display-md text-headline-sm text-primary">0.2s</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Tap-to-save Speed</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display-md text-headline-sm text-primary">140+</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Global Nations</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display-md text-headline-sm text-primary">100%</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Zero App Required</span>
              </div>
            </div>
          </div>

          {/* Right: 3-Card 3D Stack Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] select-none" style={{ perspective: '1200px' }}>
            {/* Card 3: Crimson Red Velvet Matte */}
            <div className="absolute w-[300px] sm:w-[330px] h-[190px] sm:h-[208px] rounded-lg p-5 flex flex-col justify-between shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85)] bg-gradient-to-br from-[#8f0d11] via-[#5c080b] to-[#2e0305] text-on-surface transform rotate-[-12deg] -translate-x-10 translate-y-12 transition-all duration-500 hover:rotate-[-6deg] hover:z-30 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-xl">contactless</span>
                  <span className="font-label-sm text-label-sm tracking-[0.24em] uppercase text-secondary">NTAG 216</span>
                </div>
                <span className="font-label-sm text-label-sm tracking-[0.2em] uppercase text-secondary/80">SIGNATURE</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary/80">EDITION // 01</span>
                <span className="font-display-md text-headline-sm text-primary tracking-wide">SPEED NFC</span>
                <span className="font-label-sm text-label-sm tracking-widest text-stone-300 uppercase mt-0.5">CRIMSON RESERVE</span>
              </div>
            </div>

            {/* Card 2: Deep Forest Green Satin Finish */}
            <div className="absolute w-[300px] sm:w-[330px] h-[190px] sm:h-[208px] rounded-lg p-5 flex flex-col justify-between shadow-[0_26px_52px_-10px_rgba(0,0,0,0.9)] bg-gradient-to-br from-[#0c2417] via-[#06110c] to-[#020504] text-tertiary-container transform rotate-[6deg] translate-x-8 -translate-y-4 transition-all duration-500 hover:rotate-[2deg] hover:z-30 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="w-8 h-6 rounded-DEFAULT bg-[#9d8969]/30 flex items-center justify-center">
                  <div className="w-5 h-3.5 rounded-DEFAULT bg-[#d5c39c]/70 flex items-center justify-around px-0.5">
                    <div className="w-1 h-full bg-[#7a643e]/40"></div>
                    <div className="w-1 h-full bg-[#7a643e]/40"></div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl">contactless</span>
              </div>
              <div className="flex flex-col">
                <div className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-tertiary-fixed-dim">ENTERPRISE // SPEC</div>
                <div className="font-display-md text-headline-sm text-primary tracking-wide">SPEED NFC</div>
                <div className="font-label-sm text-label-sm tracking-widest text-outline uppercase mt-0.5">TITANIUM EDITION</div>
              </div>
            </div>

            {/* Card 1: Obsidian Charcoal Brushed Black (Top Restored Hero Card) */}
            <div className="relative z-20 w-[300px] sm:w-[330px] h-[190px] sm:h-[208px] rounded-lg p-5 flex flex-col justify-between shadow-[0_36px_72px_rgba(0,0,0,0.95)] bg-gradient-to-br from-[#1f1e1d] via-[#141414] to-[#0a0a0a] text-on-surface transition-all duration-500 hover:rotate-0 hover:z-40 cursor-pointer border border-[#353534]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-stone-300 text-xl">contactless</span>
                  <span className="font-label-sm text-label-sm tracking-[0.22em] uppercase text-stone-400">13.56 MHZ</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-surface-container-high/90 text-stone-300 font-label-sm text-[9px] uppercase tracking-widest">NFC CHIP SPEC</div>
              </div>
              <div className="flex flex-col">
                <div className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-stone-400">EXECUTIVE TIER</div>
                <div className="font-display-md text-headline-sm text-primary tracking-wide">SPEED NFC</div>
                <div className="font-label-sm text-label-sm tracking-widest text-outline uppercase mt-0.5">OBSIDIAN BLACK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Strip Directly Below Hero */}
        <div className="mt-space-md grid grid-cols-2 md:grid-cols-4 gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-sm">
          <div className="flex items-center gap-space-sm p-space-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary">
              <span className="material-symbols-outlined">tap_and_play</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-primary font-semibold">NFC Instant Tap</span>
              <span className="font-body-sm text-body-sm text-outline truncate">No app required, iOS & Android</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm p-space-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-tertiary-fixed">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-primary font-semibold">Dynamic Cloud</span>
              <span className="font-body-sm text-body-sm text-outline truncate">Live credentials edit anytime</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm p-space-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined">layers</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-primary font-semibold">Bespoke Metal</span>
              <span className="font-body-sm text-body-sm text-outline truncate">Aerospace titanium & cotton</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm p-space-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary-fixed-dim">
              <span className="material-symbols-outlined">public</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-primary font-semibold">Global Reach</span>
              <span className="font-body-sm text-body-sm text-outline truncate">140+ countries connected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
