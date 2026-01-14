const { updateNodeName } = require("../Utils/naming");
const { recursiveCaller } = require("../Utils/recursive");

function encodeExtra(node) {
    updateNodeName(node.argument);
};

function encodeRecursiveExtra(node) {
    recursiveCaller(node);
};

module.exports = { encodeExtra, encodeRecursiveExtra };