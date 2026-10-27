'use client';

import React, { useState } from 'react';
import { PhysicalOrder } from '@/types/order';
import { useAuth } from '@/lib/auth/context';

const INITIAL_ORDER: PhysicalOrder = {
  id: 'ord_9901',
  userId: 'usr_cust_03',
  orderNumber: 'SNFC-2026-8812',
  tier: 'speed-obsidian',
  cardFinish: 'Matte Obsidian Carbon',
  engravingText: 'ELENA ROSTOVA // CREATIVE DIRECTOR',
  quantity: 1,
  totalPrice: 4999,
  currency: 'INR',
  status: 'in_production',
  trackingNumber: 'BLUEDART-88291039',
  shippingAddress: {
    line1: 'Bespoke Atelier, High Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  },
  createdAt: '2026-10-25T16:00:00Z',
  updatedAt: '2026-10-26T12:00:00Z',
};

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Confirmed' },
  { key: 'in_production', label: 'Laser Engraving' },
  { key: 'engraved', label: 'NFC Encoding' },
  { key: 'dispatched', label: 'Courier Transit' },
  { key: 'delivered', label: 'Delivered' },
];

export const CustomerOverview: React.FC = () => {
  const { user } = useAuth();
  const [order] = useState<PhysicalOrder>(INITIAL_ORDER);
  const [isActivated, setIsActivated] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-xs uppercase font-label-sm tracking-[0.2em] text-outline">
              Customer Atelier Lounge
            </span>
          </div>
          <h1 className="font-display-md text-2xl md:text-3xl text-primary font-semibold">
            Welcome, {user?.name || 'Valued Cardholder'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:concierge@speednfc.com"
            className="px-4 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-xs font-label-sm uppercase tracking-wider text-primary transition-all flex items-center gap-2 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            Concierge Support
          </a>
        </div>
      </div>

      {/* Order Status Card */}
      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-outline-variant/20 pb-4">
          <div>
            <div className="text-xs uppercase font-label-sm text-outline">Order Reference</div>
            <div className="font-mono text-lg font-bold text-primary">{order.orderNumber}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-outline font-label-sm uppercase">Total Investment</span>
            <div className="font-display-md text-xl text-primary font-semibold">₹{order.totalPrice.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div>
          <div className="text-xs uppercase font-label-sm text-outline mb-4">Production & Delivery Timeline</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {ORDER_STEPS.map((step, idx) => {
              const currentStepIdx = ORDER_STEPS.findIndex((s) => s.key === order.status);
              const isPastOrCurrent = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-secondary-container/20 border-secondary text-primary'
                      : isPastOrCurrent
                      ? 'bg-surface-container-high border-outline-variant/40 text-on-surface'
                      : 'bg-surface-container-low border-outline-variant/10 text-outline/50'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      isCurrent ? 'text-secondary animate-pulse' : isPastOrCurrent ? 'text-emerald-400' : 'text-outline/40'
                    }`}
                  >
                    {isPastOrCurrent ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-[11px] font-label-sm uppercase tracking-wider">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Hardware Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
            <span className="text-xs uppercase font-label-sm text-secondary font-semibold">Card Specifications</span>
            <div className="text-sm">
              <span className="text-outline">Substrate: </span>
              <span className="text-primary font-medium">{order.cardFinish}</span>
            </div>
            <div className="text-sm">
              <span className="text-outline">Laser Engraving: </span>
              <span className="text-primary font-mono text-xs">{order.engravingText}</span>
            </div>
            <div className="text-sm">
              <span className="text-outline">Carrier Tracking: </span>
              <span className="text-primary font-mono text-xs">{order.trackingNumber}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-label-sm text-secondary font-semibold">Destination Address</span>
              <p className="text-xs text-on-surface mt-1 leading-relaxed">
                {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-xs text-outline">NFC Chip Security</span>
              <button
                onClick={() => setIsActivated(!isActivated)}
                className={`px-3 py-1.5 rounded text-[11px] font-label-sm uppercase tracking-wider transition-all ${
                  isActivated
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-secondary-container hover:bg-[#a61318] text-white'
                }`}
              >
                {isActivated ? 'Hardware Paired' : 'Pair NFC Hardware'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
