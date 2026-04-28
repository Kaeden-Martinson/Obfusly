/**
 * MongoDB Setup & Initialization Script
 * Run this once to initialize your MongoDB Atlas connection
 */
const mongoManager = require('./mongodb');
const userStore = require('./users.mongo');

/**
 * Initialize MongoDB connection
 * @param {string} mongoUri - Your MongoDB Atlas connection string
 */
async function initializeMongoDB(mongoUri) {
    try {
        console.log('🔄 Initializing MongoDB connection...');

        // Connect to MongoDB
        await mongoManager.initDatabase();

        // Verify connection
        const isHealthy = await mongoManager.healthCheck();
        if (!isHealthy) {
            throw new Error('Health check failed');
        }

        console.log('✓ MongoDB initialized successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. In server.js, replace: const db = require("./Database/users");');
        console.log('   With:                 const db = require("./Database/users.mongo");');
        console.log('\n2. In server.js, add at startup:');
        console.log('   const mongoManager = require("./Database/mongodb");');
        console.log('   await mongoManager.initDatabase();');
        console.log('\n3. Store your connection string as environment variable:');
        console.log('   MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/");');

        return true;
    } catch (error) {
        console.error('✗ Initialization failed:', error.message);
        return false;
    }
}

/**
 * Migrate data from JSON file to MongoDB
 * @param {string} mongoUri - Your MongoDB Atlas connection string
 * @param {Array} jsonData - User data from JSON file
 */
async function migrateFromJSON(mongoUri, jsonData) {
    try {
        console.log('🔄 Starting migration from JSON to MongoDB...');

        // Connect
        await mongoManager.initDatabase();

        // Migrate each user
        const usersCollection = mongoManager.client.db('obfusly').collection('users');
        let migratedCount = 0;

        for (const user of jsonData) {
            try {
                const optimized = {
                    id: user.id,
                    email: user.email.toLowerCase(),
                    name: user.name || '',
                    passwordHash: user.passwordHash,
                    plan: user.plan || 'free',
                    createdAt: new Date(user.createdAt),
                    subscriptionStatus: user.subscriptionStatus || 'inactive',
                    nextBillingDate: user.nextBillingDate ? new Date(user.nextBillingDate) : null,
                    planExpiryDate: user.planExpiryDate ? new Date(user.planExpiryDate) : null,
                    renewalAmount: user.renewalAmount || null,
                    stripeCustomerId: user.stripeCustomerId || null,
                    stripeSubscriptionId: user.stripeSubscriptionId || null,
                    updatedAt: new Date(),
                };

                await usersCollection.insertOne(optimized);
                migratedCount++;
            } catch (error) {
                console.warn(`⚠ Failed to migrate user ${user.email}:`, error.message);
            }
        }

        console.log(`✓ Migration complete! ${migratedCount}/${jsonData.length} users migrated.`);
        return migratedCount;
    } catch (error) {
        console.error('✗ Migration failed:', error.message);
        return 0;
    }
}

module.exports = {
    initializeMongoDB,
    migrateFromJSON,
    mongoManager,
};

// If run directly
if (require.main === module) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('Error: MONGO_URI environment variable not set');
        console.error('Usage: MONGO_URI="mongodb+srv://..." node Database/setup.js');
        process.exit(1);
    }

    initializeMongoDB(mongoUri)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
