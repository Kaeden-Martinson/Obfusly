/**
 * Test: Verify integrity deferred checks survive Function.prototype.toString replacement.
 * This mimics what the game code (test.js) does — spoofing toString for native look.
 * Uses a Worker thread with a timeout to detect freezes.
 */
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');

if (!isMainThread) {
    // Worker: execute the obfuscated code
    const { workerData } = require('worker_threads');
    globalThis.self = globalThis;
    globalThis.window = globalThis;
    const fn = new Function(workerData.code);
    fn();
    // Keep alive for deferred checks (up to 12s)
    setTimeout(() => { process.exit(0); }, 12000);
    return;
}

// ─── Main thread ────────────────────────────────────────────────────
const config = require(path.join(__dirname, '../../Settings/config'));
const __obfuscator_1 = require(path.join(__dirname, '../../Main/first_obfuscator'));
const __obfuscator_2 = require(path.join(__dirname, '../../Main/property_obfuscator'));

// Save & set config
const saved = { strictMode: config.strictMode, integrityChecks: config.integrityChecks };
config.strictMode = false;
config.integrityChecks = true;

const testCode = `
function spoofSetup() {
    var _native = Function.prototype.toString;
    var _map = new Map();
    var _spoofed = function toString() {
        if (_map.has(this)) return _map.get(this);
        return _native.call(this);
    };
    _map.set(_spoofed, 'function toString() { [native code] }');
    Function.prototype.toString = _spoofed;
    try {
        Object.defineProperty(Function.prototype, 'toString', { writable: false, configurable: false });
    } catch(e) {}
    return 'done';
}

function computeStuff(a, b) {
    return a * b + a - b;
}

function processData(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i] * computeStuff(i, arr.length);
    }
    return sum;
}

var setupResult = spoofSetup();
var r1 = computeStuff(3, 4);
var r2 = processData([1, 2, 3, 4, 5]);
`;

async function runTest() {
    console.log('Test: Integrity deferred checks + Function.prototype.toString spoofing\n');

    const [obfCode, winName, prevMap] = __obfuscator_1.obfuscateEntireSource(testCode);
    const result = await __obfuscator_2.obfuscateProperties(obfCode, winName, prevMap);

    // Restore config
    config.strictMode = saved.strictMode;
    config.integrityChecks = saved.integrityChecks;

    console.log(`Obfuscated size: ${result.length} bytes`);

    // Extract code from new Function("...")() wrapper
    const inner = result.slice('new Function('.length, result.length - ')();'.length);
    const code = JSON.parse(inner);

    console.log('Running in Worker (12s timeout for deferred checks)...\n');

    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: { code } });
        const timer = setTimeout(() => {
            worker.terminate();
            reject(new Error('FREEZE DETECTED: Worker did not exit in 15s'));
        }, 15000);

        worker.on('exit', (exitCode) => {
            clearTimeout(timer);
            if (exitCode === 0) {
                console.log('SUCCESS: Deferred checks completed without freezing!');
                resolve();
            } else {
                reject(new Error(`Worker exited with code ${exitCode}`));
            }
        });

        worker.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

runTest()
    .then(() => process.exit(0))
    .catch(e => {
        console.error('FAIL:', e.message);
        process.exit(1);
    });
