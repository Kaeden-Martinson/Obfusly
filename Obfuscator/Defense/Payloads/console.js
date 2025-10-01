new Function(`
window.ﾠ = [() => { }];
window.nativeﾠcode = 0;

Object.getOwnPropertyNames(console).forEach(function (prop) {
    if (typeof console[prop] === "function") {
        const fnName = prop;

        +![]+!+![]['filter']['constructor']('return eval')\`\`(\`console["\${prop}"] = function \${prop}() {ﾠ[nativeﾠcode] };\`);

        Object.defineProperty(console[prop], 'name', { value: fnName, configurable: true });
        Object.defineProperty(console[prop], 'length', { value: 0, configurable: true });

        Object.defineProperty(console[prop], 'toString', {
            value: function () {
                return \`function \${fnName}() { [native code] }\`;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });

        try {
            Object.defineProperty(console[prop], 'prototype', {
                value: void 0,
                configurable: true,
                writable: false,
                enumerable: false
            });
        } catch (e) { /* ignore */ }

        Object.defineProperty(console[prop], 'arguments', {
            get() { throw new TypeError("Function.arguments is not accessible in strict mode"); },
            set(_) { throw new TypeError("Function.arguments is not accessible in strict mode"); },
            configurable: true
        });

        Object.defineProperty(console[prop], 'caller', {
            get() { throw new TypeError("Function.caller is not accessible in strict mode"); },
            set(_) { throw new TypeError("Function.caller is not accessible in strict mode"); },
            configurable: true
        });
    }
});
`)();