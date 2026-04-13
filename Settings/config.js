const config = {
    nameGenerationStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    numberEncoding: true,
    optimzedNumberCache: true,
    numberCalculator: true,
    globalBaseIntegerConcealment: true,
    multipleVariableAssignments: false, // false = 101 vars instead of 401, 75% less startup cost
    shuffleBaseIntegers: true,
    baseIntegersDefault: "JSFuck",
    integerPrecentage: {
        Refractal: 0,    // Disabled: runtime ~'string' coercion + recursive encoding adds overhead
        JSFuck: 0,       // Disabled: type coercion + temp string allocs per eval
        Hexadecimal: 40, // Zero-cost: native JS literal parsed at compile time
        Octal: 30,       // Zero-cost: native JS literal parsed at compile time
        Binary: 30       // Zero-cost: native JS literal parsed at compile time
    },
    encodedFunctionStrength: 3, /* Reduced from 5: cuts 40% off decode chain depth while maintaining strong obfuscation */
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 0, /* 0 - disabled, n - max splits (splitting multiplies concealment decode calls) */
    optimizedStringCache: true,
    stringConcealment: true,
    stringConcealmentSettings: {
        decodersCount: 2,  // Reduced from 3: 2 decoders still makes pattern analysis hard
        addNoiseCount: 1   // Reduced from 3: noise blocks are pure runtime overhead per decode
    },
    concealPrimitives: true,
    compression: true,
    strictMode: false,
    integrityChecks: true,
    breakASTs: true,
    disableConsoleOutput: false,
    enableAntiDebugger: false,
};

module.exports = config;