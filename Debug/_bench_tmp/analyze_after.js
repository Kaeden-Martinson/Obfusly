// Analyze the AFTER portion of devCode.js (after the new Function string)
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

const lastQuote = code.lastIndexOf('"');
const after = code.slice(lastQuote + 1);
console.log('After-string portion length:', after.length);
console.log('\n=== First 300 chars after string ===');
console.log(after.slice(0, 300));

// Search for setTimeout (deferred checks)
console.log('\n=== setTimeout / Tb references ===');
const tbRe = /Tb\(/g;
let m;
let tbCount = 0;
while ((m = tbRe.exec(after)) !== null) {
    tbCount++;
    const context = after.slice(Math.max(0, m.index - 50), m.index + 300);
    console.log(`\nsetTimeout ${tbCount} at offset ${m.index}:`);
    console.log(context.slice(0, 350));
    console.log('---');
}
console.log(`\nTotal Tb() calls in after portion: ${tbCount}`);

// Search for jG and hw (hash function) references
console.log('\n=== jG (hash1) calls ===');
const jgCalls = after.match(/jG\(/g);
console.log(`jG() calls in after portion: ${jgCalls ? jgCalls.length : 0}`);

const hwCalls = after.match(/hw\(/g);
console.log(`hw() calls in after portion: ${hwCalls ? hwCalls.length : 0}`);

// Search for neutralizers: jG= or hw=
console.log('\n=== Neutralizer assignments ===');
const neutralRe = /\b(jG|hw)\s*=/g;
while ((m = neutralRe.exec(after)) !== null) {
    const context = after.slice(m.index, m.index + 300);
    console.log(`\n${m[1]} assigned at offset ${m.index}:`);
    console.log(context.slice(0, 300));
    console.log('---');
}

// Search for KS (Pd) calls (integrity check pattern)
console.log('\n=== KS (toString) calls count ===');
const ksCalls = after.match(/KS\(/g);
console.log(`KS() calls in after portion: ${ksCalls ? ksCalls.length : 0}`);

// Search for Qm ($L) calls
const qmCalls = after.match(/Qm\(/g);
console.log(`Qm() calls in after portion: ${qmCalls ? qmCalls.length : 0}`);

// Also look in the BEFORE portion
const firstQuote = code.indexOf('"');
const before = code.slice(0, firstQuote);

console.log('\n=== In BEFORE portion ===');
const tbBefore = before.match(/Tb\(/g);
console.log(`Tb() calls: ${tbBefore ? tbBefore.length : 0}`);
const ksBefore = before.match(/KS\(/g);
console.log(`KS() calls: ${ksBefore ? ksBefore.length : 0}`);
const qmBefore = before.match(/Qm\(/g);
console.log(`Qm() calls: ${qmBefore ? qmBefore.length : 0}`);
const jgBefore = before.match(/jG\(/g);
console.log(`jG() calls: ${jgBefore ? jgBefore.length : 0}`);
const hwBefore = before.match(/hw\(/g);
console.log(`hw() calls: ${hwBefore ? hwBefore.length : 0}`);

// Find the infinite loop traps in after portion
console.log('\n=== Infinite loops in after portion ===');
const loops = {
    'for(;;){}': (after.match(/for\(;;\)\{\}/g) || []).length,
    'while(!![]){': (after.match(/while\(!!\[\]\)\{/g) || []).length,
    'do{}while': (after.match(/do\{\}while/g) || []).length,
};
console.log(loops);

// Show the last 2000 chars (likely neutralizers)
console.log('\n=== Last 2000 chars of the code ===');
console.log(code.slice(-2000));
