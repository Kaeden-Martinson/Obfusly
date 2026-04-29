/**
 * Rate Limiting System for Free Users
 * Tracks obfuscations per day and enforces limits
 */

const OBFUSCATION_LIMIT = {
    free: 3,
    professional: 500,
    professional: 500,
    enterprise: Infinity
};

/**
 * Get the user's plan (from localStorage or default to 'free')
 * @returns {string} User plan type
 */
function getUserPlan() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser')) || { plan: 'free' };
        return user.plan || 'free';
    } catch {
        return 'free';
    }
}

/**
 * Get today's obfuscation count for the user
 * @returns {object} { count, resetTime }
 */
function getTodayObfuscationCount() {
    const key = 'obfuscationStats_' + new Date().toDateString();
    const stored = localStorage.getItem(key);
    
    if (!stored) {
        return { count: 0, resetTime: getNextResetTime() };
    }
    
    return JSON.parse(stored);
}

/**
 * Increment obfuscation count for today
 * @returns {object} Updated count and remaining
 */
function incrementObfuscationCount() {
    const key = 'obfuscationStats_' + new Date().toDateString();
    const current = getTodayObfuscationCount();
    const updated = { 
        count: current.count + 1, 
        resetTime: getNextResetTime() 
    };
    
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
}

/**
 * Check if user can perform obfuscation
 * @returns {object} { canObfuscate, remaining, limit, message }
 */
function checkObfuscationLimit() {
    const plan = getUserPlan();
    const limit = OBFUSCATION_LIMIT[plan];
    const current = getTodayObfuscationCount();
    
    const canObfuscate = current.count < limit;
    const remaining = Math.max(0, limit - current.count);
    
    return {
        canObfuscate,
        remaining,
        limit,
        plan,
        used: current.count,
        message: canObfuscate 
            ? `You have ${remaining} obfuscations remaining today`
            : `Daily limit reached. ${plan === 'free' ? 'Upgrade to continue.' : 'Please try again tomorrow.'}`
    };
}

/**
 * Get next reset time (midnight UTC)
 * @returns {string} ISO string of next reset time
 */
function getNextResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

/**
 * Get time remaining until reset
 * @returns {object} { hours, minutes, seconds }
 */
function getTimeUntilReset() {
    const stats = getTodayObfuscationCount();
    const resetTime = new Date(stats.resetTime);
    const now = new Date();
    const diff = resetTime - now;
    
    if (diff < 0) return { hours: 0, minutes: 0, seconds: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserPlan,
        getTodayObfuscationCount,
        incrementObfuscationCount,
        checkObfuscationLimit,
        getNextResetTime,
        getTimeUntilReset,
        OBFUSCATION_LIMIT
    };
}
