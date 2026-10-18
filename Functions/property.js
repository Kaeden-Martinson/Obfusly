const { updateNodeName } = require("../Utils/naming");

/** Variables Export */
function objectPropertyRecursive(node) {
    if (node.properties) {
        for (let i = 0; i < node.properties.length; i++) {
            let property = node.properties[i];
            if (property.type === "Property") {
                if (property.shorthand) {
                    /* { foo } -> { ["foo"]: <renamedFoo> }. Must drop shorthand AND rename the VALUE (the variable
                       reference) — the old code renamed only the key and left shorthand on, so astring emitted the
                       un-renamed value -> "foo is not defined". Mirrors the ObjectPattern handler in stage 1. */
                    property.shorthand = false;
                    if (property.value && property.value.type === "Identifier") updateNodeName(property.value);
                    property.key.computed = true;
                    property.key.name = `[${JSON.stringify(property.key.name)}]`;
                } else if (property.computed) {
                    /* { [expr]: v } -- leave the key expression to the normal stage-1/stage-2 transforms; only rename
                       a bare Identifier key. Touching a MemberExpression key (e.g. [Enum.KD]) corrupted it to [KD]
                       (an undefined bare identifier) -> "KD is not defined". */
                    if (property.key.type === "Identifier") { updateNodeName(property.key); property.obfuscated = true; }
                    if (property.value && property.value.type === "Identifier") updateNodeName(property.value);
                } else if (property.key.type === "Literal") {
                    property.key.computed = true;
                    property.key.name = `[${JSON.stringify(String(property.key.value))}]`;
                    property.key.type = "Identifier"
                } else {
                    property.key.computed = true;
                    property.key.name = `[${JSON.stringify(property.key.name)}]`;
                    if (property.value && property.value.type === "Identifier") updateNodeName(property.value);
                };
            };
        };
    };
};

module.exports = { objectPropertyRecursive };