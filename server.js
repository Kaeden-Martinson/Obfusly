require('dotenv').config();

const runtimeConfig = require('./Settings/config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Stripe = require('stripe');
const mongoManager = require('./Database/mongodb');
const db = require('./Database/users.mongo');

// ── Configuration ────────────────────────────────────────────────────────────
// Set these via environment variables in production.
const JWT_SECRET    = process.env.JWT_SECRET    || 'change-me-in-production-' + crypto.randomBytes(16).toString('hex');
const STRIPE_SECRET = process.env.STRIPE_SECRET || '';          // sk_live_... or sk_test_...
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''; // whsec_...
const DOMAIN        = process.env.DOMAIN        || 'http://localhost:3000';

const stripe = STRIPE_SECRET ? Stripe(STRIPE_SECRET) : null;

// Plan → Stripe Price ID mapping.  Fill in your own Price IDs from the Stripe Dashboard.
const STRIPE_PRICES = {
    professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
    enterprise:   process.env.STRIPE_PRICE_ENTERPRISE   || 'price_enterprise_placeholder',
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
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name)
            return res.status(400).json({ error: 'Name, email and password are required.' });

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: 'Invalid email address.' });

        if (password.length < 8)
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });

        const existingUser = await db.findByEmail(email);
        if (existingUser)
            return res.status(409).json({ error: 'An account with that email already exists.' });

        const hash = await bcrypt.hash(password, 12);
        const user = await db.create({
            id: crypto.randomUUID(),
            name: name.trim().slice(0, 80),
            email: email.toLowerCase().trim(),
            passwordHash: hash,
            plan: 'free',
            createdAt: new Date(),
        });

        const token = signToken(user.id);
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        const user = await db.findByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        const ok = await bcrypt.compare(password, user.passHash);
        if (!ok)  return res.status(401).json({ error: 'Invalid email or password.' });

        const token = signToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        // Get daily obfuscation usage
        const usage = await db.checkObfuscationLimit(req.user.sub);
        
        res.json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            plan: user.plan, 
            createdAt: user.cAt,
            subscriptionStatus: user.subStatus || null,
            nextBillingDate: user.nextBillDt || null,
            planExpiryDate: user.planExpDt || null,
            renewalAmount: user.renewalAmt || null,
            usage: {
                used: usage.used,
                limit: usage.limit,
                remaining: usage.remaining,
                plan: usage.plan,
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// ── Stripe payment routes ─────────────────────────────────────────────────────
app.post('/api/payment/create-session', requireAuth, async (req, res) => {
    try {
        if (!stripe)
            return res.status(503).json({ error: 'Payment system is not configured yet.' });

        const { plan } = req.body;
        const priceId  = STRIPE_PRICES[plan];
        if (!priceId || priceId.includes('placeholder'))
            return res.status(400).json({ error: 'Unknown plan or Stripe prices not configured.' });

        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });

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
    } catch (error) {
        console.error('Payment session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session.' });
    }
});

// Stripe webhook — verifies signature then upgrades user's plan.
app.post('/api/webhook/stripe', async (req, res) => {
    try {
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
            if (userId && plan) await db.updatePlan(userId, plan);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Cancel subscription endpoint
app.post('/api/subscription/cancel', requireAuth, async (req, res) => {
    try {
        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        if (!user.plan || user.plan === 'free') {
            return res.status(400).json({ error: 'User is not on a paid plan.' });
        }

        // Cancel the subscription (keep paid plan active until planExpiryDate)
        const updated = await db.cancelSubscription(req.user.sub);
        
        if (!updated) {
            return res.status(500).json({ error: 'Failed to cancel subscription.' });
        }
    
        console.log(`[SUBSCRIPTION] User ${req.user.sub} cancelled ${user.plan} plan. Active until ${updated.planExpDt}`);
        
        res.json({ 
            success: true, 
            message: 'Subscription cancelled. Your plan remains active until ' + new Date(updated.planExpDt).toLocaleDateString(),
            user: updated
        });
    } catch (error) {
        console.error('Subscription cancel error:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
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

app.post('/obfuscate', obfuscateLimiter, (req, res) => {
    handleObfuscation(req, res)
        .catch(err => {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal error' });
            }
        });
});

// Approved example codes for unauthenticated users
const APPROVED_EXAMPLES = [
    // Example 1: Fibonacci
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log('F(' + i + ') = ' + fibonacci(i));
}`,
    // Example 2: String Manipulation
    `function reverseString(str) {
  return str.split('').reverse().join('');
}

const message = 'Hello, World!';
console.log('Original: ' + message);
console.log('Reversed: ' + reverseString(message));`,
    // Example 3: Object Processing
    `const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

users.forEach(function(user) {
  console.log(user.name + ' is ' + user.age + ' years old');
});`,
    // Example 4: Array Operations
    `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

const numbers = [1, 2, 3, 4, 5];
console.log('Sum: ' + sumArray(numbers));
console.log('Average: ' + (sumArray(numbers) / numbers.length));`,
    // Example 5: Prime Numbers
    `function isPrime(num) {
  if (num <= 1) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

for (let i = 2; i <= 20; i++) {
  if (isPrime(i)) console.log(i + ' is prime');
}`
];

const DEFAULT_CONFIG = JSON.parse(JSON.stringify(runtimeConfig));

const WorkerPool = require('./Workers/worker');

// Initialize worker pool
const workerPool = new WorkerPool(10);

async function obfuscateWithWorker(code, config) {
    return workerPool.execute(code, config);
}

async function handleObfuscation(req, res) {
    // Reset config to defaults for each request to avoid accumulation across requests
    restoreDefaults();
    
    const { code, config: incomingConfig } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!code) {
        res.status(400).json({ error: 'No code provided' });
        return;
    }
    
    // Verify token and extract user ID
    let userId = null;
    let isAuthenticated = false;
    let userPlan = 'free';
    
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.sub;
            isAuthenticated = true;
            
            // Get user plan for response
            const user = await db.findById(userId);
            if (user) {
                userPlan = user.plan || 'free';
            }
        } catch (err) {
            isAuthenticated = false;
        }
    }
    
    // Check if code is from approved examples
    const isApprovedExample = APPROVED_EXAMPLES.some(example => 
        example.trim() === code.trim()
    );
    
    // For authenticated users, check server-side limits
    if (isAuthenticated && userId) {
        const limitCheck = await db.checkObfuscationLimit(userId);
        
        // If at limit and trying to obfuscate custom code, deny
        // if (!limitCheck.canObfuscate && !isApprovedExample) {
        //     res.status(429).json({ 
        //         error: 'Daily limit reached. You can still obfuscate Example code.',
        //         remaining: limitCheck.remaining,
        //         limit: limitCheck.limit,
        //         plan: limitCheck.plan
        //     });
        //     return;
        // }
    } else if (!isAuthenticated) {
        // Unauthenticated users can ONLY use approved examples
        if (!isApprovedExample) {
            res.status(403).json({ 
                error: 'Authentication required to obfuscate custom code. Please sign up or log in.' 
            });
            return;
        }
    }
    
    try {
        console.log("New Req");
        if (incomingConfig && typeof incomingConfig === 'object') deepMerge(runtimeConfig, incomingConfig);
        
        console.log(runtimeConfig)

        // Use worker for both obfuscation steps
        const workerResult = await obfuscateWithWorker(code, runtimeConfig);
        const objectObfuscatedCode = workerResult.objectObfuscatedCode;
        
        // Log obfuscation and increment counter for authenticated users
        if (isAuthenticated && userId) {
            const inputSize = Buffer.byteLength(code, 'utf8');
            const outputSize = Buffer.byteLength(objectObfuscatedCode, 'utf8');
            
            // Log to history
            await db.logObfuscation(userId, {
                inputSize,
                outputSize,
                technique: 'standard',
                duration: 0,
                success: true,
            });
            
            // Increment daily counter
            const updated = await db.incrementObfuscationCount(userId);
            
            // Include usage info in response
            res.json({ 
                obfuscatedCode: objectObfuscatedCode,
                usage: updated ? {
                    used: updated.used,
                    limit: updated.limit,
                    remaining: updated.remaining,
                    plan: updated.plan,
                } : null
            });
        } else {
            res.json({ obfuscatedCode: objectObfuscatedCode });
        }
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

// Initialize MongoDB and start server
async function startServer() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('✗ MONGO_URI not set in .env file');
            process.exit(1);
        }

        // await mongoManager.initDatabase();
        // console.log('✓ MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    workerPool.terminate();
    await mongoManager.disconnect();
    process.exit(0);
});
