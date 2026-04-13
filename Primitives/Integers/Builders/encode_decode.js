const config = require('../../../Settings/config');
const { generateObfuscatedName } = require('../../../Utils/nameGenerator');

const { pickWeightedRandom } = require('../../../Utils/weights');
const { encodeStringsRandom } = require('../../Literals/strings');
const { toBinary } = require('../binary');
const { toHex } = require('../hexadecimal');
const { toJSFuck } = require('../jsfuck');
const { toOctal } = require('../octal');
const { toRefractal } = require('../refractal');

function createEncodeAndDecodingPairs(declarationMapping) {

    const FUNCTIONS = config.encodedFunctionStrength;
    const CASES = 8;
    const OPS_MIN = 3;
    const OPS_MAX = 6;
    const MOD32 = 0x100000000;
    const PRESERVE_BITS = Math.log2(CASES) | 0;

    if ((1 << PRESERVE_BITS) !== CASES) throw new Error('CASES must be power of two');

    let DEADCODE_VARIABLES = [];

    let percentageBasedConfig = { ...config.integerPrecentage };

    function useConfig(num) {
        if (config.globalBaseIntegerConcealment && num <= 100) {
            const BigNumber = Math.floor(Math.random() * 100);
            const LeftOver = BigNumber - num;
            if (config.multipleVariableAssignments && num !== 100 && LeftOver !== 100 && BigNumber !== 100 && LeftOver !== 0 && BigNumber !== 0) {
                const shuffledIndex = Math.floor(Math.random() * 4);
                if (shuffledIndex !== 0) {
                    const choices = [1, 2, 3].filter(v => v !== shuffledIndex);
                    const secondChoice = choices[Math.floor(Math.random() * choices.length)];

                    const op = LeftOver < 0 ? "+" : "-";
                    return `(${declarationMapping.get(`variable_numbers_${shuffledIndex}_${BigNumber}`)} ${op} ${declarationMapping.get(`variable_numbers_${secondChoice}_${Math.abs(LeftOver)}`)})`;
                };
            };

            return `(${declarationMapping.get(`variable_numbers_${BigNumber}`)} ${LeftOver < 0 ? "+" : "-"} ${declarationMapping.get(`variable_numbers_${Math.abs(LeftOver)}`)})`;
        } else if (config.numberEncoding) {
            percentageBasedConfig = config.integerPrecentage;
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
        } else {
            return num;
        };
    };

    for (let i = 0; i < FUNCTIONS; i++) DEADCODE_VARIABLES.push([useConfig(Math.floor(Math.random() * 10000)), useConfig(Math.floor(Math.random() * 10000)), useConfig(Math.floor(Math.random() * 10000)), useConfig(Math.floor(Math.random() * 10000)), useConfig(Math.floor(Math.random() * 10000))]);

    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function randStr() { return encodeStringsRandom(Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9), undefined).raw; }
    function egcd(a, b) { a = (a % b + b) % b; let x0 = 1, y0 = 0, x1 = 0, y1 = 1; while (b !== 0) { const q = Math.floor(a / b), r = a - q * b, x2 = x0 - q * x1, y2 = y0 - q * y1; a = b; b = r; x0 = x1; x1 = x2; y0 = y1; y1 = y2; } return { g: a, x: x0, y: y0 }; }
    function modInv(a, m) { const r = egcd(a, m); if (r.g !== 1) throw new Error('no inverse'); return ((r.x % m) + m) % m; }
    function randomOperation() { const operations = ["/", "+", "-", "*", ">>", "<<", "|", "&"]; return operations[Math.floor(Math.random() * operations.length)] };
    function generateRandomArgs() {
        const count = Math.floor(Math.random() * 4) + 3;
        const args = [];
        for (let i = 0; i < count; i++) {
            if (Math.random() < 0.5) {
                args.push(useConfig(Math.floor(Math.random() * 0xffffffff)));
            } else {
                args.push(randStr());
            }
        }
        return args.join(',');
    }

    function pickPreservingOp() {
        const t = randInt(0, 2), mask = (1 << PRESERVE_BITS) - 1;
        if (t === 0) { const base = mask + 1, k = randInt(1, 0xfff), c = (k * base) >>> 0; return { type: 'add', c }; }
        if (t === 1) { const c = ((randInt(0, 0xffff) << PRESERVE_BITS) >>> 0); return { type: 'xor', c }; }
        let base = (1 << PRESERVE_BITS); let tval = randInt(1, 0xffff); let c = (1 + tval * base) >>> 0; if ((c & 1) === 0) c ^= 1; const inv = modInv(c, MOD32) >>> 0; return { type: 'mul', c, inv };
    }

    const allFunctions = [];
    const selTables = [];
    const valueIndexes = [];
    const deadcodeCounts = [];

    let multiplicationNames = new Map();

    for (let fi = 0; fi < FUNCTIONS; fi++) {
        const cases = [], selTable = [], idxs = [];
        const used = new Set();
        const dcCount = randInt(2, 5);
        deadcodeCounts.push(dcCount);
        for (let ci = 0; ci < CASES; ci++) {
            const opsCount = randInt(OPS_MIN, OPS_MAX);
            const ops = [];
            for (let oi = 0; oi < opsCount; oi++) ops.push(pickPreservingOp());
            cases.push(ops);
            let s; do { s = randInt(0, CASES - 1); } while (used.has(s)); used.add(s);
            selTable.push(useConfig(s));
            idxs.push(useConfig(randInt(0, dcCount)));
        }
        allFunctions.push(cases);
        selTables.push(selTable);
        valueIndexes.push(idxs);
    }

    function applyOpCode(op, varName = 'v') { switch (op.type) { case 'add': return `((${varName}+${(op.c)})>>>${(0)})`; case 'xor': return `((${varName}^${(op.c)})>>>${(0)})`; case 'mul': return `(Math.imul(${varName},${(op.c)})>>>${(0)})`; } }
    function inverseOpCode(op, varName = 'v') { switch (op.type) { case 'add': return `((${varName}-${useConfig(op.c)})>>>${useConfig(0)})`; case 'xor': return `((${varName}^${useConfig(op.c)})>>>${useConfig(0)})`; case 'mul': return `(Math.imul(${varName},${op.inv})>>>${useConfig(0)})`; } }

    const selTablesVariable = generateObfuscatedName();
    const valueIndexesVariable = generateObfuscatedName();
    let out = `\n`;
    out += `const ${selTablesVariable}=[${selTables.map(t => '[' + t.join(',') + ']').join(',')}];\nconst ${valueIndexesVariable}=[${valueIndexes.map(t => '[' + t.join(',') + ']').join(',')}];\n\n`;

    let encoderOut = out + "\n";

    for (let fi = 0; fi < FUNCTIONS; fi++) {
        for (let ci = 0; ci < CASES; ci++) {
            allFunctions[fi][ci].forEach((op, idx) => {
                let name = generateObfuscatedName();
                multiplicationNames.set(`mul_inv_f${fi}_c${ci}_${idx}`, name);
                if (op.type === 'mul') out += `const ${name}=${useConfig(op.inv)}>>>${useConfig(0)};\n`;
            });
        }
    };

    out += '\n';

    let decoderOut = out;

    function deadExpr(varName = 'v') {
        const d1 = randInt(1, 0xffffffff), d2 = randInt(1, 0xffffffff);
        const str1 = randStr(), str2 = randStr();
        return [`(${varName}${randomOperation()}${useConfig(d1)}${randomOperation()}(${str1}).charCodeAt(${useConfig(Math.floor(Math.random() * str1.length))}))>>>${useConfig(0)}`, `((${varName}${randomOperation()}${useConfig(d2)}${randomOperation()} (${str2}).charCodeAt(${useConfig(Math.floor(Math.random() * str2.length))}))>>>${useConfig(0)})`];
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    const shuffledFunctionsTables = shuffleArray([...Array(FUNCTIONS).keys()]);
    const shuffledFunctionsCases = shuffleArray([...Array(FUNCTIONS).keys()]);
    const casesSubtractOne = shuffleArray([...Array(FUNCTIONS).keys()]);

    for (let fi = 0; fi < FUNCTIONS; fi++) {
        const dcCount = deadcodeCounts[fi];
        const dcParams = Array.from({ length: dcCount }, (_, i) => `dead${i}`).join(',');

        const shuffledCases = shuffleArray([...Array(CASES).keys()]);

        encoderOut += `function encode${fi}(x,${dcParams}){\n  let v=(x>>>0);\n  const sel=${selTablesVariable}[${(shuffledFunctionsTables[fi])}][x&${(casesSubtractOne[fi])}];\n  const valIdx=${valueIndexesVariable}[${(shuffledFunctionsCases[fi])}][x&${(casesSubtractOne[fi])}];\n  let d0=${(10)} - 9,d1=${0};\n  switch(sel){\n`;

        for (let ci = 0; ci < CASES; ci++) {
            const caseIndex = shuffledCases[ci];
            const ops = allFunctions[fi][caseIndex];
            const [dExpr0, dExpr1] = deadExpr();
            encoderOut += `    case ${(caseIndex)}:\n`;
            encoderOut += `      d0=(d0 + dead${randInt(0, dcCount - 1)})>>>${0};\n`;
            encoderOut += `      d1=(d1 + dead${randInt(0, dcCount - 1)})>>>${0};\n`;
            for (let oi = 0; oi < ops.length; oi++) encoderOut += `      v=${applyOpCode(ops[oi], 'v')};\n`;
            encoderOut += `      break;\n`;
        }

        encoderOut += `    default:v=v;}\n  const arr=[]; for(let i=${0};i<${(dcCount + 2)};i++)arr[i]=${0};\n  arr[valIdx]=v; arr[(valIdx+${1})%arr.length]=d0; arr[(valIdx+${2})%arr.length]=d1;\n  return arr;\n}\n\n`;
    }

    const decodeMainFunctionNames = Array.from({ length: FUNCTIONS }, (_, i) => generateObfuscatedName());

    for (let fi = 0; fi < FUNCTIONS; fi++) {
        const mainParam = generateObfuscatedName();
        const volumeVariable = config.breakASTs ? "__LET_PLACEHOLDER__" : generateObfuscatedName();
        const valIdx = generateObfuscatedName();
        const sel = generateObfuscatedName();
        const d0 = generateObfuscatedName();
        const d1 = generateObfuscatedName();
        const arr = generateObfuscatedName();
        const i_var = generateObfuscatedName();

        const dcCount = deadcodeCounts[fi];
        const dcParams = Array.from({ length: dcCount }, (_, i) => `${generateObfuscatedName()}=${DEADCODE_VARIABLES[fi][i]}`);

        const shuffledCases = shuffleArray([...Array(CASES).keys()]);

        decoderOut += `function ${decodeMainFunctionNames[fi]}(${mainParam},${dcParams.join(',')}){\n  var ${volumeVariable}=(${mainParam}>>>${useConfig(0)});\n  const ${sel}=${selTablesVariable}[${useConfig(shuffledFunctionsTables[fi])}][${mainParam}&${useConfig(casesSubtractOne[fi])}];\n  const ${valIdx}=${valueIndexesVariable}[${useConfig(shuffledFunctionsCases[fi])}][${mainParam}&${useConfig(casesSubtractOne[fi])}];\n  let ${d0}=${useConfig(10)} - ${useConfig(9)},${d1}=${useConfig(0)};\n  switch(${sel}){\n`;

        for (let ci = 0; ci < CASES; ci++) {
            const caseIndex = shuffledCases[ci];
            const ops = allFunctions[fi][caseIndex];
            const [dExpr0, dExpr1] = deadExpr(volumeVariable);
            decoderOut += `    case ${useConfig(caseIndex)}:\n`;
            decoderOut += `      ${d0}=(${d0} + ${dExpr0} + ${dcParams[randInt(0, dcCount - 1)].split("=")[0]})>>>${useConfig(0)};\n`;
            decoderOut += `      ${d1}=(${d1} + ${dExpr1} + ${dcParams[randInt(0, dcCount - 1)].split("=")[0]})>>>${useConfig(0)};\n`;
            for (let oi = ops.length - 1; oi >= 0; oi--) {
                const op = ops[oi];
                if (op.type === 'mul') decoderOut += `      ${volumeVariable}=${inverseOpCode(op, `${volumeVariable}`).replace(op.inv.toString(), multiplicationNames.get(`mul_inv_f${fi}_c${caseIndex}_${oi}`))};\n`;
                else decoderOut += `      ${volumeVariable}=${inverseOpCode(op, `${volumeVariable}`)};\n`;
            }
            decoderOut += `      break;\n`;
        }

        decoderOut += `    default:${volumeVariable}=${volumeVariable};}\n  const ${arr}=[]; for(let ${i_var}=${useConfig(0)};${i_var}<${useConfig(dcCount + 2)};${i_var}++)${arr}[${i_var}]=${useConfig(0)};\n  ${arr}[${valIdx}]=${volumeVariable}; ${arr}[(${valIdx}+${useConfig(1)})%${arr}.length]=${d0}; ${arr}[(${valIdx}+${useConfig(2)})%${arr}.length]=${d1};\n  return ${arr};\n};\n\n`;
    }

    const decoderFunctionNames = Array.from({ length: FUNCTIONS }, (_, i) => {
        return i === FUNCTIONS - 1
            ? declarationMapping.get("decodeFunctionName")
            : generateObfuscatedName();
    });
    for (let fi = 0; fi < FUNCTIONS; fi++) encoderOut += `function chainEncode${fi}(v){v=encode${fi}(v,${generateRandomArgs()})[${valueIndexesVariable}[${(shuffledFunctionsCases[fi])}][v&${(casesSubtractOne[fi])}]];${fi + 1 < FUNCTIONS ? `return chainEncode${fi + 1}(v);` : `return v>>>${(0)};`}}\n\n`;
    for (let fi = FUNCTIONS - 1; fi >= 0; fi--) {
        const mainParam = generateObfuscatedName();
        if (fi === FUNCTIONS - 1 && config.optimzedNumberCache) {
            // Cache at outermost level using original input as key for maximum hit rate
            let cacheName = generateObfuscatedName();
            let resName = generateObfuscatedName();
            let origParam = generateObfuscatedName();
            decoderOut += `var ${cacheName} = new Map(); var ${decoderFunctionNames[fi]} = (${mainParam})=>{if(${cacheName}.has(${mainParam}))return ${cacheName}.get(${mainParam});var ${origParam}=${mainParam};${mainParam}=${decodeMainFunctionNames[fi]}(${mainParam},${generateRandomArgs()})[${valueIndexesVariable}[${useConfig(shuffledFunctionsCases[fi])}][${mainParam}&${useConfig(casesSubtractOne[fi])}]];${fi - 1 >= 0 ? `let ${resName} = ${decoderFunctionNames[fi - 1]}(${mainParam}); ${cacheName}.set(${origParam}, ${resName}); return ${resName}` : `${cacheName}.set(${origParam}, ${mainParam}>>>${useConfig(0)}); return ${mainParam}>>>${useConfig(0)};`}}\n\n`;
        }
        else decoderOut += `var ${decoderFunctionNames[fi]} = (${mainParam})=>{${mainParam}=${decodeMainFunctionNames[fi]}(${mainParam},${generateRandomArgs()})[${valueIndexesVariable}[${useConfig(shuffledFunctionsCases[fi])}][${mainParam}&${useConfig(casesSubtractOne[fi])}]];${fi - 1 >= 0 ? `return ${decoderFunctionNames[fi - 1]}(${mainParam});` : `return ${mainParam}>>>${useConfig(0)};`}}\n\n`;
    };

    encoderOut += "module.exports={encode: chainEncode0};";

    encoderOut = encoderOut.replace(/__ENCODED_STRINGS__x/g, '\\x');
    encoderOut = encoderOut.replace(/__ENCODED_STRINGS__u/g, '\\u');

    return { encoder: encoderOut, decoder: decoderOut, decodeName: decoderFunctionNames[FUNCTIONS - 1], decodeMainFunctionNames, decoderFunctionNames };
};

module.exports = { createEncodeAndDecodingPairs };