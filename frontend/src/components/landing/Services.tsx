'use client';

import React from 'react';
import Link from 'next/link';

const SERVICES = [
  {
    icon: 'credit_card',
    title: 'NFC Digital Business Cards',
    desc: 'Matte obsidian, brushed aerospace titanium, and 24k gold leaf physical cards embedded with durable, uncloneable NTAG216 microchips.',
    action: 'Explore Materials',
  },
  {
    icon: 'badge',
    title: 'Personal Digital Websites',
    desc: 'Bespoke micro-sites optimized for personal brand storytelling, press releases, leadership bio, keynote reels, and direct contact acquisition.',
    action: 'View Micro-sites',
  },
  {
    icon: 'desktop_mac',
    title: 'Corporate Website Design',
    desc: 'Conversion-focused multi-page corporate web presences built on Next.js, Headless CMS, and custom design tokens for boutique advisory firms.',
    action: 'Corporate Architecture',
  },
  {
    icon: 'gallery_thumbnail',
    title: 'Portfolio Development',
    desc: 'Editorial showcases for architects, private equity directors, fashion consultants, and luxury creative agencies demanding visual impact.',
    action: 'Curated Portfolios',
  },
  {
    icon: 'qr_code',
    title: 'Dynamic QR Engineering',
    desc: 'Vector QR matrices with bespoke crest watermarks, redirectable endpoints, live tap tracking, and zero downtime cloud routing.',
    action: 'QR Architecture',
  },
  {
    icon: 'auto_fix_high',
    title: 'Custom Branding & Setup',
    desc: 'White-glove identity design, custom typography selection, asset migration, team onboarding, and enterprise mobile profile provisioning.',
    action: 'White-Glove Setup',
  },
];

export const Services: React.FC = () => {
  return (
    <section className="w-full bg-[#06110c] text-on-surface py-space-xl" id="services">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col items-center text-center mb-space-xl">
          <span className="font-label-md text-label-md uppercase tracking-[0.24em] text-tertiary-fixed-dim font-semibold mb-2">
            Tailored Digital Architecture
          </span>
          <h2 className="font-display-lg text-display-lg text-primary max-w-3xl leading-tight">
            Digital Solutions for Modern Professionals
          </h2>
          <p className="font-body-lg text-body-lg text-outline max-w-2xl mt-space-sm leading-relaxed">
            End-to-end bespoke networking hardware and responsive web architecture tailored for executives, luxury brands, and global enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="p-space-lg rounded-xl bg-[#0c1a13] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high/60 flex items-center justify-center text-tertiary-fixed-dim group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-sm text-primary font-normal">{s.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-space-md flex items-center gap-1 font-label-md text-label-md text-tertiary-fixed-dim uppercase tracking-wider group-hover:text-primary">
                <Link href="#contact" className="inline-flex items-center gap-1">
                  {s.action} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
