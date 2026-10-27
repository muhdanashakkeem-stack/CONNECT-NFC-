'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/types/auth';
import { BackendStatusPill } from '@/components/shared/BackendStatusPill';
import { getRedirectPathForRole } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, role, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@connectnfc.com');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate role portal
  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      router.push(getRedirectPathForRole(role));
    }
  }, [isLoading, isAuthenticated, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login({
        email: email.trim(),
        role: selectedRole,
      });

      router.push(getRedirectPathForRole(loggedInUser.role));
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelect = (roleChoice: UserRole) => {
    setSelectedRole(roleChoice);
    if (roleChoice === 'admin') {
      setEmail('admin@connectnfc.com');
    } else if (roleChoice === 'client') {
      setEmail('adrian@vancepartners.com');
    } else {
      setEmail('elena.rostova@luxuryatelier.com');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            alt="CONNECT NFC Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
          />
          <span
            className="text-base uppercase tracking-widest text-primary font-bold"
            style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif" }}
          >
            CONNECT NFC
          </span>
        </Link>
        <BackendStatusPill />
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-8 p-8 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container/20 text-secondary mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <h1
            className="text-2xl text-primary font-bold"
            style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif" }}
          >
            Atelier Executive Sign In
          </h1>
          <p className="font-body-sm text-xs text-outline mt-1.5 leading-relaxed">
            Direct passwordless sign in. Roles and authorization are verified by Supabase.
          </p>
        </div>

        {/* Quick Role Tester Selector */}
        <div className="mb-6 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-center justify-between text-[10px] uppercase font-label-sm tracking-wider text-outline mb-2">
            <span>Select Role:</span>
            <span className="text-[#ff6b35] font-semibold">Supabase Role Check</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickSelect('admin')}
              className={`py-2 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 ${
                selectedRole === 'admin'
                  ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              <span>Admin</span>
              <span className="text-[9px] opacity-75 font-mono">Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('client')}
              className={`py-2 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 ${
                selectedRole === 'client'
                  ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              <span>Client</span>
              <span className="text-[9px] opacity-75 font-mono">Card Holder</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('customer')}
              className={`py-2 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 ${
                selectedRole === 'customer'
                  ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              <span>Customer</span>
              <span className="text-[9px] opacity-75 font-mono">Atelier Order</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean Sign In Form - No Password, No Create Account */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase font-label-sm tracking-wider text-outline flex items-center justify-between">
              <span>Executive Email Address</span>
              <span className="text-[10px] text-emerald-400">Passwordless</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@connectnfc.com"
              className="px-3.5 py-2.5 rounded bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all font-mono"
            />
          </div>

          <div className="p-2.5 rounded bg-[#101010] border border-[#262626] flex items-center gap-2 text-[11px] text-outline">
            <span className="material-symbols-outlined text-base text-secondary">shield</span>
            <span>No password required. Your permissions are resolved directly in Supabase.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-1 rounded bg-secondary-container hover:bg-[#a61318] disabled:opacity-50 text-white font-label-md text-label-md uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying with Supabase...' : 'Sign In with Supabase'}</span>
            <span className="material-symbols-outlined text-base">login</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center flex flex-col gap-2">
          <span className="text-[11px] text-outline">
            Private Atelier Network · Public registration is restricted
          </span>
          <Link href="/" className="text-xs text-outline hover:text-primary transition-colors">
            ← Return to Public Landing Page
          </Link>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="text-center text-[11px] text-outline/60 font-mono">
        Backend-Enforced Authentication & Supabase Role Authorization · CONNECT NFC Inc.
      </div>
    </div>
  );
}
