const { updateNodeName } = require("../Utils/naming");

/** Variables Export */
function objectPropertyRecursive(node) {
    if (node.properties) {
        for (let i = 0; i < node.properties.length; i++) {
            let property = node.properties[i];
            if (property.type === "Property") {
                if (property.shorthand) {
                    property.key.computed = true;
                    let preName = property.key.name;
                    updateNodeName(property.key);
                    property.key.name = `["${preName}"]: ${property.key.name}`;
                } else if (property.key.type === "Literal") {
                    property.key.computed = true;
                    property.key.name = `["${property.key.value}"]`;
                    property.key.type = "Identifier"
                } else if (property.key.type === "Identifier" && property.computed) {
                    property.key.computed = true;
                    updateNodeName(property.key);
                    property.obfuscated = true;
                    if (property.value.type === "Identifier") updateNodeName(property.value);
                } else {
                    property.key.computed = true;
                    property.key.name = `["${property.key.name}"]`;
                    if (property.value.type === "Identifier") updateNodeName(property.value);
                };
            };
        };
    };
};

module.exports = { objectPropertyRecursive };