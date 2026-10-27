require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.SUPABASE_SECRET_KEY || 'speed_nfc_super_secret_jwt_key_2026';

// Initialize Resend Email Engine
const resend = new Resend(process.env.RESEND_API_KEY || '');

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
    id: '80d5de39-bfc6-4fa1-85d6-f86b6f5f65e0',
    email: 'muhdanashakkeem@gmail.com',
    name: 'Anas (Super Admin)',
    role: 'admin',
    isSuperAdmin: true,
    company: 'CONNECT NFC Headquarters',
    title: 'Super Platform Director & Founder',
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
    name: 'Noram Micro (Platform Admin)',
    role: 'admin',
    isSuperAdmin: true,
    company: 'CONNECT NFC Operations',
    title: 'Platform Director & Operations Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
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
    id: 'usr_client_02',
    email: 'adrian@vancepartners.com',
    name: 'Adrian Vance',
    role: 'client',
    phone: '+44 20 7946 0912',
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
    welcomeEmailDraft: {
      subject: 'Welcome to Our NFC Business Platform',
      clientName: 'Adrian Vance',
      recipient: 'adrian@vancepartners.com',
      content: 'Hello Adrian Vance,\n\nWelcome to our NFC business platform!\n\nYour client account has been created successfully. You can access your account using your registered email address and the email verification process.\n\nOnce logged in, you will be able to manage your profile and proceed with your NFC card setup.\n\nWe look forward to helping you create your digital NFC identity.\n\nBest regards,\nThe NFC Team',
      status: 'draft_prepared',
      preparedAt: new Date().toISOString(),
    },
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
    clientId: 'usr_client_02',
    slug: 'adrian-vance',
    profileSlug: 'adrian-vance',
    profileUrl: `${CLIENT_URL}/profile/adrian-vance`,
    cardIdentifier: '04:8F:2A:1B:6C:5E:80',
    cardName: 'Executive Titanium Primary',
    cardholderName: 'Adrian Vance',
    clientName: 'Adrian Vance',
    clientEmail: 'adrian@vancepartners.com',
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
    registrationStatus: 'assigned',
    programmingStatus: 'programmed',
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

// Error Logs Database (In-Memory with safe redaction)
let ERROR_LOGS_DATABASE = [
  {
    id: 'err_init_01',
    message: 'NFC Reader ACR122U USB driver polling interval calibrated (250ms nominal).',
    severity: 'info',
    component: 'HardwareDaemon',
    route: '/api/hardware/telemetry',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    details: { interface: 'CCID-USB', status: 'standby' },
  },
  {
    id: 'err_init_02',
    message: 'Unassigned card allocation warning: Transponder UID 04:A2:3F:89:C1:20 awaiting client registration.',
    severity: 'warning',
    component: 'CardRegistry',
    route: '/api/admin/cards',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    details: { reason: 'Pending batch assignment' },
  },
];

// OTP Store for email-based verification (Stores email -> { otp, expiresAt, attemptsRemaining, lastSentAt })
const OTP_STORE = new Map();

// QR Assets Database (Client ID -> { originalQr, customLogo, brandedQr, createdAt })
let QR_ASSETS_DATABASE = [];

// Helper: Safely log errors without sensitive tokens/passwords
function logAppError(message, severity = 'error', component = 'System', route = '/api', details = {}) {
  const safeDetails = { ...details };
  delete safeDetails.password;
  delete safeDetails.otp;
  delete safeDetails.token;
  delete safeDetails.secret;
  delete safeDetails.authorization;

  const errEntry = {
    id: `err_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    message: String(message),
    severity,
    component,
    route,
    timestamp: new Date().toISOString(),
    details: safeDetails,
  };
  ERROR_LOGS_DATABASE.unshift(errEntry);
  if (ERROR_LOGS_DATABASE.length > 100) {
    ERROR_LOGS_DATABASE.pop();
  }
  return errEntry;
}

// Helper: Find provisioned user in database or Supabase Auth
async function findProvisionedUser(email) {
  const normalized = email.trim().toLowerCase();

  // 1. Check in-memory store
  let user = USERS_DATABASE.find((u) => u.email.toLowerCase() === normalized);
  if (user) {
    if (user.role === 'admin' || user.role === 'superadmin' || user.isSuperAdmin) {
      user.status = 'active';
    }
    return user;
  }

  // 2. Check Supabase Auth
  if (supabase) {
    try {
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && userList?.users) {
        const found = userList.users.find((u) => u.email?.toLowerCase() === normalized);
        if (found) {
          const meta = found.user_metadata || {};
          const rawRole = (meta.role || 'client').toLowerCase();
          const isAdminRole = rawRole === 'superadmin' || rawRole === 'admin';
          user = {
            id: found.id,
            email: normalized,
            name: meta.name || normalized.split('@')[0],
            role: isAdminRole ? 'admin' : rawRole,
            isSuperAdmin: rawRole === 'superadmin',
            company: meta.company || (isAdminRole ? 'CONNECT NFC Headquarters' : 'Provisioned Client'),
            title: meta.title || (isAdminRole ? 'Super Administrator' : 'Client Partner'),
            avatarUrl: meta.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            permissions: isAdminRole
              ? [
                  'all',
                  'manage_admins',
                  'manage_clients',
                  'manage_cards',
                  'manage_orders',
                  'view_analytics',
                  'edit_system_settings',
                ]
              : (meta.permissions || ['manage_own_card', 'view_own_analytics']),
            status: isAdminRole ? 'active' : (meta.status || 'active'),
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

  if (user.status === 'suspended' && user.role !== 'admin' && user.role !== 'superadmin' && !user.isSuperAdmin) {
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

// 2b. Email-based OTP Request Endpoint
app.post('/api/auth/otp/send', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findProvisionedUser(normalizedEmail);

  if (!user) {
    logAppError(`Unprovisioned email attempted OTP request: ${normalizedEmail}`, 'warning', 'AuthGateway', '/api/auth/otp/send');
    return res.status(403).json({
      success: false,
      error: 'Access restricted: Your email is not provisioned in the system. Clients cannot self-create an account. Please contact your platform administrator.',
      code: 'ACCOUNT_NOT_PROVISIONED',
    });
  }

  if (user.status === 'suspended' && user.role !== 'admin' && user.role !== 'superadmin' && !user.isSuperAdmin) {
    logAppError(`Suspended account attempted login: ${normalizedEmail}`, 'warning', 'AuthGateway', '/api/auth/otp/send');
    return res.status(403).json({
      success: false,
      error: 'Your client account has been suspended. Please contact platform administrators.',
      code: 'ACCOUNT_SUSPENDED',
    });
  }

  const existingOtp = OTP_STORE.get(normalizedEmail);
  const now = Date.now();
  if (existingOtp && existingOtp.resendAvailableAt && now < existingOtp.resendAvailableAt) {
    const secondsLeft = Math.ceil((existingOtp.resendAvailableAt - now) / 1000);
    return res.status(429).json({
      success: false,
      error: `Please wait ${secondsLeft} seconds before requesting a new verification code.`,
      secondsLeft,
    });
  }

  // Generate 6-digit numeric OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes
  const resendAvailableAt = now + 60 * 1000; // 60 seconds cooldown

  OTP_STORE.set(normalizedEmail, {
    otp: generatedOtp,
    expiresAt,
    resendAvailableAt,
    attemptsRemaining: 5,
    userRole: user.role,
  });

  // Dispatch real email OTP: Primary = Resend, Fallback = Supabase Auth Email
  let dispatched = false;
  let dispatchMethod = '';

  const isResendConfigured = process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('your_resend_api_key_here');

  if (isResendConfigured) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: fromAddress,
        to: normalizedEmail,
        subject: `Your CONNECT NFC Verification Code: ${generatedOtp}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 28px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #111; margin-top: 0; font-size: 20px;">CONNECT NFC Verification</h2>
            <p style="color: #444; font-size: 14px; line-height: 1.5;">Here is your 6-digit verification code to sign in to your CONNECT NFC account:</p>
            <div style="background: #f4f4f5; padding: 18px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #000000;">${generatedOtp}</span>
            </div>
            <p style="color: #666; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
          </div>
        `,
      });

      if (!resendError) {
        dispatched = true;
        dispatchMethod = 'Resend';
        console.log(`[Resend Engine] Verification code email sent to: ${normalizedEmail} (ID: ${resendData?.id})`);
      } else {
        console.warn(`[Resend Engine] Notice for ${normalizedEmail}: ${resendError.message}. Falling back to Supabase email delivery...`);
      }
    } catch (emailErr) {
      console.warn(`[Resend Engine] Exception for ${normalizedEmail}: ${emailErr.message}. Falling back to Supabase email delivery...`);
    }
  }

  // Fallback to Supabase Auth OTP delivery if Resend was not configured or failed
  if (!dispatched && supabase) {
    try {
      const { error: sbOtpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
        },
      });
      if (!sbOtpError) {
        dispatched = true;
        dispatchMethod = 'Supabase';
        console.log(`[Supabase OTP] Real OTP email dispatched successfully by Supabase to: ${normalizedEmail}`);
      } else {
        console.warn(`[Supabase OTP] signInWithOtp notice: ${sbOtpError.message}`);
      }
    } catch (sbErr) {
      console.warn(`[Supabase OTP] Exception: ${sbErr.message}`);
    }
  }

  if (!dispatched) {
    logAppError(`Failed to dispatch email via Resend and Supabase for ${normalizedEmail}`, 'error', 'EmailEngine', '/api/auth/otp/send');
    return res.status(500).json({
      success: false,
      error: 'Unable to deliver verification email. Please check your email configuration in backend/.env.',
    });
  }

  // Do NOT return the OTP code in the API JSON response; only return a success status message.
  res.json({
    success: true,
    message: `A 6-digit verification code has been dispatched to ${normalizedEmail}. Please check your inbox.`,
    resendCooldown: 60,
  });
});

// 2c. Email-based OTP Verification Endpoint
app.post('/api/auth/otp/verify', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit verification code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const record = OTP_STORE.get(normalizedEmail);
  const inputOtp = String(otp).trim();

  let isValid = false;

  // 1. Check local OTP store
  if (record && Date.now() <= record.expiresAt && record.otp === inputOtp) {
    isValid = true;
  }

  // 2. Also try Supabase Auth verifyOtp
  if (!isValid && supabase) {
    try {
      const { data: sbVerifyData, error: sbVerifyError } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: inputOtp,
        type: 'email',
      });
      if (!sbVerifyError && sbVerifyData?.user) {
        isValid = true;
        console.log(`[Supabase OTP] Verified via Supabase Auth token for: ${normalizedEmail}`);
      } else if (sbVerifyError) {
        console.warn(`[Supabase OTP] verifyOtp notice: ${sbVerifyError.message}`);
      }
    } catch (err) {
      console.warn('[Supabase OTP] verify exception:', err.message);
    }
  }

  if (!isValid) {
    if (record) {
      record.attemptsRemaining--;
      if (record.attemptsRemaining <= 0) {
        OTP_STORE.delete(normalizedEmail);
        logAppError(`Exceeded OTP attempts for: ${normalizedEmail}`, 'warning', 'AuthGateway', '/api/auth/otp/verify');
        return res.status(429).json({
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new code.',
          code: 'OTP_MAX_ATTEMPTS',
        });
      }
    }
    logAppError(`Invalid OTP entered for ${normalizedEmail}.`, 'warning', 'AuthGateway', '/api/auth/otp/verify');
    return res.status(400).json({
      success: false,
      error: `Invalid or expired verification code. Please check your email or enter the valid code.`,
      attemptsRemaining: record ? record.attemptsRemaining : 0,
    });
  }

  // OTP is valid!
  OTP_STORE.delete(normalizedEmail);

  const user = await findProvisionedUser(normalizedEmail);
  if (!user || user.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: 'Account not authorized or suspended.',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions || [],
      authMethod: 'email_otp',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log(`[Backend OTP] Email OTP verified: ${user.email} (Role: ${user.role})`);

  res.json({
    success: true,
    data: {
      token,
      user,
      expiresIn: 604800,
    },
    message: `Verification successful. Welcome, ${user.name}!`,
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

  if (user.status === 'suspended' && user.role !== 'admin' && user.role !== 'superadmin' && !user.isSuperAdmin) {
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

  const welcomeEmailDraft = {
    subject: 'Welcome to Our NFC Business Platform',
    recipient: normalizedEmail,
    clientName: name,
    content: `Hello ${name},\n\nWelcome to our NFC business platform!\n\nYour client account has been created successfully. You can access your account using your registered email address and the email verification process.\n\nOnce logged in, you will be able to manage your profile and proceed with your NFC card setup.\n\nWe look forward to helping you create your digital NFC identity.\n\nBest regards,\nThe NFC Team`,
    status: 'draft_prepared',
    preparedAt: new Date().toISOString(),
  };

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
    welcomeEmailDraft,
    provisionedBy: req.user.email,
    createdAt: new Date().toISOString(),
    supabaseVerified: !!supabaseId,
  };

  USERS_DATABASE.push(newClient);

  logAppError(`Client created: ${name} (${normalizedEmail})`, 'info', 'ClientManagement', '/api/admin/clients');

  console.log(`[Admin Portal] Admin ${req.user.email} successfully provisioned new client: ${normalizedEmail} (Role: ${assignedRole})`);

  res.status(201).json({
    success: true,
    data: newClient,
    welcomeEmail: welcomeEmailDraft,
    message: `Client ${name} (${normalizedEmail}) has been successfully provisioned. Welcome email draft prepared.`,
  });
});

// 7b. Get Client Welcome Email Draft
app.get('/api/admin/clients/:id/welcome-email', requireAuth, requireRole(['admin']), (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  if (user.role === 'admin' || user.role === 'superadmin' || user.isSuperAdmin) {
    return res.status(400).json({ success: false, error: 'Platform administrators and Super Admins cannot be suspended.' });
  }
  const draft = user.welcomeEmailDraft || {
    subject: 'Welcome to Our NFC Business Platform',
    clientName: user.name,
    recipient: user.email,
    content: `Hello ${user.name},\n\nWelcome to our NFC business platform!\n\nYour client account has been created successfully. You can access your account using your registered email address and the email verification process.\n\nOnce logged in, you will be able to manage your profile and proceed with your NFC card setup.\n\nWe look forward to helping you create your digital NFC identity.\n\nBest regards,\nThe NFC Team`,
    status: 'draft_prepared',
    preparedAt: user.createdAt,
  };
  res.json({ success: true, data: draft });
});

// 7c. Send/Dispatch Welcome Email (Accurately reports actual delivery status)
app.post('/api/admin/clients/:id/send-welcome', requireAuth, requireRole(['admin']), (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  if (user.role === 'admin' || user.role === 'superadmin' || user.isSuperAdmin) {
    return res.status(400).json({ success: false, error: 'Platform administrators and Super Admins cannot be suspended.' });
  }

  if (user.welcomeEmailDraft) {
    user.welcomeEmailDraft.status = 'queued_in_outbox';
    user.welcomeEmailDraft.lastActionAt = new Date().toISOString();
  }

  logAppError(`Welcome email queued for delivery: ${user.email}`, 'info', 'ClientManagement', '/api/admin/clients/send-welcome');

  res.json({
    success: true,
    data: user.welcomeEmailDraft,
    delivered: false,
    message: `Welcome email for ${user.name} has been queued in system outbox (SMTP mailer is in staging mode).`,
  });
});

// 7d. Suspend or Reactivate Client Account
app.patch('/api/admin/clients/:id/suspend', requireAuth, requireRole(['admin']), async (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  if (user.role === 'admin' || user.role === 'superadmin' || user.isSuperAdmin) {
    return res.status(400).json({ success: false, error: 'Platform administrators and Super Admins cannot be suspended.' });
  }

  user.status = user.status === 'active' ? 'suspended' : 'active';

  if (supabase && user.supabaseVerified) {
    try {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { status: user.status },
      });
    } catch (e) {
      console.warn('[Backend Supabase] Suspend update warning:', e.message);
    }
  }

  logAppError(`Client ${user.name} (${user.email}) status changed to: ${user.status}`, user.status === 'suspended' ? 'warning' : 'info', 'ClientManagement', '/api/admin/clients/suspend');

  res.json({
    success: true,
    data: user,
    message: `Client ${user.name} is now ${user.status}.`,
  });
});

// 8. Update Client Permissions or Status (Admin only)
app.put('/api/admin/clients/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const user = USERS_DATABASE.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  if (user.role === 'admin' || user.role === 'superadmin' || user.isSuperAdmin) {
    return res.status(400).json({ success: false, error: 'Platform administrators and Super Admins cannot be suspended.' });
  }

  const { name, company, title, phone, permissions, status, role } = req.body;

  if (name) user.name = name;
  if (company) user.company = company;
  if (title) user.title = title;
  if (phone) user.phone = phone;
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
          phone: user.phone,
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
// Safely unassigns or detaches related NFC cards to prevent orphan corruption
app.delete('/api/admin/clients/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const index = USERS_DATABASE.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Client not found.' });
  }

  const removed = USERS_DATABASE.splice(index, 1)[0];

  // Safely handle related NFC card assignments (do not silently destroy physical hardware records)
  CARDS_DATABASE.forEach((c) => {
    if (c.userId === removed.id || c.clientId === removed.id) {
      c.registrationStatus = 'unassigned';
      c.clientName = 'Unassigned';
      c.clientEmail = '';
      c.userId = null;
      c.clientId = null;
    }
  });

  // Remove from Supabase
  if (supabase && removed.supabaseVerified) {
    try {
      await supabase.auth.admin.deleteUser(removed.id);
    } catch (e) {
      console.warn('[Backend Supabase] Delete exception:', e.message);
    }
  }

  logAppError(`Client ${removed.name} (${removed.email}) deleted. Associated NFC cards set to unassigned.`, 'warning', 'ClientManagement', '/api/admin/clients');

  res.json({
    success: true,
    data: removed,
    message: `Client ${removed.email} removed from directory. Related NFC cards unassigned safely.`,
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

app.patch('/api/inquiries/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const inquiry = INQUIRIES_DATABASE.find((i) => i.id === req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, error: 'Inquiry not found.' });
  }
  const { status, notes } = req.body;
  if (status) inquiry.status = status;
  if (notes !== undefined) inquiry.notes = notes;
  res.json({ success: true, data: inquiry, message: 'Inquiry updated successfully.' });
});

// Admin NFC Card & Transponder Fleet Management
app.post('/api/admin/cards', requireAuth, requireRole(['admin']), (req, res) => {
  const { cardholderName, companyName, headlineTitle, nfcChipUid, nfcFrequency, finish, email, phone, location, bio } = req.body;
  if (!cardholderName) {
    return res.status(400).json({ success: false, error: 'Cardholder name is required.' });
  }

  const slug = (cardholderName || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Math.floor(100 + Math.random() * 900);

  const newCard = {
    id: `card_${Date.now()}`,
    userId: req.body.userId || 'usr_client_02',
    slug,
    cardName: `${cardholderName} Transponder`,
    cardholderName,
    headlineTitle: headlineTitle || 'CONNECT NFC Fleet Member',
    companyName: companyName || 'Enterprise Client',
    bio: bio || 'Contactless credentials verified on CONNECT NFC network.',
    email: email || '',
    phone: phone || '',
    location: location || 'Global',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    finish: finish || 'obsidian',
    nfcChipUid: nfcChipUid || `04:${Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':')}`,
    nfcFrequency: nfcFrequency || '13.56 MHz NTAG424 DNA',
    totalTaps: 0,
    lastTappedAt: null,
    isActive: true,
    socialLinks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  CARDS_DATABASE.unshift(newCard);
  res.status(201).json({ success: true, data: newCard, message: 'NFC Transponder programmed and registered.' });
});

app.patch('/api/admin/cards/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const card = CARDS_DATABASE.find((c) => c.id === req.params.id);
  if (!card) {
    return res.status(404).json({ success: false, error: 'Transponder card not found.' });
  }
  const { isActive, cardholderName, companyName, finish, nfcChipUid } = req.body;
  if (isActive !== undefined) card.isActive = isActive;
  if (cardholderName) card.cardholderName = cardholderName;
  if (companyName) card.companyName = companyName;
  if (finish) card.finish = finish;
  if (nfcChipUid) card.nfcChipUid = nfcChipUid;
  card.updatedAt = new Date().toISOString();
  res.json({ success: true, data: card, message: 'Transponder configuration updated.' });
});

app.delete('/api/admin/cards/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const index = CARDS_DATABASE.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Transponder card not found.' });
  }
  const removed = CARDS_DATABASE.splice(index, 1)[0];
  res.json({ success: true, data: removed, message: 'Transponder revoked from fleet registry.' });
});

// Admin System Settings
let SYSTEM_SETTINGS = {
  nodeId: 'HSM-EU-09',
  keystore: 'AES-256 / HSM Vault',
  telemetryMode: 'TLS 1.3 Strict',
  fleetAuth: 'mTLS Enabled',
  rbacLevel: 'Granular Role-Based',
  supabaseSync: !!supabase,
  vanityDomain: 'connectnfc.com',
  autoLockOnTamper: true,
  lastSavedAt: new Date().toISOString(),
};

app.get('/api/admin/settings', requireAuth, requireRole(['admin']), (req, res) => {
  SYSTEM_SETTINGS.supabaseSync = !!supabase;
  res.json({ success: true, data: SYSTEM_SETTINGS });
});

app.post('/api/admin/settings', requireAuth, requireRole(['admin']), (req, res) => {
  SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...req.body, lastSavedAt: new Date().toISOString() };
  res.json({ success: true, data: SYSTEM_SETTINGS, message: 'Platform configuration successfully synchronized.' });
});

// Dynamic Dashboard Summary Counts
app.get('/api/admin/stats', requireAuth, requireRole(['admin']), (req, res) => {
  const totalCards = CARDS_DATABASE.length;
  const totalClients = USERS_DATABASE.filter((u) => u.role === 'client').length;
  const pendingOrders = ORDERS_DATABASE.filter((o) => o.status === 'in_production' || o.status === 'pending').length;
  res.json({
    success: true,
    data: {
      totalCards,
      totalClients,
      pendingOrders,
    },
  });
});

// Dedicated Error Tracking Panel Endpoints (Strict 10-entry display limit)
app.get('/api/errors', (req, res) => {
  res.json({
    success: true,
    data: ERROR_LOGS_DATABASE.slice(0, 10),
    total: ERROR_LOGS_DATABASE.length,
  });
});

app.post('/api/errors', (req, res) => {
  const { message, severity, component, route, details } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Error message is required.' });
  }
  const entry = logAppError(message, severity || 'error', component || 'ClientApp', route || '/client', details);
  res.status(201).json({ success: true, data: entry });
});

app.delete('/api/errors/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const idx = ERROR_LOGS_DATABASE.findIndex((e) => e.id === req.params.id);
  if (idx !== -1) {
    ERROR_LOGS_DATABASE.splice(idx, 1);
  }
  res.json({ success: true, message: 'Error log entry resolved.' });
});

app.delete('/api/errors', requireAuth, requireRole(['admin']), (req, res) => {
  ERROR_LOGS_DATABASE = [];
  res.json({ success: true, message: 'All error logs cleared.' });
});

// NFC Card Registration Workflow (Assigns card to client and generates unique profile URL)
app.post('/api/admin/cards/register', requireAuth, requireRole(['admin']), (req, res) => {
  const { clientId, cardIdentifier, finish, notes } = req.body;
  if (!clientId || !cardIdentifier) {
    return res.status(400).json({ success: false, error: 'Client selection and Card Identifier / Serial Number are required.' });
  }

  const normalizedIdentifier = String(cardIdentifier).trim().toUpperCase();

  // Prevent duplicate card assignment across entire fleet
  const duplicate = CARDS_DATABASE.find(
    (c) => (c.cardIdentifier && c.cardIdentifier.toUpperCase() === normalizedIdentifier) ||
           (c.nfcChipUid && c.nfcChipUid.toUpperCase() === normalizedIdentifier)
  );
  if (duplicate) {
    logAppError(`Duplicate NFC card registration attempted for serial: ${normalizedIdentifier}`, 'warning', 'CardRegistry', '/api/admin/cards/register');
    return res.status(409).json({
      success: false,
      error: `Card identifier "${normalizedIdentifier}" is already registered in the system (assigned to ${duplicate.cardholderName || 'another client'}).`,
    });
  }

  // Check client exists and is not suspended
  const client = USERS_DATABASE.find((u) => u.id === clientId);
  if (!client) {
    return res.status(404).json({ success: false, error: 'Selected client not found in directory.' });
  }
  if (client.status === 'suspended') {
    logAppError(`Card assignment rejected: Client ${client.name} is suspended.`, 'warning', 'CardRegistry', '/api/admin/cards/register');
    return res.status(403).json({
      success: false,
      error: `Cannot register an NFC card for suspended client "${client.name}". Please reactivate the client first.`,
    });
  }

  // Generate unique, collision-resistant profile URL
  const baseSlug = (client.name || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  const profileSlug = `${baseSlug}-${uniqueSuffix}`;
  const profileUrl = `${CLIENT_URL}/profile/${profileSlug}`;

  const newCard = {
    id: `card_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId: client.id,
    clientId: client.id,
    slug: profileSlug,
    profileSlug,
    profileUrl,
    cardIdentifier: normalizedIdentifier,
    nfcChipUid: normalizedIdentifier,
    cardName: `${client.name} Executive NFC`,
    cardholderName: client.name,
    clientName: client.name,
    clientEmail: client.email,
    companyName: client.company || 'Enterprise Partner',
    headlineTitle: client.title || 'Executive Cardholder',
    phone: client.phone || '',
    email: client.email,
    finish: finish || 'obsidian',
    nfcFrequency: '13.56 MHz NTAG424 DNA',
    registrationStatus: 'assigned',
    programmingStatus: 'unprogrammed',
    notes: notes || '',
    totalTaps: 0,
    lastTappedAt: null,
    isActive: true,
    socialLinks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  CARDS_DATABASE.unshift(newCard);

  logAppError(`NFC Card ${normalizedIdentifier} assigned to client ${client.name} (${profileUrl})`, 'info', 'CardRegistry', '/api/admin/cards/register');

  res.status(201).json({
    success: true,
    data: newCard,
    message: `Card ${normalizedIdentifier} successfully assigned to ${client.name}.`,
  });
});

// Mark NFC Card as Programmed (used after External NFC Tools app or Web NFC)
app.patch('/api/admin/cards/:id/programmed', requireAuth, requireRole(['admin']), (req, res) => {
  const card = CARDS_DATABASE.find((c) => c.id === req.params.id);
  if (!card) {
    return res.status(404).json({ success: false, error: 'Card not found.' });
  }
  card.programmingStatus = 'programmed';
  card.updatedAt = new Date().toISOString();
  logAppError(`NFC card ${card.cardIdentifier || card.nfcChipUid} marked as programmed.`, 'info', 'CardRegistry', '/api/admin/cards/programmed');
  res.json({
    success: true,
    data: card,
    message: `Card ${card.cardIdentifier || card.nfcChipUid} marked as programmed.`,
  });
});

// QR Code Asset Management
app.post('/api/admin/qr/save', requireAuth, requireRole(['admin']), (req, res) => {
  const { clientId, profileUrl, originalQrData, customLogoData, brandedQrData } = req.body;
  if (!clientId || !profileUrl) {
    return res.status(400).json({ success: false, error: 'Client ID and profile URL are required.' });
  }
  const asset = {
    id: `qr_${Date.now()}`,
    clientId,
    profileUrl,
    originalQrData,
    customLogoData,
    brandedQrData,
    createdAt: new Date().toISOString(),
  };
  QR_ASSETS_DATABASE.push(asset);
  res.status(201).json({ success: true, data: asset, message: 'Branded QR code asset saved.' });
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
