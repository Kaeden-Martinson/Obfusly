const config = require('../../Settings/config');
const { pickWeightedRandom } = require('../../Utils/weights');

const { toBinary } = require('./binary');
const { toHex } = require('./hexadecimal');
const { toJSFuck } = require('./jsfuck');
const { toOctal } = require('./octal');

const useConfig = function (num) {
    let percentageBasedConfig = { ...config.integerPrecentage };
    percentageBasedConfig.Refractal = 0;
    if (num <= 10 && config.integerPrecentage.JSFuck > 0) percentageBasedConfig.JSFuck = 35; else percentageBasedConfig.JSFuck = 0;

    let choice = pickWeightedRandom(percentageBasedConfig);

    let defaultedFunction;
    switch (choice) {
        case "JSFuck": defaultedFunction = toJSFuck; break;
        default: case "Hexadecimal": defaultedFunction = toHex; break;
        case "Octal": defaultedFunction = toOctal; break;
        case "Binary": defaultedFunction = toBinary; break;
    };

    return defaultedFunction(num);
};

var toRefractal = (originalNumber, declarationMapping) => {
    let number = Number(originalNumber);
    let roundedSqrt = Math.floor(Math.sqrt(Math.abs(number)));
    let remainder = number - roundedSqrt ** 2;

    const BigNumber = Math.floor(Math.random() * 100);
    const LeftOver = BigNumber - 3;

    if (config.globalBaseIntegerConcealment && config.multipleVariableAssignments && LeftOver !== 100 && BigNumber !== 100 && BigNumber !== 0 && LeftOver !== 0) {
        const shuffledIndex = Math.floor(Math.random() * 4);

        const choices = [1, 2, 3].filter(v => v !== shuffledIndex);
        const secondChoice = choices[Math.floor(Math.random() * choices.length)];

        if (shuffledIndex !== 0) return `((~'${roundedSqrt - 1}')**~-(${declarationMapping.get(`variable_numbers_${shuffledIndex}_${BigNumber}`)} ${LeftOver < 0 ? "+" : "-"} ${declarationMapping.get(`variable_numbers_${secondChoice}_${Math.abs(LeftOver)}`)})+${useConfig(remainder)})`;
    };

    return `((~'${roundedSqrt - 1}')**~-(${(config.globalBaseIntegerConcealment ? declarationMapping.get(`variable_numbers_${BigNumber}`) : useConfig(BigNumber))} ${LeftOver < 0 ? "+" : "-"} ${config.globalBaseIntegerConcealment ? declarationMapping.get(`variable_numbers_${Math.abs(LeftOver)}`) : useConfig(Math.abs(LeftOver))})+${(remainder < 100 && config.globalBaseIntegerConcealment ? declarationMapping.get(`variable_numbers_${remainder}`) : useConfig(remainder))})`;
};

module.exports = { toRefractal }; 