'use client';

import React, { useState } from 'react';
import { DemoModal } from './DemoModal';

export const HowItWorks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-[#171717] text-on-surface py-space-xl" id="how-it-works">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left: Editorial Concept & 3-Step Roadmap */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <span className="font-label-md text-label-md uppercase tracking-[0.24em] text-secondary font-semibold">
                Protocol & Engineering
              </span>
              <h2 className="font-display-lg text-display-lg text-primary leading-tight">
                Building a Smarter Way to Connect
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Over 10 billion business cards are printed every year; over 88% are thrown out in a week. Speed NFC unites high-frequency near-field communication with cloud-hosted credentials to eradicate physical waste while augmenting relationship conversion.
              </p>

              <div className="flex flex-col gap-space-md pt-space-xs">
                <div className="flex items-start gap-space-md">
                  <span className="font-display-md text-headline-sm text-tertiary-fixed font-bold">01</span>
                  <div className="flex flex-col">
                    <h3 className="font-title-lg text-title-lg text-primary font-semibold">Choose Your Package</h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Select between digital-only credentials or bespoke CNC-cut titanium, carbon obsidian, or heavy cotton physical cards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md">
                  <span className="font-display-md text-headline-sm text-tertiary-fixed font-bold">02</span>
                  <div className="flex flex-col">
                    <h3 className="font-title-lg text-title-lg text-primary font-semibold">Customize Your Profile</h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Upload executive photography, social credentials, pitch decks, calendar links, and geo-locations via our private client portal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md">
                  <span className="font-display-md text-headline-sm text-tertiary-fixed font-bold">03</span>
                  <div className="flex flex-col">
                    <h3 className="font-title-lg text-title-lg text-primary font-semibold">Tap and Share Seamlessly</h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Hold the card against any modern smartphone. The contact card launches instantly without recipient app installation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Video Demo Component */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-xl overflow-hidden bg-surface-container-low shadow-2xl relative group cursor-pointer border border-[#2a2a2a] hover:border-secondary transition-all"
              >
                {/* Atmospheric Demo Card Frame with simulated video playback poster */}
                <div className="w-full h-[360px] bg-gradient-to-tr from-[#0a0a0a] via-[#1a1c1a] to-[#261517] flex items-center justify-center relative p-space-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:opacity-40 transition-opacity"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_bS9UuJ9I9B1_V2n7_gEqfN8ZV5_teWrWAf4cOSnD84MhYRXjFo9VaOody4MJwO5dTLgnNbeT22UfX1Ai2e0RHyLk98mBEKM4faD0yLvqp-szG86hpnuKaekWDPBQRgHjjGK8rNBfwP_33NhRqL4M2sTqbtuWtAys3XwHSVMFf1kSpQLdkaRVvI7L54gGFAF6zV8o7dX4cDAsG4w7qTmKrYrJ4axGKr6CiEkfmvcoizJm4yImR1km")`,
                    }}
                  />
                  {/* Particle Wave Ring */}
                  <div className="absolute w-44 h-44 rounded-full bg-secondary-container/20 animate-ping pointer-events-none"></div>

                  {/* Play Button Trigger */}
                  <div className="relative z-10 flex flex-col items-center gap-space-sm">
                    <div className="w-16 h-16 rounded-full bg-secondary-container/80 group-hover:bg-secondary-container flex items-center justify-center text-white shadow-xl transition-all transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">play_arrow</span>
                    </div>
                    <span className="font-label-md text-label-md text-primary uppercase tracking-[0.2em] font-semibold">
                      Watch 60-Second NFC Tap Demonstration
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded bg-black/70 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-label-sm text-label-sm text-white uppercase tracking-wider">4K HDR Capture</span>
                  </div>
                </div>
              </div>

              {/* Technical Specs Micro Bar */}
              <div className="w-full grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 rounded bg-surface-container-high/40 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block uppercase">Frequency</span>
                  <span className="font-title-sm text-title-md text-primary font-semibold">13.56 MHz</span>
                </div>
                <div className="p-2 rounded bg-surface-container-high/40 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block uppercase">Encryption</span>
                  <span className="font-title-sm text-title-md text-primary font-semibold">AES-128 Cloud</span>
                </div>
                <div className="p-2 rounded bg-surface-container-high/40 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block uppercase">Compatibility</span>
                  <span className="font-title-sm text-title-md text-primary font-semibold">Universal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
