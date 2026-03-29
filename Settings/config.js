const config = {
    nameGenerationStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    numberEncoding: true,
    optimzedNumberCache: true,
    numberCalculator: true,
    globalBaseIntegerConcealment: true,
    multipleVariableAssignments: true,
    shuffleBaseIntegers: true,
    baseIntegersDefault: "JSFuck",
    integerPrecentage: {
        Refractal: 30,
        JSFuck: 10,
        Hexadecimal: 20,
        Octal: 20,
        Binary: 20
    },
    encodedFunctionStrength: 5, /* 1 - basic, n - max strength (higher is stronger) */
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 0, /* 0 - disabled, n - max splits */
    optimizedStringCache: true,
    stringConcealment: true,
    stringConcealmentSettings: {
        decodersCount: 3,
        addNoiseCount: 3
    },
    wrapStringsInIIFE: true,
    breakIIFEString: true,
    concealPrimitives: true,
    compression: true,
    disableEval: false,
    disableLocalIIFEs: false,
    integrityChecks: true,
    breakASTs: true,
    wrapInIIFE: true,
    disableConsoleOutput: false,
    enableAntiDebugger: false,
};

module.exports = config;