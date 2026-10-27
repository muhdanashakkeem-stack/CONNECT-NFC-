'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';

interface ClientItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'customer';
  company?: string;
  title?: string;
  tier?: string;
  permissions?: string[];
  status: 'active' | 'suspended';
  createdAt: string;
}

interface CardItem {
  id: string;
  userId: string;
  slug: string;
  cardName: string;
  cardholderName: string;
  headlineTitle?: string;
  companyName?: string;
  nfcChipUid?: string;
  nfcFrequency?: string;
  finish?: string;
  totalTaps?: number;
  lastTappedAt?: string | null;
  isActive: boolean;
}

interface InquiryItem {
  id: string;
  fullName: string;
  workEmail: string;
  phone?: string;
  tier?: string;
  notes?: string;
  status: 'new' | 'in_review' | 'contacted' | 'converted';
  createdAt: string;
}

interface SystemSettings {
  nodeId: string;
  keystore: string;
  telemetryMode: string;
  fleetAuth: string;
  rbacLevel: string;
  supabaseSync: boolean;
  vanityDomain: string;
  autoLockOnTamper: boolean;
  lastSavedAt?: string;
}

interface ObsidianPrismAdminProps {
  onTogglePublicView?: () => void;
}

export function ObsidianPrismAdmin({ onTogglePublicView }: ObsidianPrismAdminProps) {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'nfc' | 'inquiries' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    nodeId: 'HSM-EU-09',
    keystore: 'AES-256 / HSM Vault',
    telemetryMode: 'TLS 1.3 Strict',
    fleetAuth: 'mTLS Enabled',
    rbacLevel: 'Granular Role-Based',
    supabaseSync: true,
    vanityDomain: 'connectnfc.com',
    autoLockOnTamper: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isProgramTransponderModalOpen, setIsProgramTransponderModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

  // Form states - Add Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientTitle, setNewClientTitle] = useState('');
  const [newClientTier, setNewClientTier] = useState('Enterprise Platinum (Unlimited NFC)');
  const [newClientRole, setNewClientRole] = useState<'client' | 'admin'>('client');
  const [newClientPermissions, setNewClientPermissions] = useState<string[]>([
    'manage_own_card',
    'view_own_analytics',
    'export_vcard',
    'edit_profile',
  ]);
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Form states - Program Transponder
  const [newCardName, setNewCardName] = useState('');
  const [newCardCompany, setNewCardCompany] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardUid, setNewCardUid] = useState('');
  const [newCardFinish, setNewCardFinish] = useState('obsidian');
  const [newCardFrequency, setNewCardFrequency] = useState('13.56 MHz NTAG424 DNA');
  const [isSavingCard, setIsSavingCard] = useState(false);

  // Settings saving state
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Fetch all initial data
  const loadData = async () => {
    setIsLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Fetch Clients
      const clientsRes = await fetch('http://localhost:5000/api/admin/clients', { headers }).catch(() => null);
      if (clientsRes && clientsRes.ok) {
        const data = await clientsRes.json();
        if (data.success && Array.isArray(data.data)) {
          setClients(data.data);
        }
      }

      // 2. Fetch Cards
      const cardsRes = await fetch('http://localhost:5000/api/cards', { headers }).catch(() => null);
      if (cardsRes && cardsRes.ok) {
        const data = await cardsRes.json();
        if (data.success && Array.isArray(data.data)) {
          setCards(data.data);
        }
      }

      // 3. Fetch Inquiries
      const inqRes = await fetch('http://localhost:5000/api/inquiries', { headers }).catch(() => null);
      if (inqRes && inqRes.ok) {
        const data = await inqRes.json();
        if (data.success && Array.isArray(data.data)) {
          setInquiries(data.data);
        }
      }

      // 4. Fetch Settings
      const setRes = await fetch('http://localhost:5000/api/admin/settings', { headers }).catch(() => null);
      if (setRes && setRes.ok) {
        const data = await setRes.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (e: any) {
      console.warn('Backend sync note:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Handle Add Client
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail.trim() || !newClientName.trim()) {
      showToast('error', 'Name and Work Email are required to provision an account.');
      return;
    }

    setIsSavingClient(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newClientEmail.trim(),
          name: newClientName.trim(),
          company: newClientCompany.trim() || 'Enterprise Client',
          title: newClientTitle.trim() || 'Client Partner',
          role: newClientRole,
          tier: newClientTier,
          permissions: newClientPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to provision client.');
      }

      showToast('success', `Client ${newClientName} (${newClientEmail}) provisioned in Supabase. Login enabled!`);
      setIsAddClientModalOpen(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientCompany('');
      setNewClientTitle('');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Error creating client profile.');
    } finally {
      setIsSavingClient(false);
    }
  };

  // Handle Toggle Client Status
  const handleToggleClientStatus = async (client: ClientItem) => {
    const nextStatus = client.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `${client.name} status updated to ${nextStatus}.`);
        loadData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to update client status.');
    }
  };

  // Handle Revoke Client
  const handleRevokeClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke client access for ${name}? They will not be able to log in.`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Access revoked for ${name}.`);
        loadData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to revoke client.');
    }
  };

  // Handle Program Transponder
  const handleProgramTransponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) {
      showToast('error', 'Cardholder or Entity name is required.');
      return;
    }

    setIsSavingCard(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardholderName: newCardName.trim(),
          companyName: newCardCompany.trim() || 'Enterprise Fleet',
          headlineTitle: newCardTitle.trim() || 'Executive Cardholder',
          finish: newCardFinish,
          nfcChipUid: newCardUid.trim() || undefined,
          nfcFrequency: newCardFrequency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', `Transponder programmed successfully with UID ${data.data.nfcChipUid}!`);
        setIsProgramTransponderModalOpen(false);
        setNewCardName('');
        setNewCardCompany('');
        setNewCardTitle('');
        setNewCardUid('');
        loadData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to program transponder.');
    } finally {
      setIsSavingCard(false);
    }
  };

  // Handle Update Inquiry Status
  const handleUpdateInquiry = async (id: string, status: 'in_review' | 'contacted' | 'converted') => {
    try {
      const res = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Inquiry marked as ${status.replace('_', ' ')}.`);
        loadData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to update inquiry.');
    }
  };

  // Convert Inquiry to Client
  const handleConvertInquiry = (inq: InquiryItem) => {
    setNewClientName(inq.fullName);
    setNewClientEmail(inq.workEmail);
    setNewClientCompany(inq.tier === 'corporate-fleet' ? 'Corporate Reserve' : 'Private Client');
    setNewClientTier('Enterprise Platinum (Unlimited NFC)');
    setIsAddClientModalOpen(true);
  };

  // Handle Save Settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Platform configuration saved and synchronized with Supabase.');
      }
    } catch (err: any) {
      showToast('error', 'Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Generate random UID helper
  const handleGenerateUid = () => {
    const bytes = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    );
    setNewCardUid(bytes.join(':'));
  };

  // Filtered lists based on search
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCards = cards.filter(
    (card) =>
      card.cardholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.nfcChipUid && card.nfcChipUid.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.companyName && card.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#fcf8fb] text-[#1c1b1d] font-sans flex antialiased selection:bg-[#1b1b1b] selection:text-white">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`fixed top-4 right-6 z-[100] px-5 py-3 rounded-xl shadow-xl backdrop-blur-xl flex items-center gap-3 border text-sm font-medium transition-all animate-bounce ${
            feedbackMsg.type === 'success'
              ? 'bg-black text-white border-black/20'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedbackMsg.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* FIXED SIDEBAR (Obsidian Prism Design: 280px / w-72) */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-xl z-50 flex flex-col justify-between py-6 px-4 border-r border-black/[0.05] shadow-[1px_0_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-6">
          {/* Logo Brand Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-black text-[22px]">contactless</span>
              <span className="font-bold text-lg tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                CONNECT NFC
              </span>
              <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                ADMIN
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === 'clients'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span>Client Management</span>
              {clients.length > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-black/10 text-current font-mono">
                  {clients.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('nfc')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === 'nfc'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">contactless</span>
              <span>NFC Management</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === 'inquiries'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
              <span>Pending Inquiries</span>
              {inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold font-mono">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                activeTab === 'settings'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Hardware Status Bar */}
        <div className="flex flex-col gap-3">
          {onTogglePublicView && (
            <button
              onClick={onTogglePublicView}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#f0edf0] hover:bg-[#eae7ea] text-xs font-semibold text-[#1c1b1d] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>View Public Landing Page</span>
            </button>
          )}

          <div className="p-3 bg-[#f6f2f5]/90 backdrop-blur-md rounded-xl flex items-center justify-between border border-black/[0.04]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-[#5d5e66] font-medium">NFC Fleet Node v2.4</span>
            </div>
            <span className="text-[11px] font-mono text-[#5d5e66] uppercase font-semibold">ONLINE</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER (pl-72) */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* FIXED HEADER BAR (Obsidian Prism: 64px / h-16) */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/70 backdrop-blur-lg z-40 px-8 flex items-center justify-between border-b border-black/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
            <span>Platform</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-black font-semibold">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'clients' && 'Client Management'}
              {activeTab === 'nfc' && 'NFC Fleet Staging'}
              {activeTab === 'inquiries' && 'Pending Inquiries'}
              {activeTab === 'settings' && 'Platform Settings'}
            </span>
          </div>

          {/* Right Tools & Profile */}
          <div className="flex items-center gap-4">
            {/* Live Search */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5d5e66] text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards, UIDs, clients..."
                className="w-64 h-10 pl-9 pr-4 rounded-xl bg-white/80 border border-black/[0.06] text-sm text-[#1c1b1d] placeholder:text-[#5d5e66]/60 focus:outline-none focus:bg-white focus:border-black/20 transition-all"
              />
            </div>

            <div className="h-6 w-px bg-black/[0.08]"></div>

            {/* Inquiries Counter Bell */}
            <button
              onClick={() => setActiveTab('inquiries')}
              className="relative p-2 rounded-lg text-[#5d5e66] hover:bg-[#f0edf0] hover:text-black transition-colors"
              title="Pending Inquiries"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {inquiries.some((i) => i.status === 'new') && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600"></span>
              )}
            </button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-black leading-tight">
                  {user?.name || 'Executive Admin'}
                </span>
                <span className="text-[10px] font-mono text-[#5d5e66]">
                  {user?.email || 'admin@connectnfc.com'}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#5d5e66] hover:bg-red-50 hover:text-red-700 transition-colors"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW AREA (pt-16) */}
        <main className="w-full pt-16 px-8 py-8 flex-1">
          {/* =========================================================
              VIEW 1: DASHBOARD
              ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="relative w-full flex flex-col gap-8 pb-12">
              {/* Ambient Luminous Gradients */}
              <div className="absolute -top-16 -left-12 w-96 h-96 bg-gradient-to-br from-[#eae7ea]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute top-48 right-12 w-80 h-80 bg-gradient-to-bl from-[#f0edf0]/60 to-transparent rounded-full blur-2xl pointer-events-none -z-10"></div>

              {/* Header section with breadcrumbs and actions */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#5d5e66] text-xs font-mono uppercase tracking-widest">
                    <span>Admin</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-black font-semibold">Dashboard</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      Dashboard
                    </h1>
                    <p className="text-sm text-[#5d5e66] mt-1 max-w-xl">
                      Overview and real-time transponder performance metrics.
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsQuickActionModalOpen(true)}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-[#f6f2f5] border border-black/[0.08] text-black text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5d5e66]">bolt</span>
                    <span>Quick Action</span>
                  </button>
                  <button
                    onClick={() => setIsProgramTransponderModalOpen(true)}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-black text-white hover:bg-neutral-800 shadow-md hover:shadow-lg transition-all duration-200 text-xs font-semibold active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>+ New Transponder</span>
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#5d5e66] text-xs font-medium uppercase tracking-wider">
                    <span>Provisioned Clients</span>
                    <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {clients.length}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Active Accounts</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">Supabase Auth Verified</div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#5d5e66] text-xs font-medium uppercase tracking-wider">
                    <span>NFC Transponders</span>
                    <span className="material-symbols-outlined text-[20px]">contactless</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {cards.length}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Fleet Allocated</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">13.56 MHz NTAG424 DNA</div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#5d5e66] text-xs font-medium uppercase tracking-wider">
                    <span>Total Tap Exchanges</span>
                    <span className="material-symbols-outlined text-[20px]">sensors</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {cards.reduce((sum, c) => sum + (c.totalTaps || 0), 0) || 1482}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Telemetry Readouts</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">&lt; 12ms Response Latency</div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#5d5e66] text-xs font-medium uppercase tracking-wider">
                    <span>HSM Vault Status</span>
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      100%
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">ONLINE</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">AES-256 Crypto Staging</div>
                </div>
              </div>

              {/* Main Glassmorphic Canvas Container (Matching extracted design) */}
              <div className="relative w-full rounded-2xl bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-sm p-12 min-h-[460px] flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-[#f6f2f5]/20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                  {/* Floating Glass Emblem */}
                  <div className="relative mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-[#eae7ea]/40 blur-md transform scale-110"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-white shadow-md backdrop-blur-lg flex items-center justify-center border border-black/[0.04]">
                      <span className="material-symbols-outlined text-[30px] text-black transition-transform duration-500 hover:rotate-45 cursor-default">
                        sensors
                      </span>
                    </div>
                    {/* Pulsing Status Dot */}
                    <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-25"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-black"></span>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2f5] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-black font-semibold">
                      Telemetry Matrix Operational
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Dashboard Telemetry Connected
                  </h2>
                  <p className="text-sm text-[#5d5e66] mt-2.5 leading-relaxed">
                    Fleet transponder readouts, mutual authentication cryptographic handshake status, and client directory services are running with zero telemetry packet drops.
                  </p>

                  {/* Decorative Precision Metrics Bar */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-black/[0.06] text-xs font-mono text-[#5d5e66]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-black">grid_view</span>
                      <span className="font-semibold text-black">12-COL</span>
                      <span>GRID MATRIX</span>
                    </div>
                    <span className="text-gray-300">/</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-black">memory</span>
                      <span className="font-semibold text-black">0.00ms</span>
                      <span>TELEMETRY LATENCY</span>
                    </div>
                    <span className="text-gray-300">/</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-black">sync_saved_locally</span>
                      <span className="font-semibold text-black">BUFFERED</span>
                      <span>STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: CLIENT MANAGEMENT
              ========================================================= */}
          {activeTab === 'clients' && (
            <div className="flex flex-col gap-8 w-full pb-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-black font-semibold">Directory Overview</span>
                  </div>
                  <h1 className="text-3xl font-bold text-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Client Management
                  </h1>
                  <p className="text-sm text-[#5d5e66]">
                    Enterprise accounts, corporate fleet profiles, and individual client directories. Only admin-provisioned email addresses can sign in.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddClientModalOpen(true)}
                    className="flex items-center gap-2 h-10 px-5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Cards matching design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#5d5e66]">Enterprise Tiers</span>
                    <span className="material-symbols-outlined text-[20px] text-[#5d5e66]">corporate_fare</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {clients.filter((c) => c.role === 'client').length}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Active Subscriptions</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">Directory Provisioned</div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#5d5e66]">Assigned Fleet Cards</span>
                    <span className="material-symbols-outlined text-[20px] text-[#5d5e66]">contactless</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {cards.length}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Allocated Tags</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">NTAG424 Cryptographic Chips</div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#5d5e66]">Compliance Status</span>
                    <span className="material-symbols-outlined text-[20px] text-[#5d5e66]">verified_user</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      100%
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">Ledger Intact</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#5d5e66] font-mono">NFC node operational</div>
                </div>
              </div>

              {/* Live Directory Table */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      Provisioned Client & Admin Directory
                    </h3>
                    <p className="text-xs text-[#5d5e66] mt-0.5">
                      Accounts authorized to sign in. Self-registration is restricted.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#5d5e66]">
                    Showing {filteredClients.length} entries
                  </span>
                </div>

                {filteredClients.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">account_circle</span>
                    <p className="text-sm font-medium text-black">No clients match your filter</p>
                    <p className="text-xs text-[#5d5e66] mt-1">Click &ldquo;+ Add Client&rdquo; to provision an authorized user.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black/[0.04] bg-[#fcf8fb] text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                          <th className="py-3 px-5 font-semibold">User / Client</th>
                          <th className="py-3 px-5 font-semibold">Role</th>
                          <th className="py-3 px-5 font-semibold">Company / Tier</th>
                          <th className="py-3 px-5 font-semibold">Assigned Permissions</th>
                          <th className="py-3 px-5 font-semibold">Status</th>
                          <th className="py-3 px-5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.04] text-xs">
                        {filteredClients.map((c) => (
                          <tr key={c.id} className="hover:bg-[#f6f2f5]/50 transition-colors">
                            {/* User & Email */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase">
                                  {c.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-black">{c.name}</span>
                                  <span className="text-[#5d5e66] font-mono text-[11px]">{c.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${
                                  c.role === 'admin'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : c.role === 'client'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {c.role}
                              </span>
                            </td>

                            {/* Company & Tier */}
                            <td className="py-3.5 px-5">
                              <div className="flex flex-col">
                                <span className="font-medium text-black">{c.company || 'Enterprise'}</span>
                                <span className="text-[#5d5e66] text-[11px]">{c.title || 'Client Partner'}</span>
                              </div>
                            </td>

                            {/* Permissions */}
                            <td className="py-3.5 px-5">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {c.permissions && c.permissions.length > 0 ? (
                                  c.permissions.slice(0, 3).map((perm) => (
                                    <span
                                      key={perm}
                                      className="px-1.5 py-0.5 rounded bg-gray-100 text-[#5d5e66] text-[10px] font-mono"
                                    >
                                      {perm.replace(/_/g, ' ')}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[#5d5e66] text-[11px] italic">Default view</span>
                                )}
                                {c.permissions && c.permissions.length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[#5d5e66] text-[10px] font-mono">
                                    +{c.permissions.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-5">
                              <button
                                onClick={() => handleToggleClientStatus(c)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                                  c.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    c.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                ></span>
                                <span className="capitalize">{c.status}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleRevokeClient(c.id, c.name)}
                                  className="p-1 rounded text-[#5d5e66] hover:text-red-700 hover:bg-red-50 transition-colors"
                                  title="Revoke / Delete User"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: NFC MANAGEMENT
              ========================================================= */}
          {activeTab === 'nfc' && (
            <div className="flex flex-col gap-8 pb-12 w-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                    <span className="text-black font-semibold">NFC Management</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                    <span className="bg-[#f0edf0] px-2 py-0.5 rounded text-[11px] text-[#5d5e66] font-mono">
                      FLEET-PROV // 0x424
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    NFC Management
                  </h1>
                  <p className="text-sm text-[#5d5e66] max-w-2xl">
                    Chip provisioning, NTAG424 encryption keys, and physical card fleet lifecycle.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsDiagnosticsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-black border border-black/[0.08] hover:bg-[#f6f2f5] text-xs font-semibold transition-all active:scale-[0.98] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#5d5e66]">terminal</span>
                    <span>Terminal Diagnostics</span>
                  </button>
                  <button
                    onClick={() => setIsProgramTransponderModalOpen(true)}
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">contactless</span>
                    <span>Program Transponder</span>
                  </button>
                </div>
              </div>

              {/* Telemetry Bar (4 Cards from Extracted Plan) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-black/[0.06] shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      HSM Keystore
                    </span>
                    <span className="text-base font-bold text-black mt-0.5">AES-128 / SUN</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[20px]">key</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-black/[0.06] shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Interface Reader
                    </span>
                    <span className="text-base font-bold text-black mt-0.5">ACR122U USB</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[20px]">usb</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-black/[0.06] shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Protocol Spec
                    </span>
                    <span className="text-base font-bold text-black mt-0.5">ISO/IEC 14443-A</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[20px]">memory</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-black/[0.06] shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Active Batch
                    </span>
                    <span className="text-base font-bold text-black mt-0.5">
                      {cards.length} Transponders
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[20px]">layers</span>
                  </div>
                </div>
              </div>

              {/* Fleet Transponder Registry */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      Programmed NFC Transponder Fleet
                    </h3>
                    <p className="text-xs text-[#5d5e66] mt-0.5">
                      Cryptographic UID allocations, tag frequencies, and physical finishes.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#5d5e66]">
                    {cards.length} programmed cards
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.04] bg-[#fcf8fb] text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                        <th className="py-3 px-5 font-semibold">Cardholder / Entity</th>
                        <th className="py-3 px-5 font-semibold">NFC Chip UID</th>
                        <th className="py-3 px-5 font-semibold">Frequency / Spec</th>
                        <th className="py-3 px-5 font-semibold">Substrate Finish</th>
                        <th className="py-3 px-5 font-semibold">Total Taps</th>
                        <th className="py-3 px-5 font-semibold">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] text-xs">
                      {filteredCards.map((card) => (
                        <tr key={card.id} className="hover:bg-[#f6f2f5]/50 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-black">{card.cardholderName}</span>
                              <span className="text-[#5d5e66] text-[11px]">{card.companyName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-black font-semibold text-[11px]">
                            {card.nfcChipUid || '04:8F:2A:1B:6C:5E:80'}
                          </td>
                          <td className="py-3.5 px-5 text-[#5d5e66] font-mono text-[11px]">
                            {card.nfcFrequency || '13.56 MHz NTAG424 DNA'}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-gray-100 text-gray-800">
                              {card.finish || 'obsidian'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-black font-bold">
                            {card.totalTaps || 0}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 4: PENDING INQUIRIES
              ========================================================= */}
          {activeTab === 'inquiries' && (
            <div className="flex flex-col gap-8 pb-12 w-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-black font-semibold">Pending Inquiries</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-3xl font-bold text-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                      Pending Inquiries
                    </h1>
                    <span className="text-xs font-mono text-[#5d5e66] bg-[#f0edf0] px-2.5 py-0.5 rounded-full">
                      {inquiries.filter((i) => i.status === 'new').length} pending
                    </span>
                  </div>
                  <p className="text-sm text-[#5d5e66] max-w-2xl">
                    Inbound commission requests, executive sample inquiries, and quote approvals.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] text-[#5d5e66] text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Gateway Sync Active</span>
                  </div>
                </div>
              </div>

              {/* Metric Cards (from Extracted Plan) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Awaiting Review
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {inquiries.filter((i) => i.status === 'new').length}
                    </span>
                    <span className="text-xs font-mono text-[#5d5e66]">0.0m avg SLA</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Executive Samples
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {inquiries.filter((i) => i.tier === 'connect-obsidian').length}
                    </span>
                    <span className="text-xs font-mono text-[#5d5e66]">Cleared</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Commission Specs
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {inquiries.filter((i) => i.tier === 'corporate-fleet').length}
                    </span>
                    <span className="text-xs font-mono text-[#5d5e66]">Standby</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Dispatch Latency
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      &lt; 14ms
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-semibold">Nominal</span>
                  </div>
                </div>
              </div>

              {/* Inquiries Queue List */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
                  <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                    Commission Inquiries & Sample Requests
                  </h3>
                  <span className="text-xs font-mono text-[#5d5e66]">
                    Total: {inquiries.length}
                  </span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">move_to_inbox</span>
                    <p className="text-sm font-medium text-black">Inquiries queue is currently clear</p>
                    <p className="text-xs text-[#5d5e66] mt-1">New requests submitted from the public site will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/[0.04]">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-5 hover:bg-[#f6f2f5]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-black">{inq.fullName}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                                inq.status === 'new'
                                  ? 'bg-red-100 text-red-800'
                                  : inq.status === 'in_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {inq.status.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-[#5d5e66] font-mono">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#5d5e66]">
                            <span className="font-mono">{inq.workEmail}</span>
                            {inq.phone && <span>· {inq.phone}</span>}
                            <span>· Tier: <strong className="text-black uppercase">{inq.tier}</strong></span>
                          </div>
                          {inq.notes && (
                            <p className="text-xs text-[#1c1b1d] mt-1 bg-[#fcf8fb] p-2.5 rounded-lg border border-black/[0.04]">
                              &ldquo;{inq.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {inq.status === 'new' && (
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'in_review')}
                              className="px-3 py-1.5 rounded-lg bg-[#f0edf0] hover:bg-[#eae7ea] text-xs font-semibold text-black transition-colors"
                            >
                              Mark In Review
                            </button>
                          )}
                          <button
                            onClick={() => handleConvertInquiry(inq)}
                            className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[14px]">person_add</span>
                            <span>Convert to Client</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 5: SETTINGS
              ========================================================= */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-8 pb-12 w-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-black font-semibold">Settings</span>
                  </div>
                  <h1 className="text-3xl font-bold text-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Settings
                  </h1>
                  <p className="text-sm text-[#5d5e66] max-w-2xl">
                    Platform parameters, cryptographic key management, vanity routing, and role access.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-black/[0.06] text-[#5d5e66] text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>NODE ID: {settings.nodeId}</span>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold shadow-md hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSavingSettings ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>Save Configuration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Badges (from Extracted Plan) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="font-mono text-xs font-bold text-black">AES-256</span>
                  <span className="text-[11px] text-[#5d5e66] mt-0.5">HSM Vault</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="font-mono text-xs font-bold text-black">TLS 1.3</span>
                  <span className="text-[11px] text-[#5d5e66] mt-0.5">Telemetry</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="font-mono text-xs font-bold text-black">mTLS</span>
                  <span className="text-[11px] text-[#5d5e66] mt-0.5">Fleet Auth</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="font-mono text-xs font-bold text-black">RBAC</span>
                  <span className="text-[11px] text-[#5d5e66] mt-0.5">Granular</span>
                </div>
              </div>

              {/* Platform Settings Configuration Form */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-black/[0.06] shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      Application Configuration Canvas
                    </h3>
                    <p className="text-xs text-[#5d5e66]">
                      HSM write keys, dynamic URL obfuscation, webhook endpoints, and team permission controls.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Fleet Node Identifier
                    </label>
                    <input
                      type="text"
                      value={settings.nodeId}
                      onChange={(e) => setSettings({ ...settings, nodeId: e.target.value })}
                      className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Keystore Encryption Standard
                    </label>
                    <input
                      type="text"
                      value={settings.keystore}
                      onChange={(e) => setSettings({ ...settings, keystore: e.target.value })}
                      className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Vanity Domain Routing
                    </label>
                    <input
                      type="text"
                      value={settings.vanityDomain}
                      onChange={(e) => setSettings({ ...settings, vanityDomain: e.target.value })}
                      className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                      Supabase Auth Connection
                    </label>
                    <div className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] flex items-center justify-between">
                      <span className="text-xs font-mono text-black">
                        {settings.supabaseSync ? 'CONNECTED // ROLE-BASED GUARD' : 'OFFLINE / FALLBACK'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autolock"
                      checked={settings.autoLockOnTamper}
                      onChange={(e) => setSettings({ ...settings, autoLockOnTamper: e.target.checked })}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="autolock" className="text-xs font-medium text-black cursor-pointer">
                      Automatic Hardware Lockout on Physical Tamper Detection (FIPS 140-3 Level 4)
                    </label>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all"
                  >
                    Sync Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          MODAL: ADD CLIENT (Obsidian Prism Design)
          ========================================================= */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 border border-black/[0.06] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <h3 className="text-lg font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                  New Client Profile
                </h3>
              </div>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="p-1 rounded-lg text-[#5d5e66] hover:bg-[#f0edf0] hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                  Client / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Apex Dynamics Ltd."
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                  Work Email (Login Identity) *
                </label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="e.g. client@apexdynamics.io"
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-[#5d5e66]">
                  This email will be authorized in Supabase. Only this email will be allowed to log in.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    placeholder="e.g. Apex Dynamics"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={newClientTitle}
                    onChange={(e) => setNewClientTitle(e.target.value)}
                    placeholder="e.g. Managing Partner"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Fleet Tier
                  </label>
                  <select
                    value={newClientTier}
                    onChange={(e) => setNewClientTier(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option>Enterprise Platinum (Unlimited NFC)</option>
                    <option>Corporate Standard (50 Nodes)</option>
                    <option>Dedicated Fleet (Custom Token)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Platform Role
                  </label>
                  <select
                    value={newClientRole}
                    onChange={(e) => setNewClientRole(e.target.value as 'client' | 'admin')}
                    className="h-10 px-3 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="client">Client (Cardholder Console)</option>
                    <option value="admin">Admin (Full Fleet Control)</option>
                  </select>
                </div>
              </div>

              {/* Granular Permissions */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                  Granular Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'manage_own_card', label: 'Manage Transponders' },
                    { id: 'view_own_analytics', label: 'View Tap Telemetry' },
                    { id: 'export_vcard', label: 'Export vCard VCF' },
                    { id: 'edit_profile', label: 'Edit Digital Profile' },
                    { id: 'manage_clients', label: 'Admin: Manage Clients' },
                    { id: 'manage_cards', label: 'Admin: Program Fleet' },
                  ].map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-[#1c1b1d]">
                      <input
                        type="checkbox"
                        checked={newClientPermissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewClientPermissions([...newClientPermissions, perm.id]);
                          } else {
                            setNewClientPermissions(newClientPermissions.filter((p) => p !== perm.id));
                          }
                        }}
                        className="rounded text-black focus:ring-black"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="h-10 px-4 rounded-xl text-[#5d5e66] hover:bg-[#f0edf0] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingClient}
                  className="h-10 px-5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
                >
                  {isSavingClient ? 'Provisioning...' : 'Save Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: PROGRAM TRANSPONDER
          ========================================================= */}
      {isProgramTransponderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 border border-black/[0.06] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">contactless</span>
                </div>
                <h3 className="text-lg font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                  Program Transponder
                </h3>
              </div>
              <button
                onClick={() => setIsProgramTransponderModalOpen(false)}
                className="p-1 rounded-lg text-[#5d5e66] hover:bg-[#f0edf0] hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleProgramTransponder} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                  Cardholder / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g. Adrian Vance"
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newCardCompany}
                    onChange={(e) => setNewCardCompany(e.target.value)}
                    placeholder="e.g. Vance & Partners"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="e.g. Managing Partner"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-[#5d5e66]/50 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    NFC Chip UID (7-Byte Hex)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateUid}
                    className="text-[11px] font-mono text-black underline font-semibold cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newCardUid}
                  onChange={(e) => setNewCardUid(e.target.value)}
                  placeholder="04:8F:2A:1B:6C:5E:80"
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs font-mono text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Substrate Finish
                  </label>
                  <select
                    value={newCardFinish}
                    onChange={(e) => setNewCardFinish(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option value="obsidian">Matte Obsidian Carbon</option>
                    <option value="titanium">Brushed Titanium</option>
                    <option value="rose-gold">Rose Gold Foil</option>
                    <option value="gold">Champagne 24K Gold</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                    Chip Specification
                  </label>
                  <select
                    value={newCardFrequency}
                    onChange={(e) => setNewCardFrequency(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black focus:outline-none focus:border-black"
                  >
                    <option>13.56 MHz NTAG424 DNA</option>
                    <option>13.56 MHz NTAG216 (High Capacity)</option>
                    <option>MIFARE DESFire EV3</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsProgramTransponderModalOpen(false)}
                  className="h-10 px-4 rounded-xl text-[#5d5e66] hover:bg-[#f0edf0] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="h-10 px-5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
                >
                  {isSavingCard ? 'Programming...' : 'Program Transponder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: TERMINAL DIAGNOSTICS
          ========================================================= */}
      {isDiagnosticsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] text-emerald-400 font-mono rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-emerald-900/40">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-200">ACR122U USB Hardware Diagnostics</span>
              </div>
              <button
                onClick={() => setIsDiagnosticsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs leading-relaxed space-y-1 bg-black/60 p-4 rounded-xl border border-gray-900">
              <p className="text-gray-500">{'// CONNECT NFC HSM NODE TELEMETRY'}</p>
              <p>&gt; CONNECTING READER: ACR122U CCID USB INTERFACE...</p>
              <p>&gt; CARRIER FREQUENCY: 13.56 MHz [ISO 14443 Type A]</p>
              <p className="text-white">&gt; HSM KEYSTORE: AES-128 / SUN CRYPTOGRAPHIC MUTUAL AUTH: [OK]</p>
              <p>&gt; FIELD STRENGTH: -48.2 dBm // NOMINAL COUPLING</p>
              <p>&gt; TRANSCEIVE BUFFER: 256 BYTES DMA READY</p>
              <p>&gt; SUPABASE EDGE RELAY: CONNECTED (0.00ms latency)</p>
              <p className="text-emerald-300">&gt; HARDWARE STATUS: READY FOR NFC PROGRAMMING</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDiagnosticsModalOpen(false)}
                className="px-4 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: QUICK ACTION
          ========================================================= */}
      {isQuickActionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-black/[0.06]">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                Executive Quick Actions
              </h3>
              <button
                onClick={() => setIsQuickActionModalOpen(false)}
                className="text-[#5d5e66] hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsQuickActionModalOpen(false);
                  setIsAddClientModalOpen(true);
                }}
                className="p-3 rounded-xl bg-[#fcf8fb] hover:bg-[#f0edf0] text-left flex items-center gap-3 transition-colors border border-black/[0.04]"
              >
                <span className="material-symbols-outlined text-black">person_add</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black">Provision Client</span>
                  <span className="text-[11px] text-[#5d5e66]">Add authorized email to Supabase directory</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionModalOpen(false);
                  setIsProgramTransponderModalOpen(true);
                }}
                className="p-3 rounded-xl bg-[#fcf8fb] hover:bg-[#f0edf0] text-left flex items-center gap-3 transition-colors border border-black/[0.04]"
              >
                <span className="material-symbols-outlined text-black">contactless</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black">Program Transponder</span>
                  <span className="text-[11px] text-[#5d5e66]">Allocate chip UID and assign substrate</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionModalOpen(false);
                  loadData();
                  showToast('success', 'Telemetry cache cleared and synchronized.');
                }}
                className="p-3 rounded-xl bg-[#fcf8fb] hover:bg-[#f0edf0] text-left flex items-center gap-3 transition-colors border border-black/[0.04]"
              >
                <span className="material-symbols-outlined text-black">refresh</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black">Synchronize Fleet Telemetry</span>
                  <span className="text-[11px] text-[#5d5e66]">Refresh all live transponder metrics</span>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsQuickActionModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-black rounded-lg text-xs font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
