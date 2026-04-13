(async function main() {

    // GLOBAL STATE
    let globalState = {
        value: 1,
        log: []
    };

    // LOGGER (closure)
    function createLogger(prefix) {
        return function log(msg) {
            const entry = `${prefix}: ${msg}`;
            globalState.log.push(entry);
            return entry;
        };
    }

    const logA = createLogger("A");
    const logB = createLogger("B");

    // CLASS WITH METHODS + INTERNAL FUNCTIONS
    class Processor {
        constructor(multiplier) {
            this.multiplier = multiplier;
        }

        process(x) {
            function inner(y) {
                return y * 2;
            }
            return inner(x) * this.multiplier;
        }

        chain(fn) {
            return (value) => fn(this.process(value));
        }
    }

    const proc = new Processor(3);

    // GENERATOR
    function* numberGenerator(limit) {
        let i = 0;
        while (i < limit) {
            yield i++;
        }
    }

    // ASYNC GENERATOR
    async function* asyncGenerator(limit) {
        for (let i = 0; i < limit; i++) {
            await new Promise(r => setTimeout(r, 5));
            yield i * globalState.value;
        }
    }

    // RECURSION (tree walk simulation)
    function recursiveSum(n) {
        function helper(x, acc) {
            if (x <= 0) return acc;
            return helper(x - 1, acc + x);
        }
        return helper(n, 0);
    }

    // DYNAMIC FUNCTION
    function makeDynamic(op) {
        return new Function("a", "b", `
            function calc(x, y) {
                return x ${op} y;
            }
            return calc(a, b);
        `);
    }

    const add = makeDynamic("+");
    const mul = makeDynamic("*");

    // PROXY WRAPPER
    const wrapped = new Proxy(proc.process.bind(proc), {
        apply(target, thisArg, args) {
            globalState.value += 1;
            return Reflect.apply(target, thisArg, args) + globalState.value;
        }
    });

    // HIGHER-ORDER FUNCTION
    function transformArray(arr, fn) {
        function applyOne(x) {
            return fn(x);
        }
        return arr.map(applyOne);
    }

    // SELF-MODIFYING FUNCTION
    let weird = function (x) {
        weird = function (y) {
            return y + globalState.value;
        };
        return x * 10;
    };

    // ERROR HANDLING PATH
    function riskyOperation(x) {
        try {
            if (x % 2 === 0) throw new Error("Even!");
            return x;
        } catch (e) {
            return e.message.length;
        } finally {
            globalState.value++;
        }
    }

    // OBJECT WITH GETTERS (hidden execution)
    const sneaky = {
        get value() {
            globalState.value += 2;
            return globalState.value;
        }
    };

    // EXECUTION FLOW

    logA("start");

    const genValues = [];
    for (let v of numberGenerator(5)) {
        genValues.push(proc.process(v));
    }

    const asyncValues = [];
    for await (let v of asyncGenerator(3)) {
        asyncValues.push(v);
    }

    const transformed = transformArray(genValues, x => wrapped(x));

    const chained = proc.chain(x => x + 1);
    const chainedResult = chained(5);

    const recursionResult = recursiveSum(5);

    const dynamicResults = [
        add(2, 3),
        mul(4, 5)
    ];

    const weird1 = weird(3);
    const weird2 = weird(4); // different behavior now

    const riskyResults = [
        riskyOperation(1),
        riskyOperation(2),
        riskyOperation(3)
    ];

    const sneakyVal = sneaky.value;

    // NESTED FUNCTION CASCADE
    function deepNest(a) {
        return function (b) {
            return function (c) {
                return function (d) {
                    return a + b + c + d + globalState.value;
                };
            };
        };
    }

    const deepResult = deepNest(1)(2)(3)(4);

    // FINAL AGGREGATION
    const final = {
        genValues,
        asyncValues,
        transformed,
        chainedResult,
        recursionResult,
        dynamicResults,
        weird1,
        weird2,
        riskyResults,
        sneakyVal,
        deepResult,
        globalState
    };

    logB("end");

    console.log(final);

})();
