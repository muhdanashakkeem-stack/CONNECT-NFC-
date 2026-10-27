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
              <h2
                className="text-display-lg text-primary leading-tight"
                style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif", fontWeight: 700 }}
              >
                Building a Smarter Way to Connect
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Over 10 billion business cards are printed every year; over 88% are thrown out in a week. CONNECT NFC unites high-frequency near-field communication with cloud-hosted credentials to eradicate physical waste while augmenting relationship conversion.
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
                className="w-full max-w-[480px] aspect-video rounded-xl bg-surface-container-high relative overflow-hidden flex items-center justify-center cursor-pointer group shadow-2xl border border-[#353534]"
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-container/20 via-surface to-black/80"></div>

                <div className="relative z-10 flex flex-col items-center gap-space-sm text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-white shadow-[0_4px_24px_rgba(148,14,18,0.6)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">play_arrow</span>
                  </div>
                  <span className="font-title-md text-title-md text-primary font-semibold tracking-wide">
                    Watch NFC Tap in Action
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-outline">
                    Full Atelier Production · 4K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
