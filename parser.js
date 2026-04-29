const { readFileSync, writeFileSync } = require("fs");

/* parse input using json to output */
const input = readFileSync("./input.js", "utf-8");

/* output the parsed data */
writeFileSync("./output.js", JSON.stringify(input), "utf-8");