'use client';

import React from 'react';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardNavbar } from '@/components/shared/DashboardNavbar';
import { DashboardSidebar } from '@/components/shared/DashboardSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-background text-on-surface flex flex-col">
        <DashboardNavbar />
        <div className="flex flex-1">
          <DashboardSidebar role="admin" />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
