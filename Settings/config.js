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
        Refractal: 5,
        JSFuck: 10,
        Hexadecimal: 15,
        Octal: 20,
        Binary: 25
    },
    encodedFunctionStrength: 5,
    concealGlobalObjects: false,
    target: "browser",
    stringEncoding: false,
    stringSplitting: 3, /* 0 - disabled, n - max splits */
    optimizedStringCache: false,
    stringConcealment: false,
    stringConcealmentSettings: {
        decodersCount: 5,
        addNoiseCount: 5
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