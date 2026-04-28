/**
 * Simple file-based user store.
 * Reads/writes to ./data/users.json — swap for a real DB when ready.
 */
const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

function load() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function save(users) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

module.exports = {
    findByEmail(email) {
        return load().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },
    findById(id) {
        return load().find(u => u.id === id) || null;
    },
    create(user) {
        const users = load();
        users.push(user);
        save(users);
        return user;
    },
    updatePlan(id, plan) {
        const users = load();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        users[idx].plan = plan;
        users[idx].planUpdatedAt = new Date().toISOString();
        save(users);
        return users[idx];
    },
    updateSubscriptionStatus(id, status) {
        const users = load();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        users[idx].subscriptionStatus = status;
        save(users);
        return users[idx];
    },
    cancelSubscription(id) {
        const users = load();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        
        // Mark as cancelled but keep plan active until expiry
        users[idx].subscriptionStatus = 'cancelled';
        users[idx].cancelledAt = new Date().toISOString();
        
        save(users);
        return users[idx];
    },
};
