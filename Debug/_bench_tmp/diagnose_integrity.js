const fs = require('fs');
const path = require('path');

// Read the uncompressed obfuscated output
const code = fs.readFileSync(path.join(__dirname, 'integrity_nocomp.js'), 'utf-8');

// Extract the inner string from new Function("...")()
const start = code.indexOf('"');
const end = code.lastIndexOf('"');
const innerEscaped = code.slice(start + 1, end);

// Properly unescape JS string (the content is a JS string literal)
const inner = new Function('return "' + innerEscaped + '"')();
console.log('Inner code length:', inner.length);

// Find all Pd() calls and their expected hashes
const pdPattern = /var (\w+)=Pd\((\w+)\)/g;
let m;
const checks = [];
while ((m = pdPattern.exec(inner)) !== null) {
    checks.push({ varName: m[1], fnName: m[2], pos: m.index });
}

// For each check, extract the expected oh and BQ hashes from the surrounding code
for (const check of checks) {
    const context = inner.slice(check.pos, check.pos + 300);
    // Try patterns: (oh(var)^(0xHEX)) and (BQ(var)^(0xHEX))
    const ohMatch = context.match(new RegExp(`oh\\(${check.varName}\\)[\\^!=]+\\(?(0x[0-9a-f]+)`));
    const bqMatch = context.match(new RegExp(`BQ\\(${check.varName}\\)[\\^!=]+\\(?(0x[0-9a-f]+)`));
    check.expectedOh = ohMatch ? ohMatch[1] : 'unknown';
    check.expectedBq = bqMatch ? bqMatch[1] : 'unknown';
}

console.log('\n=== Integrity checks found ===');
for (const c of checks) {
    console.log(`  Pd(${c.fnName}) -> ${c.varName}: oh=${c.expectedOh} BQ=${c.expectedBq}`);
}

// Now reconstruct the hash functions from the code
// Extract the two hash function implementations
const ohStart = inner.indexOf('function oh(');
const bqStart = inner.indexOf('function BQ(');

// Get helper functions too
const gdStart = inner.indexOf('function gD(');
const taStart = inner.indexOf('function TA(');
const vsStart = inner.indexOf('function VS(');
const ruStart = inner.indexOf('function rU(');

// Extract all helper and hash functions
const helperEnd = inner.indexOf('\n', inner.indexOf('return hM>>>0;}', ohStart)) + 1;
const helperEnd2 = inner.indexOf('\n', inner.indexOf('return ZK>>>0;}', bqStart)) + 1;

// Execute just the hash functions
const hashFuncsCode = inner.slice(gdStart, helperEnd2);
const hashFuncs = new Function(hashFuncsCode + '\nreturn {oh, BQ};')();
const { oh, BQ } = hashFuncs;

// Test: compute hash of a known string
console.log('\nHash function test:');
console.log('  oh("test") =', oh('test').toString(16));
console.log('  BQ("test") =', BQ('test').toString(16));

// Now, we need to figure out what Pd(fnName) would return at runtime
// Pd(fn) calls $L(fn) which calls Function.prototype.toString.call(fn)
// We need to check what toString returns for functions inside new Function

// Create a test: define a function inside new Function and check its toString
const testFn = new Function(`
    function M(v) {
        return v + 1;
    }
    return M.toString();
`)();
console.log('\nTest: toString() inside new Function:');
console.log('  Result:', JSON.stringify(testFn));

// Now let's find the actual function bodies in the inner code
// and compute their hashes
console.log('\n=== Computing hashes from source code ===');

// Find unique function names to check
const fnNames = [...new Set(checks.map(c => c.fnName))];

for (const fnName of fnNames) {
    // Find the function definition
    // Try patterns: function NAME(, let NAME = function, var NAME = function
    let fnBody = null;
    let fnStart = -1;
    
    // For regular function declarations inside the IIFE
    const patterns = [
        new RegExp(`function\\s+${fnName}\\s*\\(`),
        new RegExp(`(?:let|var|const)\\s+${fnName}\\s*=\\s*function\\s*[\\w]*\\s*\\(`)
    ];
    
    for (const pat of patterns) {
        const match = pat.exec(inner);
        if (match) {
            fnStart = match.index;
            break;
        }
    }
    
    if (fnStart === -1) {
        console.log(`  ${fnName}: NOT FOUND`);
        continue;
    }
    
    // Find the function body end using brace counting
    let braceCount = 0;
    let started = false;
    let fnEnd = fnStart;
    for (let i = fnStart; i < inner.length; i++) {
        if (inner[i] === '{') {
            braceCount++;
            started = true;
        } else if (inner[i] === '}') {
            braceCount--;
            if (started && braceCount === 0) {
                fnEnd = i + 1;
                break;
            }
        }
    }
    
    const fnSource = inner.slice(fnStart, fnEnd);
    const sourceOh = oh(fnSource);
    const sourceBq = BQ(fnSource);
    
    // Find the expected hashes
    const related = checks.filter(c => c.fnName === fnName);
    
    console.log(`\n  ${fnName} (pos ${fnStart}-${fnEnd}, len ${fnSource.length}):`);
    console.log(`    Source hash: oh=${sourceOh.toString(16)} BQ=${sourceBq.toString(16)}`);
    console.log(`    Source preview: ${JSON.stringify(fnSource.slice(0, 80))}...`);
    
    for (const r of related) {
        const ohMatch = sourceOh === parseInt(r.expectedOh, 16);
        const bqMatch = sourceBq === parseInt(r.expectedBq, 16);
        console.log(`    Check ${r.varName}: expected oh=${r.expectedOh} BQ=${r.expectedBq} -> oh_match=${ohMatch} bq_match=${bqMatch}`);
    }
}

// Now check what toString() ACTUALLY returns at runtime inside new Function
console.log('\n=== Runtime toString() comparison ===');

// Wrap the inner code to capture function references and their toString
let instrumentedCode = inner;

// Disable all traps
instrumentedCode = instrumentedCode.replace(/\(function pX\(\)\{pX\(\)\}\)\(\)/g, '0');
instrumentedCode = instrumentedCode.replace(/while\(!!\[\]\)\{[^}]*\}/g, '0');
instrumentedCode = instrumentedCode.replace(/for\(;;\)\{[^}]*\}/g, '0');
instrumentedCode = instrumentedCode.replace(/\(function \$t\(\)\{\$t\(\)\}\)\(\)/g, '0');
instrumentedCode = instrumentedCode.replace(/var M_=!!\[\];while\(M_\)\{M_=!!\[\]\}/g, '0');
// Replace for(var X=0;X<1;X-=1){} pattern
instrumentedCode = instrumentedCode.replace(/for\(var \w+=0;\w+<1;\w+-=1\)\{[^}]*\}/g, '0');

// Disable the XOR verification trap at the end
instrumentedCode = instrumentedCode.replace(/if\(Ib!==\d+\)\{[^}]+\}/g, '0');

// Add capture of function toString at the point where Pd is first called
// Replace Pd to log actual hashes
instrumentedCode = instrumentedCode.replace(
    /function Pd\(UQ\)\{if\(ND\.has\(UQ\)\)return ND\.get\(UQ\);var xR=\$L\(UQ\);ND\.set\(UQ,xR\);return xR;\}/,
    `function Pd(UQ){
        if(ND.has(UQ))return ND.get(UQ);
        var xR=$L(UQ);
        ND.set(UQ,xR);
        __results.push({name:UQ.name, oh_actual:oh(xR).toString(16), bq_actual:BQ(xR).toString(16), len:xR.length, preview:xR.slice(0,80)});
        return xR;
    }`
);

// Disable deferred checks (setTimeout based)
instrumentedCode = instrumentedCode.replace(/_L\(function\(\)\{/g, '(function(){return;');

// Disable the neutralizers at the end
const neutralizerStart = instrumentedCode.lastIndexOf('\noh=');
if (neutralizerStart > 0) {
    instrumentedCode = instrumentedCode.slice(0, neutralizerStart);
}

const runtimeTestCode = `
var __results = [];
var y = {
    Promise: Promise,
    setTimeout: setTimeout,
    Reflect: Reflect,
    Proxy: Proxy,
    Error: Error,
    Function: Function,
    console: {log: function(){}}
};
${instrumentedCode}
return __results;
`;

try {
    const results = new Function(runtimeTestCode)();
    for (const r of results) {
        console.log(`  Runtime ${r.name}: oh=${r.oh_actual} BQ=${r.bq_actual} len=${r.len}`);
        console.log(`    Preview: ${JSON.stringify(r.preview)}`);
    }
} catch (e) {
    console.log('Runtime error:', e.message);
    console.log('Stack:', e.stack?.split('\n').slice(0,5).join('\n'));
}
