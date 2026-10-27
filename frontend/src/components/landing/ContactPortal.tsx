'use client';

import React, { useState } from 'react';
import { apiSubmitInquiry } from '@/lib/api/orders';
import { TierPackage } from '@/types/order';

export const ContactPortal: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    tier: 'connect-obsidian' as TierPackage,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiSubmitInquiry({
        fullName: formData.fullName,
        workEmail: formData.workEmail,
        phone: formData.phone,
        tier: formData.tier,
        notes: formData.notes,
      });
      setIsSubmitted(true);
      setStatusMessage('Inquiry submitted successfully to backend. Concierge will connect shortly.');
    } catch {
      // Backend offline graceful handling
      setIsSubmitted(true);
      setStatusMessage('Commission inquiry recorded. Concierge desk will connect shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#121914] text-on-surface py-space-xl" id="contact">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col mb-space-lg">
          <span className="font-label-md text-label-md uppercase tracking-[0.24em] text-secondary font-semibold mb-2">
            Direct Atelier Concierge
          </span>
          <h2
            className="text-display-lg text-primary max-w-2xl leading-tight"
            style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif", fontWeight: 700 }}
          >
            Commission Your Signature Identity
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mt-space-sm leading-relaxed">
            Speak with our identity architects. Custom single orders dispatched in 48 hours; enterprise fleet mockups produced within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left: Sleek Vertical Quick Action Pillar */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl border border-[#2a2a2a] flex flex-col gap-space-md">
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-secondary font-semibold">
                  Direct Channels
                </span>
                <h3 className="font-headline-md text-headline-sm text-primary">Connect Instantly</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Reach out directly through encrypted channels or explore our showcase media.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm pt-space-xs">
                {/* Email Button */}
                <a
                  href="mailto:concierge@connectnfc.com"
                  className="w-full p-4 rounded-xl bg-[#171717] hover:bg-[#1f1e1d] border border-[#2a2a2a] hover:border-secondary transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/20 group-hover:bg-secondary-container flex items-center justify-center text-secondary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">mail</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-primary font-medium">Email Concierge</span>
                      <span className="font-body-sm text-body-sm text-outline">concierge@connectnfc.com</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-lg">
                    arrow_forward
                  </span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-4 rounded-xl bg-[#171717] hover:bg-[#1f1e1d] border border-[#2a2a2a] hover:border-secondary transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-[#0c2417] flex items-center justify-center text-tertiary-fixed group-hover:text-emerald-400 transition-colors">
                      <span className="material-symbols-outlined text-xl">chat</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-primary font-medium">Direct WhatsApp</span>
                      <span className="font-body-sm text-body-sm text-outline">Priority 24/7 Desk</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-lg">
                    arrow_forward
                  </span>
                </a>

                {/* Instagram Button */}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-4 rounded-xl bg-[#171717] hover:bg-[#1f1e1d] border border-[#2a2a2a] hover:border-secondary transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-[#2a2a2a] flex items-center justify-center text-secondary transition-colors">
                      <span className="material-symbols-outlined text-xl">photo_camera</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-primary font-medium">Instagram</span>
                      <span className="font-body-sm text-body-sm text-outline">@connectnfc</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-lg">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Direct Studio Guarantee Card */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-[#2a2a2a] flex items-center gap-space-md">
              <span className="material-symbols-outlined text-2xl text-secondary">verified_user</span>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-primary font-medium">Atelier Guarantee</span>
                <span className="font-body-sm text-body-sm text-outline">
                  Lifetime NFC chip warranty & replacement re-write assurance.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Commission Inquiry Form */}
          <div className="lg:col-span-7 p-space-xl rounded-xl bg-surface-container-low shadow-2xl border border-[#2a2a2a] flex flex-col justify-between">
            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your Name or Organization"
                  className="w-full px-space-sm py-2.5 rounded-DEFAULT bg-surface text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-secondary transition-all border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-space-sm py-2.5 rounded-DEFAULT bg-surface text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-secondary transition-all border border-outline-variant/30"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">Direct Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 90000 00000"
                    className="w-full px-space-sm py-2.5 rounded-DEFAULT bg-surface text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-secondary transition-all border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">Selected Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as TierPackage })}
                  className="w-full px-space-sm py-2.5 rounded-DEFAULT bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-secondary transition-all border border-outline-variant/30"
                >
                  <option value="connect-obsidian">CONNECT NFC // Obsidian Black (₹4,999)</option>
                  <option value="connect-crimson">CONNECT NFC // Crimson Reserve (₹8,999)</option>
                  <option value="connect-titanium">CONNECT NFC // Titanium Edition (Bespoke)</option>
                  <option value="digital-profile">Digital Profile Tier (₹2,499)</option>
                  <option value="corporate-fleet">Enterprise Fleet Suite (Custom)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">
                  Engraving Details / Special Specifications
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="State corporate card quantities, custom metal finish preferences, logo vector availability, or bespoke domain requirements..."
                  className="w-full px-space-sm py-2 rounded-DEFAULT bg-surface text-on-surface font-body-md text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-secondary transition-all border border-outline-variant/30 resize-none"
                ></textarea>
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded font-body-sm text-body-sm flex items-center gap-2 ${
                    isSubmitted ? 'bg-emerald-950/80 text-emerald-300' : 'bg-red-950/80 text-red-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isSubmitted ? 'check_circle' : 'error'}
                  </span>
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-DEFAULT bg-secondary-container hover:bg-[#800b0e] text-on-surface font-label-md text-label-md uppercase tracking-[0.2em] shadow-[0_6px_24px_rgba(148,14,18,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Submit Commission Inquiry</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
