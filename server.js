const runtimeConfig = require('./Settings/config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Stripe = require('stripe');
const __obfuscator_1 = require('./Main/first_obfuscator');
const __obfuscator_2 = require('./Main/property_obfuscator');
const db = require('./Database/users');

// ── Configuration ────────────────────────────────────────────────────────────
// Set these via environment variables in production.
const JWT_SECRET    = process.env.JWT_SECRET    || 'change-me-in-production-' + crypto.randomBytes(16).toString('hex');
const STRIPE_SECRET = process.env.STRIPE_SECRET || '';          // sk_live_... or sk_test_...
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''; // whsec_...
const DOMAIN        = process.env.DOMAIN        || 'http://localhost:3000';

const stripe = STRIPE_SECRET ? Stripe(STRIPE_SECRET) : null;

// Plan → Stripe Price ID mapping.  Fill in your own Price IDs from the Stripe Dashboard.
const STRIPE_PRICES = {
    starter:      process.env.STRIPE_PRICE_STARTER      || 'price_starter_placeholder',
    professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
};

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhooks need the raw body, so we parse it before bodyParser.json
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'Frontend')));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,           // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests — please slow down.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts — please wait 15 minutes.' },
});

const obfuscateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Obfuscation rate limit exceeded. Please wait a moment.' },
});

app.use(globalLimiter);

// ── JWT helper ────────────────────────────────────────────────────────────────
function signToken(userId) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', authLimiter, async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name)
        return res.status(400).json({ error: 'Name, email and password are required.' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ error: 'Invalid email address.' });

    if (password.length < 8)
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    if (db.findByEmail(email))
        return res.status(409).json({ error: 'An account with that email already exists.' });

    const hash = await bcrypt.hash(password, 12);
    const user = db.create({
        id: crypto.randomUUID(),
        name: name.trim().slice(0, 80),
        email: email.toLowerCase().trim(),
        passwordHash: hash,
        plan: 'free',
        createdAt: new Date().toISOString(),
    });

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email and password are required.' });

    const user = db.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)  return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
    const user = db.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ id: user.id, name: user.name, email: user.email, plan: user.plan, createdAt: user.createdAt });
});

// ── Stripe payment routes ─────────────────────────────────────────────────────
app.post('/api/payment/create-session', requireAuth, async (req, res) => {
    if (!stripe)
        return res.status(503).json({ error: 'Payment system is not configured yet.' });

    const { plan } = req.body;
    const priceId  = STRIPE_PRICES[plan];
    if (!priceId || priceId.includes('placeholder'))
        return res.status(400).json({ error: 'Unknown plan or Stripe prices not configured.' });

    const user = db.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: user.email,
            metadata: { userId: user.id, plan },
            success_url: `${DOMAIN}/?checkout=success&plan=${plan}`,
            cancel_url:  `${DOMAIN}/pricing`,
        });
        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session.' });
    }
});

// Stripe webhook — verifies signature then upgrades user's plan.
app.post('/api/webhook/stripe', (req, res) => {
    if (!stripe || !STRIPE_WEBHOOK_SECRET)
        return res.status(200).send('OK'); // silently ack if not configured

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature error:', err.message);
        return res.status(400).send('Webhook Error');
    }

    if (event.type === 'checkout.session.completed') {
        const { userId, plan } = event.data.object.metadata || {};
        if (userId && plan) db.updatePlan(userId, plan);
    }

    res.json({ received: true });
});

// ── Utility helpers ───────────────────────────────────────────────────────────
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
        ) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else target[key] = source[key];
    };
};

function restoreDefaults() {
    for (const key of Object.keys(runtimeConfig)) if (!(key in DEFAULT_CONFIG)) delete runtimeConfig[key];
    deepMerge(runtimeConfig, DEFAULT_CONFIG);
};

let queue = Promise.resolve();
app.post('/obfuscate', obfuscateLimiter, (req, res) => {
    queue = queue.then(() => handleObfuscation(req, res))
        .catch(err => {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal error' });
            }
        });
});

const DEFAULT_CONFIG = globalThis.structuredClone ? structuredClone(runtimeConfig) : JSON.parse(JSON.stringify(runtimeConfig));

async function handleObfuscation(req, res) {
    const { code, config: incomingConfig } = req.body;
    if (!code) {
        res.status(400).json({ error: 'No code provided' });
        return;
    }
    try {
        if (incomingConfig && typeof incomingConfig === 'object') deepMerge(runtimeConfig, incomingConfig);
        const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
        const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties( obfuscatedCode, windowName, previousDeclarationMapping);
        res.json({ obfuscatedCode: objectObfuscatedCode });
    } finally {
        restoreDefaults();
    }
}

// Code execution endpoint
app.post('/execute', (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ error: 'No code provided', success: false });
        return;
    }

    const output = [];
    const errors = [];
    
    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
        output.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    console.error = (...args) => {
        errors.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    console.warn = (...args) => {
        output.push('[WARNING] ' + args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    try {
        // Execute code in a controlled environment
        const result = (new Function(code))();
        
        // If function returns something, log it
        if (result !== undefined) {
            output.push('Return value: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
        }

        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        res.json({
            success: errors.length === 0,
            output: output.length > 0 ? output.join('\n') : '(no output)',
            error: errors.length > 0 ? errors.join('\n') : ''
        });
    } catch (err) {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        res.json({
            success: false,
            output: output.join('\n'),
            error: err.message || String(err)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
