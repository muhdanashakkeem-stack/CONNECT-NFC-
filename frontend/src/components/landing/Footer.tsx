'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest text-on-surface-variant pt-space-xl pb-space-lg border-t border-outline-variant/20">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-xl">
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Speed NFC Luxury Brand Emblem"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
              />
              <span className="font-display-md text-headline-sm uppercase tracking-widest text-primary leading-none">
                SPEED NFC
              </span>
            </div>
            <p className="font-body-md text-body-md text-outline max-w-md leading-relaxed">
              The definitive instrument of physical-to-digital communion. Precision CNC-milled titanium, heavy-ply obsidian substrates, and instantaneous contactless credential exchange crafted for the modern visionary.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
              <a
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-lg">work</span>
              </a>
              <a
                aria-label="X"
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-lg">tag</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-space-xs font-semibold">
              Crafted Editions
            </h4>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="#profile-showcase">
              Brushed Titanium Reserve
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="#profile-showcase">
              Matte Obsidian Carbon
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="#profile-showcase">
              Debossed 600gsm Cotton
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="#services">
              Enterprise Fleet Architecture
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="#packages">
              Private Commission Suite
            </Link>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-sm">
            <h4 className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-space-xs font-semibold">
              Portals & Architecture
            </h4>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="/login">
              Executive Client Login
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="/admin">
              Super Admin Fleet Console
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="/client">
              Private Client Digital Matrix
            </Link>
            <Link className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors" href="/customer">
              Customer Card Lounge
            </Link>
            <div className="pt-2 text-[11px] font-mono text-outline/70">
              © 2026 SPEED NFC INC. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
