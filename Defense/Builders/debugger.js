const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { astCode } = require('./ast_code');
const { generateObfuscatedName } = require('../../Utils/nameGenerator');
const { compress } = require('../../Utils/compressor');

function generatePassKey(lengthBytes = 32) {
  if (!Number.isInteger(lengthBytes) || lengthBytes <= 0) throw new TypeError('lengthBytes must be a positive integer');
  const bytes = crypto.randomBytes(lengthBytes);
  const hex = bytes.toString('hex');
  const b64 = bytes.toString('base64');
  const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return { bytes, hex, b64, b64url, lengthBytes };
}

function createDebuggerBundle(config) {
  const MODE = "passphrase"
  const PASSPHRASE = generatePassKey().hex || null;

  function bytesToB64(buf) { return Buffer.from(buf).toString('base64'); }

  function sha256(buf) {
    return crypto.createHash('sha256').update(buf).digest();
  }

  function xorBytes(buf, key) {
    const out = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ key[i % key.length];
    return out;
  }

  const payloadBuf = Buffer.from(fs.readFileSync(path.resolve(__dirname, "../Payloads/debugger.js"), "utf-8"), 'utf8');
  const payloadHash = sha256(payloadBuf);

  let xorKey;
  let salt;
  let iter = 100000;

  if (MODE === 'embed-key') {
    const keyLen = 16 + Math.floor(Math.random() * 17);
    xorKey = crypto.randomBytes(keyLen);
  } else if (MODE === 'passphrase') {
    if (!PASSPHRASE) {
      console.error('passphrase mode requires --pass "your-passphrase"');
      process.exit(1);
    }
    salt = crypto.randomBytes(16);

    xorKey = crypto.pbkdf2Sync(PASSPHRASE, salt, iter, 32, 'sha256');
  } else {
    console.error('Unknown mode', MODE);
    process.exit(1);
  }

  const enc = xorBytes(payloadBuf, xorKey);

  const encB64 = bytesToB64(enc);
  const hashB64 = bytesToB64(payloadHash);
  const xorKeyB64 = MODE === 'embed-key' ? bytesToB64(xorKey) : null;
  const saltB64 = MODE === 'passphrase' ? bytesToB64(salt) : null;

  let obfuscatedName = generateObfuscatedName();

  const runtime = `
let __OBFUSCATED_PLACEHOLER__;
(function(){
  'use strict';

  var ENC_B64 = '${encB64}';
  var HASH_B64 = '${hashB64}';
  var MODE = '${MODE}';
  var EMBED_XOR_KEY_B64 = ${xorKeyB64 ? ("'" + xorKeyB64 + "'") : 'null'};
  var SALT_B64 = ${saltB64 ? ("'" + saltB64 + "'") : 'null'};
  var PBKDF2_ITERS = ${iter};

  function b64ToBytes(b64) {
    if (typeof atob === 'function') {
      var bin = atob(b64);
      var u = new Uint8Array(bin.length);
      for (var i=0;i<bin.length;i++) u[i] = bin.charCodeAt(i);
      return u;
    } else if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    for(;;) {}
  }

  function bytesToStr(u8) {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(u8);
    var s = '';
    for (var i=0;i<u8.length;i++) s += String.fromCharCode(u8[i]);
    return decodeURIComponent(escape(s));
  }

  function xorBytes(data, key) {
    var out = new Uint8Array(data.length);
    for (var i=0;i<data.length;i++) out[i] = data[i] ^ key[i % key.length];
    return out;
  }

  async function sha256Bytes(u8) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      var buf = await crypto.subtle.digest('SHA-256', u8.buffer ? u8.buffer : u8);
      return new Uint8Array(buf);
    } else if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      var buf2 = await window.crypto.subtle.digest('SHA-256', u8.buffer ? u8.buffer : u8);
      return new Uint8Array(buf2);
    } else if (typeof require === 'function') {
      const nodeCrypto = require('crypto');
      return new Uint8Array(nodeCrypto.createHash('sha256').update(Buffer.from(u8)).digest());
    } else {
      for(;;) {}
    }
  }

  async function deriveKeyFromPassphrase(passphrase, saltU8, iters, outLen) {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      var enc = new TextEncoder().encode(passphrase);
      var key = await window.crypto.subtle.importKey('raw', enc, { "name": 'PBKDF2' }, false, ['deriveBits']);
      var derived = await window.crypto.subtle.deriveBits({ "name": 'PBKDF2', "salt": saltU8, "iterations": iters, "hash": 'SHA-256' }, key, outLen*8);
      return new Uint8Array(derived);
    } else if (typeof crypto !== 'undefined' && crypto.subtle) {
      var enc2 = new TextEncoder().encode(passphrase);
      var k2 = await crypto.subtle.importKey('raw', enc2, { "name": 'PBKDF2' }, false, ['deriveBits']);
      var d2 = await crypto.subtle.deriveBits({ "name": 'PBKDF2', "salt": saltU8, "iterations": iters, "hash": 'SHA-256' }, k2, outLen*8);
      return new Uint8Array(d2);
    } else if (typeof require === 'function') {
      const nodeCrypto = require('crypto');
      return new Uint8Array(nodeCrypto.pbkdf2Sync(passphrase, Buffer.from(saltU8), iters, outLen, 'sha256'));
    } else {
      for(;;) {}
    }
  }

  async function decodeAndOptionallyRun(options) {
    options = options || {};
    var enc = b64ToBytes(ENC_B64);
    var expectedHash = b64ToBytes(HASH_B64);

    var keyBytes = null;
    if (MODE === 'embed-key' && EMBED_XOR_KEY_B64) {
      keyBytes = b64ToBytes(EMBED_XOR_KEY_B64);
    } else if (MODE === 'passphrase') {
      var pass = options.pass || (typeof window !== 'undefined' ? window.__DECRYPT_PASS__ : null);
      if (!pass) {
        try {
          pass = window
        } catch (e) { /* ignore */ }
        if (!pass) for(;;) {}
      }
      var salt = b64ToBytes(SALT_B64);
      var derived = await deriveKeyFromPassphrase(pass, salt, PBKDF2_ITERS, 32);
      keyBytes = derived;
    } else {
      for(;;) {}
    }

    var plain = xorBytes(enc, keyBytes);

    var gotHash = await sha256Bytes(plain);
    if (expectedHash.length !== gotHash.length) for(;;) {}
    for (var i=0;i<gotHash.length;i++) if (gotHash[i] !== expectedHash[i]) for(;;) {}

    var str = bytesToStr(plain);

    if (options.exec) {
      (new Function(str))();
      return null;
    } else {
      return str;
    }
  }

  __OBFUSCATED_PLACEHOLER__ = decodeAndOptionallyRun;
})();`;

  const newCode = astCode(runtime);

  newCode.code = newCode.code.replaceAll("__OBFUSCATED_PLACEHOLER__", obfuscatedName);

  return [(config.compression ? compress(newCode.code) : newCode.code), obfuscatedName, PASSPHRASE];
};

module.exports = { createDebuggerBundle };