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
let hasherIndex = 0;

function generateRandomHasher(previous_hash) {
  // console.log(previous_hash)
  const rand32 = () => Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
  const randShift = () => Math.floor(Math.random() * 24) + 1;

  const consts = {
    seed1: rand32(),
    seed2: rand32(),
    const1: rand32(),
    const2: rand32(),
    const3: rand32(),
    mul: rand32() | 1,
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
  s = (s || "").replace(/\\r/g, "");
  s = (s || "").replace(/\\n/g, "");
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

  const runtimeHasherName = fnMain;

  const buildHash = (str) => {
    str = (str || "").replace(/\r/g, "");
    str = (str || "").replace(/\n/g, "");

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

let hashingAlgorithms = [];

for (let i = 0; i < 10; i++) {
  const { hasherCode, buildHash, runtimeHasherName } = generateRandomHasher(hashingAlgorithms?.[i - 1]);
  hashingAlgorithms.push({ hasherCode, buildHash, runtimeHasherName });
};

function getHasherName() {
  const len = hashingAlgorithms.length;
  if (len < 2) throw new Error("Need at least 2 hashing algorithms");

  const i1 = Math.floor(Math.random() * len);

  let i2 = Math.floor(Math.random() * (len - 1));
  if (i2 >= i1) i2++;

  return [
    hashingAlgorithms[i1].runtimeHasherName,
    hashingAlgorithms[i2].runtimeHasherName
  ];
};

function buildHashFromName(str, name) {
  return hashingAlgorithms.find(alg => alg.runtimeHasherName === name).buildHash(str);
}

// ---------- Helper: random name generator ----------
function randomName(prefix = "_x") {
  return prefix + Math.floor(Math.random() * 0x1000000).toString(36);
}

const EXPECT_PREFIX = "_e";

// ---------- Randomized check snippet generator with bounded opaque loops ----------
function generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName }) {
  const fnForms = [
    `${fnRef}.toString()`,
    `(${fnRef} + "")`,
    `String(${fnRef})`,
    `${fnRef}["toString"]()`,
    `(0, ${fnRef}).toString()`,
    '`${' + fnRef + '}`'
  ];

  function randomLoopTemplate() {
    const randIdent = () => '_' + Math.random().toString(36).slice(2, 6);
    const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const templates = [
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(100000, 999999);
        const mask = randNum(1, 16);
        return `(function(){var ${v}=0|0; for(var ${i}=0, ${L}=Math.min((__ITER__), ${randNum(10, 10000)}); ${i}<${L}; ${i}++){ ${v} = (${v} ^ Math.imul(${i}+1, ${mul})) >>> 0; ${v} = (${v} + (${v}<<3))>>>0; while (${mul} < ${mask} + ${v}) { ${v}+=${mul} } } return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(2, 10);
        return `(function(){var ${v}=1; var ${i}=0; var ${L}=Math.min((__ITER__), ${randNum(10, 5000)}); while(${v}++!==${L}){ ${v} = (Math.imul(${v}, ${mul}) ^ ${i}) >>> 0; ${i} -= (${v} & ${randNum(0, 7)}); if (${i} < 0) { ${v} += ${i} } } return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const cap = randNum(10, 5000);
        return `(function(){var ${v}=${randNum(2, 20)}; var ${i}=0; var ${L}=Math.min((__ITER__), ${cap}); do{ ${v} = ((${v}<<5)-${v}) ^ ${i}; ${i}++; if (${i} > ${cap}) { ${v}=Math.floor(${v} - 10.2); } else for (;;) {} } while(${i} < ${L}); return ${v}; })()`;
      },
      () => {
        const v = randIdent(), i = randIdent(), L = randIdent();
        const mul = randNum(3, 13), modulus = randNum(2, 10);
        return `(function(){var ${v}=0; var ${L}=Math.min((__ITER__), ${randNum(10, 5000)}); for(var ${i}=0;${i}<${L};${i}++){ ${v} += ((${i}&3)?Math.imul(${i},${mul}):${i}); ${v} = ${v} >>> 0; ${i}--; if (${v} % ${modulus} === 0) ${v}++; } return ${v}; })()`;
      }
    ];
    const pick = templates[Math.floor(Math.random() * templates.length)];
    return pick();
  }

  const patterns = [
    `if (Math.random() < Math.random() ? ${runtimeHasherName}(${fnForms[0]}) !== ${expectedVarName} : ${secondRuntimeHasherName}(${fnForms[4]}) !== ${secondExpectedVarName}) { __LOOP__; };`,
    `if (Math.random() < Math.random() ? !(${runtimeHasherName}(${fnForms[1]}) === ${expectedVarName}) : ${secondRuntimeHasherName}(${fnForms[2]}) != ${secondExpectedVarName}) { var __r = __LOOP__; };`,
    `(()=>{ if (Math.random() < Math.random() ? ${runtimeHasherName}(${fnForms[2]}) != ${expectedVarName} :  ${secondRuntimeHasherName}(${fnForms[0]}) !== ${secondExpectedVarName}) { var __z = __LOOP__; } })();`,
    `if (Math.random() < Math.random() ? ${expectedVarName} != ${runtimeHasherName}(${fnForms[4]}) : !(${secondRuntimeHasherName}(${fnForms[1]}) === ${secondExpectedVarName})) { var __x = __LOOP__; };`,
    `if (void 0 === (${runtimeHasherName}(${fnForms[0]})===${expectedVarName}?${expectedVarName}:(parseInt(${expectedVarName} + "_")["${Math.floor(Math.random() * 10000)}"]))) { var __y = __LOOP__; };;`
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const loopTpl = randomLoopTemplate();

  const iterExpr = `(((${runtimeHasherName}(${fnForms[0]}) ^ ${expectedVarName}) & 0x3ff) + 64) ** 25`;

  let loopExpr = loopTpl.replace(/__ITER__/g, iterExpr);
  let result = pattern.replace(/__LOOP__/g, loopExpr);

  const tmpName = randomName("_t");
  result = result.replace(/\b__r\b/g, tmpName + "r").replace(/\b__z\b/g, tmpName + "z").replace(/\b__x\b/g, tmpName + "x").replace(/\b__y\b/g, tmpName + "y");

  return result;
}

// ---------- parse and find top-level functions ----------
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: false });
const surfaceFunctions = [];

function digestSelfInvokers(parent) {
  for (const node of parent.body) {
    if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) digestSelfInvokers(node.expression.callee.body);

    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
      surfaceFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
    } else if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (!decl.init) continue;

        const t = decl.init.type;
        if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
          surfaceFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end });
        };
      };
    };
  };
};

for (const node of ast.body) {
  if (node.type === "ExpressionStatement" && node.expression.callee && ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type)) digestSelfInvokers(node.expression.callee.body);

  if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
    surfaceFunctions.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
  } else if (node.type === "VariableDeclaration") {
    for (const decl of node.declarations) {
      if (!decl.init) continue;

      const t = decl.init.type;
      if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
        surfaceFunctions.push({ kind: "var", varName: decl.id && decl.id.name ? decl.id.name : null, start: decl.start, end: decl.end, initStart: decl.init?.start, initEnd: decl.init?.end });
      };
    };
  };
};

surfaceFunctions.sort((a, b) => a.start - b.start);

// console.log("[FUNCTIONS]:", surfaceFunctions)

if (surfaceFunctions.length === 0) {
  console.log("No top-level functions found. Writing original file unchanged.");
  fs.writeFileSync(outputPath, code, "utf8");
  process.exit(0);
}

let offset = 0;
let cachedCode = code;

for (let hasher of hashingAlgorithms) {
  const injectedHasherSrc = hasher.hasherCode;
  code = injectedHasherSrc + "\n" + code;
  offset += injectedHasherSrc.length + 1;
};

const finalOffset = offset;
const expectedVars = [];

function pickInsertionOffset(fnCode) {
  const candidates = [];
  for (let i = 0; i < fnCode.length; i++) {
    const ch = fnCode[i];
    if (ch === "\n" || ch === "\r") {
      if (i + 1 < fnCode.length - 1) candidates.push(i + 1);
    }
  }
  if (candidates.length === 0) return null;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

for (const fn of surfaceFunctions) {
  if (fn.kind === "decl") {
    const realStart = fn.start + offset;
    const fnCode = cachedCode.slice(fn.start, fn.end);
    const firstBrace = fnCode.indexOf("{");
    const lastBrace = fnCode.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) continue;

    const expectedVarName = randomName(EXPECT_PREFIX);
    const secondExpectedVarName = randomName(EXPECT_PREFIX);

    const fnRef = fn.name;
    const [runtimeHasherName, secondRuntimeHasherName] = getHasherName();

    const checkBody = generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName });

    let insertPosRel = pickInsertionOffset(fnCode);
    if (insertPosRel === null) {
      insertPosRel = firstBrace + 1;
    }

    if (insertPosRel <= firstBrace) insertPosRel = firstBrace + 1;
    if (insertPosRel >= lastBrace) insertPosRel = lastBrace;

    const simulatedFn = (fnCode.slice(0, insertPosRel) + checkBody + fnCode.slice(insertPosRel));
    const normalized = simulatedFn.replace(/\r/g, "");

    const firstExpectedValue = buildHashFromName(normalized, runtimeHasherName);
    expectedVars.push({ varName: expectedVarName, value: firstExpectedValue });

    const secondExpectedValue = buildHashFromName(normalized, secondRuntimeHasherName);
    expectedVars.push({ varName: secondExpectedVarName, value: secondExpectedValue });

    const insertAt = realStart + insertPosRel;
    code = code.slice(0, insertAt) + checkBody + code.slice(insertAt);
    offset += checkBody.length;
  } else if (fn.kind === "var") {
    const initStart = fn.initStart + offset;
    const initEnd = fn.initEnd + offset;
    let initCode = code.slice(initStart, initEnd);
    const braceIdx = initCode.indexOf("{");
    const lastBraceIdx = initCode.lastIndexOf("}");

    const expectedVarName = randomName(EXPECT_PREFIX);
    const secondExpectedVarName = randomName(EXPECT_PREFIX);

    if (braceIdx !== -1 && lastBraceIdx !== -1 && lastBraceIdx > braceIdx) {
      if (!fn.varName) continue;
      const fnRef = fn.varName;

      const [runtimeHasherName, secondRuntimeHasherName] = getHasherName();

      const checkBody = generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName });

      let insertRel = pickInsertionOffset(initCode);
      if (insertRel === null) insertRel = braceIdx + 1;
      if (insertRel <= braceIdx) insertRel = braceIdx + 1;
      if (insertRel >= lastBraceIdx) insertRel = lastBraceIdx;

      const simulatedInit = initCode.slice(0, insertRel) + checkBody + initCode.slice(insertRel);
      const normalized = simulatedInit.replace(/\r/g, "");

      const firstExpectedValue = buildHashFromName(normalized, runtimeHasherName);
      expectedVars.push({ varName: expectedVarName, value: firstExpectedValue });

      const secondExpectedValue = buildHashFromName(normalized, secondRuntimeHasherName);
      expectedVars.push({ varName: secondExpectedVarName, value: secondExpectedValue });

      const insertAt = initStart + insertRel;
      code = code.slice(0, insertAt) + checkBody + code.slice(insertAt);
      offset += checkBody.length;
    };
  }
}

if (expectedVars.length > 0) {
  const decls = expectedVars.map(ev => `${ev.varName}=${ev.value}`).join(",");
  const varBlock = `var ${decls};\n`;

  code = code.slice(0, finalOffset) + varBlock + code.slice(finalOffset);
}

fs.writeFileSync(outputPath, code, "utf8");
console.log("Instrumented file written to:", outputPath);
