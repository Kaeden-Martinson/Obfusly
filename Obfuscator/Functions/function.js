const { updateNodeName } = require("../Utils/naming");

function encodeFunction(node) {
    if (node.type === 'FunctionDeclaration' && node.id) updateNodeName(node.id, true)
    for (let i = 0; i < node.params.length; i++) updateNodeName(node.params[i], true);
}

module.exports = { encodeFunction };