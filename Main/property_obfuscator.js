const config = require('../Settings/config');
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
const { defaultedValues } = require('../Utils/Window/window_variables');
const { generateObfuscatedName } = require('../Utils/nameGenerator');
const { createIntegrity } = require('../Integrity/build');
const { buildConsoleDisabler } = require('../Defense/Builders/disable_console');
const { createDebuggerBundle } = require('../Defense/Builders/debugger');
const { getSplitCount, resetSplitCount } = require('../Primitives/Literals/splitting');

function _log(msg) { console.log(`[step ${++global.__jsscramble_step}] ${msg}`); }
function _stat(label, value) { console.log(`  ${label}: ${value}`); }

async function obfuscateProperties(sourceCode, windowName, previousDeclarationMapping) {
    updateSourceCode(sourceCode);

    const ast = acorn.parse(sourceCode, { ecmaVersion: 2020, range: true });

    clearDeclarationMapping(sourceCode);
    clearStringBuilder();
    stringBuilderModule.resetStrings();
    resetSplitCount();

    let numberCount = 0;
    const _t0 = Date.now();

    const decoderName = previousDeclarationMapping.get("decodeFunctionName") || generateObfuscatedName();
      if (config.numberCalculator) {
        declarationMapping.set("decodeFunctionName", decoderName);
        setDeclarationMapping("decodeFunctionName", decoderName);
      };
      if (config.stringEncoding) {
        const stringAccessorName = previousDeclarationMapping.get("stringAccessor") || generateObfuscatedName();
        declarationMapping.set("stringAccessor", stringAccessorName);
        setDeclarationMapping("stringAccessor", stringAccessorName);
      };

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

    if (!config.strictMode) declarationMapping.set("IIFEstringBreaker", generateObfuscatedName());

    while (!encodeModule && config.numberCalculator) await new Promise(r => setTimeout(r, 0));

    function encodeLocalNumber(number) {
        if (config.numberCalculator && Math.abs(number) <= 4099000000 && number > 100) {
            if (!numberCache[number]) {
                numberCount++;
                const isNegative = number < 0;
                const encodedValue = encodeModule.encode(number);
                let res = `${isNegative ? "-" : ""}${encodingAndDecodingPairs.decodeName}(${encodedValue})`;
                numberCache[number] = res;
                return res;
            } else {
                numberCount++;
                return numberCache[number];
            };
        } else if (config.globalBaseIntegerConcealment) {
            if (number <= 100) {
                numberCount++;
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

                numberCount++;
                return defaultedFunction(number, declarationMapping);
            };
        } else if (config.numberEncoding) {
            let percentageBasedConfig = { ...config.integerPrecentage };
            if (number <= 10 && config.integerPrecentage.JSFuck > 0) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

            let choice = pickWeightedRandom(percentageBasedConfig);

            let defaultedFunction;
            switch (choice) {
                case "JSFuck": defaultedFunction = toJSFuck; break;
                case "Hexadecimal": defaultedFunction = toHex; break;
                case "Octal": defaultedFunction = toOctal; break;
                case "Binary": defaultedFunction = toBinary; break;
                default: case "Refractal": defaultedFunction = toRefractal; break;
            };

            numberCount++;
            return defaultedFunction(number, declarationMapping);
        } else return number;
    }

    _log('Encoding literals and properties');

    estraverse.replace(ast, {
        enter(node) {
            if (node.type === "MemberExpression") {
                if (node.object.type === "ThisExpression") return createStringProperty(node, ['this', node.optional, (!node.computed ? encodeStringsRandom(node.property.name).raw : node.property.type === "Identifier" && node.computed ? node.property.name : node.property.type === "Literal" ? encodeStringsRandom(node.property.value).raw : sourceCode.slice(node.property.start, node.property.end))]);
                let properties = [...recursiveCallObject(node, [])].reverse();
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
            } else if (node.type === "Literal" && config.concealPrimitives && defaultedValues.includes(node.raw)) {
                node.type = "Identifier";
                node.name = `${previousDeclarationMapping.get(node.raw)}`;
            };
        }
    });

    let generated = escodegen.generate(ast);

    if (config.numberEncoding || config.numberCalculator || config.globalBaseIntegerConcealment) _stat('Numbers encoded', numberCount);
    if (config.stringConcealment) _stat('Strings concealed', stringBuilderModule.getStringCount());
    if (config.stringSplitting > 0) _stat('Split strings created', getSplitCount());
    if (config.concealGlobalObjects) _log(`Globals concealed (window -> ${windowName})`);
    if (config.concealPrimitives) _log(`Primitives concealed (${defaultedValues.length} values)`);

    if (!config.stringConcealment) generated = `${createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, encodeLocalNumber, false)}` + '\n' + generated;

    if (config.stringConcealment) {
        stringBuilderModule.setCommonVariables(declarationMapping);
        generated = "try{_ANTI_TERSER_}catch(err){};" + generated;
    };

    generated = `var ${declarationMapping.get("window")} = void 0;` + '\n' + generated;

    if (config.numberCalculator) {
        generated = encodingAndDecodingPairs.decoder + '\n' + generated;
    };

    if (config.globalBaseIntegerConcealment) {
        _log('Base integers built');
        const generateBaseInts = buildBaseInt(declarationMapping);
        generated = generateBaseInts + '\n' + generated;
    };

    if (!config.strictMode) {
        generated = `let ${declarationMapping.get("IIFEstringBreaker")} = ${stringBuilderModule.getBrokenIIFE()};` + '\n' + generated;
    };

    generated = generated.replace(/__ENCODED_STRINGS__x/g, '\\x');
    generated = generated.replace(/__ENCODED_STRINGS__u/g, '\\u');

    if (config.concealPrimitives) for (let primitive of defaultedValues) generated = `const ${previousDeclarationMapping.get(primitive)} = ${primitive}\n` + generated;

    if (config.compression) {
        _log('Compressing code');
        const result = await terser.minify(generated, {
            compress: { passes: 1 },
            mangle: false,
            format: {
                beautify: false,
                semicolons: true
            }
        });

        generated = (result.code || '').replace(/\r?\n+/g, '');
        _log('Compressed');
    };

    generated = generated.replace(/__LET_PLACEHOLDER__/g, 'let');

    if (config.integrityChecks && config.integrityChecks !== 'off') {
        _log('Injecting integrity checks');
        generated = createIntegrity(generated, previousDeclarationMapping, declarationMapping, encodingAndDecodingPairs, encodeModule);
    }

    generated = generated.replace(/__ENCODED_STRINGS__x/g, '\\x');
    generated = generated.replace(/__ENCODED_STRINGS__u/g, '\\u');

    /** Rebuild after integrity */
    if (config.stringConcealment) {
        _log('Building string concealment layer');
        let module = stringBuilderModule.buildStringConcealment(config.stringConcealmentSettings, encodingAndDecodingPairs, encodeModule);
        
        /** Work For Commas */
        const parts = generated.split("try{_ANTI_TERSER_}catch(err){}");
        generated = parts[0] + module + (parts[1] || '');
    };

    if (config.disableConsoleOutput && !config.strictMode) {
        _log('Console output disabled');
        generated = buildConsoleDisabler(config) + generated;
    };

    if (config.enableAntiDebugger && !config.strictMode) {
        _log('Anti-debugger protection injected');
        const [code, obfuscatedName, PASSPHRASE] = createDebuggerBundle(config);
        let passVar = generateObfuscatedName();
        const generatedIIFE = `((${passVar}) => { ${obfuscatedName}({ pass: ${passVar}, exec: true }); })("${PASSPHRASE}");`
        generated = code + generated + generatedIIFE;
    };

    if (!config.strictMode) {
        _log('Wrapped in Function constructor');
        generated = `new Function(${JSON.stringify(generated)})();`
    };

    const elapsed = Date.now() - (global.__jsscramble_start || _t0);
    console.log();
    _stat('Output size', `${(generated.length / 1024).toFixed(1)} KB`);
    _stat('Time taken', `${elapsed}ms`);
    console.log('Obfuscation complete');
    console.log();

    return generated;
}

module.exports = { obfuscateProperties };