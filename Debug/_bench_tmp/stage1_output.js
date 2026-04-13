(async function j() {
    let H = {
        ["value"]: 1,
        ["log"]: []
    };
    function w($) {
        return function l(S) {
            const y = `${ $ }: ${ S }`;
            H.log.push(y);
            return y;
        };
    }
    const D = w('A');
    const v = w('B');
    class n {
        constructor(K) {
            this.multiplier = K;
        }
        ['process'](A) {
            function inner(s) {
                return s * 2;
            }
            return inner(A) * this.multiplier;
        }
        ['chain'](J) {
            return L => J(this.process(L));
        }
    }
    const M = new n(3);
    function* k(F) {
        let O = 0;
        while (O < F) {
            yield O++;
        }
    }
    async function* C(F) {
        for (let O = 0; O < F; O++) {
            await new W['Promise'](c => W['setTimeout'](c, 5));
            yield O * H.value;
        }
    }
    function I(u) {
        function G(A, V) {
            if (A <= 0)
                return V;
            return G(A - 1, V + A);
        }
        return G(u, 0);
    }
    function U(r) {
        return new W['Function']('a', 'b', `
            function calc(x, y) {
                return x ${ r } y;
            }
            return calc(a, b);
        `);
    }
    const E = U('+');
    const B = U('*');
    const z = new W['Proxy'](M.process.bind(M), {
        ["apply"](T, e, a) {
            H.value += 1;
            return W['Reflect'].apply(T, e, a) + H.value;
        }
    });
    function f(o, J) {
        function m(A) {
            return J(A);
        }
        return o.map(m);
    }
    let x = function (A) {
        x = function (s) {
            return s + H.value;
        };
        return A * 10;
    };
    function Y(A) {
        try {
            if (A % 2 === 0)
                throw new W['Error']('Even!');
            return A;
        } catch (i) {
            return i.message.length;
        } finally {
            H.value++;
        }
    }
    const Q = {
        get ["value"]() {
            H.value += 2;
            return H.value;
        }
    };
    D('start');
    const _ = [];
    for (let t of k(5)) {
        _.push(M.process(t));
    }
    const d = [];
    for await (let t of C(3)) {
        d.push(t);
    }
    const R = f(_, A => z(A));
    const MJ = M.chain(A => A + 1);
    const Bj = MJ(5);
    const aE = I(5);
    const If = [
        E(2, 3),
        B(4, 5)
    ];
    const MR = x(3);
    const qh = x(4);
    const Px = [
        Y(1),
        Y(2),
        Y(3)
    ];
    const qA = Q.value;
    function TI(gZ) {
        return function (oH) {
            return function (LV) {
                return function (iP) {
                    return gZ + oH + LV + iP + H.value;
                };
            };
        };
    }
    const $w = TI(1)(2)(3)(4);
    const zX = {
        ["genValues"]: _,
        ["asyncValues"]: d,
        ["transformed"]: R,
        ["chainedResult"]: Bj,
        ["recursionResult"]: aE,
        ["dynamicResults"]: If,
        ["weird1"]: MR,
        ["weird2"]: qh,
        ["riskyResults"]: Px,
        ["sneakyVal"]: qA,
        ["deepResult"]: $w,
        ["globalState"]: H
    };
    v('end');
    W['console'].log(zX);
}());