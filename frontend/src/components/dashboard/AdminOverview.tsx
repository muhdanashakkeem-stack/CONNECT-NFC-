'use client';

import React, { useState } from 'react';
import { CommissionInquiry } from '@/types/order';

const MOCK_INQUIRIES: CommissionInquiry[] = [
  {
    id: 'inq_101',
    fullName: 'David Sterling',
    workEmail: 'd.sterling@rothschild.com',
    phone: '+44 20 7946 0912',
    tier: 'corporate-fleet',
    notes: 'Require 45 brushed titanium cards engraved with corporate crest for London partners.',
    status: 'new',
    createdAt: '2026-10-26T14:32:00Z',
  },
  {
    id: 'inq_102',
    fullName: 'Camille Dupont',
    workEmail: 'camille@dupont-luxe.fr',
    phone: '+33 6 12 34 56 78',
    tier: 'speed-crimson',
    notes: '2x Crimson Reserve with personalized 24k gold leaf foil debossing.',
    status: 'quoted',
    createdAt: '2026-10-25T11:15:00Z',
  },
  {
    id: 'inq_103',
    fullName: 'Rajesh Malhotra',
    workEmail: 'rajesh@malhotracapital.in',
    phone: '+91 98200 12345',
    tier: 'speed-obsidian',
    notes: 'Matte obsidian with executive NFC microchip and QR fallback.',
    status: 'contacted',
    createdAt: '2026-10-24T09:40:00Z',
  },
];

export const AdminOverview: React.FC = () => {
  const [inquiries, setInquiries] = useState<CommissionInquiry[]>(MOCK_INQUIRIES);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-xs uppercase font-label-sm tracking-[0.2em] text-secondary">
              Super Admin Fleet Command
            </span>
          </div>
          <h1 className="font-display-md text-2xl md:text-3xl text-primary font-semibold">
            Enterprise Fleet Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded bg-secondary-container hover:bg-[#a61318] text-white text-xs font-label-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-base">add_card</span>
            Provision Fleet Card
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs font-label-sm uppercase tracking-wider">Active NFC Cards</span>
            <span className="material-symbols-outlined text-xl text-primary">credit_card</span>
          </div>
          <div className="mt-4">
            <span className="font-display-md text-3xl text-primary font-bold">1,842</span>
            <span className="text-xs text-emerald-400 ml-2 font-mono">+12% this week</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs font-label-sm uppercase tracking-wider">Total Contact Taps</span>
            <span className="material-symbols-outlined text-xl text-secondary">sensors</span>
          </div>
          <div className="mt-4">
            <span className="font-display-md text-3xl text-primary font-bold">84,920</span>
            <span className="text-xs text-emerald-400 ml-2 font-mono">+28% YoY</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs font-label-sm uppercase tracking-wider">Active Inquiries</span>
            <span className="material-symbols-outlined text-xl text-tertiary-fixed">mail</span>
          </div>
          <div className="mt-4">
            <span className="font-display-md text-3xl text-primary font-bold">{inquiries.length}</span>
            <span className="text-xs text-secondary ml-2 font-mono">3 awaiting quote</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="text-xs font-label-sm uppercase tracking-wider">Security Engine</span>
            <span className="material-symbols-outlined text-xl text-emerald-400">lock</span>
          </div>
          <div className="mt-4">
            <span className="font-display-md text-xl text-emerald-400 font-bold uppercase">Backend JWT</span>
            <span className="text-xs text-outline block mt-0.5 font-mono">Supabase Row-Level Security</span>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title-lg text-lg text-primary font-semibold">Recent Commission Inquiries</h2>
            <p className="text-xs text-outline">Incoming leads submitted via the public concierge portal.</p>
          </div>
          <span className="text-xs text-secondary font-mono">Synced from Backend Database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-xs text-outline uppercase font-label-sm">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Direct Channel</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-primary">{inq.fullName}</div>
                    <div className="text-xs text-outline">{inq.workEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs uppercase text-secondary">
                    {inq.tier.replace('-', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-outline">
                    {inq.phone || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant max-w-xs truncate">
                    {inq.notes || 'No custom notes.'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-label-sm uppercase tracking-wider ${
                        inq.status === 'new'
                          ? 'bg-secondary-container/80 text-white'
                          : inq.status === 'quoted'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Reviewing inquiry from ${inq.fullName}`)}
                      className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-xs text-primary transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
