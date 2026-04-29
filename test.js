const WorkerPool = require('./Workers/worker');
const config = require('./Settings/config');

async function obfuscate(code, customConfig = {}) {
    // Set custom config before obfuscation
    if (Object.keys(customConfig).length > 0) {
        console.log('Applying custom config:', customConfig);
        config.mergeConfig(customConfig);
    }

    const workerPool = new WorkerPool(2);
    
    try {
        const result = await workerPool.execute(code, customConfig);
        console.log('Obfuscated Code:\n', result.objectObfuscatedCode);
        return result.objectObfuscatedCode;
    } finally {
        workerPool.terminate();
    }
}

// Test with default config
console.log('\n=== Test 1: Default Config ===');
obfuscate(`
    let x = 123123123;
    console.log(x);
`);

// Test with custom config (enable string encoding and number encoding)
console.log('\n=== Test 2: Custom Config (Encoding Enabled) ===');
obfuscate(`
    let name = "hello world";
    let count = 42;
    console.log(name, count);
`, {
    strings: {
        encoding: {
            enabled: true,
            cache: false
        }
    },
    numbers: {
        enabled: true,
        strategy: {
            useCalculator: true
        }
    },
    output: {
        strictMode: true
    }
});