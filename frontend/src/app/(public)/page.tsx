'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ProfileShowcase } from '@/components/landing/ProfileShowcase';
import { Services } from '@/components/landing/Services';
import { Pricing } from '@/components/landing/Pricing';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Stories } from '@/components/landing/Stories';
import { ContactPortal } from '@/components/landing/ContactPortal';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="w-full pt-20 bg-background flex flex-col">
        <Hero />
        <ProfileShowcase />
        <Services />
        <Pricing />
        <HowItWorks />
        <Stories />
        <ContactPortal />
      </main>
      <Footer />
    </div>
  );
}
