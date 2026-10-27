'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types/auth';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  superadmin: [
    { href: '/admin', label: 'Command Overview', icon: 'dashboard' },
    { href: '/admin/users', label: 'Enterprise MDM Users', icon: 'group' },
    { href: '/admin/orders', label: 'Commission Pipeline', icon: 'inventory_2' },
    { href: '/admin/fleet', label: 'NFC Fleet Dispatch', icon: 'contactless' },
  ],
  admin: [
    { href: '/admin', label: 'Command Overview', icon: 'dashboard' },
    { href: '/admin/users', label: 'Enterprise MDM Users', icon: 'group' },
    { href: '/admin/orders', label: 'Commission Pipeline', icon: 'inventory_2' },
    { href: '/admin/fleet', label: 'NFC Fleet Dispatch', icon: 'contactless' },
  ],
  client: [
    { href: '/client', label: 'My Digital Profiles', icon: 'badge' },
    { href: '/client/analytics', label: 'Tap Analytics & Heatmap', icon: 'monitoring' },
    { href: '/client/leads', label: 'Reciprocal Lead Matrix', icon: 'hub' },
    { href: '/client/settings', label: 'Custom Domain & QR', icon: 'tune' },
  ],
  customer: [
    { href: '/customer', label: 'My Physical Cards', icon: 'credit_card' },
    { href: '/customer/orders', label: 'Engraving Order Status', icon: 'local_shipping' },
    { href: '/customer/support', label: 'Concierge Desk', icon: 'support_agent' },
  ],
};

export const DashboardSidebar: React.FC<{ role: UserRole }> = ({ role }) => {
  const pathname = usePathname();
  const items = NAV_ITEMS_BY_ROLE[role] || [];

  return (
    <aside className="w-64 border-r border-outline-variant/30 bg-surface-container-lowest/50 min-h-[calc(100vh-80px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 text-[10px] uppercase font-label-md tracking-[0.2em] text-outline">
          {role === 'admin' || role === 'superadmin' ? 'Super Admin Fleet' : role === 'client' ? 'Client Workspace' : 'Customer Lounge'}
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
                isActive
                  ? 'bg-surface-container-high text-white font-medium border-l-2 border-secondary'
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-container/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'text-secondary' : 'text-outline'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 rounded bg-surface-container border border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 text-secondary font-label-sm uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-sm">shield</span>
          Backend Protected
        </div>
        <p className="text-[11px] text-outline leading-relaxed">
          Sensitive operations, JWT verification, and Supabase writes are strictly guarded by your Node.js backend.
        </p>
      </div>
    </aside>
  );
};
