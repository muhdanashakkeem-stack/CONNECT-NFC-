'use client';

import React from 'react';
import { ObsidianPrismAdmin } from '@/components/admin/ObsidianPrismAdmin';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  return <ObsidianPrismAdmin onTogglePublicView={() => router.push('/')} />;
}
