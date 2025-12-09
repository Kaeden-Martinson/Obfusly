// instrument.js
const acorn = require("acorn");
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node instrument.js <input.js> [output.js]");
  process.exit(1);
}
const inputPath = process.argv[2];
const outputPath = process.argv[3] || (path.basename(inputPath, ".js") + ".instrumented.js");

let code = fs.readFileSync(inputPath, "utf8");

// ---------- Complex build-time hash function (same algorithm as injected one) ----------
function generateRandomHasher() {
  const rand32 = () => Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
  const randShift = () => Math.floor(Math.random() * 24) + 1;

  const consts = {
    seed1: rand32(),
    seed2: rand32(),
    const1: rand32(),
    const2: rand32(),
    const3: rand32(),
    mul: rand32() | 1, // odd number for multiplication stability
    shift1: randShift(),
    shift2: randShift(),
    shift3: randShift(),
    shift4: randShift(),
  };

  const rand = () => Math.floor(Math.random() * 0x1000000).toString(36);
  const fnXor = "_x" + rand();
  const fnMix = "_m" + rand();
  const fnMain = "_h" + rand();

  const hasherCode = `function ${fnXor}(a, b) {
  return (a ^ b) >>> 0;
}
function ${fnMix}(x) {
  let t = (x ^ (x >>> ${consts.shift4})) >>> 0;
  return Math.imul(t, ${consts.mul}) >>> 0;
}
function ${fnMain}(s) {
  s = (s || "").replace(/\\r/g, "\\n");
  var a = ${consts.seed1} >>> 0, b = ${consts.seed2} >>> 0, c = 0 >>> 0;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charCodeAt(i);
    a = (a ^ ch) + ((a << ${consts.shift1}) + (a >>> ${consts.shift2})); a >>>= 0;
    b = (b + (ch ^ (b << ${consts.shift3}))) >>> 0;
    c = (c + ((ch * ${consts.const1}) ^ (a >>> (i & 15)))) >>> 0;
    a = (a + ((b << 13) | (b >>> 19))) >>> 0;
    b = (b ^ ((a >>> 7) + ${consts.const2})) >>> 0;
  }
  var r = ${fnXor}(a, (b + c));
  for (var j = 0; j < 3; j++) {
    r = ${fnXor}((r ^ (r << 13)) + ${consts.const3}, 0);
    r = ${fnMix}(r);
  }
  return r >>> 0;
}`.trim();

  // Runtime name to use in inserted checks
  const runtimeHasherName = fnMain;

  // Also generate build-time function with identical logic
  const buildHash = (str) => {
    str = (str || "").replace(/\r/g, "\n");
    let a = consts.seed1 >>> 0;
    let b = consts.seed2 >>> 0;
    let c = 0 >>> 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      a = (a ^ ch) + ((a << consts.shift1) + (a >>> consts.shift2)); a >>>= 0;
      b = (b + (ch ^ (b << consts.shift3))) >>> 0;
      c = (c + ((ch * consts.const1) ^ (a >>> (i & 15)))) >>> 0;
      a = (a + ((b << 13) | (b >>> 19))) >>> 0;
      b = (b ^ ((a >>> 7) + consts.const2)) >>> 0;
    }
    let r = (a ^ (b + c)) >>> 0;
    for (let j = 0; j < 3; j++) {
      r = ((r ^ (r << 13)) + consts.const3) >>> 0;
      let t = (r ^ (r >>> consts.shift4)) >>> 0;
      r = Math.imul(t, consts.mul) >>> 0;
    }
    return r >>> 0;
  };

  return {
    hasherCode,
    buildHash,
    runtimeHasherName,
  };
}

const { hasherCode, buildHash, runtimeHasherName } = generateRandomHasher();

// ---------- Helper: random name generator ----------
function randomName(prefix = "_x") {
  return prefix + Math.floor(Math.random() * 0x1000000).toString(36);
}

const EXPECT_PREFIX = "_e"; // prefix for expected-value variables

// ---------- Randomized check snippet generator with bounded opaque loops ----------
function generateCheckSnippet({ fnRef, expectedVarName, runtimeHasherName }) {
  // fnRef: string denoting how to reference function at runtime (e.g. "myFn")
  // expectedVarName: placeholder variable name (not the numeric literal)
  // runtimeHasherName: injected runtime hasher function name

  // Different ways to coerce fn to string (varied)
  const fnForms = [
    `${fnRef}.toString()`,
    `(${fnRef} + "")`,
    `String(${fnRef})`,
    `${fnRef}["toString"]()`,
    `(0, ${fnRef}).toString()`,
    '`${' + fnRef + '}`'
  ];

  // Bounded loop templates that operate only on local variables (no external side effects)
  // We reference __BOUND__ and __ITER__ placeholders which we will substitute in.
  function randomLoopTemplate() {
    const randIdent = () => '_' + Math.random().toString(36).slice(2, 6);
    const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const templates = [
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(100000, 999999);
        const mask = randNum(1, 16);
        // Note: __ITER__ expected replaced by a concrete small value at runtime/build
        return `(function(){var ${v}=0|0; for(var ${i}=0, ${L}=Math.min((__ITER__), ${randNum(10, 10000)}); ${i}<${L}; ${i}++){ ${v} = (${v} ^ Math.imul(${i}+1, ${mul})) >>> 0; ${v} = (${v} + (${v}<<3))>>>0; if ((${v} & ${mask}) === ${mask}) break; } return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(2, 10);
        // bounded iterations via Math.min
        return `(function(){var ${v}=1; var ${i}=0; var ${L}=Math.min((__ITER__), ${randNum(10, 5000)}); while(${i}++<${L}){ ${v} = (Math.imul(${v}, ${mul}) ^ ${i}) >>> 0; ${i} -= (${v} & ${randNum(0, 7)}); if (${i} < 0) break; } return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const cap = randNum(10, 5000);
        return `(function(){var ${v}=${randNum(2, 20)}; var ${i}=0; var ${L}=Math.min((__ITER__), ${cap}); do{ ${v} = ((${v}<<5)-${v}) ^ ${i}; ${i}++; if (${i} > ${cap}) break; } while(${i} < ${L}); return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(3, 13), modulus = randNum(2, 10);
        return `(function(){var ${v}=0; var ${L}=Math.min((__ITER__), ${randNum(10, 5000)}); for(var ${i}=0;${i}<${L};${i}++){ ${v} += ((${i}&3)?Math.imul(${i},${mul}):${i}); ${v} = ${v} >>> 0; if (${v} % ${modulus} === 0) break; } return ${v}; })()`;
      }
    ];
    const pick = templates[Math.floor(Math.random() * templates.length)];
    return pick();
  }


  // Patterns that use the hash expression and conditionally execute the loop expression
  const patterns = [
    // call hasher against fn form, if mismatch compute opaque loop result and discard
    `if (${runtimeHasherName}(${fnForms[0]}) !== ${expectedVarName}) { __LOOP__; }`,
    `if (!(${runtimeHasherName}(${fnForms[1]}) === ${expectedVarName})) { var __r = __LOOP__; }`,
    `(()=>{ if (${runtimeHasherName}(${fnForms[2]}) != ${expectedVarName}) { var __z = __LOOP__; } })();`,
    `try { if (${runtimeHasherName}(${fnForms[3]}) !== ${expectedVarName}) throw __LOOP__; } catch(e) {  __LOOP__ }`,
    `if (${expectedVarName} != ${runtimeHasherName}(${fnForms[4]})) { var __x = __LOOP__; }`,
    `if (void 0 === (${runtimeHasherName}(${fnForms[0]})===${expectedVarName}?${expectedVarName}:(parseInt(${expectedVarName} + "_")["${Math.floor(Math.random() * 10000)}"]))) { var __y = __LOOP__; }`
  ];

  // choose random pattern and loop template
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const loopTpl = randomLoopTemplate();

  // compute an iteration expression that uses the hash/expected placeholder
  // We'll define __ITER__ as `(((${runtimeHasherName}(${fnForms[0]})^${expectedVarName})&0x3ff)+64)` which is bounded and appears complex.
  // Use the same fnForms[0] inside iteration expression to keep variety.
  const iterExpr = `(((${runtimeHasherName}(${fnForms[0]}) ^ ${expectedVarName}) & 0x3ff) + 64)`;

  // substitute placeholders
  let loopExpr = loopTpl.replace(/__ITER__/g, iterExpr);
  // ensure no leftover placeholder names
  let result = pattern.replace(/__LOOP__/g, loopExpr);

  // Replace any remaining fnForms in pattern (some patterns included direct fnForms earlier)
  // (pattern templates already included fnForms inline where needed)

  // Clean up temporary locals naming: to reduce collisions, rename __r/__z/etc to randomized names
  const tmpName = randomName("_t");
  result = result.replace(/\b__r\b/g, tmpName + "r").replace(/\b__z\b/g, tmpName + "z").replace(/\b__x\b/g, tmpName + "x").replace(/\b__y\b/g, tmpName + "y");

  // Finally return as a statement (no leading/trailing newlines)
  return result;
}

// ---------- parse and find top-level functions ----------
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: false });
const surfaceFunctions = [];

// collect top-level function declarations and variable-declared functions
for (const node of ast.body) {
  console.log(node)
  if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
    surfaceFunctions.push({
      kind: "decl",
      name: node.id.name,
      start: node.start,
      end: node.end
    });
  } else if (node.type === "VariableDeclaration") {
    for (const decl of node.declarations) {
      if (!decl.init) continue;
      const t = decl.init.type;
      if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
        surfaceFunctions.push({
          kind: "var",
          varName: decl.id && decl.id.name ? decl.id.name : null,
          start: decl.start,
          end: decl.end,
          initStart: decl.init?.start,
          initEnd: decl.init?.end
        });
      }
    }
  } else if (node.type === "ExpressionStatement") {
    for (const decl of node.expression.callee.body.body) {
      console.log(decl)
      const t = decl.type;

      if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
        surfaceFunctions.push({
          kind: "decl",
          name: decl.id.name,
          start: decl.start,
          end: decl.end,
        });
      } else if (t === "VariableDeclaration") {
        for (const var_decl of decl.declarations) {
          if (!var_decl.init) continue;
          const t = var_decl.init.type;
          if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
            surfaceFunctions.push({
              kind: "var",
              varName: var_decl.id && var_decl.id.name ? var_decl.id.name : null,
              start: var_decl.start,
              end: var_decl.end,
              initStart: var_decl.init?.start,
              initEnd: var_decl.init?.end
            });
          }
        }
      }
    }
  }
}

surfaceFunctions.sort((a, b) => a.start - b.start);

console.log(surfaceFunctions)

if (surfaceFunctions.length === 0) {
  console.log("No top-level functions found. Writing original file unchanged.");
  fs.writeFileSync(outputPath, code, "utf8");
  process.exit(0);
}

// Build the injected hasher source (compact but complex)
const injectedHasherSrc = hasherCode;
let cachedCode = code;

// Inject hasher at top if not already present
let injectedTop = false;
if (!code.includes(`${runtimeHasherName}(`)) {
  code = injectedHasherSrc + "\n" + code;
  injectedTop = true;
}
let offset = injectedTop ? injectedHasherSrc.length + 1 : 0;

// Prepare storage for expected variable declarations
const expectedVars = []; // { varName, value }

// Helper: pick an insertion offset inside fnCode that's reasonably between statements
function pickInsertionOffset(fnCode) {
  const candidates = [];
  // collect indices after semicolons and newlines and after opening braces inside the function body
  for (let i = 0; i < fnCode.length; i++) {
    const ch = fnCode[i];
    if (ch === ';' || ch === "\n" || ch === "\r") {
      // avoid inserting at the very end
      if (i + 1 < fnCode.length - 1) candidates.push(i + 1);
    }
  }
  if (candidates.length === 0) return null;
  // pick a random candidate
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// For each surface function, we create placeholder expected var and insert randomized bounded checks within the body
for (const fn of surfaceFunctions) {
  if (fn.kind === "decl") {
    const realStart = fn.start + offset;
    const fnCode = cachedCode.slice(fn.start, fn.end);
    const firstBrace = fnCode.indexOf("{");
    const lastBrace = fnCode.lastIndexOf("}");

    console.log(fnCode, fn)
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) continue;

    // unique expected variable name for this function
    const expectedVarName = randomName(EXPECT_PREFIX);

    // how we reference the function at runtime (named decl => direct name)
    const fnRef = fn.name;

    // build randomized check snippet body
    const checkBody = generateCheckSnippet({ fnRef, expectedVarName, runtimeHasherName });

    // choose insertion offset inside the function body (relative to fnCode)
    let insertPosRel = pickInsertionOffset(fnCode);
    if (insertPosRel === null) {
      // fallback: insert right after opening brace
      insertPosRel = firstBrace + 1;
    }

    // ensure insertion point is within the braces (between firstBrace+1 and lastBrace)
    if (insertPosRel <= firstBrace) insertPosRel = firstBrace + 1;
    if (insertPosRel >= lastBrace) insertPosRel = lastBrace;

    // build snippet with semicolons/newlines around to make it blend in
    const checkSnippet = `${checkBody}\n`;

    // simulate function source after insertion (for computing expected hash)
    const simulatedFn = fnCode.slice(0, insertPosRel) + checkSnippet + fnCode.slice(insertPosRel);
    const normalized = simulatedFn.replace(/\r/g, "");
    const expectedValue = buildHash(normalized);
    expectedVars.push({ varName: expectedVarName, value: expectedValue });

    // now actually insert the snippet into the real code at the correct real offset
    const insertAt = realStart + insertPosRel;
    code = code.slice(0, insertAt) + checkSnippet + code.slice(insertAt);
    offset += checkSnippet.length;
  } else if (fn.kind === "var") {
    const initStart = fn.initStart + offset;
    const initEnd = fn.initEnd + offset;
    let initCode = code.slice(initStart, initEnd);
    const braceIdx = initCode.indexOf("{");
    const lastBraceIdx = initCode.lastIndexOf("}");

    // unique expected var name
    const expectedVarName = randomName(EXPECT_PREFIX);

    if (braceIdx !== -1 && lastBraceIdx !== -1 && lastBraceIdx > braceIdx) {
      // block-bodied function expression / function assigned to variable
      if (!fn.varName) continue; // can't reference runtime name if absent
      const fnRef = fn.varName;

      // build randomized check snippet
      const checkBody = generateCheckSnippet({ fnRef, expectedVarName, runtimeHasherName });

      // pick insertion position inside initCode
      let insertRel = pickInsertionOffset(initCode);
      if (insertRel === null) insertRel = braceIdx + 1;
      if (insertRel <= braceIdx) insertRel = braceIdx + 1;
      if (insertRel >= lastBraceIdx) insertRel = lastBraceIdx;

      const checkSnippet = `${checkBody}`;
      const simulatedInit = initCode.slice(0, insertRel) + checkSnippet + initCode.slice(insertRel);
      const normalized = simulatedInit.replace(/\r/g, "");
      const expectedValue = buildHash(normalized);
      expectedVars.push({ varName: expectedVarName, value: expectedValue });

      // insert
      const insertAt = initStart + insertRel;
      code = code.slice(0, insertAt) + checkSnippet + code.slice(insertAt);
      offset += checkSnippet.length;
    } else {
      // concise arrow: convert `(...)=>(expr)` to block body and insert check inside
      const arrowPos = initCode.indexOf("=>");
      if (arrowPos === -1) continue; // unexpected; skip
      if (!fn.varName) continue; // cannot reference runtime name if varName absent

      const left = initCode.slice(0, arrowPos + 2); // includes =>
      const right = initCode.slice(arrowPos + 2);   // expression
      const expr = right.trim();

      const fnRef = fn.varName;

      // create randomized check snippet referencing expected var name
      const checkBody = generateCheckSnippet({ fnRef, expectedVarName, runtimeHasherName });
      // For concise arrow we'll insert a statement then return the original expression
      // const checkStatement = `${checkBody}`;

      // replacement block: =>{ <check> return (expr); }
      const replacement = `{ ${checkBody} return (${expr}); }`;

      // simulate new initCode (we will compute expected over the transformed init code)
      const simulatedInit = left + replacement;
      const normalized = simulatedInit.replace(/\r/g, "");
      const expectedValue = buildHash(normalized);
      expectedVars.push({ varName: expectedVarName, value: expectedValue });

      // now replace in real code
      code = code.slice(0, initStart) + left + replacement + code.slice(initEnd);
      offset += (left + replacement).length - initCode.length;
    }
  }
}

// After we've injected all check snippets, insert the expected variable assignments at the top
if (expectedVars.length > 0) {
  // build var declarations: var _e1=123,_e2=456;
  const decls = expectedVars.map(ev => `${ev.varName}=${ev.value}`).join(",");
  const varBlock = `var ${decls};\n\n`;

  // find insertion point right after injected hasher
  const insertionPoint = injectedTop ? injectedHasherSrc.length + 1 : 0;
  code = code.slice(0, insertionPoint) + varBlock + code.slice(insertionPoint);
}

fs.writeFileSync(outputPath, code, "utf8");
console.log("Instrumented file written to:", outputPath);
