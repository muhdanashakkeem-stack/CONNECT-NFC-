export type CardFinish = 'obsidian' | 'crimson' | 'emerald' | 'titanium';

export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'linkedin' | 'instagram' | 'twitter' | 'youtube' | 'website' | 'calendly' | 'custom';
  label: string;
  url: string;
  icon?: string;
  isActive: boolean;
}

export interface DigitalCard {
  id: string;
  userId: string;
  slug: string;
  cardName: string;
  cardholderName: string;
  headlineTitle: string;
  companyName: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  coverBannerUrl?: string;
  finish: CardFinish;
  nfcChipUid?: string;
  nfcFrequency?: string;
  totalTaps: number;
  lastTappedAt?: string;
  isActive: boolean;
  socialLinks: SocialLink[];
  vCardData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TapMetric {
  date: string;
  taps: number;
  uniqueDevices: number;
  country: string;
}
