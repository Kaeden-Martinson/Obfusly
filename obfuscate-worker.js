const { parentPort } = require('worker_threads');

parentPort.on('message', async ({ code, config, __jobId }) => {
    const __obfuscator_1 = require('./Main/first_obfuscator');
    const __obfuscator_2 = require('./Main/property_obfuscator');

    try {
        const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
        const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties(obfuscatedCode, windowName, previousDeclarationMapping);

        parentPort.postMessage({
            objectObfuscatedCode,
            obfuscatedCode,
            windowName,
            previousDeclarationMapping,
            error: null,
            __jobId
        });
    } catch (error) {
        parentPort.postMessage({
            error: error.message || 'Unknown error during obfuscation',
            __jobId
        });
    }
});
