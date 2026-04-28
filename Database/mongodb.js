/**
 * MongoDB Connection Manager
 * Handles connection pooling, initialization, and graceful shutdown
 * Production-ready setup with comprehensive error handling
 */
const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('dns');

// Use Cloudflare and Google DNS to bypass local DNS issues
dns.setServers(['1.1.1.1', '8.8.8.8']);

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error('✗ MONGO_URI environment variable not set');
    process.exit(1);
}

// Initialize MongoDB client with optimized settings
const client = new MongoClient(uri, {
    // Connection pooling
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 45000,
    
    // Timeouts and retries
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
    
    // Stable API for version compatibility
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let isConnected = false;
let connectionPromise = null;

/**
 * Initialize all collections with proper indexes
 */
async function initializeCollections(db) {
    try {
        console.log('📦 Initializing collections and indexes...');

        // Users collection
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ id: 1 }, { unique: true });
        await usersCollection.createIndex({ cAt: -1 });
        await usersCollection.createIndex({ subStatus: 1 });
        await usersCollection.createIndex({ plan: 1 });
        await usersCollection.createIndex({ nextBillDt: 1 });
        await usersCollection.createIndex({ del: 1, cAt: -1 });
        console.log('  ✓ Users collection ready');

        // Audit logs collection (with TTL)
        const auditCollection = db.collection('audit_logs');
        await auditCollection.createIndex({ uid: 1, cAt: -1 });
        await auditCollection.createIndex({ action: 1, cAt: -1 });
        await auditCollection.createIndex({ cAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL
        console.log('  ✓ Audit logs collection ready');

        // Obfuscation history collection (compressed)
        const historyCollection = db.collection('history');
        await historyCollection.createIndex({ uid: 1, cAt: -1 });
        await historyCollection.createIndex({ cAt: -1 });
        await historyCollection.createIndex({ cAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL
        console.log('  ✓ History collection ready');

        // API keys/tokens collection
        const tokensCollection = db.collection('api_tokens');
        await tokensCollection.createIndex({ uid: 1 });
        await tokensCollection.createIndex({ token: 1 }, { unique: true });
        await tokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        console.log('  ✓ API tokens collection ready');

        // Settings collection
        const settingsCollection = db.collection('settings');
        await settingsCollection.createIndex({ uid: 1 }, { unique: true });
        console.log('  ✓ Settings collection ready');

        console.log('✓ All collections initialized successfully\n');
        return true;
    } catch (error) {
        console.error('✗ Failed to initialize collections:', error.message);
        throw error;
    }
}

/**
 * Connect to MongoDB with automatic retry
 */
async function connect() {
    if (isConnected) {
        return client.db('Obfusly');
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = (async () => {
        try {
            console.log('🔄 Connecting to MongoDB Atlas...');
            await client.connect();
            
            const db = client.db('Obfusly');
            
            // Verify connection with ping
            await db.admin().ping();
            console.log('✓ MongoDB connection verified');

            // Initialize collections and indexes
            await initializeCollections(db);

            isConnected = true;
            connectionPromise = null;

            return db;
        } catch (error) {
            connectionPromise = null;
            console.error('✗ MongoDB connection failed:', error.message);
            throw error;
        }
    })();

    return connectionPromise;
}

/**
 * Get database instance (ensures connected)
 */
async function getDB() {
    if (!isConnected) {
        return await connect();
    }
    return client.db('Obfusly');
}

/**
 * Health check
 */
async function healthCheck() {
    try {
        if (!isConnected) return false;
        const db = client.db('Obfusly');
        await db.admin().ping();
        return true;
    } catch (error) {
        console.error('✗ Health check failed:', error.message);
        return false;
    }
}

/**
 * Get connection stats
 */
function getConnectionStats() {
    if (!client.topology) {
        return { connected: false };
    }

    const topology = client.topology;
    return {
        connected: isConnected,
        type: topology.type,
        poolStats: {
            totalConnectionCount: topology.connectionPool?.totalConnectionCount || 0,
            availableConnectionCount: topology.connectionPool?.availableConnectionCount || 0,
        },
    };
}

/**
 * Graceful shutdown
 */
async function disconnect() {
    if (client) {
        try {
            await client.close();
            isConnected = false;
            console.log('✓ MongoDB disconnected gracefully');
        } catch (error) {
            console.error('✗ Error during disconnect:', error.message);
        }
    }
}

/**
 * Handle process termination
 */
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down...');
    await disconnect();
    process.exit(0);
});

module.exports = {
    client,
    connect,
    getDB,
    disconnect,
    healthCheck,
    getConnectionStats,
    initDatabase: connect, // Alias for backward compatibility
    get isConnected() {
        return isConnected;
    },
};
