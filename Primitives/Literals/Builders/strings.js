const config = require('../../../Settings/config');
const { pickWeightedRandom } = require('../../../Utils/weights');
const { toBinary } = require('../../Integers/binary');
const { toHex } = require('../../Integers/hexadecimal');
const { toJSFuck } = require('../../Integers/jsfuck');
const { toOctal } = require('../../Integers/octal');
const { toRefractal } = require('../../Integers/refractal');

const { createObfuscatedWindow } = require('../../../Utils/Window/window');
const { breakShuffleAndBuild } = require('./iife');
const { encodeParts, buildDecoderSnippet } = require('./encoder');
const { generateObfuscatedName } = require('../../../Utils/nameGenerator');
const { compress, removeSpacesAndNewlines } = require('../../../Utils/compressor');

let builtStrings = [];
let builtStringsMap = new Map(); // O(1) lookup replacing O(n) includes/indexOf

function rndName() {
    return generateObfuscatedName();
}

function generateRandomKey(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

let getFnName = "__STRING__ACCESSOR__";
let iifeFnName = rndName();

let localBrokenIIFE = [];

let declarationMapping = new Map();

function resetStrings() { builtStrings = []; builtStringsMap = new Map(); declarationMapping = new Map(); getFnName = rndName(); iifeFnName = rndName(); localBrokenIIFE = []; };

function getStringCount() { return builtStrings.length; };

function setCommonVariables(declarationMapping_) { declarationMapping = declarationMapping_; getFnName = declarationMapping.get("stringAccessor") || getFnName; };

function encodeNumber(num) {
    if (config.numbers.strategy.useBaseIntegers) {
        if (num <= 100) {
            if (config.numbers.cache.multipleAssignments && num !== 100 && num !== 0) {
                let shuffledVariableName = Math.floor(Math.random() * 4);
                if (shuffledVariableName !== 0) return declarationMapping.get(`variable_numbers_${shuffledVariableName}_${num}`);
            };

            return declarationMapping.get(`variable_numbers_${num}`);
        } else if (config.numbers.enabled) {
            let choice = pickWeightedRandom(config.numbers.baseIntegerFormat.distribution);

            let defaultedFunction;
            switch (choice) {
                case "Hexadecimal": defaultedFunction = toHex; break;
                case "Octal": defaultedFunction = toOctal; break;
                case "Binary": defaultedFunction = toBinary; break;
                default: case "Refractal": defaultedFunction = toRefractal; break;
            };

            return defaultedFunction(num, declarationMapping);
        };
    } else if (config.numbers.enabled) {
        let percentageBasedConfig = { ...config.numbers.baseIntegerFormat.distribution };
        if (num <= 10) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

        let choice = pickWeightedRandom(percentageBasedConfig);

        let defaultedFunction;
        switch (choice) {
            case "JSFuck": defaultedFunction = toJSFuck; break;
            case "Hexadecimal": defaultedFunction = toHex; break;
            case "Octal": defaultedFunction = toOctal; break;
            case "Binary": defaultedFunction = toBinary; break;
            default: case "Refractal": defaultedFunction = toRefractal; break;
        };

        return defaultedFunction(num, declarationMapping);
    };

    return num;
}

function addString(s, isInIIFE) {
    if (typeof s !== 'string') s = String(s);
    const existing = builtStringsMap.get(s);
    if (existing !== undefined) return `${isInIIFE ? iifeFnName : getFnName}(${encodeNumber(existing)})`;
    
    const idx = builtStrings.length;
    builtStrings.push(s);
    builtStringsMap.set(s, idx);

    return `${isInIIFE ? iifeFnName : getFnName}(${encodeNumber(idx)})`;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function testBuilder() {
    localBrokenIIFE = "window";
}

function buildStringConcealment(opts = {}, encodingAndDecodingPairs, encodeModule) {
    const {
        decodersCount = 10,
        addNoiseCount = 3
    } = opts;

    let builtWindowObject = createObfuscatedWindow(declarationMapping, encodingAndDecodingPairs, (config.numberCalculator ? encodeModule.encode : encodeNumber), !config.strictMode, !config.strictMode);

    if (!builtStrings.length) return '// (no strings added)\n';

    const OB_ALPHABET = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()";
    const STD_B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    let pool = Array.from(new Set(OB_ALPHABET.split('')));
    if (pool.length < 64) {
        for (let i = 33; i <= 126 && pool.length < 64; i++) {
            const ch = String.fromCharCode(i);
            if (!pool.includes(ch)) pool.push(ch);
        }
    }
    shuffle(pool);
    const custom64 = pool.slice(0, 64).join('');
    const remaining = Array.from(new Set(OB_ALPHABET.split('').concat(pool))).filter(c => !custom64.includes(c));
    const paddingChar = remaining.length ? remaining[Math.floor(Math.random() * remaining.length)] : '_';

    const encoded = builtStrings.map(s => {
        const b64 = Buffer.from(s, 'utf8').toString('base64');
        return b64.split('').map(ch => {
            if (ch === '=') return paddingChar;
            const idx = STD_B64.indexOf(ch);
            return idx >= 0 ? custom64[idx] : ch;
        }).join('');
    });

    const encArrName = rndName();
    const cmapName = rndName();
    const cacheName = rndName();
    const stdB64Name = rndName();
    const padName = rndName();
    const decGroupName = rndName();
    const assignName = rndName();

    const assignedDecoder = encoded.map(() => Math.floor(Math.random() * decodersCount));

    const decoderNames = Array.from({ length: decodersCount }, () => rndName());

    function makeNoiseBlock() {
        const a = Math.floor(Math.random() * 0xffff);
        const b = Math.floor(Math.random() * 0xffff);
        const c = Math.floor(Math.random() * 0xff);
        const n1 = rndName();
        const n2 = rndName();
        const i = rndName();
        const lines = [];
        lines.push(`var ${n1} = ${encodeNumber(a)} ^ ${encodeNumber(b)};`);
        lines.push(`var ${n2} = (${n1} * ${encodeNumber(c)}) & 0xffff;`);
        lines.push(`if ((${n2} & ${encodeNumber(1)}) === ${encodeNumber(0)}){ ${n2} = (${n2} >>> ${encodeNumber(1)}) ^ ${encodeNumber(a)}; } else { ${n2} = (${n2} << ${encodeNumber(1)}) ^ ${encodeNumber(b)}; };`);
        lines.push(`for (var ${i} =${encodeNumber(0)};${i} < ${(encodeNumber(a % 3))}; ${i}++){ ${n2} = (${n2} + ${i}) & 0xffff; };`);
        return { lines, ret: n2 };
    }

    const parts = [];

    parts.push(`var ${encArrName} = [${encoded.map(s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`).join(',')}];`);
    parts.push(`var ${cmapName} = '${custom64.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';`);
    // Build O(1) reverse lookup object instead of O(64) indexOf per character
    const lookupName = rndName();
    const lookupIdx = rndName();
    parts.push(`var ${lookupName}={};for(var ${lookupIdx}=${encodeNumber(0)};${lookupIdx}<${cmapName}.length;${lookupIdx}++)${lookupName}[${cmapName}.charAt(${lookupIdx})]=${lookupIdx};`);
    parts.push(`var ${cacheName} = new Array(${encodeNumber(encoded.length)}).fill(null);`);
    parts.push(`var ${stdB64Name} = '${STD_B64}';`);
    parts.push(`var ${padName} = '${paddingChar.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';`);

    for (let di = 0; di < decodersCount; di++) {
        const fnName = decoderNames[di];
        const idxParam = rndName();
        const sVar = rndName();
        const outVar = rndName();
        const resVar = rndName();
        const fakeCompVar = rndName();
        const zVar = rndName();
        const loopVar = rndName();
        const noiseBlocks = [];
        const noiseRets = [];

        for (let n = 0; n < addNoiseCount; n++) {
            const nb = makeNoiseBlock();
            noiseBlocks.push(nb.lines);
            noiseRets.push(nb.ret);
        }

        const fnLines = [];
        fnLines.push(`function ${fnName}(${idxParam}){`);
        fnLines.push(`  if(${cacheName}[${idxParam}] !== null && ${cacheName}[${idxParam}] !== undefined) return ${cacheName}[${idxParam}];`);

        noiseBlocks.forEach((blkLines) => {
            blkLines.forEach(l => fnLines.push(`  ${l}`));
        });

        const compositeExpr = noiseRets.length ? noiseRets.map(r => `(${r})`).join(' ^ ') : '0';
        fnLines.push(`  var ${fakeCompVar} = ${compositeExpr} & 0xffff;`);
        fnLines.push(`  if( (${fakeCompVar} & ${encodeNumber(3)}) === ${encodeNumber(1)} ) { ${fakeCompVar} = (${fakeCompVar} << ${encodeNumber(1)}) ^ 0x55aa; };`);

        fnLines.push(`  var ${sVar} = ${encArrName}[${idxParam}];`);
        fnLines.push(`  var ${outVar} = '';`);
        fnLines.push(`  for(var ${loopVar}=${encodeNumber(0)}; ${loopVar}<${sVar}.length; ${loopVar}++){`);
        fnLines.push(`    var ${rndName()} = ${sVar}.charAt(${loopVar});`);
        fnLines.push(`    var ${rndName()} = ${cmapName}.indexOf(${rndName()});`);

        fnLines.pop();

        const chName = rndName();
        const posName = rndName();
        fnLines.push(`  for(var ${loopVar}=${encodeNumber(0)}; ${loopVar}<${sVar}.length; ${loopVar}++){`);
        fnLines.push(`    var ${chName} = ${sVar}.charAt(${loopVar});`);
        fnLines.push(`    var ${posName} = ${lookupName}[${chName}];`);
        fnLines.push(`    if(${posName} !== undefined) ${outVar} += ${stdB64Name}.charAt(${posName}); else if(${chName} === ${padName}) ${outVar} += '='; else ${outVar} += ${chName};`);
        fnLines.push(`  };`);

        fnLines.push(`  var ${resVar} = '';`);
        fnLines.push(`  if(typeof Buffer !== 'undefined'){`);
        fnLines.push(`    try{ ${resVar} = Buffer.from(${outVar}, 'base64').toString('utf8'); }catch(e){ ${resVar} = ${outVar}; }`);
        fnLines.push(`  } else {`);
        fnLines.push(`    try{ ${resVar} = decodeURIComponent(Array.prototype.map.call(atob(${outVar}), function(c){ return '%' + ('00' + c.charCodeAt(${encodeNumber(0)}).toString(${encodeNumber(16)})).slice(-${encodeNumber(2)}); }).join('')); }catch(e){ ${resVar} = ${outVar}; }`);
        fnLines.push(`  };`);

        const randomIName = rndName();

        fnLines.push(`  var ${zVar} = (${fakeCompVar} ^ ${Math.floor(Math.random() * 0xffff)}) & 0xff + ${fakeCompVar};`);
        fnLines.push(`  for(var ${randomIName}=${encodeNumber(0)}; ${randomIName}<${Math.floor(Math.random() * 2)}; ${randomIName}++){ ${zVar} = (${zVar} + ${encodeNumber(0)}) & 0xff; };`);

        fnLines.push(`  ${cacheName}[${idxParam}] = ${resVar} || ${fakeCompVar};`);
        fnLines.push(`  return ${resVar} + (${zVar} == undefined ? (${Math.floor(Math.random() * 0xffff)}) & 0xff : '');`);
        fnLines.push(`};`);
        fnLines.push(`};`);

        parts.push(fnLines.join(''));
    }

    const accessorParamName = rndName();
    const resName = rndName();
    const cache = rndName();

    if (decodersCount === 1) {
        // Single decoder — no need for assignment array or decoder group, call directly
        if (config.strings.encoding.cache) parts.push(`let ${cache} = [];`);
        parts.push(`var ${iifeFnName}=(${accessorParamName})=>{}`);
        if (config.strings.encoding.cache) parts.push(`if (${cache}[${accessorParamName}]) return ${cache}[${accessorParamName}];`);
        parts.push(`  var ${resName} = ${decoderNames[0]}(${accessorParamName});`);
        if (config.optimizedStringCache) parts.push(`  ${cache}[${accessorParamName}] = ${resName};`);
        parts.push(`  return ${resName};`);
        parts.push(`};`);
    } else {
        // Multiple decoders — RLE-encode the assignment array into a string
        parts.push(`var ${decGroupName} = [${decoderNames.join(',')}];`);

        // Build RLE string: "value:count,value:count,..."
        const rleSegments = [];
        let ri = 0;
        while (ri < assignedDecoder.length) {
            const val = assignedDecoder[ri];
            let count = 1;
            while (ri + count < assignedDecoder.length && assignedDecoder[ri + count] === val) count++;
            rleSegments.push(count === 1 ? `${val}` : `${val}:${count}`);
            ri += count;
        }
        const rleString = rleSegments.join(',');

        // Compare sizes: RLE string + decoder vs plain array
        const plainArray = assignedDecoder.join(",");
        const useRLE = rleString.length + 120 < plainArray.length;

        if (useRLE) {
            // XOR-encode the RLE string with a random multi-byte key
            const xorKey = [];
            const keyLen = 4 + Math.floor(Math.random() * 5); // 4-8 byte key
            for (let ki = 0; ki < keyLen; ki++) xorKey.push(1 + Math.floor(Math.random() * 254));

            const encodedChars = [];
            for (let ci = 0; ci < rleString.length; ci++) {
                encodedChars.push(rleString.charCodeAt(ci) ^ xorKey[ci % xorKey.length]);
            }
            const encodedHex = encodedChars.map(b => '\\x' + b.toString(16).padStart(2, '0')).join('');
            const keyArr = xorKey.join(',');

            // Hidden decoder function — placed among the string decoders
            const rleDecoderFnName = rndName();
            const rdParam = rndName();
            const rdKey = rndName();
            const rdOut = rndName();
            const rdI = rndName();
            // Add noise vars to make it look like the other decoder functions
            const rdNoise1 = rndName();
            const rdNoise2 = rndName();
            const rdFake = rndName();
            const fakeA = Math.floor(Math.random() * 0xffff);
            const fakeB = Math.floor(Math.random() * 0xff);

            // Insert the decoder function among the existing decoder functions
            // Pick a random position among the decoder function entries
            const insertPos = parts.length; // after the decoder functions, before decGroupName
            // We'll rewrite: insert it right before the decGroupName line (last pushed)
            const decGroupLine = parts.pop(); // remove the decGroupName line temporarily

            const decoderFnLines = [];
            decoderFnLines.push(`function ${rleDecoderFnName}(${rdParam}){`);
            decoderFnLines.push(`  var ${rdNoise1} = ${fakeA} ^ ${fakeB};`);
            decoderFnLines.push(`  var ${rdNoise2} = (${rdNoise1} * ${Math.floor(Math.random() * 0xff)}) & 0xffff;`);
            decoderFnLines.push(`  var ${rdKey}=[${keyArr}];`);
            decoderFnLines.push(`  var ${rdOut}='';`);
            decoderFnLines.push(`  for(var ${rdI}=0;${rdI}<${rdParam}.length;${rdI}++){`);
            decoderFnLines.push(`    ${rdOut}+=String.fromCharCode(${rdParam}.charCodeAt(${rdI})^${rdKey}[${rdI}%${rdKey}.length]);`);
            decoderFnLines.push(`  };`);
            decoderFnLines.push(`  var ${rdFake} = (${rdNoise2} ^ ${Math.floor(Math.random() * 0xffff)}) & 0xff;`);
            decoderFnLines.push(`  return ${rdOut};`);
            decoderFnLines.push(`};`);
            parts.push(decoderFnLines.join(''));

            parts.push(decGroupLine); // put decGroupName line back

            const rleName = rndName();
            const pName = rndName();
            const rName = rndName();
            const iName = rndName();
            const vName = rndName();
            const cName = rndName();
            const decodedRleName = rndName();
            parts.push(`var ${rleName}='${encodedHex}';`);
            parts.push(`var ${decodedRleName}=${rleDecoderFnName}(${rleName});`);
            parts.push(`var ${assignName}=[];`);
            parts.push(`${decodedRleName}.split(',').forEach(function(${pName}){var ${rName}=${pName}.split(':');var ${vName}=+${rName}[0];var ${cName}=${rName}[1]?+${rName}[1]:1;for(var ${iName}=0;${iName}<${cName};${iName}++)${assignName}.push(${vName});});`);
        } else {
            parts.push(`var ${assignName} = [${plainArray}];`);
        }

        const diName = rndName();
        if (config.optimizedStringCache) parts.push(`let ${cache} = [];`);
        parts.push(`var ${iifeFnName}=(${accessorParamName})=>{`);
        if (config.optimizedStringCache) parts.push(`if (${cache}[${accessorParamName}]) return ${cache}[${accessorParamName}];`);
        parts.push(`  var ${diName} = ${assignName}[${accessorParamName}] % ${encodeNumber(decodersCount)};`);
        parts.push(`  var ${resName} = ${decGroupName}[${diName}](${accessorParamName});`);
        if (config.optimizedStringCache) parts.push(`  ${cache}[${accessorParamName}] = ${resName};`);
        parts.push(`  return ${resName};`);
        parts.push(`};`);
    }

    let code = parts.join("");

    if (true) {
        let initEncArrName = code.split(";")[0];
        const randName = rndName();
        code = `
        ${initEncArrName};

        const ${randName} = ${!config.strictMode?"eval":""}(${!config.strictMode ? JSON.stringify("(() => {" + code.split(initEncArrName)[1] + `${builtWindowObject} return ${iifeFnName} })()`) : ("(() => {" + code.split(initEncArrName)[1] + `${builtWindowObject} return ${iifeFnName} })()`)});
        const ${getFnName} = (${randName} || ${declarationMapping.get("null")});`;

        code = code.replaceAll("__QUOTE_OPERATORS__", '"');

        let originalIIFECode = `${!config.strictMode?"\"":""}(() => {` + code.split(`${!config.strictMode?"\"":""}(() => {`)[1].split(`${!config.strictMode?"\"":""});`)[0] + `${!config.strictMode?"\"":""}`;

        if (!config.strictMode) {
            var iifeBreaks = originalIIFECode.split('"');

            const { brokenIIFE, rebuiltCode } = breakShuffleAndBuild(iifeBreaks, declarationMapping, {
                maxChunks: 5,
                reinsertQuotes: true
            });

            const key = generateRandomKey(30);
            const encoded = encodeParts(brokenIIFE, key);
            const decoderSnippet = buildDecoderSnippet(encoded, key, declarationMapping.get("IIFEstringBreaker"));

            localBrokenIIFE = "window";

            let output = rebuiltCode.replace(/\[(\d+)\]/g, (_, num) => {
                return `[${config.numberCalculator ? `${encodingAndDecodingPairs.decodeName}(${encodeModule.encode(Number(num))})` : encodeNumber(Number(num))}]`;
            });
            
            code = code.replace(originalIIFECode, output);
            code = `${decoderSnippet}` + code;
        };
    };

    // Safety net: if IIFE wrapping didn't create the link, add a direct alias
    if (getFnName !== iifeFnName && !code.includes(`const ${getFnName}`) && !code.includes(`var ${getFnName}`)) {
        code += `\nvar ${getFnName}=${iifeFnName};`;
    }

    return config.output.compression ? removeSpacesAndNewlines(code) : code;
};

function getBrokenIIFE() {
    return "new Blob";
};

module.exports = { getStringCount, addString, resetStrings, setCommonVariables, buildStringConcealment, encodeNumber, getBrokenIIFE, testBuilder };
