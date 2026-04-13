// Test: does new Function wrapping affect toString of nested functions?
// This simulates what the obfuscator does

const code = `
function testFn(a, b) {
    return a + b;
}
var result = testFn.toString();
RESULT_HOLDER = result;
`;

// Without wrapping
global.RESULT_HOLDER = null;
eval(code);
const directToString = global.RESULT_HOLDER;

// With new Function wrapping
global.RESULT_HOLDER = null;
new Function(code)();  
const wrappedToString = global.RESULT_HOLDER;

console.log('Direct toString:');
console.log(JSON.stringify(directToString));
console.log('\nWrapped toString:');
console.log(JSON.stringify(wrappedToString));
console.log('\nMatch:', directToString === wrappedToString);

// Test with compressed (single-line) code
const compressedCode = `function testFn2(a,b){return a+b}var result2=testFn2.toString();RESULT2=result2;`;

global.RESULT2 = null;
eval(compressedCode);
const directCompressed = global.RESULT2;

global.RESULT2 = null;
new Function(compressedCode)();
const wrappedCompressed = global.RESULT2;

console.log('\nCompressed direct:', JSON.stringify(directCompressed));
console.log('Compressed wrapped:', JSON.stringify(wrappedCompressed));
console.log('Match:', directCompressed === wrappedCompressed);

// Test with Function.prototype.toString.call explicitly
const code3 = `
function testFn3(x){return x*2}
var KI = Function.prototype.toString;
var wl = Function.prototype.call;
RESULT3 = wl.call(KI, testFn3);
`;

global.RESULT3 = null;
eval(code3);
const directExplicit = global.RESULT3;

global.RESULT3 = null;
new Function(code3)();
const wrappedExplicit = global.RESULT3;

console.log('\nExplicit direct:', JSON.stringify(directExplicit));
console.log('Explicit wrapped:', JSON.stringify(wrappedExplicit));
console.log('Match:', directExplicit === wrappedExplicit);

// Test with async function
const code4 = `async function testFn4(){return 42}RESULT4=testFn4.toString();`;
global.RESULT4 = null;
eval(code4);
const directAsync = global.RESULT4;

global.RESULT4 = null;
new Function(code4)();
const wrappedAsync = global.RESULT4;

console.log('\nAsync direct:', JSON.stringify(directAsync));
console.log('Async wrapped:', JSON.stringify(wrappedAsync));
console.log('Match:', directAsync === wrappedAsync);
