/**
 * MongoDB-backed user store
 * Production-ready user management with MongoDB Atlas
 */
const mongoManager = require('./mongodb');
const zlib = require('zlib');
const { promisify } = require('util');

// Promisify compression functions for async/await
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Get users collection
 */
async function getUsersCollection() {
    const db = await mongoManager.getDB();
    return db.collection('users');
}

/**
 * Get audit collection
 */
async function getAuditCollection() {
    const db = await mongoManager.getDB();
    return db.collection('audit_logs');
}

/**
 * Get obfuscation history collection
 */
async function getObfuscationCollection() {
    const db = await mongoManager.getDB();
    return db.collection('history');
}

/**
 * Get API tokens collection
 */
async function getTokensCollection() {
    const db = await mongoManager.getDB();
    return db.collection('api_tokens');
}

/**
 * Get settings collection
 */
async function getSettingsCollection() {
    const db = await mongoManager.getDB();
    return db.collection('settings');
}

/**
 * Log user actions to audit collection
 */
async function logAudit(userId, action, details = {}) {
    try {
        const auditCollection = await getAuditCollection();
        await auditCollection.insertOne({
            uid: userId,
            action,
            details,
            cAt: new Date(),
            ip: details.ip || null,
        });
    } catch (error) {
        console.warn('[AUDIT] Log failed:', error.message);
    }
}

module.exports = {
    // ═══════════════════════════════════════════════════════════════════
    // USER LOOKUP OPERATIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Find user by email (case-insensitive)
     */
    async findByEmail(email) {
        const users = await getUsersCollection();
        return await users.findOne({
            email: { $regex: `^${email.toLowerCase()}$`, $options: 'i' },
            del: { $ne: true },
        });
    },

    /**
     * Find user by ID
     */
    async findById(id) {
        const users = await getUsersCollection();
        return await users.findOne({ id, del: { $ne: true } });
    },

    /**
     * Find user by Stripe customer ID
     */
    async findByStripeCustomerId(stripeCustomerId) {
        const users = await getUsersCollection();
        return await users.findOne({ stripeCustId: stripeCustomerId, del: { $ne: true } });
    },

    /**
     * Find user by Stripe subscription ID
     */
    async findByStripeSubscriptionId(stripeSubscriptionId) {
        const users = await getUsersCollection();
        return await users.findOne({ stripeSubId: stripeSubscriptionId, del: { $ne: true } });
    },

    /**
     * Universal account lookup by ID, email, subscription ID, or customer ID
     */
    async findByIdentifier(identifier) {
        if (!identifier) return null;
        const users = await getUsersCollection();
        
        // Try to match by different fields
        return await users.findOne({
            $or: [
                { id: identifier },
                { email: { $regex: `^${identifier.toLowerCase()}$`, $options: 'i' } },
                { stripeCustId: identifier },
                { stripeSubId: identifier },
            ],
            del: { $ne: true },
        });
    },

    // ═══════════════════════════════════════════════════════════════════
    // USER CREATION & DELETION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Create new user
     */
    async create(user) {
        const users = await getUsersCollection();
        
        const optimizedUser = {
            id: user.id,
            email: user.email.toLowerCase(),
            name: user.name || '',
            passHash: user.passwordHash,
            plan: user.plan || 'free',
            cAt: user.createdAt || new Date(),
            subStatus: user.subscriptionStatus || 'inactive',
            
            // Subscription fields
            ...(user.nextBillingDate && { nextBillDt: user.nextBillingDate }),
            ...(user.planExpiryDate && { planExpDt: user.planExpiryDate }),
            ...(user.renewalAmount && { renewalAmt: user.renewalAmount }),
            ...(user.stripeCustomerId && { stripeCustId: user.stripeCustomerId }),
            ...(user.stripeSubscriptionId && { stripeSubId: user.stripeSubscriptionId }),
            
            uAt: new Date(),
            del: false,
        };

        const result = await users.insertOne(optimizedUser);
        await logAudit(user.id, 'USER_CREATED', { email: user.email });
        
        return optimizedUser;
    },

    /**
     * Delete user (soft delete for compliance)
     */
    async deleteUser(id) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id },
            {
                $set: {
                    del: true,
                    dAt: new Date(),
                    uAt: new Date(),
                    email: `deleted_${id}@archived.local`,
                },
            },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'USER_DELETED');
            return result.value;
        }
        return null;
    },

    // ═══════════════════════════════════════════════════════════════════
    // USER PLAN & SUBSCRIPTION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Update user plan
     */
    async updatePlan(id, plan) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            {
                $set: {
                    plan,
                    planUpdatedAt: new Date(),
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'PLAN_UPDATED', { newPlan: plan });
            return result.value;
        }
        return null;
    },

    /**
     * Update subscription status
     */
    async updateSubscriptionStatus(id, status) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            {
                $set: {
                    subStatus: status,
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'SUBSCRIPTION_STATUS_UPDATED', { status });
            return result.value;
        }
        return null;
    },

    /**
     * Update subscription details
     */
    async updateSubscription(id, subscriptionData) {
        const users = await getUsersCollection();
        const updateData = {
            uAt: new Date(),
            ...subscriptionData,
        };

        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'SUBSCRIPTION_UPDATED', subscriptionData);
            return result.value;
        }
        return null;
    },

    /**
     * Cancel subscription
     */
    async cancelSubscription(id) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            {
                $set: {
                    subStatus: 'cancelled',
                    cancelledAt: new Date(),
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'SUBSCRIPTION_CANCELLED');
            return result.value;
        }
        return null;
    },

    // ═══════════════════════════════════════════════════════════════════
    // USER PROFILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Update user profile
     */
    async updateProfile(id, updates) {
        const users = await getUsersCollection();
        const allowedFields = ['name', 'email'];
        
        const sanitizedUpdates = {};
        for (const field of allowedFields) {
            if (field in updates) {
                sanitizedUpdates[field] = updates[field];
                if (field === 'email') {
                    sanitizedUpdates[field] = updates[field].toLowerCase();
                }
            }
        }

        sanitizedUpdates.uAt = new Date();

        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            { $set: sanitizedUpdates },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'PROFILE_UPDATED', sanitizedUpdates);
            return result.value;
        }
        return null;
    },

    /**
     * Update password hash
     */
    async updatePassword(id, newPasswordHash) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id, del: { $ne: true } },
            {
                $set: {
                    passHash: newPasswordHash,
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        if (result.value) {
            await logAudit(id, 'PASSWORD_CHANGED');
            return result.value;
        }
        return null;
    },

    // ═══════════════════════════════════════════════════════════════════
    // ANALYTICS & REPORTING
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get subscription stats
     */
    async getSubscriptionStats() {
        const users = await getUsersCollection();
        return await users
            .aggregate([
                { $match: { del: { $ne: true } } },
                {
                    $group: {
                        _id: '$subStatus',
                        count: { $sum: 1 },
                        totalRevenue: { $sum: { $ifNull: ['$renewalAmt', 0] } },
                    },
                },
            ])
            .toArray();
    },

    /**
     * Get plan distribution
     */
    async getPlanStats() {
        const users = await getUsersCollection();
        return await users
            .aggregate([
                { $match: { del: { $ne: true } } },
                {
                    $group: {
                        _id: '$plan',
                        count: { $sum: 1 },
                        totalRevenue: { $sum: { $ifNull: ['$renewalAmt', 0] } },
                    },
                },
            ])
            .toArray();
    },

    /**
     * Get users by plan
     */
    async getUsersByPlan(plan) {
        const users = await getUsersCollection();
        return await users
            .find({ plan, del: { $ne: true } })
            .project({ passHash: 0 })
            .toArray();
    },

    /**
     * Get expiring subscriptions
     */
    async getExpiringSubscriptions(daysUntilExpiry = 7) {
        const users = await getUsersCollection();
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + daysUntilExpiry);

        return await users
            .find({
                subStatus: 'active',
                del: { $ne: true },
                planExpDt: {
                    $gte: new Date(),
                    $lte: expiryThreshold,
                },
            })
            .toArray();
    },

    /**
     * Get total user count
     */
    async getUserCount() {
        const users = await getUsersCollection();
        return await users.countDocuments({ del: { $ne: true } });
    },

    // ═══════════════════════════════════════════════════════════════════
    // OBFUSCATION HISTORY
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Log obfuscation request (compressed)
     */
    async logObfuscation(userId, obfuscationData) {
        const obfuscation = await getObfuscationCollection();
        
        // Compress the obfuscation data to save storage
        const dataStr = JSON.stringify({
            inputSz: obfuscationData.inputSize || 0,
            outputSz: obfuscationData.outputSize || 0,
            technique: obfuscationData.technique || 'standard',
            duration: obfuscationData.duration || 0,
            success: obfuscationData.success !== false,
        });
        
        const compressed = await gzip(dataStr);
        
        const record = {
            uid: userId,
            data: compressed,
            cAt: new Date(),
        };

        const result = await obfuscation.insertOne(record);
        return result.insertedId;
    },

    /**
     * Get user's obfuscation history (decompressed)
     */
    async getObfuscationHistory(userId, limit = 100) {
        const obfuscation = await getObfuscationCollection();
        const records = await obfuscation
            .find({ uid: userId })
            .sort({ cAt: -1 })
            .limit(limit)
            .toArray();

        // Decompress records
        const decompressed = await Promise.all(
            records.map(async (record) => {
                try {
                    const decompressedData = await gunzip(record.data);
                    const parsed = JSON.parse(decompressedData.toString());
                    return {
                        _id: record._id,
                        ...parsed,
                        cAt: record.cAt,
                    };
                } catch (error) {
                    console.error('Failed to decompress history record:', error.message);
                    return null;
                }
            })
        );

        return decompressed.filter(item => item !== null);
    },

    // ═══════════════════════════════════════════════════════════════════
    // AUDIT TRAIL
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get user with audit trail
     */
    async getUserWithAudit(id) {
        const user = await this.findById(id);
        if (!user) return null;

        const auditCollection = await getAuditCollection();
        const auditLog = await auditCollection
            .find({ uid: id })
            .sort({ cAt: -1 })
            .limit(50)
            .toArray();

        return {
            ...user,
            auditLog,
        };
    },

    /**
     * Get audit logs for user
     */
    async getAuditLog(userId, limit = 100) {
        const audit = await getAuditCollection();
        return await audit
            .find({ uid: userId })
            .sort({ cAt: -1 })
            .limit(limit)
            .toArray();
    },

    // ═══════════════════════════════════════════════════════════════════
    // API TOKENS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Create API token
     */
    async createApiToken(userId, tokenData) {
        const tokens = await getTokensCollection();
        const record = {
            uid: userId,
            token: tokenData.token,
            name: tokenData.name || 'Token',
            cAt: new Date(),
            expiresAt: tokenData.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            lastUsedAt: null,
        };

        const result = await tokens.insertOne(record);
        await logAudit(userId, 'API_TOKEN_CREATED', { name: record.name });
        return record;
    },

    /**
     * Validate API token
     */
    async validateApiToken(token) {
        const tokens = await getTokensCollection();
        const record = await tokens.findOne({
            token,
            expiresAt: { $gt: new Date() },
        });

        if (record) {
            await tokens.updateOne({ _id: record._id }, { $set: { lastUsedAt: new Date() } });
        }

        return record;
    },

    // ═══════════════════════════════════════════════════════════════════
    // SETTINGS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get user settings
     */
    async getSettings(userId) {
        const settings = await getSettingsCollection();
        return await settings.findOne({ uid: userId });
    },

    /**
     * Update user settings
     */
    async updateSettings(userId, settingsData) {
        const settings = await getSettingsCollection();
        const result = await settings.findOneAndUpdate(
            { uid: userId },
            {
                $set: {
                    uid: userId,
                    ...settingsData,
                    uAt: new Date(),
                },
            },
            { upsert: true, returnDocument: 'after' }
        );

        await logAudit(userId, 'SETTINGS_UPDATED', settingsData);
        return result.value;
    },

    // ═══════════════════════════════════════════════════════════════════
    // COLLECTION ACCESS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get users collection for advanced queries
     */
    async getUsersCollection() {
        return await getUsersCollection();
    },

    /**
     * Get audit collection for advanced queries
     */
    async getAuditCollection() {
        return await getAuditCollection();
    },

    // ═══════════════════════════════════════════════════════════════════
    // OBFUSCATION USAGE TRACKING (SERVER-SIDE LIMITS)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get today's obfuscation count for a user
     * Automatically resets if it's a new day
     */
    async getDailyObfuscationCount(userId) {
        const users = await getUsersCollection();
        const user = await users.findOne({ id: userId, del: { $ne: true } });
        
        if (!user) return { count: 0, resetTime: this._getNextResetTime() };
        
        // Initialize if not set
        if (!user.obfuscationCount) {
            return { count: 0, resetTime: this._getNextResetTime() };
        }
        
        // Check if we need to reset (new day)
        const lastCountDate = user.obfuscationCountDate ? new Date(user.obfuscationCountDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!lastCountDate || lastCountDate < today) {
            // Reset for new day
            await users.updateOne(
                { id: userId },
                {
                    $set: {
                        obfuscationCount: 0,
                        obfuscationCountDate: new Date(),
                        uAt: new Date(),
                    },
                }
            );
            return { count: 0, resetTime: this._getNextResetTime() };
        }
        
        return { count: user.obfuscationCount, resetTime: this._getNextResetTime() };
    },

    /**
     * Increment obfuscation count for user
     * Returns updated count and plan info
     */
    async incrementObfuscationCount(userId) {
        const users = await getUsersCollection();
        
        const result = await users.findOneAndUpdate(
            { id: userId, del: { $ne: true } },
            {
                $inc: { obfuscationCount: 1 },
                $set: {
                    obfuscationCountDate: new Date(),
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );
        
        if (!result.value) return null;
        
        const updated = result.value;
        const user = updated;
        
        // Get plan limits
        const LIMITS = {
            free: 3,
            professional: 50,
            enterprise: 500,
        };
        
        const plan = user.plan || 'free';
        const limit = LIMITS[plan] || 3;
        const used = (user.obfuscationCount || 0);
        const remaining = Math.max(0, limit - used);
        
        return {
            used,
            limit,
            remaining,
            plan,
        };
    },

    /**
     * Check if user has hit their daily limit
     * Returns usage info including whether they can obfuscate
     */
    async checkObfuscationLimit(userId) {
        const users = await getUsersCollection();
        const user = await users.findOne({ id: userId, del: { $ne: true } });
        
        if (!user) {
            return {
                canObfuscate: false,
                error: 'User not found',
            };
        }
        
        // Get plan limits
        const LIMITS = {
            free: 3,
            professional: 50,
            enterprise: 500,
        };
        
        const plan = user.plan || 'free';
        const limit = LIMITS[plan] || 3;
        
        // Check if count needs reset
        const lastCountDate = user.obfuscationCountDate ? new Date(user.obfuscationCountDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let currentCount = user.obfuscationCount || 0;
        
        // Auto-reset if new day
        if (!lastCountDate || lastCountDate < today) {
            await users.updateOne(
                { id: userId },
                {
                    $set: {
                        obfuscationCount: 0,
                        obfuscationCountDate: new Date(),
                        uAt: new Date(),
                    },
                }
            );
            currentCount = 0;
        }
        
        const canObfuscate = currentCount < limit;
        const remaining = Math.max(0, limit - currentCount);
        
        return {
            canObfuscate,
            remaining,
            limit,
            plan,
            used: currentCount,
            message: canObfuscate 
                ? `You have ${remaining} obfuscations remaining today`
                : `Daily limit of ${limit} reached. Please try again tomorrow.`,
        };
    },

    /**
     * Helper to get next reset time (UTC midnight)
     */
    _getNextResetTime() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        return tomorrow.toISOString();
    },

    // ═══════════════════════════════════════════════════════════════════
    // PENDING SIGNUPS (Email Verification)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get pending signups collection
     */
    async getPendingSignupsCollection() {
        const db = await mongoManager.getDB();
        return db.collection('pending_signups');
    },

    /**
     * Store a pending signup (not yet verified)
     * @param {string} email - User email
     * @param {string} passwordHash - Hashed password
     * @param {string} name - User name
     * @returns {object} Pending signup record
     */
    async createPendingSignup(email, passwordHash, name) {
        const pendingSignups = await this.getPendingSignupsCollection();
        
        // Delete any existing pending signup for this email
        await pendingSignups.deleteOne({ email: email.toLowerCase() });
        
        const pendingUser = {
            email: email.toLowerCase(),
            passHash: passwordHash,
            name: name || '',
            plan: 'free',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        };
        
        await pendingSignups.insertOne(pendingUser);
        return pendingUser;
    },

    /**
     * Get pending signup by email
     */
    async getPendingSignup(email) {
        const pendingSignups = await this.getPendingSignupsCollection();
        return await pendingSignups.findOne({ email: email.toLowerCase() });
    },

    /**
     * Convert pending signup to actual user (after email verification)
     */
    async confirmPendingSignup(email, userId) {
        const pendingSignups = await this.getPendingSignupsCollection();
        const pendingUser = await pendingSignups.findOne({ email: email.toLowerCase() });
        
        if (!pendingUser) {
            throw new Error('Pending signup not found');
        }
        
        // Create actual user
        const createdUser = await this.create({
            id: userId,
            name: pendingUser.name,
            email: pendingUser.email,
            passwordHash: pendingUser.passHash,
            plan: pendingUser.plan || 'free',
            verified: true,
            createdAt: new Date(),
        });
        
        // Delete pending signup
        await pendingSignups.deleteOne({ email: email.toLowerCase() });
        
        return createdUser;
    },

    /**
     * Delete pending signup (user gave up on verification)
     */
    async deletePendingSignup(email) {
        const pendingSignups = await this.getPendingSignupsCollection();
        await pendingSignups.deleteOne({ email: email.toLowerCase() });
    },

    /**
     * Clean up expired pending signups (older than 24 hours)
     */
    async cleanupExpiredPendingSignups() {
        const pendingSignups = await this.getPendingSignupsCollection();
        const result = await pendingSignups.deleteMany({
            expiresAt: { $lt: new Date() },
        });
        return result.deletedCount;
    },

    /**
     * Update user verified status
     */
    async updateVerified(userId, isVerified) {
        const users = await getUsersCollection();
        const result = await users.findOneAndUpdate(
            { id: userId },
            {
                $set: {
                    verified: isVerified,
                    uAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );
        return result.value;
    },

    // ═══════════════════════════════════════════════════════════════════
    // VERIFICATION CODES (Email Verification)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get verification codes collection
     */
    async getVerificationCodesCollection() {
        const db = await mongoManager.getDB();
        const collection = db.collection('verification_codes');
        
        // Set up TTL index to auto-delete expired codes
        // TTL index will delete documents 60 seconds after the expiresAt field
        await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        
        return collection;
    },

    /**
     * Store a verification code in the database
     */
    async storeVerificationCode(email, code, expiresAt) {
        const verificationCodes = await this.getVerificationCodesCollection();
        
        // Delete any existing code for this email
        await verificationCodes.deleteOne({ email: email.toLowerCase() });
        
        // Store new code
        await verificationCodes.insertOne({
            email: email.toLowerCase(),
            code,
            expiresAt: new Date(expiresAt),
            attempts: 0,
        });
    },

    /**
     * Get a verification code by email
     */
    async getVerificationCode(email) {
        const verificationCodes = await this.getVerificationCodesCollection();
        const record = await verificationCodes.findOne({ email: email.toLowerCase() });
        
        if (!record) {
            return null;
        }
        
        // Check if expired
        if (new Date() > record.expiresAt) {
            // Delete expired code
            await verificationCodes.deleteOne({ email: email.toLowerCase() });
            return null;
        }
        
        return record;
    },

    /**
     * Verify a code and update attempts
     */
    async verifyCode(email, code) {
        const verificationCodes = await this.getVerificationCodesCollection();
        const record = await verificationCodes.findOne({ email: email.toLowerCase() });
        
        if (!record) {
            return { success: false, error: 'No verification code found' };
        }
        
        // Check if expired
        if (new Date() > record.expiresAt) {
            await verificationCodes.deleteOne({ email: email.toLowerCase() });
            return { success: false, error: 'Verification code has expired' };
        }
        
        // Check attempts
        if (record.attempts >= 5) {
            await verificationCodes.deleteOne({ email: email.toLowerCase() });
            return { success: false, error: 'Too many failed attempts' };
        }
        
        // Check code
        if (record.code !== code) {
            // Increment attempts
            await verificationCodes.updateOne(
                { email: email.toLowerCase() },
                { $inc: { attempts: 1 } }
            );
            const remaining = 5 - (record.attempts + 1);
            return { success: false, error: `Invalid code. ${remaining} attempts remaining.` };
        }
        
        // Success - delete code
        await verificationCodes.deleteOne({ email: email.toLowerCase() });
        return { success: true };
    },

    /**
     * Delete a verification code
     */
    async deleteVerificationCode(email) {
        const verificationCodes = await this.getVerificationCodesCollection();
        await verificationCodes.deleteOne({ email: email.toLowerCase() });
    },

    /**
     * Clean up all expired verification codes
     */
    async cleanupExpiredVerificationCodes() {
        const verificationCodes = await this.getVerificationCodesCollection();
        const result = await verificationCodes.deleteMany({
            expiresAt: { $lt: new Date() },
        });
        return result.deletedCount;
    },

    // ═══════════════════════════════════════════════════════════════════
    // PASSWORD RESET CODE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get password reset codes collection with TTL index
     */
    async getResetCodesCollection() {
        const db = await mongoManager.getDB();
        const collection = db.collection('password_reset_codes');
        
        // Set up TTL index to auto-delete expired codes (60 seconds)
        await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        
        return collection;
    },

    /**
     * Store a password reset code in the database
     */
    async storeResetCode(email, code, expiresAt) {
        const resetCodes = await this.getResetCodesCollection();
        
        // Delete any existing code for this email
        await resetCodes.deleteOne({ email: email.toLowerCase() });
        
        // Store new code
        await resetCodes.insertOne({
            email: email.toLowerCase(),
            code,
            expiresAt: new Date(expiresAt),
            attempts: 0,
        });
    },

    /**
     * Get a password reset code by email
     */
    async getResetCode(email) {
        const resetCodes = await this.getResetCodesCollection();
        const record = await resetCodes.findOne({ email: email.toLowerCase() });
        
        if (!record) {
            return null;
        }
        
        // Check if expired
        if (new Date() > record.expiresAt) {
            // Delete expired code
            await resetCodes.deleteOne({ email: email.toLowerCase() });
            return null;
        }
        
        return record;
    },

    /**
     * Verify a password reset code
     */
    async verifyResetCode(email, code) {
        const resetCodes = await this.getResetCodesCollection();
        const record = await resetCodes.findOne({ email: email.toLowerCase() });
        
        if (!record) {
            return { success: false, error: 'No reset code found' };
        }
        
        // Check if expired
        if (new Date() > record.expiresAt) {
            await resetCodes.deleteOne({ email: email.toLowerCase() });
            return { success: false, error: 'Reset code has expired' };
        }
        
        // Check attempts
        if (record.attempts >= 5) {
            await resetCodes.deleteOne({ email: email.toLowerCase() });
            return { success: false, error: 'Too many failed attempts' };
        }
        
        // Check code
        if (record.code !== code) {
            // Increment attempts
            await resetCodes.updateOne(
                { email: email.toLowerCase() },
                { $inc: { attempts: 1 } }
            );
            const remaining = 5 - (record.attempts + 1);
            return { success: false, error: `Invalid code. ${remaining} attempts remaining.` };
        }
        
        // Success - delete code
        await resetCodes.deleteOne({ email: email.toLowerCase() });
        return { success: true };
    },

    /**
     * Delete a password reset code
     */
    async deleteResetCode(email) {
        const resetCodes = await this.getResetCodesCollection();
        await resetCodes.deleteOne({ email: email.toLowerCase() });
    },

    /**
     * Clean up all expired password reset codes
     */
    async cleanupExpiredResetCodes() {
        const resetCodes = await this.getResetCodesCollection();
        const result = await resetCodes.deleteMany({
            expiresAt: { $lt: new Date() },
        });
        return result.deletedCount;
    },
};
