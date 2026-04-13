const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    (async () => {
        const code = fs.readFileSync(path.join(__dirname, '..', 'integritytest.js'), 'utf-8');
        const [s1, windowName, declMap] = __obfuscator_1.obfuscateEntireSource(code);
        const result = await __obfuscator_2.obfuscateProperties(s1, windowName, declMap);
        
        console.log('Output length:', result.length);
        
        // Save the obfuscated code for inspection
        fs.writeFileSync(path.join(__dirname, 'deferred_debug.js'), result);
        
        const worker = new Worker(__filename, { workerData: result });
        
        let done = false;
        worker.on('message', msg => { console.log('Worker:', msg); });
        worker.on('exit', code => { done = true; process.exit(code); });
        worker.on('error', err => { console.log('Worker error:', err.message); });
        
        setTimeout(() => {
            if (!done) { console.log('HUNG'); worker.terminate(); process.exit(1); }
        }, 25000);
    })();
} else {
    const code = workerData;
    
    // Instead of intercepting setTimeout, patch the actual deferred check to log
    // Find the inner code and modify it
    const start = code.indexOf('"');
    const end = code.lastIndexOf('"');

    // We need to replace the infinite loops in the deferred checks with logging
    // The deferred check catches look like: catch(XX){for(var YY=0;YY<1;YY-=1){}}
    // The deferred check anti-tamper: for(;;){}
    // The deferred check hash mismatch: for(;;){}
    
    // Approach: wrap the new Function call to modify the inner code
    // Replace all infinite loops with a throw
    let modified = code;
    
    // Strategy: Modify the $L function to log and NOT enter infinite loop
    // Find $L pattern: function XX(wo){if(Function.prototype.toString!==XX||...){for(;;){}};return XX.call(XX,wo);}
    // Replace the for(;;){} with a console.log + throw
    
    // Broader approach: just replace ALL for(;;){} with console logging
    // But we can't modify strings inside strings easily
    
    // Simplest approach: extract the inner code, modify it, re-wrap
    const innerEscaped = code.slice(start + 1, end);
    const inner = new Function('return "' + innerEscaped + '"')();
    
    // Replace deferred infinite loops with throws
    let modifiedInner = inner;
    
    // Replace the $L anti-tamper check 
    modifiedInner = modifiedInner.replace(
        /function (\w+)\(wo\)\{if\(Function\.prototype\.toString!==(\w+)\|\|Function\.prototype\.call!==(\w+)\|\|Function\.prototype\.apply!==(\w+)\)\{for\(;;\)\{\}\};return \3\.call\(\2,wo\);\}/,
        (match, fnName, jr, dr, dw) => {
            return `function ${fnName}(wo){if(Function.prototype.toString!==${jr}||Function.prototype.call!==${dr}||Function.prototype.apply!==${dw}){console.log("ANTI-TAMPER FAILED: toString changed=",Function.prototype.toString!==${jr},"call changed=",Function.prototype.call!==${dr},"apply changed=",Function.prototype.apply!==${dw});throw new Error("ANTI_TAMPER")};return ${dr}.call(${jr},wo);}`;
        }
    );
    
    // Replace hash mismatch infinite loops in deferred checks
    // Pattern: if(XX(VR)!==(0xHEX)||YY(VR)!==(0xHEX)){for(;;){}}
    modifiedInner = modifiedInner.replace(
        /if\((\w+)\((\w+)\)!==\((0x[0-9a-f]+)\)\|\|(\w+)\(\2\)!==\((0x[0-9a-f]+)\)\)\{for\(;;\)\{\}\}/g,
        (match, h1, vr, exp1, h2, exp2) => {
            return `if(${h1}(${vr})!==(${exp1})||${h2}(${vr})!==(${exp2})){console.log("HASH MISMATCH in deferred: "+${h1}(${vr}).toString(16)+" vs "+${exp1}+" and "+${h2}(${vr}).toString(16)+" vs "+${exp2}+" fn="+${vr}.slice(0,60));throw new Error("HASH_MISMATCH")}`;
        }
    );
    
    // Replace catch-block infinite loops: for(var XX=0;XX<1;XX-=1){}
    modifiedInner = modifiedInner.replace(
        /\}catch\((\w+)\)\{for\(var (\w+)=0;\2<1;\2-=1\)\{\}\}/g,
        (match, errVar, loopVar) => {
            return `}catch(${errVar}){console.log("DEFERRED CATCH: "+${errVar}.message+", stack: "+${errVar}.stack)}`;
        }
    );
    
    // Re-wrap in new Function
    const reWrapped = 'new Function(' + JSON.stringify(modifiedInner) + ')()';
    
    try {
        eval(reWrapped);
        parentPort.postMessage('SYNC: SUCCESS');
    } catch(e) {
        parentPort.postMessage('SYNC: FAILED - ' + e.message);
    }
    
    setTimeout(() => {
        parentPort.postMessage('Deferred checks all completed');
        process.exit(0);
    }, 15000);
}
