'use strict';

const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');

process.chdir(path.join(__dirname, '..', '..'));
const runtimeConfig = require('../../Settings/config');
const __obfuscator_1 = require('../../Main/first_obfuscator');
const __obfuscator_2 = require('../../Main/property_obfuscator');

const DEFAULT_CONFIG = JSON.parse(JSON.stringify(runtimeConfig));

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

function restoreDefaults() {
    for (const key of Object.keys(runtimeConfig)) {
        if (!(key in DEFAULT_CONFIG)) delete runtimeConfig[key];
    }
    deepMerge(runtimeConfig, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
}

function execInWorker(code, timeoutMs = 15000) {
    return new Promise((resolve) => {
        const workerCode = `
            const { parentPort } = require('worker_threads');
            const logs = [];
            console.log = (...args) => logs.push(args.map(String).join(' '));
            console.error = (...args) => logs.push('ERR: ' + args.map(String).join(' '));
            console.warn = (...args) => logs.push('WARN: ' + args.map(String).join(' '));
            (async function() {
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

                var __result = eval(${JSON.stringify(code)});
                if (__result && typeof __result.then === 'function') await __result;
                // Give deferred integrity checks time to fire
                await new Promise(r => setTimeout(r, 12000));
                parentPort.postMessage({ success: true, logs });
            } catch (e) {
                parentPort.postMessage({ error: e.message, stack: e.stack, logs });
            }
            })();
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

async function main() {
    const code = fs.readFileSync('./Debug/integritytest.js', 'utf8');

    // ── Test 1: Stage 1 output analysis ──
    console.log('\n=== Test 1: Analyze Stage 1 output ===');
    restoreDefaults();
    runtimeConfig.integrityChecks = true;
    runtimeConfig.disableConsoleOutput = false;
    runtimeConfig.enableAntiDebugger = false;
    
    const [oCode1, wn1, pm1] = __obfuscator_1.obfuscateEntireSource(code);
    fs.writeFileSync('./Debug/_bench_tmp/stage1_output.js', oCode1);
    console.log('  Stage 1 output length:', oCode1.length);
    
    // Parse and check what functions integrity would find
    const acorn = require('acorn');
    const ast = acorn.parse(oCode1, { ecmaVersion: "latest", sourceType: "script", locations: false });
    console.log('  Top-level body nodes:', ast.body.length);
    for (const node of ast.body) {
        console.log('  -', node.type, node.type === 'ExpressionStatement' ? node.expression?.type : '', 
            node.type === 'FunctionDeclaration' ? `name=${node.id?.name}` : '',
            node.type === 'VariableDeclaration' ? node.declarations?.map(d => `${d.id?.name}=${d.init?.type}`).join(',') : '');
        // Check for IIFE
        if (node.type === "ExpressionStatement") {
            const expr = node.expression;
            if (expr.type === 'CallExpression' && expr.callee) {
                console.log('    callee.type:', expr.callee.type, 'async:', expr.callee.async);
            }
            if (expr.type === 'UnaryExpression' && expr.argument?.type === 'CallExpression') {
                console.log('    unary callee.type:', expr.argument.callee?.type);
            }
        }
    }

    // ── Test 2: Full pipeline WITHOUT integrity (baseline) ──
    console.log('\n=== Test 2: WITHOUT integrity (baseline) ===');
    restoreDefaults();
    runtimeConfig.integrityChecks = false;
    runtimeConfig.disableConsoleOutput = false;
    runtimeConfig.enableAntiDebugger = false;
    
    const [oCode2, wn2, pm2] = __obfuscator_1.obfuscateEntireSource(code);
    const final2 = await __obfuscator_2.obfuscateProperties(oCode2, wn2, pm2);
    console.log('  Output length:', final2.length);
    
    // Use proper async-aware worker
    const result2 = await execInWorker(final2, 15000);
    if (result2.timeout) console.log('  RESULT: FROZEN');
    else if (result2.error) console.log('  RESULT: ERROR:', result2.error);
    else console.log('  RESULT: SUCCESS, logs:', result2.logs?.length || 0);
    if (result2.logs?.length) result2.logs.forEach(l => console.log('  LOG:', l.substring(0, 200)));

    // ── Test 3: Full pipeline WITH integrity ──
    console.log('\n=== Test 3: WITH integrity ===');
    restoreDefaults();
    runtimeConfig.integrityChecks = true;
    runtimeConfig.disableConsoleOutput = false;
    runtimeConfig.enableAntiDebugger = false;
    
    const [oCode3, wn3, pm3] = __obfuscator_1.obfuscateEntireSource(code);
    const final3 = await __obfuscator_2.obfuscateProperties(oCode3, wn3, pm3);
    console.log('  Output length:', final3.length);
    fs.writeFileSync('./Debug/_bench_tmp/integrity_output.js', final3);
    
    const result3 = await execInWorker(final3, 15000);
    if (result3.timeout) console.log('  RESULT: FROZEN - integrity tripped!');
    else if (result3.error) console.log('  RESULT: ERROR:', result3.error, '\n  Stack:', result3.stack?.split('\n').slice(0, 5).join('\n'));
    else console.log('  RESULT: SUCCESS, logs:', result3.logs?.length || 0);
    if (result3.logs?.length) result3.logs.forEach(l => console.log('  LOG:', l.substring(0, 200)));

    // ── Test 4: Multiple runs to check consistency ──
    console.log('\n=== Test 4: 10 repeated runs WITH integrity ===');
    let frozen = 0, errors = 0, success = 0;
    for (let i = 0; i < 10; i++) {
        restoreDefaults();
        runtimeConfig.integrityChecks = true;
        runtimeConfig.disableConsoleOutput = false;
        runtimeConfig.enableAntiDebugger = false;
        const [oC, wN, pM] = __obfuscator_1.obfuscateEntireSource(code);
        const fin = await __obfuscator_2.obfuscateProperties(oC, wN, pM);
        
        // Quick test: only 2s timeout - if it freezes in sync checks, catches immediately
        const res = await execInWorker(fin, 15000);
        if (res.timeout) { frozen++; console.log(`  Run ${i+1}: FROZEN`); }
        else if (res.error) { errors++; console.log(`  Run ${i+1}: ERROR: ${res.error}`); }
        else { success++; console.log(`  Run ${i+1}: SUCCESS (logs: ${res.logs?.length || 0})`); }
    }
    console.log(`  Summary: ${success} success, ${frozen} frozen, ${errors} errors`);

    // ── Test 5: Sync-only (no deferred checks) - manually disable ──
    // Save an obfuscated output to inspect
    console.log('\n=== Test 5: Save failed output for analysis ===');
    restoreDefaults();
    runtimeConfig.integrityChecks = true;
    runtimeConfig.disableConsoleOutput = false;
    runtimeConfig.enableAntiDebugger = false;
    runtimeConfig.compression = false; // disable compression for readability
    const [oC5, wN5, pM5] = __obfuscator_1.obfuscateEntireSource(code);
    const fin5 = await __obfuscator_2.obfuscateProperties(oC5, wN5, pM5);
    fs.writeFileSync('./Debug/_bench_tmp/integrity_nocomp.js', fin5);
    console.log('  Saved uncompressed output');
    
    // Test it in quick mode (1s timeout - catches sync freezes)
    const resQuick = await execInWorker(fin5, 3000);
    if (resQuick.timeout) console.log('  Quick test: FROZEN (sync check failed)');
    else if (resQuick.error) console.log('  Quick test: ERROR:', resQuick.error);
    else console.log('  Quick test: OK (sync checks pass)');
    
    // Test with full wait (15s)
    const resFull = await execInWorker(fin5, 20000);
    if (resFull.timeout) console.log('  Full test: FROZEN (deferred check failed)');
    else if (resFull.error) console.log('  Full test: ERROR:', resFull.error);
    else console.log('  Full test: SUCCESS (logs:', resFull.logs?.length || 0, ')');
    if (resFull.logs?.length) resFull.logs.forEach(l => console.log('  LOG:', l.substring(0, 300)));

    console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
