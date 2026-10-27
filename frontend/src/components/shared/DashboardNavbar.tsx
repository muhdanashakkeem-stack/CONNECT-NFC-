'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { BackendStatusPill } from './BackendStatusPill';

export const DashboardNavbar: React.FC = () => {
  const { user, role, logout, switchRolePreview } = useAuth();

  return (
    <header className="h-20 w-full border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            alt="CONNECT NFC Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
          />
          <div className="flex flex-col">
            <span className="font-display-md text-sm uppercase tracking-widest text-primary font-semibold group-hover:text-secondary-fixed transition-colors">
              CONNECT NFC
            </span>
            <span className="text-[10px] uppercase tracking-wider text-outline">
              Executive Console
            </span>
          </div>
        </Link>

        {/* Quick Role Switcher Pill for development / testing preview */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded bg-surface-container-high text-xs">
          <span className="text-[10px] text-outline px-1.5 uppercase font-label-sm">Role:</span>
          {(['admin', 'client', 'customer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => switchRolePreview(r)}
              className={`px-2.5 py-1 rounded text-[10px] font-label-sm uppercase tracking-wider transition-all ${
                role === r
                  ? 'bg-secondary-container text-white font-bold'
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-bright'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <BackendStatusPill />

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-title-sm text-xs font-semibold text-primary truncate max-w-[150px]">
                {user.name}
              </span>
              <span className="text-[10px] font-label-sm uppercase tracking-wider text-secondary">
                {user.role} tier
              </span>
            </div>

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-outline-variant"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-white font-bold text-xs uppercase">
                {user.name.charAt(0)}
              </div>
            )}

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded hover:bg-surface-container-high text-outline hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
