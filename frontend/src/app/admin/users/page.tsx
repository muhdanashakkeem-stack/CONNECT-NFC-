'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';

interface ProvisionedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'customer';
  company?: string;
  title?: string;
  permissions?: string[];
  status: 'active' | 'suspended';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<ProvisionedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<'client' | 'admin'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (e: any) {
      console.warn('Backend offline, using local fallback:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Handle Add Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          name: newName.trim(),
          company: newCompany.trim() || 'Enterprise Client',
          title: newTitle.trim() || 'Client Partner',
          role: newRole,
          permissions:
            newRole === 'admin'
              ? ['manage_clients', 'manage_cards', 'manage_orders', 'view_analytics']
              : ['manage_own_card', 'view_own_analytics', 'export_vcard', 'edit_profile'],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add client.');
      }

      setSuccessMsg(`Client ${newName} (${newEmail}) provisioned in Supabase. They can now log in!`);
      setNewEmail('');
      setNewName('');
      setNewCompany('');
      setNewTitle('');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error provisioning client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Revoke Client
  const handleRevokeClient = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${email}? They will no longer be able to sign in.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Client ${email} revoked.`);
        fetchUsers();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error revoking client.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-md text-2xl md:text-3xl font-semibold text-primary">
            Client & Administrator Directory
          </h1>
          <p className="text-xs text-outline mt-1">
            Clients cannot self-register. Only users provisioned here with an email ID can log in.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-secondary-container hover:bg-[#a61318] text-white text-xs font-label-md uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>+ Provision Client</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 overflow-x-auto shadow-sm">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-outline font-mono">Loading provisioned users from backend...</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-outline-variant/20 text-xs text-outline uppercase font-label-sm">
                <th className="py-3 px-4">Client Name & Email</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Organization / Title</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-primary">{u.name}</div>
                    <div className="text-xs text-outline font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        u.role === 'admin'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : u.role === 'client'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <div className="text-primary">{u.company || '—'}</div>
                    <div className="text-outline text-[11px]">{u.title || 'Executive'}</div>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {u.permissions?.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-surface text-[10px] text-outline font-mono">
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {(u.permissions?.length || 0) > 3 && (
                        <span className="text-[10px] text-outline font-mono">
                          +{(u.permissions?.length || 0) - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-label-sm bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleRevokeClient(u.id, u.email)}
                        className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 border border-red-800 text-xs text-red-200 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white text-gray-900 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Provision Client Access</h3>
                <p className="text-xs text-gray-500">
                  Add client email so they can immediately sign in.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleAddClient} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Client Email ID (Required)
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  Client Full Name (Required)
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Marcus Aurelius"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Advisory / Firm"
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Managing Partner"
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">Role Tier</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'client' | 'admin')}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                >
                  <option value="client">Client (NFC Cardholder & Matrix)</option>
                  <option value="admin">Admin (Client Management & Platform)</option>
                </select>
              </div>

              <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-[11px] text-gray-500">
                This account will be created in Supabase Auth with verified role permissions. Once saved, this email can sign in directly.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Provisioning in Supabase...' : 'Save & Authorize Client'}</span>
                <span className="material-symbols-outlined text-sm">check</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
