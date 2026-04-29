const { parentPort } = require('worker_threads');

parentPort.on('message', async ({ code, config: incomingConfig, __jobId }) => {
    const configModule = require('./Settings/config');
    const __obfuscator_1 = require('./Main/first_obfuscator');
    const __obfuscator_2 = require('./Main/property_obfuscator');

    try {
        // Reset config to defaults and merge incoming config for this job
        configModule.resetToDefaults();
        if (incomingConfig && typeof incomingConfig === 'object') {
            configModule.mergeConfig(incomingConfig);
        }
        
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
