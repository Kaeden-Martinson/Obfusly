const config = require('../Settings/config');

const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

/** Import Utils */
const { windowVariables, defaultedValues } = require('../Utils/Window/window_variables');

/** Import Obfuscation Methods */
let { updateNodeName, clearDeclarationMapping, setDeclarationMapping, getDeclarationMapping } = require('../Utils/naming');
const { objectPropertyRecursive } = require('../Functions/property');
const { encodeVariable } = require('../Functions/variable');
const { encodeFunction } = require('../Functions/function');
const { encodeExtra, encodeRecursiveExtra } = require('../Functions/extra');
const { generateObfuscatedName, clearOldNames } = require('../Utils/nameGenerator');

function _log(msg) { console.log(`[step ${++global.__jsscramble_step}] ${msg}`); }
function _stat(label, value) { console.log(`  ${label}: ${value}`); }

function obfuscateEntireSource(code) {
    const _t0 = Date.now();
    global.__jsscramble_start = _t0;

    global.__jsscramble_step = 0;
    console.log();
    console.log('JsScramble Obfuscation');
    _stat('Naming style', config.nameGenerationStyle);
    _stat('Mode', config.strictMode ? 'Strict Mode' : 'Non-Strict (Function wrapper)');
    _log('Renaming identifiers and variables');
    clearOldNames();
    
    const windowName = generateObfuscatedName();

    const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'module' });

    clearDeclarationMapping(code);
    for (let name of windowVariables) setDeclarationMapping(name, (config.concealPrimitives && defaultedValues.includes(name) ? generateObfuscatedName() : name));
    if (config.concealGlobalObjects) setDeclarationMapping("window", windowName);
    if (config.numberCalculator) {
        const decoderName = generateObfuscatedName();
        setDeclarationMapping("decodeFunctionName", decoderName);
    };
    if (config.stringEncoding) {
        const stringAccessorName = generateObfuscatedName();
        setDeclarationMapping("stringAccessor", stringAccessorName);
    };

    estraverse.replace(ast, {
        enter(node) {
            // console.log(node)

            if (node.type === "ImportDefaultSpecifier") if (node.local && node.local.type === "Identifier") setDeclarationMapping(node.local.name, node.local.name);
            if (node.type === "ImportSpecifier") if (node.local && node.local.type === "Identifier") setDeclarationMapping(node.local.name, node.local.name);
            if (node.type === "ExportSpecifier") if (node.local && node.local.type === "Identifier") updateNodeName(node.local);
            if (node.type === 'VariableDeclarator') encodeVariable(node, setDeclarationMapping);
            if (node.type === 'FunctionDeclaration' || node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") encodeFunction(node);
            if (node.type === "CallExpression" && node.callee) {  updateNodeName(node.callee); for (let i = 0; i < node.arguments.length; i++) updateNodeName(node.arguments[i]); };
            if (node.type === "ExpressionStatement" && node.expression && node.expression.callee) updateNodeName(node.expression.callee);
            if (node.type === "ObjectExpression") objectPropertyRecursive(node);
            if (node.type === "MemberExpression" && !node.computed) { if (node.object && node.object.type === "Identifier") updateNodeName(node.object); } else if (node.type === "MemberExpression") { if (node.object && node.object.type === "Identifier") updateNodeName(node.object); if (node.property) updateNodeName(node.property); };
            if ((node.type === "ClassExpression" || node.type === "ClassDeclaration") && node.id && node.id.type === "Identifier") { updateNodeName(node.id); if (node.superClass && node.superClass.type === "Identifier") updateNodeName(node.superClass) };
            if ((node.type === "UpdateExpression" || node.type === "ReturnStatement" || node.type === "UnaryExpression" || node.type === "SpreadElement" || node.type === "RestElement") && node.argument && node.argument.type === "Identifier") encodeExtra(node);
            if (node.type === "ConditionalExpression" && node.test) { if (node.test.type === "Identifier") updateNodeName(node.test); if (node.consequent.type === "Identifier") updateNodeName(node.consequent); if (node.alternate && node.alternate.type === "Identifier") updateNodeName(node.alternate); };
            if (node.type === "SequenceExpression" && node.expressions) { for (let i = 0; i < node.expressions.length; i++) { let expression = node.expressions[i]; if (expression.type === "Identifier") updateNodeName(expression); }; };
            if (node.type === "IfStatement" && node?.test.type === "Identifier") updateNodeName(node.test);
            if (node.type === "CatchClause" && node.param) updateNodeName(node.param, true);
            if (node.type === "NewExpression") { if (node.callee) updateNodeName(node.callee); for (let i = 0; i < node.arguments.length; i++) updateNodeName(node.arguments[i]); };
            if (node.type === "AssignmentExpression" && node.left) updateNodeName(node.left);
            if (node.type === "LogicalExpression" || node.type === "ForInStatement" || node.type === "AssignmentPattern" || node.type === "ForOfStatement" || node.type === "BinaryExpression" || node.type === "AssignmentExpression") encodeRecursiveExtra(node);
            if (node.type === "ObjectPattern") { for (let i = 0; i < node.properties.length; i++) { let property = node.properties[i]; property.shorthand = false; property.computed = true; property.key.name = `'${property.key.name}'`; updateNodeName(property.value, true); }; };
            if (node.type === "SwitchStatement") updateNodeName(node.discriminant);
            if (node.type === "SwitchCase" && node.test) updateNodeName(node.test);
            if (node.type === "ArrayPattern" || node.type === "ArrayExpression") for (let i = 0; i < node.elements.length; i++) updateNodeName(node.elements[i]);
            if (node.type === "TemplateLiteral") for (let i = 0; i < node.expressions.length; i++) updateNodeName(node.expressions[i]);
            if (node.type === "MethodDefinition" && node.key && node.key.type === "Identifier" && node.key.name !== "constructor") node.key.name = `['${node.key.name}']`;
            if (node.type === "ForStatement" && node.test) { if (node.test.type === "Identifier") updateNodeName(node.test); };
        }
    });

    const s1code = escodegen.generate(ast);
    _log(`Stage 1 complete (${(Date.now() - _t0)}ms)`);

    console.log(s1code)
    return [s1code, windowName, getDeclarationMapping()];
};

module.exports = { obfuscateEntireSource };