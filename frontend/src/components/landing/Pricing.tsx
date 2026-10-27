'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Pricing: React.FC = () => {
  const [pricingMode, setPricingMode] = useState<'onetime' | 'enterprise'>('onetime');

  const prices = {
    a: pricingMode === 'onetime' ? '₹2,499' : '₹3,499',
    periodA: pricingMode === 'onetime' ? '/ one-time' : '/ yr (Cloud Inc.)',
    b: pricingMode === 'onetime' ? '₹4,999' : '₹6,499',
    periodB: pricingMode === 'onetime' ? '/ one-time' : '/ yr (Cloud Inc.)',
    c: pricingMode === 'onetime' ? '₹8,999' : '₹11,999',
    periodC: pricingMode === 'onetime' ? '/ one-time' : '/ yr (Cloud Inc.)',
  };

  return (
    <section className="w-full bg-[#f5f0eb] text-[#1c1b1b] py-space-xl" id="packages">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col items-center text-center mb-space-lg">
          <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-[#78716c] font-semibold mb-2">
            Investment Strategy
          </span>
          <h2 className="font-display-lg text-display-lg text-[#1c1b1b] leading-tight">
            Tailored Investment for Lasting Impressions
          </h2>
          <p className="font-body-lg text-body-lg text-[#57534e] max-w-xl mt-space-sm leading-relaxed">
            Transparent pricing designed for individual partners, scaling practices, and multinational enterprises.
          </p>

          {/* Dynamic Billing Toggle */}
          <div className="mt-space-md inline-flex items-center p-1.5 rounded-full bg-[#e5e0d8] shadow-inner">
            <button
              type="button"
              onClick={() => setPricingMode('onetime')}
              className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all ${
                pricingMode === 'onetime' ? 'bg-[#1c1b1b] text-white shadow-sm' : 'text-[#57534e] hover:text-[#1c1b1b]'
              }`}
            >
              One-Time Setup
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('enterprise')}
              className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all ${
                pricingMode === 'enterprise' ? 'bg-[#1c1b1b] text-white shadow-sm' : 'text-[#57534e] hover:text-[#1c1b1b]'
              }`}
            >
              With Enterprise Cloud Support
            </button>
          </div>
        </div>

        {/* 4 Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md items-stretch">
          {/* Package A */}
          <div className="p-space-lg rounded-xl bg-white shadow-sm flex flex-col justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#78716c]">Entry Tier</span>
              <h3 className="font-title-lg text-title-lg font-bold text-[#1c1b1b] mt-1">Digital Profile Only</h3>
              <p className="font-body-sm text-body-sm text-[#78716c] mt-1">Instant digital business link for digital-first operators.</p>
              <div className="my-space-md">
                <span className="font-display-md text-headline-lg font-semibold text-[#1c1b1b]">{prices.a}</span>
                <span className="font-label-sm text-label-sm text-[#78716c] ml-1">{prices.periodA}</span>
              </div>
              <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-[#44403c]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Single-page hosted profile
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Instant 1-tap vCard export
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Dynamic QR Code generator
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Unlimited digital shares
                </li>
                <li className="flex items-center gap-2 text-stone-400">
                  <span className="material-symbols-outlined text-stone-300 text-sm">close</span> Physical card not included
                </li>
              </ul>
            </div>
            <div className="pt-space-lg">
              <Link
                href="#contact"
                className="w-full py-2.5 rounded-DEFAULT bg-[#e5e0d8] hover:bg-[#d6d0c6] text-[#1c1b1b] font-label-md text-label-md uppercase tracking-wider text-center block transition-all"
              >
                Select Profile
              </Link>
            </div>
          </div>

          {/* Package B */}
          <div className="p-space-lg rounded-xl bg-white shadow-sm flex flex-col justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#78716c]">Tactile Standard</span>
              <h3 className="font-title-lg text-title-lg font-bold text-[#1c1b1b] mt-1">NFC Business Card</h3>
              <p className="font-body-sm text-body-sm text-[#78716c] mt-1">
                Precision physical card + complete digital ecosystem.
              </p>
              <div className="my-space-md">
                <span className="font-display-md text-headline-lg font-semibold text-[#1c1b1b]">{prices.b}</span>
                <span className="font-label-sm text-label-sm text-[#78716c] ml-1">{prices.periodB}</span>
              </div>
              <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-[#44403c]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> 1x Custom Matte Obsidian NFC Card
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Precision laser UV logo engraving
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Full Cloud Digital Profile access
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Unrestricted tap credentials
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Standard concierge onboarding
                </li>
              </ul>
            </div>
            <div className="pt-space-lg">
              <Link
                href="#contact"
                className="w-full py-2.5 rounded-DEFAULT bg-[#1c1b1b] hover:bg-black text-white font-label-md text-label-md uppercase tracking-wider text-center block transition-all"
              >
                Order NFC Card
              </Link>
            </div>
          </div>

          {/* Package C [FEATURED] */}
          <div className="p-space-lg rounded-xl bg-[#171717] text-white shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary-container text-white font-label-sm text-label-sm tracking-[0.2em] uppercase">
              Most Popular Reserve
            </div>
            <div className="flex flex-col pt-2">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">Flagship Edition</span>
              <h3 className="font-title-lg text-title-lg font-bold text-white mt-1">Premium Business</h3>
              <p className="font-body-sm text-body-sm text-outline mt-1">Double card suite with custom domain and CRM sync.</p>
              <div className="my-space-md">
                <span className="font-display-md text-headline-lg font-semibold text-primary">{prices.c}</span>
                <span className="font-label-sm text-label-sm text-outline ml-1">{prices.periodC}</span>
              </div>
              <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span> 2x Bespoke Matte or Metal NFC Cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span> Custom personal domain routing
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span> Reciprocal Lead Capture CRM sync
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span> Real-time analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span> Priority white-glove setup (24h)
                </li>
              </ul>
            </div>
            <div className="pt-space-lg">
              <Link
                href="#contact"
                className="w-full py-3 rounded-DEFAULT bg-secondary-container hover:bg-[#a61318] text-white font-label-md text-label-md uppercase tracking-[0.2em] text-center block shadow-md transition-all"
              >
                Claim Premium Suite
              </Link>
            </div>
          </div>

          {/* Package D: Custom Corporate Suite */}
          <div className="p-space-lg rounded-xl bg-white shadow-sm flex flex-col justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#78716c]">Enterprise</span>
              <h3 className="font-title-lg text-title-lg font-bold text-[#1c1b1b] mt-1">Corporate Suite</h3>
              <p className="font-body-sm text-body-sm text-[#78716c] mt-1">Centralized fleet control for 10 to 1,000+ executives.</p>
              <div className="my-space-md">
                <span className="font-display-md text-headline-lg font-semibold text-[#1c1b1b]">Custom</span>
                <span className="font-label-sm text-label-sm text-[#78716c] ml-1">/ bespoke volume</span>
              </div>
              <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-[#44403c]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Centralized MDM admin dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Bulk employee profile deployment
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Custom brand token governance
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Single Sign-On (Okta / Azure AD)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-sm">check</span> Dedicated executive concierge
                </li>
              </ul>
            </div>
            <div className="pt-space-lg">
              <Link
                href="#contact"
                className="w-full py-2.5 rounded-DEFAULT bg-[#1c1b1b] hover:bg-black text-white font-label-md text-label-md uppercase tracking-wider text-center block transition-all"
              >
                Request Fleet Proposal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
