const config = {
    nameGenerationStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    numberEncoding: false,
    optimzedNumberCache: false,
    numberCalculator: false,
    globalBaseIntegerConcealment: false,
    multipleVariableAssignments: false,
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
    stringEncoding: false,
    stringSplitting: 3, /* 0 - disabled, n - max splits */
    optimizedStringCache: false,
    stringConcealment: false,
    stringConcealmentSettings: {
        decodersCount: 1,
        addNoiseCount: 1
    },
    wrapStringsInIIFE: false,
    breakIIFEString: false,
    concealPrimitives: false,
    compression: true,
    disableEval: false,
    disableLocalIIFEs: false,
    integrityChecks: true,
    breakASTs: false,
    wrapInIIFE: false,
    disableConsoleOutput: false,
    enableAntiDebugger: false,
};

module.exports = config;