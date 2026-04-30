/**
 * Stripe Configuration & Plan Definitions
 * Centralized configuration for all Stripe-related settings
 */

const PLANS = {
    free: {
        name: 'Free',
        price: 0,
        currency: 'usd',
        stripePriceId: null,
        features: {
            obfuscationsPerMonth: 5,
            codeSize: '10KB',
            obfuscationModes: ['basic'],
            apiAccess: false,
            support: 'Community',
            priority: 'None',
        },
        description: 'Perfect for getting started',
    },
    professional: {
        name: 'Professional',
        price: 19.99,
        currency: 'usd',
        stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
        interval: 'month',
        features: {
            obfuscationsPerMonth: 50,
            codeSize: '5MB',
            obfuscationModes: ['basic', 'advanced', 'aggressive'],
            apiAccess: true,
            support: 'Email Support',
            priority: 'Standard',
        },
        description: 'For professional developers',
    },
    enterprise: {
        name: 'Enterprise',
        price: 49.99,
        currency: 'usd',
        stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
        interval: 'month',
        features: {
            obfuscationsPerMonth: 500,
            codeSize: 'Unlimited',
            obfuscationModes: ['basic', 'advanced', 'aggressive', 'extreme'],
            apiAccess: true,
            customSolutions: true,
            support: '24/7 Priority Support',
            priority: 'Priority',
            sla: true,
        },
        description: 'For large organizations',
    },
};

/**
 * Get plan details by name
 */
function getPlan(planName) {
    return PLANS[planName] || null;
}

/**
 * Get all public plan information (excluding price IDs)
 */
function getPublicPlans() {
    const publicPlans = {};
    for (const [key, plan] of Object.entries(PLANS)) {
        publicPlans[key] = {
            name: plan.name,
            price: plan.price,
            currency: plan.currency,
            interval: plan.interval || 'one-time',
            features: plan.features,
            description: plan.description,
        };
    }
    return publicPlans;
}

/**
 * Validate plan exists and has Stripe price configured
 */
function validatePlan(planName) {
    const plan = PLANS[planName];
    if (!plan) return { valid: false, error: 'Plan not found' };
    if (planName === 'free') return { valid: true };
    if (!plan.stripePriceId || plan.stripePriceId.includes('placeholder')) {
        return { valid: false, error: 'Stripe price not configured' };
    }
    return { valid: true };
}

module.exports = {
    PLANS,
    getPlan,
    getPublicPlans,
    validatePlan,
};
