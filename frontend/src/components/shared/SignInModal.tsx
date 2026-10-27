'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectPathForRole } from '@/lib/auth/session';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setErrorMsg(null);
      setInfoMsg(null);
      setOtpDigits(['', '', '', '', '', '']);
      setIsVerifiedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
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
      setInfoMsg(data.message || `A 6-digit verification code has been sent to ${email}. Please check your inbox.`);

      // Auto-focus first input box
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit change with auto-focus movement
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanValue = value.replace(/[^0-9]/g, '');

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue ? cleanValue[cleanValue.length - 1] : '';
    setOtpDigits(newDigits);

    // If entered a digit, move focus to next input
    if (cleanValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle Paste support for complete 6-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);

    // Focus last filled box
    const nextFocus = Math.min(pastedData.length, 5);
    otpInputsRef.current[nextFocus]?.focus();
  };

  // Handle Step 2: Verify OTP
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

      // Store authenticated session
      if (typeof window !== 'undefined') {
        localStorage.setItem('speed_nfc_token', data.data.token);
        localStorage.setItem('speed_nfc_user', JSON.stringify(data.data.user));
      }

      setIsVerifiedSuccess(true);

      // Brief transition delay to show success
      setTimeout(() => {
        onClose();
        router.push(getRedirectPathForRole(data.data.user.role));
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Sign-In helper
  const handleGoogleSignIn = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your Google account email address first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: email.split('@')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Google Sign-In failed.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('speed_nfc_token', data.data.token);
        localStorage.setItem('speed_nfc_user', JSON.stringify(data.data.user));
      }

      onClose();
      router.push(getRedirectPathForRole(data.data.user.role));
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In Denied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] bg-white text-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col transition-all transform scale-100 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-3 shadow-md">
            <span className="material-symbols-outlined text-[22px]">contactless</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {step === 'email' ? 'Client Sign In' : 'Email Verification'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
            {step === 'email'
              ? 'Enter your provisioned email to receive a secure one-time password (OTP).'
              : `Enter the 6-digit code dispatched to ${email}`}
          </p>
        </div>

        {/* Error / Info Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0 mt-0.5">error</span>
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {infoMsg && !errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
            <span className="leading-snug">{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-mono uppercase tracking-wider text-gray-600 font-semibold">
                Provisioned Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Send One-Time Password</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium text-xs flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* STEP 2: Dedicated OTP Verification Interface */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            {/* 6 Individual OTP Boxes with Paste Support */}
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
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-inner"
                />
              ))}
            </div>

            {/* PREPARED ANIMATION CONTAINER (Slot for user's supplied OTP animation code) */}
            <div id="otp-animation-slot" className="w-full flex items-center justify-center min-h-[24px]">
              {isVerifiedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs animate-bounce">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Credentials Verified! Signing in...</span>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length < 6}
              className="w-full h-11 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  <span>Verify & Access Account</span>
                </>
              )}
            </button>

            {/* Resend and Back navigation */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>Change email</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={resendCountdown > 0 || isSubmitting}
                className="text-black font-semibold hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
              >
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Note */}
        <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
          Access is limited to provisioned clients. Self-registration is disabled for hardware security.
        </p>
      </div>
    </div>
  );
};
