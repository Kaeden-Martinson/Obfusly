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
        Refractal: 5,
        JSFuck: 10,
        Hexadecimal: 15,
        Octal: 20,
        Binary: 25
    },
    encodedFunctionStrength: 5,
    concealGlobalObjects: false,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 3, /* 0 - disabled, n - max splits */
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