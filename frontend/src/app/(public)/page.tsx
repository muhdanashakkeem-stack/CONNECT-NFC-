'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ProfileShowcase } from '@/components/landing/ProfileShowcase';
import { Services } from '@/components/landing/Services';
import { Pricing } from '@/components/landing/Pricing';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Stories } from '@/components/landing/Stories';
import { ContactPortal } from '@/components/landing/ContactPortal';
import { Footer } from '@/components/landing/Footer';
import { ObsidianPrismAdmin } from '@/components/admin/ObsidianPrismAdmin';
import { ClientOverview } from '@/components/dashboard/ClientOverview';
import { CustomerOverview } from '@/components/dashboard/CustomerOverview';

export default function UnifiedRolePortal() {
  const { isAuthenticated, role, user, logout, isLoading } = useAuth();
  const [viewRoleDashboard, setViewRoleDashboard] = useState<boolean>(true);

  // If Admin and in Dashboard View, render the master Obsidian Prism Admin Panel directly
  if (isAuthenticated && role === 'admin' && viewRoleDashboard) {
    return (
      <ObsidianPrismAdmin
        onTogglePublicView={() => setViewRoleDashboard(false)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* If Authenticated: Persistent Executive Role Control Bar on http://localhost:3000 */}
      {isAuthenticated && user && (
        <div className="w-full bg-[#101010] border-b border-[#262626] py-2.5 px-4 sticky top-0 z-50 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Authenticated:</span>
              <span className="text-white font-semibold">{user.name}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  role === 'admin'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : role === 'client'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-stone-800 text-stone-200'
                }`}
              >
                {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Role Console vs Landing Page */}
            <button
              onClick={() => setViewRoleDashboard(!viewRoleDashboard)}
              className="px-3 py-1.5 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {viewRoleDashboard ? 'public' : 'dashboard'}
              </span>
              <span>{viewRoleDashboard ? 'View Landing Page' : `Open ${role?.toUpperCase()} Console`}</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Role-Based Dashboard View for Client/Customer (When authenticated and active) */}
      {isAuthenticated && viewRoleDashboard ? (
        <div className="flex-1 w-full flex flex-col">
          <main className="flex-1 w-full p-4 md:p-6">
            {role === 'client' ? (
              <ClientOverview />
            ) : (
              <CustomerOverview />
            )}
          </main>
        </div>
      ) : (
        /* Public Landing Page View */
        <>
          <Header />
          <main className="w-full pt-20 bg-background flex flex-col">
            <Hero />
            <ProfileShowcase />
            <Services />
            <Pricing />
            <HowItWorks />
            <Stories />
            <ContactPortal />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
