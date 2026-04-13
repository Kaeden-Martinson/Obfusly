// Verify deferred check hashes in devCode.js by extracting the hash functions
// and computing them against the actual function bodies
const fs = require('fs');
const code = fs.readFileSync('/tmp/tmp-288265-7gW79BbMqinA/devCode.js', 'utf-8');

// Reconstruct the jG hash function from source
function Pi(a,b){return(a^b)>>>0;}
function Zh(x){var a=(x^x>>>3)>>>0;return Math.imul(a,-486450595)>>>0;}
function jG(str){
    str=(str||'').replace(/\r/g,'');
    var a=1367785119>>>0,b=1401452329>>>0,c=0;
    for(var i=0;i<str.length;i++){
        var ch=str.charCodeAt(i);
        a=(a^ch)+((a<<11)+(a>>>4));a>>>=0;
        b=b+(ch^b<<19)>>>0;
        c=c+(ch*2850365271^a>>>(i&15))>>>0;
        a=a+((b<<13)|(b>>>19))>>>0;
        b=(b^((a>>>7)+1219677029))>>>0;
    }
    var r=Pi(a,b+c);
    for(var i=0;i<3;i++){
        r=Pi((r^r<<13)+2237044423,0);
        r=Zh(r);
    }
    return r>>>0;
}

function Zo(a,b){return(a^b)>>>0;}
function Hk(x){var a=(x^x>>>8)>>>0;return Math.imul(a,-1762263683)>>>0;}
function hw(str){
    str=(str||'').replace(/\r/g,'');
    var a=873076701>>>0,b=2347325760>>>0,c=0;
    for(var i=0;i<str.length;i++){
        var ch=str.charCodeAt(i);
        a=(a^ch)+((a<<1)+(a>>>6));a>>>=0;
        b=b+(ch^b<<14)>>>0;
        c=c+(ch*817335070^a>>>(i&15))>>>0;
        a=a+((b<<13)|(b>>>19))>>>0;
        b=(b^((a>>>7)+677264165))>>>0;
    }
    var r=Zo(a,b+c);
    for(var i=0;i<3;i++){
        r=Zo((r^r<<13)+6472753,0);
        r=Hk(r);
    }
    return r>>>0;
}

// Expected hashes from deferred checks:
// Deferred 1: fn=inner, jG hash=0x08610117, hw hash=0x526a1d02
// Deferred 2: fn=xx,    jG hash=0xc5730e55, hw hash=0xd08550ab
// Deferred 3: fn=Gr,    jG hash=0x0d867d48, hw hash=0x09bdd41c

const expected = {
    'inner': { jG: 0x08610117, hw: 0x526a1d02 },
    'xx':    { jG: 0xc5730e55, hw: 0xd08550ab },
    'Gr':    { jG: 0x0d867d48, hw: 0x09bdd41c },
};

// Find each function in the code
// For function declarations: "function NAME(..."
// For variable assignments: "var NAME = function(..." or "NAME = function(..."

for (const fnName of ['inner', 'xx', 'Gr']) {
    console.log(`\n=== Function: ${fnName} ===`);
    
    // Try function declaration first
    const declRe = new RegExp(`function ${fnName}\\(`);
    const declMatch = declRe.exec(code);
    
    if (declMatch) {
        console.log(`Found function declaration at pos ${declMatch.index}`);
        
        // Find the matching brace to get the full function
        let braceCount = 0;
        let funcStart = declMatch.index;
        let funcEnd = -1;
        let started = false;
        
        for (let i = funcStart; i < code.length; i++) {
            if (code[i] === '{') { braceCount++; started = true; }
            if (code[i] === '}') { braceCount--; }
            if (started && braceCount === 0) {
                funcEnd = i + 1;
                break;
            }
        }
        
        if (funcEnd > 0) {
            const funcSrc = code.slice(funcStart, funcEnd);
            console.log(`Function length: ${funcSrc.length} chars`);
            console.log(`First 100 chars: ${funcSrc.slice(0, 100)}`);
            console.log(`Last 50 chars: ...${funcSrc.slice(-50)}`);
            
            const h1 = jG(funcSrc);
            const h2 = hw(funcSrc);
            const exp = expected[fnName];
            
            console.log(`\nExpected jG: 0x${exp.jG.toString(16).padStart(8, '0')}`);
            console.log(`Actual   jG: 0x${h1.toString(16).padStart(8, '0')} ${h1 === exp.jG ? '✓ MATCH' : '✗ MISMATCH'}`);
            console.log(`Expected hw: 0x${exp.hw.toString(16).padStart(8, '0')}`);
            console.log(`Actual   hw: 0x${h2.toString(16).padStart(8, '0')} ${h2 === exp.hw ? '✓ MATCH' : '✗ MISMATCH'}`);
            
            if (h1 !== exp.jG || h2 !== exp.hw) {
                console.log('\n*** HASH MISMATCH - This deferred check will FREEZE! ***');
                
                // Now check: what would toString() return at RUNTIME?
                // In a browser, Function.prototype.toString returns the source
                // With the toString() anti-tamper guard, Qm(fn) calls Function.prototype.call.call(Function.prototype.toString, fn)
                // So it returns fn.toString()
                // For function declarations, fn.toString() in V8 returns the original source
                // But after compression/minification, the source changes!
                // The hash is computed by build.js from the AST-based source
                // But at runtime, toString() returns... the same thing? Or different?
            }
        }
    } else {
        console.log(`No function declaration found for ${fnName}`);
        
        // Try variable assignment: var fnName=function(...) or var fnName=(function...
        const varRe = new RegExp(`var ${fnName}=`);
        const varMatch = varRe.exec(code);
        if (varMatch) {
            console.log(`Found var assignment at pos ${varMatch.index}`);
            const ctx = code.slice(varMatch.index, varMatch.index + 200);
            console.log(`Context: ${ctx.slice(0, 200)}`);
        } else {
            // Try let/const
            const letRe = new RegExp(`(?:let|const) ${fnName}[=;,]`);
            const letMatch = letRe.exec(code);
            if (letMatch) {
                console.log(`Found let/const at pos ${letMatch.index}:`);
                console.log(code.slice(letMatch.index, letMatch.index + 200));
            }
        }
    }
}
