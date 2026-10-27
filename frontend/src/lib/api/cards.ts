import { apiClient } from './client';
import { DigitalCard } from '@/types/card';

export async function apiGetCards(): Promise<DigitalCard[]> {
  const res = await apiClient<DigitalCard[]>('/cards', {
    method: 'GET',
  });
  return res.data;
}

export async function apiGetCardById(id: string): Promise<DigitalCard> {
  const res = await apiClient<DigitalCard>(`/cards/${id}`, {
    method: 'GET',
  });
  return res.data;
}

export async function apiGetPublicCard(slug: string): Promise<DigitalCard> {
  const res = await apiClient<DigitalCard>(`/cards/public/${slug}`, {
    method: 'GET',
  });
  return res.data;
}

export async function apiUpdateCard(id: string, updates: Partial<DigitalCard>): Promise<DigitalCard> {
  const res = await apiClient<DigitalCard>(`/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return res.data;
}
