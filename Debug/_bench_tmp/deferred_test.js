const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'integritytest.js'), 'utf-8');

(async () => {
    const [s1, windowName, declMap] = __obfuscator_1.obfuscateEntireSource(code);
    const result = await __obfuscator_2.obfuscateProperties(s1, windowName, declMap);
    
    console.log('Output length:', result.length);
    
    // Intercept setTimeout to monitor deferred check execution
    let timerCount = 0;
    let timerDone = 0;
    const origSetTimeout = setTimeout;
    
    const interceptedSetTimeout = function(fn, delay) {
        const id = ++timerCount;
        console.log(`  [Timer ${id}] registered with delay ${delay}ms`);
        return origSetTimeout(function() {
            console.log(`  [Timer ${id}] FIRING (delay was ${delay}ms)...`);
            try {
                fn();
                console.log(`  [Timer ${id}] completed OK`);
            } catch (e) {
                console.log(`  [Timer ${id}] THREW: ${e.message}`);
            }
            timerDone++;
            if (timerDone === timerCount) {
                console.log('All timers done!');
                process.exit(0);
            }
        }, delay);
    };

    const ctx = vm.createContext({
        Function, setTimeout: interceptedSetTimeout, console, Promise, Reflect, Proxy, Error,
        Buffer, TextDecoder, TextEncoder, Uint8Array, Math, Map,
        Blob: class Blob{}, NaN, Infinity, undefined, eval,
        atob: (s) => Buffer.from(s, 'base64').toString('binary')
    });
    
    console.log('Running obfuscated code...');
    try {
        vm.runInContext(result, ctx, { timeout: 5000 });
        console.log('SYNC: SUCCESS');
    } catch(e) {
        console.log('SYNC: FAILED -', e.message);
    }
    
    console.log('Waiting for deferred check timers...');
    // Safety exit
    origSetTimeout(() => {
        console.log(`TIMEOUT: ${timerDone}/${timerCount} timers completed`);
        process.exit(1);
    }, 15000);
})();
