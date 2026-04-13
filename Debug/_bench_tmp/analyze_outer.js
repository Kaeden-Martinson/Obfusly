// Analyze the OUTER code of devCode.js (the integrity infrastructure before new Function)
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

const firstQuote = code.indexOf('"');
const lastQuote = code.lastIndexOf('"');

// Outer code = everything before the new Function call
// The structure is: var KI=...; ... new Function("...")()
// So we need everything outside the string
const outerBefore = code.slice(0, firstQuote);
const outerAfter = code.slice(lastQuote + 1);
console.log('Outer code before string length:', outerBefore.length);
console.log('Outer code after string length:', outerAfter.length);
console.log('Inner string length:', lastQuote - firstQuote - 1);

// Actually the whole file IS the outer code. The inner string is a new Function body
// But the integrity checks wrap around the whole thing
// Let me find the structure more carefully

// Find the new Function call
const newFuncMatch = code.match(/new Function\(/);
if (newFuncMatch) {
    console.log('\nnew Function at position:', newFuncMatch.index);
}

// Let's look at the beginning of the code for integrity infrastructure
console.log('\n=== First 2000 chars ===');
console.log(code.slice(0, 2000));

// Find all function definitions in the outer code (before the new Function string)
console.log('\n=== Function defs in outer code ===');
const outer = code.slice(0, firstQuote);
const funcDefRe = /function (\w+)\(/g;
let m;
const funcNames = [];
while ((m = funcDefRe.exec(outer)) !== null) {
    funcNames.push(m[1]);
}
console.log('Functions:', funcNames);

// Find the hash functions (replace pattern)
console.log('\n=== Hash functions ===');
for (const fn of funcNames) {
    const fnRe = new RegExp(`function ${fn}\\(`);
    const fnMatch = fnRe.exec(outer);
    if (fnMatch) {
        const snippet = outer.slice(fnMatch.index, fnMatch.index + 200);
        if (snippet.includes('replace') || snippet.includes('>>>')) {
            console.log(`\n${fn} (likely hash):`, snippet.slice(0, 150));
        }
    }
}

// Find setTimeout in outer code
console.log('\n=== setTimeout in outer code ===');
const stRe = /setTimeout|Tb/g;
while ((m = stRe.exec(outer)) !== null) {
    console.log(`  Found "${m[0]}" at pos ${m.index}:`, outer.slice(m.index, m.index + 100));
}

// Find all var declarations in outer code
console.log('\n=== Key var declarations ===');
const varRe = /var (\w+)=/g;
const vars = [];
while ((m = varRe.exec(outer)) !== null) {
    vars.push({ name: m[1], pos: m.index });
}
console.log('Variables:', vars.map(v => v.name));

// Look for the XOR route variable and checks
console.log('\n=== Last 5000 chars of outer code (before string) ===');
console.log(outer.slice(-5000));
