'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';

export const Header: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const dashboardPath = role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/customer';

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-[1240px] h-[72px] px-6 rounded-full flex items-center justify-between gap-space-md transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, #191919, #111111)',
          boxShadow: '8px 8px 20px #090909, -6px -6px 16px rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 flex-shrink-0 px-3.5 py-1.5 rounded-full"
          style={{
            background: '#141414',
            boxShadow: 'inset 2px 2px 5px #0a0a0a, inset -2px -2px 5px rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <img
            alt="NFC Connect Luxury Brand Emblem"
            className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
          />
          <span
            className="flex flex-col tracking-wider text-primary font-bold text-title-md"
            style={{
              fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif",
              fontWeight: 700,
              letterSpacing: '0.09em',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            CONNECT NFC
          </span>
        </Link>

        <nav
          className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-full"
          style={{
            background: '#101010',
            boxShadow: 'inset 3px 3px 7px #070707, inset -2px -2px 6px rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-[0.16em] text-white font-semibold transition-all"
            style={{
              background: 'linear-gradient(145deg, #1e1e1e, #141414)',
              boxShadow: '3px 3px 8px #080808, -2px -2px 6px rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Home
          </Link>
          <Link
            href="#profile-showcase"
            className="px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-[0.16em] text-[#949088] hover:text-white transition-all hover:bg-[#131313]"
          >
            Profile Showcase
          </Link>
          <Link
            href="#services"
            className="px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-[0.16em] text-[#949088] hover:text-white transition-all hover:bg-[#131313]"
          >
            Services
          </Link>
          <Link
            href="#how-it-works"
            className="px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-[0.16em] text-[#949088] hover:text-white transition-all hover:bg-[#131313]"
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            className="px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-[0.16em] text-[#949088] hover:text-white transition-all hover:bg-[#131313]"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-space-md">
          {isAuthenticated ? (
            <Link
              href={dashboardPath}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white font-label-md text-label-md uppercase tracking-[0.18em] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #a61318 0%, #690006 100%)',
                boxShadow:
                  '4px 4px 12px #080808, -2px -2px 8px rgba(255, 255, 255, 0.08), inset 1px 1px 2px rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 180, 171, 0.25)',
              }}
            >
              <span>Dashboard ({role})</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white font-label-md text-label-md uppercase tracking-[0.18em] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #a61318 0%, #690006 100%)',
                boxShadow:
                  '4px 4px 12px #080808, -2px -2px 8px rgba(255, 255, 255, 0.08), inset 1px 1px 2px rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 180, 171, 0.25)',
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
