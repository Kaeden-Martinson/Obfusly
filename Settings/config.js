const config = {
    nameGenerationStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    numberEncoding: true,
    optimzedNumberCache: true,
    numberCalculator: false,
    globalBaseIntegerConcealment: true,
    multipleVariableAssignments: true,
    shuffleBaseIntegers: false,
    baseIntegersDefault: "JSFuck",
    integerPrecentage: {
        Refractal: 20,
        JSFuck: 20,
        Hexadecimal: 20,
        Octal: 20,
        Binary: 20
    },
    encodedFunctionStrength: 1,
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 1, /* 0 - disabled, n - max splits */
    optimizedStringCache: true,
    stringConcealment: true,
    stringConcealmentSettings: {
        decodersCount: 1,
        addNoiseCount: 1
    },
    wrapStringsInIIFE: false,
    breakIIFEString: true,
    concealPrimitives: false,
    compression: true,
    disableEval: true,
    disableLocalIIFEs: true,
    integrityChecks: false,
    breakASTs: true,
    wrapInIIFE: false,
    disableConsoleOutput: false,
    enableAntiDebugger: false,
};

module.exports = config;