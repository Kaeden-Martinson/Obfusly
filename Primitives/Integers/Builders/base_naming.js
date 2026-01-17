const config = require("../../../Settings/config.json");
const { generateObfuscatedName } = require("../../../Utils/nameGenerator");

function buildBaseNames(declarationMapping) {
    let baseVariable = "variable_numbers_";
    for (let i = 0; i < (config.multipleVariableAssignments ? 401 : 101); i++) {
        const name = generateObfuscatedName();
        const expectedValue = (config.multipleVariableAssignments && i > 100) ? i % 100 : i;
        declarationMapping.set((baseVariable + (config.multipleVariableAssignments && i > 100 ? i.toString()[0] + "_" : "") + expectedValue), name);
    };
};

module.exports = { buildBaseNames };