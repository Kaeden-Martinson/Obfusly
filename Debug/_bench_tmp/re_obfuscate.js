// Re-obfuscate test.js and verify integrity hashes
const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const config = require('../../Settings/config');
const fs = require('fs');

async function main() {
    const code = fs.readFileSync('/home/motion/Desktop/VoidX/JsScramble/test.js', 'utf-8');
    console.log('Input code length:', code.length);
    console.log('Config integrityChecks:', config.integrityChecks);
    
    console.log('\nStarting obfuscation...');
    const start = Date.now();
    
    try {
        const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
        console.log('Stage 1 done in', Date.now() - start, 'ms');
        console.log('Stage 1 output length:', obfuscatedCode.length);
        
        const start2 = Date.now();
        const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties(obfuscatedCode, windowName, previousDeclarationMapping);
        console.log('Stage 2 done in', Date.now() - start2, 'ms');
        console.log('Final output length:', objectObfuscatedCode.length);
        
        // Save the output
        fs.writeFileSync('/tmp/re_obfuscated.js', objectObfuscatedCode);
        console.log('\nSaved to /tmp/re_obfuscated.js');
        
        // Now verify deferred checks  
        const acorn = require('acorn');
        
        // Find deferred check pattern
        const deferredPat = /\(function\((\w+),(\w+),(\w+),(\w+)(?:,(\w+))?\)\{var (\w+)=\4\(function\(\)/g;
        let m;
        let dCount = 0;
        console.log('\n=== Deferred checks in output ===');
        while ((m = deferredPat.exec(objectObfuscatedCode)) !== null) {
            dCount++;
            const [full, h1p, h2p, vfp, stp, frp] = m;
            console.log(`Deferred ${dCount}: has captured fn ref = ${!!frp}`);
            
            // Get context to find expected hashes and fn name
            const ctx = objectObfuscatedCode.slice(m.index, m.index + 500);
            const hashMatch = ctx.match(/!=\((0x[0-9a-f]+)\)\|\|\w+\(\w+\)!=\((0x[0-9a-f]+)\)/);
            if (hashMatch) {
                console.log(`  Expected hashes: ${hashMatch[1]} / ${hashMatch[2]}`);
            }
            
            // Find the closing to see which function is being checked
            const closeCtx = objectObfuscatedCode.slice(m.index, m.index + 1000);
            const closeMatch = closeCtx.match(/\}\)\((\w+),(\w+),(\w+),(\w+)(?:,(\w+))?\)/);
            if (closeMatch) {
                console.log(`  Checked function: ${closeMatch[5] || 'N/A (4 args only)'}`);
            }
        }
        console.log(`Total deferred checks: ${dCount}`);
        
    } catch (e) {
        console.error('Obfuscation failed:', e.message);
        console.error(e.stack);
    }
}

main();
