'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/types/auth';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface">
        <div className="w-12 h-12 rounded-full border-2 border-secondary-container border-t-transparent animate-spin mb-4"></div>
        <p className="font-label-md text-label-md uppercase tracking-[0.2em] text-outline">
          Authenticating Concierge Protocol...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const hasAccess = role && (allowedRoles.includes(role) || (role === 'superadmin' && allowedRoles.includes('admin')));

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-xl bg-surface-container border border-outline-variant shadow-2xl">
          <span className="material-symbols-outlined text-4xl text-secondary mb-3">lock_person</span>
          <h2 className="font-display-md text-headline-sm text-primary mb-2">Access Restricted</h2>
          <p className="font-body-sm text-body-sm text-outline mb-6">
            Your current account credentials ({role ? role.toUpperCase() : 'UNKNOWN'}) do not hold security clearance for this tier ({allowedRoles.join(', ').toUpperCase()}).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={role === 'admin' || role === 'superadmin' ? '/admin' : role === 'client' ? '/client' : '/customer'}
              className="px-4 py-2.5 rounded bg-secondary-container hover:bg-[#a61318] text-white font-label-sm text-label-sm uppercase tracking-wider transition-all"
            >
              Go to Your Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm uppercase tracking-wider transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
