'use client';

import React from 'react';

const MOCK_ORDERS = [
  { id: 'SNFC-901', client: 'Adrian Vance', tier: 'Obsidian Black', quantity: 2, status: 'engraved', amount: '₹8,999' },
  { id: 'SNFC-902', client: 'Elena Rostova', tier: 'Obsidian Black', quantity: 1, status: 'in_production', amount: '₹4,999' },
  { id: 'SNFC-903', client: 'Marcus Sterling', tier: 'Titanium Edition', quantity: 5, status: 'dispatched', amount: '₹24,999' },
];

export default function AdminOrdersPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-md text-2xl md:text-3xl font-semibold text-primary">
            Commission & Production Pipeline
          </h1>
          <p className="text-xs text-outline mt-1">Track CNC milling, laser UV engraving, and NFC chip encoding.</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 text-xs text-outline uppercase font-label-sm">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Tier Spec</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {MOCK_ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-surface-container-high/40">
                <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td className="py-3 px-4 font-medium">{o.client}</td>
                <td className="py-3 px-4 text-xs text-secondary">{o.tier}</td>
                <td className="py-3 px-4 text-xs font-mono">{o.quantity}</td>
                <td className="py-3 px-4 font-mono text-xs">{o.amount}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-label-sm bg-secondary-container/80 text-white">
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-xs text-primary">
                    Update Status
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
