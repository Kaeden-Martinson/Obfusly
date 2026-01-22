const config = require('../../../Settings/config');

const { toBinary } = require('../binary');
const { toHex } = require('../hexadecimal');
const { toJSFuck } = require('../jsfuck');
const { toOctal } = require('../octal');
const { toRefractal } = require('../refractal');

let defaultedFunction;
switch (config.baseIntegersDefault) {
    default: case "JSFuck": defaultedFunction = toJSFuck; break;
    case "Hexadecimal": defaultedFunction = toHex; break;
    case "Octal": defaultedFunction = toOctal; break;
    case "Binary": defaultedFunction =  toBinary; break;
    case "Refractal": defaultedFunction = toRefractal; break;
};

function buildBaseInt(declarationMapping) {
    const vars = [];

    function generateMathFromInt(expectedValue, useDefault = false) {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const operations = ["+", "-", "*", "<<", ">>", "^"];
        let expression = `${numbers[Math.floor(Math.random() * numbers.length)]}`;

        let currentValue = eval(expression);

        for (let i = 0; i < 8 || currentValue !== expectedValue; i++) {
            let num = numbers[Math.floor(Math.random() * numbers.length)];
            let op = operations[Math.floor(Math.random() * operations.length)];

            let newExpression = `(${expression} ${op} ${useDefault ? defaultedFunction(num, declarationMapping) : num})`;
            let newValue = eval(newExpression);

            if (Math.abs(expectedValue - newValue) < Math.abs(expectedValue - currentValue) || i < 8) {
                expression = newExpression;
                currentValue = newValue;
            }
        }

        return expression;
    };

    for (let i = 0; i <= 10; i++) vars.push({ name: declarationMapping.get(`variable_numbers_${i}`), value: generateMathFromInt(i, true), rawValue: i });

    for (let i = 11; i <= (config.multipleVariableAssignments ? 400 : 100); i++) {
        const expectedValue = (config.multipleVariableAssignments && i > 100) ? i % 100 : i;
        const name = declarationMapping.get(`variable_numbers_${(config.multipleVariableAssignments && i > 100 ? i.toString()[0] + "_" : "")}${expectedValue}`);

        const generatedValue = generateMathFromInt(expectedValue);
        const replacedValue = generatedValue.replace(/\d+/g, match => {
            const number = parseInt(match);
            const varName = vars.find(v => v.rawValue === number)?.name || number;
            return varName;
        });

        vars.push({ name, value: replacedValue });
    };

    if (config.shuffleBaseIntegers) {
        for (let i = 9; i < vars.length; i++) { const j = Math.floor(Math.random() * (i + 1)); if (j <= 10) continue;[vars[i], vars[j]] = [vars[j], vars[i]]; };
        for (let i = 9; i >= 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [vars[i], vars[j]] = [vars[j], vars[i]]; };
    };

    return vars.map(v => `var ${v.name} = ${v.value};`).join('\n');
};

module.exports = { buildBaseInt };