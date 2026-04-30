const acorn = require("acorn");
const astring = require("astring");

function compress(code) {
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  return astring.generate(ast, {
    compact: true,
    semicolons: true,
    quotes: "auto"
  });
}

function removeSpacesAndNewlines(code) {
  const keywords = ['return', 'let', 'const', 'var', 'function', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'try', 'catch', 'finally', 'new', 'typeof', 'void', 'delete', 'instanceof', 'in', 'of', 'class', 'extends', 'import', 'export', 'from', 'as', 'yield', 'async', 'await', 'throw'];
  
  let result = '';
  let i = 0;
  
  while (i < code.length) {
    const char = code[i];
    
    // Handle string literals - preserve everything inside them
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      result += char;
      i++;
      
      // Copy everything until closing quote (handle escapes)
      while (i < code.length) {
        if (code[i] === '\\' && i + 1 < code.length) {
          // Escaped character - copy both
          result += code[i] + code[i + 1];
          i += 2;
        } else if (code[i] === quote) {
          result += code[i];
          i++;
          break;
        } else {
          result += code[i];
          i++;
        }
      }
      continue;
    }
    
    // Handle whitespace outside strings
    if (/\s/.test(char)) {
      // Look back to see if a keyword precedes this whitespace
      const beforeSpace = result.trimRight();
      let preserveSpace = false;
      
      for (const kw of keywords) {
        if (beforeSpace.endsWith(kw)) {
          preserveSpace = true;
          break;
        }
      }
      
      if (preserveSpace) {
        result += ' ';
      }
      
      // Skip all consecutive whitespace
      while (i < code.length && /\s/.test(code[i])) {
        i++;
      }
      continue;
    }
    
    // Regular characters
    result += char;
    i++;
  }
  
  return result;
};

module.exports = { compress, removeSpacesAndNewlines };
