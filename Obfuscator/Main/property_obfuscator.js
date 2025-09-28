const config = require('../Settings/config.json');

const fs = require('fs').promises;
const terser = require('terser');

const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

/** Obfuscation Imports */
let { declarationMapping, clearDeclarationMapping, setDeclarationMapping } = require('../Utils/naming');
const { encodeStringsRandom, setStringBuilder, clearStringBuilder } = require('../Primitives/Literals/strings');
const { recursiveCallObject, createStringProperty, updateSourceCode } = require('../Functions/object');
const { buildBaseInt } = require('../Primitives/Integers/Builders/base_int');
const { buildBaseNames } = require('../Primitives/Integers/Builders/base_naming');

const { toJSFuck } = require('../Primitives/Integers/jsfuck');
const { toHex } = require('../Primitives/Integers/hexadecimal');
const { toOctal } = require('../Primitives/Integers/octal');
const { toBinary } = require('../Primitives/Integers/binary');
const { toRefractal } = require('../Primitives/Integers/refractal');
const { pickWeightedRandom } = require('../Utils/weights');
const { createEncodeAndDecodingPairs } = require('../Primitives/Integers/Builders/encode_decode');

const stringBuilderModule = require('../Primitives/Literals/Builders/strings');
const { createObfuscatedWindow } = require('../Utils/Window/window');
const { defaultedValues } = require('../Utils/window/window_variables');
const { generateObfuscatedName } = require('../Utils/namer');

async function obfuscateProperties(sourceCode, windowName, previousDeclarationMapping) {
    updateSourceCode(sourceCode);

    const ast = acorn.parse(sourceCode, { ecmaVersion: 2020, range: true });

    clearDeclarationMapping(sourceCode);
    clearStringBuilder();
    stringBuilderModule.resetStrings();

    let numberCache = {};
    let encodeModule;

    let encodingAndDecodingPairs;
    let generateBaseInts;

    if (config.globalBaseIntegerConcealment) {
        buildBaseNames(declarationMapping);
        generateBaseInts = buildBaseInt(declarationMapping);
    };

    if (config.numberCalculator) {
        encodingAndDecodingPairs = createEncodeAndDecodingPairs(declarationMapping);

        fs.writeFile(
            "Encoders/encoder.js",
            (generateBaseInts + "\n" + encodingAndDecodingPairs.encoder),
            "utf-8"
        ).then(async () => {
            delete require.cache[require.resolve('../Encoders/encoder')];
            encodeModule = require('../Encoders/encoder');
        }).catch(err => {
            console.error("Error writing file:", err);
        })
    };

    declarationMapping.set("window", windowName);
    declarationMapping.set("Function", generateObfuscatedName());
    setDeclarationMapping("window", windowName);

    if (config.stringConcealment) {
        stringBuilderModule.setCommonVariables(declarationMapping);
        setStringBuilder(stringBuilderModule);
    };

    if (config.breakIIFEString) declarationMapping.set("IIFEstringBreaker", generateObfuscatedName());

    while (!encodeModule && config.numberCalculator) await new Promise(r => setTimeout(r, 0));

    function encodeLocalNumber(number) {
        if (config.numberCalculator && Math.abs(number) <= 4099000000 && number > 100) {
            if (!numberCache[number]) {
                const isNegative = number < 0;
                const encodedValue = encodeModule.encode(number);
                let res = `${isNegative ? "-" : ""}${encodingAndDecodingPairs.decodeName}(${encodedValue})`;
                numberCache[number] = res;
                return res;
            } else {
                return numberCache[number];
            };
        } else if (config.globalBaseIntegerConcealment) {
            if (number <= 100) {
                if (config.multipleVariableAssignments && number !== 100 && number !== 0) {
                    let shuffledVariableName = Math.floor(Math.random() * 4);
                    if (shuffledVariableName !== 0) return declarationMapping.get(`variable_numbers_${shuffledVariableName}_${number}`);
                };

                return declarationMapping.get(`variable_numbers_${number}`);
            } else if (config.numberEncoding) {
                let choice = pickWeightedRandom(config.integerPrecentage);

                let defaultedFunction;
                switch (choice) {
                    case "Hexadecimal": defaultedFunction = toHex; break;
                    case "Octal": defaultedFunction = toOctal; break;
                    case "Binary": defaultedFunction = toBinary; break;
                    default: case "Refractal": defaultedFunction = toRefractal; break;
                };

                return defaultedFunction(number, declarationMapping);
            };
        } else if (config.numberEncoding) {
            let percentageBasedConfig = config.integerPrecentage;
            if (number <= 10) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

            let choice = pickWeightedRandom(percentageBasedConfig);

            let defaultedFunction;
            switch (choice) {
                case "JSFuck": defaultedFunction = toJSFuck; break;
                case "Hexadecimal": defaultedFunction = toHex; break;
                case "Octal": defaultedFunction = toOctal; break;
                case "Binary": defaultedFunction = toBinary; break;
                default: case "Refractal": defaultedFunction = toRefractal; break;
            };

            return defaultedFunction(number, declarationMapping);
        } else return number;
    }

    estraverse.replace(ast, {
        enter(node) {
            if (node.type === "MemberExpression") {
                if (node.object.type === "ThisExpression") return createStringProperty(node, ['this', node.optional, encodeStringsRandom(node.property.name).raw]);
                let properties = [...recursiveCallObject(node, [])].reverse();
                // console.log(properties)
                if (properties[0] === false) properties.splice(0, 1);
                return createStringProperty(node, properties);
            };

            if (node.type === "Literal" && typeof node.value === "string") {
                node.name = encodeStringsRandom(node.value).raw;
                node.type = "Identifier";
            } else if (node.type === "Literal" && typeof node.value === "number" && Math.floor(node.value) == node.value) {
                const result = encodeLocalNumber(node.value);
                node.type = "Identifier";
                node.name = result;
            };
        }
    });

    let generated = escodegen.generate(ast);

    let randInt = Math.floor(Math.random() * 1000) + 10;
    const isNegative = randInt < 0;
    const encodedValue = encodeLocalNumber(randInt);

    if (!config.wrapStringsInIIFE || !config.stringConcealment) generated = `${createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, encodeLocalNumber, false)}` + '\n' + generated;

    if (config.stringConcealment) {
        stringBuilderModule.setCommonVariables(declarationMapping);
        generated = stringBuilderModule.buildStringConcealment(config.stringConcealmentSettings, encodingAndDecodingPairs, encodeModule) + '\n' + generated;
    };

    generated = `let ${declarationMapping.get("window")} = void 0;` + '\n' + generated;

    generated = `let ${declarationMapping.get("Function")} = [${isNegative ? "-" : ""}${encodingAndDecodingPairs?.decodeName ?? ""}(${encodedValue})][${[...'map'].map(v => `String.fromCharCode(${encodeLocalNumber(v.charCodeAt())})`).join("+")}][${[...'constructor'].map(v => `String.fromCharCode(${encodeLocalNumber(v.charCodeAt())})`).join("+")}];` + '\n' + generated;

    if (config.numberCalculator) {
        generated = encodingAndDecodingPairs.decoder + '\n' + generated;
    };

    if (config.globalBaseIntegerConcealment) {
        const generateBaseInts = buildBaseInt(declarationMapping);
        generated = generateBaseInts + '\n' + generated;
    };

    if (config.breakIIFEString) {
        generated = `let ${declarationMapping.get("IIFEstringBreaker")} = ${stringBuilderModule.getBrokenIIFE()};` + '\n' + generated;
    };

    if (config.concealPrimitives) {
        for (let primitive of defaultedValues) {
            generated = generated.replaceAll(primitive, previousDeclarationMapping.get(primitive));
            generated = `const ${previousDeclarationMapping.get(primitive)} = ${primitive}\n` + generated;
        };
    };

    generated = generated.replace(/__ENCODED_STRINGS__x/g, '\\x');
    generated = generated.replace(/__ENCODED_STRINGS__u/g, '\\u');

    if (config.compression) {
        const result = await terser.minify(generated, {
            compress: { passes: 1 },
            mangle: false,
            format: {
                beautify: false,
                semicolons: true
            }
        });

        generated = (result.code || '').replace(/\r?\n+/g, '');
    };

    return generated;
}

module.exports = { obfuscateProperties };