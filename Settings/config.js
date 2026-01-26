const config = {
    nameGenerationStyle: "minify", // Options: 'zalgo', 'minify', 'invisible'
    numberEncoding: false,
    optimzedNumberCache: true,
    numberCalculator: true,
    globalBaseIntegerConcealment: true,
    multipleVariableAssignments: true,
    shuffleBaseIntegers: true,
    baseIntegersDefault: "JSFuck",
    integerPrecentage: {
        Refractal: 60,
        JSFuck: 10,
        Hexadecimal: 10,
        Octal: 10,
        Binary: 10
    },
    encodedFunctionStrength: 5,
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: true,
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
    disableConsoleOutput: true,
    enableAntiDebugger: false,
};

module.exports = config;