
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
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let AZCombinations = [];
    for (let i = 0; i < letters.length; i++) {
        let a = letters[i];
        AZCombinations.push(a);
        for (let j = 0; j < letters.length; j++) {
            let b = a + letters[j];
            AZCombinations.push(b);
            for (let k = 0; k < letters.length; k++) {
                let c = b + letters[k];
                AZCombinations.push(c);
                for (let l = 0; l < letters.length; l++) {
                    let d = c + letters[l];
                    AZCombinations.push(d);
                };
            };
        };
    };
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