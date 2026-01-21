
/* Zalgo variable generator */
let usedZalgoVariableNames = new Set();
function generateZalgoVariable() {
    var intensity = 2;
    var length = 1;
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let zalgoVariableName;
    do {
        let result = "ͺ".repeat(length);
        let zalgoDistortedResult = "";
        for (let i = 0; i < result.length; i++) {
            zalgoDistortedResult += result[i];
            for (let j = 0; j < intensity; j++) zalgoDistortedResult += String.fromCharCode(getRandomInt(768, 879));
        }
        zalgoVariableName = zalgoDistortedResult;
    } while (usedZalgoVariableNames.has(zalgoVariableName));
    usedZalgoVariableNames.add(zalgoVariableName);
    return zalgoVariableName;
};

/* Shuffle and Sort Function */
function shuffleAndSort(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    };
    return arr.map((str, index) => ({ str, index })).sort((a, b) => { if (a.str.length !== b.str.length) return a.str.length - b.str.length; return a.index - b.index; }).map(obj => obj.str);
};

/* AZ variable generator (475,254 Variables) */
function generateAZVariables() {
    const letters = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numbers = "0123456789".split('');
    const combined = [...letters, ...numbers];
    let AZCombinations = [];

    for (let i = 0; i < letters.length; i++) {
        let a = letters[i];
        AZCombinations.push(a);
        for (let j = 0; j < combined.length; j++) {
            let b = a + combined[j];
            AZCombinations.push(b);
            for (let k = 0; k < combined.length; k++) {
                let c = b + combined[k];
                AZCombinations.push(c);
                for (let l = 0; l < combined.length; l++) {
                    let d = c + combined[l];
                    AZCombinations.push(d);
                };
            };
        };
    };

    const reserved = [
        "break", "case", "catch", "class", "const", "continue", "debugger", "default",
        "delete", "do", "else", "export", "extends", "finally", "for", "function",
        "if", "import", "in", "instanceof", "new", "return", "super", "switch",
        "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield"
    ];

    const strictReserved = [
        "implements", "interface", "let", "package", "private",
        "protected", "public", "static"
    ];

    const futureReserved = [
        "enum", "await"
    ];

    const literals = [
        "true", "false", "null"
    ];

    const globals = [
        "top", "Object", "Function", "Array", "Number", "String", "Boolean", "BigInt",
        "Symbol", "Math", "Date", "RegExp", "Error", "EvalError", "RangeError",
        "ReferenceError", "SyntaxError", "TypeError", "URIError",
        "JSON", "Reflect", "Proxy", "Promise", "Map", "Set", "WeakMap", "WeakSet",
        "Intl", "Atomics", "SharedArrayBuffer", "ArrayBuffer", "DataView",
        "Uint8Array", "Int8Array", "Uint16Array", "Int16Array", "Uint32Array",
        "Int32Array", "Float32Array", "Float64Array",
        "parseInt", "parseFloat", "isNaN", "isFinite", "eval"
    ];

    const runtimeGlobals = [
        "window", "document", "globalThis", "global", "self", "console",
        "setTimeout", "setInterval", "clearTimeout", "clearInterval",
        "requestAnimationFrame", "cancelAnimationFrame",
        "process", "require", "module", "exports", "__dirname", "__filename"
    ];

    const INVALID_NAMES = new Set([
        ...reserved,
        ...strictReserved,
        ...futureReserved,
        ...literals,
        "undefined",
        ...globals,
        ...runtimeGlobals
    ]);

    AZCombinations = AZCombinations.filter(name => !INVALID_NAMES.has(name));

    return shuffleAndSort(AZCombinations);
};

/* Invisible variable generator (17,476 Variables) */
function generateInvisibleVariables() {
    let InvisableCombinations = [];
    let firstInvisableChar = ['ㅤ', 'ᅟ', 'ᅠ', 'ﾠ'];
    let zeroWidthChar = ["‍", "︀", "︁", "︂", "︃", "︄", "︅", "︆", "︇", "︈", "︉", "︊", "︋", "︌", "︍", "︎"];
    for (let i = 0; i < firstInvisableChar.length; i++) {
        InvisableCombinations.push(firstInvisableChar[i]);
        for (let j = 0; j < zeroWidthChar.length; j++) {
            InvisableCombinations.push(firstInvisableChar[i] + zeroWidthChar[j]);
            for (let k = 0; k < zeroWidthChar.length; k++) {
                InvisableCombinations.push(firstInvisableChar[i] + zeroWidthChar[j] + zeroWidthChar[k]);
                for (let l = 0; l < zeroWidthChar.length; l++) {
                    InvisableCombinations.push(firstInvisableChar[i] + zeroWidthChar[j] + zeroWidthChar[k] + zeroWidthChar[l]);
                };
            };
        };
    };
    return shuffleAndSort(InvisableCombinations);
};

/* Variable Arrays and Generators */
let AZCombinations = generateAZVariables();
let AZCount = 0;
let InvisableCombinations = generateInvisibleVariables();
let InvisableCount = 0;

let generateObfuscatedName = () => {
    // console.log(AZCombinations[AZCount])
    switch ('minify') {
        case 'zalgo': return generateZalgoVariable();
        case 'minify': return AZCombinations[AZCount++];
        case 'invisable': return InvisableCombinations[InvisableCount++];
    };
};

let clearOldNames = () => {
    usedZalgoVariableNames = new Set();
    /* Regenerate AZ and Invisable Variables And Reset Counts */
    AZCombinations = generateAZVariables()
    AZCount = 0;
    InvisableCombinations = generateInvisibleVariables()
    InvisableCount = 0;

};

module.exports = { generateObfuscatedName, clearOldNames };