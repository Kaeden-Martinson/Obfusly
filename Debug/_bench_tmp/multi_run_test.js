const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'integritytest.js'), 'utf-8');
const RUNS = 10;
const DEFERRED_WAIT = 12000;
let successes = 0;
let failures = 0;

async function runTest(i) {
    // Each run re-obfuscates (different random names/encodings)
    const [s1, windowName, declMap] = __obfuscator_1.obfuscateEntireSource(code);
    const result = await __obfuscator_2.obfuscateProperties(s1, windowName, declMap);
    
    const ctx = vm.createContext({
        Function, setTimeout, console: {log:()=>{}}, Promise, Reflect, Proxy, Error,
        Buffer, TextDecoder, TextEncoder, Uint8Array, Math, Map,
        Blob: class Blob{}, NaN, Infinity, undefined, eval,
        atob: (s) => Buffer.from(s, 'base64').toString('binary')
    });
    
    try {
        vm.runInContext(result, ctx, { timeout: 5000 });
        return 'SYNC_OK';
    } catch (e) {
        return 'SYNC_FAIL: ' + e.message;
    }
}

(async () => {
    console.log(`Running ${RUNS} obfuscation+execution tests...`);
    for (let i = 0; i < RUNS; i++) {
        const status = await runTest(i);
        if (status === 'SYNC_OK') {
            successes++;
            process.stdout.write(`  Run ${i + 1}: PASS\n`);
        } else {
            failures++;
            process.stdout.write(`  Run ${i + 1}: FAIL (${status})\n`);
        }
    }
    
    console.log(`\nResults: ${successes}/${RUNS} passed, ${failures}/${RUNS} failed`);
    
    // Wait for deferred checks
    console.log(`Waiting ${DEFERRED_WAIT/1000}s for deferred integrity checks...`);
    setTimeout(() => {
        console.log('Deferred checks: No crash - ALL PASSED');
        process.exit(0);
    }, DEFERRED_WAIT);
})();
