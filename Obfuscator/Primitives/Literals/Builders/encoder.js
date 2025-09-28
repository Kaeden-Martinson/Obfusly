const { generateObfuscatedName } = require("../../../Utils/namer");

// encoder.js - run at build-time / in Node
const toBinaryString = (buf) => {
  // return a binary-string (each char = byte) from Uint8Array/Buffer
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buf)) {
    return buf.toString('binary');
  }
  // Uint8Array
  return Array.from(buf).map(b => String.fromCharCode(b)).join('');
};

function xorBytesWithKey(bytes, keyBytes) {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
}

function stringToUtf8Bytes(str) {
  // Node-compatible: Buffer.from(str, 'utf8') -> Uint8Array
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(str, 'utf8'));
  // Browser fallback
  return new TextEncoder().encode(str);
}

function utf8BytesToString(bytes) {
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('utf8');
  return new TextDecoder().decode(bytes);
}

function base64EncodeBinaryString(binStr) {
  // expects a binary string where each char code is 0..255
  if (typeof btoa === 'function') return btoa(binStr);
  if (typeof Buffer !== 'undefined') return Buffer.from(binStr, 'binary').toString('base64');
  throw new Error('No base64 encoder available');
}

/**
 * Encode parts with XOR shifting + base64
 * @param {string[]} parts - array of string parts to encode
 * @param {string} keyStr - string used as key (will be interpreted as UTF-8 bytes)
 * @returns {string[]} encoded base64 strings
 */
function encodeParts(parts, keyStr) {
  const keyBytes = stringToUtf8Bytes(keyStr);
  return parts.map(part => {
    const bytes = stringToUtf8Bytes(part);
    const xored = xorBytesWithKey(bytes, keyBytes);
    const bin = toBinaryString(Buffer.from(xored)); // safe in Node; in browsers Buffer polyfill may exist
    // ensure we have a pure binary string:
    const binaryString = Array.from(xored).map(b => String.fromCharCode(b)).join('');
    return base64EncodeBinaryString(binaryString);
  });
}

/**
 * Build a runtime decoder snippet (string) that decodes the encodedParts
 * and assigns them to a runtime array name (breakerName).
 *
 * @param {string[]} encodedParts - base64-encoded strings (from encodeParts)
 * @param {string} keyStr - the same key string used for encoding
 * @param {string} breakerName - variable name to hold decoded parts, e.g. "__IIFE_PARTS__"
 * @returns {string} - snippet of JS to inject into generated source
 */
function randomIdent() {
   return generateObfuscatedName();
}

function buildDecoderSnippet(encodedParts, keyStr, breakerName = "__IIFE_PARTS__") {
  const encodedArrayLiteral = '[' + encodedParts.map(s => JSON.stringify(s)).join(',') + ']';
  const keyLiteral = JSON.stringify(keyStr);

  // Generate randomized names
  const encVar   = randomIdent();
  const keyVar   = randomIdent();
  const atobVar  = randomIdent();
  const bytesVar = randomIdent();
  const keyBVar  = randomIdent();
  const xorVar   = randomIdent();
  const b2sVar   = randomIdent();
  const outVar   = randomIdent();
  const str   = randomIdent();
  const arr = randomIdent();
  const arg = randomIdent();
  const keyBytes = randomIdent();
  const i = randomIdent();
  const b64 = randomIdent();
  const bin = randomIdent();
  const xored = randomIdent();

  return `
(function(){
  const ${encVar} = ${encodedArrayLiteral};
  const ${keyVar} = ${keyLiteral};

  const ${atobVar} = (typeof atob === 'function') ? atob : (${str} => Buffer.from(${str}, 'base64').toString('binary'));

  const ${bytesVar} = function(${str}){
    const ${arr} = new Uint8Array(${str}.length);
    for (let ${i} = 0; ${i} < ${str}.length; ${i}++) ${arr}[${i}] = ${str}.charCodeAt(${i}) & 0xff;
    return ${arr};
  };

  const ${keyBVar} = (function(${arg}){
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(${arg});
    return Uint8Array.from(Buffer.from(${arg}, 'utf8'));
  })(${keyVar});

  function ${xorVar}(${arg}, ${keyBytes}) {
    const ${str} = new Uint8Array(${arg}.length);
    for (let ${i} = 0; ${i} < ${arg}.length; ${i}++) ${str}[${i}] = ${arg}[${i}] ^ ${keyBytes}[${i} % ${keyBytes}.length];
    return ${str};
  }

  function ${b2sVar}(${arg}) {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(${arg});
    return Buffer.from(${arg}).toString('utf8');
  }

  const ${outVar} = ${encVar}.map(${b64} => {
    const ${bin} = ${atobVar}(${b64});
    const ${arg} = ${bytesVar}(${bin});
    const ${xored} = ${xorVar}(${arg}, ${keyBVar});
    return ${b2sVar}(${xored});
  });

  ${breakerName} = ${outVar};
})();\n`;
}


// Export for build-time usage
module.exports = { encodeParts, buildDecoderSnippet };