const config = {
    // ========== IDENTIFIERS ==========
    identifiers: {
        nameStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    },

    // ========== NUMBERS ==========
    numbers: {
        enabled: false,
        
        strategy: {
            useCalculator: false,       // Runtime decoding with XOR/arithmetic
            useBaseIntegers: false,     // Precomputed lookup tables
            calculateStrength: 3,      // Decoder complexity (1-5)
        },
        
        cache: {
            enabled: false,             // Cache encoded number results
            multipleAssignments: false,// false = 101 vars, false = 401 vars (75% less startup cost)
        },
        
        baseIntegerFormat: {
            default: "JSFuck",         // Default encoding format
            shuffle: false,             // Randomize base integer order
            distribution: {            // Weighted distribution of encoding types
                Refractal: 0,    // Disabled: runtime overhead
                JSFuck: 0,       // Disabled: type coercion overhead
                Hexadecimal: 40, // Zero-cost: native JS literal
                Octal: 30,       // Zero-cost: native JS literal
                Binary: 30       // Zero-cost: native JS literal
            }
        }
    },

    // ========== STRINGS ==========
    strings: {
        encoding: {
            enabled: false,
            cache: false,               // Cache decoded strings
        },
        
        concealment: {
            enabled: false,             // Advanced string concealment layer
            decoderLayers: 2,          // Number of decoder functions (was decodersCount)
            noiseFunctions: 1,         // Noise blocks added per decoder (was addNoiseCount)
        },
        
        splitting: {
            maxFragments: 0,           // Max fragments per string (0 = disabled)
        }
    },

    // ========== GLOBALS ==========
    globals: {
        concealWindowObject: false,    // Obfuscate 'window' reference
        concealPrimitives: false,      // Obfuscate undefined, null, etc
    },

    // ========== PROTECTION ==========
    protection: {
        integrityChecks: false,        // Detect code tampering
        antiDebugger: false,          // Anti-debugging measures
        disableConsole: false,        // Remove console.log calls
        breakASTs: false,              // Use placeholders (AST optimization)
    },

    // ========== OUTPUT ==========
    output: {
        compression: false,            // Minify final output
        strictMode: false,            // Wrap in Function() vs standalone
        target: "browser",            // Target environment: "browser" or "node"
    }
};

// ============================================================================
// BACKWARD COMPATIBILITY LAYER
// Maps old config paths to new structure for gradual migration
// ============================================================================

// Create proxy getters for old property names
Object.defineProperty(config, 'nameGenerationStyle', {
    get: () => config.identifiers.nameStyle,
    set: (v) => { config.identifiers.nameStyle = v; }
});

Object.defineProperty(config, 'numberEncoding', {
    get: () => config.numbers.enabled,
    set: (v) => { config.numbers.enabled = v; }
});

Object.defineProperty(config, 'numberCalculator', {
    get: () => config.numbers.strategy.useCalculator,
    set: (v) => { config.numbers.strategy.useCalculator = v; }
});

Object.defineProperty(config, 'globalBaseIntegerConcealment', {
    get: () => config.numbers.strategy.useBaseIntegers,
    set: (v) => { config.numbers.strategy.useBaseIntegers = v; }
});

Object.defineProperty(config, 'optimzedNumberCache', {
    get: () => config.numbers.cache.enabled,
    set: (v) => { config.numbers.cache.enabled = v; }
});

Object.defineProperty(config, 'multipleVariableAssignments', {
    get: () => config.numbers.cache.multipleAssignments,
    set: (v) => { config.numbers.cache.multipleAssignments = v; }
});

Object.defineProperty(config, 'shuffleBaseIntegers', {
    get: () => config.numbers.baseIntegerFormat.shuffle,
    set: (v) => { config.numbers.baseIntegerFormat.shuffle = v; }
});

Object.defineProperty(config, 'baseIntegersDefault', {
    get: () => config.numbers.baseIntegerFormat.default,
    set: (v) => { config.numbers.baseIntegerFormat.default = v; }
});

Object.defineProperty(config, 'integerPrecentage', {
    get: () => config.numbers.baseIntegerFormat.distribution,
    set: (v) => { config.numbers.baseIntegerFormat.distribution = v; }
});

Object.defineProperty(config, 'encodedFunctionStrength', {
    get: () => config.numbers.strategy.calculateStrength,
    set: (v) => { config.numbers.strategy.calculateStrength = v; }
});

Object.defineProperty(config, 'stringEncoding', {
    get: () => config.strings.encoding.enabled,
    set: (v) => { config.strings.encoding.enabled = v; }
});

Object.defineProperty(config, 'optimizedStringCache', {
    get: () => config.strings.encoding.cache,
    set: (v) => { config.strings.encoding.cache = v; }
});

Object.defineProperty(config, 'stringConcealment', {
    get: () => config.strings.concealment.enabled,
    set: (v) => { config.strings.concealment.enabled = v; }
});

Object.defineProperty(config, 'stringConcealmentSettings', {
    get: () => ({
        decodersCount: config.strings.concealment.decoderLayers,
        addNoiseCount: config.strings.concealment.noiseFunctions
    }),
    set: (v) => {
        if (v.decodersCount !== undefined) config.strings.concealment.decoderLayers = v.decodersCount;
        if (v.addNoiseCount !== undefined) config.strings.concealment.noiseFunctions = v.addNoiseCount;
    }
});

Object.defineProperty(config, 'stringSplitting', {
    get: () => config.strings.splitting.maxFragments,
    set: (v) => { config.strings.splitting.maxFragments = v; }
});

Object.defineProperty(config, 'concealGlobalObjects', {
    get: () => config.globals.concealWindowObject,
    set: (v) => { config.globals.concealWindowObject = v; }
});

Object.defineProperty(config, 'concealPrimitives', {
    get: () => config.globals.concealPrimitives,
    set: (v) => { config.globals.concealPrimitives = v; }
});

Object.defineProperty(config, 'integrityChecks', {
    get: () => config.protection.integrityChecks,
    set: (v) => { config.protection.integrityChecks = v; }
});

Object.defineProperty(config, 'antiDebugger', {
    get: () => config.protection.antiDebugger,
    set: (v) => { config.protection.antiDebugger = v; }
});

Object.defineProperty(config, 'enableAntiDebugger', {
    get: () => config.protection.antiDebugger,
    set: (v) => { config.protection.antiDebugger = v; }
});

Object.defineProperty(config, 'disableConsoleOutput', {
    get: () => config.protection.disableConsole,
    set: (v) => { config.protection.disableConsole = v; }
});

Object.defineProperty(config, 'breakASTs', {
    get: () => config.protection.breakASTs,
    set: (v) => { config.protection.breakASTs = v; }
});

Object.defineProperty(config, 'compression', {
    get: () => config.output.compression,
    set: (v) => { config.output.compression = v; }
});

Object.defineProperty(config, 'strictMode', {
    get: () => config.output.strictMode,
    set: (v) => { config.output.strictMode = v; }
});

Object.defineProperty(config, 'target', {
    get: () => config.output.target,
    set: (v) => { config.output.target = v; }
});

// ============================================================================
// DYNAMIC CONFIG MERGING
// Allows runtime config updates without refactoring all function signatures
// ============================================================================

// Store original defaults for resetting per-request
const DEFAULTS = JSON.parse(JSON.stringify({
    identifiers: config.identifiers,
    numbers: config.numbers,
    strings: config.strings,
    globals: config.globals,
    protection: config.protection,
    output: config.output
}));

function mergeConfig(incomingConfig) {
    if (!incomingConfig || typeof incomingConfig !== 'object') {
        return;
    }
    
    const deepMerge = (target, source) => {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    };
    
    deepMerge(config, incomingConfig);
}

function resetToDefaults() {
    const deepCopy = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        const copy = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
        return copy;
    };
    
    config.identifiers = deepCopy(DEFAULTS.identifiers);
    config.numbers = deepCopy(DEFAULTS.numbers);
    config.strings = deepCopy(DEFAULTS.strings);
    config.globals = deepCopy(DEFAULTS.globals);
    config.protection = deepCopy(DEFAULTS.protection);
    config.output = deepCopy(DEFAULTS.output);
}

module.exports = config;
module.exports.mergeConfig = mergeConfig;
module.exports.resetToDefaults = resetToDefaults;