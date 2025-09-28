# JsScramble

JsScramble is a Node-based obfuscator that protects and secures any JavaScript application.

> JsScramble transforms your JavaScript into runtime-equivalent, highly obfuscated bundles—hiding implementation details, constants, and strings while offering configurable tradeoffs between performance, size, and protection.

---

## Features

* Variable/function name mangling and multiple-variable assignments
* Numeric literal encodings (many bases, calculators, JSFuck-like encodings)
* String encoding, splitting, concealment and optimized runtime caching
* Config-file driven CLI and Node API
* Compression/minification pipeline compatibility
* Target-aware transforms for browser or Node
* Optional anti-tamper options (integrity checks, anti-debugger, self-defending)

---

## Quick demo

```
# install globally (example)
npm install -g jsscramble

# obfuscate a file using localhost
node server.js

# navigate to http://localhost:3000 or http://127.0.0.1:3000 and use the online obfuscator
```

---

## Example config (your provided config)

Place this in `jsscramble.config.json` at project root:

```
{
    "numberEncoding": true,
    "numberCalculator": true,
    "globalBaseIntegerConcealment": true,
    "multipleVariableAssignments": true,
    "shuffleBaseIntegers": true,
    "baseIntegersDefault": "JSFuck",
    "integerPrecentage": {
        "Refractal": 60,
        "JSFuck": 10,
        "Hexadecimal": 10,
        "Octal": 10,
        "Binary": 10
    },
    "encodedFunctionStrength": 5,
    "concealGlobalObjects": true,
    "target": "browser",
    "stringEncoding": true,
    "stringSplitting": true,
    "optimizedStringCache": true,
    "stringConcealment": true,
    "stringConcealmentSettings": {
        "decodersCount": 5,
        "addNoiseCount": 5
    },
    "wrapStringsInIIFE": true,
    "breakIIFEString": true,
    "concealPrimitives": true,
    "compression": true,

    "wrapInIIFE": false,
    
    "disableConsoleOutput": false,
    "enableAntiDebugger": false,
    "selfDefending": false,
    "integrityChecks": false,
    "tamperProtection": false,

    "dispatcher": false,
    "deadCode": false
}
```

---

## Config explanation (plain language)

Below is a concise explanation of the most important options and practical recommendations.

### Numbers & integers

* **numberEncoding** / **numberCalculator**: Replace numeric literals with encoded expressions or small runtime calculators. Good for hiding constants; increases size/complexity.
* **globalBaseIntegerConcealment** / **shuffleBaseIntegers** / **baseIntegersDefault** / **integerPrecentage**: Control which bases/encodings to use globally and their distribution. `JSFuck` is extremely obfuscated but very large—use sparingly for size-sensitive targets.
* **multipleVariableAssignments**: Break a single assignment into chained assignments to confuse static analysis.

### Functions & runtime

* **encodedFunctionStrength**: How aggressively to encode or wrap function bodies. Higher values increase runtime decoding cost and output size.
* **concealGlobalObjects**: Hide or access globals via indirection (e.g., `window`/`globalThis`). Useful when targeting browsers to avoid easy hooking.
* **target**: `browser` or `node` — determines environment-aware transforms.

### Strings

* **stringEncoding** / **stringSplitting** / **stringConcealment**: Encode strings, split them into parts, and store them in concealed tables to prevent signature scanning.
* **optimizedStringCache**: Cache decoded strings at runtime to avoid repeated decode cost—recommended when strings are decoded often.
* **stringConcealmentSettings**: `decodersCount` controls diversity of decoders; `addNoiseCount` adds decoy entries to the table to confuse analysis.
* **wrapStringsInIIFE** / **breakIIFEString**: Wrap decoders in IIFEs and intentionally break predictable patterns to make detection harder.

### Primitives, compression & wrapping

* **concealPrimitives**: Convert booleans, `null`, `undefined` into encoded constructs (`!![]`, etc.). Adds noise.
* **compression**: Run minification/compression in the pipeline. Beware that some obfuscation constructs can be simplified by aggressive minifiers—test ordering of transforms.
* **wrapInIIFE**: Wrap whole bundle in IIFE to isolate scope; default left `false` to avoid integration issues with some bundlers.

### Anti-tamper / runtime protections

* **disableConsoleOutput** / **enableAntiDebugger** / **selfDefending** / **integrityChecks** / **tamperProtection**: Runtime protections and anti-debugging techniques. They raise the bar but can break legitimate debugging, cause false positives, and be bypassed by determined attackers. Use with caution.

### Misc transforms

* **dispatcher**: Replace direct calls with a dispatcher (call via ID)—hides call graph but harms stack traces.
* **deadCode**: Insert decoy paths. Useful in moderation; too much increases bundle size and may be removed by minifiers.

---

## Practical recommendations & tradeoffs

* **Size vs. protection**: `JSFuck` and many decoders dramatically increase bundle size—reserve for small critical modules.
* **Performance**: Caching decoded values (`optimizedStringCache`) reduces runtime cost.
* **Source maps**: Do NOT publish source maps for obfuscated builds.
* **Testing**: Run the full test suite against obfuscated builds (CI) to catch regressions.
* **Secrets**: Never store high-value secrets in client-side code—obfuscation is not encryption.
* **Profiles**: Offer safe/balanced/aggressive presets for user convenience.

---

## Suggested profiles

**Safe (smaller, reliable)**

```
{
  "numberEncoding": true,
  "numberCalculator": false,
  "stringEncoding": true,
  "optimizedStringCache": true,
  "baseIntegersDefault": "Hexadecimal",
  "encodedFunctionStrength": 2,
  "compression": true,
  "wrapInIIFE": true
}
```

**Aggressive (max obscurity, larger, slower)**

```
{
  "numberEncoding": true,
  "numberCalculator": true,
  "baseIntegersDefault": "JSFuck",
  "integerPrecentage": {"Refractal": 40, "JSFuck": 40, "Hexadecimal": 10, "Binary": 10},
  "stringEncoding": true,
  "stringSplitting": true,
  "stringConcealmentSettings": {"decodersCount": 8, "addNoiseCount": 10},
  "encodedFunctionStrength": 8,
  "concealGlobalObjects": true,
  "enableAntiDebugger": true,
  "selfDefending": true,
  "compression": true
}
```

---

## API examples

### Node API

```js
const fs = require('fs');
const { obfuscate } = require('jsscramble');

(async () => {
  const src = fs.readFileSync('src/index.js', 'utf8');
  const { code } = await obfuscate(src, require('./jsscramble.config.json'));
  fs.writeFileSync('dist/index.js', code);
})();
```

---

## Contact

JsScramble — Log1xx
