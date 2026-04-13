// Use acorn (same as build.js) to extract function bodies and compute hashes
const acorn = require('acorn');
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

// Reconstruct hash functions from devCode.js source
// jG: seeds 1367785119, 1401452329, shifts 11,4,19, const1=2850365271, const2=1219677029, const3=2237044423, xorShift=3, mul=-486450595
// hw: seeds 873076701, 2347325760, shifts 1,6,14, const1=817335070, const2=677264165, const3=6472753, xorShift=8, mul=-1762263683

function makeHash(seed1, seed2, shift1, shift2, shift3, const1, const2, const3, xorShift, mul) {
    return function(str) {
        str = (str || '').replace(/\r/g, '');
        let a = seed1 >>> 0, b = seed2 >>> 0, c = 0;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            a = (a ^ ch) + ((a << shift1) + (a >>> shift2)); a >>>= 0;
            b = (b + (ch ^ (b << shift3))) >>> 0;
            c = (c + ((ch * const1) ^ (a >>> (i & 15)))) >>> 0;
            a = (a + ((b << 13) | (b >>> 19))) >>> 0;
            b = (b ^ ((a >>> 7) + const2)) >>> 0;
        }
        let r = (a ^ (b + c)) >>> 0;
        for (let j = 0; j < 3; j++) {
            r = ((r ^ (r << 13)) + const3) >>> 0;
            let t = (r ^ (r >>> xorShift)) >>> 0;
            r = Math.imul(t, mul) >>> 0;
        }
        return r >>> 0;
    };
}

const jG = makeHash(1367785119, 1401452329, 11, 4, 19, 2850365271, 1219677029, 2237044423, 3, -486450595);
const hw = makeHash(873076701, 2347325760, 1, 6, 14, 817335070, 677264165, 6472753, 8, -1762263683);

// Parse with acorn
console.log('Parsing with acorn...');
let ast;
try {
    ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', locations: false });
} catch (e) {
    console.log('Parse error:', e.message);
    process.exit(1);
}

// Collect functions just like build.js does
const functions = [];

function digestSelfInvokers(parent) {
    for (const node of parent.body) {
        if (node.type === "ExpressionStatement" && node.expression.callee &&
            ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type))
            digestSelfInvokers(node.expression.callee.body);
        if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type &&
            node.expression.argument?.type === "CallExpression" && node.expression.argument.callee)
            digestSelfInvokers(node.expression.argument.callee.body);
        if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
            functions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
        } else if (node.type === "VariableDeclaration") {
            for (const decl of node.declarations) {
                if (!decl.init) continue;
                const t = decl.init.type;
                if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
                    functions.push({
                        kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null,
                        start: decl.start, end: decl.end,
                        initStart: decl.init?.start, initEnd: decl.init?.end
                    });
                }
            }
        }
    }
}

for (const node of ast.body) {
    if (node.type === "ExpressionStatement" && node.expression.callee &&
        ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type))
        digestSelfInvokers(node.expression.callee.body);
    if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type &&
        node.expression.argument?.type === "CallExpression" && node.expression.argument.callee)
        digestSelfInvokers(node.expression.argument.callee.body);
    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
        functions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
    } else if (node.type === "VariableDeclaration") {
        for (const decl of node.declarations) {
            if (!decl.init) continue;
            const t = decl.init.type;
            if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
                functions.push({
                    kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null,
                    start: decl.start, end: decl.end,
                    initStart: decl.init?.start, initEnd: decl.init?.end
                });
            }
        }
    }
}

console.log(`Found ${functions.length} functions total`);

// Find the 3 deferred targets
const targets = ['inner', 'xx', 'Gr'];
const expected = {
    'inner': { jG: 0x08610117, hw: 0x526a1d02 },
    'xx':    { jG: 0xc5730e55, hw: 0xd08550ab },
    'Gr':    { jG: 0x0d867d48, hw: 0x09bdd41c },
};

// Handle duplicates same way build.js does
const nameCount = new Map();
for (const fn of functions) {
    const name = fn.kind === "decl" ? fn.name : fn.varName;
    if (name) nameCount.set(name, (nameCount.get(name) || 0) + 1);
}
const lastOcc = new Map();
for (const fn of functions) {
    const name = fn.kind === "decl" ? fn.name : fn.varName;
    if (name) lastOcc.set(name, fn);
}

for (const target of targets) {
    console.log(`\n=== ${target} ===`);
    
    // Find function with duplicate handling
    const matchingFns = functions.filter(fn => {
        const name = fn.kind === "decl" ? fn.name : fn.varName;
        return name === target;
    });
    
    console.log(`Found ${matchingFns.length} definition(s)`);
    
    for (const fn of matchingFns) {
        const isLast = lastOcc.get(target) === fn;
        const dupeNote = matchingFns.length > 1 ? (isLast ? ' (LAST - used for hash)' : ' (EARLIER - skipped)') : '';
        const fnSrc = code.slice(fn.kind === "var" ? fn.initStart : fn.start, fn.kind === "var" ? fn.initEnd : fn.end);
        const normalized = fnSrc.replace(/\r/g, '');
        
        console.log(`\n  ${fn.kind} at pos ${fn.start}-${fn.end}${dupeNote}`);
        console.log(`  Source length: ${fnSrc.length}`);
        console.log(`  First 80: ${fnSrc.slice(0, 80)}`);
        console.log(`  Last 50: ...${fnSrc.slice(-50)}`);
        
        const h1 = jG(normalized);
        const h2 = hw(normalized);
        const exp = expected[target];
        
        console.log(`  jG: 0x${h1.toString(16).padStart(8, '0')} (expected 0x${exp.jG.toString(16).padStart(8, '0')}) ${h1 === exp.jG ? '✓' : '✗'}`);
        console.log(`  hw: 0x${h2.toString(16).padStart(8, '0')} (expected 0x${exp.hw.toString(16).padStart(8, '0')}) ${h2 === exp.hw ? '✓' : '✗'}`);
    }
    
    if (matchingFns.length === 0) {
        console.log('  NOT FOUND! Looking for any reference...');
        // Search for the variable in the code
        const varIdx = code.indexOf(`var ${target}=`);
        const letIdx = code.indexOf(`let ${target}`);
        const constIdx = code.indexOf(`const ${target}`);
        if (varIdx >= 0) console.log(`  Found var at ${varIdx}: ${code.slice(varIdx, varIdx + 100)}`);
        if (letIdx >= 0) console.log(`  Found let at ${letIdx}: ${code.slice(letIdx, letIdx + 100)}`);
        if (constIdx >= 0) console.log(`  Found const at ${constIdx}: ${code.slice(constIdx, constIdx + 100)}`);
    }
}

// Also check: how many functions have duplicate names?
const dupes = [...nameCount.entries()].filter(([_, c]) => c > 1);
if (dupes.length > 0) {
    console.log(`\n=== Duplicate function names (${dupes.length}) ===`);
    for (const [name, count] of dupes.slice(0, 20)) {
        console.log(`  ${name}: ${count} definitions`);
    }
    if (dupes.length > 20) console.log(`  ...and ${dupes.length - 20} more`);
}
