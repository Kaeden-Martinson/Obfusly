const { encodeStringsRandom } = require("../../Primitives/Literals/strings");
const { generateObfuscatedName } = require("../nameGenerator");

function createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, encodeLocalNumber, isInStringIIFE) {
    const name = declarationMapping.get("window");
    const functionName = generateObfuscatedName();

    let randInt = Math.floor(Math.random() * 1000) + 10;
    const isNegative = randInt < 0;
    const encodedValue = encodeLocalNumber(randInt);
    
    let functionString = `let ${functionName} = `;

    if (isInStringIIFE) {
        functionString += `([${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map', true).raw}][${encodeStringsRandom('constructor', true).raw}](${encodeStringsRandom('return top', true).raw}));`;
        functionString +=
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__` +
            [...name].join('__QUOTE_OPERATORS__+__QUOTE_OPERATORS__') +
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__ = ${functionName}\`void 0\` || ${declarationMapping.get("Function")};`;
    } else {
        functionString += `eval(\`(() => { return [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map').raw}][${encodeStringsRandom('constructor').raw}](${encodeStringsRandom('return top').raw})\\\`\\\`})\`);`;

        functionString += `${name} = ${functionName}\`void 0\` || ${declarationMapping.get("Function")};`;
    }

    return functionString;
}

module.exports = { createObfuscatedWindow };