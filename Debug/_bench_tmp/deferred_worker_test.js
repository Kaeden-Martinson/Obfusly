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
        
        // Run in worker to monitor for hangs
        const worker = new Worker(__filename, { workerData: result });
        
        let done = false;
        worker.on('message', msg => {
            console.log('Worker:', msg);
        });
        worker.on('exit', code => {
            done = true;
            console.log('Worker exited with code', code);
            if (code === 0) console.log('ALL PASSED');
            else console.log('FAILED');
            process.exit(code);
        });
        worker.on('error', err => {
            done = true;
            console.log('Worker error:', err.message);
        });
        
        setTimeout(() => {
            if (!done) {
                console.log('Worker HUNG (deferred check froze)');
                worker.terminate();
                process.exit(1);
            }
        }, 20000);
    })();
} else {
    // Worker thread
    const code = workerData;
    
    // Override setTimeout to trace deferred checks
    const origSetTimeout = setTimeout;
    let timerCount = 0;
    globalThis.setTimeout = function(fn, delay, ...args) {
        const id = ++timerCount;
        parentPort.postMessage(`Timer ${id} registered (delay=${delay}ms)`);
        return origSetTimeout(function() {
            parentPort.postMessage(`Timer ${id} FIRING (delay=${delay}ms)`);
            try {
                fn(...args);
                parentPort.postMessage(`Timer ${id} completed OK`);
            } catch(e) {
                parentPort.postMessage(`Timer ${id} THREW: ${e.message}`);
            }
        }, delay);
    };
    
    try {
        eval(code);
        parentPort.postMessage('SYNC: SUCCESS');
    } catch(e) {
        parentPort.postMessage('SYNC: FAILED - ' + e.message);
    }
    
    // Wait for async IIFE output + deferred checks
    origSetTimeout(() => {
        parentPort.postMessage('All deferred checks completed without freeze');
        process.exit(0);
    }, 15000);
}
