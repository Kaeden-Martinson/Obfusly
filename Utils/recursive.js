const { isAlreadyObfuscated, updateNodeName } = require("./naming");

function recursiveCaller(node) {
    if (!node) return;

    if (node.right) {
        let newNode = node.right;
        if (newNode?.type  === "Identifier") updateNodeName(newNode);
        if (newNode?.left?.type === "Identifier") {
            updateNodeName(newNode.left);
            recursiveCaller(newNode);
        };
        if (newNode?.right?.type === "Identifier") {
            updateNodeName(newNode.right);
            recursiveCaller(newNode);
        };
    };

    if (node.left) {
        let newNode = node.left;
        if (newNode?.type === "Identifier") updateNodeName(newNode);
        if (newNode?.left?.type === "Identifier") {
            updateNodeName(newNode.left);
            recursiveCaller(newNode);
        };
        if (newNode?.right?.type === "Identifier") {
            updateNodeName(newNode.right);
            recursiveCaller(newNode);
        };
    };
};

module.exports = { recursiveCaller };