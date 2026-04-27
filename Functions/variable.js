const { updateNodeName } = require("../Utils/naming");
const { recursiveCaller } = require("../Utils/recursive");

function encodeVariable(node, setDeclarationMapping) {
    const callerNode = node.init;
    if (callerNode.type === "CallExpression" && callerNode.callee.type === "Identifier" && callerNode.callee.name === "require" && callerNode.arguments.length > 0) {
        if (node.id.type === 'Identifier') setDeclarationMapping(node.id.name, node.id.name);
        for (let i = 0; i < callerNode.arguments.length; i++) if (callerNode.arguments[i].type === "Literal") setDeclarationMapping(callerNode.arguments[i].value, callerNode.arguments[i].value);
    } else {
        if (node.id.type === 'Identifier') updateNodeName(node.id, true);
        if (node?.init?.type === "Identifier") updateNodeName(node.init);
        recursiveCaller(node.init)
    };

    if (node.init) node.init.obfuscated = true;
}

module.exports = { encodeVariable };