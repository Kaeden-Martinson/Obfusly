const { encodeStringsRandom } = require("../Primitives/Literals/strings");

let sourceCode;

function createStringProperty(node, properties) {
    node.type = "Identifier";
    node.computed = true;

    const rest = properties.slice(1);
    const propertyString = rest
        .map(property =>
            property === true ? `?.`
                : property === false ? ''
                    : property.raw ? `${property.raw}`
                        : `[${property}]`
        )
        .join('');

    node.name = `${properties[0].raw ? properties[0].raw : properties[0]}${propertyString}`;

    return node;
};

function recursiveCallObject(node, properties, isCallee = false) {
    // console.log(node)
    if (node?.type === "CallExpression") {
        if (node.arguments && node?.callee.type !== "Identifier") {
            for (let i = node.arguments.length - 1; i > -1; i--) {
                let argument = node.arguments[i];

                if (argument.type === "Identifier") {
                    properties.push({ raw: (i === 0 ? "(" : ", ") + argument.name + (i === node.arguments.length - 1 ? ")" : "") });
                } else if (argument.type === "Literal") {
                    properties.push({ raw: (i === 0 ? "(" : ", ") + encodeStringsRandom(argument.value).raw + (i === node.arguments.length - 1 ? ")" : "") });
                } else {
                    properties.push({ raw: (i === 0 ? "(" : ", ") + sourceCode.slice(argument.start, argument.end) + (i === node.arguments.length - 1 ? ")" : "") });
                };
            };
        };

        if (node?.callee.type === "Identifier") properties.push({ raw: sourceCode.slice(node.start, node.end) });

        return recursiveCallObject(node.callee, properties, true);
    };

    if (node.type === "ArrayExpression") {
        for (let i = node.elements.length - 1; i > -1; i--) {
            const element = node.elements[i];
            if (element.type === "SpreadElement") {
                let propProperties = [...recursiveCallObject(element.argument, [])].reverse();
                let fakePropertyNode = createStringProperty({}, propProperties);
                properties.push({ raw: (i === 0 ? "[..." : ", ...") + fakePropertyNode.name + (i === node.object.elements.length - 1 ? "]" : "") });
            } else if (element.type === "Identifier") {
                properties.push({ raw: (i === 0 ? "[" : ", ") + element.name + (i === node.elements.length - 1 ? "]" : "") });
            } else if (element.type === "Literal") {
                properties.push({ raw: (i === 0 ? "[" : ", ") + encodeStringsRandom(element.value).raw + (i === node.elements.length - 1 ? "]" : "") });
            } else {
                properties.push({ raw: (i === 0 ? "[" : ", ") + sourceCode.slice(element.start, element.end) + (i === node.elements.length - 1 ? "]" : "") });
            };
        };
    };

    if (node.type === "Literal") { properties.push(node.raw.toString()); return properties || []; };

    if (node.type !== "MemberExpression") return properties || [];

    if (node.property.type === "Identifier" && (node.object.type === "Identifier" || node.object.type === "MemberExpression" || node.object.type === "CallExpression" || node.object.type === "FunctionExpression") && !node.computed) {
        let isEmptyFunction = sourceCode.slice(node.property.end, node.property.end + 2) === "()" && isCallee;
        properties.push({ raw: (("[" + encodeStringsRandom(node.property.name).raw + "]") + (isEmptyFunction ? "()" : "")) });
        properties.push(node.optional);
        if (node.object.type === "FunctionExpression") {
            properties.push({ raw: sourceCode.slice(node.object.start, node.object.end) })
        };
    } else if (node.property.type === "Identifier") {
        if (node.computed) {
            let isEmptyFunction = sourceCode.slice(node.property.end + 1, node.property.end + 3) === "()" && isCallee;
            properties.push({ raw: ("[" + node.property.name + "]" + (isEmptyFunction ? "()" : "")) });
            properties.push(node.optional);
        } else {
            // console.log(node, properties)
            properties.push(encodeStringsRandom(node.property.name).raw);
            properties.push(node.optional);
        };
    };

    if (node.property.type === "CallExpression") {
        if (node.property.callee.type === "MemberExpression") {
            let argumentString = "";
            if (node.property.arguments) {
                for (let argument of node.property.arguments) {
                    if (argument.left) {
                        let propProperties = [...recursiveCallObject(argument.left, [])].reverse();
                        let fakePropertyNode = createStringProperty({}, propProperties);
                        argumentString += fakePropertyNode.name;
                    };

                    if (argument.operator) argumentString += argument.operator

                    if (argument.right) {
                        let propProperties = [...recursiveCallObject(argument.right, [])].reverse();
                        let fakePropertyNode = createStringProperty({}, propProperties);
                        argumentString += fakePropertyNode.name;
                    }
                };
            }

            let propProperties = [...recursiveCallObject(node.property.callee, [])].reverse();
            let fakePropertyNode = createStringProperty({}, propProperties);
            properties.push({ raw: "[" + fakePropertyNode.name + `(${argumentString})` + "]" });
        } else if (node.property.arguments && node.property?.callee.type !== "Identifier") {
            for (let argument of node.property.arguments) {
                if (argument.type === "Identifier") properties.push({ raw: "(" + argument.name + ")" });
                else properties.push({ raw: "(" + sourceCode.slice(argument.start, argument.end) + ")" });
            };
        } else if (node.property?.callee.type === "Identifier") properties.push({ raw: "[" + sourceCode.slice(node.property.start, node.property.end) + "]" });
    };

    if (node.property.type === "Literal") {
        let isEmptyFunction = sourceCode.slice(node.property.end + (node.computed ? 1 : 0), node.property.end + 2 + (node.computed ? 1 : 0)) === "()" && isCallee;
        if (typeof node.property.value === "string") properties.push({ raw : "[" + encodeStringsRandom(node.property.value).raw + "]" + (isEmptyFunction ? "()" : "") });
        else properties.push(encodeStringsRandom(node.property.raw).raw);
        properties.push(node.optional);
    };

    if (!["Identifier", "CallExpression", "Literal"].includes(node.property.type) && node.computed) {
        if (node.property.type === "MemberExpression") {
            let propProperties = [...recursiveCallObject(node.property, [])].reverse();
            let fakePropertyNode = createStringProperty({}, propProperties);
            properties.push({ raw: "[" + fakePropertyNode.name + "]" });
        } else properties.push({ raw: "[" + sourceCode.slice(node.property.start, node.property.end) + "]" });
    };

    if (node?.object?.type === "BinaryExpression" || node?.object?.type === "AssignmentExpression" || node?.object?.type === "LogicalExpression" || node?.object?.type === "ForInStatement" || node?.object?.type === "ForOfStatement") { properties.push({ raw: "(" + sourceCode.slice(node.object.start, node.object.end) + ")" }); properties.push(node.optional); };

    if (node?.object?.type === "ArrayExpression") {
        for (let i = node.object.elements.length - 1; i > -1; i--) {
            const element = node.object.elements[i];
            if (element.type === "SpreadElement") {
                let propProperties = [...recursiveCallObject(element.argument, [])].reverse();
                let fakePropertyNode = createStringProperty({}, propProperties);
                properties.push({ raw: (i === 0 ? "[..." : ", ...") + fakePropertyNode.name + (i === node.object.elements.length - 1 ? "]" : "") });
            } else if (element.type === "Identifier") {
                properties.push({ raw: (i === 0 ? "[" : ", ") + element.name + (i === node.object.elements.length - 1 ? "]" : "") });
            } else if (element.type === "Literal") {
                properties.push({ raw: (i === 0 ? "[" : ", ") + encodeStringsRandom(element.value).raw + (i === node.object.elements.length - 1 ? "]" : "") });
            } else {
                properties.push({ raw: (i === 0 ? "[" : ", ") + sourceCode.slice(element.start, element.end) + (i === node.object.elements.length - 1 ? "]" : "") });
            };
        };

        return properties;
    } else if (node.object && node.object.type === "Identifier") {
        properties.push(node.object.name); return properties;
    } else if (node.object && node.object.type === "NewExpression") {
        properties.push(sourceCode.slice(node.object.start, node.object.end)); return properties;
    } else if (node.object && node.object.type === "ThisExpression") {
        properties.push({ raw: 'this' }); return properties;
    } else return recursiveCallObject(node.object, properties);
};

function updateSourceCode(newSourceCode) { sourceCode = newSourceCode };

module.exports = { recursiveCallObject, createStringProperty, updateSourceCode };