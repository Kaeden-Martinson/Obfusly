const acorn = require("acorn");
const { generateObfuscatedName } = require("../Utils/nameGenerator");
const { compress } = require("../Utils/compressor");

const { toJSFuck } = require('../Primitives/Integers/jsfuck');
const { toHex } = require('../Primitives/Integers/hexadecimal');
const { toOctal } = require('../Primitives/Integers/octal');
const { toBinary } = require('../Primitives/Integers/binary');
const { toRefractal } = require('../Primitives/Integers/refractal');
const { pickWeightedRandom } = require('../Utils/weights');

const config = require('../Settings/config');

/**
 * createIntegrity — "once" mode only (load-time integrity verification).
 *
 * Design goals:
 *  1. All checks run once at script load — zero runtime overhead afterward.
 *  2. Decoy (honeypot) checks: look like integrity checks but intentionally
 *     "fail" the comparison, routing execution through the "fail" branch which
 *     actually contains the correct code. Removing them breaks the program.
 *  3. Route-based pass/fail: instead of just freezing on tamper, the code takes
 *     a different execution route — calling wrong functions, returning wrong
 *     values, corrupting state — so the program silently misbehaves.
 *  4. Cross-function dependency: checks are scattered inside function bodies so
 *     removing one function's check breaks a different function.
 *  5. Only 2 hashers for speed; guard captured at startup.
 */
function createIntegrity(code, previousDeclarationMapping, declarationMapping, encodingAndDecodingPairs, encodeModule) {

  // ======================== Number encoding helper ========================
  function encodeLocalNumber(number) {
    // NOTE: The calculator path (encodeModule.encode / decodeName) is intentionally
    // disabled here. Integrity checks can be inserted at code positions BEFORE
    // the string concealment decoder is defined, causing runtime errors like
    // "h is not a function". Use only self-contained literal encodings.
    if (config.globalBaseIntegerConcealment) {
      if (number <= 100) {
        if (config.multipleVariableAssignments && number !== 100 && number !== 0) {
          let shuffledVariableName = Math.floor(Math.random() * 4);
          if (shuffledVariableName !== 0) return declarationMapping.get(`variable_numbers_${shuffledVariableName}_${number}`);
        };
        return declarationMapping.get(`variable_numbers_${number}`);
      } else if (config.numberEncoding) {
        let choice = pickWeightedRandom(config.integerPrecentage);
        let defaultedFunction;
        switch (choice) {
          case "Hexadecimal": defaultedFunction = toHex; break;
          case "Octal": defaultedFunction = toOctal; break;
          case "Binary": defaultedFunction = toBinary; break;
          default: case "Refractal": defaultedFunction = toRefractal; break;
        };
        return defaultedFunction(number, declarationMapping);
      };
      return number;
    } else if (config.numberEncoding) {
      let percentageBasedConfig = { ...config.integerPrecentage };
      if (number <= 10 && config.integerPrecentage.JSFuck > 0) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;
      let choice = pickWeightedRandom(percentageBasedConfig);
      let defaultedFunction;
      switch (choice) {
        case "JSFuck": defaultedFunction = toJSFuck; break;
        case "Hexadecimal": defaultedFunction = toHex; break;
        case "Octal": defaultedFunction = toOctal; break;
        case "Binary": defaultedFunction = toBinary; break;
        default: case "Refractal": defaultedFunction = toRefractal; break;
      };
      return defaultedFunction(number, declarationMapping);
    } else return number;
  }

  // ======================== Hash placeholder system (two-phase) ========================
  // Phase 1: insert all checks with fixed-width hex placeholders.
  // Phase 2: after ALL code is assembled, re-parse, compute real hashes, replace placeholders.
  // Both placeholder and real value are always 10 chars ("0x" + 8 hex digits) so
  // replacing never shifts offsets or changes code length.
  const hashPlaceholders = [];
  let _phCounter = 0;
  function makeHashPlaceholder(fnName, hasherIdx, transform) {
    const ph = `0xcafe${_phCounter.toString(16).padStart(4, '0')}`;
    _phCounter++;
    hashPlaceholders.push({ ph, fnName, hasherIdx, transform: transform || null });
    return ph;
  }

  // ======================== Hasher generation ========================
  function generateRandomHasher() {
    const rand32 = () => Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
    const randShift = () => Math.floor(Math.random() * 24) + 1;
    const consts = {
      seed1: rand32(), seed2: rand32(),
      const1: rand32(), const2: rand32(), const3: rand32(),
      mul: rand32() | 1,
      shift1: randShift(), shift2: randShift(), shift3: randShift(), shift4: randShift(),
    };

    const fnMain = generateObfuscatedName();
    const a = generateObfuscatedName(), b = generateObfuscatedName(), c = generateObfuscatedName();
    const x = generateObfuscatedName(), i = generateObfuscatedName(), ch = generateObfuscatedName();
    const t = generateObfuscatedName();

    // Inlined fnXor/fnMix — eliminates 2 function calls per finalization round.
    // Reduced finalization from 3 rounds to 2 — sufficient avalanche with less runtime cost.
    const hasherCode = `function ${fnMain}(${x}){${x}=(${x}||"")\.replace(/\\r/g,"");var ${a}=${consts.seed1}>>>0,${b}=${consts.seed2}>>>0,${c}=0;for(var ${i}=0;${i}<${x}.length;${i}++){var ${ch}=${x}.charCodeAt(${i});${a}=(${a}^${ch})+((${a}<<${consts.shift1})+(${a}>>>${consts.shift2}));${a}>>>=0;${b}=(${b}+(${ch}^(${b}<<${consts.shift3})))>>>0;${c}=(${c}+((${ch}*${consts.const1})^(${a}>>>(${i}&15))))>>>0;${a}=(${a}+((${b}<<13)|(${b}>>>19)))>>>0;${b}=(${b}^((${a}>>>7)+${consts.const2}))>>>0}var ${ch}=(${a}^(${b}+${c}))>>>0;for(var ${i}=0;${i}<2;${i}++){${ch}=((${ch}^(${ch}<<13))+${consts.const3})>>>0;var ${t}=(${ch}^(${ch}>>>${consts.shift4}))>>>0;${ch}=Math.imul(${t},${consts.mul})>>>0}return ${ch}>>>0}`;

    const buildHash = (str) => {
      str = (str || "").replace(/\r/g, "");
      let a = consts.seed1 >>> 0, b = consts.seed2 >>> 0, c = 0;
      for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        a = (a ^ ch) + ((a << consts.shift1) + (a >>> consts.shift2)); a >>>= 0;
        b = (b + (ch ^ (b << consts.shift3))) >>> 0;
        c = (c + ((ch * consts.const1) ^ (a >>> (i & 15)))) >>> 0;
        a = (a + ((b << 13) | (b >>> 19))) >>> 0;
        b = (b ^ ((a >>> 7) + consts.const2)) >>> 0;
      }
      let r = (a ^ (b + c)) >>> 0;
      for (let j = 0; j < 2; j++) {
        r = ((r ^ (r << 13)) + consts.const3) >>> 0;
        let t = (r ^ (r >>> consts.shift4)) >>> 0;
        r = Math.imul(t, consts.mul) >>> 0;
      }
      return r >>> 0;
    };

    return { hasherCode, buildHash, runtimeHasherName: fnMain, helperNames: [] };
  }

  // ======================== Trap code (infinite loops) ========================
  function generateTrapCode() {
    const v = generateObfuscatedName();
    const variants = [
      `while(!![]){}`,
      `for(;;){}`,
      `do{}while(!![])`,
      `(function ${v}(){${v}()})()`,
      `for(var ${v}=0;${v}<1;${v}-=1){}`,
      `var ${v}=!![];while(${v}){${v}=!![]}`,
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  // ======================== Generate only 2 hashers (speed) ========================
  const hasher1 = generateRandomHasher();
  const hasher2 = generateRandomHasher();

  // ======================== toString anti-hook guard ========================
  const tsName = generateObfuscatedName();
  const clName = generateObfuscatedName();
  const apName = generateObfuscatedName();
  const vfName = generateObfuscatedName();
  const stName = generateObfuscatedName();
  const paramName = generateObfuscatedName();
  const sanityName = generateObfuscatedName();

  const guardCode = `var ${tsName}=Function.prototype.toString,${clName}=Function.prototype.call,${apName}=Function.prototype.apply,${stName}=typeof setTimeout!=="undefined"?setTimeout:void 0;function ${vfName}(${paramName}){if(Function.prototype.toString!==${tsName}||Function.prototype.call!==${clName}||Function.prototype.apply!==${apName}){${generateTrapCode()}};return ${clName}.call(${tsName},${paramName})};var ${sanityName}=${clName}.call(${tsName},${tsName});if(typeof ${sanityName}!=="string"){${generateTrapCode()}}`;  

  const verifyCallName = vfName;

  // ======================== Cached toString for synchronous checks ========================
  // All synchronous integrity checks run at load time before any code can modify
  // function bodies, so caching toString() results is safe and avoids redundant calls.
  // Deferred checks (setTimeout) still use verifyCallName directly for fresh results.
  const tosCacheName = generateObfuscatedName();
  const cachedTosName = generateObfuscatedName();
  const tosCacheParam = generateObfuscatedName();
  const tosCacheResult = generateObfuscatedName();
  const tosCacheCode = `var ${tosCacheName}=new Map();function ${cachedTosName}(${tosCacheParam}){if(${tosCacheName}.has(${tosCacheParam}))return ${tosCacheName}.get(${tosCacheParam});var ${tosCacheResult}=${verifyCallName}(${tosCacheParam});${tosCacheName}.set(${tosCacheParam},${tosCacheResult});return ${tosCacheResult}}`;

  // ======================== Parse top-level functions ========================
  const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: false });
  const surfaceFunctions = [];

  function digestSelfInvokers(parent) {
    for (const node of parent.body) {
      if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) digestSelfInvokers(node.expression.callee.body);
      if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && node.expression.argument?.type === "CallExpression" && node.expression.argument.callee) digestSelfInvokers(node.expression.argument.callee.body);
      if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
        surfaceFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
      } else if (node.type === "VariableDeclaration") {
        for (const decl of node.declarations) {
          if (!decl.init) continue;
          const t = decl.init.type;
          if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
            surfaceFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end, stmtEnd: node.end });
          };
        };
      };
    };
  };

  for (const node of ast.body) {
    if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) digestSelfInvokers(node.expression.callee.body);
    if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && node.expression.argument?.type === "CallExpression" && node.expression.argument.callee) digestSelfInvokers(node.expression.argument.callee.body);
    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
      surfaceFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
    } else if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (!decl.init) continue;
        const t = decl.init.type;
        if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
          surfaceFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end, stmtEnd: node.end });
        };
      };
    };
  };

  surfaceFunctions.sort((a, b) => a.start - b.start);
  if (surfaceFunctions.length === 0) return code;

  // Duplicate function name tracking (skip earlier duplicates — hoisting resolves to last)
  const fnNameCount = new Map();
  for (const fn of surfaceFunctions) {
    const name = fn.kind === "decl" ? fn.name : fn.varName;
    if (name) fnNameCount.set(name, (fnNameCount.get(name) || 0) + 1);
  }
  const fnLastOccurrence = new Map();
  for (const fn of surfaceFunctions) {
    const name = fn.kind === "decl" ? fn.name : fn.varName;
    if (name) fnLastOccurrence.set(name, fn);
  }

  // ======================== Collect eligible functions ========================
  const eligible = [];
  for (const fn of surfaceFunctions) {
    const name = fn.kind === "decl" ? fn.name : fn.varName;
    if (!name) continue;
    const isEncoderFn = (encodingAndDecodingPairs?.decodeMainFunctionNames?.includes(name) || encodingAndDecodingPairs?.decoderFunctionNames?.includes(name));
    if (isEncoderFn) continue;
    if (fnNameCount.get(name) > 1 && fnLastOccurrence.get(name) !== fn) continue;

    const fnCode = code.slice(fn.kind === "var" ? fn.initStart : fn.start, fn.kind === "var" ? fn.initEnd : fn.end);
    const firstBrace = fnCode.indexOf("{");
    const lastBrace = fnCode.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) continue;
    if (fn.kind === "decl" && fnCode[firstBrace - 1] === "(") continue;

    eligible.push({ fn, name, fnCode });
  }

  if (eligible.length === 0) return code;

  // ======================== Collect function info (hashes computed after all insertions) ========================
  const fnInfos = eligible.map(({ fn, name, fnCode }) => ({
    fn, name, fnCode,
  }));

  // ======================== Build route-based check snippets ========================
  //
  // Instead of just freezing, we generate a "routing variable" per function.
  // If integrity passes, the variable gets value A (used by subsequent code).
  // If it fails, the variable gets value B (wrong value — program silently misbehaves).
  //
  // Decoy checks: we generate fake checks where the hash is intentionally WRONG,
  // so the "!== hash" comparison SUCCEEDS (appears to "fail"), but we put the
  // CORRECT code in the "fail" branch. Someone removing "failed" checks kills the program.

  const sep = config.compression ? "" : "\n";
  const routeVars = []; // { varName, correctValue } — needed for post-injection
  const snippetsAfterFn = []; // { pos, snippet }
  let _realChecks = 0, _decoyChecks = 0, _crossChecks = 0, _deferredChecks = 0;

  for (let idx = 0; idx < fnInfos.length; idx++) {
    const { fn, name } = fnInfos[idx];
    const fnRef = name;
    const eH1 = makeHashPlaceholder(name, 1);
    const eH2 = makeHashPlaceholder(name, 2);
    const getFnStr = `${cachedTosName}(${fnRef})`;

    // ---------- Real check (route-based): integrity pass → correct route ----------
    const routeVar = generateObfuscatedName();
    const correctVal = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
    const wrongVal = (correctVal ^ 0xDEADBEEF) >>> 0;
    const eCorrect = encodeLocalNumber(correctVal, true);
    const eWrong = encodeLocalNumber(wrongVal, true);

    routeVars.push({ varName: routeVar, correctValue: correctVal });

    // Trap code for hash mismatch — triggers immediately if tampered
    const trapCode = generateTrapCode();

    // Pick a random pattern for the real check
    const realPatterns = [
      // Pattern 1: ternary assignment with trap
      () => {
        const s = generateObfuscatedName(), d = generateObfuscatedName();
        return `var ${s}=${getFnStr},${d}=(${hasher1.runtimeHasherName}(${s})^(${eH1}))|(${hasher2.runtimeHasherName}(${s})^(${eH2})),${routeVar}=${d}?(${eWrong}):(${eCorrect});if(${d}){${trapCode}}`;
      },
      // Pattern 2: IIFE that returns value with trap
      () => {
        const s = generateObfuscatedName(), r1 = generateObfuscatedName();
        return `var ${routeVar}=(function(){var ${s}=${getFnStr},${r1}=(${hasher1.runtimeHasherName}(${s})^(${eH1}))|(${hasher2.runtimeHasherName}(${s})^(${eH2}));if(${r1}){${trapCode}};return ${r1}?(${eWrong}):(${eCorrect})})();`;
      },
      // Pattern 3: XOR check with conditional and trap
      () => {
        const s = generateObfuscatedName(), d = generateObfuscatedName();
        return `var ${s}=${getFnStr},${d}=(${hasher1.runtimeHasherName}(${s})^(${eH1}))|(${hasher2.runtimeHasherName}(${s})^(${eH2})),${routeVar}=${d}?(${eWrong}):(${eCorrect});if(${d}){${trapCode}}`;
      },
      // Pattern 4: switch-based with trap
      () => {
        const s = generateObfuscatedName();
        return `var ${s}=${getFnStr},${routeVar};switch((${hasher1.runtimeHasherName}(${s})^(${eH1}))|(${hasher2.runtimeHasherName}(${s})^(${eH2}))){case 0:${routeVar}=(${eCorrect});break;default:${routeVar}=(${eWrong});${trapCode}};`;
      },
    ];

    const realSnippet = sep + realPatterns[Math.floor(Math.random() * realPatterns.length)]();
    const insertEnd = fn.kind === "var" ? fn.stmtEnd : fn.end;
    snippetsAfterFn.push({ pos: insertEnd, snippet: realSnippet });
    _realChecks++;

    // ---------- Decoy checks (honeypots): intentionally wrong hash, "fail" = correct code ----------
    if (Math.random() < 0.7 && eligible.length > 1) {
      const decoyVar = generateObfuscatedName();
      const decoyCorrectVal = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
      const decoyWrongVal = (decoyCorrectVal ^ 0xCAFEBABE) >>> 0;
      const eDecoyCorrect = encodeLocalNumber(decoyCorrectVal, true);
      const eDecoyWrong = encodeLocalNumber(decoyWrongVal, true);
      // Use WRONG hashes so the checks always "fail" — the "fail" branch has the right value
      const eFakeHash = makeHashPlaceholder(name, 1, h => (h ^ 0x12345678) >>> 0);
      const eFakeHash2 = makeHashPlaceholder(name, 2, h => (h ^ 0x12345678) >>> 0);

      routeVars.push({ varName: decoyVar, correctValue: decoyCorrectVal });

      const decoyPatterns = [
        () => {
          const s = generateObfuscatedName();
          return `var ${s}=${getFnStr},${decoyVar}=(${hasher1.runtimeHasherName}(${s})!==(${eFakeHash})||${hasher2.runtimeHasherName}(${s})!==(${eFakeHash2}))?(${eDecoyCorrect}):(${eDecoyWrong});`;
        },
        () => {
          const s = generateObfuscatedName(), r1 = generateObfuscatedName();
          return `var ${decoyVar}=(function(){var ${s}=${getFnStr},${r1}=(${hasher1.runtimeHasherName}(${s})^(${eFakeHash}))|(${hasher2.runtimeHasherName}(${s})^(${eFakeHash2}));return ${r1}?(${eDecoyCorrect}):(${eDecoyWrong})})();`;
        },
        () => {
          const s = generateObfuscatedName();
          return `var ${s}=${getFnStr},${decoyVar};switch((${hasher1.runtimeHasherName}(${s})^(${eFakeHash}))|(${hasher2.runtimeHasherName}(${s})^(${eFakeHash2}))){case 0:${decoyVar}=(${eDecoyWrong});break;default:${decoyVar}=(${eDecoyCorrect})};`;
        },
      ];

      snippetsAfterFn.push({ pos: insertEnd, snippet: sep + decoyPatterns[Math.floor(Math.random() * decoyPatterns.length)]() });
      _decoyChecks++;
    }

    // ---------- Cross-function stealth check (placed after a DIFFERENT function) ----------
    // NOTE: These must be placed AFTER (not inside) the other function to avoid
    // mutating its body — which would invalidate the pre-computed hash and cause
    // false integrity failures at runtime.
    // Only create cross-checks for function declarations (hoisted), not var-assigned
    // function expressions, since the cross-check may be placed before the var
    // assignment executes, causing a "not a function" error at runtime.
    if (eligible.length > 1 && fn.kind === "decl") {
      const otherIdx = (idx + 1 + Math.floor(Math.random() * (eligible.length - 1))) % eligible.length;
      const otherFn = eligible[otherIdx];
      const otherInsertEnd = otherFn.fn.kind === "var" ? otherFn.fn.stmtEnd : otherFn.fn.end;

      const crossVar = generateObfuscatedName();
      const crossCorrect = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
      const crossWrong = (crossCorrect ^ 0xBAADF00D) >>> 0;
      const eCrossCorrect = encodeLocalNumber(crossCorrect, true);
      const eCrossWrong = encodeLocalNumber(crossWrong, true);
      routeVars.push({ varName: crossVar, correctValue: crossCorrect });

      const s = generateObfuscatedName();
      const eH1_cross = makeHashPlaceholder(name, 1);
      const eH2_cross = makeHashPlaceholder(name, 2);
      const crossSnippet = `var ${s}=${getFnStr},${crossVar}=((${hasher1.runtimeHasherName}(${s})^(${eH1_cross}))|(${hasher2.runtimeHasherName}(${s})^(${eH2_cross})))?(${eCrossWrong}):(${eCrossCorrect});`;
      snippetsAfterFn.push({ pos: otherInsertEnd, snippet: sep + crossSnippet });
      _crossChecks++;
    }
  }

  // ======================== Deferred re-check via captured setTimeout ========================
  // Pick up to 3 functions for a delayed re-verification.
  // IMPORTANT: Deferred checks are placed at the SAME scope level as their target
  // function (using the function's insertEnd position) rather than at top-level
  // statement ends. This ensures the function reference is accessible at runtime,
  // even when functions are nested inside IIFEs or other closures.
  const deferredTargets = [...fnInfos].sort(() => Math.random() - 0.5).slice(0, Math.min(3, fnInfos.length));
  _deferredChecks = deferredTargets.length;

  for (const { fn, name: fnRef } of deferredTargets) {
    const hp1 = generateObfuscatedName(), hp2 = generateObfuscatedName();
    const cl = generateObfuscatedName(), ts = generateObfuscatedName();
    const st = generateObfuscatedName(), sv = generateObfuscatedName();
    const tmr = generateObfuscatedName();
    const fr = generateObfuscatedName(); // captured function reference parameter
    const delay = Math.floor(Math.random() * 8000) + 2000;
    const eH1 = makeHashPlaceholder(fnRef, 1);
    const eH2 = makeHashPlaceholder(fnRef, 2);
    // Capture the function reference as an IIFE parameter (fr) so that even if
    // the original variable is reassigned (self-modifying functions), the
    // deferred check still verifies the original function's hash.
    // IMPORTANT: Deferred checks bypass the guarded verifyCallName and instead
    // capture clName (Function.prototype.call) and tsName (Function.prototype.toString)
    // directly. This avoids false positives when user code legitimately replaces
    // Function.prototype.toString after load (e.g. toString spoofing for native look).
    const deferredSnippet = `(function(${hp1},${hp2},${cl},${ts},${st},${fr}){var ${tmr}=${st}(function(){try{var ${sv}=${cl}.call(${ts},${fr});if(${hp1}(${sv})!==(${eH1})||${hp2}(${sv})!==(${eH2})){${generateTrapCode()}}}catch(${generateObfuscatedName()}){${generateTrapCode()}}},${encodeLocalNumber(delay, true)});if(typeof ${tmr}==="object"&&${tmr}&&typeof ${tmr}.unref==="function")${tmr}.unref()})(${hasher1.runtimeHasherName},${hasher2.runtimeHasherName},${clName},${tsName},${stName},${fnRef});`;
    const insertEnd = fn.kind === "var" ? fn.stmtEnd : fn.end;
    snippetsAfterFn.push({ pos: insertEnd, snippet: sep + deferredSnippet });
  }

  // ======================== Route variable verification ========================
  // All integrity checks set route variables to correct values on pass.
  // If any check is removed, its route variable is missing/wrong, so this
  // combined XOR verification fails and triggers a trap.
  // Injected at the same code position as the last snippet to stay in scope.
  if (routeVars.length > 0) {
    const combinedVar = generateObfuscatedName();
    const expectedXor = routeVars.reduce((acc, rv) => (acc ^ rv.correctValue) >>> 0, 0);
    const xorExpr = routeVars.map(rv => rv.varName).join('^');
    const maxPos = Math.max(...snippetsAfterFn.map(s => s.pos));
    const verifySnippet = `var ${combinedVar}=(${xorExpr})>>>0;if(${combinedVar}!==${expectedXor >>> 0}){${generateTrapCode()}}`;
    snippetsAfterFn.push({ pos: maxPos, snippet: sep + verifySnippet });
  }

  // ======================== Inject snippets (descending order to preserve offsets) ========================
  // Combine all insertions, sort descending by position.
  // Tiebreaker: descending idx so same-position items appear in insertion order.
  const allInsertions = snippetsAfterFn
    .map((s, i) => ({ ...s, type: "after", idx: i }))
    .sort((a, b) => b.pos - a.pos || b.idx - a.idx);

  for (const { pos, snippet } of allInsertions) {
    code = code.slice(0, pos) + snippet + code.slice(pos);
  }

  // ======================== Prepend hashers + guard ========================
  const h2Compressed = compress(hasher2.hasherCode);
  const h1Compressed = compress(hasher1.hasherCode);
  const guardCompressed = compress(guardCode);
  const tosCacheCompressed = compress(tosCacheCode);

  code = guardCompressed + sep + h1Compressed + sep + h2Compressed + sep + tosCacheCompressed + sep + code;

  // ======================== Neutralize hashers (after ALL checks) ========================
  // CRITICAL: Neutralizers must execute AFTER every synchronous integrity check.
  // They are appended to the very end of the code so no check can come after them.
  // Deferred checks (setTimeout) capture hasher refs via closure, so they're safe.
  const neutralizers = [hasher1, hasher2].map(h => {
    const v = generateObfuscatedName();
    const variants = [
      `${h.runtimeHasherName}=function(${v}){${generateTrapCode()}}`,
      `${h.runtimeHasherName}=function(){${generateTrapCode()};return 0}`,
      `${h.runtimeHasherName}=(function(){return function(${v}){${generateTrapCode()}}})()`,
    ];
    return variants[Math.floor(Math.random() * variants.length)] + ";";
  });

  // NOTE: Helper functions (fnXor, fnMix) are NOT neutralized because deferred
  // checks capture the hasher via closure but the hasher's body calls helpers
  // by name. Neutralizing helpers would break deferred checks.

  const allNeutralizers = [...neutralizers];
  // Append all neutralizers at the very end of the code
  code = code + sep + allNeutralizers.join(sep);

  // ======================== Phase 2: Compute real hashes & replace placeholders ========================
  // Now that ALL code is fully assembled (checks, hashers, deferred, neutralizers),
  // re-parse to get the FINAL function bodies, hash them, and swap each fixed-width
  // placeholder (0xcafeXXXX, 10 chars) with the real hash (0xHHHHHHHH, 10 chars).
  if (hashPlaceholders.length > 0) {
    const finalAst = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: false });
    const finalFunctions = [];

    function finalDigestSelfInvokers(parent) {
      for (const node of parent.body) {
        if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) finalDigestSelfInvokers(node.expression.callee.body);
        if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && node.expression.argument?.type === "CallExpression" && node.expression.argument.callee) finalDigestSelfInvokers(node.expression.argument.callee.body);
        if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
          finalFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
        } else if (node.type === "VariableDeclaration") {
          for (const decl of node.declarations) {
            if (!decl.init) continue;
            const t = decl.init.type;
            if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
              finalFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end });
            }
          }
        }
      }
    }

    for (const node of finalAst.body) {
      if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) finalDigestSelfInvokers(node.expression.callee.body);
      if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && node.expression.argument?.type === "CallExpression" && node.expression.argument.callee) finalDigestSelfInvokers(node.expression.argument.callee.body);
      if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
        finalFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
      } else if (node.type === "VariableDeclaration") {
        for (const decl of node.declarations) {
          if (!decl.init) continue;
          const t = decl.init.type;
          if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
            finalFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end });
          }
        }
      }
    }

    // Match by name — only hash the original eligible functions
    const eligibleNames = new Set(eligible.map(e => e.name));
    const finalNameCount = new Map();
    for (const fn of finalFunctions) {
      const nm = fn.kind === "decl" ? fn.name : fn.varName;
      if (nm) finalNameCount.set(nm, (finalNameCount.get(nm) || 0) + 1);
    }
    const finalLastOcc = new Map();
    for (const fn of finalFunctions) {
      const nm = fn.kind === "decl" ? fn.name : fn.varName;
      if (nm) finalLastOcc.set(nm, fn);
    }

    const finalFnHashes = new Map();
    for (const fn of finalFunctions) {
      const nm = fn.kind === "decl" ? fn.name : fn.varName;
      if (!nm || !eligibleNames.has(nm)) continue;
      if (finalNameCount.get(nm) > 1 && finalLastOcc.get(nm) !== fn) continue;
      const fnSrc = code.slice(fn.kind === "var" ? fn.initStart : fn.start, fn.kind === "var" ? fn.initEnd : fn.end);
      const normalized = fnSrc.replace(/\r/g, "");
      finalFnHashes.set(nm, {
        h1: hasher1.buildHash(normalized),
        h2: hasher2.buildHash(normalized),
      });
    }

    // Replace each placeholder with the real hash — both are exactly 10 chars.
    // Use single-pass regex to avoid ordering bugs where a replacement value
    // could match another placeholder's string.
    const phMap = new Map();
    for (const { ph, fnName, hasherIdx, transform } of hashPlaceholders) {
      const hashes = finalFnHashes.get(fnName);
      if (!hashes) continue;
      const rawHash = hasherIdx === 1 ? hashes.h1 : hashes.h2;
      const finalHash = transform ? transform(rawHash) : rawHash;
      const realHex = `0x${(finalHash >>> 0).toString(16).padStart(8, '0')}`;
      phMap.set(ph, realHex);
    }
    if (phMap.size > 0) {
      const phRegex = new RegExp(
        Array.from(phMap.keys()).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
        'g'
      );
      code = code.replace(phRegex, (match) => phMap.get(match) || match);
    }
  }

  // Log integrity stats
  const _total = _realChecks + _decoyChecks + _crossChecks + _deferredChecks;
  console.log(`  Integrity checks injected: ${_total} (${_realChecks} real, ${_decoyChecks} decoy, ${_crossChecks} cross-fn, ${_deferredChecks} deferred)`);
  console.log(`  Functions protected: ${eligible.length}`);
  console.log(`  Neutralizers scattered: ${allNeutralizers.length}`);

  return code;
};

module.exports = { createIntegrity };
