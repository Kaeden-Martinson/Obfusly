// Check for name collisions between integrity helper functions and game code
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

// The hash helper functions
const helpers = ['Pi', 'Zh', 'Zo', 'Hk'];
const hashFns = ['jG', 'hw'];
const guardFns = ['KI', 'wl', 'zS', 'Tb', 'Qm', 'KS', 'tf'];

console.log('=== Checking for redefinitions of integrity helpers ===');
for (const name of [...helpers, ...hashFns, ...guardFns]) {
    // Find all assignments: name= (but not name== or name===)
    const assignRe = new RegExp(`(?:^|[^=!<>])\\b${name}\\s*=(?!=)`, 'g');
    let m;
    let assignments = [];
    while ((m = assignRe.exec(code)) !== null) {
        // Check context
        const context = code.slice(Math.max(0, m.index - 10), m.index + m[0].length + 50);
        assignments.push({ pos: m.index, context: context.trim() });
    }
    
    // Find all function declarations
    const funcDeclRe = new RegExp(`function ${name}\\(`, 'g');
    let funcDecls = [];
    while ((m = funcDeclRe.exec(code)) !== null) {
        funcDecls.push({ pos: m.index });
    }
    
    if (assignments.length > 1 || funcDecls.length > 1) {
        console.log(`\n${name}: ${funcDecls.length} declarations, ${assignments.length} assignments`);
        for (const a of assignments.slice(0, 5)) {
            console.log(`  Assign at ${a.pos}: ${a.context.slice(0, 80)}`);
        }
        for (const d of funcDecls) {
            console.log(`  Decl at ${d.pos}`);
        }
    }
}

// Now check: is Qm's prototype check the culprit?
// At runtime, if Function.prototype.toString is monkey-patched, Qm would freeze
// Check if the game code modifies Function.prototype
console.log('\n=== Function.prototype modifications ===');
const fpRe = /Function\.prototype\.(toString|call|apply)\s*=/g;
let m;
while ((m = fpRe.exec(code)) !== null) {
    console.log(`  ${m[0]} at pos ${m.index}`);
    console.log(`  Context: ${code.slice(m.index, m.index + 100)}`);
}

// Check for any .toString override in game code
console.log('\n=== toString overrides ===');
const toStrRe = /\.toString\s*=\s*function/g;
while ((m = toStrRe.exec(code)) !== null) {
    console.log(`  at pos ${m.index}: ${code.slice(m.index, m.index + 60)}`);
}

// Look at the game code's use of 'inner' variable more carefully
console.log('\n=== "inner" variable usage ===');
const innerRe = /\binner\b/g;
let innerUses = [];
while ((m = innerRe.exec(code)) !== null) {
    innerUses.push(m.index);
}
console.log(`Total "inner" references: ${innerUses.length}`);
for (const idx of innerUses.slice(0, 10)) {
    console.log(`  pos ${idx}: ...${code.slice(Math.max(0, idx - 15), idx + 35)}...`);
}
if (innerUses.length > 10) {
    console.log(`  ...and ${innerUses.length - 10} more`);
}

// Check what 'inner' is defined as
console.log('\n=== var inner definition ===');
const innerDefRe =  /var inner\s*=/g;
while ((m = innerDefRe.exec(code)) !== null) {
    console.log(`  at pos ${m.index}: ${code.slice(m.index, m.index + 50)}`);
}

// Also look for the new Function wrapper
console.log('\n=== new Function pattern ===');
const newFuncRe = /new Function\(/g;
while ((m = newFuncRe.exec(code)) !== null) {
    const ctx = code.slice(Math.max(0, m.index - 20), m.index + 50);
    console.log(`  at pos ${m.index}: ${ctx}`);
}

// Is the code wrapped top-level?
console.log('\n=== Code structure ===');
console.log(`First 50 chars: ${code.slice(0, 50)}`);
console.log(`Last 100 chars: ...${code.slice(-100)}`);
