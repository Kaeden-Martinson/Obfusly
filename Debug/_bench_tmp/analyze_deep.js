// Deep analysis of devCode.js integrity structure
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

// Find ALL IIFE closings with jG, hw pattern: })(jG,hw,...) 
// These are integrity check IIFEs
console.log('=== All IIFE closings with jG,hw ===');
const iifeRe = /\}\)\(jG,hw,([^)]+)\)/g;
let m;
let count = 0;
while ((m = iifeRe.exec(code)) !== null) {
    count++;
    const args = m[1];
    // Get some context before the closing
    const contextBefore = code.slice(Math.max(0, m.index - 200), m.index);
    console.log(`\nIIFE close ${count} at pos ${m.index}:`);
    console.log(`  Full closing: })(jG,hw,${args})`);
    console.log(`  Args count: ${args.split(',').length + 2}`);
    
    // Check if this IIFE contains setTimeout usage
    // Find the matching opening - look backwards for the function start
    // For now just show context
    console.log(`  ...context: ...${contextBefore.slice(-100)}})(jG,hw,${args})`);
}
console.log(`\nTotal IIFE closings with jG,hw: ${count}`);

// Also find closings with hw,jG (reversed order)
console.log('\n=== IIFE closings with hw,jG (reversed) ===');
const iifeRe2 = /\}\)\(hw,jG,([^)]+)\)/g;
let count2 = 0;
while ((m = iifeRe2.exec(code)) !== null) {
    count2++;
    const args = m[1];
    console.log(`\nReversed IIFE close ${count2} at pos ${m.index}:`);
    console.log(`  Full closing: })(hw,jG,${args})`);
}
console.log(`\nTotal reversed: ${count2}`);

// Find what Gr is
console.log('\n=== What is Gr? ===');
const grDef = code.match(/(?:var|let|const|function)\s+Gr\b/);
if (grDef) {
    const idx = grDef.index;
    console.log(`Gr defined at pos ${idx}:`, code.slice(idx, idx + 200));
}

// Find ALL setTimeout-like patterns in the entire code (not just Tb, but also the parameter names)
// In deferred checks, setTimeout is passed as a parameter. The IIFE receives it.
// Pattern: (function(h1,h2,vf,st[,fr]){var tmr=st(function(){...
console.log('\n=== Deferred check pattern search ===');
// Look for the inner pattern: var XX=YY(function(){ where YY is the setTimeout param
// In the IIFE (function(..,..,..,..[,..]){var X=Y(function(){try{...
const deferredPat = /\(function\((\w+),(\w+),(\w+),(\w+)(?:,(\w+))?\)\{var (\w+)=\4\(function\(\)/g;
let dCount = 0;
while ((m = deferredPat.exec(code)) !== null) {
    dCount++;
    const [full, h1p, h2p, vfp, stp, frp, tmrp] = m;
    console.log(`\nDeferred ${dCount} at pos ${m.index}:`);
    console.log(`  Params: h1=${h1p}, h2=${h2p}, vf=${vfp}, st=${stp}${frp ? ', fr=' + frp : ''}`);
    console.log(`  Timer var: ${tmrp}`);
    console.log(`  Has captured fn ref: ${!!frp}`);
    // Show more context
    const ctx = code.slice(m.index, m.index + 500);
    console.log(`  Context: ${ctx.slice(0, 400)}`);
}
console.log(`\nTotal deferred checks found: ${dCount}`);

// Find the neutralizer position
console.log('\n=== Neutralizer positions ===');
const neutRe = /jG=\(function\(\)\{return function/g;
while ((m = neutRe.exec(code)) !== null) {
    console.log(`jG neutralized at pos ${m.index} / ${code.length} (${((m.index/code.length)*100).toFixed(1)}% through code)`);
}
const neutRe2 = /hw=\(function\(\)\{return function/g;
while ((m = neutRe2.exec(code)) !== null) {
    console.log(`hw neutralized at pos ${m.index} / ${code.length} (${((m.index/code.length)*100).toFixed(1)}% through code)`);
}
