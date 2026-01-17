const { updateNodeName } = require("../Utils/naming");
const { recursiveCaller } = require("../Utils/recursive");

function encodeVariable(node) {
    if (node.id.type === 'Identifier') updateNodeName(node.id, true);
    if (node?.init?.type === "Identifier") updateNodeName(node.init);
    recursiveCaller(node.init)

    if (node.init) node.init.obfuscated = true;
}

module.exports = { encodeVariable };