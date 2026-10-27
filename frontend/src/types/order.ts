export type OrderStatus = 'pending' | 'in_production' | 'engraved' | 'dispatched' | 'delivered';
export type TierPackage =
  | 'connect-obsidian'
  | 'connect-crimson'
  | 'connect-titanium'
  | 'speed-obsidian'
  | 'speed-crimson'
  | 'speed-titanium'
  | 'digital-profile'
  | 'corporate-fleet';

export interface CommissionInquiry {
  id: string;
  fullName: string;
  workEmail: string;
  phone?: string;
  tier: TierPackage;
  notes?: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: string;
}

export interface PhysicalOrder {
  id: string;
  userId: string;
  orderNumber: string;
  tier: TierPackage;
  cardFinish: string;
  engravingText: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: OrderStatus;
  trackingNumber?: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}
