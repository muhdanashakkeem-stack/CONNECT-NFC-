'use client';

import React, { useState } from 'react';
import { DigitalCard } from '@/types/card';
import { useAuth } from '@/lib/auth/context';

const INITIAL_CARD: DigitalCard = {
  id: 'card_client_01',
  userId: 'usr_client_02',
  slug: 'adrian-vance',
  cardName: 'Executive Titanium Primary',
  cardholderName: 'Adrian Vance',
  headlineTitle: 'Managing Partner & Founder',
  companyName: 'Vance & Partners Advisory',
  bio: 'Private equity advisor & cross-border mergers. Dedicated to building durable generational enterprises.',
  email: 'adrian@vancepartners.com',
  phone: '+44 20 7946 0912',
  location: 'Mayfair, London · Zurich',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  finish: 'obsidian',
  nfcChipUid: '04:8F:2A:1B:6C:5E:80',
  nfcFrequency: '13.56 MHz NTAG216',
  totalTaps: 1482,
  lastTappedAt: '2026-10-26T14:22:00Z',
  isActive: true,
  socialLinks: [
    { id: '1', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/adrian-vance', isActive: true },
    { id: '2', platform: 'whatsapp', label: 'WhatsApp Concierge', url: 'https://wa.me/442079460912', isActive: true },
    { id: '3', platform: 'calendly', label: 'Schedule 30m Advisory', url: 'https://calendly.com', isActive: true },
  ],
  createdAt: '2026-08-14T10:00:00Z',
  updatedAt: '2026-10-26T14:22:00Z',
};

export const ClientOverview: React.FC = () => {
  const { user } = useAuth();
  const [card, setCard] = useState<DigitalCard>(INITIAL_CARD);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${card.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-label-sm tracking-[0.2em] text-outline">
              Private Client Digital Matrix
            </span>
          </div>
          <h1 className="font-display-md text-2xl md:text-3xl text-primary font-semibold">
            {user?.name || card.cardholderName}&apos;s Digital Profile
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-xs font-label-sm uppercase tracking-wider text-primary transition-all flex items-center gap-2 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base">link</span>
            {copied ? 'Link Copied!' : 'Copy NFC Destination URL'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs font-label-sm uppercase tracking-wider text-outline">Lifetime Contact Taps</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display-md text-3xl font-bold text-primary">{card.totalTaps}</span>
            <span className="text-xs text-emerald-400 font-mono">+18 this week</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs font-label-sm uppercase tracking-wider text-outline">Physical NFC Hardware</span>
          <div className="mt-2">
            <span className="font-semibold text-primary block">{card.nfcFrequency}</span>
            <span className="text-xs text-outline font-mono">UID: {card.nfcChipUid}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30">
          <span className="text-xs font-label-sm uppercase tracking-wider text-outline">Cloud Sync Engine</span>
          <div className="mt-2">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Synchronized Live
            </span>
            <span className="text-xs text-outline font-mono">Backend Secure Relay Active</span>
          </div>
        </div>
      </div>

      {/* Profile Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Edit Profile Details */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-surface-container border border-outline-variant/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-title-lg text-lg text-primary font-semibold">Edit Dynamic Credentials</h2>
              <p className="text-xs text-outline">Changes update instantly across all tapped devices.</p>
            </div>
            {savedNotice && (
              <span className="text-xs text-emerald-400 font-label-sm uppercase tracking-wider bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                Credentials Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-label-sm text-outline">Cardholder Name</label>
                <input
                  type="text"
                  value={card.cardholderName}
                  onChange={(e) => setCard({ ...card, cardholderName: e.target.value })}
                  className="px-3 py-2 rounded bg-surface border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-label-sm text-outline">Executive Title</label>
                <input
                  type="text"
                  value={card.headlineTitle}
                  onChange={(e) => setCard({ ...card, headlineTitle: e.target.value })}
                  className="px-3 py-2 rounded bg-surface border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-label-sm text-outline">Organization / Firm</label>
                <input
                  type="text"
                  value={card.companyName}
                  onChange={(e) => setCard({ ...card, companyName: e.target.value })}
                  className="px-3 py-2 rounded bg-surface border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-label-sm text-outline">Direct Phone</label>
                <input
                  type="tel"
                  value={card.phone}
                  onChange={(e) => setCard({ ...card, phone: e.target.value })}
                  className="px-3 py-2 rounded bg-surface border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-label-sm text-outline">Executive Bio</label>
              <textarea
                rows={3}
                value={card.bio}
                onChange={(e) => setCard({ ...card, bio: e.target.value })}
                className="px-3 py-2 rounded bg-surface border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded bg-secondary-container hover:bg-[#a61318] text-white text-xs font-label-sm uppercase tracking-wider transition-all shadow-sm"
              >
                Save Live Profile Updates
              </button>
            </div>
          </form>
        </div>

        {/* Right Phone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs uppercase font-label-sm tracking-wider text-outline mb-3">
            Real-Time Recipient View
          </div>
          <div className="w-[300px] rounded-[36px] bg-[#1a1918] p-3 shadow-2xl border border-[#2a2a2a]">
            <div className="w-full rounded-[28px] bg-[#121212] text-white overflow-hidden flex flex-col p-4 pb-6">
              <div className="flex flex-col items-center text-center pt-2">
                <img
                  src={card.avatarUrl}
                  alt={card.cardholderName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-stone-400 mb-3"
                />
                <h3 className="font-display-md text-lg text-white font-semibold">{card.cardholderName}</h3>
                <p className="text-xs text-secondary font-label-sm uppercase tracking-wider">{card.headlineTitle}</p>
                <p className="text-xs text-outline mt-0.5">{card.companyName}</p>
                <p className="text-xs text-stone-300 mt-2 px-2 leading-relaxed">{card.bio}</p>

                <div className="w-full grid grid-cols-2 gap-2 mt-4">
                  <button className="py-2 px-2 rounded bg-secondary-container text-white text-[11px] font-label-sm uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">save</span> vCard
                  </button>
                  <button className="py-2 px-2 rounded bg-[#242424] text-white text-[11px] font-label-sm uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">mail</span> Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
