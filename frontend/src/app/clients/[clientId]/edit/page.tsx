'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { RoleGuard } from '@/components/shared/RoleGuard';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  status: 'active' | 'suspended';
  role: string;
  createdAt: string;
  welcomeEmailDraft?: {
    subject: string;
    status: string;
    preparedAt: string;
  };
}

export default function ClientWorkspacePage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  const router = useRouter();
  const { token } = useAuth();

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClient() {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`http://localhost:5000/api/admin/clients`, {
          headers,
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((c: any) => c.id === clientId);
          if (found) {
            setClient(found);
          } else {
            setErrorMsg(`Client record with ID ${clientId} not found.`);
          }
        }
      } catch (err: any) {
        setErrorMsg('Failed to connect to backend service.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClient();
  }, [clientId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8fb] text-[#1c1b1d] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin text-black">progress_activity</span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#5d5e66]">Loading Client Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
      <div className="min-h-screen bg-[#fcf8fb] text-[#1c1b1d] font-sans antialiased p-6 sm:p-10 flex flex-col gap-8">
        {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Management</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
            <span>Admin</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Clients</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-black font-semibold">{client?.name || clientId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-white border border-black/[0.08] text-[#5d5e66]">
            ID: <strong className="text-black font-semibold">{clientId}</strong>
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono uppercase ${
              client?.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {client?.status || 'Unknown'}
          </span>
        </div>
      </div>

      {errorMsg ? (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col gap-3 max-w-lg mx-auto text-center">
          <span className="material-symbols-outlined text-4xl text-red-600 mx-auto">error</span>
          <h2 className="text-lg font-bold">Client Not Found</h2>
          <p className="text-xs text-red-700">{errorMsg}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
          {/* Left Column: Client Identity Overview */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-black/[0.06] shadow-sm flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  {client?.name ? client.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-black font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
                    {client?.name}
                  </h2>
                  <span className="text-xs text-[#5d5e66]">{client?.title || 'Client Account'}</span>
                  <span className="text-[11px] font-mono text-[#5d5e66] mt-0.5">{client?.company || 'Enterprise'}</span>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-4 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5e66] font-mono">Email:</span>
                  <span className="font-semibold text-black">{client?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5e66] font-mono">Phone:</span>
                  <span className="font-semibold text-black">{client?.phone || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5e66] font-mono">Role:</span>
                  <span className="font-semibold text-black capitalize">{client?.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5e66] font-mono">Created:</span>
                  <span className="text-black">{client ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {client?.welcomeEmailDraft && (
                <div className="bg-[#fcf8fb] p-3.5 rounded-xl border border-black/[0.06] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold text-black">Welcome Email</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {client.welcomeEmailDraft.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5d5e66] italic">
                    Subject: &ldquo;{client.welcomeEmailDraft.subject}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Future NFC Landing Page Editor Staging Placeholder */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-black/[0.06] shadow-sm flex flex-col items-center justify-center text-center min-h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f6f2f5]/20 to-transparent pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
                {/* Emblem */}
                <div className="w-16 h-16 rounded-2xl bg-[#f0edf0] flex items-center justify-center mb-5 shadow-inner">
                  <span className="material-symbols-outlined text-black text-[32px]">design_services</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2f5] mb-3 text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                  <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  <span>Modular Template Slot Initialized</span>
                </div>

                <h3 className="text-2xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight mb-2">
                  NFC Landing Page Editor Staging
                </h3>

                <p className="text-sm text-[#5d5e66] leading-relaxed mb-6">
                  This dedicated workspace route (<code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs text-black">/clients/{clientId}/edit</code>) is prepared for the forthcoming NFC landing page designer. Your upcoming custom landing page template will be integrated directly into this workspace module.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
                  <div className="p-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-[#5d5e66] font-bold block mb-1">Isolation</span>
                    <span className="text-xs text-black font-medium">Independent client profile state</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-[#5d5e66] font-bold block mb-1">NFC Binding</span>
                    <span className="text-xs text-black font-medium">Direct tap-to-profile routing</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-[#5d5e66] font-bold block mb-1">Architecture</span>
                    <span className="text-xs text-black font-medium">Ready for supplied template</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-center gap-3">
                  <button
                    onClick={() => router.push('/')}
                    className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Return to Management Console
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </RoleGuard>
  );
}
