'use client';

import React from 'react';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#fcf8fb] text-[#1c1b1d]">{children}</div>
    </RoleGuard>
  );
}
