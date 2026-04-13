const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');
const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    (async () => {
        const code = fs.readFileSync(path.join(__dirname, '../../test.js'), 'utf-8');
        console.log('Input:', code.length, 'bytes,', code.split('\n').length, 'lines');

        console.log('\nObfuscating test.js...');
        const start = Date.now();
        const [s1, windowName, declMap] = __obfuscator_1.obfuscateEntireSource(code);
        const result = await __obfuscator_2.obfuscateProperties(s1, windowName, declMap);
        console.log('Obfuscation done in', Date.now() - start, 'ms');
        console.log('Output:', result.length, 'bytes');

        // Run in a worker to monitor deferred checks
        console.log('\nRunning obfuscated code in worker...');
        const worker = new Worker(__filename, { workerData: result });

        let done = false;
        worker.on('message', msg => console.log('Worker:', msg));
        worker.on('exit', code => {
            done = true;
            if (code === 0) console.log('\nALL PASSED - sync + all deferred checks');
            else console.log('\nFAILED with exit code', code);
            process.exit(code);
        });
        worker.on('error', err => {
            done = true;
            console.log('Worker error:', err.message);
        });

        // 60s timeout for deferred checks (they can be up to 10s delay)
        setTimeout(() => {
            if (!done) {
                console.log('\nWORKER HUNG - deferred integrity check froze');
                worker.terminate();
                process.exit(1);
            }
        }, 60000);
    })();
} else {
    const code = workerData;

    // Intercept setTimeout to monitor deferred check timers
    const origSetTimeout = setTimeout;
    let timerCount = 0;
    let timerDone = 0;
    let totalTimers = 0;
    globalThis.setTimeout = function(fn, delay, ...args) {
        const id = ++timerCount;
        if (typeof fn === 'function') {
            parentPort.postMessage(`Timer ${id} registered (delay=${delay}ms)`);
            totalTimers++;
            return origSetTimeout(function() {
                const t0 = Date.now();
                try {
                    fn(...args);
                    parentPort.postMessage(`Timer ${id} completed OK (${Date.now()-t0}ms)`);
                } catch(e) {
                    parentPort.postMessage(`Timer ${id} THREW: ${e.message}`);
                }
                timerDone++;
            }, delay);
        }
        return origSetTimeout(fn, delay, ...args);
    };

    // Provide browser-like globals
    globalThis.window = globalThis;
    globalThis.document = { createElement: () => ({ style: {} }), body: { appendChild: () => {} } };
    globalThis.navigator = { userAgent: 'test' };
    globalThis.location = { href: 'http://test.com', hostname: 'test.com' };
    globalThis.XMLHttpRequest = class { open(){} send(){} };
    globalThis.WebSocket = class { constructor(){} send(){} close(){} };
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    globalThis.Image = class {};
    globalThis.HTMLCanvasElement = class {};
    globalThis.CanvasRenderingContext2D = class {};
    globalThis.requestAnimationFrame = (cb) => origSetTimeout(cb, 16);
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
    globalThis.Blob = class Blob {};
    globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');
    globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');

    try {
        eval(code);
        parentPort.postMessage('SYNC: SUCCESS');
    } catch(e) {
        parentPort.postMessage('SYNC: FAILED - ' + e.message);
    }

    // Wait for all deferred timers to complete (up to 15s after last timer fires)
    origSetTimeout(() => {
        parentPort.postMessage(`All timers completed: ${timerDone}/${totalTimers}`);
        process.exit(0);
    }, 15000);
}
