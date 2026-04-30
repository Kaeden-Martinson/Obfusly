/**
 * Stripe API Service Layer
 * Handles all direct Stripe API interactions
 */

const stripeConfig = require('./stripe-config');

class StripeService {
    constructor(stripe) {
        this.stripe = stripe;
    }

    /**
     * Create or retrieve Stripe customer
     */
    async ensureCustomer(user) {
        if (user.stripeCustId) {
            return await this.stripe.customers.retrieve(user.stripeCustId);
        }

        const customer = await this.stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
                userId: user.id,
                createdAt: new Date().toISOString(),
            },
        });

        return customer;
    }

    /**
     * Create checkout session for subscription
     */
    async createCheckoutSession(customerId, planName, domain) {
        const planValidation = stripeConfig.validatePlan(planName);
        if (!planValidation.valid) {
            throw new Error(planValidation.error);
        }

        if (planName === 'free') {
            throw new Error('Cannot create checkout session for free plan');
        }

        const plan = stripeConfig.getPlan(planName);

        return await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            line_items: [
                {
                    price: plan.stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${domain}/?checkout=success&plan=${planName}`,
            cancel_url: `${domain}/pricing`,
            metadata: {
                planName,
                planPrice: plan.price,
            },
        });
    }

    /**
     * Create checkout session for one-time purchase
     */
    async createOneTimeCheckoutSession(customerId, priceId, domain, metadata = {}) {
        return await this.stripe.checkout.sessions.create({
            mode: 'payment',
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${domain}/?payment=success`,
            cancel_url: `${domain}/pricing`,
            metadata,
        });
    }

    /**
     * Get customer's subscriptions
     */
    async getCustomerSubscriptions(customerId) {
        return await this.stripe.subscriptions.list({
            customer: customerId,
            limit: 10,
        });
    }

    /**
     * Get active subscription
     */
    async getActiveSubscription(customerId) {
        const subscriptions = await this.getCustomerSubscriptions(customerId);
        return subscriptions.data.find(
            (sub) =>
                sub.status === 'active' ||
                sub.status === 'trialing' ||
                sub.status === 'past_due'
        );
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId) {
        return await this.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
    }

    /**
     * Immediately cancel subscription (no refund period)
     */
    async cancelSubscriptionImmediate(subscriptionId) {
        return await this.stripe.subscriptions.del(subscriptionId);
    }

    /**
     * Get payment methods for customer
     */
    async getPaymentMethods(customerId) {
        return await this.stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
    }

    /**
     * Set default payment method
     */
    async setDefaultPaymentMethod(customerId, paymentMethodId) {
        return await this.stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
    }

    /**
     * Get invoice history
     */
    async getInvoices(customerId, limit = 12) {
        return await this.stripe.invoices.list({
            customer: customerId,
            limit,
        });
    }

    /**
     * Get a single invoice
     */
    async getInvoice(invoiceId) {
        return await this.stripe.invoices.retrieve(invoiceId);
    }

    /**
     * Retrieve customer details
     */
    async getCustomer(customerId) {
        return await this.stripe.customers.retrieve(customerId);
    }

    /**
     * Handle subscription update event
     */
    async handleSubscriptionUpdated(subscription) {
        return {
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            priceId: subscription.items.data[0]?.price?.id,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        };
    }

    /**
     * Handle subscription deleted event
     */
    async handleSubscriptionDeleted(subscription) {
        return {
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            status: 'deleted',
            endedAt: new Date(subscription.ended_at * 1000),
        };
    }

    /**
     * Get plan name from price ID
     */
    getPlanNameFromPriceId(priceId) {
        const plans = stripeConfig.PLANS;
        for (const [planName, plan] of Object.entries(plans)) {
            if (plan.stripePriceId === priceId) {
                return planName;
            }
        }
        return null;
    }

    /**
     * Validate webhook signature
     */
    validateWebhookSignature(body, signature, webhookSecret) {
        try {
            return this.stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
        } catch (err) {
            throw new Error(`Invalid webhook signature: ${err.message}`);
        }
    }
}

module.exports = StripeService;
