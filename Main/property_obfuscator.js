const config = require('../Settings/config');
const fs = require('fs').promises;
const terser = require('terser');

const acorn = require('acorn');
const estraverse = require('estraverse');
const astring = require('astring');

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

    const ast = acorn.parse(sourceCode, { ecmaVersion: 2022, range: true, sourceType: 'module' });

    clearDeclarationMapping(sourceCode);
    clearStringBuilder();
    stringBuilderModule.resetStrings();
    resetSplitCount();

    let numberCount = 0;
    const _t0 = Date.now();

    const decoderName = previousDeclarationMapping.get("decodeFunctionName") || generateObfuscatedName();
      if (config.numbers.strategy.useCalculator) {
        declarationMapping.set("decodeFunctionName", decoderName);
        setDeclarationMapping("decodeFunctionName", decoderName);
      };
      if (config.strings.encoding.enabled) {
        const stringAccessorName = previousDeclarationMapping.get("stringAccessor") || generateObfuscatedName();
        declarationMapping.set("stringAccessor", stringAccessorName);
        setDeclarationMapping("stringAccessor", stringAccessorName);
      };

    let numberCache = {};
    let encodeModule;

    let encodingAndDecodingPairs;
    let generateBaseInts;

    if (config.numbers.strategy.useBaseIntegers) {
        buildBaseNames(declarationMapping);
        generateBaseInts = buildBaseInt(declarationMapping);
    };

    const sessionToken = Date.now();

    if (config.numbers.strategy.useCalculator) {
        encodingAndDecodingPairs = createEncodeAndDecodingPairs(declarationMapping);

        fs.writeFile(
            `Encoders/encoder_${sessionToken}.js`,
            (generateBaseInts + "\n" + encodingAndDecodingPairs.encoder),
            "utf-8"
        ).then(async () => {
            encodeModule = require(`../Encoders/encoder_${sessionToken}.js`);
        }).catch(err => {
            console.error("Error writing file:", err);
        })
    };

    declarationMapping.set("window", windowName);
    declarationMapping.set("Function", generateObfuscatedName());
    setDeclarationMapping("window", windowName);

    if (config.strings.concealment.enabled) {
        stringBuilderModule.setCommonVariables(declarationMapping);
        setStringBuilder(stringBuilderModule);
    };

    if (!config.output.strictMode) declarationMapping.set("IIFEstringBreaker", generateObfuscatedName());

    while (!encodeModule && config.numbers.strategy.useCalculator) await new Promise(r => setTimeout(r, 0));

    function encodeLocalNumber(number) {
        if (config.numbers.strategy.useCalculator && Math.abs(number) <= 4099000000 && number > 100) {
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
        } else if (config.numbers.strategy.useBaseIntegers) {
            if (number <= 100) {
                numberCount++;
                if (config.numbers.cache.multipleAssignments && number !== 100 && number !== 0) {
                    let shuffledVariableName = Math.floor(Math.random() * 4);
                    if (shuffledVariableName !== 0) return declarationMapping.get(`variable_numbers_${shuffledVariableName}_${number}`);
                };

                return declarationMapping.get(`variable_numbers_${number}`);
            } else if (config.numbers.enabled) {
                let choice = pickWeightedRandom(config.numbers.baseIntegerFormat.distribution);

                let defaultedFunction;
                switch (choice) {
                    case "Hexadecimal": defaultedFunction = toHex; break;
                    case "Octal": defaultedFunction = toOctal; break;
                    case "Binary": defaultedFunction = toBinary; break;
                    default: case "Refractal": defaultedFunction = toRefractal; break;
                };

                numberCount++;
                return defaultedFunction(number, declarationMapping);
            } else return number;
        } else if (config.numbers.enabled) {
            let percentageBasedConfig = { ...config.numbers.baseIntegerFormat.distribution };
            if (number <= 10 && config.numbers.baseIntegerFormat.distribution.JSFuck > 0) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

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
            if (node.type === "ImportDeclaration") if (node.source && node.source.type === "Literal") node.source.dontObfuscate = true;

            if (node.type === "MemberExpression") {
                /* #private members must stay as `.#name` — bracketing them (obj["name"]) turns a private access
                   into a public one (undefined) and is a syntax error for a true private field. Leave untouched. */
                if (node.property && node.property.type === "PrivateIdentifier") return node;
                if (node.object.type === "ThisExpression") return createStringProperty(node, ['this', node.optional, (!node.computed ? encodeStringsRandom(node.property.name).raw : node.property.type === "Identifier" && node.computed ? node.property.name : node.property.type === "Literal" ? encodeStringsRandom(node.property.value).raw : sourceCode.slice(node.property.start, node.property.end))]);
                let properties = [...recursiveCallObject(node, [])].reverse();
                if (properties[0] === false) properties.splice(0, 1);
                return createStringProperty(node, properties);
            };

            if (node.type === "Literal" && typeof node.value === "string" && !node.dontObfuscate) {
                node.name = encodeStringsRandom(node.value).raw;
                node.type = "Identifier";
            } else if (node.type === "Literal" && typeof node.value === "number" && Math.floor(node.value) == node.value) {
                const result = encodeLocalNumber(node.value);
                node.type = "Identifier";
                node.name = result;
            } else if (node.type === "Literal" && config.globals.concealPrimitives && defaultedValues.includes(node.raw)) {
                node.type = "Identifier";
                node.name = `${previousDeclarationMapping.get(node.raw)}`;
            };
        }
    });

    let generated = astring.generate(ast);

    if (config.numbers.enabled || config.numbers.strategy.useCalculator || config.numbers.strategy.useBaseIntegers) _stat('Numbers encoded', numberCount);
    if (config.strings.concealment.enabled) _stat('Strings concealed', stringBuilderModule.getStringCount());
    if (config.strings.splitting.maxFragments > 0) _stat('Split strings created', getSplitCount());
    if (config.globals.concealWindowObject) _log(`Globals concealed (window -> ${windowName})`);
    if (config.globals.concealPrimitives) _log(`Primitives concealed (${defaultedValues.length} values)`);

    if (!config.strings.concealment.enabled) generated = `${createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, encodeLocalNumber, false)}` + '\n' + generated;

    if (config.strings.concealment.enabled) {
        stringBuilderModule.setCommonVariables(declarationMapping);
        generated = "try{_ANTI_TERSER_}catch(err){};" + generated;
    };

    generated = `var ${declarationMapping.get("window")} = void 0;` + '\n' + generated;

    if (config.numbers.strategy.useCalculator) {
        generated = encodingAndDecodingPairs.decoder + '\n' + generated;
    };

    if (config.numbers.strategy.useBaseIntegers) {
        _log('Base integers built');
        const generateBaseInts = buildBaseInt(declarationMapping);
        generated = generateBaseInts + '\n' + generated;
    };

    if (!config.output.strictMode) {
        generated = `let ${declarationMapping.get("IIFEstringBreaker")} = ${stringBuilderModule.getBrokenIIFE()};` + '\n' + generated;
    };

    generated = generated.replace(/__ENCODED_STRINGS__x/g, '\\x');
    generated = generated.replace(/__ENCODED_STRINGS__u/g, '\\u');

    if (config.globals.concealPrimitives) for (let primitive of defaultedValues) generated = `const ${previousDeclarationMapping.get(primitive)} = ${primitive}\n` + generated;

    if (config.output.compression) {
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

    if (config.protection.integrityChecks && config.protection.integrityChecks !== 'off') {
        _log('Injecting integrity checks');
        generated = createIntegrity(generated, previousDeclarationMapping, declarationMapping, encodingAndDecodingPairs, encodeModule);
    }

    generated = generated.replace(/__LET_PLACEHOLDER__/g, 'let');
    generated = generated.replace(/__ENCODED_STRINGS__x/g, '\\x');
    generated = generated.replace(/__ENCODED_STRINGS__u/g, '\\u');

    /** Rebuild after integrity */
    if (config.strings.concealment.enabled) {
        _log('Building string concealment layer');
        let module = stringBuilderModule.buildStringConcealment({
            decodersCount: config.strings.concealment.decoderLayers,
            addNoiseCount: config.strings.concealment.noiseFunctions
        }, encodingAndDecodingPairs, encodeModule);
        
        /** Work For Commas */
        const parts = generated.split("try{_ANTI_TERSER_}catch(err){}");
        generated = parts[0] + module + (parts[1] || '');
    };

    if (config.protection.disableConsole && !config.output.strictMode) {
        _log('Console output disabled');
        generated = buildConsoleDisabler(config) + generated;
    };

    if (config.protection.antiDebugger && !config.output.strictMode) {
        _log('Anti-debugger protection injected');
        const [code, obfuscatedName, PASSPHRASE] = createDebuggerBundle(config);
        let passVar = generateObfuscatedName();
        const generatedIIFE = `((${passVar}) => { ${obfuscatedName}({ pass: ${passVar}, exec: true }); })("${PASSPHRASE}");`
        generated = code + generated + generatedIIFE;
    };

    if (!config.output.strictMode) {
        _log('Wrapped in Function constructor');
        generated = `new Function(${JSON.stringify(generated)})();`
    };

    const elapsed = Date.now() - (global.__jsscramble_start || _t0);
    console.log();
    _stat('Output size', `${(generated.length / 1024).toFixed(1)} KB`);
    console.log('Time taken', `${elapsed}ms`);
    console.log('Obfuscation complete');
    console.log();

    fs.unlink(`Encoders/encoder_${sessionToken}.js`).catch(() => {});

    return generated;
}

module.exports = { obfuscateProperties };