'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CardData {
  cardholderName: string;
  headlineTitle?: string;
  companyName?: string;
  bio?: string;
  phone?: string;
  email?: string;
  location?: string;
  finish?: string;
  totalTaps?: number;
  avatarUrl?: string;
}

export default function PublicProfileView({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [card, setCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/cards/public/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCard(data.data);
        } else {
          setCard({
            cardholderName: slug.replace('-', ' ').toUpperCase(),
            headlineTitle: 'CONNECT NFC Verified Cardholder',
            companyName: 'Private Reserve Enterprise',
            bio: 'Contactless credentials verified on CONNECT NFC network.',
            phone: '+44 20 7946 0912',
            email: 'concierge@connectnfc.com',
            finish: 'obsidian',
          });
        }
      })
      .catch(() => {
        setCard({
          cardholderName: slug.replace('-', ' ').toUpperCase(),
          headlineTitle: 'CONNECT NFC Verified Cardholder',
          companyName: 'Private Reserve Enterprise',
          bio: 'Contactless credentials verified on CONNECT NFC network.',
          phone: '+44 20 7946 0912',
          email: 'concierge@connectnfc.com',
          finish: 'obsidian',
        });
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleDownloadVcard = () => {
    if (!card) return;
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.cardholderName}`,
      `ORG:${card.companyName || 'CONNECT NFC Client'}`,
      `TITLE:${card.headlineTitle || ''}`,
      `TEL;TYPE=CELL:${card.phone || ''}`,
      `EMAIL:${card.email || ''}`,
      `NOTE:${card.bio || ''}`,
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin text-gray-400">progress_activity</span>
          <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">Resolving NFC Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] flex flex-col items-center justify-center p-4 selection:bg-white selection:text-black font-sans">
      {/* Smartphone Glass Frame */}
      <div className="w-[340px] rounded-[44px] bg-[#1a1918]/80 backdrop-blur-2xl p-3.5 shadow-[0_36px_80px_rgba(0,0,0,0.85)] border border-white/[0.08] relative">
        <div className="w-full rounded-[36px] bg-[#121212] text-white overflow-hidden flex flex-col pb-6 border border-white/[0.05]">
          {/* Dynamic Island Header */}
          <div className="w-full flex justify-center pt-2.5 pb-1 bg-[#121212]">
            <div className="w-24 h-5 rounded-full bg-black/90 flex items-center justify-between px-2.5 border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="material-symbols-outlined text-[10px] text-gray-400">contactless</span>
            </div>
          </div>

          {/* Banner */}
          <div className="h-24 w-full bg-gradient-to-r from-[#1c1b1a] via-[#141414] to-[#26181b] relative">
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
              <div className="w-18 h-18 rounded-full overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-stone-400 to-amber-200">
                <img
                  alt="Portrait"
                  className="w-full h-full object-cover rounded-full"
                  src={
                    card?.avatarUrl ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  }
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-12 px-5 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg text-white font-bold tracking-tight">
                {card?.cardholderName || 'Executive Cardholder'}
              </h1>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#cbb892] mt-0.5">
              CONNECT NFC // VERIFIED IDENTITY
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-[250px] leading-relaxed">
              {card?.headlineTitle || 'Executive Partner'} · {card?.companyName || 'Private Reserve'}
            </p>

            {card?.bio && (
              <p className="text-[11px] text-gray-400 mt-2 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05] leading-relaxed">
                &ldquo;{card.bio}&rdquo;
              </p>
            )}

            {/* Quick Actions */}
            <div className="w-full grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={handleDownloadVcard}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-black text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Save Contact</span>
              </button>
              {card?.email ? (
                <a
                  href={`mailto:${card.email}`}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Email</span>
                </a>
              ) : (
                <div className="py-2.5 px-3 rounded-xl bg-white/[0.08] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 border border-white/[0.08]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Direct Connect Buttons */}
            <div className="w-full flex flex-col gap-2 mt-4 text-xs">
              {card?.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-emerald-400 text-base">call</span>
                    <span className="text-white font-medium">{card.phone}</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
                </a>
              )}
              {card?.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-blue-400 text-base">mail</span>
                    <span className="text-white font-medium">{card.email}</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-gray-500 hover:text-white font-mono uppercase tracking-widest transition-colors">
          CONNECT NFC · Contactless Infrastructure
        </Link>
      </div>
    </div>
  );
}
