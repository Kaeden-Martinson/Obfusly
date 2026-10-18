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
const { VerificationService, PasswordResetService, EmailTemplates } = require('./Email');
const StripeService = require('./Payments/stripe-service');
const stripeConfig = require('./Payments/stripe-config');

// ── Configuration ────────────────────────────────────────────────────────────
// Set these via environment variables in production.
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-' + crypto.randomBytes(16).toString('hex');       // sk_live_... or sk_test_...
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''; // whsec_...
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

const stripe = process.env.STRIPE_RESTRICTED_KEY ? Stripe(process.env.STRIPE_RESTRICTED_KEY) : null;
const stripeService = stripe ? new StripeService(stripe) : null;

// Plan → Stripe Price ID mapping (from stripe-config.js)
const STRIPE_PRICES = stripeConfig.PLANS;

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhooks need the raw body, so we parse it before bodyParser.json
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,           // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests — please slow down.' },
    skip: (req) => req.path === '/api/webhook/stripe',
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
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Obfuscation rate limit exceeded. Please wait a moment.' },
});

const paymentLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many payment requests. Please wait before trying again.' },
});

const billingLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many billing requests. Please wait.' },
});

const accountLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many account requests. Please wait.' },
});

app.use(globalLimiter);

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// ── JWT helper ────────────────────────────────────────────────────────────────
function signToken(userId) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
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

        // Check for verified user first
        const existingUser = await db.findByEmail(email);
        if (existingUser)
            return res.status(409).json({ error: 'This email already exists.' });

        // Check for pending signup
        const existingPending = await db.getPendingSignup(email);
        if (existingPending) {
            // If pending signup has expired (> 24 hours), allow re-signup
            const pendingAgeMs = Date.now() - existingPending.createdAt.getTime();
            const PENDING_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
            
            if (pendingAgeMs > PENDING_TIMEOUT_MS) {
                // Cleanup expired pending signup
                await db.deletePendingSignup(email);
                try {
                    const verificationCodes = await db.getVerificationCodesCollection();
                    await verificationCodes.deleteOne({ email: email.toLowerCase() });
                } catch (e) {
                    console.warn('Failed to clean up verification codes:', e.message);
                }
                console.log(`[CLEANUP] Deleted expired pending signup for ${email}`);
            } else {
                // Still pending and not expired - offer login option
                return res.status(409).json({ 
                    error: 'This email already exists. Please login to proceed.',
                    pendingEmail: email,
                    hasPendingSignup: true,
                    canCancel: true
                });
            }
        }

        // Hash password
        const hash = await bcrypt.hash(password, 12);

        // Store pending signup (NOT creating user yet)
        await db.createPendingSignup(email, hash, name);

        // Send verification email
        const emailResult = await VerificationService.sendVerificationEmail(email, name);

        if (!emailResult.success) {
            // Email failed but signup stored - user can resend
            console.error('Failed to send verification email:', emailResult.error);
        }

        res.status(200).json({
            success: true,
            message: 'Account created. Check your email for verification code.',
            email: email,
            expiresIn: emailResult.expiresIn
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login to your account
app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        // Check if verified user exists
        const user = await db.findByEmail(email);
        if (user) {
            const ok = await bcrypt.compare(password, user.passHash);
            if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

            const token = signToken(user.id);
            return res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
        }

        // Check if pending signup exists with matching password
        const pendingSignup = await db.getPendingSignup(email);
        if (pendingSignup) {
            const ok = await bcrypt.compare(password, pendingSignup.passHash);
            if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

            // Check if there's already an active verification code
            const existingCode = await db.getVerificationCode(email);
            let expiresIn;
            
            if (existingCode && existingCode.expiresAt > Date.now()) {
                // Code still valid - just return existing expiry time
                expiresIn = Math.floor((existingCode.expiresAt - Date.now()) / 1000);
            } else {
                // No active code or expired - send new verification email
                const result = await VerificationService.resendVerificationCode(email, pendingSignup.name);
                expiresIn = result.expiresIn;
            }
            
            return res.status(202).json({
                success: true,
                requiresVerification: true,
                message: 'Account is pending verification. Check your email for the verification code.',
                email: email,
                expiresIn: expiresIn,
                canResend: true
            });
        }

        // Email not found in either collection
        return res.status(401).json({ error: 'Invalid email or password.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify email with code
app.post('/api/auth/verify-email', authLimiter, async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email and verification code are required.' });
        }

        // Verify the code (now async with database storage)
        const result = await VerificationService.verifyCode(email, code);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        // Get pending signup
        const pendingSignup = await db.getPendingSignup(email);
        if (!pendingSignup) {
            return res.status(404).json({ error: 'Signup not found. Please sign up again.' });
        }

        // Create actual user from pending signup
        const userId = crypto.randomUUID();
        const user = await db.confirmPendingSignup(email, userId);

        // Send welcome email
        const welcomeTemplate = EmailTemplates.getWelcomeEmail(user.name);
        const emailService = require('./Email').EmailService;
        emailService.send({
            from: process.env.EMAIL_USER,
            to: email,
            subject: welcomeTemplate.subject,
            text: welcomeTemplate.text,
            html: welcomeTemplate.html
        }).catch(err => console.error('Welcome email failed:', err));

        // Return token so user can log in    
        const token = signToken(user.id);
        res.json({
            success: true,
            message: 'Email verified! You can now use your account.',
            token,
            user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Resend verification code
app.post('/api/auth/resend-verification', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Check if email is pending verification
        const pendingSignup = await db.getPendingSignup(email);
        if (!pendingSignup) {
            return res.status(404).json({ error: 'No pending signup found for this email.' });
        }

        // Check if there's already an active verification code
        const existingCode = await db.getVerificationCode(email);
        let expiresIn;
        
        if (existingCode && existingCode.expiresAt > Date.now()) {
            // Code still valid - don't send another email
            expiresIn = Math.floor((existingCode.expiresAt - Date.now()) / 1000);
        } else {
            // No active code or expired - send new verification email
            const result = await VerificationService.resendVerificationCode(email, pendingSignup.name);
            expiresIn = result.expiresIn;
        }

        res.json({
            success: true,
            message: 'Verification code ready',
            expiresIn: expiresIn,
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Failed to resend verification code' });
    }
});

// Cancel pending signup (user wants to sign up fresh)
app.post('/api/auth/cancel-pending-signup', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Check if email is pending verification
        const pendingSignup = await db.getPendingSignup(email);
        if (!pendingSignup) {
            return res.status(404).json({ error: 'No pending signup found for this email.' });
        }

        // Delete the pending signup
        await db.deletePendingSignup(email);
        
        // Also clean up any leftover verification codes
        try {
            const verificationCodes = await db.getVerificationCodesCollection();
            await verificationCodes.deleteOne({ email: email.toLowerCase() });
        } catch (e) {
            console.warn('Failed to clean up verification codes:', e.message);
        }

        res.json({
            success: true,
            message: 'Pending signup cancelled. You can now sign up again with this email.',
        });
    } catch (error) {
        console.error('Cancel pending signup error:', error);
        res.status(500).json({ error: 'Failed to cancel pending signup' });
    }
});

// Forgot password - send 6-digit code
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Check if user exists (verified) or is a pending signup
        let user = await db.findByEmail(email);
        let isPendingSignup = false;
        
        if (!user) {
            user = await db.getPendingSignup(email);
            if (user) isPendingSignup = true;
        }
        
        if (!user) {
            // Don't reveal if email exists - security best practice
            return res.status(200).json({
                success: true,
                message: 'If an account exists, a reset code has been sent.',
            });
        }

        // Generate 6-digit reset code
        const resetCode = VerificationService.generateCode();
        const expiresAt = Date.now() + 60 * 1000; // 60 seconds

        // Store reset code in database
        await db.storeResetCode(email, resetCode, expiresAt);

        // Send reset code email
        const template = EmailTemplates.getPasswordResetEmail(resetCode, user.name);
        const emailService = require('./Email').EmailService;
        await emailService.send({
            from: process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html
        }).catch(err => console.error('Failed to send reset email:', err));

        const messageNote = isPendingSignup ? ' You can now set a new password and verify your account.' : '';
        res.status(200).json({
            success: true,
            message: 'Reset code sent to email' + messageNote,
            expiresIn: 60 * 1000, // 60 seconds
            isPendingSignup
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

// Verify reset code
app.post('/api/auth/verify-reset-code', authLimiter, async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email and code are required.' });
        }

        // Verify the reset code
        const result = await db.verifyResetCode(email, code);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            message: 'Code verified. You can now reset your password.',
        });
    } catch (error) {
        console.error('Verify reset code error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Resend reset code
app.post('/api/auth/resend-reset-code', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Check if user exists
        const user = await db.findByEmail(email);
        if (!user) {
            // Don't reveal if email exists
            return res.status(200).json({
                success: true,
                message: 'If an account exists, a reset code has been sent.',
            });
        }

        // Generate new reset code
        const resetCode = VerificationService.generateCode();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store new code
        await db.storeResetCode(email, resetCode, expiresAt);

        // Send reset code email
        const template = EmailTemplates.getPasswordResetEmail(resetCode, user.name);
        const emailService = require('./Email').EmailService;
        await emailService.send({
            from: process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html
        }).catch(err => console.error('Failed to send reset email:', err));

        res.json({
            success: true,
            message: 'New code sent',
            expiresIn: 5 * 60 * 1000 // 5 minutes
        });
    } catch (error) {
        console.error('Resend reset code error:', error);
        res.status(500).json({ error: 'Failed to resend code' });
    }
});

// Reset password - update after code verification
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }

        // Get user or pending signup
        let user = await db.findByEmail(email);
        let isPendingSignup = false;
        
        if (!user) {
            user = await db.getPendingSignup(email);
            isPendingSignup = true;
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(password, 12);

        if (isPendingSignup) {
            // Update pending signup password
            const pendingSignups = await db.getPendingSignupsCollection();
            await pendingSignups.findOneAndUpdate(
                { email: email.toLowerCase() },
                { $set: { passHash: newPasswordHash } },
                { returnDocument: 'after' }
            );
            
            res.status(200).json({
                success: true,
                message: 'Password updated! Now check your email for the verification code to complete signup.',
                isPendingSignup: true
            });
        } else {
            // Update verified user password
            await db.updatePassword(user.id, newPasswordHash);
            
            res.status(200).json({
                success: true,
                message: 'Password reset successfully. Please log in with your new password.',
            });
        }
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
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
            stripeCustomerId: user.stripeCustId || null,
            stripeSubscriptionId: user.stripeSubId || null,
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

// Get available plans
app.get('/api/plans', (req, res) => {
    try {
        const plans = stripeConfig.getPublicPlans();
        res.json(plans);
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

// Get user's billing info
app.get('/api/billing/info', requireAuth, billingLimiter, async (req, res) => {
    try {
        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const plan = stripeConfig.getPlan(user.plan || 'free');
        
        res.json({
            currentPlan: {
                name: plan.name,
                price: plan.price,
                currency: plan.currency,
                features: plan.features,
            },
            email: user.email,
            stripeCustomerId: user.stripeCustId || null,
            subscriptionStatus: user.subStatus || 'inactive',
            nextBillingDate: user.nextBillDt || null,
            planExpiryDate: user.planExpDt || null,
            cancelledAt: user.cancelledAt || null,
        });
    } catch (error) {
        console.error('Billing info error:', error);
        res.status(500).json({ error: 'Failed to fetch billing info' });
    }
});

// Create checkout session for plan upgrade/subscription
app.post('/api/payment/create-session', requireAuth, paymentLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService)
            return res.status(503).json({ error: 'Payment system is not configured yet.' });

        const { plan } = req.body;
        console.log(`[CHECKOUT] Creating session for plan: ${plan}`);
        
        // Validate plan
        const validation = stripeConfig.validatePlan(plan);
        if (!validation.valid) {
            console.error(`[CHECKOUT] Invalid plan: ${validation.error}`);
            return res.status(400).json({ error: validation.error });
        }

        if (plan === 'free') {
            console.error(`[CHECKOUT] Cannot checkout free plan`);
            return res.status(400).json({ error: 'Cannot create checkout for free plan. Downgrade instead.' });
        }

        const user = await db.findById(req.user.sub);
        if (!user) {
            console.error(`[CHECKOUT] User not found: ${req.user.sub}`);
            return res.status(404).json({ error: 'User not found.' });
        }
        console.log(`[CHECKOUT] User found: ${user.id}, current plan: ${user.plan}`);

        // Ensure customer exists
        let customer = null;
        if (user.stripeCustId) {
            try {
                customer = await stripeService.getCustomer(user.stripeCustId);
                if (customer.deleted) throw new Error('Customer deleted');
                console.log(`[CHECKOUT] Using existing customer: ${customer.id}`);
            } catch (custErr) {
                if (custErr.code === 'resource_missing' || custErr.message === 'Customer deleted') {
                    console.warn(`[CHECKOUT] Stored customer ID invalid (${user.stripeCustId}), creating new customer.`);
                    customer = await stripeService.ensureCustomer({ ...user, stripeCustId: null });
                    await db.updateSubscription(req.user.sub, { stripeCustId: customer.id });
                    console.log(`[CHECKOUT] Created replacement customer: ${customer.id}`);
                } else {
                    throw custErr;
                }
            }
        } else {
            customer = await stripeService.ensureCustomer(user);
            console.log(`[CHECKOUT] Created new customer: ${customer.id}`);
            // Update user with Stripe customer ID
            await db.updateSubscription(req.user.sub, { stripeCustId: customer.id });
        }

        // Create checkout session
        const planConfig = stripeConfig.getPlan(plan);
        console.log(`[CHECKOUT] Plan config:`, {
            name: planConfig.name,
            price: planConfig.price,
            stripePriceId: planConfig.stripePriceId
        });
        
        const session = await stripeService.createCheckoutSession(
            customer.id,
            plan,
            DOMAIN
        );

        console.log(`[CHECKOUT] Session created: ${session.id}, URL: ${session.url}`);
        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Payment session error:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session.' });
    }
});

// Cancel subscription - downgrade user to free plan
app.post('/api/payment/cancel-subscription', requireAuth, paymentLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService) {
            return res.status(503).json({ error: 'Payment system is not configured yet.' });
        }

        const user = await db.findById(req.user.sub);
        if (!user) {
            console.error(`[CANCEL] User not found: ${req.user.sub}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.plan === 'free') {
            return res.status(400).json({ error: 'Already on free plan.' });
        }

        console.log(`[CANCEL] Cancelling subscription for user ${user.id}, current plan: ${user.plan}`);

        // If user has a Stripe subscription, cancel it
        if (user.stripeSubId) {
            try {
                const subscription = await stripe.subscriptions.cancel(user.stripeSubId);
                console.log(`[CANCEL] ✓ Stripe subscription cancelled: ${subscription.id}`);
            } catch (error) {
                console.error(`[CANCEL] Error cancelling Stripe subscription:`, error.message);
                // Continue - downgrade in DB anyway
            }
        }

        // Downgrade user to free plan
        const updateData = {
            plan: 'free',
            subStatus: 'cancelled',
            stripeSubId: null,
            nextBillDt: null,
        };

        await db.updateSubscription(user.id, updateData);
        console.log(`[CANCEL] ✓ User downgraded to free plan`);

        // Log the action
        await db.logAuditAction(user.id, 'SUBSCRIPTION_CANCELLED', {
            previousPlan: user.plan,
            newPlan: 'free',
            stripeSubId: user.stripeSubId,
        });

        res.json({
            success: true,
            message: 'Subscription cancelled successfully. You are now on the Free plan.',
            user: {
                plan: 'free',
                subStatus: 'cancelled',
                stripeSubId: null,
            }
        });
    } catch (error) {
        console.error('[CANCEL] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to cancel subscription.' });
    }
});

// Get payment methods
app.get('/api/payment-methods', requireAuth, billingLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService)
            return res.status(503).json({ error: 'Payment system is not configured.' });

        const user = await db.findById(req.user.sub);
        if (!user || !user.stripeCustId)
            return res.json({ methods: [] });

        const methods = await stripeService.getPaymentMethods(user.stripeCustId);
        res.json({
            methods: methods.data.map(m => ({
                id: m.id,
                brand: m.card.brand,
                last4: m.card.last4,
                expMonth: m.card.exp_month,
                expYear: m.card.exp_year,
            }))
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
});

// Set default payment method
app.post('/api/payment-methods/set-default', requireAuth, paymentLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService)
            return res.status(503).json({ error: 'Payment system is not configured.' });

        const { paymentMethodId } = req.body;
        if (!paymentMethodId)
            return res.status(400).json({ error: 'Payment method ID required.' });

        const user = await db.findById(req.user.sub);
        if (!user || !user.stripeCustId)
            return res.status(400).json({ error: 'No Stripe customer.' });

        await stripeService.setDefaultPaymentMethod(user.stripeCustId, paymentMethodId);
        res.json({ success: true, message: 'Default payment method updated.' });
    } catch (error) {
        console.error('Set default payment method error:', error);
        res.status(500).json({ error: 'Failed to set default payment method' });
    }
});

// Get billing history
app.get('/api/billing/invoices', requireAuth, billingLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService)
            return res.json({ invoices: [] });

        const user = await db.findById(req.user.sub);
        if (!user || !user.stripeCustId)
            return res.json({ invoices: [] });

        const invoices = await stripeService.getInvoices(user.stripeCustId, 24);
        res.json({
            invoices: invoices.data.map(inv => ({
                id: inv.id,
                date: new Date(inv.created * 1000),
                amount: inv.amount_paid / 100,
                currency: inv.currency.toUpperCase(),
                status: inv.status,
                pdfUrl: inv.invoice_pdf,
                description: inv.description || 'Invoice',
            }))
        });
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// Search/lookup account by ID, email, subscription ID, or customer ID
app.get('/api/account/lookup/:identifier', requireAuth, accountLimiter, async (req, res) => {
    try {
        const identifier = req.params.identifier?.trim();
        if (!identifier) {
            return res.status(400).json({ error: 'Identifier is required.' });
        }

        const user = await db.findByIdentifier(identifier);
        if (!user) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        // Don't expose password hash
        const { passHash, ...safeUser } = user;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            subStatus: user.subStatus || 'inactive',
            createdAt: user.cAt,
            stripeCustomerId: user.stripeCustId || null,
            stripeSubscriptionId: user.stripeSubId || null,
            nextBillingDate: user.nextBillDt || null,
            planExpiryDate: user.planExpDt || null,
            renewalAmount: user.renewalAmt || null,
            cancelledAt: user.cancelledAt || null,
        });
    } catch (error) {
        console.error('Account lookup error:', error);
        res.status(500).json({ error: 'Failed to lookup account' });
    }
});

// Stripe webhook — handles subscription events
app.post('/api/webhook/stripe', async (req, res) => {
    try {
        if (!stripe || !STRIPE_WEBHOOK_SECRET)
            return res.status(200).send('OK');

        let event;
        try {
            event = stripeService.validateWebhookSignature(
                req.body,
                req.headers['stripe-signature'],
                STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature error:', err.message);
            return res.status(400).send('Webhook Error');
        }

        console.log(`[STRIPE WEBHOOK] Event type: ${event.type}`);
        console.log(`[STRIPE WEBHOOK] Event data:`, JSON.stringify(event.data.object, null, 2).substring(0, 500));

        // Handle checkout completion (one-time or subscription)
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const customerId = session.customer;
            const planName = session.metadata?.planName;
            const subscriptionId = session.subscription; // Session has subscription ID if it was a subscription checkout

            console.log(`[CHECKOUT] Session - Customer: ${customerId}, Plan: ${planName}, Subscription: ${subscriptionId}`);

            if (customerId && planName) {
                const user = await db.findByStripeCustomerId(customerId);
                console.log(`[CHECKOUT] Found user: ${user?.id}`);
                
                if (user) {
                    const updateData = {
                        plan: planName,
                        stripeCustId: customerId,
                        subStatus: 'active',
                    };
                    
                    // If subscription ID is in the session, save it immediately
                    if (subscriptionId) {
                        updateData.stripeSubId = subscriptionId;
                        console.log(`[SUBSCRIPTION] Session contains subscription ID: ${subscriptionId}`);
                    } else {
                        // Try to fetch from Stripe (subscription might have just been created)
                        try {
                            const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
                            console.log(`[CHECKOUT] Found ${subscriptions.data.length} subscriptions for customer`);
                            const subscription = subscriptions.data.find(sub => 
                                sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
                            );
                            if (subscription) {
                                updateData.stripeSubId = subscription.id;
                                updateData.nextBillDt = new Date(subscription.current_period_end * 1000);
                                console.log(`[CHECKOUT] Found active subscription: ${subscription.id}`);
                            }
                        } catch (err) {
                            console.warn('[SUBSCRIPTION] Could not fetch subscriptions from Stripe:', err.message);
                        }
                    }
                    
                    await db.updateSubscription(user.id, updateData);
                    console.log(`[SUBSCRIPTION] User ${user.id} upgraded to ${planName}`, updateData);
                }
            }
        }

        // Handle subscription updates
        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const user = await db.findByStripeCustomerId(subscription.customer);
            
            console.log(`[SUBSCRIPTION.UPDATED] Subscription: ${subscription.id}, Customer: ${subscription.customer}, User: ${user?.id}`);
            
            if (user) {
                const planName = stripeService.getPlanNameFromPriceId(
                    subscription.items.data[0]?.price?.id
                );
                
                console.log(`[SUBSCRIPTION.UPDATED] Price ID: ${subscription.items.data[0]?.price?.id}, Plan Name: ${planName}`);
                
                const updateData = {
                    stripeSubId: subscription.id,
                    subStatus: subscription.status,
                    nextBillDt: new Date(subscription.current_period_end * 1000),
                    cancelledAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
                };
                
                // Update plan if we found a valid plan name
                if (planName && planName !== 'free') {
                    updateData.plan = planName;
                }
                
                await db.updateSubscription(user.id, updateData);
                console.log(`[SUBSCRIPTION.UPDATED] Updated user ${user.id} subscription status: ${subscription.status}, plan: ${planName || 'unknown'}`);
            }
        }

        // Handle subscription cancellation
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const user = await db.findByStripeCustomerId(subscription.customer);
            
            if (user) {
                await db.updateSubscription(user.id, {
                    subStatus: 'cancelled',
                    cancelledAt: new Date(),
                });
                console.log(`[SUBSCRIPTION] User ${user.id} subscription cancelled`);
            }
        }

        // Handle payment failures
        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const user = await db.findByStripeCustomerId(invoice.customer);
            
            if (user) {
                await db.updateSubscription(user.id, {
                    subStatus: 'past_due',
                });
                console.log(`[PAYMENT FAILED] User ${user.id} payment failed for invoice ${invoice.id}`);
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Cancel subscription
app.post('/api/subscription/cancel', requireAuth, paymentLimiter, async (req, res) => {
    try {
        if (!stripe || !stripeService)
            return res.status(503).json({ error: 'Payment system is not configured.' });

        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (!user.plan || user.plan === 'free') {
            return res.status(400).json({ error: 'User is not on a paid plan.' });
        }

        if (!user.stripeSubId) {
            return res.status(400).json({ error: 'No active Stripe subscription found.' });
        }

        // Cancel at period end (user keeps access until renewal date)
        const subscription = await stripeService.cancelSubscription(user.stripeSubId);

        await db.updateSubscription(user.id, {
            subStatus: 'cancelled',
            cancelledAt: new Date(),
            nextBillDt: new Date(subscription.current_period_end * 1000),
        });

        console.log(`[SUBSCRIPTION] User ${user.id} cancelled ${user.plan} plan. Active until ${subscription.current_period_end}`);

        res.json({
            success: true,
            message: `Subscription cancelled. Your ${user.plan} plan remains active until ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}.`,
            cancelledAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : new Date(),
            activeUntil: new Date(subscription.current_period_end * 1000),
        });
    } catch (error) {
        console.error('Subscription cancel error:', error);
        res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
    }
});

// Downgrade to free plan (immediate)
app.post('/api/subscription/downgrade', requireAuth, paymentLimiter, async (req, res) => {
    try {
        const user = await db.findById(req.user.sub);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (user.plan === 'free') {
            return res.status(400).json({ error: 'Already on free plan.' });
        }

        // Update user plan to free
        const updated = await db.updatePlan(user.id, 'free');

        console.log(`[DOWNGRADE] User ${user.id} downgraded from ${user.plan} to free`);

        res.json({
            success: true,
            message: 'Downgraded to free plan.',
            user: {
                id: updated.id,
                email: updated.email,
                name: updated.name,
                plan: updated.plan,
            }
        });
    } catch (error) {
        console.error('Downgrade error:', error);
        res.status(500).json({ error: 'Failed to downgrade plan' });
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
}`,
    // Base One
    `// Enter your JavaScript code here

function hello(name) {
  console.log("Hello, " + name);
}

hello("World");`
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

// Debug endpoint to check subscription status (DEV ONLY)
app.get('/api/debug/subscription/:customerId', async (req, res) => {
    try {
        if (!stripe || !stripeService) {
            return res.status(503).json({ error: 'Stripe not configured' });
        }

        const { customerId } = req.params;
        
        // Get user from DB
        const user = await db.findByStripeCustomerId(customerId);
        console.log('[DEBUG] User found:', user ? user.id : 'NOT FOUND');
        
        // Get subscriptions from Stripe
        const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
        console.log('[DEBUG] Stripe subscriptions:', subscriptions.data.length);
        
        // Get customer from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        
        res.json({
            customerExists: !!customer,
            customerId,
            userInDb: !!user,
            user: user ? {
                id: user.id,
                email: user.email,
                plan: user.plan,
                subStatus: user.subStatus,
                stripeSubId: user.stripeSubId,
                stripeCustId: user.stripeCustId,
            } : null,
            stripeSubscriptions: subscriptions.data.map(sub => ({
                id: sub.id,
                status: sub.status,
                priceId: sub.items.data[0]?.price?.id,
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
            })),
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Comprehensive Stripe configuration diagnostic endpoint
app.get('/api/debug/stripe-config', (req, res) => {
    const config = {
        stripeConfigured: !!stripe,
        stripeServiceConfigured: !!stripeService,
        webhookSecretConfigured: !!STRIPE_WEBHOOK_SECRET,
        plans: {},
        errors: [],
    };

    // Check each plan
    const plans = stripeConfig.PLANS;
    for (const [planName, plan] of Object.entries(plans)) {
        config.plans[planName] = {
            name: plan.name,
            price: plan.price,
            stripePriceId: plan.stripePriceId,
            configured: planName === 'free' || (plan.stripePriceId && !plan.stripePriceId.includes('placeholder')),
        };

        if (planName !== 'free' && !plan.stripePriceId) {
            config.errors.push(`❌ ${planName}: stripePriceId is missing (not set in .env)`);
        } else if (planName !== 'free' && plan.stripePriceId.includes('placeholder')) {
            config.errors.push(`❌ ${planName}: stripePriceId is placeholder (STRIPE_PRICE_${planName.toUpperCase()} not set)`);
        } else if (planName !== 'free') {
            config.errors.push(`✓ ${planName}: stripePriceId configured`);
        }
    }

    if (!stripe) {
        config.errors.push('❌ Stripe not initialized (STRIPE_RESTRICTED_KEY missing or invalid)');
    } else {
        config.errors.push('✓ Stripe initialized');
    }

    if (!STRIPE_WEBHOOK_SECRET) {
        config.errors.push('❌ Webhook secret not configured (STRIPE_WEBHOOK_SECRET missing)');
    } else {
        config.errors.push('✓ Webhook secret configured');
    }

    if (!DOMAIN || DOMAIN === 'http://localhost:3000') {
        config.errors.push('⚠ DOMAIN is localhost (for local testing only)');
    }

    res.json(config);
});

// Manual sync endpoint - pulls subscription data from Stripe and saves to DB
app.post('/api/admin/sync-subscription/:customerId', async (req, res) => {
    try {
        if (!stripe || !stripeService) {
            return res.status(503).json({ error: 'Stripe not configured' });
        }

        const { customerId } = req.params;
        console.log(`[SYNC] Syncing subscription for customer: ${customerId}`);
        
        // Get user from DB
        const user = await db.findByStripeCustomerId(customerId);
        if (!user) {
            return res.status(404).json({ error: 'User not found for this Stripe customer' });
        }

        // Get subscriptions from Stripe
        const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
        const activeSubscription = subscriptions.data.find(sub => 
            sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
        );

        if (!activeSubscription) {
            return res.status(404).json({ error: 'No active subscription found in Stripe' });
        }

        // Determine plan from price ID
        const planName = stripeService.getPlanNameFromPriceId(
            activeSubscription.items.data[0]?.price?.id
        );

        if (!planName) {
            return res.status(400).json({ error: 'Could not determine plan from price ID' });
        }

        // Update database with subscription data
        const updateData = {
            plan: planName,
            stripeSubId: activeSubscription.id,
            subStatus: activeSubscription.status,
            nextBillDt: new Date(activeSubscription.current_period_end * 1000),
            stripeCustId: customerId,
        };

        const updated = await db.updateSubscription(user.id, updateData);
        
        console.log(`[SYNC] ✓ Successfully synced subscription for user ${user.id}:`, updateData);

        res.json({
            success: true,
            message: `User upgraded to ${planName} plan`,
            before: {
                plan: user.plan,
                subStatus: user.subStatus,
                stripeSubId: user.stripeSubId || null,
            },
            after: updateData,
        });
    } catch (error) {
        console.error('[SYNC] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to check subscription status (DEV ONLY)
app.get('/api/debug/subscription/:customerId', async (req, res) => {
    try {
        if (!stripe || !stripeService) {
            return res.status(503).json({ error: 'Stripe not configured' });
        }

        const { customerId } = req.params;
        
        // Get user from DB
        const user = await db.findByStripeCustomerId(customerId);
        console.log('[DEBUG] User found:', user ? user.id : 'NOT FOUND');
        
        // Get subscriptions from Stripe
        const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
        console.log('[DEBUG] Stripe subscriptions:', subscriptions.data.length);
        
        // Get customer from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        
        res.json({
            customerExists: !!customer,
            customerId,
            userInDb: !!user,
            user: user ? {
                id: user.id,
                email: user.email,
                plan: user.plan,
                subStatus: user.subStatus,
                stripeSubId: user.stripeSubId,
                stripeCustId: user.stripeCustId,
            } : null,
            stripeSubscriptions: subscriptions.data.map(sub => ({
                id: sub.id,
                status: sub.status,
                priceId: sub.items.data[0]?.price?.id,
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
            })),
            needsSync: user && user.plan === 'free' && subscriptions.data.some(s => s.status === 'active'),
            syncCommand: user && user.plan === 'free' && subscriptions.data.some(s => s.status === 'active') 
                ? `curl -X POST http://localhost:3000/api/admin/sync-subscription/${customerId}`
                : null,
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ── WIDGET ENDPOINTS ────────────────────────────────────────────────────────────

// Widget API endpoint - for programmatic control
app.get('/api/widget/config', (req, res) => {
    const domain = process.env.DOMAIN || 'https://obfusly.com';
    res.json({
        widget: {
            name: 'Obfusly Widget',
            version: '1.0.0',
            scriptUrl: `${domain}/widget/embed.js`,
            documentationUrl: `${domain}/widget`,
            options: {
                position: {
                    default: 'right',
                    allowed: ['left', 'right'],
                    description: 'Position of the widget on the screen'
                },
                bgColor: {
                    default: '#000000',
                    description: 'Background color in hex format (URL encoded)',
                    examples: ['%23000000', '%232e6bff', '%2388ddff']
                }
            },
            examples: [
                {
                    name: 'Default',
                    code: `<script src="${domain}/widget/embed.js"><\\/script>`
                },
                {
                    name: 'Left Position',
                    code: `<script src="${domain}/widget/embed.js?position=left"><\\/script>`
                },
                {
                    name: 'Custom Color',
                    code: `<script src="${domain}/widget/embed.js?bgColor=%232e6bff"><\\/script>`
                }
            ]
        }
    });
});

// Initialize MongoDB and start server
async function startServer() {
    try {
        await mongoManager.initDatabase();
        console.log('✓ MongoDB connected successfully');

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
