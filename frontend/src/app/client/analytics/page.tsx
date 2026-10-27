'use client';

import React from 'react';

export default function ClientAnalyticsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-md text-2xl md:text-3xl font-semibold text-primary">
            Tap Telemetry & Geographic Heatmap
          </h1>
          <p className="text-xs text-outline mt-1">Real-time contactless interaction tracking across global events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs text-outline uppercase font-label-sm">Total Card Taps</span>
          <div className="text-3xl font-display-md text-primary font-bold mt-2">1,482</div>
          <span className="text-xs text-emerald-400 font-mono">Top location: London Mayfair (42%)</span>
        </div>
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs text-outline uppercase font-label-sm">vCard Saves</span>
          <div className="text-3xl font-display-md text-primary font-bold mt-2">1,120</div>
          <span className="text-xs text-emerald-400 font-mono">75.5% conversion rate</span>
        </div>
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs text-outline uppercase font-label-sm">Smart QR Scans</span>
          <div className="text-3xl font-display-md text-primary font-bold mt-2">362</div>
          <span className="text-xs text-secondary font-mono">Desktop and fallback</span>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4">
        <h2 className="font-title-lg text-primary font-semibold text-base">Recent Contact Exchanges</h2>
        <div className="divide-y divide-outline-variant/10 text-xs font-mono">
          <div className="py-2.5 flex justify-between items-center text-on-surface">
            <span>iPhone 16 Pro · iOS 18 (London, UK)</span>
            <span className="text-secondary">vCard Downloaded · 14 mins ago</span>
          </div>
          <div className="py-2.5 flex justify-between items-center text-on-surface">
            <span>Samsung Galaxy S24 Ultra · Android 15 (Zurich, CH)</span>
            <span className="text-secondary">WhatsApp Opened · 2 hours ago</span>
          </div>
          <div className="py-2.5 flex justify-between items-center text-on-surface">
            <span>iPhone 15 Pro Max · iOS 17.5 (Dubai, UAE)</span>
            <span className="text-secondary">Calendly Opened · Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
