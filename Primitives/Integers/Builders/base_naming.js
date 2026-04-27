const config = require("../../../Settings/config");
const { generateObfuscatedName } = require("../../../Utils/nameGenerator");

function buildBaseNames(declarationMapping) {
    let baseVariable = "variable_numbers_";
    for (let i = 0; i < (config.numbers.cache.multipleAssignments ? 401 : 101); i++) {
        const name = generateObfuscatedName();
        const expectedValue = (config.numbers.cache.multipleAssignments && i > 100) ? i % 100 : i;
        declarationMapping.set((baseVariable + (config.numbers.cache.multipleAssignments && i > 100 ? i.toString()[0] + "_" : "") + expectedValue), name);
    };
};

module.exports = { buildBaseNames };