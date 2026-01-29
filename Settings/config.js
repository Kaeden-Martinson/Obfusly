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
        Refractal: 10,
        JSFuck: 10,
        Hexadecimal: 10,
        Octal: 10,
        Binary: 10
    },
    encodedFunctionStrength: 5,
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 5, /* 0 - disabled, n - max splits */
    optimizedStringCache: true,
    stringConcealment: true,
    stringConcealmentSettings: {
        decodersCount: 5,
        addNoiseCount: 5
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