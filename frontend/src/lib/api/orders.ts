import { apiClient } from './client';
import { CommissionInquiry, PhysicalOrder } from '@/types/order';

export async function apiSubmitInquiry(
  inquiry: Omit<CommissionInquiry, 'id' | 'createdAt' | 'status'>
): Promise<CommissionInquiry> {
  const res = await apiClient<CommissionInquiry>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  });
  return res.data;
}

export async function apiGetInquiries(): Promise<CommissionInquiry[]> {
  const res = await apiClient<CommissionInquiry[]>('/inquiries', {
    method: 'GET',
  });
  return res.data;
}

export async function apiGetOrders(): Promise<PhysicalOrder[]> {
  const res = await apiClient<PhysicalOrder[]>('/orders', {
    method: 'GET',
  });
  return res.data;
}
