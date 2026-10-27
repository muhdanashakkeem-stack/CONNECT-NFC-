require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.SUPABASE_SECRET_KEY || 'speed_nfc_super_secret_jwt_key_2026';

// Initialize Supabase admin client (server-side only)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    console.log('[Backend] Supabase service client initialized.');
  } catch (err) {
    console.warn('[Backend] Notice: Supabase initialization warning:', err.message);
  }
}

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

// In-Memory store fallback & Master Provisioned Users Directory
// Note: Only provisioned accounts can sign in. Clients cannot self-register.
const USERS_DATABASE = [
  {
    id: 'usr_admin_01',
    email: 'admin@connectnfc.com',
    name: 'Noram Micro (Super Admin 1)',
    role: 'admin',
    company: 'CONNECT NFC Headquarters',
    title: 'Executive Platform Director',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'all',
      'manage_admins',
      'manage_clients',
      'manage_cards',
      'manage_orders',
      'view_analytics',
      'edit_system_settings',
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin_02',
    email: 'noramicro042@gmail.com',
    name: 'Security Admin 2',
    role: 'admin',
    company: 'CONNECT NFC Concierge Operations',
    title: 'Operations & Client Onboarding Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'manage_clients',
      'manage_cards',
      'manage_orders',
      'view_analytics',
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_client_02',
    email: 'adrian@vancepartners.com',
    name: 'Adrian Vance',
    role: 'client',
    company: 'Vance & Partners Advisory',
    title: 'Managing Partner & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'manage_own_card',
      'view_own_analytics',
      'export_vcard',
      'edit_profile',
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_cust_03',
    email: 'elena.rostova@luxuryatelier.com',
    name: 'Elena Rostova',
    role: 'customer',
    company: 'Rostova Fine Jewelry',
    title: 'Creative Director',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmYmi8meknvotEJRF3uo6_R8ly-cCFoXJbW27rlfk3V53CbadpaROXiciIwCib9yh-9JHr4cejaBrj4A7YwR0evkb4SNHDFH6LCnEtuRDImWlaWlfiBDo4qnc0xYRyiadT7XNc-NL_w8kqXcet0iVFCKoFmlG6Pfe6P3snC3aUlQ0NMQnDLk-UfTbGz0Ua1f3jrVAPGcYT1o80PCh2YrHyXIEWvNMqCLn5jBb743Fuh519ZzUQ2Z_O',
    permissions: [
      'view_own_order',
      'download_invoice',
      'track_production',
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

let INQUIRIES_DATABASE = [
  {
    id: 'inq_101',
    fullName: 'David Sterling',
    workEmail: 'd.sterling@rothschild.com',
    phone: '+44 20 7946 0912',
    tier: 'corporate-fleet',
    notes: 'Require 45 brushed titanium cards engraved with corporate crest for London partners.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

let CARDS_DATABASE = [
  {
    id: 'card_client_01',
    userId: 'usr_client_02',
    slug: 'adrian-vance',
    cardName: 'Executive Titanium Primary',
    cardholderName: 'Adrian Vance',
    headlineTitle: 'Managing Partner & Founder',
    companyName: 'Vance & Partners Advisory',
    bio: 'Private equity advisor & cross-border mergers. Dedicated to building durable generational enterprises.',
    email: 'adrian@vancepartners.com',
    phone: '+44 20 7946 0912',
    location: 'Mayfair, London · Zurich',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    finish: 'obsidian',
    nfcChipUid: '04:8F:2A:1B:6C:5E:80',
    nfcFrequency: '13.56 MHz NTAG216',
    totalTaps: 1482,
    lastTappedAt: new Date().toISOString(),
    isActive: true,
    socialLinks: [
      { id: '1', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/adrian-vance', isActive: true },
      { id: '2', platform: 'whatsapp', label: 'WhatsApp Concierge', url: 'https://wa.me/442079460912', isActive: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let ORDERS_DATABASE = [
  {
    id: 'ord_9901',
    userId: 'usr_cust_03',
    orderNumber: 'CNFC-2026-8812',
    tier: 'connect-obsidian',
    cardFinish: 'Matte Obsidian Carbon',
    engravingText: 'ELENA ROSTOVA // CREATIVE DIRECTOR',
    quantity: 1,
    totalPrice: 4999,
    currency: 'INR',
    status: 'in_production',
    trackingNumber: 'BLUEDART-88291039',
    shippingAddress: {
      line1: 'Bespoke Atelier, High Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper: Find provisioned user in database or Supabase Auth
async function findProvisionedUser(email) {
  const normalized = email.trim().toLowerCase();

  // 1. Check in-memory store
  let user = USERS_DATABASE.find((u) => u.email.toLowerCase() === normalized);
  if (user) return user;

  // 2. Check Supabase Auth
  if (supabase) {
    try {
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && userList?.users) {
        const found = userList.users.find((u) => u.email?.toLowerCase() === normalized);
        if (found) {
          const meta = found.user_metadata || {};
          user = {
            id: found.id,
            email: normalized,
            name: meta.name || normalized.split('@')[0],
            role: meta.role || 'client',
            company: meta.company || 'Provisioned Client',
            title: meta.title || 'Client Partner',
            avatarUrl: meta.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            permissions: meta.permissions || ['manage_own_card', 'view_own_analytics'],
            status: meta.status || 'active',
            createdAt: found.created_at || new Date().toISOString(),
            supabaseVerified: true,
          };
          USERS_DATABASE.push(user);
          return user;
        }
      }
    } catch (e) {
      console.warn('[Backend] Supabase search warning:', e.message);
    }
  }

  return null;
}

// Authentication Middlewares
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Session expired or token invalid.' });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Permitted roles: ${allowedRoles.join(', ')}.`,
      });
    }
    next();
  };
};

// Check specific permission
const requirePermission = (permissionKey) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];
    if (userPermissions.includes('all') || userPermissions.includes(permissionKey)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: `Access denied. Missing permission: ${permissionKey}.`,
    });
  };
};

/* =========================================================================
   ROUTES
   ========================================================================= */

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase,
    service: 'CONNECT NFC Backend Express Server',
    port: PORT,
  });
});

// 2. Passwordless Email Sign-In
// Strictly validates that the client/admin was provisioned by an administrator.
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findProvisionedUser(normalizedEmail);

  // RULE: Client cannot create an account. They must be added by an admin.
  if (!user) {
    return res.status(403).json({
      success: false,
      error: 'Access restricted: This email is not registered in our system. Clients cannot self-create an account. Please contact an administrator to be provisioned.',
      code: 'ACCOUNT_NOT_PROVISIONED',
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: 'Account access has been suspended. Please contact concierge support.',
      code: 'ACCOUNT_SUSPENDED',
    });
  }

  // Sign JWT with role and granular permissions
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions || [],
      supabaseVerified: user.supabaseVerified || false,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Backend Auth] Login authorized: ${user.email} (Role: ${user.role}, Permissions: ${user.permissions?.length || 0})`);

  res.json({
    success: true,
    data: {
      token,
      user,
      expiresIn: 604800,
    },
    message: `Sign in successful. Authenticated with Supabase role: ${user.role}`,
  });
});

// 3. Google Sign-In Endpoint
// Verifies that the Google account email is provisioned by an admin.
app.post('/api/auth/google', async (req, res) => {
  const { email, name, avatarUrl } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Google email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = await findProvisionedUser(normalizedEmail);

  // RULE: Google sign-in also strictly checks if the client is provisioned
  if (!user) {
    return res.status(403).json({
      success: false,
      error: 'Google Sign-In Denied: Your Google account (' + normalizedEmail + ') has not been provisioned by an administrator. Clients cannot self-register.',
      code: 'GOOGLE_ACCOUNT_NOT_PROVISIONED',
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: 'Your account has been suspended. Please contact platform administrators.',
    });
  }

  // Update profile image if Google provided a fresher one
  if (avatarUrl && !user.avatarUrl) {
    user.avatarUrl = avatarUrl;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions || [],
      authProvider: 'google',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Backend Auth] Google Auth verified: ${user.email} (Role: ${user.role})`);

  res.json({
    success: true,
    data: {
      token,
      user,
      expiresIn: 604800,
    },
    message: `Google Sign-in successful for ${user.email}`,
  });
});

// 4. Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 5. Current User profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.user.id) || req.user;
  res.json({ success: true, data: user });
});

/* =========================================================================
   ADMIN CLIENT & ROLE MANAGEMENT (Admin Panel Backend)
   ========================================================================= */

// 6. List all clients and users (Admin only)
app.get('/api/admin/clients', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({
    success: true,
    data: USERS_DATABASE,
    total: USERS_DATABASE.length,
  });
});

// 7. Add a new Client (Admin only - Provisions a client so they can sign in)
app.post('/api/admin/clients', requireAuth, requireRole(['admin']), async (req, res) => {
  const { email, name, role, company, title, phone, permissions } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Email and client name are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if client already exists
  const existing = USERS_DATABASE.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ success: false, error: 'A client with this email already exists in the directory.' });
  }

  const assignedRole = role || 'client';
  const defaultClientPermissions = [
    'manage_own_card',
    'view_own_analytics',
    'export_vcard',
    'edit_profile',
  ];
  const assignedPermissions = Array.isArray(permissions) && permissions.length > 0
    ? permissions
    : assignedRole === 'admin'
    ? ['manage_clients', 'manage_cards', 'manage_orders', 'view_analytics']
    : defaultClientPermissions;

  let supabaseId = null;

  // Provision in Supabase Auth
  if (supabase) {
    try {
      const { data: sbUser, error: sbError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          name,
          role: assignedRole,
          company: company || '',
          title: title || '',
          phone: phone || '',
          permissions: assignedPermissions,
          provisionedBy: req.user.email,
          status: 'active',
        },
      });
      if (sbUser?.user) {
        supabaseId = sbUser.user.id;
        console.log(`[Backend Supabase] Created user in Supabase Auth: ${normalizedEmail}`);
      } else if (sbError) {
        console.warn(`[Backend Supabase] Notice: ${sbError.message}`);
      }
    } catch (e) {
      console.warn('[Backend Supabase] Creation exception:', e.message);
    }
  }

  const newClient = {
    id: supabaseId || `usr_client_${Date.now()}`,
    email: normalizedEmail,
    name,
    role: assignedRole,
    company: company || 'Enterprise Client',
    title: title || 'Executive Cardholder',
    phone: phone || '',
    permissions: assignedPermissions,
    status: 'active',
    provisionedBy: req.user.email,
    createdAt: new Date().toISOString(),
    supabaseVerified: !!supabaseId,
  };

  USERS_DATABASE.push(newClient);

  // Automatically provision a default blank card for the client
  if (assignedRole === 'client') {
    const slugName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    CARDS_DATABASE.push({
      id: `card_${Date.now()}`,
      userId: newClient.id,
      slug: slugName,
      cardName: `${name} Reserve`,
      cardholderName: name,
      headlineTitle: title || 'Executive Partner',
      companyName: company || 'Bespoke Enterprise',
      bio: 'Verified CONNECT NFC digital credential.',
      email: normalizedEmail,
      phone: phone || '',
      location: 'Global',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      finish: 'obsidian',
      nfcChipUid: '04:' + Math.random().toString(16).substr(2, 8).toUpperCase(),
      nfcFrequency: '13.56 MHz NTAG216',
      totalTaps: 0,
      lastTappedAt: null,
      isActive: true,
      socialLinks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  console.log(`[Admin Portal] Admin ${req.user.email} successfully provisioned new client: ${normalizedEmail} (Role: ${assignedRole})`);

  res.status(201).json({
    success: true,
    data: newClient,
    message: `Client ${name} (${normalizedEmail}) has been successfully provisioned. They can now log in.`,
  });
});

// 8. Update Client Permissions or Status (Admin only)
app.put('/api/admin/clients/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  const { name, company, title, permissions, status, role } = req.body;

  if (name) user.name = name;
  if (company) user.company = company;
  if (title) user.title = title;
  if (Array.isArray(permissions)) user.permissions = permissions;
  if (status) user.status = status;
  if (role) user.role = role;

  // Sync to Supabase user metadata
  if (supabase && user.supabaseVerified) {
    try {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          name: user.name,
          company: user.company,
          title: user.title,
          permissions: user.permissions,
          status: user.status,
          role: user.role,
        },
      });
    } catch (e) {
      console.warn('[Backend Supabase] Update exception:', e.message);
    }
  }

  res.json({
    success: true,
    data: user,
    message: 'Client permissions and profile updated successfully.',
  });
});

// 9. Revoke / Delete Client (Admin only)
app.delete('/api/admin/clients/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const index = USERS_DATABASE.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  const removed = USERS_DATABASE.splice(index, 1)[0];

  // Remove from Supabase
  if (supabase && removed.supabaseVerified) {
    try {
      await supabase.auth.admin.deleteUser(removed.id);
    } catch (e) {
      console.warn('[Backend Supabase] Delete exception:', e.message);
    }
  }

  res.json({
    success: true,
    data: removed,
    message: `Client ${removed.email} revoked. They can no longer sign in.`,
  });
});

/* =========================================================================
   CARDS & INQUIRIES & ORDERS
   ========================================================================= */

// 10. Digital Cards endpoints
app.get('/api/cards', requireAuth, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ success: true, data: CARDS_DATABASE });
  }
  const userCards = CARDS_DATABASE.filter((c) => c.userId === req.user.id);
  res.json({ success: true, data: userCards });
});

app.get('/api/cards/:id', requireAuth, (req, res) => {
  const card = CARDS_DATABASE.find((c) => c.id === req.params.id);
  if (!card) {
    return res.status(404).json({ success: false, error: 'Card not found.' });
  }
  res.json({ success: true, data: card });
});

// 11. Public NFC Tap View
app.get('/api/cards/public/:slug', (req, res) => {
  const card = CARDS_DATABASE.find((c) => c.slug.toLowerCase() === req.params.slug.toLowerCase());
  if (!card) {
    return res.json({
      success: true,
      data: {
        cardholderName: req.params.slug.replace('-', ' ').toUpperCase(),
        headlineTitle: 'CONNECT NFC Executive Cardholder',
        companyName: 'Private Reserve Client',
        bio: 'Contactless credentials verified on CONNECT NFC network.',
        phone: '+44 20 7946 0912',
        email: 'concierge@connectnfc.com',
        finish: 'obsidian',
      },
    });
  }
  card.totalTaps = (card.totalTaps || 0) + 1;
  card.lastTappedAt = new Date().toISOString();
  res.json({ success: true, data: card });
});

// 12. Commission Inquiry submission
app.post('/api/inquiries', (req, res) => {
  const { fullName, workEmail, phone, tier, notes } = req.body;

  if (!fullName || !workEmail) {
    return res.status(400).json({ success: false, error: 'Full name and work email are required.' });
  }

  const newInquiry = {
    id: `inq_${Date.now()}`,
    fullName,
    workEmail,
    phone: phone || '',
    tier: tier || 'connect-obsidian',
    notes: notes || '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  INQUIRIES_DATABASE.unshift(newInquiry);
  console.log(`[Backend Concierge] New commission inquiry received from: ${fullName} (${workEmail})`);

  res.status(201).json({
    success: true,
    data: newInquiry,
    message: 'Commission inquiry successfully logged in backend.',
  });
});

app.get('/api/inquiries', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ success: true, data: INQUIRIES_DATABASE });
});

// 13. Orders endpoint
app.get('/api/orders', requireAuth, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ success: true, data: ORDERS_DATABASE });
  }
  const userOrders = ORDERS_DATABASE.filter((o) => o.userId === req.user.id);
  res.json({ success: true, data: userOrders });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` CONNECT NFC BACKEND EXPRESS API ACTIVE`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Allowed CORS: ${CLIENT_URL}`);
  console.log(` Access Rule:  Provisioned Clients Only`);
  console.log(` Supabase Auth & Role-Based Guard Active`);
  console.log(`=========================================`);
});
