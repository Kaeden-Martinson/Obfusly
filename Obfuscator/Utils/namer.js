/* Zalgo variable generator */
const usedZalgoVariableNames = new Set();
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

let blackListedNames = ['for', 'do', 'let', 'var', 'in', 'if', 'try', 'int', 'new', 'ui'];

/* Minfied variable generator */
function createMinifiedVariableGenerator() {
    let currentVariable = 'a';
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return function getNextVariable() {
        const variableName = currentVariable;
        let carry = true;

        let chars = currentVariable.split('');

        for (let i = chars.length - 1; i >= 0; i--) {
            if (!carry) break;

            const charIndex = alphabet.indexOf(chars[i]);
            if (charIndex === alphabet.length - 1) {
                chars[i] = alphabet[0];
            } else {
                chars[i] = alphabet[charIndex + 1];
                carry = false;
            }
        }

        if (carry) chars.unshift(alphabet[0]);

        currentVariable = chars.join('');

        if (blackListedNames.includes(variableName)) return getNextVariable();
        return variableName;
    };
}

const generateMinifiedVariable = createMinifiedVariableGenerator();

/* Invisable variable generator */
let allCombinations = [];
let combinationsCounter = 0;
let firstVariableCharacter = ['ㅤ', 'ᅟ', 'ᅠ', 'ﾠ'];
let nextCharacter = ["‍", "︀", "︁", "︂", "︃", "︄", "︅", "︆", "︇", "︈", "︉", "︊", "︋", "︌", "︍", "︎"];
for (let i = 0; i < firstVariableCharacter.length; i++) {
    for (let j = 0; j < nextCharacter.length; j++) {
        allCombinations.push(firstVariableCharacter[i] + nextCharacter[j]);
        for (let k = 0; k < nextCharacter.length; k++) {
            allCombinations.push(firstVariableCharacter[i] + nextCharacter[j] + nextCharacter[k]);
            for (let l = 0; l < nextCharacter.length; l++) {
                allCombinations.push(firstVariableCharacter[i] + nextCharacter[j] + nextCharacter[k] + nextCharacter[l]);
            }
        }
    }
}

let generateObfuscatedName = () => {
    switch ('zalgo') {
        case 'minify': return generateMinifiedVariable();
        case 'zalgo': return generateZalgoVariable();
        case 'invisable': return allCombinations[combinationsCounter++];
    }
};

module.exports = { generateObfuscatedName };