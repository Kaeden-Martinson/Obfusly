const config = require('../../../Settings/config');

const { toBinary } = require('../binary');
const { toHex } = require('../hexadecimal');
const { toJSFuck } = require('../jsfuck');
const { toOctal } = require('../octal');
const { toRefractal } = require('../refractal');

let defaultedFunction;

function buildBaseInt(declarationMapping) {
    switch (config.numbers.baseIntegerFormat.default) {
        default: case "JSFuck": defaultedFunction = toJSFuck; break;
        case "Hexadecimal": defaultedFunction = toHex; break;
        case "Octal": defaultedFunction = toOctal; break;
        case "Binary": defaultedFunction =  toBinary; break;
        case "Refractal": defaultedFunction = toRefractal; break;
    };

    const vars = [];
    const rawValueMap = new Map(); // O(1) lookup replacing O(n) vars.find()

    // Direct arithmetic instead of eval() — eliminates 3200+ eval() calls
    function applyOp(a, op, b) {
        switch (op) {
            case '+': return (a + b) | 0;
            case '-': return (a - b) | 0;
            case '*': return (a * b) | 0;
            case '<<': return (a << b) | 0;
            case '>>': return (a >> b) | 0;
            case '^': return (a ^ b) | 0;
        }
        return a;
    }

    function generateMathFromInt(expectedValue, useDefault = false) {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const operations = ["+", "-", "*", "<<", ">>", "^"];
        let startNum = numbers[Math.floor(Math.random() * numbers.length)];
        let outputExpression = useDefault ? `${defaultedFunction(startNum, declarationMapping)}` : `${startNum}`;

        let currentValue = startNum;

        for (let i = 0; i < 8 || currentValue !== expectedValue; i++) {
            let num = numbers[Math.floor(Math.random() * numbers.length)];
            let op = operations[Math.floor(Math.random() * operations.length)];

            let newValue = applyOp(currentValue, op, num);

            if (Math.abs(expectedValue - newValue) < Math.abs(expectedValue - currentValue) || i < 8) {
                outputExpression = `(${outputExpression} ${op} ${useDefault ? defaultedFunction(num, declarationMapping) : num})`;
                currentValue = newValue;
            }
        }

        return outputExpression;
    };

    for (let i = 0; i <= 10; i++) {
        const v = { name: declarationMapping.get(`variable_numbers_${i}`), value: generateMathFromInt(i, true), rawValue: i };
        vars.push(v);
        rawValueMap.set(i, v.name);
    }

    for (let i = 11; i <= (config.numbers.cache.multipleAssignments ? 400 : 100); i++) {
        const expectedValue = (config.numbers.cache.multipleAssignments && i > 100) ? i % 100 : i;
        const name = declarationMapping.get(`variable_numbers_${(config.numbers.cache.multipleAssignments && i > 100 ? i.toString()[0] + "_" : "")}${expectedValue}`);

        const generatedValue = generateMathFromInt(expectedValue);
        const replacedValue = generatedValue.replace(/\d+/g, match => {
            const number = parseInt(match);
            return rawValueMap.get(number) || number;
        });

        vars.push({ name, value: replacedValue });
    };

    if (config.numbers.baseIntegerFormat.shuffle) {
        for (let i = 9; i < vars.length; i++) { const j = Math.floor(Math.random() * (i + 1)); if (j <= 10) continue;[vars[i], vars[j]] = [vars[j], vars[i]]; };
        for (let i = 9; i >= 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [vars[i], vars[j]] = [vars[j], vars[i]]; };
    };

    return vars.map(v => `var ${v.name} = ${v.value};`).join('\n');
};

module.exports = { buildBaseInt };