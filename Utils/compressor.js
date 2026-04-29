const acorn = require("acorn");
const astring = require("astring");

function compress(code) {
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  return astring.generate(ast);
}

module.exports = { compress };
