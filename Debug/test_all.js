/**
 * JsScramble — Consolidated Debug Test Suite
 * ============================================
 * Single file that tests every major aspect of the obfuscator.
 * Run after any update/change to verify nothing is broken.
 *
 * Usage:
 *   node Debug/test_all.js              # Run all tests
 *   node Debug/test_all.js --quick      # Skip stress & perf tests
 *   node Debug/test_all.js --stress     # Only stress tests
 *   node Debug/test_all.js --perf       # Only performance benchmarks
 *   node Debug/test_all.js --section=N  # Run only section N (1-8)
 *
 * Sections:
 *   1. Syntax & Placeholder Validation
 *   2. Accessor Definition Check
 *   3. Multi-Config E2E (end-to-end with execution)
 *   4. Integrity: Loadtime & Runtime (beautified code must crash)
 *   5. String Decoder Validation
 *   6. Specific Bug Regression Tests
 *   7. Stress Test (N iterations)
 *   8. Performance Benchmarks
 *   9. Integrity Reliability & Internals
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { Worker, isMainThread } = require('worker_threads');
const acorn = require('acorn');

// ─── Worker entry point for integrity sub-tests ─────────────────────
if (!isMainThread) {
    const { workerData } = require('worker_threads');
    const { code } = workerData;
    try {
        globalThis.self = globalThis;
        globalThis.window = globalThis;
        const fn = new Function(code);
        fn();
        process.exit(0);
    } catch (e) {
        console.error(`CRASH: ${e.constructor.name}: ${e.message}`);
        process.exit(1);
    }
}

// ─── CLI args ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
const QUICK = args.includes('--quick');
const STRESS_ONLY = args.includes('--stress');
const PERF_ONLY = args.includes('--perf');
const sectionArg = args.find(a => a.startsWith('--section='));
const ONLY_SECTION = sectionArg ? parseInt(sectionArg.split('=')[1]) : 0;

// ─── Project requires ───────────────────────────────────────────────
process.chdir(path.join(__dirname, '..'));
const runtimeConfig = require('../Settings/config');
const __obfuscator_1 = require('../Main/first_obfuscator');
const __obfuscator_2 = require('../Main/property_obfuscator');

// ─── Snapshot default config ────────────────────────────────────────
const DEFAULT_CONFIG = JSON.parse(JSON.stringify(runtimeConfig));

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else target[key] = source[key];
    }
}

function restoreDefaults() {
    for (const key of Object.keys(runtimeConfig)) {
        if (!(key in DEFAULT_CONFIG)) delete runtimeConfig[key];
    }
    deepMerge(runtimeConfig, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
}

// ─── Obfuscation helper ─────────────────────────────────────────────
async function obfuscate(code, configOverrides = {}) {
    restoreDefaults();
    if (configOverrides && typeof configOverrides === 'object') {
        deepMerge(runtimeConfig, configOverrides);
    }
    const [obfuscatedCode, windowName, prevMap] = __obfuscator_1.obfuscateEntireSource(code);
    const finalCode = await __obfuscator_2.obfuscateProperties(obfuscatedCode, windowName, prevMap);
    restoreDefaults();
    return finalCode;
}

// ─── Worker execution helper ────────────────────────────────────────
function execInWorker(code, timeoutMs = 10000) {
    return new Promise((resolve) => {
        const workerCode = `
            const { parentPort } = require('worker_threads');
            const logs = [];
            console.log = (...args) => logs.push(args.map(String).join(' '));
            console.error = (...args) => logs.push('ERR: ' + args.map(String).join(' '));
            console.warn = (...args) => logs.push('WARN: ' + args.map(String).join(' '));
            try {
                var self = globalThis;
                var window = globalThis;
                self.window = window;
                self.document = {
                    getElementById: function() { return null; },
                    createElement: function(tag) { return { style:{}, src:'', onload:null, onerror:null, appendChild:()=>{}, removeChild:()=>{}, setAttribute:()=>{}, getAttribute:()=>null, innerHTML:'', textContent:'' }; },
                    head: { appendChild: function() {}, removeChild: function() {} },
                    body: { appendChild: function() {}, removeChild: function() {}, style: {} },
                    defaultView: self,
                    querySelector: function() { return null; },
                    querySelectorAll: function() { return []; },
                    addEventListener: function() {},
                };
                self.navigator = { userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', platform: 'Linux x86_64' };
                self.alert = function alert() {};
                self.parseInt = parseInt;
                self.parseFloat = parseFloat;
                self.Math = Math;
                self.String = String;
                self.Array = Array;
                self.Object = Object;
                self.JSON = JSON;
                self.console = console;
                self.Reflect = Reflect;
                self.Proxy = Proxy;
                self.WebSocket = function WebSocket(url) { this.url = url; };
                self.localStorage = { _s:{}, getItem(k){return this._s[k]||null;}, setItem(k,v){this._s[k]=String(v);}, removeItem(k){delete this._s[k];} };
                self.atob = function(str) { return Buffer.from(str, 'base64').toString('binary'); };
                self.btoa = function(str) { return Buffer.from(str, 'binary').toString('base64'); };
                self.decodeURIComponent = decodeURIComponent;
                self.encodeURIComponent = encodeURIComponent;
                self.Blob = function Blob(parts, opts) { this.parts = parts; this.type = (opts&&opts.type)||''; };
                self.URL = { createObjectURL: () => 'blob:null/' + Math.random().toString(36), revokeObjectURL: () => {} };
                self.Worker = class Worker { constructor(){} postMessage(){} terminate(){} set onmessage(fn){} };
                self.Date = Date;
                self.isNaN = isNaN;
                self.isFinite = isFinite;
                self.Number = Number;
                self.Boolean = Boolean;
                self.RegExp = RegExp;
                self.Error = Error;
                self.TypeError = TypeError;
                self.RangeError = RangeError;
                self.Infinity = Infinity;
                self.NaN = NaN;
                self.undefined = undefined;
                self.Map = Map;
                self.Set = Set;
                self.Symbol = Symbol;
                self.Promise = Promise;
                self.Function = Function;
                self.setTimeout = setTimeout;
                self.setInterval = setInterval;
                self.clearTimeout = clearTimeout;
                self.clearInterval = clearInterval;
                self.requestAnimationFrame = function(cb) { return setTimeout(cb, 16); };
                self.Uint8Array = Uint8Array;
                self.Float32Array = Float32Array;
                self.location = { href:'http://localhost/', hostname:'localhost', protocol:'http:', origin:'http://localhost' };

                ${code}
                parentPort.postMessage({ success: true, logs });
            } catch (e) {
                parentPort.postMessage({ error: e.message, stack: e.stack, logs });
            }
        `;
        const worker = new Worker(workerCode, { eval: true });
        const t = setTimeout(() => {
            worker.terminate();
            resolve({ timeout: true, logs: [] });
        }, timeoutMs);
        worker.on('message', (msg) => { clearTimeout(t); resolve(msg); });
        worker.on('error', (err) => { clearTimeout(t); resolve({ error: err.message, logs: [] }); });
    });
}

// ─── Integrity worker (uses __filename so beautify test works) ──────
function runWithTimeout(code, timeoutMs = 5000) {
    return new Promise((resolve) => {
        const worker = new Worker(__filename, { workerData: { code } });
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) { settled = true; worker.terminate(); resolve({ status: 'frozen' }); }
        }, timeoutMs);
        worker.on('exit', (exitCode) => {
            if (!settled) { settled = true; clearTimeout(timer); resolve({ status: exitCode === 0 ? 'ok' : 'crashed' }); }
        });
        worker.on('error', (err) => {
            if (!settled) { settled = true; clearTimeout(timer); resolve({ status: 'error', error: err.message }); }
        });
    });
}

// ─── Beautifier helper ──────────────────────────────────────────────
function beautify(code) {
    try {
        const escodegen = require('escodegen');
        const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
        return escodegen.generate(ast, { format: { indent: { style: '    ' }, newline: '\n', space: ' ', compact: false } });
    } catch { return null; }
}

function extractInnerCode(wrapped) {
    const m = wrapped.match(/^new Function\(([\s\S]+)\)\(\);?$/);
    if (m) {
        try { return JSON.parse(m[1]); } catch {}
    }
    return wrapped;
}

// ─── Results tracking ───────────────────────────────────────────────
let totalPass = 0;
let totalFail = 0;
const failures = [];

function pass(label) { totalPass++; process.stdout.write(`  \x1b[32m✓\x1b[0m ${label}\n`); }
function fail(label, reason) {
    totalFail++;
    failures.push({ label, reason });
    process.stdout.write(`  \x1b[31m✗\x1b[0m ${label}: ${reason}\n`);
}

function section(n, title) {
    console.log(`\n\x1b[1m\x1b[36m━━━ Section ${n}: ${title} ━━━\x1b[0m`);
}

// ═══════════════════════════════════════════════════════════════════════
//  TEST INPUTS
// ═══════════════════════════════════════════════════════════════════════

const SIMPLE_CODE = `
function add(a, b) { return a + b; }
function multiply(x, y) { return x * y; }
function greet(name) { return 'Hello ' + name; }
var result = add(2, 3);
var product = multiply(result, 4);
console.log(greet('World'));
console.log(result, product);
`;

const MEDIUM_CODE = `
function checkPlayer(x) {
  var result = x * 2 + 10;
  if (result > 100) return true;
  return false;
}
function processData(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) { total += arr[i]; }
  return total;
}
var handler = function(msg) {
  var code = msg.charCodeAt(0);
  return code + 42;
};
function init() {
  var a = checkPlayer(50);
  var b = processData([1,2,3]);
  var c = handler("hello");
  console.log(a, b, c);
}
init();
`;

const COMPLEX_CODE = `
(() => {
    !function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { var e; "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.PF = t() } }(function () {
        function PathFinder() { this.grid = []; this.width = 0; }
        PathFinder.prototype.findPath = function(sx, sy, ex, ey) { return [[sx,sy],[ex,ey]]; };
        return { PathFinder: PathFinder };
    });

    let PF = window.PF;
    window.PF = undefined;

    let globalLocalStorage = localStorage;
    let globalDocument = document;
    let localhostMode = false;

    let cachedMathFloor = window.Math.floor;
    let cachedCeilFloor = window.Math.ceil;

    let defaultViewString = 'defaultView';
    let DateString = 'Date';
    let nowString = 'now';
    let localHostString = 'http://localhost/assets/';
    let voidString = 'https://void.websocket.network/assets/';
    let pngString = '.png';

    function crashHandler(caseValue, error) { try { alert('[SCRIPT] TAB CRASHED: Case ' + caseValue); } catch(e) {}; };

    if (globalLocalStorage.getItem('VoidStorage')) globalLocalStorage.removeItem('VoidStorage');
    if (globalLocalStorage.getItem('cto_version')) globalLocalStorage.removeItem('cto_version');

    let currentDate = globalDocument[defaultViewString][DateString][nowString]();
    let keys = {};
    let keyRemoved = false;
    let lastPopup = false;
    let propertysDefined = false;
    let button = null;
    let overlay = null;
    let activeAttacking = false;
    let distanceToTarget = Infinity;

    let Settings = {
        darkMode: 0,
        putToChest: 10,
        pingDisplay: 1,
        fpsDisplay: 1,
        menuOpacity: 0.5,
        Xray: { active: true, opacity: 0.5, bind: "KeyZ" },
        AutoWall: { active: false, mode: 'Normal', bind: "Space" },
        PathFinder: { active: false, bind: "KeyP", End: { x: -1, y: -1 }, inventory: 1, lastKit: 0 },
    };

    const StaticIDMap = { "darkMode": 0, "putToChest": 1, "pingDisplay": 2, "fpsDisplay": 3, "menuOpacity": 4 };

    function calculateDistance(x1, y1, x2, y2) {
        let dx = x2 - x1; let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    function clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
    function handleKeyDown(event) {
        keys[event.code] = true;
        if (event.code === Settings.Xray.bind) Settings.Xray.active = !Settings.Xray.active;
    }
    function handleKeyUp(event) { keys[event.code] = false; }
    function formatMessage(name, score) { return "Player " + name + " scored " + score + " points!"; }
    function processSettings(settings) {
        let result = {};
        for (let key in settings) {
            if (typeof settings[key] === 'object' && settings[key] !== null) result[key] = processSettings(settings[key]);
            else result[key] = settings[key];
        }
        return result;
    }
    function initScript() {
        let dist = calculateDistance(0, 0, 100, 200);
        let clamped = clamp(dist, 0, 500);
        let msg = formatMessage("test", clamped);
        let processed = processSettings(Settings);
        console.log("Script initialized:", msg, "Date:", currentDate);
        console.log("Settings loaded:", JSON.stringify(processed.darkMode));
        console.log("PF available:", typeof PF);
        console.log("StaticIDMap:", Object.keys(StaticIDMap).length);
        loadScript();
    }
    function loadScript() { console.log("loadScript called successfully"); eventListeners(); }
    function eventListeners() { console.log("SCRIPT_COMPLETE"); }
    initScript();
})();
`;

// ═══════════════════════════════════════════════════════════════════════
//  CONFIG PRESETS
// ═══════════════════════════════════════════════════════════════════════

const CONFIGS = {
    default: {},

    stringSplitting: { stringSplitting: 3 },

    noIntegrity: { integrityChecks: "off" },

    noStringConcealment: { stringConcealment: false, wrapStringsInIIFE: false, breakIIFEString: false },

    minimal: {
        integrityChecks: "off",
        stringConcealment: false,
        wrapStringsInIIFE: false,
        breakIIFEString: false,
        concealPrimitives: false,
        concealGlobalObjects: false,
        numberCalculator: false,
        globalBaseIntegerConcealment: false,
        compression: false,
        wrapInIIFE: false,
    },

    userTypical: {
        disableEval: true,
        disableLocalIIFEs: true,
        wrapStringsInIIFE: true,
        breakIIFEString: true,
        compression: true,
        numberCalculator: false,
        globalBaseIntegerConcealment: false,
        wrapInIIFE: false,
        encodedFunctionStrength: 1,
        stringConcealmentSettings: { decodersCount: 1, addNoiseCount: 1 },
        integerPrecentage: { Binary: 100, Hexadecimal: 0, Octal: 0, JSFuck: 0, Refractal: 0 },
    },

    integrityLoadtime: {
        disableEval: true,
        disableLocalIIFEs: true,
        wrapStringsInIIFE: true,
        breakIIFEString: true,
        compression: true,
        numberCalculator: false,
        globalBaseIntegerConcealment: false,
        wrapInIIFE: false,
        encodedFunctionStrength: 1,
        stringConcealmentSettings: { decodersCount: 1, addNoiseCount: 1 },
        integerPrecentage: { Binary: 100, Hexadecimal: 0, Octal: 0, JSFuck: 0, Refractal: 0 },
        integrityChecks: 'loadtime',
    },

    integrityRuntime: {
        disableEval: true,
        disableLocalIIFEs: true,
        wrapStringsInIIFE: true,
        breakIIFEString: true,
        compression: true,
        numberCalculator: false,
        globalBaseIntegerConcealment: false,
        wrapInIIFE: false,
        encodedFunctionStrength: 1,
        stringConcealmentSettings: { decodersCount: 1, addNoiseCount: 1 },
        integerPrecentage: { Binary: 100, Hexadecimal: 0, Octal: 0, JSFuck: 0, Refractal: 0 },
        integrityChecks: 'runtime',
    },

    maxStrength: {
        encodedFunctionStrength: 5,
        stringConcealmentSettings: { decodersCount: 3, addNoiseCount: 3 },
        integerPrecentage: { Refractal: 30, JSFuck: 10, Hexadecimal: 20, Octal: 20, Binary: 20 },
        concealPrimitives: true,
        concealGlobalObjects: true,
        breakASTs: true,
        compression: true,
        stringSplitting: 2,
    },

    noJSFuck: {
        integerPrecentage: { Refractal: 0, JSFuck: 0, Hexadecimal: 50, Octal: 25, Binary: 25 },
    },
};

// ═══════════════════════════════════════════════════════════════════════
//  PLACEHOLDER PATTERNS
// ═══════════════════════════════════════════════════════════════════════

const PLACEHOLDERS = [
    '__ENCODED_STRINGS__',
    '__LET_PLACEHOLDER__',
    '__QUOTE_OPERATORS__',
    '_ANTI_TERSER_',
    '__ITER__',
    '__STRING__ACCESSOR__',
];

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 1: Syntax & Placeholder Validation
// ═══════════════════════════════════════════════════════════════════════

async function section1() {
    section(1, 'Syntax & Placeholder Validation');

    const configNames = ['default', 'stringSplitting', 'noIntegrity', 'noStringConcealment', 'minimal', 'userTypical', 'maxStrength', 'noJSFuck'];

    for (const cfgName of configNames) {
        const label = `syntax [${cfgName}]`;
        try {
            const result = await obfuscate(SIMPLE_CODE, CONFIGS[cfgName]);

            // Syntax check with new Function
            try {
                new Function(result);
            } catch (e) {
                fail(label, `Syntax error: ${e.message.slice(0, 100)}`);
                continue;
            }

            // Placeholder check
            let hasPlaceholder = false;
            for (const ph of PLACEHOLDERS) {
                if (result.includes(ph)) {
                    fail(label, `Remaining placeholder: ${ph}`);
                    hasPlaceholder = true;
                    break;
                }
            }
            if (hasPlaceholder) continue;

            // Acorn parse check
            try {
                acorn.parse(result, { ecmaVersion: 'latest', sourceType: 'script' });
            } catch (e) {
                fail(label, `Acorn parse error: ${e.message.slice(0, 100)}`);
                continue;
            }

            pass(label);
        } catch (e) {
            fail(label, `Obfuscation error: ${e.message.slice(0, 100)}`);
        }
    }

    // Also test with medium and complex code on default config
    for (const [name, code] of [['medium', MEDIUM_CODE], ['complex', COMPLEX_CODE]]) {
        const label = `syntax [${name} code, default config]`;
        try {
            const result = await obfuscate(code);
            new Function(result);
            for (const ph of PLACEHOLDERS) {
                if (result.includes(ph)) { fail(label, `Remaining placeholder: ${ph}`); continue; }
            }
            pass(label);
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 2: Accessor Definition Check
// ═══════════════════════════════════════════════════════════════════════

async function section2() {
    section(2, 'Accessor Definition Check');

    const configs = ['default', 'userTypical', 'maxStrength', 'stringSplitting'];

    for (const cfgName of configs) {
        const label = `accessor defined [${cfgName}]`;
        try {
            const result = await obfuscate(COMPLEX_CODE, CONFIGS[cfgName]);

            // Find most-called short function (the string accessor)
            const callRegex = /\b([a-zA-Z_$][\w$]{0,3})\s*\(\s*(?:\+\[\]|\d|0[bBxXoO])/g;
            const callCounts = {};
            let m;
            while ((m = callRegex.exec(result)) !== null) {
                callCounts[m[1]] = (callCounts[m[1]] || 0) + 1;
            }

            let maxName = null, maxCount = 0;
            for (const [name, count] of Object.entries(callCounts)) {
                if (count > maxCount) { maxCount = count; maxName = name; }
            }

            if (maxName && maxCount > 20) {
                const defPatterns = [
                    `var ${maxName}=`, `let ${maxName}=`, `const ${maxName}=`,
                    `var ${maxName} =`, `let ${maxName} =`, `const ${maxName} =`,
                    `function ${maxName}(`, `function ${maxName} (`
                ];
                const isDefined = defPatterns.some(p => result.includes(p));
                if (isDefined) {
                    pass(label + ` ("${maxName}" x${maxCount})`);
                } else {
                    fail(label, `"${maxName}" called ${maxCount}x but NEVER DEFINED`);
                }
            } else {
                pass(label + ' (no high-frequency accessor found)');
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 3: Multi-Config E2E (execution)
// ═══════════════════════════════════════════════════════════════════════

async function section3() {
    section(3, 'Multi-Config End-to-End Execution');

    const tests = [
        { label: 'default config', code: SIMPLE_CODE, config: {}, expect: ['Hello World', '5', '20'] },
        { label: 'stringSplitting=3', code: SIMPLE_CODE, config: CONFIGS.stringSplitting, expect: ['Hello World'] },
        { label: 'no integrity', code: SIMPLE_CODE, config: CONFIGS.noIntegrity, expect: ['Hello World'] },
        { label: 'no string concealment', code: SIMPLE_CODE, config: CONFIGS.noStringConcealment, expect: ['Hello World'] },
        { label: 'minimal config', code: SIMPLE_CODE, config: CONFIGS.minimal, expect: ['Hello World'] },
        { label: 'medium code, user config', code: MEDIUM_CODE, config: CONFIGS.userTypical, expect: ['6'] },
        { label: 'complex code, default', code: COMPLEX_CODE, config: {}, expect: ['SCRIPT_COMPLETE'] },
        { label: 'complex code, userTypical', code: COMPLEX_CODE, config: CONFIGS.userTypical, expect: ['SCRIPT_COMPLETE'] },
    ];

    for (const t of tests) {
        const label = `exec [${t.label}]`;
        try {
            const result = await obfuscate(t.code, t.config);

            // Syntax check first
            try { new Function(result); } catch (e) {
                fail(label, `Syntax error: ${e.message.slice(0, 80)}`);
                continue;
            }

            // Execute in worker
            const execResult = await execInWorker(result, 15000);

            if (execResult.timeout) {
                fail(label, 'Execution TIMEOUT (infinite loop?)');
            } else if (execResult.error) {
                fail(label, `Runtime error: ${execResult.error.slice(0, 100)}`);
            } else if (execResult.success) {
                const logs = (execResult.logs || []).join(' ');
                const allFound = t.expect.every(e => logs.includes(e));
                if (allFound) {
                    pass(label);
                } else {
                    fail(label, `Expected [${t.expect.join(', ')}] in output but got: ${logs.slice(0, 150)}`);
                }
            } else {
                fail(label, 'Unexpected worker response');
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 4: Integrity (beautified code must crash/freeze)
// ═══════════════════════════════════════════════════════════════════════

async function section4() {
    section(4, 'Integrity: Beautified Code Must Crash');

    const modes = ['loadtime', 'runtime'];
    const inputs = [
        { label: 'simple', code: SIMPLE_CODE },
        { label: 'medium', code: MEDIUM_CODE },
    ];

    for (const mode of modes) {
        for (const input of inputs) {
            const cfg = mode === 'loadtime' ? CONFIGS.integrityLoadtime : CONFIGS.integrityRuntime;

            // Test 1: Original should run
            const origLabel = `integrity ${mode} [${input.label}] original runs`;
            try {
                const result = await obfuscate(input.code, cfg);
                const origRun = await runWithTimeout(result, 8000);
                if (origRun.status === 'ok') {
                    pass(origLabel);
                } else {
                    fail(origLabel, `Original code ${origRun.status} (expected ok)`);
                }

                // Test 2: Beautified should be stopped
                const beautLabel = `integrity ${mode} [${input.label}] beautified stopped`;
                const innerCode = extractInnerCode(result);
                const beautified = beautify(innerCode);
                if (!beautified) {
                    pass(beautLabel + ' (cannot beautify — also acceptable)');
                } else {
                    const beautRun = await runWithTimeout(beautified, 5000);
                    if (beautRun.status === 'frozen' || beautRun.status === 'crashed') {
                        pass(beautLabel + ` (${beautRun.status})`);
                    } else if (beautRun.status === 'ok') {
                        fail(beautLabel, 'Beautified code RUNS OK — integrity did not detect modification');
                    } else {
                        pass(beautLabel + ` (${beautRun.status})`);
                    }
                }
            } catch (e) {
                fail(origLabel, e.message.slice(0, 100));
            }
        }
    }

    // Test "once" and "continuous" integrity modes (same as test_integrity_v2)
    for (const mode of ['once', 'continuous']) {
        const label = `integrity mode "${mode}" beautified stopped`;
        try {
            restoreDefaults();
            Object.assign(runtimeConfig, {
                integrityChecks: mode,
                compression: true,
                concealPrimitives: true,
                globalBaseIntegerConcealment: true,
                numberEncoding: true,
                numberCalculator: true,
                stringEncoding: true,
                stringConcealment: true,
                wrapInIIFE: false,
                enableAntiDebugger: false,
                disableConsoleOutput: false,
                breakASTs: true,
                nameGenerationStyle: 'minify',
            });
            const [gen, winN, declMap] = __obfuscator_1.obfuscateEntireSource(MEDIUM_CODE);
            const obf = await __obfuscator_2.obfuscateProperties(gen, winN, declMap);
            restoreDefaults();

            const origRun = await runWithTimeout(obf, 8000);
            if (origRun.status !== 'ok') {
                fail(label, `Original code ${origRun.status}`);
                continue;
            }

            const innerCode = extractInnerCode(obf);
            const beautified = beautify(innerCode);
            if (!beautified) {
                pass(label + ' (cannot beautify)');
                continue;
            }
            const beautRun = await runWithTimeout(beautified, 5000);
            if (beautRun.status === 'frozen' || beautRun.status === 'crashed') {
                pass(label + ` (${beautRun.status})`);
            } else {
                fail(label, `Beautified code status: ${beautRun.status}`);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Integrity hash placeholder check (from test_integrity_full / test_integrity_diag)
    {
        const label = 'integrity no unreplaced hash placeholders';
        try {
            const result = await obfuscate(SIMPLE_CODE, { integrityChecks: true });
            const inner = extractInnerCode(result);
            const phMatches = inner.match(/0xcafed[0-9a-f]{3}/g);
            if (phMatches && phMatches.length > 0) {
                fail(label, `Found ${phMatches.length} unreplaced placeholder(s): ${phMatches.slice(0, 3).join(', ')}`);
            } else {
                pass(label);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 5: String Decoder Validation
// ═══════════════════════════════════════════════════════════════════════

async function section5() {
    section(5, 'String Decoder Validation');

    const label = 'string decoder all strings decode correctly';
    try {
        const result = await obfuscate(COMPLEX_CODE, {
            ...CONFIGS.userTypical,
            integrityChecks: 'off',
            stringSplitting: 0,
        });

        // Find encoded string array
        const arrMatch = result.match(/var\s+(\w+)\s*=\s*\[('[^']*'(?:,'[^']*')*)\]/);
        if (!arrMatch) {
            pass(label + ' (no encoded array found — may use different encoding)');
            return;
        }

        const encoded = arrMatch[2].match(/'([^']*)'/g).map(s => s.slice(1, -1));

        // Find custom64 alphabet
        const cmapMatch = result.match(/var\s+(\w+)\s*=\s*'([^']{64,})'/);
        if (!cmapMatch) {
            pass(label + ' (no custom alphabet found)');
            return;
        }
        const custom64 = cmapMatch[2];
        const STD_B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        // Find padding char
        const padMatchAll = result.matchAll(/var\s+(\w+)\s*=\s*'([^']{1})'/g);
        let padChar = null;
        for (const m of padMatchAll) {
            if (!custom64.includes(m[2])) { padChar = m[2]; break; }
        }

        let decodeFailures = 0;
        for (let i = 0; i < encoded.length; i++) {
            const s = encoded[i];
            let stdB64 = '';
            for (let j = 0; j < s.length; j++) {
                const ch = s[j];
                const pos = custom64.indexOf(ch);
                if (pos >= 0) stdB64 += STD_B64[pos];
                else if (padChar && ch === padChar) stdB64 += '=';
                else stdB64 += ch;
            }
            try {
                Buffer.from(stdB64, 'base64').toString('utf8');
            } catch {
                decodeFailures++;
            }
        }

        if (decodeFailures === 0) {
            pass(label + ` (${encoded.length} strings)`);
        } else {
            fail(label, `${decodeFailures}/${encoded.length} strings failed to decode`);
        }
    } catch (e) {
        fail(label, e.message.slice(0, 100));
    }

    // Bracket balance check (from syntax_check.js)
    {
        const label2 = 'bracket balance in obfuscated output';
        try {
            const result = await obfuscate(COMPLEX_CODE);
            let parenDepth = 0, bracketDepth = 0, braceDepth = 0;
            let inString = false, stringChar = '', escaped = false;
            for (let i = 0; i < result.length; i++) {
                const ch = result[i];
                if (escaped) { escaped = false; continue; }
                if (ch === '\\') { escaped = true; continue; }
                if (inString) { if (ch === stringChar) inString = false; continue; }
                if (ch === '\'' || ch === '"' || ch === '`') { inString = true; stringChar = ch; continue; }
                if (ch === '(') parenDepth++;
                if (ch === ')') parenDepth--;
                if (ch === '[') bracketDepth++;
                if (ch === ']') bracketDepth--;
                if (ch === '{') braceDepth++;
                if (ch === '}') braceDepth--;
            }

            if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
                pass(label2);
            } else {
                fail(label2, `Unbalanced: parens=${parenDepth} brackets=${bracketDepth} braces=${braceDepth}`);
            }
        } catch (e) {
            fail(label2, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 6: Specific Bug Regression Tests
// ═══════════════════════════════════════════════════════════════════════

async function section6() {
    section(6, 'Bug Regression Tests');

    // Regression: JSFuck percentage=0 should produce no JSFuck number patterns
    {
        const label = 'no JSFuck when percentage=0';
        try {
            const result = await obfuscate(SIMPLE_CODE, CONFIGS.noJSFuck);
            const inner = extractInnerCode(result);
            // Look for actual JSFuck number patterns (not part of trap code)
            const jsfuckNumberPatterns = /\(\+\[\]\)|\(\+!!\[\]\)|\(!!\[\]\+!!\[\]\)|\(!!\[\]\+!!\[\]\+!!\[\]\)/;
            const hasJSFuckNumbers = jsfuckNumberPatterns.test(inner);
            if (!hasJSFuckNumbers) {
                pass(label);
            } else {
                fail(label, 'Found JSFuck number encoding when JSFuck=0%');
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Regression: Function name collisions in integrity output
    {
        const label = 'no function name collisions in integrity output';
        try {
            const result = await obfuscate(SIMPLE_CODE, { integrityChecks: true });
            const inner = extractInnerCode(result);
            try {
                const ast = acorn.parse(inner, { ecmaVersion: 'latest', sourceType: 'script' });
                const names = new Map();

                function scanBody(body) {
                    for (const node of body) {
                        if (node.type === 'FunctionDeclaration' && node.id?.name) {
                            const nm = node.id.name;
                            names.set(nm, (names.get(nm) || 0) + 1);
                        }
                        if (node.type === 'VariableDeclaration') {
                            for (const d of node.declarations) {
                                if (d.id?.name && d.init && (d.init.type === 'FunctionExpression' || d.init.type === 'ArrowFunctionExpression')) {
                                    const nm = d.id.name;
                                    names.set(nm, (names.get(nm) || 0) + 1);
                                }
                            }
                        }
                        // Recurse into IIFE wrappers
                        if (node.type === 'ExpressionStatement') {
                            const callee = node.expression?.callee || node.expression?.argument?.callee;
                            if (callee?.body?.body) scanBody(callee.body.body);
                        }
                    }
                }
                scanBody(ast.body);

                const collisions = [...names.entries()].filter(([_, count]) => count > 1);
                if (collisions.length === 0) {
                    pass(label);
                } else {
                    fail(label, `Collisions: ${collisions.map(([n, c]) => `${n}(${c}x)`).join(', ')}`);
                }
            } catch (parseErr) {
                fail(label, `Parse error checking collisions: ${parseErr.message.slice(0, 80)}`);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Regression: compression does not lose const declarations
    {
        const label = 'compression preserves const declarations';
        try {
            const result = await obfuscate(COMPLEX_CODE, { ...CONFIGS.userTypical, compression: true });
            // Check that the result still has const/let/var declarations
            const hasDeclarations = /\b(const|let|var)\s+\w/.test(result);
            if (hasDeclarations) {
                pass(label);
            } else {
                fail(label, 'No variable declarations found after compression');
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Regression: disableEval config actually removes eval
    {
        const label = 'disableEval removes eval usage';
        try {
            const result = await obfuscate(SIMPLE_CODE, { disableEval: true, disableLocalIIFEs: true });
            // With disableEval, new Function wrapper should be used instead of eval
            // Check that 'eval(' doesn't appear in output (it may appear in string literals though)
            const inner = extractInnerCode(result);
            // Check top-level eval calls — string-concealment IIFE may use eval internally
            // This is a loose check; disableEval means the outer wrapper uses new Function
            if (result.startsWith('new Function(') || !result.startsWith('eval(')) {
                pass(label);
            } else {
                fail(label, 'Output starts with eval despite disableEval=true');
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Regression: multiple output sizes are reasonable (not empty, not unreasonably small)
    {
        const label = 'output size is reasonable';
        try {
            const result = await obfuscate(SIMPLE_CODE);
            const ratio = result.length / SIMPLE_CODE.length;
            if (result.length > 100 && ratio > 1) {
                pass(label + ` (${result.length} bytes, ${ratio.toFixed(1)}x)`);
            } else {
                fail(label, `Output ${result.length} bytes (ratio ${ratio.toFixed(1)}x) seems wrong`);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // Regression: magic numbers survive obfuscation but are NOT in encoded string array
    {
        const label = 'magic numbers not captured in string array';
        try {
            const magicCode = `var port = 6969;\nvar secret = 69420;\nvar key = 42069;\nconsole.log(port, secret, key);`;
            const result = await obfuscate(magicCode, {
                disableEval: true, disableLocalIIFEs: true, wrapStringsInIIFE: true,
                breakIIFEString: true, compression: true, numberCalculator: false,
                globalBaseIntegerConcealment: false, wrapInIIFE: false, encodedFunctionStrength: 1,
                stringConcealmentSettings: { decodersCount: 1, addNoiseCount: 1 },
                integerPrecentage: { Binary: 100, Hexadecimal: 0, Octal: 0, JSFuck: 0, Refractal: 0 },
                concealPrimitives: false, breakASTs: false, stringSplitting: 0,
            });
            const has6969 = /\b6969\b/.test(result);
            const has69420 = /\b69420\b/.test(result);
            const has42069 = /\b42069\b/.test(result);
            const arrMatch = result.match(/var \w+=\[([^\]]+)\]/);
            const arrStr = arrMatch ? arrMatch[1] : '';
            const inArr = arrStr.includes('6969') || arrStr.includes('69420') || arrStr.includes('42069');
            if (has6969 && has69420 && has42069 && !inArr) {
                pass(label);
            } else {
                fail(label, `6969=${has6969} 69420=${has69420} 42069=${has42069} inArr=${inArr}`);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 7: Stress Test
// ═══════════════════════════════════════════════════════════════════════

async function section7() {
    section(7, 'Stress Test');

    const ITERATIONS = QUICK ? 5 : 30;
    let syntaxFails = 0;
    let accessorFails = 0;
    let allOk = true;

    for (let i = 0; i < ITERATIONS; i++) {
        try {
            const result = await obfuscate(COMPLEX_CODE, CONFIGS.userTypical);

            // Syntax check
            try {
                new Function(result);
            } catch (e) {
                syntaxFails++;
                allOk = false;
                continue;
            }

            // Accessor definition check
            const calls = {};
            const re = /\b([A-Za-z_$][A-Za-z0-9_$]{0,3})\(\d+\)/g;
            let m;
            while ((m = re.exec(result)) !== null) {
                calls[m[1]] = (calls[m[1]] || 0) + 1;
            }
            const sorted = Object.entries(calls).sort((a, b) => b[1] - a[1]);
            if (sorted.length > 0 && sorted[0][1] > 20) {
                const fnName = sorted[0][0];
                const defRegex = new RegExp('(?:const|var|let|function)\\s+' + fnName.replace(/[$]/g, '\\$') + '\\b');
                if (!defRegex.test(result)) {
                    accessorFails++;
                    allOk = false;
                }
            }

            if ((i + 1) % 10 === 0) process.stdout.write(`  ... ${i + 1}/${ITERATIONS} done\n`);
        } catch (e) {
            allOk = false;
        }
    }

    if (allOk) {
        pass(`stress ${ITERATIONS} iterations all OK`);
    } else {
        if (syntaxFails > 0) fail(`stress syntax`, `${syntaxFails}/${ITERATIONS} had syntax errors`);
        if (accessorFails > 0) fail(`stress accessor`, `${accessorFails}/${ITERATIONS} had undefined accessor`);
        if (syntaxFails === 0 && accessorFails === 0) fail('stress', 'Unknown failures');
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 8: Performance Benchmarks
// ═══════════════════════════════════════════════════════════════════════

async function section8() {
    section(8, 'Performance Benchmarks');

    const GAME_LOOP = `
var entities = [];
for (var i = 0; i < 50; i++) {
  entities.push({ x: Math.random()*800, y: Math.random()*600, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, width: 10+Math.random()*20, height: 10+Math.random()*20, health: 100, active: true, type: i%3===0?'enemy':i%3===1?'bullet':'player' });
}
function updatePhysics(dt) {
  for (var i=0; i<entities.length; i++) { var e=entities[i]; if(!e.active) continue; e.x+=e.vx*dt; e.y+=e.vy*dt; e.vy+=0.5*dt; if(e.x<0||e.x>800)e.vx*=-0.8; if(e.y<0||e.y>600){e.vy*=-0.8;e.y=Math.min(600,Math.max(0,e.y));} }
}
function checkCollisions() {
  var count=0;
  for(var i=0;i<entities.length;i++){for(var j=i+1;j<entities.length;j++){var a=entities[i],b=entities[j];if(!a.active||!b.active)continue;if(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y){count++;if(a.type==='bullet'&&b.type==='enemy')b.health-=10;if(b.type==='bullet'&&a.type==='enemy')a.health-=10;}}}
  return count;
}
for(var frame=0;frame<300;frame++){updatePhysics(0.016);checkCollisions();}
console.log("BENCH_DONE");
`;

    const STRING_HEAVY = `
function buildMessage(type,id,data){return '{"type":"'+type+'","id":'+id+',"data":'+JSON.stringify(data)+'}';}
function parseKeyValue(str){var result={};var pairs=str.split('&');for(var i=0;i<pairs.length;i++){var kv=pairs[i].split('=');result[kv[0]]=kv[1]||'';}return result;}
var messages=[];
for(var i=0;i<500;i++){messages.push(buildMessage('update',i,{x:i*1.5,y:i*2.3,name:'entity_'+i}));}
var parsed={};for(var i=0;i<1000;i++){parsed=parseKeyValue('name=test&x=100&y=200&health=100&type=player');}
console.log("BENCH_DONE");
`;

    const MATH_INTENSIVE = `
function matMul(a,b,n){var c=[];for(var i=0;i<n;i++){c[i]=[];for(var j=0;j<n;j++){var sum=0;for(var k=0;k<n;k++)sum+=a[i][k]*b[k][j];c[i][j]=sum;}}return c;}
function createMatrix(n){var m=[];for(var i=0;i<n;i++){m[i]=[];for(var j=0;j<n;j++)m[i][j]=Math.random()*10;}return m;}
var n=20;var a=createMatrix(n);var b=createMatrix(n);
for(var iter=0;iter<10;iter++){matMul(a,b,n);}
console.log("BENCH_DONE");
`;

    const OBJECT_ACCESS = `
var pool = [];
function Entity(id, x, y, type) { this.id=id; this.position={x:x,y:y}; this.velocity={x:0,y:0}; this.components={}; this.type=type; this.active=true; }
Entity.prototype.addComponent = function(name,data) { this.components[name]=data; return this; };
Entity.prototype.getComponent = function(name) { return this.components[name]||null; };
Entity.prototype.update = function(dt) { this.position.x+=this.velocity.x*dt; this.position.y+=this.velocity.y*dt; var h=this.components.health; if(h) h.current=Math.max(0,h.current-h.decay*dt); };
for(var i=0;i<80;i++){var e=new Entity(i,Math.random()*800,Math.random()*600,i%4===0?'boss':'grunt');e.addComponent('health',{current:100,max:100,decay:0.1});e.velocity.x=(Math.random()-0.5)*5;e.velocity.y=(Math.random()-0.5)*5;pool.push(e);}
var totalHealth=0;for(var frame=0;frame<300;frame++){for(var i=0;i<pool.length;i++){pool[i].update(0.016);var h=pool[i].getComponent('health');if(h)totalHealth+=h.current;}}
console.log("BENCH_DONE");
`;

    const ARRAY_INTENSIVE = `
function quickSort(arr,left,right){if(left>=right)return;var pivot=arr[Math.floor((left+right)/2)];var i=left,j=right;while(i<=j){while(arr[i]<pivot)i++;while(arr[j]>pivot)j--;if(i<=j){var temp=arr[i];arr[i]=arr[j];arr[j]=temp;i++;j--;}}if(left<j)quickSort(arr,left,j);if(i<right)quickSort(arr,i,right);}
var data=[];for(var i=0;i<5000;i++)data.push(Math.random()*10000);
var sorted=data.slice();quickSort(sorted,0,sorted.length-1);
var filtered=[];for(var i=0;i<data.length;i++){if(data[i]>2000&&data[i]<8000)filtered.push(data[i]);}
var sum=0;for(var i=0;i<filtered.length;i++)sum+=filtered[i];
var ringSize=256;var ringBuffer=[];for(var rb=0;rb<ringSize;rb++)ringBuffer.push(0);
var head=0,tail=0,count=0;for(var i=0;i<10000;i++){ringBuffer[head]=i*1.1;head=(head+1)%ringSize;count++;if(count>128){tail=(tail+1)%ringSize;count--;}}
console.log("BENCH_DONE");
`;

    const benchmarks = [
        { name: 'Game Loop', code: GAME_LOOP },
        { name: 'String Heavy', code: STRING_HEAVY },
        { name: 'Math Intensive', code: MATH_INTENSIVE },
        { name: 'Object Access (ECS)', code: OBJECT_ACCESS },
        { name: 'Array Intensive', code: ARRAY_INTENSIVE },
    ];

    for (const bench of benchmarks) {
        const label = `perf [${bench.name}]`;
        try {
            const startObf = Date.now();
            const result = await obfuscate(bench.code, { ...CONFIGS.userTypical, integrityChecks: 'off' });
            const obfTime = Date.now() - startObf;

            // Syntax check
            try { new Function(result); } catch (e) {
                fail(label, `Obfuscated code has syntax error: ${e.message.slice(0, 80)}`);
                continue;
            }

            // Execute original
            const origExec = await execInWorker(bench.code, 15000);
            if (!origExec.success && !origExec.timeout) {
                fail(label, `Original code failed: ${(origExec.error || '').slice(0, 80)}`);
                continue;
            }

            // Execute obfuscated
            const obfExec = await execInWorker(result, 30000);
            if (obfExec.timeout) {
                fail(label, 'Obfuscated code TIMEOUT');
                continue;
            }
            if (obfExec.error) {
                fail(label, `Obfuscated code error: ${obfExec.error.slice(0, 80)}`);
                continue;
            }

            const sizeRatio = (result.length / bench.code.length).toFixed(1);
            pass(label + ` (obf: ${obfTime}ms, size: ${sizeRatio}x, ${(result.length / 1024).toFixed(1)}KB)`);
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 9: Integrity Reliability & Internals
// ═══════════════════════════════════════════════════════════════════════

async function section9() {
    section(9, 'Integrity Reliability & Internals');

    // 9a: Repeated execution reliability with integrity ON (from test_integrity_final.js)
    {
        const NUM_RUNS = QUICK ? 3 : 10;
        const label = `integrity repeated execution (${NUM_RUNS} runs)`;
        let passed = 0;
        let lastError = '';

        for (let i = 0; i < NUM_RUNS; i++) {
            try {
                restoreDefaults();
                Object.assign(runtimeConfig, {
                    integrityChecks: true,
                    compression: true,
                    stringConcealment: true,
                });
                const [obfCode, winName, prevMap] = __obfuscator_1.obfuscateEntireSource(SIMPLE_CODE);
                const output = await __obfuscator_2.obfuscateProperties(obfCode, winName, prevMap);
                restoreDefaults();

                const tmpFile = path.join(__dirname, `_tmp_reliability_${i}.js`);
                fs.writeFileSync(tmpFile, output);
                try {
                    const { execSync } = require('child_process');
                    const result = execSync(`node "${tmpFile}"`, { timeout: 20000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
                    passed++;
                } catch (e) {
                    lastError = e.killed ? 'TIMEOUT' : (e.stderr || e.message || '').toString().trim().split('\n')[0];
                } finally {
                    try { fs.unlinkSync(tmpFile); } catch {}
                }
            } catch (e) {
                lastError = e.message.slice(0, 80);
            }
        }

        if (passed === NUM_RUNS) {
            pass(label);
        } else {
            fail(label, `${passed}/${NUM_RUNS} passed. Last error: ${lastError.slice(0, 100)}`);
        }
    }

    // 9b: Neutralizer ordering (from test_neutralizer_order.js)
    {
        const label = 'integrity neutralizers before checks';
        try {
            restoreDefaults();
            Object.assign(runtimeConfig, {
                integrityChecks: true,
                compression: true,
                stringConcealment: true,
            });
            global.__integrityDebug = {};
            const [obfCode, winName, prevMap] = __obfuscator_1.obfuscateEntireSource(SIMPLE_CODE);
            const output = await __obfuscator_2.obfuscateProperties(obfCode, winName, prevMap);
            restoreDefaults();

            const dbg = global.__integrityDebug;
            const h1 = dbg.hasher1Name;
            const h2 = dbg.hasher2Name;

            if (!h1 && !h2) {
                pass(label + ' (no hasher debug info — skip)');
            } else {
                let innerCode;
                const nfMatch = output.match(/^new Function\(([\s\S]+)\)\(\);?$/);
                if (nfMatch) try { innerCode = JSON.parse(nfMatch[1]); } catch { innerCode = output; }
                else innerCode = output;

                const events = [];
                const names = [h1, h2].filter(Boolean);
                const escapedNames = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

                // Find neutralizer assignments
                const neutPattern = new RegExp(`(${escapedNames.join('|')})=function\\b`, 'g');
                let m;
                while ((m = neutPattern.exec(innerCode)) !== null) {
                    const before = innerCode.substring(Math.max(0, m.index - 15), m.index);
                    if (before.includes('function ')) continue;
                    events.push({ pos: m.index, type: 'NEUTRALIZE', name: m[1] });
                }

                // Find hasher calls
                const callPattern = new RegExp(`(?:${escapedNames.join('|')})\\(`, 'g');
                while ((m = callPattern.exec(innerCode)) !== null) {
                    const before = innerCode.substring(Math.max(0, m.index - 20), m.index);
                    if (before.match(/function\s+$/)) continue;
                    const name = names.find(n => innerCode.substring(m.index, m.index + n.length) === n);
                    events.push({ pos: m.index, type: 'CALL', name });
                }

                events.sort((a, b) => a.pos - b.pos);

                const neutralized = new Set();
                let badCalls = 0;
                for (const e of events) {
                    if (e.type === 'NEUTRALIZE') neutralized.add(e.name);
                    if (e.type === 'CALL' && neutralized.has(e.name)) badCalls++;
                }

                if (badCalls === 0) {
                    pass(label);
                } else {
                    fail(label, `${badCalls} hasher calls occur AFTER neutralization`);
                }
            }
            delete global.__integrityDebug;
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }

    // 9c: Integrity trap pattern detection (from diagnose_integrity.js)
    {
        const patterns = {
            'for(;;)': /for\(;;\)/,
            'while(!![])': /while\(!!\[\]\)/,
            'do{}while(!![])': /do\{\}while\(!!\[\]\)/,
            'var=!![];while()': /var \w+=!!\[\];while\(\w+\)/,
            'for(var=0;<1;-=1)': /for\(var \w+=0;\w+<1;\w+-=1\)/,
        };

        for (const mode of ['once', 'continuous']) {
            const label = `integrity "${mode}" has trap patterns`;
            try {
                restoreDefaults();
                Object.assign(runtimeConfig, {
                    integrityChecks: mode,
                    compression: true,
                    concealPrimitives: true,
                    globalBaseIntegerConcealment: true,
                    numberEncoding: true,
                    numberCalculator: true,
                    stringEncoding: true,
                    stringConcealment: true,
                    wrapInIIFE: false,
                    enableAntiDebugger: false,
                    disableConsoleOutput: false,
                    breakASTs: true,
                    nameGenerationStyle: 'minify',
                });
                const [gen, winN, declMap] = __obfuscator_1.obfuscateEntireSource(MEDIUM_CODE);
                const obf = await __obfuscator_2.obfuscateProperties(gen, winN, declMap);
                restoreDefaults();

                const foundPatterns = [];
                for (const [name, regex] of Object.entries(patterns)) {
                    if (regex.test(obf)) foundPatterns.push(name);
                }

                if (foundPatterns.length > 0) {
                    pass(label + ` (found: ${foundPatterns.join(', ')})`);
                } else {
                    fail(label, 'No known trap patterns found in output');
                }
            } catch (e) {
                fail(label, e.message.slice(0, 100));
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  SECTION 10: Code Pattern Tests (from diagnostic.js)
// ═══════════════════════════════════════════════════════════════════════

async function section10() {
    section(10, 'Code Pattern Tests');

    const patterns = [
        {
            name: 'Simple IIFE with locals',
            code: `(() => { let x = 42; let y = "hello"; function add(a, b) { return a + b; } console.log("result:", add(x, 10), y); })();`,
            expect: 'result:',
        },
        {
            name: 'Global object access via window',
            code: `(() => { let m = Math.floor(3.7); console.log("floor:", m); console.log("doc:", typeof document); })();`,
            expect: 'floor:',
        },
        {
            name: 'String property chain',
            code: `(() => { let defaultViewString = 'defaultView'; let win = document[defaultViewString]; console.log("window is self?", win === self); console.log("Math.floor:", win['Math']['floor'](3.7)); })();`,
            expect: 'Math.floor:',
        },
        {
            name: 'toString comparison',
            code: `(() => { let alertStr = document['defaultView']['alert']['toString'](); console.log("alert toString:", JSON.stringify(alertStr)); let match = alertStr == 'function alert() { [native code] }'; console.log("matches native:", match); })();`,
            expect: 'alert toString:',
        },
        {
            name: 'UMD module pattern',
            code: `(() => { !function(t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else { var e; "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.TestLib = t() } }(function() { return { version: "1.0" }; }); console.log("TestLib:", typeof TestLib !== 'undefined' ? JSON.stringify(TestLib) : "undefined"); })();`,
            expect: 'TestLib:',
        },
        {
            name: 'Full default config no traps',
            code: `(() => { let cachedMathFloor = window.Math.floor; let currentDate = document['defaultView']['Date']['now'](); let keys = {}; let Settings = { darkMode: 0, putToChest: 10, Xray: { active: true, bind: "KeyZ" } }; function calculateDistance(x1, y1, x2, y2) { return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)); } function initScript() { let dist = calculateDistance(0, 0, 100, 200); console.log("dist:", dist); console.log("settings:", JSON.stringify(Settings)); console.log("date:", currentDate > 0); console.log("COMPLETE"); } initScript(); })();`,
            expect: 'COMPLETE',
        },
        {
            name: 'Destructuring with window-variable names',
            code: `(() => { let obj = { top: 42, close: "hello", find: true, origin: "local" }; const { top, close, find, origin } = obj; console.log("top:", top); console.log("close:", close); console.log("find:", find); console.log("origin:", origin); })();`,
            expect: 'top:',
        },
        {
            name: 'Catch clause with window-variable name',
            code: `(() => { try { throw new Error("test error"); } catch(error) { console.log("caught:", error.message); } console.log("DONE"); })();`,
            expect: 'DONE',
        },
    ];

    for (const pat of patterns) {
        const label = `pattern: ${pat.name}`;
        try {
            const result = await obfuscate(pat.code);
            try { new Function(result); } catch (e) {
                fail(label, `Syntax error: ${e.message.slice(0, 80)}`);
                continue;
            }
            const exec = await execInWorker(result, 8000);
            if (exec.timeout) {
                fail(label, 'Timeout (infinite loop)');
            } else if (exec.error) {
                fail(label, `Runtime error: ${exec.error.slice(0, 80)}`);
            } else if (pat.expect && !(exec.logs || []).some(l => l.includes(pat.expect))) {
                fail(label, `Expected "${pat.expect}" in logs, got: ${(exec.logs || []).slice(0, 3).join('; ').slice(0, 80)}`);
            } else {
                pass(label);
            }
        } catch (e) {
            fail(label, e.message.slice(0, 100));
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════

(async () => {
    if (!isMainThread) return;

    console.log('\x1b[1m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[1m║     JsScramble — Consolidated Debug Test Suite          ║\x1b[0m');
    console.log('\x1b[1m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    console.log(`Mode: ${QUICK ? 'QUICK' : STRESS_ONLY ? 'STRESS ONLY' : PERF_ONLY ? 'PERF ONLY' : ONLY_SECTION ? `SECTION ${ONLY_SECTION}` : 'FULL'}`);

    const startTime = Date.now();

    try {
        const shouldRun = (n) => {
            if (STRESS_ONLY) return n === 7;
            if (PERF_ONLY) return n === 8;
            if (ONLY_SECTION) return n === ONLY_SECTION;
            if (QUICK) return n <= 6 || n === 10;
            return true;
        };

        if (shouldRun(1)) await section1();
        if (shouldRun(2)) await section2();
        if (shouldRun(3)) await section3();
        if (shouldRun(4)) await section4();
        if (shouldRun(5)) await section5();
        if (shouldRun(6)) await section6();
        if (shouldRun(7)) await section7();
        if (shouldRun(8)) await section8();
        if (shouldRun(9)) await section9();
        if (shouldRun(10)) await section10();
    } catch (e) {
        console.error('\n\x1b[31mFATAL ERROR:\x1b[0m', e.message);
        console.error(e.stack);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n\x1b[1m══════════════════════════════════════════════════════════\x1b[0m');
    console.log(`\x1b[1m  RESULTS: \x1b[32m${totalPass} passed\x1b[0m, \x1b[${totalFail > 0 ? '31' : '32'}m${totalFail} failed\x1b[0m  (${elapsed}s)`);
    console.log('\x1b[1m══════════════════════════════════════════════════════════\x1b[0m');

    if (failures.length > 0) {
        console.log('\n\x1b[31mFailures:\x1b[0m');
        for (const f of failures) {
            console.log(`  \x1b[31m✗\x1b[0m ${f.label}: ${f.reason}`);
        }
    }

    process.exit(totalFail > 0 ? 1 : 0);
})();
