const config = require("../../Settings/config");

const { encodeStringsRandom } = require("../../Primitives/Literals/strings");
const { generateObfuscatedName } = require("../nameGenerator");

function encodePlainString(str, encodeLocalNumber, encodingAndDecodingPairs) {
    return [...str].map(v => `String.fromCharCode(${encodingAndDecodingPairs?.decodeName ?? ""}(${encodeLocalNumber(v.charCodeAt())}))`).join("+");
}

function createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, encodeLocalNumber, isInStringIIFE, allowedToEncodeStrings = false) {
    const name = declarationMapping.get("window");
    const functionName = generateObfuscatedName();

    let randInt = Math.floor(Math.random() * 1000) + 10;
    const isNegative = randInt < 0;
    const encodedValue = encodeLocalNumber(randInt);

    let functionString = "";

    if (isInStringIIFE) {
        functionString = `let ${functionName} = `;
        functionString += `([${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map', true).raw}][${encodeStringsRandom('constructor', true).raw}](${encodeStringsRandom(`return ${config.target === "node" ? "global" : "self"}`, true).raw}));`;
        functionString +=
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__` +
            [...name].join('__QUOTE_OPERATORS__+__QUOTE_OPERATORS__') +
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__ = ${functionName}\`void 0\` || ${declarationMapping.get("null")};`;
    } else if (config.disableLocalIIFEs) {
        functionString += `(function ${generateObfuscatedName()}() { ${name} = typeof self === "object" ? self : global; })();`;
    } else {
        functionString = `let ${functionName} = `;
        if (!config.disableEval) functionString += `eval(\`(() => { return [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map').raw}][${encodeStringsRandom('constructor').raw}](${encodeStringsRandom(`return ${config.target === "node" ? "global" : "self"}`).raw})\\\`\\\`})\`);`;
        else functionString += `(() => { return [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${allowedToEncodeStrings ? encodeStringsRandom('map').raw : encodePlainString('map', encodeLocalNumber, encodingAndDecodingPairs)}][${allowedToEncodeStrings ? encodeStringsRandom('constructor').raw : encodePlainString('constructor', encodeLocalNumber, encodingAndDecodingPairs)}](${allowedToEncodeStrings ? encodeStringsRandom(`return ${config.target === "node" ? "global" : "self"}`).raw : encodePlainString(`return ${config.target === "node" ? "global" : "self"}`, encodeLocalNumber, encodingAndDecodingPairs)})\`\`});`;
        functionString += `${name} = ${functionName}\`void 0\` || ${declarationMapping.get("null")};`;
    }

    return functionString;
}

module.exports = { createObfuscatedWindow };