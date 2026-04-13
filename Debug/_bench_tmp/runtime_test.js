// Runtime test of the re-obfuscated code's integrity system
// This extracts the key pieces and runs them like a browser would
const fs = require('fs');
const code = fs.readFileSync('/tmp/re_obfuscated.js', 'utf-8');

console.log('Code length:', code.length);

// Check if it's wrapped in new Function
if (code.startsWith('new Function(')) {
    console.log('Code IS wrapped in new Function');
    // Extract the inner string
    const start = code.indexOf('(') + 1;
    const end = code.lastIndexOf(')');
    const jsonStr = code.slice(start, end);
    // The string is JSON-encoded
    let inner;
    try {
        inner = JSON.parse(jsonStr);
    } catch (e) {
        console.log('JSON parse failed, trying eval');
        inner = eval(jsonStr);
    }
    console.log('Inner code length:', inner.length);
    
    // Find deferred checks in inner code
    const deferredPat = /\(function\((\w+),(\w+),(\w+),(\w+),(\w+)\)\{var (\w+)=\4\(function\(\)\{try\{var (\w+)=\3\(\5\);if\(\1\(\7\)!==\((0x[0-9a-f]+)\)\|\|\2\(\7\)!==\((0x[0-9a-f]+)\)\)/g;
    let m;
    let deferredChecks = [];
    while ((m = deferredPat.exec(inner)) !== null) {
        deferredChecks.push({
            pos: m.index,
            h1Param: m[1],
            h2Param: m[2],
            vfParam: m[3],
            stParam: m[4],
            frParam: m[5],
            tmrVar: m[6],
            svVar: m[7],
            expectedH1: m[8],
            expectedH2: m[9],
        });
    }
    console.log(`\nFound ${deferredChecks.length} deferred checks (strict regex)`);
    
    // Looser pattern
    const loosePat = /\(function\(\w+,\w+,\w+,\w+,\w+\)\{var \w+=\w+\(function\(\)\{try\{/g;
    let looseCount = 0;
    while (loosePat.exec(inner) !== null) looseCount++;
    console.log(`Found ${looseCount} deferred checks (loose regex)`);
    
    // Find hash function definitions
    const hashFnPat = /function (\w+)\(\w+\)\{\w+=\(\w+\|\|""\)\.replace\(\/\\r\/g,""\);var/g;
    let hashFns = [];
    while ((m = hashFnPat.exec(inner)) !== null) {
        hashFns.push({ name: m[1], pos: m.index });
    }
    console.log(`\nHash functions: ${hashFns.map(h => h.name).join(', ')}`);
    
    // Find the IIFE closings with hash function names
    if (hashFns.length >= 2) {
        const h1 = hashFns[0].name;
        const h2 = hashFns[1].name;
        console.log(`Hash function 1: ${h1}`);
        console.log(`Hash function 2: ${h2}`);
        
        // Find all deferred IIFEs that close with (h1,h2,...)
        const closeRe = new RegExp(`\\}\\)\\(${h1},${h2},(\\w+),(\\w+),(\\w+)\\)`, 'g');
        let closes = [];
        while ((m = closeRe.exec(inner)) !== null) {
            closes.push({
                pos: m.index,
                vfArg: m[1],
                stArg: m[2],
                fnArg: m[3],
            });
        }
        console.log(`\nIIFE closings with (${h1},${h2},...): ${closes.length}`);
        for (const c of closes) {
            console.log(`  At pos ${c.pos}: vf=${c.vfArg}, st=${c.stArg}, fn=${c.fnArg}`);
        }
        
        // For each deferred check, find the target function and verify hashes
        // We need to also extract the hash function source code
        console.log('\n=== Extracting hash functions and testing ===');
        
        // Find the anti-tamper toString function
        const tosPat = /function (\w+)\(\w+\)\{if\(Function\.prototype\.toString!==/;
        const tosMatch = tosPat.exec(inner);
        const tosName = tosMatch ? tosMatch[1] : 'unknown';
        console.log(`Anti-tamper function: ${tosName}`);
        
        // Find the setTimeout ref
        const stPat = /var (\w+)=typeof setTimeout!=="undefined"\?setTimeout:void 0/;
        const stMatch = stPat.exec(inner);
        const stRefName = stMatch ? stMatch[1] : 'unknown';
        console.log(`setTimeout ref: ${stRefName}`);
        
        // For each IIFE closing, extract the checked function and hash expectations
        for (const close of closes) {
            console.log(`\n--- Checking function: ${close.fnArg} ---`);
            
            // Find the deferred IIFE opening that ends at this closing
            // The IIFE contains hash expectations
            const searchStart = Math.max(0, close.pos - 500);
            const iife = inner.slice(searchStart, close.pos + 100);
            
            // Extract expected hashes
            const hashExpected = iife.match(/!==\((0x[0-9a-f]+)\)\|\|\w+\(\w+\)!==\((0x[0-9a-f]+)\)/);
            if (hashExpected) {
                console.log(`  Expected h1: ${hashExpected[1]}`);
                console.log(`  Expected h2: ${hashExpected[2]}`);
            }
            
            // Find the function definition using acorn
            const acorn = require('acorn');
            const ast = acorn.parse(inner, { ecmaVersion: 'latest', sourceType: 'script', locations: false });
            
            // Look for function in the AST
            function findFunctions(parent) {
                const fns = [];
                for (const node of parent.body) {
                    if (node.type === "ExpressionStatement" && node.expression.callee && 
                        ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type))
                        fns.push(...findFunctions(node.expression.callee.body));
                    if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && 
                        node.expression.argument?.type === "CallExpression" && node.expression.argument.callee)
                        fns.push(...findFunctions(node.expression.argument.callee.body));
                    if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
                        fns.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
                    } else if (node.type === "VariableDeclaration") {
                        for (const decl of node.declarations) {
                            if (!decl.init) continue;
                            const t = decl.init.type;
                            if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
                                fns.push({
                                    kind: "var", varName: decl.id?.name, start: decl.start, end: decl.end,
                                    initStart: decl.init?.start, initEnd: decl.init?.end
                                });
                            }
                        }
                    }
                }
                return fns;
            }
            
            let allFns = [];
            for (const node of ast.body) {
                if (node.type === "ExpressionStatement" && node.expression.callee && 
                    ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.expression.callee.type))
                    allFns.push(...findFunctions(node.expression.callee.body));
                if (node.type === "ExpressionStatement" && node.expression && "UnaryExpression" === node.expression.type && 
                    node.expression.argument?.type === "CallExpression" && node.expression.argument.callee)
                    allFns.push(...findFunctions(node.expression.argument.callee.body));
                if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
                    allFns.push({ kind: "decl", name: node.id.name, start: node.start, end: node.end });
                } else if (node.type === "VariableDeclaration") {
                    for (const decl of node.declarations) {
                        if (!decl.init) continue;
                        const t = decl.init.type;
                        if (t === "FunctionExpression" || t === "ArrowFunctionExpression" || t === "FunctionDeclaration") {
                            allFns.push({
                                kind: "var", varName: decl.id?.name, start: decl.start, end: decl.end,
                                initStart: decl.init?.start, initEnd: decl.init?.end
                            });
                        }
                    }
                }
            }
            
            const fnDef = allFns.find(f => (f.kind === "decl" ? f.name : f.varName) === close.fnArg);
            if (!fnDef) {
                console.log(`  FUNCTION NOT FOUND IN AST!`);
                continue;
            }
            
            const fnSrc = inner.slice(fnDef.kind === "var" ? fnDef.initStart : fnDef.start, fnDef.kind === "var" ? fnDef.initEnd : fnDef.end);
            console.log(`  Function source length: ${fnSrc.length}`);
            console.log(`  First 80: ${fnSrc.slice(0, 80)}`);
            
            // Now compute the RUNTIME hash using eval
            // Extract just the hash functions and compute
            console.log('  Computing runtime hashes...');
            break; // Only do this once to avoid long computation
        }
    }
    
    // Now the KEY test: run the inner code with setTimeout interception
    console.log('\n=== Running inner code with setTimeout interception ===');
    console.log('(This tests the deferred checks at runtime)');
    
    // We'll run the code but intercept setTimeout and check if the callbacks freeze
    // First, set up a mock environment
    const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
    
    if (isMainThread) {
        // Extract just the integrity preamble and enough code to test deferred checks
        // This is everything up to and including the first deferred check target
        
        // For a simpler test: evaluate the hash functions, toString guard, and 
        // manually test each deferred check
        
        // Find everything from start to first hash function
        if (hashFns.length >= 2) {
            const h1Name = hashFns[0].name;
            const h2Name = hashFns[1].name;
            
            // Find the guard code start
            const guardStart = inner.indexOf('var ');  // Starts with "var KI=..."
            
            // Find the end of hash function definitions (after hw/h2)
            const h2Fn = hashFns[1];
            // Find end of h2 function
            let braceCount = 0;
            let h2End = -1;
            let started = false;
            for (let i = h2Fn.pos; i < inner.length; i++) {
                if (inner[i] === '{') { braceCount++; started = true; }
                if (inner[i] === '}') { braceCount--; }
                if (started && braceCount === 0) { h2End = i + 1; break; }
            }
            
            console.log(`\nHash function 2 ends at pos ${h2End}`);
            
            // Extract just the preamble (guard + hash functions)
            const preamble = inner.slice(guardStart, h2End);
            console.log(`Preamble length: ${preamble.length}`);
            console.log(`First 200: ${preamble.slice(0, 200)}`);
        }
    }
    
} else {
    console.log('Code is NOT wrapped in new Function');
    console.log('First 100 chars:', code.slice(0, 100));
}
