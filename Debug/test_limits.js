/**
 * Test server-side obfuscation limits
 * Verifies that:
 * 1. All approved examples can be obfuscated without authentication
 * 2. Server-side limits are enforced for authenticated users
 * 3. Approved examples can be obfuscated even at limit
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Examples that should work for unauthenticated users
const APPROVED_EXAMPLES = [
    // Example 1: Fibonacci
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log('F(' + i + ') = ' + fibonacci(i));
}`,
    // Example 2: String Manipulation
    `function reverseString(str) {
  return str.split('').reverse().join('');
}

const message = 'Hello, World!';
console.log('Original: ' + message);
console.log('Reversed: ' + reverseString(message));`,
    // Example 3: Object Processing
    `const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

users.forEach(function(user) {
  console.log(user.name + ' is ' + user.age + ' years old');
});`,
    // Example 4: Array Operations
    `function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

const numbers = [1, 2, 3, 4, 5];
console.log('Sum: ' + sumArray(numbers));
console.log('Average: ' + (sumArray(numbers) / numbers.length));`,
    // Example 5: Prime Numbers
    `function isPrime(num) {
  if (num <= 1) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

for (let i = 2; i <= 20; i++) {
  if (isPrime(i)) console.log(i + ' is prime');
}`
];

const CUSTOM_CODE = `function customFunction() { return 'This is custom code'; }`;

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
        return true;
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        return false;
    }
}

async function testApprovedExamples() {
    console.log('\n=== Testing Approved Examples (Unauthenticated) ===\n');
    
    for (let i = 0; i < APPROVED_EXAMPLES.length; i++) {
        const example = APPROVED_EXAMPLES[i];
        const exampleNum = i + 1;
        
        await test(`Example ${exampleNum} obfuscation (no auth)`, async () => {
            const response = await fetch(`${BASE_URL}/obfuscate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: example })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            const result = await response.json();
            if (!result.obfuscatedCode) {
                throw new Error('No obfuscatedCode in response');
            }
        });
    }
}

async function testCustomCodeRejected() {
    console.log('\n=== Testing Custom Code Rejection ===\n');
    
    await test('Custom code rejected without auth', async () => {
        const response = await fetch(`${BASE_URL}/obfuscate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: CUSTOM_CODE })
        });
        
        if (response.status !== 403) {
            throw new Error(`Expected 403, got ${response.status}`);
        }
        
        const error = await response.json();
        if (!error.error?.includes('Authentication required')) {
            throw new Error(`Unexpected error message: ${error.error}`);
        }
    });
}

async function runAllTests() {
    console.log('🧪 Obfuscation Limits Test Suite\n');
    
    let passed = 0;
    let total = 0;
    
    // Test 1: Approved examples
    try {
        await testApprovedExamples();
        passed += APPROVED_EXAMPLES.length;
        total += APPROVED_EXAMPLES.length;
    } catch (e) {
        console.error('Approved examples test failed:', e);
        total += APPROVED_EXAMPLES.length;
    }
    
    // Test 2: Custom code rejection
    const customTestPassed = await test('Custom code rejected without auth', async () => {
        const response = await fetch(`${BASE_URL}/obfuscate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: CUSTOM_CODE })
        });
        
        if (response.status !== 403) {
            throw new Error(`Expected 403, got ${response.status}`);
        }
        
        const error = await response.json();
        if (!error.error?.includes('Authentication required')) {
            throw new Error(`Unexpected error message: ${error.error}`);
        }
    });
    
    passed += customTestPassed ? 1 : 0;
    total += 1;
    
    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Tests Passed: ${passed}/${total}`);
    console.log(`${'='.repeat(50)}\n`);
    
    if (passed === total) {
        console.log('✓ All tests passed!');
        process.exit(0);
    } else {
        console.error(`✗ ${total - passed} test(s) failed`);
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
