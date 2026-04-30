const config = require('./Settings/config');
const __obfuscator_1 = require('./Main/first_obfuscator');
const __obfuscator_2 = require('./Main/property_obfuscator');

async function obfuscate(code, customConfig = {}) {

    const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
    const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties(obfuscatedCode, windowName, previousDeclarationMapping);

    console.log('Obfuscated Code:\n', objectObfuscatedCode);
}

// Test with default config
console.log('\n=== Test 1: Default Config ===');
obfuscate(`
    let x = 123123123;
    console.log(x);
`);