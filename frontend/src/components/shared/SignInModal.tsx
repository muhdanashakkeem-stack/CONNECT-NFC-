'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { getRedirectPathForRole } from '@/lib/auth/session';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const user = await login({ email: email.trim() });
      onClose();
      router.push(getRedirectPathForRole(user.role));
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Access restricted: Your account has not been provisioned by an administrator.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your Google account email address first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Connect to Google Sign-In endpoint
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: email.split('@')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Google Sign-In failed.');
      }

      // Store session
      if (typeof window !== 'undefined') {
        localStorage.setItem('speed_nfc_token', data.data.token);
        localStorage.setItem('speed_nfc_user', JSON.stringify(data.data.user));
      }

      onClose();
      router.push(getRedirectPathForRole(data.data.user.role));
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Google Sign-In Denied: Your account has not been provisioned by an administrator.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] bg-white text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col transition-all transform scale-100 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-3 shadow-md">
            <span className="material-symbols-outlined text-2xl">contactless</span>
          </div>
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif" }}
          >
            Sign in to CONNECT NFC
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access your private executive card & client portal.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-red-500 flex-shrink-0 mt-0.5">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Button 1: Sign in with Email */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign in with Email'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
            or
          </span>
        </div>

        {/* Button 2: Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
        >
          {/* Google Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Policy Notice */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 leading-normal">
            Private Client Portal: Client accounts are provisioned exclusively by administrators. Public registration is closed.
          </p>
        </div>
      </div>
    </div>
  );
};
