#!/usr/bin/env node
/**
 * build-stealth-console-full-rand.js
 *
 * - Double-encodes payload (base64 -> XOR -> base64)
 * - Splits into chunks & key chunks
 * - Embeds compiled xor_bulk.wasm (optional) and uses bulk WASM XOR
 * - Wraps runtime in a function that accepts global params; param names randomized
 * - Randomizes all local variable & helper names inside the runtime template
 * - Emits mapping JSON for debugging
 *
 * Usage:
 *   node build-stealth-console-full-rand.js --in payload.js --wasm xor_bulk.wasm --out ./dist/console-obf-final.js --chunks 6 --keyChunks 4 --run
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { generateObfuscatedName } = require('../../Utils/nameGenerator');

function buildConsoleDisabler() {

    const IN = path.resolve(process.cwd(), '../Payloads/console.js');
    const CHUNKS = Math.max(1, Math.min(16, parseInt(4, 10)));
    const KEY_CHUNKS = Math.max(1, Math.min(16, parseInt(3, 10)));

    const payloadRaw = fs.readFileSync(IN, 'utf8');

    // ---------- utils ----------
    function randIdent(len = 8) {
        const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const alnum = alpha + '0123456789';
        let s = alpha[Math.floor(Math.random() * alpha.length)];
        for (let i = 1; i < len; i++) s += alnum[Math.floor(Math.random() * alnum.length)];
        return s;
    }
    function obfNumExpr(byte) {
        const r = Math.floor(Math.random() * 4);
        if (r === 0) return '0x' + byte.toString(16);
        if (r === 1) {
            const a = (byte & 0xf0), b = (byte & 0x0f);
            return `(0x${a.toString(16)}+0x${b.toString(16)})`;
        }
        if (r === 2) {
            const hi = (byte >>> 3), lo = byte & 0x7;
            return `(${hi}<<3|${lo})`;
        }
        const a = Math.floor(Math.random() * 8) + 1;
        const b = byte - a;
        return `(${a}+${b})`;
    }
    function crc32Bytes(buf) {
        const t = (function () {
            const a = new Uint32Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                a[i] = c >>> 0;
            }
            return a;
        })();
        let crc = 0 ^ (-1);
        for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xff];
        return (crc ^ (-1)) >>> 0;
    }
    function splitBuffer(buf, parts) {
        const out = [];
        const size = Math.ceil(buf.length / parts);
        for (let i = 0; i < parts; i++) {
            const start = i * size;
            const end = Math.min(buf.length, start + size);
            out.push(Buffer.from(buf.slice(start, end)));
        }
        return out;
    }
    function randBytes(n) { return crypto.randomBytes(n); }

    // ---------- build flow (same as earlier double-enc) ----------
    // Step A: payload -> base64 (ASCII-safe)
    const base64Plain = Buffer.from(payloadRaw, 'utf8').toString('base64');

    // Step B: XOR encrypt base64Plain with random key
    const plainBytes = Buffer.from(base64Plain, 'ascii');
    const keyLen = 16 + Math.floor(Math.random() * 17);
    const keyBytes = randBytes(keyLen);

    const encryptedBytes = Buffer.allocUnsafe(plainBytes.length);
    for (let i = 0; i < plainBytes.length; i++) encryptedBytes[i] = plainBytes[i] ^ keyBytes[i % keyBytes.length];

    // Step C: CRC on base64Plain bytes
    const crc = crc32Bytes(plainBytes);

    // Step D: split encrypted into base64 chunks
    const encChunksBuf = splitBuffer(encryptedBytes, CHUNKS);
    const encChunksB64 = encChunksBuf.map(b => b.toString('base64'));

    // Step E: obfuscate key into chunks
    const keyParts = Array.from(keyBytes);
    const keyChunkSize = Math.ceil(keyParts.length / KEY_CHUNKS);
    const keyChunks = [];
    for (let i = 0; i < KEY_CHUNKS; i++) {
        const start = i * keyChunkSize;
        const end = Math.min(keyParts.length, start + keyChunkSize);
        const slice = keyParts.slice(start, end).map(obfNumExpr);
        keyChunks.push(slice);
    }

    // Step F: wasm base64 if provided
    let wasmB64 = null;
    let wasmProvided = false;

    // Self-test: simulate decode and optional wasm path
    (function selfTest() {
        try {
            const joinedEnc = Buffer.concat(encChunksBuf);
            if (joinedEnc.length !== encryptedBytes.length) throw new Error('joinedEnc length mismatch');
            // reconstruct key
            const reconKey = [];
            for (let kc = 0; kc < keyChunks.length; kc++) {
                for (let j = 0; j < keyChunks[kc].length; j++) {
                    const expr = keyChunks[kc][j];
                    const val = (new Function('return (' + expr + ');'))();
                    reconKey.push(val & 0xff);
                }
            }
            const out = Buffer.allocUnsafe(joinedEnc.length);
            for (let i = 0; i < joinedEnc.length; i++) out[i] = joinedEnc[i] ^ reconKey[i % reconKey.length];
            if (out.length !== plainBytes.length) throw new Error('decrypted length mismatch');
            for (let i = 0; i < out.length; i++) if (out[i] !== plainBytes[i]) throw new Error('decrypted mismatch at ' + i);
            const crcNow = crc32Bytes(out);
            if (crcNow !== (crc >>> 0)) throw new Error('crc mismatch ' + crcNow + ' != ' + crc);
            if (wasmProvided) {
                // test instantiation & xor_bulk in Node synchronously
                const wasmBuf = Buffer.from(wasmB64, 'base64');
                const mod = new WebAssembly.Module(wasmBuf);
                const inst = new WebAssembly.Instance(mod, {});
                if (!inst.exports.mem) throw new Error('wasm export mem missing');
                if (typeof inst.exports.xor_bulk !== 'function') throw new Error('wasm export xor_bulk missing');
                const mem = inst.exports.mem;
                const pageSize = 65536;
                const needed = joinedEnc.length + reconKey.length + 16;
                const curPages = mem.buffer.byteLength / pageSize;
                const needPages = Math.ceil(needed / pageSize);
                if (needPages > curPages) mem.grow(needPages - curPages);
                const memU8 = new Uint8Array(mem.buffer);
                const ptr = 0, keyPtr = ptr + joinedEnc.length;
                memU8.set(joinedEnc, ptr);
                memU8.set(reconKey, keyPtr);
                inst.exports.xor_bulk(ptr, joinedEnc.length, keyPtr, reconKey.length);
                const outW = Buffer.from(memU8.slice(ptr, ptr + joinedEnc.length));
                for (let i = 0; i < outW.length; i++) if (outW[i] !== plainBytes[i]) throw new Error('wasm decoded mismatch at ' + i);
            }
        } catch (e) {
            console.error('Self-test failed in builder:', e);
            process.exit(1);
        }
    })();

    // ---------- RANDOMIZE ALL IDENTIFIERS ----------
    // Roles to randomize: global param names + many local variable names used below
    const roles = {
        // globals passed as parameters to wrapper (these names will be randomized)
        globals: ['ENV_BUFFER', 'ENV_ATOB', 'ENV_CONSOLE', 'ENV_WEBASSEMBLY'],
        // locals & helper names inside runtime that must be randomized
        locals: [
            'CHUNKS_ARR', 'KEYS_ARR', 'CRC_CONST',
            'BASE64_TO_BYTES', 'CRC_TABLE', 'CRC_FUNC',
            'DERIVE_KEY', 'BULK_XOR_WASM', 'BULK_XOR_JS',
            'WASM_INSTANTIATE', 'WASM_B64_VAR',
            'PARTS', 'JOINED', 'KEYLIST', 'WASM_INST', 'DECRYPTED',
            'i', 'j', 'p', 'off', 'total', 'ptr', 'keyPtr', 'pageSize', 'needed', 'curPages', 'needPages',
            'segArr', 'CHUNK_SZ', 'TMP', 'sub', 'b64OfJS', 'jsSource', 'RUN_CORE', 'LEN',

            'BUF', 'ATOB', 'CON', 'WASM', 'VAR', "VAR2", "VAR3", "VAR4", "VAR5", "VAR6"
        ]
    };

    const idMap = {};

    idMap.globals = {};
    roles.globals.forEach(k => idMap.globals[k] = generateObfuscatedName());
    idMap.locals = {};
    roles.locals.forEach(k => idMap.locals[k] = generateObfuscatedName());

    // convenience variables for mapping
    const G = idMap.globals;
    const L = idMap.locals;

    // ---------- RUNTIME TEMPLATE (fully param-wrapped) ----------
    /* The runtime will be an env-wrapped immediately-invoked function that accepts
       the randomized globals in the order: ENV_BUFFER, ENV_ATOB, ENV_CONSOLE, ENV_WEBASSEMBLY
       Internals use randomized local identifiers from L.
    */
    const runtime = `
(function({${G.ENV_BUFFER},${G.ENV_ATOB},${G.ENV_CONSOLE},${G.ENV_WEBASSEMBLY}}){
  const ${L.BUF} = ${G.ENV_BUFFER};
  const ${L.ATOB} = ${G.ENV_ATOB};
  const ${L.CON} = ${G.ENV_CONSOLE};
  const ${L.WASM} = ${G.ENV_WEBASSEMBLY};

  var ${L.CHUNKS_ARR} = [${encChunksB64.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}];
  var ${L.KEYS_ARR} = [${keyChunks.map(arr => '[' + arr.join(', ') + ']').join(', ')}];
  var ${L.CRC_CONST} = ${crc >>> 0};

  function ${L.BASE64_TO_BYTES}(${L.VAR}){
    if (typeof ${L.BUF} !== 'undefined' && ${L.BUF}.from) return ${L.BUF}.from(${L.VAR},'base64');
    if (typeof ${L.ATOB} === 'function'){ var ${L.VAR3}=${L.ATOB}(${L.VAR}), L=atob; var ${L.VAR2}=new Uint8Array(${L.VAR3}.length); for(var ${L.i}=0; ${L.i}<${L.VAR3}.length; ${L.i}++) ${L.VAR2}[${L.i}]=${L.VAR3}.charCodeAt(${L.i}); return ${L.VAR2}; }
    throw new Error('no base64 available');
  }

  var ${L.CRC_TABLE} = (function(){ var ${L.VAR}=new Uint32Array(256); for(var ${L.i}=0; ${L.i}<256; ${L.i}++){ var ${L.VAR2}=${L.i}; for(var k=0;k<8;k++) ${L.VAR2}=(${L.VAR2}&1)?(0xEDB88320^(${L.VAR2}>>>1)):(${L.VAR2}>>>1); ${L.VAR}[${L.i}]=${L.VAR2}>>>0; } return ${L.VAR}; })();
  function ${L.CRC_FUNC}(${L.VAR}){ var ${L.VAR2}=0^(-1); for(var ${L.i}=0; ${L.i}<${L.VAR}.length; ${L.i}++) ${L.VAR2}=(${L.VAR2}>>>8)^${L.CRC_TABLE}[(${L.VAR2}^${L.VAR}[${L.i}])&0xff]; return (${L.VAR2}^(-1))>>>0; }

  function ${L.DERIVE_KEY}(${L.VAR3}){
    var ${L.VAR}=[]; for(var ${L.i}=0; ${L.i}<${L.VAR3}.length; ${L.i}++){ var ${L.VAR2}=${L.VAR3}[${L.i}]; for(var ${L.j}=0; ${L.j}<${L.VAR2}.length; ${L.j}++){ try{ ${L.VAR}.push((new Function('return ('+${L.VAR2}[${L.j}]+');'))() & 0xff); }catch(e){ ${L.VAR}.push(${L.VAR2}[${L.j}] & 0xff); } } } return new Uint8Array(${L.VAR});
  }

  var ${L.WASM_B64_VAR} = ${wasmB64 ? ("'" + wasmB64 + "'") : "null"};
  async function ${L.WASM_INSTANTIATE}(${L.VAR}){
    if (!${L.VAR}) return null;
    function b64ToBytes(s){ if (typeof ${L.BUF} !== 'undefined' && ${L.BUF}.from) return new Uint8Array(${L.BUF}.from(s,'base64')); if (typeof ${L.ATOB}==='function'){ var bin=${L.ATOB}(s), a=new Uint8Array(bin.length); for(var ${L.i}=0; ${L.i}<bin.length; ${L.i}++) a[${L.i}]=bin.charCodeAt(${L.i}); return a; } throw new Error('no base64 decoder for wasm'); }
    var ${L.VAR2} = b64ToBytes(${L.VAR});
    if (typeof ${L.WASM} === 'undefined' || !${L.WASM}.instantiate) return null;
    try { var ${L.VAR3} = await ${L.WASM}.instantiate(${L.VAR2}.buffer, {}); return ${L.VAR3}.instance; } catch(e){ try{ var ${L.VAR4}=new ${L.WASM}.Module(${L.VAR2}.buffer); return new ${L.WASM}.Instance(${L.VAR4}, {}); }catch(e2){ return null; } }
  }

  function ${L.BULK_XOR_WASM}(${L.VAR5}, ${L.VAR4}, ${L.VAR6}){
    if (!${L.VAR5} || !${L.VAR5}.exports || !${L.VAR5}.exports.mem) throw new Error('wasm missing');
    var ${L.VAR2} = ${L.VAR5}.exports.mem;
    var ${L.VAR3} = ${L.VAR5}.exports.${L.VAR3};
    if (typeof ${L.VAR3} !== 'function') throw new Error('wasm ${L.VAR3} missing');
    var ${L.pageSize} = 65536;
    var ${L.needed} = ${L.VAR4}.length + ${L.VAR6}.length + 16;
    var ${L.curPages} = ${L.VAR2}.buffer.byteLength / ${L.pageSize};
    var ${L.needPages} = Math.ceil(${L.needed} / ${L.pageSize});
    if (${L.needPages} > ${L.curPages}) { try{ ${L.VAR2}.grow(${L.needPages} - ${L.curPages}); }catch(e){} }
    var ${L.VAR} = new Uint8Array(${L.VAR2}.buffer);
    var ${L.ptr} = 0;
    var ${L.keyPtr} = ${L.ptr} + ${L.VAR4}.length;
    ${L.VAR}.set(${L.VAR4}, ${L.ptr});
    ${L.VAR}.set(${L.VAR6}, ${L.keyPtr});
    ${L.VAR3}(${L.ptr}, ${L.VAR4}.length, ${L.keyPtr}, ${L.VAR6}.length);
    return ${L.VAR}.slice(${L.ptr}, ${L.ptr} + ${L.VAR4}.length);
  }

  function ${L.BULK_XOR_JS}(${L.VAR4}, ${L.VAR6}){
    var ${L.VAR} = new (typeof ${L.BUF} !== 'undefined' ? ${L.BUF} : Uint8Array)(${L.VAR4}.length);
    for (var ${L.i}=0; ${L.i}<${L.VAR4}.length; ${L.i}++) ${L.VAR}[${L.i}] = ${L.VAR4}[${L.i}] ^ ${L.VAR6}[${L.i} % ${L.VAR6}.length];
    return ${L.VAR};
  }

  (async function ${L.RUN_CORE}(){
    try {
      var ${L.PARTS} = [];
      for (var ${L.p}=0; ${L.p}<${L.CHUNKS_ARR}.length; ${L.p}++) ${L.PARTS}.push(${L.BASE64_TO_BYTES}(${L.CHUNKS_ARR}[${L.p}]));
      var ${L.total} = 0; for (var ${L.p}=0; ${L.p}<${L.PARTS}.length; ${L.p}++) ${L.total} += ${L.PARTS}[${L.p}].length;
      var ${L.JOINED} = new (typeof ${L.BUF} !== 'undefined' ? ${L.BUF} : Uint8Array)(${L.total});
      var ${L.off} = 0;
      for (var ${L.p}=0; ${L.p}<${L.PARTS}.length; ${L.p}++){
        var ${L.TMP} = ${L.PARTS}[${L.p}];
        for (var ${L.i}=0; ${L.i}<${L.TMP}.length; ${L.i}++) ${L.JOINED}[${L.off}++] = ${L.TMP}[${L.i}];
      }

      var ${L.KEYLIST} = ${L.DERIVE_KEY}(${L.KEYS_ARR});

      var ${L.WASM_INST} = null;
      try { ${L.WASM_INST} = await ${L.WASM_INSTANTIATE}(${L.WASM_B64_VAR}); } catch(e) { ${L.WASM_INST} = null; }

      var ${L.DECRYPTED};
      if (${L.WASM_INST}) {
        try { ${L.DECRYPTED} = ${L.BULK_XOR_WASM}(${L.WASM_INST}, ${L.JOINED}, ${L.KEYLIST}); } catch(e) { ${L.DECRYPTED} = ${L.BULK_XOR_JS}(${L.JOINED}, ${L.KEYLIST}); }
      } else {
        ${L.DECRYPTED} = ${L.BULK_XOR_JS}(${L.JOINED}, ${L.KEYLIST});
      }

      var ${L.LEN} = ${L.CRC_FUNC}(${L.DECRYPTED});
      if (${L.LEN} !== (${L.CRC_CONST}>>>0)) { if (${L.CON} && ${L.CON}.error) try{ for(;;){} }catch(e){ for(;;){} }; return; }

      var ${L.b64OfJS};
      if (typeof ${L.BUF} !== 'undefined' && ${L.BUF}.from) ${L.b64OfJS} = ${L.BUF}.from(${L.DECRYPTED}).toString('ascii');
      else {
        var ${L.segArr} = [], ${L.CHUNK_SZ} = 0x8000;
        for (var ${L.p}=0; ${L.p}<${L.DECRYPTED}.length; ${L.p} += ${L.CHUNK_SZ}) {
          var ${L.sub} = ${L.DECRYPTED}.subarray ? ${L.DECRYPTED}.subarray(${L.p}, ${L.p}+${L.CHUNK_SZ}) : Array.prototype.slice.call(${L.DECRYPTED}, ${L.p}, ${L.p}+${L.CHUNK_SZ});
          ${L.segArr}.push(String.fromCharCode.apply(null, ${L.sub}));
        }
        ${L.b64OfJS} = ${L.segArr}.join('');
      }

      var ${L.jsSource};
      if (typeof ${L.BUF} !== 'undefined' && ${L.BUF}.from) ${L.jsSource} = ${L.BUF}.from(${L.b64OfJS}, 'base64').toString('utf8');
      else if (typeof ${L.ATOB} === 'function') ${L.jsSource} = decodeURIComponent(escape(${L.ATOB}(${L.b64OfJS})));
      else throw new Error('no base64->utf8 available');

      (new Function(${L.jsSource}))();

    } catch (${L.ERRLOG}) {
      for(;;){}
    }
  })();

})(
  (function(){ return {
    ${G.ENV_BUFFER}: (typeof Buffer !== 'undefined' ? Buffer : undefined),
    ${G.ENV_ATOB}: (typeof atob !== 'undefined' ? atob : undefined),
    ${G.ENV_CONSOLE}: (typeof console !== 'undefined' ? console : undefined),
    ${G.ENV_WEBASSEMBLY}: (typeof WebAssembly !== 'undefined' ? WebAssembly : undefined)
  }; })()
);
`;

    return runtime;
};

module.exports = { buildConsoleDisabler };