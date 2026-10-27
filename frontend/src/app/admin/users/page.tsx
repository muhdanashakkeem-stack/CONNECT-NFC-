'use client';

import React from 'react';

const MOCK_USERS = [
  { id: '1', name: 'Adrian Vance', email: 'adrian@vancepartners.com', role: 'client', cards: 3, status: 'active' },
  { id: '2', name: 'Elena Rostova', email: 'elena.rostova@luxuryatelier.com', role: 'customer', cards: 1, status: 'active' },
  { id: '3', name: 'Noram Micro', email: 'norammicro042@gmail.com', role: 'admin', cards: 0, status: 'active' },
  { id: '4', name: 'Marcus Sterling', email: 'marcus@sterlingprivate.com', role: 'client', cards: 5, status: 'active' },
];

export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-md text-2xl md:text-3xl font-semibold text-primary">
            Enterprise MDM User Directory
          </h1>
          <p className="text-xs text-outline mt-1">Manage executive cardholders, permission sets, and access tiers.</p>
        </div>
        <button className="px-4 py-2 rounded bg-secondary-container hover:bg-[#a61318] text-white text-xs font-label-sm uppercase tracking-wider">
          + Invite Executive
        </button>
      </div>

      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 text-xs text-outline uppercase font-label-sm">
              <th className="py-3 px-4">Name & Email</th>
              <th className="py-3 px-4">Role Tier</th>
              <th className="py-3 px-4">Associated Cards</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-surface-container-high/40">
                <td className="py-3 px-4">
                  <div className="font-medium text-primary">{u.name}</div>
                  <div className="text-xs text-outline">{u.email}</div>
                </td>
                <td className="py-3 px-4 font-mono text-xs uppercase text-secondary">{u.role}</td>
                <td className="py-3 px-4 text-xs font-mono">{u.cards} Active</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-label-sm bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-xs text-primary">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
