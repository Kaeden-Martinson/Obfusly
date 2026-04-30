const config = require("../../Settings/config");

const { encodeStringsRandom } = require("../../Primitives/Literals/strings");
const { generateObfuscatedName } = require("../nameGenerator");
const { compress, removeSpacesAndNewlines } = require("../compressor");

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

    const globalRef = "globalThis";

    if (isInStringIIFE) {
        functionString = `let ${functionName} = `;
        functionString += `([${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map', true).raw}][${encodeStringsRandom('constructor', true).raw}](${encodeStringsRandom(`return ${globalRef}`, true).raw}));`;
        functionString +=
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__` +
            [...name].join('__QUOTE_OPERATORS__+__QUOTE_OPERATORS__') +
            `__QUOTE_OPERATORS__+__QUOTE_OPERATORS__ = ${functionName}\`void 0\` || ${declarationMapping.get("null")};`;
    } else if (config.output.strictMode) {
        functionString += `(function ${generateObfuscatedName()}() { ${name} = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : global; })();`;
    } else {
        functionString = `let ${functionName} = `;
        if (!config.output.strictMode) {
            let innerString = `(() => { return [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${encodeStringsRandom('map').raw}][${encodeStringsRandom('constructor').raw}](${encodeStringsRandom(`return ${globalRef}`).raw})\`\`});`;
            if (config.output.compression) innerString = removeSpacesAndNewlines(innerString);
            innerString = innerString.replace(/`/g, '\\`');
            functionString += `eval(\`${(innerString)}\`);`;
        } else functionString += `(() => { return [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${allowedToEncodeStrings ? encodeStringsRandom('map').raw : encodePlainString('map', encodeLocalNumber, encodingAndDecodingPairs)}][${allowedToEncodeStrings ? encodeStringsRandom('constructor').raw : encodePlainString('constructor', encodeLocalNumber, encodingAndDecodingPairs)}](${allowedToEncodeStrings ? encodeStringsRandom(`return ${globalRef}`).raw : encodePlainString(`return ${globalRef}`, encodeLocalNumber, encodingAndDecodingPairs)})\`\`});`;
        functionString += `${name} = ${functionName}\`void 0\` || ${declarationMapping.get("null")};`;
    }

    return functionString;
}

module.exports = { createObfuscatedWindow };