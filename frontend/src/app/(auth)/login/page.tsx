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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
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
        email,
        password,
        role: selectedRole,
      });

      router.push(getRedirectPathForRole(loggedInUser.role));
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (roleChoice: UserRole) => {
    setSelectedRole(roleChoice);
    if (roleChoice === 'admin') {
      setEmail('admin@speednfc.com');
      setPassword('admin_secret_pass');
    } else if (roleChoice === 'client') {
      setEmail('adrian@vancepartners.com');
      setPassword('client_secret_pass');
    } else {
      setEmail('elena.rostova@luxuryatelier.com');
      setPassword('customer_secret_pass');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            alt="Speed NFC Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UrhtUczzO6AFHRwc8fymc-EB9kER5AMz0Dcw__tVjbcPmTV1lGEow3eEkvXcxy_aE2Ug6qCfw7r-uFl9fT22Vvv3IJwXCmdupxoXDyQS-xo0ZCqbQJTC_uNUpFY0VnCMoUWh1smr6TaipZ5XcG0UhFFOUgbVVd8rGeVCLge0zgdmwd6n_qgzT4lCSZRsI3W2GoZ1qXZL45hKLkCGf8Aw1KyaTm1Pz0Jgy_R93jF7SMMVEQQTQIw12uiHA"
          />
          <span className="font-display-md text-base uppercase tracking-widest text-primary font-semibold">
            SPEED NFC
          </span>
        </Link>
        <BackendStatusPill />
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-8 p-8 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container/20 text-secondary mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">passkey</span>
          </div>
          <h1 className="font-display-md text-2xl text-primary font-semibold">
            Atelier Executive Sign In
          </h1>
          <p className="font-body-sm text-xs text-outline mt-1">
            Access your NFC hardware management console & dynamic profile.
          </p>
        </div>

        {/* Quick Role Tester Selector */}
        <div className="mb-6 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <div className="text-[10px] uppercase font-label-sm tracking-wider text-outline mb-2">
            Select Role to Quick-Fill:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`py-1.5 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all ${
                selectedRole === 'admin'
                  ? 'bg-secondary-container text-white font-bold'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('client')}
              className={`py-1.5 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all ${
                selectedRole === 'client'
                  ? 'bg-secondary-container text-white font-bold'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className={`py-1.5 px-2 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all ${
                selectedRole === 'customer'
                  ? 'bg-secondary-container text-white font-bold'
                  : 'bg-surface-container-high text-outline hover:text-white'
              }`}
            >
              Customer
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded bg-red-950/80 border border-red-800 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase font-label-sm tracking-wider text-outline">
              Executive Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="px-3.5 py-2.5 rounded bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase font-label-sm tracking-wider text-outline">
              Security Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="px-3.5 py-2.5 rounded bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded bg-secondary-container hover:bg-[#a61318] disabled:opacity-50 text-white font-label-md text-label-md uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Console'}</span>
            <span className="material-symbols-outlined text-base">login</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
          <Link href="/" className="text-xs text-outline hover:text-primary transition-colors">
            ← Return to Public Landing Page
          </Link>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="text-center text-[11px] text-outline/60 font-mono">
        Backend-Enforced Authentication & Role Authorization · Speed NFC Inc.
      </div>
    </div>
  );
}
