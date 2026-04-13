const config = require('../Settings/config');
const { generateObfuscatedName } = require('./nameGenerator');
const { windowVariables, defaultedValues, ignoreVariables, newDeclarationVariables } = require('./Window/window_variables');

let declarationMapping = new Map();
let sourceCode;

function isAlreadyObfuscated(name) { return Array.from(declarationMapping.values()).includes(name) };

let blacklistLines = {};

function updateNodeName(node, isBeingDefined) {
    if (!node || node.obfuscated || ignoreVariables.includes(node.name)) return;

    if (config.concealGlobalObjects &&
        node.type === "Identifier" &&
        windowVariables.includes(node.name) &&
        !defaultedValues.includes(node.name) &&
        !ignoreVariables.includes(node.name) &&
        !node.computed
    ) {
        if (isBeingDefined) blacklistLines[node.name] = true;

        let isValidWindow = true;
        if (newDeclarationVariables.includes(node.name)) if (sourceCode.slice(node.start - 4, node.start - 1) !== "new") isValidWindow = false;

        if (!blacklistLines[node.name] && isValidWindow) {
            node.computed = true;
            node.optional = false;
            node.type = "MemberExpression";

            node.object = {
                name: declarationMapping.get("window"),
                type: "Identifier",
                computed: true
            };

            node.property = {
                value: node.name,
                raw: `"${node.name}"`,
                type: "Literal",
            };

            return node;
        };

        if (isAlreadyObfuscated(node.name)) return;
    };

    if (Object.keys(node).length === 3 && node.type === "Identifier" || node.obfuscated) return;
    node.obfuscated = true;

    if (!declarationMapping.has(node.name)) {
        const name = generateObfuscatedName();
        declarationMapping.set(node.name, name); 
        node.name = name;
    } else node.name = declarationMapping.get(node.name);
};

function clearDeclarationMapping(code) { declarationMapping = new Map(); sourceCode = code; blacklistLines = {}; };
function setDeclarationMapping(cacheName, newName) { declarationMapping.set(cacheName, newName); };
function getDeclarationMapping() { return declarationMapping };

module.exports = { isAlreadyObfuscated, updateNodeName, declarationMapping, clearDeclarationMapping, setDeclarationMapping, getDeclarationMapping };