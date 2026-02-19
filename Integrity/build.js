const acorn = require("acorn");
const { generateObfuscatedName } = require("../Utils/nameGenerator");
const { encodeStringsRandom } = require("../Primitives/Literals/strings");

const { toJSFuck } = require('../Primitives/Integers/jsfuck');
const { toHex } = require('../Primitives/Integers/hexadecimal');
const { toOctal } = require('../Primitives/Integers/octal');
const { toBinary } = require('../Primitives/Integers/binary');
const { toRefractal } = require('../Primitives/Integers/refractal');
const { pickWeightedRandom } = require('../Utils/weights');

const config = require('../Settings/config');
const { compress } = require("../Utils/compressor");
let numberCache = {};

function createIntegrity(code, previousDeclarationMapping, declarationMapping, encodingAndDecodingPairs, encodeModule) {

  function encodeLocalNumber(number, isAllowCalculator = false) {
    if (isAllowCalculator && config.numberCalculator && Math.abs(number) <= 4099000000 && number > 100) {
      if (!numberCache[number]) {
        const isNegative = number < 0;
        const encodedValue = encodeModule.encode(number);
        let res = `${isNegative ? "-" : ""}${encodingAndDecodingPairs.decodeName}(${encodedValue})`;
        numberCache[number] = res;
        return res;
      } else {
        return numberCache[number];
      };
    } else if (config.globalBaseIntegerConcealment) {
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
    } else if (config.numberEncoding) {
      let percentageBasedConfig = config.integerPrecentage;
      if (number <= 10) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

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
      mul: rand32() | 1,
      shift1: randShift(),
      shift2: randShift(),
      shift3: randShift(),
      shift4: randShift(),
    };

    const fnXor = generateObfuscatedName();
    const fnMix = generateObfuscatedName();
    const fnMain = generateObfuscatedName();

    const a = generateObfuscatedName();
    const b = generateObfuscatedName();
    const c = generateObfuscatedName();
    const x = generateObfuscatedName();
    const i = generateObfuscatedName();
    const ch = generateObfuscatedName();

    const hasherCode = `function ${fnXor}(${a}, ${b}) {
  return (${a} ^ ${b}) >>> 0;
}
function ${fnMix}(${x}) {
  let ${a} = (${x} ^ (${x} >>> ${consts.shift4})) >>> 0;
  return Math.imul(${a}, ${consts.mul}) >>> 0;
}
function ${fnMain}(${x}) {
  ${x} = (${x} || "").replace(/\\r/g, "");
  ${x} = (${x} || "").replace(/\\n/g, "");
  var ${a} = ${consts.seed1} >>> ${encodeLocalNumber(0)}, ${b} = ${consts.seed2} >>> ${encodeLocalNumber(0)}, ${c} = ${encodeLocalNumber(0)} >>> ${encodeLocalNumber(0)};
  for (var ${i} = ${encodeLocalNumber(0)}; ${i} < ${x}.length; ${i}++) {
    var ${ch} = ${x}.charCodeAt(${i});
    ${a} = (${a} ^ ${ch}) + ((${a} << ${consts.shift1}) + (${a} >>> ${consts.shift2})); ${a} >>>= ${encodeLocalNumber(0)};
    ${b} = (${b} + (${ch} ^ (${b} << ${consts.shift3}))) >>> ${encodeLocalNumber(0)};
    ${c} = (${c} + ((${ch} * ${consts.const1}) ^ (${a} >>> (${i} & ${encodeLocalNumber(15)})))) >>> ${encodeLocalNumber(0)};
    ${a} = (${a} + ((${b} << ${encodeLocalNumber(13)}) | (${b} >>> ${encodeLocalNumber(19)}))) >>> ${encodeLocalNumber(0)};
    ${b} = (${b} ^ ((${a} >>> ${encodeLocalNumber(7)}) + ${consts.const2})) >>> ${encodeLocalNumber(0)};
  }
  var ${ch} = ${fnXor}(${a}, (${b} + ${c}));
  for (var ${i} = ${encodeLocalNumber(0)}; ${i} < ${encodeLocalNumber(3)}; ${i}++) {
    ${ch} = ${fnXor}((${ch} ^ (${ch} << ${encodeLocalNumber(13)})) + ${consts.const3}, ${encodeLocalNumber(0)});
    ${ch} = ${fnMix}(${ch});
  }
  return ${ch} >>> ${encodeLocalNumber(0)};
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
    const { hasherCode, buildHash, runtimeHasherName } = generateRandomHasher();
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

  // ---------- Randomized check snippet generator with bounded opaque loops ----------
  function generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName }) {
    let fnForms = [
      `${fnRef}[${encodeStringsRandom("toString").raw}]()`,
      `(${fnRef} + "")`,
      `${declarationMapping.get("window")}[${encodeStringsRandom("String").raw}](${fnRef})`,
      `${fnRef}[${encodeStringsRandom("toString").raw}]()`,
      `(0, ${fnRef})[${encodeStringsRandom("toString").raw}]()`,
      '`${' + fnRef + '}`'
    ];

    function randomLoopTemplate() {
      const randNum = (min, max) => encodeLocalNumber(Math.floor(Math.random() * (max - min + 1)) + min, true);

      let mathMin = `${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("min").raw}]`;
      let mathImul = `${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("imul").raw}]`;
      let mathFloor = `${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("floor").raw}]`;

      const templates = [
        () => {
          const v = generateObfuscatedName(), i = generateObfuscatedName(), L = generateObfuscatedName();
          const mul = randNum(100000, 999999);
          const mask = randNum(1, 16);
          return `(function(){var ${v}=${encodeLocalNumber(0, true)}|${encodeLocalNumber(0, true)}; for(var ${i}=${encodeLocalNumber(0, true)}, ${L}=${mathMin}((__ITER__), ${randNum(10, 10000)}); ${i}<${L}; ${i}++){ ${v} = (${v} ^ ${mathImul}(${i}+1, ${mul})) >>> ${encodeLocalNumber(0, true)}; ${v} = (${v} + (${v}<<3))>>>${encodeLocalNumber(0, true)}; while (${mul} < ${mask} + ${v}) { ${v}+=${mul} } } return ${v}; })()`;
        },
        () => {
          const v = generateObfuscatedName(), i = generateObfuscatedName(), L = generateObfuscatedName();
          const mul = randNum(2, 10);
          return `(function(){var ${v}=1; var ${i}=${encodeLocalNumber(0, true)}; var ${L}=${mathMin}((__ITER__), ${randNum(10, 5000)}); while(${v}++!==${L}){ ${v} = (${mathImul}(${v}, ${mul}) ^ ${i}) >>> ${encodeLocalNumber(0, true)}; ${i} -= (${v} & ${randNum(0, 7)}); if (${i} < ${encodeLocalNumber(0, true)}) { ${v} += ${i} } } return ${v}; })()`;
        },
        () => {
          const v = generateObfuscatedName(), i = generateObfuscatedName(), L = generateObfuscatedName();
          const cap = randNum(10, 5000);
          return `(function(){var ${v}=${randNum(2, 20)}; var ${i}=${encodeLocalNumber(0, true)}; var ${L}=${mathMin}((__ITER__), ${cap}); do{ ${v} = ((${v}<<5)-${v}) ^ ${i}; ${i}++; if (${i} > ${cap}) { ${v}=${mathFloor}(${v} - 10.2); } else for (;;) {} } while(${i} < ${L}); return ${v}; })()`;
        },
        () => {
          const v = generateObfuscatedName(), i = generateObfuscatedName(), L = generateObfuscatedName();
          const mul = randNum(3, 13), modulus = randNum(2, 10);
          return `(function(){var ${v}=${encodeLocalNumber(0, true)}; var ${L}=${mathMin}((__ITER__), ${randNum(10, 5000)}); for(var ${i}=${encodeLocalNumber(0, true)};${i}<${L};${i}++){ ${v} += ((${i}&3)?${mathImul}(${i},${mul}):${i}); ${v} = ${v} >>> ${encodeLocalNumber(0, true)}; ${i}--; if (${v} % ${modulus} === ${encodeLocalNumber(0, true)}) ${v}++; } return ${v}; })()`;
        }
      ];
      const pick = templates[Math.floor(Math.random() * templates.length)];
      return pick();
    }

    let patterns = [
      `if (${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() < ${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() ? ${runtimeHasherName}(${fnForms[0]}) !== ${expectedVarName} : ${secondRuntimeHasherName}(${fnForms[4]}) !== ${secondExpectedVarName}) { let __r = __LOOP__; __LOGIC__; };`,
      `if (${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() < ${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() ? !(${runtimeHasherName}(${fnForms[1]}) === ${expectedVarName}) : ${secondRuntimeHasherName}(${fnForms[2]}) != ${secondExpectedVarName}) { let __r = __LOOP__; __LOGIC__; };`,
      `(()=>{ if (${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() < ${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() ? ${runtimeHasherName}(${fnForms[2]}) != ${expectedVarName} :  ${secondRuntimeHasherName}(${fnForms[0]}) !== ${secondExpectedVarName}) { let __z = __LOOP__; __LOGIC__; } })();`,
      `if (${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() < ${declarationMapping.get("window")}[${encodeStringsRandom("Math").raw}][${encodeStringsRandom("random").raw}]() ? ${expectedVarName} != ${runtimeHasherName}(${fnForms[4]}) : !(${secondRuntimeHasherName}(${fnForms[1]}) === ${secondExpectedVarName})) { let __x = __LOOP__; __LOGIC__; };`,
      `if (${previousDeclarationMapping.get("null")} === (${runtimeHasherName}(${fnForms[0]}) === ${expectedVarName} ? ${expectedVarName} : (${declarationMapping.get("window")}[${encodeStringsRandom("parseInt").raw}](${expectedVarName} + "_")[${encodeLocalNumber(Math.floor(Math.random() * 10000), true)}]))) { let __y = __LOOP__; __LOGIC__; };`
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const loopTpl = randomLoopTemplate();

    const iterExpr = `(((${runtimeHasherName}(${fnForms[0]}) ^ ${expectedVarName}) & ${encodeLocalNumber(Math.floor(Math.random() * 10), true)}) + ${encodeLocalNumber(Math.floor(Math.random() * 10), true)}) ** ${encodeLocalNumber(Math.floor(Math.random() * 10), true)}`;

    let loopExpr = loopTpl.replace(/__ITER__/g, iterExpr);
    let result = (config.compression ? "" : "\n") + pattern.replace(/__LOOP__/g, loopExpr);

    const tmpName = generateObfuscatedName();
    result = result.replace(/\b__r\b/g, tmpName).replace(/\b__z\b/g, tmpName).replace(/\b__x\b/g, tmpName).replace(/\b__y\b/g, tmpName);

    result = result.replace(/__LOGIC__/g, `return [${tmpName}, ${tmpName} << ${encodeLocalNumber(Math.floor(Math.random() * 10), true)}, "${Math.floor(Math.random() * 1000000)}"]`);

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

    if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && node.expression.argument?.type === "CallExpression" && node.expression.argument.callee) digestSelfInvokers(node.expression.argument.callee.body);

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
    //console.log("No top-level functions found. Writing original file unchanged.");
    return code;
  };

  let offset = 0;
  let cachedCode = code;

  const finalOffset = offset;
  const expectedVars = [];

  for (const fn of surfaceFunctions) {
    if (fn.kind === "decl") {
      const isApartOfMathFunctions = (encodingAndDecodingPairs?.decodeMainFunctionNames.includes(fn.name) || encodingAndDecodingPairs?.decoderFunctionNames.includes(fn.name));
      if (isApartOfMathFunctions) continue;

      const realStart = fn.start + offset;
      const fnCode = cachedCode.slice(fn.start, fn.end);
      const firstBrace = fnCode.indexOf("{");
      const lastBrace = fnCode.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace || fnCode[firstBrace - 1] === "(") { fn.dontTouch = true; continue; };

      const expectedVarName = generateObfuscatedName();
      const secondExpectedVarName = generateObfuscatedName();

      const fnRef = fn.name;
      const [runtimeHasherName, secondRuntimeHasherName] = getHasherName();

      const checkBody = generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName });

      let insertPosRel = firstBrace + 1;

      if (insertPosRel >= lastBrace) insertPosRel = lastBrace;

      const simulatedFn = (fnCode.slice(0, insertPosRel) + checkBody + fnCode.slice(insertPosRel));
      if (simulatedFn.includes("async")) {
        continue;
      };

      const normalized = simulatedFn.replace(/\r/g, "");

      const firstExpectedValue = buildHashFromName(normalized, runtimeHasherName);
      expectedVars.push({ varName: expectedVarName, value: firstExpectedValue });

      const secondExpectedValue = buildHashFromName(normalized, secondRuntimeHasherName);
      expectedVars.push({ varName: secondExpectedVarName, value: secondExpectedValue });

      const insertAt = realStart + insertPosRel;
      code = code.slice(0, insertAt) + checkBody + code.slice(insertAt);
      offset += checkBody.length;
    } else if (fn.kind === "var") {
      const isApartOfMathFunctions = (encodingAndDecodingPairs?.decodeMainFunctionNames.includes(fn.varName) || encodingAndDecodingPairs?.decoderFunctionNames.includes(fn.varName));
      if (isApartOfMathFunctions) continue;

      const initStart = fn.initStart + offset;
      const initEnd = fn.initEnd + offset;
      let initCode = code.slice(initStart, initEnd);
      const braceIdx = initCode.indexOf("{");
      const lastBraceIdx = initCode.lastIndexOf("}");

      const expectedVarName = generateObfuscatedName();
      const secondExpectedVarName = generateObfuscatedName();

      if (braceIdx !== -1 && lastBraceIdx !== -1 && lastBraceIdx > braceIdx) {
        if (!fn.varName) continue;
        const fnRef = fn.varName;

        const [runtimeHasherName, secondRuntimeHasherName] = getHasherName();

        const checkBody = generateCheckSnippet({ fnRef, expectedVarName, secondExpectedVarName, runtimeHasherName, secondRuntimeHasherName });

        let insertRel = braceIdx + 1;
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

  function parseArguments(code, _i) {
    let count = -1;
    let newCode = "";

    for (let i = _i; i < code.length; i++) {
      let char = code[i];

      newCode += char;
      if (char === "(") { if (count === -1) { count = 0 }; count++ };
      if (char === ")") { count-- };
      if (count === 0) {
        return newCode;
      };
    };
  }

  function parseFunction(code) {
    let count = -1;
    let newCode = "";
    for (let i = 0; i < code.length; i++) {
      let char = code[i];

      newCode += char;
      if (char === "{") { if (count === -1) { count = 0 }; count++ };
      if (char === "}") { count-- };
      if (count === 0) {
        if (code[i + 1] == "(") { let args =  parseArguments(code, i); newCode += args; console.log(args) };
        return newCode;
      };
    };
  };

  const validFunctions = surfaceFunctions.filter(
    f => f.kind === "decl" && !f.dontTouch
  );

  for (let hasher of hashingAlgorithms) {
    const injectedHasherSrc = compress(hasher.hasherCode);

    if (!validFunctions.length) {
      code = injectedHasherSrc + (config.compression ? "" : "\n") + code;
      continue;
    }

    const functionUsed = validFunctions[Math.floor(Math.random() * validFunctions.length)];

    let fnSrc = null;

    if (code.includes(`async function ${functionUsed.name}`)) {
      fnSrc = "async function " + functionUsed.name +
        parseFunction(code.split(`function ${functionUsed.name}`)[1]);
    } else if (code.includes(`function ${functionUsed.name}`)) {
      fnSrc = "function " + functionUsed.name +
        parseFunction(code.split(`function ${functionUsed.name}`)[1]);
    } else if (code.includes(`async function* ${functionUsed.name}`)) {
      fnSrc = "async function* " + functionUsed.name +
        parseFunction(code.split(`function ${functionUsed.name}`)[1]);
    } else if (code.includes(`function* ${functionUsed.name}`)) {
      fnSrc = "function* " + functionUsed.name +
        parseFunction(code.split(`function* ${functionUsed.name}`)[1]);
    }

    if (!fnSrc) {
      code = injectedHasherSrc + (config.compression ? "" : "\n") + code;
      continue;
    }

    code = code.split(fnSrc)[0] + (Math.random() < 0.5 ? injectedHasherSrc + (config.compression ? "" : "\n") + fnSrc : fnSrc + (config.compression ? "" : "\n") + injectedHasherSrc) + code.split(fnSrc)[1];
  };

  let codeLines = code.split("\n");

  const functionDeclRegex = /^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/;

  for (let fn of validFunctions) {
    fn.createdIndex = -1;
    fn.calledIndex = -1;

    const callRegex = new RegExp(`\\b${fn.name}\\s*\\(`);

    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[i];

      if (fn.createdIndex === -1 && functionDeclRegex.test(line)) {
        const name = line.match(functionDeclRegex)?.[1];
        if (name === fn.name) {
          fn.createdIndex = i;
          continue;
        }
      }

      if (functionDeclRegex.test(line)) continue;

      if (/^\s*\/\//.test(line)) continue;

      if (fn.calledIndex === -1 && callRegex.test(line)) {
        fn.calledIndex = i;
        break;
      }
    }
  }

  let __CachedCode__ = code;

  for (let Var of expectedVars) {
    let VarIndex = codeLines.indexOf(codeLines.find(line => (line.includes(`= ${Var.varName} `) || line.includes(`= ${Var.varName})`) || line.includes(` ${Var.varName} !=`))));

    if (VarIndex === -1) continue;

    let err = false;
    let codeLine = codeLines[VarIndex - 1];
    let functionName
    try {
      functionName = codeLine.includes("=>") ? codeLine.split("=")[0].split(" ")[1] : codeLine.split("function ")[1].split("(")[0];
    } catch (e) {
      err = true;
    };

    let functionUsed = validFunctions.find(r => r.name === functionName);
    if (!functionUsed || functionUsed.calledIndex === -1 || err) {
      __CachedCode__ = `let ${Var.varName} = ${Var.value};${config.compression ? "" : "\n"}` + __CachedCode__;
      continue;
    };

    const proximityCandidates = validFunctions.filter(f =>
      f.createdIndex !== -1 &&
      f.createdIndex < functionUsed.calledIndex
    );

    let proximityFunction = proximityCandidates.length
      ? proximityCandidates[Math.floor(Math.random() * proximityCandidates.length)]
      : null;

    if (!proximityFunction) __CachedCode__ = `let ${Var.varName} = ${Var.value};${config.compression ? "" : "\n"}` + __CachedCode__;
    else __CachedCode__ = __CachedCode__.replace(codeLines[proximityFunction.createdIndex], `let ${Var.varName} = ${Var.value};${config.compression ? "" : "\n"}${codeLines[proximityFunction.createdIndex]}`)
  };

  return __CachedCode__;
};

module.exports = { createIntegrity };