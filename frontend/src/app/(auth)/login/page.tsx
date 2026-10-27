'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/types/auth';
import { BackendStatusPill } from '@/components/shared/BackendStatusPill';
import { getRedirectPathForRole } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, role, isLoading } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('adrian@vancepartners.com');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      router.push(getRedirectPathForRole(role));
    }
  }, [isLoading, isAuthenticated, role, router]);

  const handleQuickSelect = (roleChoice: UserRole) => {
    setSelectedRole(roleChoice);
    setStep('email');
    setErrorMsg(null);
    setInfoMsg(null);
    if (roleChoice === 'admin') {
      setEmail('admin@connectnfc.com');
    } else if (roleChoice === 'client') {
      setEmail('adrian@vancepartners.com');
    } else {
      setEmail('elena.rostova@luxuryatelier.com');
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setStep('otp');
      setResendCountdown(data.resendCooldown || 60);
      setInfoMsg(data.message || `A 6-digit code has been sent to ${email}`);

      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: OTP Digit handling
  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue ? cleanValue[cleanValue.length - 1] : '';
    setOtpDigits(newDigits);

    if (cleanValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);

    const nextFocus = Math.min(pastedData.length, 5);
    otpInputsRef.current[nextFocus]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired verification code.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('speed_nfc_token', data.data.token);
        localStorage.setItem('speed_nfc_user', JSON.stringify(data.data.user));
      }

      setIsVerifiedSuccess(true);

      setTimeout(() => {
        router.push(getRedirectPathForRole(data.data.user.role));
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Bypass for Admin convenience
  const handleDirectSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const loggedInUser = await login({ email: email.trim() });
      router.push(getRedirectPathForRole(loggedInUser.role));
    } catch (err: any) {
      setErrorMsg(err.message || 'Direct sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between p-6 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-white text-2xl">contactless</span>
          <span className="text-base uppercase tracking-widest text-primary font-bold">
            CONNECT NFC
          </span>
        </Link>
        <BackendStatusPill />
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-8 p-8 rounded-3xl bg-surface-container border border-outline-variant/30 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white mx-auto mb-3 shadow-md border border-white/10">
            <span className="material-symbols-outlined text-2xl">
              {step === 'email' ? 'verified_user' : 'mark_email_read'}
            </span>
          </div>
          <h1 className="text-2xl text-primary font-bold font-['Plus_Jakarta_Sans',sans-serif]">
            {step === 'email' ? 'Atelier Executive Sign In' : 'Verify Email Code'}
          </h1>
          <p className="font-body-sm text-xs text-outline mt-1.5 leading-relaxed">
            {step === 'email'
              ? 'Passwordless authentication via 6-digit email verification code.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Quick Role Preset Selector */}
        {step === 'email' && (
          <div className="mb-6 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center justify-between text-[10px] uppercase font-label-sm tracking-wider text-outline mb-2">
              <span>Select Provisioned Account:</span>
              <span className="text-emerald-400 font-semibold font-mono">Verified Role</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickSelect('client')}
                className={`py-2 px-2 rounded-lg text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  selectedRole === 'client'
                    ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                    : 'bg-surface-container-high text-outline hover:text-white'
                }`}
              >
                <span>Client</span>
                <span className="text-[9px] opacity-75 font-mono">Adrian Vance</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('admin')}
                className={`py-2 px-2 rounded-lg text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                    : 'bg-surface-container-high text-outline hover:text-white'
                }`}
              >
                <span>Admin</span>
                <span className="text-[9px] opacity-75 font-mono">Fleet Console</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('customer')}
                className={`py-2 px-2 rounded-lg text-[11px] font-label-sm uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'bg-secondary-container text-white font-bold shadow-md ring-1 ring-secondary'
                    : 'bg-surface-container-high text-outline hover:text-white'
                }`}
              >
                <span>Customer</span>
                <span className="text-[9px] opacity-75 font-mono">Order Portal</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Info messages */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && !errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
            <span>{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase font-label-sm tracking-wider text-outline flex items-center justify-between">
                <span>Registered Email Address</span>
                <span className="text-[10px] text-emerald-400 font-mono">Secure OTP Flow</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. adrian@vancepartners.com"
                className="px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-white transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-1 rounded-xl bg-white hover:bg-gray-100 text-black font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Requesting Code...' : 'Send Verification Code'}</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>

            {/* Quick Direct Sign In for Admin or Local Testing */}
            <button
              type="button"
              onClick={handleDirectSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-outline hover:text-white text-xs font-mono uppercase tracking-wider border border-outline-variant/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>Direct Sign In (Session Bypass)</span>
            </button>
          </form>
        )}

        {/* STEP 2: Dedicated OTP Interface */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-1.5" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isSubmitting || isVerifiedSuccess}
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-outline-variant/50 bg-[#161616] text-white focus:bg-black focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Slot for User's Supplied OTP Animation */}
            <div id="login-otp-animation-slot" className="w-full flex items-center justify-center min-h-[24px]">
              {isVerifiedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs animate-bounce">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Authenticated! Redirecting to Console...</span>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length < 6}
              className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-black font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying OTP...' : 'Verify & Log In'}</span>
              <span className="material-symbols-outlined text-base">lock_open</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-outline hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>Change email</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={resendCountdown > 0 || isSubmitting}
                className="text-primary font-semibold hover:underline disabled:text-outline disabled:no-underline cursor-pointer"
              >
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

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
