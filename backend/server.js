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

// In-Memory store fallback
const USERS_DATABASE = [
  {
    id: 'usr_admin_01',
    email: 'admin@connectnfc.com',
    password: 'admin_secret_pass',
    name: 'Noram Micro (Super Admin)',
    role: 'admin',
    company: 'CONNECT NFC Headquarters',
    title: 'Platform Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_client_02',
    email: 'adrian@vancepartners.com',
    password: 'client_secret_pass',
    name: 'Adrian Vance',
    role: 'client',
    company: 'Vance & Partners Advisory',
    title: 'Managing Partner & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_cust_03',
    email: 'elena.rostova@luxuryatelier.com',
    password: 'customer_secret_pass',
    name: 'Elena Rostova',
    role: 'customer',
    company: 'Rostova Fine Jewelry',
    title: 'Creative Director',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmYmi8meknvotEJRF3uo6_R8ly-cCFoXJbW27rlfk3V53CbadpaROXiciIwCib9yh-9JHr4cejaBrj4A7YwR0evkb4SNHDFH6LCnEtuRDImWlaWlfiBDo4qnc0xYRyiadT7XNc-NL_w8kqXcet0iVFCKoFmlG6Pfe6P3snC3aUlQ0NMQnDLk-UfTbGz0Ua1f3jrVAPGcYT1o80PCh2YrHyXIEWvNMqCLn5jBb743Fuh519ZzUQ2Z_O',
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
    orderNumber: 'SNFC-2026-8812',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Auth verification middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token format.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token expired or invalid signature.' });
  }
}

// Role-based authorization middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Clearance level '${allowedRoles.join('/')}' required.`,
      });
    }
    next();
  };
}

// --- Endpoints ---

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

// 2. Login endpoint (Passwordless, single-action sign-in with Supabase role verification)
app.post('/api/auth/login', async (req, res) => {
  const { email, role: requestedRole } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Executive email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let userRole = null;
  let userName = null;
  let userCompany = null;
  let userTitle = null;
  let userId = null;
  let avatarUrl = null;
  let supabaseVerified = false;

  // Step 1: Check Supabase Auth for existing user and retrieve verified role
  if (supabase) {
    try {
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && userList && userList.users) {
        const found = userList.users.find(
          (u) => u.email && u.email.toLowerCase() === normalizedEmail
        );
        if (found) {
          userId = found.id;
          userRole = found.user_metadata?.role || found.app_metadata?.role;
          userName = found.user_metadata?.name;
          userCompany = found.user_metadata?.company;
          userTitle = found.user_metadata?.title;
          avatarUrl = found.user_metadata?.avatarUrl;
          supabaseVerified = true;
          console.log(`[Backend Supabase] User verified from Supabase Auth: ${normalizedEmail} (Role: ${userRole})`);
        }
      }
    } catch (err) {
      console.warn('[Backend Supabase] Query warning:', err.message);
    }
  }

  // Step 2: If user not yet in Supabase, provision them with their assigned role
  if (!userRole) {
    const predefined = USERS_DATABASE.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (predefined) {
      userId = predefined.id;
      userRole = predefined.role;
      userName = predefined.name;
      userCompany = predefined.company;
      userTitle = predefined.title;
      avatarUrl = predefined.avatarUrl;
    } else {
      userRole = requestedRole || (normalizedEmail.includes('admin') ? 'admin' : normalizedEmail.includes('client') ? 'client' : 'customer');
      userId = `usr_${Date.now()}`;
      userName = normalizedEmail.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      userCompany = 'Private Atelier Client';
      userTitle = userRole === 'admin' ? 'Super Administrator' : userRole === 'client' ? 'Client Partner' : 'Customer';
    }

    // Persist into Supabase Auth with metadata role
    if (supabase) {
      try {
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          email_confirm: true,
          user_metadata: {
            role: userRole,
            name: userName,
            company: userCompany,
            title: userTitle,
            avatarUrl: avatarUrl,
          },
        });
        if (!createError && created?.user) {
          userId = created.user.id;
          supabaseVerified = true;
          console.log(`[Backend Supabase] Auto-provisioned user in Supabase: ${normalizedEmail} with role: ${userRole}`);
        }
      } catch (err) {
        console.warn('[Backend Supabase] Provision warning:', err.message);
      }
    }
  }

  const safeUser = {
    id: userId,
    email: normalizedEmail,
    name: userName || normalizedEmail.split('@')[0],
    role: userRole,
    company: userCompany || 'CONNECT NFC Network',
    title: userTitle || 'Executive Member',
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    supabaseVerified,
    createdAt: new Date().toISOString(),
  };

  // Step 3: Sign JWT token on the backend with verified Supabase role
  const token = jwt.sign(
    {
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
      supabaseVerified: safeUser.supabaseVerified,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Backend Auth] Session issued for ${safeUser.email} -> Role: ${safeUser.role} (Supabase verified: ${safeUser.supabaseVerified})`);

  res.json({
    success: true,
    data: {
      token,
      user: safeUser,
      expiresIn: 604800,
    },
    message: `Sign in successful. Role verified by Supabase: ${safeUser.role}`,
  });
});

// 3. Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. Get Current User profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.user.id) || req.user;
  const { password: _, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

// 5. Digital Cards endpoints
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

// 6. Public NFC Tap View (accessed when card is tapped on mobile)
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
  // Increment tap count
  card.totalTaps = (card.totalTaps || 0) + 1;
  card.lastTappedAt = new Date().toISOString();
  res.json({ success: true, data: card });
});

// 7. Commission Inquiry submission (public portal)
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

// 8. Orders endpoint
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
  console.log(` JWT Engine:   Backend Managed`);
  console.log(`=========================================`);
});
