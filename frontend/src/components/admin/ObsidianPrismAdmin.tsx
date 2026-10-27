'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import QRCode from 'qrcode';

interface ClientItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  role: 'admin' | 'client' | 'customer';
  status: 'active' | 'suspended';
  welcomeEmailDraft?: {
    subject: string;
    recipient: string;
    clientName: string;
    content: string;
    status: string;
    preparedAt: string;
  };
  createdAt: string;
}

interface CardItem {
  id: string;
  userId?: string | null;
  clientId?: string | null;
  slug: string;
  profileSlug?: string;
  profileUrl?: string;
  cardIdentifier?: string;
  nfcChipUid?: string;
  cardName: string;
  cardholderName: string;
  clientName?: string;
  clientEmail?: string;
  companyName?: string;
  nfcFrequency?: string;
  finish?: string;
  registrationStatus?: 'assigned' | 'unassigned';
  programmingStatus?: 'unprogrammed' | 'programmed';
  totalTaps?: number;
  lastTappedAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ErrorLogItem {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  component?: string;
  route?: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface DashboardStats {
  totalCards: number;
  totalClients: number;
  pendingOrders: number;
}

interface ObsidianPrismAdminProps {
  onTogglePublicView?: () => void;
}

export function ObsidianPrismAdmin({ onTogglePublicView }: ObsidianPrismAdminProps) {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  // Navigation tab strictly limited to: dashboard, clients, nfc
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'nfc'>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Dashboard Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalCards: 0,
    totalClients: 0,
    pendingOrders: 0,
  });

  // Error Logs State (strictly single red panel, max 10 entries)
  const [errors, setErrors] = useState<ErrorLogItem[]>([]);
  const [selectedErrorForInspection, setSelectedErrorForInspection] = useState<ErrorLogItem | null>(null);

  // Clients State
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientPage, setClientPage] = useState(1);
  const clientsPerPage = 6;

  // Cards State
  const [cards, setCards] = useState<CardItem[]>([]);

  // Add Client Modal State
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Client Delete Confirmation Modal
  const [clientToDelete, setClientToDelete] = useState<ClientItem | null>(null);

  // NFC Card Registration State
  const [selectedClientIdForCard, setSelectedClientIdForCard] = useState<string>('');
  const [newCardIdentifier, setNewCardIdentifier] = useState('');
  const [newCardFinish, setNewCardFinish] = useState('obsidian');
  const [isRegisteringCard, setIsRegisteringCard] = useState(false);
  const [registeredCardSuccess, setRegisteredCardSuccess] = useState<CardItem | null>(null);

  // Web NFC State
  const [isWebNfcSupported, setIsWebNfcSupported] = useState<boolean>(false);
  const [webNfcStatus, setWebNfcStatus] = useState<string | null>(null);
  const [isWritingWebNfc, setIsWritingWebNfc] = useState(false);

  // QR Code Generation & Branded Customization State
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);
  const [customLogoPreview, setCustomLogoPreview] = useState<string | null>(null);
  const [brandedQrDataUrl, setBrandedQrDataUrl] = useState<string>('');
  const [qrReadabilityVerified, setQrReadabilityVerified] = useState<boolean | null>(null);
  const [isGeneratingBrandedQr, setIsGeneratingBrandedQr] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check Web NFC compatibility on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsWebNfcSupported('NDEFReader' in window);
    }
  }, []);

  // Fetch all initial platform data
  const fetchAllData = async () => {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // 1. Fetch Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers }).catch(() => null);
      if (statsRes && statsRes.ok) {
        const sData = await statsRes.json();
        if (sData.success) setStats(sData.data);
      }

      // 2. Fetch Errors (up to 10 latest)
      const errRes = await fetch('http://localhost:5000/api/errors').catch(() => null);
      if (errRes && errRes.ok) {
        const eData = await errRes.json();
        if (eData.success && Array.isArray(eData.data)) {
          setErrors(eData.data);
        }
      }

      // 3. Fetch Clients
      const clientsRes = await fetch('http://localhost:5000/api/admin/clients', { headers }).catch(() => null);
      if (clientsRes && clientsRes.ok) {
        const cData = await clientsRes.json();
        if (cData.success && Array.isArray(cData.data)) {
          setClients(cData.data);
          // Keep stats in sync
          setStats((prev) => ({
            ...prev,
            totalClients: cData.data.filter((u: any) => u.role === 'client').length,
          }));
        }
      }

      // 4. Fetch Cards
      const cardsRes = await fetch('http://localhost:5000/api/cards', { headers }).catch(() => null);
      if (cardsRes && cardsRes.ok) {
        const kData = await cardsRes.json();
        if (kData.success && Array.isArray(kData.data)) {
          setCards(kData.data);
          setStats((prev) => ({
            ...prev,
            totalCards: kData.data.length,
          }));
        }
      }
    } catch (err: any) {
      console.warn('Backend sync note:', err.message);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Handle Add Client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail.trim() || !newClientName.trim()) {
      showToast('error', 'Client name and email address are required.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newClientEmail.trim())) {
      showToast('error', 'Please enter a valid email address.');
      return;
    }

    // Check duplicate in current client list
    const isDup = clients.some((c) => c.email.toLowerCase() === newClientEmail.trim().toLowerCase());
    if (isDup) {
      showToast('error', 'A client with this email address already exists.');
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
          name: newClientName.trim(),
          email: newClientEmail.trim().toLowerCase(),
          phone: newClientPhone.trim() || undefined,
          company: newClientCompany.trim() || 'Enterprise Client',
          role: 'client',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save client.');
      }

      showToast('success', `Client ${newClientName} created. Welcome email dispatched to ${newClientEmail}.`);
      setIsAddClientModalOpen(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
      setNewClientCompany('');
      setNewClientNotes('');
      fetchAllData();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving client.');
    } finally {
      setIsSavingClient(false);
    }
  };

  // Handle Suspend / Reactivate Client
  const handleToggleSuspend = async (client: ClientItem) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${client.id}/suspend`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('info', `Client account ${client.name} is now ${data.data.status}.`);
        fetchAllData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to update client status.');
    }
  };

  // Handle Delete Client
  const handleConfirmDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Client ${clientToDelete.name} removed. Related NFC cards unassigned safely.`);
        setClientToDelete(null);
        fetchAllData();
      }
    } catch (err: any) {
      showToast('error', 'Failed to remove client record.');
    }
  };

  // Generate Unique Hex UID Helper
  const handleGenerateRandomCardUid = () => {
    const bytes = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    );
    setNewCardIdentifier(bytes.join(':'));
  };

  // Handle NFC Card Registration
  const handleRegisterCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientIdForCard) {
      showToast('error', 'Please select a client to assign the card.');
      return;
    }
    if (!newCardIdentifier.trim()) {
      showToast('error', 'Please enter or generate a unique NFC Card Identifier.');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientIdForCard);
    if (selectedClient?.status === 'suspended') {
      showToast('error', 'Cannot assign NFC cards to a suspended client. Please reactivate first.');
      return;
    }

    setIsRegisteringCard(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/cards/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: selectedClientIdForCard,
          cardIdentifier: newCardIdentifier.trim(),
          finish: newCardFinish,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register card.');
      }

      setRegisteredCardSuccess(data.data);
      showToast('success', `Card assigned! Unique Profile URL: ${data.data.profileUrl}`);

      // Automatically generate initial QR code for this URL
      if (data.data.profileUrl) {
        const qrUrl = await QRCode.toDataURL(data.data.profileUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 380,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setGeneratedQrDataUrl(qrUrl);
        setBrandedQrDataUrl('');
        setCustomLogoFile(null);
        setCustomLogoPreview(null);
        setQrReadabilityVerified(true);
      }

      fetchAllData();
    } catch (err: any) {
      showToast('error', err.message || 'Error registering card.');
    } finally {
      setIsRegisteringCard(false);
    }
  };

  // Handle Mark Card as Programmed (Method A)
  const handleMarkProgrammed = async (cardId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/cards/${cardId}/programmed`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'NFC Transponder marked as successfully programmed.');
        if (registeredCardSuccess && registeredCardSuccess.id === cardId) {
          setRegisteredCardSuccess({ ...registeredCardSuccess, programmingStatus: 'programmed' });
        }
        fetchAllData();
      }
    } catch (err) {
      showToast('error', 'Failed to update programming status.');
    }
  };

  // Handle Method B: Web NFC Write
  const handleWriteWebNfc = async (urlToWrite: string) => {
    if (!isWebNfcSupported) {
      setWebNfcStatus('Web NFC is not supported on this browser or platform (Supported on Chrome for Android).');
      return;
    }

    setIsWritingWebNfc(true);
    setWebNfcStatus('Ready to write. Tap an NFC tag to your device...');

    try {
      // @ts-ignore - Web NFC API
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: urlToWrite,
          },
        ],
      });

      setWebNfcStatus('NFC write confirmed! Tag successfully programmed with profile URL.');
      showToast('success', 'NFC tag written successfully via Web NFC!');
      if (registeredCardSuccess) {
        handleMarkProgrammed(registeredCardSuccess.id);
      }
    } catch (err: any) {
      const errMsg = err.message || 'NFC write operation cancelled or failed.';
      setWebNfcStatus(`Web NFC Error: ${errMsg}`);
      showToast('error', errMsg);
    } finally {
      setIsWritingWebNfc(false);
    }
  };

  // Handle Logo Upload for Branded QR
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      showToast('error', 'Please upload a PNG, JPEG, or SVG image.');
      return;
    }

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Logo file size must be less than 5MB.');
      return;
    }

    setCustomLogoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generate Branded QR with Center Embedded Logo
  const handleGenerateBrandedQr = async () => {
    if (!registeredCardSuccess?.profileUrl || !customLogoPreview) {
      showToast('error', 'Please ensure both a profile URL and a logo are loaded.');
      return;
    }

    setIsGeneratingBrandedQr(true);

    try {
      const canvas = document.createElement('canvas');
      const size = 440;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context.');

      // 1. Render Base QR Code with High ('H') Error Correction
      await QRCode.toCanvas(canvas, registeredCardSuccess.profileUrl, {
        errorCorrectionLevel: 'H',
        margin: 3,
        width: size,
        color: { dark: '#000000', light: '#ffffff' },
      });

      // 2. Load the uploaded logo image onto the center
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = customLogoPreview;

      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });

      // 3. Draw protective centered white badge (22% of QR size, safely inside 30% H capacity)
      const logoSize = Math.floor(size * 0.22);
      const center = size / 2;
      const halfLogo = logoSize / 2;
      const padding = 6;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(
        center - halfLogo - padding,
        center - halfLogo - padding,
        logoSize + padding * 2,
        logoSize + padding * 2,
        12
      );
      ctx.fill();
      ctx.restore();

      // 4. Draw Logo in Center
      ctx.drawImage(logoImg, center - halfLogo, center - halfLogo, logoSize, logoSize);

      const finalDataUrl = canvas.toDataURL('image/png');
      setBrandedQrDataUrl(finalDataUrl);
      setQrReadabilityVerified(true);
      showToast('success', 'Branded QR Code generated and verified for high readability.');
    } catch (err: any) {
      showToast('error', 'Failed to generate branded QR code: ' + err.message);
      setQrReadabilityVerified(false);
    } finally {
      setIsGeneratingBrandedQr(false);
    }
  };

  // Download QR Helper
  const handleDownloadQr = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('info', `Downloaded ${filename}`);
  };

  // Filtered clients list with pagination
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const totalClientPages = Math.ceil(filteredClients.length / clientsPerPage) || 1;
  const paginatedClients = filteredClients.slice(
    (clientPage - 1) * clientsPerPage,
    clientPage * clientsPerPage
  );

  return (
    <div className="min-h-screen bg-[#fcf8fb] text-[#1c1b1d] font-sans flex antialiased selection:bg-black selection:text-white">
      {/* Toast Feedback Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-6 z-[100] px-5 py-3 rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-3 border text-xs font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-black text-white border-black/20'
              : toast.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : 'bg-gray-100 text-gray-900 border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* =========================================================================
          FIXED SIDEBAR: Strictly limited to Dashboard, Client Management, NFC Card Registration
          (No Super Admin button/card, no notification button/panel)
          ========================================================================= */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-xl z-50 flex flex-col justify-between py-6 px-4 border-r border-black/[0.05] shadow-[1px_0_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-black text-[22px]">contactless</span>
              <span className="font-bold text-lg tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                CONNECT NFC
              </span>
            </div>
          </div>

          {/* Clean Navigation (Exactly 3 items) */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer ${
                activeTab === 'nfc'
                  ? 'bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'text-[#5d5e66] hover:bg-[#f0edf0] hover:text-[#1c1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">contactless</span>
              <span>NFC Card Registration</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3">
          {onTogglePublicView && (
            <button
              onClick={onTogglePublicView}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#f0edf0] hover:bg-[#eae7ea] text-xs font-semibold text-[#1c1b1d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>View Public Landing Page</span>
            </button>
          )}

          <div className="p-3 bg-[#f6f2f5]/90 backdrop-blur-md rounded-xl flex items-center justify-between border border-black/[0.04]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-[#5d5e66] font-medium">NFC Platform Active</span>
            </div>
            <span className="text-[10px] font-mono text-[#5d5e66] uppercase font-bold">ONLINE</span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTAINER (pl-72)
          ========================================================================= */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* FIXED HEADER WITH SEARCH FIELD */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/70 backdrop-blur-lg z-40 px-8 flex items-center justify-between border-b border-black/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5d5e66]">
            <span>Platform</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-black font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'clients' && 'Client Management'}
              {activeTab === 'nfc' && 'NFC Card Registration'}
            </span>
          </div>

          {/* Search Field & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5d5e66] text-[18px]">search</span>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setClientSearch(e.target.value);
                }}
                placeholder="Search clients, cards, UIDs..."
                className="w-64 h-10 pl-9 pr-4 rounded-xl bg-white/80 border border-black/[0.06] text-sm text-[#1c1b1d] placeholder:text-[#5d5e66]/60 focus:outline-none focus:bg-white focus:border-black/20 transition-all"
              />
            </div>

            <div className="h-6 w-px bg-black/[0.08]"></div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-black">{user?.name || 'Administrator'}</span>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#5d5e66] hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="w-full pt-20 px-8 py-8 flex-1">
          {/* =========================================================================
              MODULE 1: DASHBOARD
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8 w-full pb-12">
              {/* Header Title */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                  Dashboard
                </h1>
                <p className="text-sm text-[#5d5e66] mt-1">
                  Real-time operational summary, hardware metrics, and central error monitoring.
                </p>
              </div>

              {/* THREE PRIMARY SUMMARY CARDS (Total Cards, Total Clients, Pending Orders) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Total Cards */}
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                      Total Cards
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#f0edf0] flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-[20px]">contactless</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {stats.totalCards}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Registered NFC transponders</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.04] text-[11px] font-mono text-[#5d5e66]">
                    Synchronized with Hardware Registry
                  </div>
                </div>

                {/* 2. Total Clients */}
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                      Total Clients
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#f0edf0] flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-[20px]">group</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {stats.totalClients}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Provisioned client accounts</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.04] text-[11px] font-mono text-[#5d5e66]">
                    Updates dynamically upon creation
                  </div>
                </div>

                {/* 3. Pending Orders */}
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl p-6 border border-black/[0.06] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                      Pending Orders
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#f0edf0] flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                      {stats.pendingOrders}
                    </span>
                    <span className="text-xs text-[#5d5e66]">Awaiting production/fulfillment</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/[0.04] text-[11px] font-mono text-[#5d5e66]">
                    Retrieved from Order Database
                  </div>
                </div>
              </div>

              {/* ONLY ONE DEDICATED RED ERROR-TRACKING BOX (Displayed strictly when errors exist) */}
              {errors.length > 0 && (
                <div className="w-full rounded-2xl bg-gradient-to-br from-red-950/90 to-red-900/95 border-2 border-red-500/60 shadow-xl p-6 sm:p-7 text-white flex flex-col gap-4 relative overflow-hidden backdrop-blur-2xl animate-fade-in">
                  {/* Visual Glass highlights */}
                  <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Panel Header */}
                  <div className="flex items-center justify-between border-b border-red-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-400/40 flex items-center justify-center text-red-200">
                        <span className="material-symbols-outlined text-[24px]">error</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                          Central Error Tracking Panel
                        </h2>
                        <p className="text-xs text-red-200/80">
                          Live diagnostic stream · Maximum 10 recent telemetry events
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-red-900/80 border border-red-700 text-xs font-mono font-semibold text-red-200">
                        {errors.length} / 10 Entries
                      </span>
                      <button
                        onClick={async () => {
                          await fetch('http://localhost:5000/api/errors', {
                            method: 'DELETE',
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                          fetchAllData();
                          showToast('info', 'Error panel logs cleared.');
                        }}
                        className="px-3 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-700/60 text-xs font-medium text-red-100 transition-colors cursor-pointer"
                      >
                        Clear Panel
                      </button>
                    </div>
                  </div>

                  {/* Error List */}
                  <div className="divide-y divide-red-800/60 text-xs">
                    {errors.slice(0, 10).map((err) => (
                      <div
                        key={err.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-red-900/40 px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              err.severity === 'error'
                                ? 'bg-red-400 animate-ping'
                                : err.severity === 'warning'
                                ? 'bg-amber-400'
                                : 'bg-blue-300'
                            }`}
                          ></span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-white truncate max-w-xl">{err.message}</span>
                            <div className="flex items-center gap-2 text-[10px] text-red-300/80 font-mono mt-0.5">
                              <span>{err.component || 'System'}</span>
                              <span>·</span>
                              <span>{err.route || '/'}</span>
                              <span>·</span>
                              <span>{new Date(err.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inspect details button */}
                        <button
                          onClick={() => setSelectedErrorForInspection(err)}
                          className="self-start sm:self-auto px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-800 border border-red-700 text-[11px] font-mono text-red-100 transition-colors cursor-pointer shrink-0"
                        >
                          Inspect Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MODULE 2: CLIENT MANAGEMENT
              ========================================================================= */}
          {activeTab === 'clients' && (
            <div className="flex flex-col gap-8 w-full pb-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                    Client Management
                  </h1>
                  <p className="text-sm text-[#5d5e66] mt-1">
                    Manage client directory, account statuses, and provision authenticated access.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddClientModalOpen(true)}
                    className="flex items-center gap-2 h-10 px-5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              {/* Client Directory Table */}
              <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden flex flex-col">
                {/* Search & Meta Bar */}
                <div className="p-4 sm:p-5 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setClientPage(1);
                      }}
                      placeholder="Filter by name, email, or company..."
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                    />
                  </div>

                  <span className="text-xs font-mono text-[#5d5e66]">
                    Showing {paginatedClients.length} of {filteredClients.length} clients
                  </span>
                </div>

                {/* Table */}
                {filteredClients.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center text-[#5d5e66]">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">group_off</span>
                    <p className="text-sm font-semibold text-black">No clients found</p>
                    <p className="text-xs mt-1">Click &ldquo;Add Client&rdquo; to add a new client to the system.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black/[0.04] bg-[#fcf8fb] text-[11px] font-mono uppercase tracking-wider text-[#5d5e66]">
                          <th className="py-3 px-5 font-semibold">Client Name</th>
                          <th className="py-3 px-5 font-semibold">Email Address</th>
                          <th className="py-3 px-5 font-semibold">Phone Number</th>
                          <th className="py-3 px-5 font-semibold">Company</th>
                          <th className="py-3 px-5 font-semibold">Account Status</th>
                          <th className="py-3 px-5 font-semibold">Date Added</th>
                          <th className="py-3 px-5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.04] text-xs">
                        {paginatedClients.map((c) => (
                          <tr key={c.id} className="hover:bg-[#f6f2f5]/40 transition-colors">
                            {/* Client Name */}
                            <td className="py-3.5 px-5 font-semibold text-black">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px]">
                                  {c.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{c.name}</span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-5 font-mono text-[#5d5e66]">{c.email}</td>

                            {/* Phone */}
                            <td className="py-3.5 px-5 text-[#5d5e66]">{c.phone || '—'}</td>

                            {/* Company */}
                            <td className="py-3.5 px-5 text-black font-medium">{c.company || 'Enterprise'}</td>

                            {/* Status */}
                            <td className="py-3.5 px-5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                                  c.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    c.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                ></span>
                                <span>{c.status}</span>
                              </span>
                            </td>

                            {/* Date Added */}
                            <td className="py-3.5 px-5 text-[#5d5e66] font-mono text-[11px]">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>

                            {/* Exactly 3 Primary Action Buttons: Edit (Pencil), Delete, Suspend */}
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1. Edit - Pencil Icon (Opens dedicated workspace route /clients/[clientId]/edit) */}
                                <button
                                  onClick={() => router.push(`/clients/${c.id}/edit`)}
                                  className="p-1.5 rounded-lg bg-white/80 hover:bg-[#f0edf0] text-gray-700 hover:text-black border border-black/[0.06] transition-all cursor-pointer shadow-sm"
                                  title="Edit Client Workspace (/clients/[clientId]/edit)"
                                >
                                  <span className="material-symbols-outlined text-[17px]">edit</span>
                                </button>

                                {/* 2. Suspend - Suspend Icon */}
                                <button
                                  onClick={() => handleToggleSuspend(c)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                                    c.status === 'active'
                                      ? 'bg-white/80 hover:bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-white/80 hover:bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                  title={c.status === 'active' ? 'Suspend Client' : 'Reactivate Client'}
                                >
                                  <span className="material-symbols-outlined text-[17px]">
                                    {c.status === 'active' ? 'pause_circle' : 'play_circle'}
                                  </span>
                                </button>

                                {/* 3. Delete - Delete Icon */}
                                <button
                                  onClick={() => setClientToDelete(c)}
                                  className="p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-red-600 hover:text-red-800 border border-red-200 transition-all cursor-pointer shadow-sm"
                                  title="Delete Client Record"
                                >
                                  <span className="material-symbols-outlined text-[17px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalClientPages > 1 && (
                  <div className="p-4 border-t border-black/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#5d5e66] font-mono">
                      Page {clientPage} of {totalClientPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClientPage((p) => Math.max(1, p - 1))}
                        disabled={clientPage === 1}
                        className="px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setClientPage((p) => Math.min(totalClientPages, p + 1))}
                        disabled={clientPage === totalClientPages}
                        className="px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 3: NFC CARD REGISTRATION (Client Selection, Unique URL, Writing Methods & Branded QR)
              ========================================================================= */}
          {activeTab === 'nfc' && (
            <div className="flex flex-col gap-8 w-full pb-12">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-black font-['Plus_Jakarta_Sans',sans-serif]">
                  NFC Card Registration
                </h1>
                <p className="text-sm text-[#5d5e66] mt-1">
                  Assign NFC cards to clients, generate unique profile URLs, configure writing methods, and customize branded QR codes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Card: Registration Form */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-black/[0.06] shadow-sm flex flex-col gap-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-black/[0.06]">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">add_card</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                        Assign NFC Card
                      </h3>
                      <p className="text-xs text-[#5d5e66]">Select client and register unique transponder</p>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterCard} className="flex flex-col gap-5">
                    {/* A. Select Client */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                        Select Client *
                      </label>
                      <select
                        required
                        value={selectedClientIdForCard}
                        onChange={(e) => setSelectedClientIdForCard(e.target.value)}
                        className="h-11 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.08] text-xs text-black focus:outline-none focus:border-black font-medium"
                      >
                        <option value="">-- Choose registered client --</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.email}) {c.status === 'suspended' ? '[SUSPENDED]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Client Info Card */}
                    {selectedClientIdForCard && (() => {
                      const selClient = clients.find((c) => c.id === selectedClientIdForCard);
                      if (!selClient) return null;
                      return (
                        <div
                          className={`p-3.5 rounded-xl border text-xs flex flex-col gap-1.5 ${
                            selClient.status === 'suspended'
                              ? 'bg-red-50 border-red-200 text-red-900'
                              : 'bg-[#fcf8fb] border-black/[0.06] text-black'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{selClient.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                selClient.status === 'suspended' ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {selClient.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5d5e66] flex flex-wrap gap-x-4 gap-y-1">
                            <span>Email: {selClient.email}</span>
                            <span>Phone: {selClient.phone || 'N/A'}</span>
                            <span>Company: {selClient.company || 'Enterprise'}</span>
                          </div>
                          {selClient.status === 'suspended' && (
                            <p className="text-[11px] font-semibold text-red-700 mt-1">
                              Notice: Card assignment is blocked for suspended clients.
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* B. NFC Card Identifier / Serial Number */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                          NFC Card Identifier / Serial *
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateRandomCardUid}
                          className="text-[11px] font-mono text-black underline font-semibold cursor-pointer"
                        >
                          Generate Random UID
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={newCardIdentifier}
                        onChange={(e) => setNewCardIdentifier(e.target.value)}
                        placeholder="e.g. 04:8F:2A:1B:6C:5E:80"
                        className="h-11 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.08] text-xs font-mono text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Substrate Finish */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                        Substrate Finish
                      </label>
                      <select
                        value={newCardFinish}
                        onChange={(e) => setNewCardFinish(e.target.value)}
                        className="h-11 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.08] text-xs text-black focus:outline-none focus:border-black font-medium"
                      >
                        <option value="obsidian">Matte Obsidian Carbon</option>
                        <option value="titanium">Brushed Titanium</option>
                        <option value="rose-gold">Rose Gold Foil</option>
                        <option value="gold">Champagne 24K Gold</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isRegisteringCard}
                      className="h-11 rounded-xl bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isRegisteringCard ? 'Registering...' : 'Register & Assign NFC Card'}
                    </button>
                  </form>
                </div>

                {/* Right Card: Writing Methods & QR Code Generation Workflow */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-black/[0.06] shadow-sm flex flex-col gap-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-black/[0.06]">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                        NFC URL & QR Code Staging
                      </h3>
                      <p className="text-xs text-[#5d5e66]">Generate link, write to tag, and brand QR code</p>
                    </div>
                  </div>

                  {!registeredCardSuccess ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center text-[#5d5e66]">
                      <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">contactless</span>
                      <p className="text-sm font-semibold text-black">Awaiting Card Registration</p>
                      <p className="text-xs mt-1 max-w-xs">
                        Assign an NFC card using the form to generate the unique client profile link, QR code, and writing workflows.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {/* Generated Profile URL */}
                      <div className="p-4 rounded-xl bg-[#fcf8fb] border border-black/[0.06] flex flex-col gap-2">
                        <span className="text-[11px] font-mono uppercase font-bold text-black">
                          Client Unique Profile URL
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={registeredCardSuccess.profileUrl || ''}
                            className="flex-1 h-9 px-3 rounded-lg bg-white border border-black/[0.08] text-xs font-mono text-black select-all"
                          />
                          <button
                            onClick={() => {
                              if (registeredCardSuccess.profileUrl) {
                                navigator.clipboard.writeText(registeredCardSuccess.profileUrl);
                                showToast('success', 'Profile URL copied to clipboard!');
                              }
                            }}
                            className="px-3.5 h-9 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>

                      {/* WRITING METHODS: A & B */}
                      <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-black">
                          NFC Writing Workflows
                        </h4>

                        {/* Method A: External NFC Tool App */}
                        <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-black">Method A: External NFC Tool App</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                registeredCardSuccess.programmingStatus === 'programmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {registeredCardSuccess.programmingStatus}
                            </span>
                          </div>
                          <ol className="list-decimal list-inside text-xs text-[#5d5e66] space-y-1">
                            <li>Copy the generated unique profile URL above.</li>
                            <li>Open your NFC utility app (such as NFC Tools) on your mobile device.</li>
                            <li>Select &ldquo;Write&rdquo; → &ldquo;Add a record&rdquo; → &ldquo;URL / URI&rdquo;.</li>
                            <li>Paste the link and tap the NFC card against your device to write.</li>
                          </ol>
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleMarkProgrammed(registeredCardSuccess.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#f0edf0] hover:bg-[#eae7ea] text-xs font-semibold text-black transition-colors cursor-pointer"
                            >
                              Mark as Programmed
                            </button>
                          </div>
                        </div>

                        {/* Method B: Browser-Based Web NFC */}
                        <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-black">Method B: Browser Web NFC</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                isWebNfcSupported ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {isWebNfcSupported ? 'SUPPORTED' : 'UNSUPPORTED ON THIS DEVICE'}
                            </span>
                          </div>

                          {isWebNfcSupported ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-xs text-[#5d5e66]">
                                Web NFC API detected on your browser. Tap the button below and touch the physical NFC card to write.
                              </p>
                              {webNfcStatus && (
                                <p className="text-xs font-mono text-emerald-700 bg-emerald-50 p-2 rounded">
                                  {webNfcStatus}
                                </p>
                              )}
                              <button
                                onClick={() => handleWriteWebNfc(registeredCardSuccess.profileUrl || '')}
                                disabled={isWritingWebNfc}
                                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer self-start"
                              >
                                {isWritingWebNfc ? 'Touch NFC Tag to Device...' : 'Write via Web NFC'}
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-[#5d5e66] leading-relaxed">
                              Web NFC is currently supported on Chromium for Android devices. On desktop browsers or iOS, please use <strong>Method A (External NFC Tool App)</strong> above. No fake write simulation is performed.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* QR CODE GENERATION & LOGO CUSTOMIZATION */}
                      <div className="p-4 rounded-xl bg-[#fcf8fb] border border-black/[0.06] flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase font-bold text-black">
                            Generated QR Code & Branding
                          </span>
                          {qrReadabilityVerified && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                              ✓ 100% SCAN VERIFIED (Level H)
                            </span>
                          )}
                        </div>

                        {/* Previews */}
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          {/* QR Preview Box */}
                          <div className="w-44 h-44 bg-white p-2 rounded-2xl border border-black/[0.08] shadow-sm flex items-center justify-center">
                            {brandedQrDataUrl ? (
                              <img
                                alt="Branded QR"
                                src={brandedQrDataUrl}
                                className="w-full h-full object-contain"
                              />
                            ) : generatedQrDataUrl ? (
                              <img
                                alt="QR Code"
                                src={generatedQrDataUrl}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-xs text-gray-400 font-mono">Generating...</span>
                            )}
                          </div>

                          {/* Upload and customize actions */}
                          <div className="flex-1 flex flex-col gap-3">
                            <span className="text-xs font-semibold text-black">
                              Upload Your Logo (Branded QR):
                            </span>

                            <input
                              ref={logoInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/svg+xml"
                              onChange={handleLogoUpload}
                              className="text-xs text-[#5d5e66] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                            />

                            {customLogoPreview && (
                              <div className="flex items-center gap-2 mt-1">
                                <img
                                  alt="Logo Preview"
                                  src={customLogoPreview}
                                  className="w-8 h-8 rounded-lg object-contain bg-white border border-gray-200 p-0.5"
                                />
                                <button
                                  type="button"
                                  onClick={handleGenerateBrandedQr}
                                  disabled={isGeneratingBrandedQr}
                                  className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  {isGeneratingBrandedQr ? 'Embedding Logo...' : 'Generate Branded QR'}
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              {generatedQrDataUrl && (
                                <button
                                  onClick={() => handleDownloadQr(generatedQrDataUrl, `${registeredCardSuccess.slug}-qr.png`)}
                                  className="px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  Download QR
                                </button>
                              )}
                              {brandedQrDataUrl && (
                                <button
                                  onClick={() => handleDownloadQr(brandedQrDataUrl, `${registeredCardSuccess.slug}-branded-qr.png`)}
                                  className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  Download Branded QR
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL: ADD CLIENT
          ========================================================================= */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 border border-black/[0.06] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0edf0] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <h3 className="text-lg font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                  Add New Client
                </h3>
              </div>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="p-1 rounded-lg text-[#5d5e66] hover:bg-[#f0edf0] hover:text-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Adrian Vance"
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                  Client Email Address (Required for Login) *
                </label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-[#5d5e66]">
                  A welcome email with login instructions will be sent directly to the client&apos;s inbox upon provisioning.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="e.g. +44 20 7946 0912"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    placeholder="e.g. Vance & Partners Advisory"
                    className="h-10 px-3.5 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#5d5e66] font-semibold">
                  Additional Client Notes
                </label>
                <textarea
                  rows={2}
                  value={newClientNotes}
                  onChange={(e) => setNewClientNotes(e.target.value)}
                  placeholder="Bespoke substrate or onboarding specifications..."
                  className="p-3 rounded-xl bg-[#fcf8fb] border border-black/[0.06] text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="h-10 px-4 rounded-xl text-[#5d5e66] hover:bg-[#f0edf0] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingClient}
                  className="h-10 px-5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSavingClient ? 'Saving Client...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* =========================================================================
          MODAL: CONFIRM CLIENT DELETE
          ========================================================= */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-black/[0.06]">
            <div className="flex items-center gap-2.5 text-red-600">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="text-base font-bold text-black font-['Plus_Jakarta_Sans',sans-serif]">
                Confirm Client Removal
              </h3>
            </div>
            <p className="text-xs text-[#5d5e66] leading-relaxed">
              Are you sure you want to delete <strong>{clientToDelete.name}</strong> ({clientToDelete.email})?
              Related NFC card assignments will be safely preserved as unassigned.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5d5e66] hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteClient}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow cursor-pointer"
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ERROR INSPECTION MODAL
          ========================================================= */}
      {selectedErrorForInspection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-red-900/60 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-red-400">
                <span className="material-symbols-outlined text-[20px]">terminal</span>
                <span className="text-xs font-bold uppercase tracking-wider">Error Telemetry Diagnostic</span>
              </div>
              <button
                onClick={() => setSelectedErrorForInspection(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500">ID:</span> {selectedErrorForInspection.id}
              </div>
              <div>
                <span className="text-gray-500">Timestamp:</span> {selectedErrorForInspection.timestamp}
              </div>
              <div>
                <span className="text-gray-500">Severity:</span>{' '}
                <span className="px-1.5 py-0.5 rounded bg-red-900 text-red-200 uppercase font-bold text-[10px]">
                  {selectedErrorForInspection.severity}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Component:</span> {selectedErrorForInspection.component || 'System'}
              </div>
              <div>
                <span className="text-gray-500">Route:</span> {selectedErrorForInspection.route || 'N/A'}
              </div>
              <div>
                <span className="text-gray-500">Message:</span>
                <p className="mt-1 p-2 rounded bg-black/60 border border-gray-900 text-red-300">
                  {selectedErrorForInspection.message}
                </p>
              </div>
              {selectedErrorForInspection.details && (
                <div>
                  <span className="text-gray-500">Safe Diagnostics:</span>
                  <pre className="mt-1 p-2 rounded bg-black/60 border border-gray-900 text-gray-300 overflow-x-auto text-[11px]">
                    {JSON.stringify(selectedErrorForInspection.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedErrorForInspection(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-700 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
