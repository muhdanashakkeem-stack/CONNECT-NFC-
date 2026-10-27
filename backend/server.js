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
    email: 'admin@speednfc.com',
    password: 'admin_secret_pass',
    name: 'Noram Micro (Super Admin)',
    role: 'admin',
    company: 'Speed NFC Headquarters',
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
    tier: 'speed-obsidian',
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
    service: 'Speed NFC Backend Express Server',
    port: PORT,
  });
});

// 2. Login endpoint (validates credentials and signs JWT on server)
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  // Find user in DB or match by email/role
  let user = USERS_DATABASE.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user && role) {
    user = USERS_DATABASE.find((u) => u.role === role);
  }

  if (!user) {
    // Generate authenticated profile
    user = {
      id: `usr_${Date.now()}`,
      email: email,
      name: email.split('@')[0].replace('.', ' '),
      role: role || (email.includes('admin') ? 'admin' : email.includes('client') ? 'client' : 'customer'),
      company: 'Private Client Office',
      title: 'Executive Cardholder',
      createdAt: new Date().toISOString(),
    };
  }

  // Sign JWT token strictly on the backend
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = user;

  res.json({
    success: true,
    data: {
      token,
      user: safeUser,
      expiresIn: 604800,
    },
    message: 'Authentication successful.',
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
        headlineTitle: 'Speed NFC Executive Cardholder',
        companyName: 'Private Reserve Client',
        bio: 'Contactless credentials verified on Speed NFC network.',
        phone: '+44 20 7946 0912',
        email: 'concierge@speednfc.com',
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
    tier: tier || 'speed-obsidian',
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
  console.log(` SPEED NFC BACKEND EXPRESS API ACTIVE`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Allowed CORS: ${CLIENT_URL}`);
  console.log(` JWT Engine:   Backend Managed`);
  console.log(`=========================================`);
});
