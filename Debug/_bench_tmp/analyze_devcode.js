// Analyze the actual obfuscated devCode.js to find what causes the freeze
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

console.log('Code length:', code.length);
console.log('Starts with:', code.slice(0, 20));

// Extract inner code from new Function("...")()
const firstQuote = code.indexOf('"');
const lastQuote = code.lastIndexOf('"');
console.log('First quote at:', firstQuote, 'Last quote at:', lastQuote);

if (firstQuote < 0 || lastQuote <= firstQuote) {
    // Maybe it's not wrapped in new Function
    console.log('Not a new Function wrapper, analyzing directly');
    console.log('First 200 chars:', code.slice(0, 200));
    process.exit(0);
}

const innerEscaped = code.slice(firstQuote + 1, lastQuote);
let inner;
try {
    inner = new Function('return "' + innerEscaped + '"')();
} catch (e) {
    console.log('Failed to unescape inner string:', e.message);
    // Try direct approach
    inner = innerEscaped.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\\\/g, '\\').replace(/\\"/g, '"');
}

console.log('Inner code length:', inner.length);
console.log('Inner code lines:', inner.split('\n').length);

// Identify the key function names
// Find $L (toString wrapper) - pattern: function XX(YY){if(Function.prototype.toString!==
const slMatch = inner.match(/function (\w+)\(\w+\)\{if\(Function\.prototype\.toString!==/);
const slName = slMatch ? slMatch[1] : 'unknown';
console.log('\n$L function name:', slName);

// Find _L (setTimeout ref) - pattern: typeof setTimeout!=='undefined'?setTimeout:void 0
const stMatch = inner.match(/var (\w+)=typeof setTimeout/);
const stName = stMatch ? stMatch[1] : 'unknown';
console.log('_L (setTimeout) name:', stName);

// Find hash function names - the two hash functions
const hashMatch1 = inner.match(/function (\w+)\(\w+\)\{\w+\=\(\w+\|\|''\)\.replace\(\/\\r\/g,''\);var \w+\=\d+>>>/);
const hashMatch2 = inner.matchAll(/function (\w+)\(\w+\)\{\w+\=\(\w+\|\|''\)\.replace\(\/\\r\/g,''\);var \w+\=\d+>>>/g);
const hashNames = [];
for (const m of inner.matchAll(/function (\w+)\(\w+\)\{\w+=\(\w+\|\|''\)\.replace\(\/\\r\/g,''\)/g)) {
    hashNames.push(m[1]);
}
console.log('Hash function names:', hashNames);
const h1Name = hashNames[0] || 'unknown';
const h2Name = hashNames[1] || 'unknown';

// Find all deferred checks - pattern: })(h1,h2,$L,_L) or })(h1,h2,$L,_L,fnRef)
const deferredRe = new RegExp(`\\}\\)\\((${h1Name}|${h2Name}),\\s*(${h1Name}|${h2Name}),\\s*${slName},\\s*${stName}(,\\s*\\w+)?\\)`, 'g');
let m;
let deferredCount = 0;
console.log('\n=== Deferred integrity checks ===');
while ((m = deferredRe.exec(inner)) !== null) {
    deferredCount++;
    const has5thArg = !!m[3];
    const context = inner.slice(Math.max(0, m.index - 400), m.index + m[0].length);
    
    // Extract the function being checked inside this deferred IIFE
    const fnRefMatch = context.match(new RegExp(`${slName}\\((\\w+)\\)`));
    const fnBeingChecked = fnRefMatch ? fnRefMatch[1] : 'unknown';
    
    // Extract expected hashes
    const hashCheck = context.match(/if\((\w+)\((\w+)\)!==\((0x[0-9a-f]+)\)\|\|(\w+)\(\2\)!==\((0x[0-9a-f]+)\)\)/);
    
    console.log(`\nDeferred check ${deferredCount}:`);
    console.log(`  5th arg (captured fn ref): ${has5thArg ? m[3].trim().slice(1) + ' - OK' : 'MISSING - uses variable name!'}`);
    console.log(`  Function being checked: ${fnBeingChecked}`);
    if (hashCheck) {
        console.log(`  Expected hashes: h1=${hashCheck[3]} h2=${hashCheck[5]}`);
    }
    
    // Show the closing args
    console.log(`  IIFE args: ${m[0]}`);
}
console.log(`\nTotal deferred checks: ${deferredCount}`);

// Find all setTimeout calls (including non-deferred)
console.log('\n=== All setTimeout calls ===');
const setTimeoutRe = new RegExp(`${stName}\\(function`, 'g');
let stCount = 0;
while ((m = setTimeoutRe.exec(inner)) !== null) {
    stCount++;
    const context = inner.slice(m.index, m.index + 300);
    // Find the delay value
    const delayMatch = context.match(/\},\s*(\d+|0x[0-9a-f]+|0o\d+|0b[01]+|\w+)\)/);
    console.log(`  setTimeout ${stCount}: delay=${delayMatch ? delayMatch[1] : 'unknown'}`);
}

// Find neutralizers at the end - pattern: hashName=(function(){...})() or hashName=function(){...}
console.log('\n=== Neutralizers ===');
for (const hName of hashNames) {
    const neutralizerRe = new RegExp(`\\n${hName}=`);
    const nMatch = neutralizerRe.exec(inner);
    if (nMatch) {
        const context = inner.slice(nMatch.index, nMatch.index + 200);
        console.log(`  ${hName} neutralized at pos ${nMatch.index}: ${context.slice(0, 100)}`);
    }
}

// Find all infinite loop traps
console.log('\n=== Infinite loop patterns ===');
const foreverRe = /for\(;;\)\{\}/g;
let foreverCount = 0;
while (foreverRe.exec(inner)) foreverCount++;
console.log(`  for(;;){}: ${foreverCount}`);

const whileTrueRe = /while\(!!\[\]\)\{\}/g;
let whileTrueCount = 0;
while (whileTrueRe.exec(inner)) whileTrueCount++;
console.log(`  while(!![]){}: ${whileTrueCount}`);

const doWhileRe = /do\{\}while\(!!\[\]\)/g;
let doWhileCount = 0;
while (doWhileRe.exec(inner)) doWhileCount++;
console.log(`  do{}while(!![]): ${doWhileCount}`);

const recRe = /\(function (\w+)\(\)\{\1\(\)\}\)\(\)/g;
let recCount = 0;
while (recRe.exec(inner)) recCount++;
console.log(`  recursive IIFE: ${recCount}`);

const whileVarRe = /var (\w+)=!!\[\];while\(\1\)\{\1=!!\[\]\}/g;
let whileVarCount = 0;
while (whileVarRe.exec(inner)) whileVarCount++;
console.log(`  var x=!![];while(x){x=!![]}: ${whileVarCount}`);

const forDecRe = /for\(var \w+=0;\w+<1;\w+-=1\)\{/g;
let forDecCount = 0;
while (forDecRe.exec(inner)) forDecCount++;
console.log(`  for(var x=0;x<1;x-=1){}: ${forDecCount}`);
