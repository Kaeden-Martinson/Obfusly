const acorn = require("acorn");
const escodegen = require("escodegen");

function compress(code) {
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  return escodegen.generate(ast, {
    format: {
      compact: true, 
      semicolons: true,
      quotes: "auto"
    }
  });
}

module.exports = { compress };
