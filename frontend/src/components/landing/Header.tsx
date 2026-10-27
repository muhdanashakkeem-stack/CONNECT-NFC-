'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';

export const Header: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const dashboardPath = role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/customer';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#171717]/85 backdrop-blur-2xl shadow-[0_1px_16px_rgba(0,0,0,0.60)]">
      <div className="h-20 w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm flex-shrink-0">
          <img
            alt="Speed NFC Luxury Brand Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
          />
          <div className="flex flex-col tracking-wider">
            <span className="font-display-md text-sm font-semibold uppercase tracking-widest text-primary">
              Speed NFC
            </span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-space-lg">
          <Link
            href="#home"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-primary relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[1px] after:bg-primary font-semibold py-1 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#profile-showcase"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors py-1"
          >
            Digital Profile
          </Link>
          <Link
            href="#services"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors py-1"
          >
            Services
          </Link>
          <Link
            href="#packages"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors py-1"
          >
            Packages & Pricing
          </Link>
          <Link
            href="#how-it-works"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors py-1"
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            className="font-label-md text-label-md uppercase tracking-[0.16em] text-on-surface-variant hover:text-primary transition-colors py-1"
          >
            Concierge
          </Link>
        </nav>

        <div className="flex items-center gap-space-md">
          {isAuthenticated ? (
            <Link
              href={dashboardPath}
              className="inline-flex items-center justify-center px-space-md py-2.5 rounded-DEFAULT bg-secondary-container hover:bg-[#800b0e] text-on-surface font-label-md text-label-md uppercase tracking-[0.18em] shadow-[0_4px_16px_rgba(163,28,27,0.35)] transition-all gap-1.5"
            >
              <span>Dashboard ({role})</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-space-md py-2.5 rounded-DEFAULT bg-secondary-container hover:bg-[#800b0e] text-on-surface font-label-md text-label-md uppercase tracking-[0.18em] shadow-[0_4px_16px_rgba(163,28,27,0.35)] transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
