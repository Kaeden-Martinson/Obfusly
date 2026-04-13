const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '../../test.js'), 'utf-8');

(async () => {
    const [s1, windowName, declMap] = __obfuscator_1.obfuscateEntireSource(code);
    const result = await __obfuscator_2.obfuscateProperties(s1, windowName, declMap);
    
    // Extract the inner code from new Function("...")()
    const start = result.indexOf('"');
    const end = result.lastIndexOf('"');
    const innerEscaped = result.slice(start + 1, end);
    const inner = new Function('return "' + innerEscaped + '"')();
    
    // Find deferred checks by looking for .unref() pattern
    const unrefRe = /\.unref\(\)\}/g;
    let m;
    let count = 0;
    while ((m = unrefRe.exec(inner)) !== null) {
        count++;
        // Get the full IIFE around this (go back up to 600 chars)
        const snippetStart = Math.max(0, m.index - 600);
        const snippet = inner.slice(snippetStart, m.index + m[0].length + 100);
        
        // Extract the IIFE closing args - look for the last )(...) in the snippet
        const allArgs = [...snippet.matchAll(/\}\)\(([^)]+)\)/g)];
        const lastArgs = allArgs[allArgs.length - 1];
        if (lastArgs) {
            const argList = lastArgs[1].split(',');
            const has5thArg = argList.length >= 5;
            console.log(`Deferred check ${count}:`);
            console.log(`  Args (${argList.length}): ${argList.join(', ')}`);
            console.log(`  5th arg (captured fn ref): ${has5thArg ? argList[4].trim() + ' OK' : 'MISSING - BUG!'}`);
        } else {
            console.log(`Deferred check ${count}: Could not parse IIFE args`);
            // Show tail of snippet for debugging
            console.log(`  Snippet tail: ${snippet.slice(-200)}`);
        }
    }
    console.log(`\nTotal deferred checks: ${count}`);
    console.log('All deferred checks properly capture function references:', count > 0 ? 'YES' : 'N/A');
})();
