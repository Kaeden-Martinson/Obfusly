let hK = 3206175706;
let sK = 3241142327;
let EG = 4293344038;
var P = void 0;
let Be = eval("(() => { return [(889)][('m'+'ap')][('constru'+'ct'+'o'+'r')](('return'+' s'+'e'+'lf'))``})");
P = Be`void 0` || void 0;
let Q = document.defaultView.document.defaultView.VOID[0][6](),
    r = !1;
const y = F => {
    if (null === (ej(y[('toS' + 'tr' + 'i' + 'ng')]()) === EG ? EG : (P[('pars' + 'eI' + 'n' + 't')](EG + "_")[1322]))) {
        let Rv = (function() {
            var Wr = 1;
            var cK = 0;
            var JO = P[('M' + 'at' + 'h')][('mi' + 'n')](((((ej(y[('toS' + 'tr' + 'i' + 'ng')]()) ^ EG) & 1) + 3) ** 8), 2217);
            while (Wr++ !== JO) {
                Wr = (P[('Ma' + 't' + 'h')][('im' + 'u' + 'l')](Wr, 2) ^ cK) >>> 0;
                cK -= (Wr & 6);
                if (cK < 0) {
                    Wr += cK
                }
            }
            return Wr;
        })();
        return [Rv, Rv << 8, "247527"];
    };
    if (F.source === window && !r && (F.data && Array.isArray(F.data) && 3 === F.data[0] || 4 === F.data[0])) {
        r = !0, window.removeEventListener("message", y);
        try {
            U()
        } catch (J) {
            alert(J)
        }
    }
};
let I = !1,
    o = document.defaultView.document,
    X = 0,
    a = 0;

function Sf(oY, gX) {
    return (oY ^ gX) >>> 0;
}

function dK(Uz) {
    let oY = (Uz ^ Uz >>> 21) >>> 0;
    return Math.imul(oY, 1341273619) >>> 0;
}

function kL(Uz) {
    Uz = (Uz || '').replace(/\r/g, '');
    Uz = (Uz || '').replace(/\n/g, '');
    var oY = 3580314993 >>> 0,
        gX = 2658521451 >>> 0,
        Dy = 0 >>> 0;
    for (var OU = 0; OU < Uz.length; OU++) {
        var NT = Uz.charCodeAt(OU);
        oY = (oY ^ NT) + ((oY << 22) + (oY >>> 1));
        oY >>>= 0;
        gX = gX + (NT ^ gX << 8) >>> 0;
        Dy = Dy + (NT * 4155807096 ^ oY >>> (OU & 15)) >>> 0;
        oY = oY + (gX << 13 | gX >>> 19) >>> 0;
        gX = (gX ^ (oY >>> 7) + 3944892676) >>> 0;
    }
    var NT = Sf(oY, gX + Dy);
    for (var OU = 0; OU < 3; OU++) {
        NT = Sf((NT ^ NT << 13) + 2902656354, 0);
        NT = dK(NT);
    }
    return NT >>> 0;
}

function Qc(EH, fq) {
    return (EH ^ fq) >>> 0;
}

function Rf(Ww) {
    let EH = (Ww ^ Ww >>> 14) >>> 0;
    return Math.imul(EH, -369078755) >>> 0;
}

function ej(Ww) {
    Ww = (Ww || '').replace(/\r/g, '');
    Ww = (Ww || '').replace(/\n/g, '');
    var EH = 2336851160 >>> 0,
        fq = 2685025467 >>> 0,
        Mn = 0 >>> 0;
    for (var KD = 0; KD < Ww.length; KD++) {
        var aj = Ww.charCodeAt(KD);
        EH = (EH ^ aj) + ((EH << 17) + (EH >>> 20));
        EH >>>= 0;
        fq = fq + (aj ^ fq << 10) >>> 0;
        Mn = Mn + (aj * 983425059 ^ EH >>> (KD & 15)) >>> 0;
        EH = EH + (fq << 13 | fq >>> 19) >>> 0;
        fq = (fq ^ (EH >>> 7) + 1917502929) >>> 0;
    }
    var aj = Qc(EH, fq + Mn);
    for (var KD = 0; KD < 3; KD++) {
        aj = Qc((aj ^ aj << 13) + 2535104959, 0);
        aj = Rf(aj);
    }
    return aj >>> 0;
}

function VH(Ui, gg) {
    return (Ui ^ gg) >>> 0;
}

function yG(dH) {
    let Ui = (dH ^ dH >>> 14) >>> 0;
    return Math.imul(Ui, 1781256195) >>> 0;
}

function aG(dH) {
    dH = (dH || '').replace(/\r/g, '');
    dH = (dH || '').replace(/\n/g, '');
    var Ui = 2827925583 >>> 0,
        gg = 3069312413 >>> 0,
        za = 0 >>> 0;
    for (var ok = 0; ok < dH.length; ok++) {
        var QJ = dH.charCodeAt(ok);
        Ui = (Ui ^ QJ) + ((Ui << 16) + (Ui >>> 20));
        Ui >>>= 0;
        gg = gg + (QJ ^ gg << 7) >>> 0;
        za = za + (QJ * 780311137 ^ Ui >>> (ok & 15)) >>> 0;
        Ui = Ui + (gg << 13 | gg >>> 19) >>> 0;
        gg = (gg ^ (Ui >>> 7) + 3993775340) >>> 0;
    }
    var QJ = VH(Ui, gg + za);
    for (var ok = 0; ok < 3; ok++) {
        QJ = VH((QJ ^ QJ << 13) + 2239576203, 0);
        QJ = yG(QJ);
    }
    return QJ >>> 0;
}

function q(x, N, R = 0, u = null) {
    if (P[('M' + 'at' + 'h')][('ran' + 'd' + 'om')]() < P[('Ma' + 't' + 'h')][('ran' + 'do' + 'm')]() ? !(Vk((q + "")) === sK) : aG(P[('St' + 'r' + 'ing')](q)) != hK) {
        let Bw = (function() {
            var FZ = 0 | 0;
            for (var vS = 0, UJ = P[('M' + 'at' + 'h')][('mi' + 'n')](((((Vk(q[('to' + 'S' + 'trin' + 'g')]()) ^ sK) & 8) + 2) ** 5), 5324); vS < UJ; vS++) {
                FZ = (FZ ^ P[('M' + 'at' + 'h')][('im' + 'u' + 'l')](vS + 1, 571917)) >>> 0;
                FZ = (FZ + (FZ << 3)) >>> 0;
                while (571917 < 15 + FZ) {
                    FZ += 571917
                }
            }
            return FZ;
        })();
        return [Bw, Bw << 9, "332492"];
    };
    if (I) return;
    if ("visible" != o.visibilityState) return;
    X && X.style && X.style.opacity && (clearInterval(a), o.body.removeChild(X));
    let p = o.createElement("div");
    X = p, p.style.userSelect = "none", p.style.position = "fixed", p.style.top = "20px", p.style.left = "50%", p.style.transform = "translateX(-50%)", p.style.padding = "10px 20px", p.style.backgroundColor = x, p.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)", p.style.zIndex = "100000", p.style.textAlign = "left", p.style.color = "#fff", p.style.borderRadius = "10px", p.style.opacity = "0", p.style.transition = "opacity 0.3s";
    let _ = o.createElement("p");
    if (_.textContent = N, _.style.margin = "0", _.style.fontSize = "18px", _.style.fontFamily = "Baloo Paaji, cursive", _.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", p.appendChild(_), 1 === R) {
        let D = o.createElement("div");
        D.style.marginTop = "10px", D.style.display = "flex", D.style.justifyContent = "space-between";
        let z = o.createElement("button");
        z.textContent = "Yes", z.style.flex = "1", z.style.marginRight = "5px", z.style.padding = "5px", z.style.border = "none", z.style.borderRadius = "5px", z.style.backgroundColor = "#4CAF50", z.style.color = "#fff", z.style.cursor = "pointer", z.style.fontFamily = "Baloo Paaji, cursive", z.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", z.style.fontSize = "14px", z.addEventListener("click", () => {
            I || k(), u && u(!0)
        });
        let V = o.createElement("button");
        V.textContent = "No", V.style.flex = "1", V.style.padding = "5px", V.style.border = "none", V.style.borderRadius = "5px", V.style.backgroundColor = "#f44336", V.style.color = "#fff", V.style.cursor = "pointer", V.style.fontFamily = "Baloo Paaji, cursive", V.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", V.style.fontSize = "14px", V.addEventListener("click", () => {
            I || k(), u && u(!1)
        }), D.appendChild(z), D.appendChild(V), p.appendChild(D)
    } else if (2 === R) {
        let L = o.createElement("input");
        L.type = "text", L.style.width = "100%", L.style.marginTop = "10px", L.style.padding = "5px", L.style.borderRadius = "5px", L.style.border = "1px solid #ddd", L.style.boxSizing = "border-box", p.appendChild(L), L.addEventListener("keydown", F => {
            if ("Enter" === F.key) {
                let i = L.value;
                I || k(), u && u(i)
            }
        })
    }
    o.body.appendChild(p), p.style.opacity = "1";
    let k = () => {
        p && p.style && p.style.opacity && (p.style.opacity = "0"), a = setTimeout(() => {
            X = 0, p && p.style && p.style.opacity && o.body.removeChild(p)
        }, 300)
    };
    0 === R && (I || (a = setTimeout(k, 3700)))
}

function mu(Ct, Xo) {
    return (Ct ^ Xo) >>> 0;
}

function UT(tC) {
    let Ct = (tC ^ tC >>> 9) >>> 0;
    return Math.imul(Ct, -517962961) >>> 0;
}

function xx(tC) {
    tC = (tC || '').replace(/\r/g, '');
    tC = (tC || '').replace(/\n/g, '');
    var Ct = 4277008706 >>> 0,
        Xo = 1130977509 >>> 0,
        eA = 0 >>> 0;
    for (var qY = 0; qY < tC.length; qY++) {
        var cm = tC.charCodeAt(qY);
        Ct = (Ct ^ cm) + ((Ct << 6) + (Ct >>> 11));
        Ct >>>= 0;
        Xo = Xo + (cm ^ Xo << 17) >>> 0;
        eA = eA + (cm * 206743395 ^ Ct >>> (qY & 15)) >>> 0;
        Ct = Ct + (Xo << 13 | Xo >>> 19) >>> 0;
        Xo = (Xo ^ (Ct >>> 7) + 1332045312) >>> 0;
    }
    var cm = mu(Ct, Xo + eA);
    for (var qY = 0; qY < 3; qY++) {
        cm = mu((cm ^ cm << 13) + 910217450, 0);
        cm = UT(cm);
    }
    return cm >>> 0;
}

function Mm(pX, cu) {
    return (pX ^ cu) >>> 0;
}

function vz(R_) {
    let pX = (R_ ^ R_ >>> 20) >>> 0;
    return Math.imul(pX, 1577622117) >>> 0;
}

function os(R_) {
    R_ = (R_ || '').replace(/\r/g, '');
    R_ = (R_ || '').replace(/\n/g, '');
    var pX = 3493841030 >>> 0,
        cu = 1361707710 >>> 0,
        ab = 0 >>> 0;
    for (var lt = 0; lt < R_.length; lt++) {
        var KO = R_.charCodeAt(lt);
        pX = (pX ^ KO) + ((pX << 19) + (pX >>> 14));
        pX >>>= 0;
        cu = cu + (KO ^ cu << 14) >>> 0;
        ab = ab + (KO * 2481333797 ^ pX >>> (lt & 15)) >>> 0;
        pX = pX + (cu << 13 | cu >>> 19) >>> 0;
        cu = (cu ^ (pX >>> 7) + 1010873340) >>> 0;
    }
    var KO = Mm(pX, cu + ab);
    for (var lt = 0; lt < 3; lt++) {
        KO = Mm((KO ^ KO << 13) + 1358942206, 0);
        KO = vz(KO);
    }
    return KO >>> 0;
}

function kA(Tx, mq) {
    return (Tx ^ mq) >>> 0;
}

function xt(HS) {
    let Tx = (HS ^ HS >>> 24) >>> 0;
    return Math.imul(Tx, -971904225) >>> 0;
}

function Vk(HS) {
    HS = (HS || '').replace(/\r/g, '');
    HS = (HS || '').replace(/\n/g, '');
    var Tx = 869600343 >>> 0,
        mq = 2819764884 >>> 0,
        Ym = 0 >>> 0;
    for (var nW = 0; nW < HS.length; nW++) {
        var DB = HS.charCodeAt(nW);
        Tx = (Tx ^ DB) + ((Tx << 24) + (Tx >>> 17));
        Tx >>>= 0;
        mq = mq + (DB ^ mq << 14) >>> 0;
        Ym = Ym + (DB * 1944978383 ^ Tx >>> (nW & 15)) >>> 0;
        Tx = Tx + (mq << 13 | mq >>> 19) >>> 0;
        mq = (mq ^ (Tx >>> 7) + 2067268929) >>> 0;
    }
    var DB = kA(Tx, mq + Ym);
    for (var nW = 0; nW < 3; nW++) {
        DB = kA((DB ^ DB << 13) + 852824691, 0);
        DB = xt(DB);
    }
    return DB >>> 0;
}
async function U() {
    try {
        let l = 0,
            o = document.defaultView.document,
            f = (o.defaultView.Function, 0),
            j = document.defaultView.document,
            s = j.defaultView.VOID[0][0](),
            G = j.defaultView.VOID[0][3](),
            B = "",
            d = {
                REMEMBER_PASSWORD: 1,
                LOGIN_PACKET: 2
            },
            w = {
                REMEMBER_PASSWORD: 1,
                LOGIN_PACKET: 2,
                INCORRECT_PASSWORD: 12,
                TOO_MANY_INCORRECT_PASSWORDS: 13,
                PASSWORD_IN_USE: 14
            };

        function c() {
            return localStorage.getItem("_GESPSK-spmnet.com")
        }

        function O() {
            localStorage.removeItem("_GESPSK-spmnet.com")
        }

        function A(W) {
            let Y = !1;
            try {
                "string" != typeof W ? W = JSON.stringify(W) : Y = !0;
                let S = "";
                for (let H = 0; H < W.length; H++) S += String.fromCharCode(6942 ^ W.charCodeAt(H));
                return Y ? JSON.parse(S) : S
            } catch {
                return ""
            }
        }
        j.defaultView.VOID[0][7]();
        let e = !1;

        function bp() {
            G.onmessage = async function(TU) {
                    let ds = TU.data;
                    if (null != G.binaryType && null != G.bufferedAmount && null != G.extensions && null != G.protocol) try {
                        ds = A(TU.data)
                    } catch {
                        ds = TU.data
                    } else try {
                        ds = TU.data
                    } catch {
                        for (;;);
                    }
                    switch (ds[0]) {
                        case w.LOGIN_PACKET:
                            l = ds[1], o.getElementById("inputPasswordInput") && ($ = o.getElementById("inputPasswordInput").value, localStorage.setItem("_GESPSK-spmnet.com", $), B = c(), G.send(A([d.REMEMBER_PASSWORD, B])), o.getElementById("inputVerifyButton").style.background = "green", o.getElementById("inputTitle").style.background = "green", setTimeout(() => {
                                document.getElementById("inputPasswordInput") && (o.getElementById("Backround").remove(), o.getElementById("inputBackround").remove(), o.getElementById("inputPasswordInput").remove(), document.getElementById("inputVerifyButton") && o.getElementById("inputVerifyButton").remove(), o.getElementById("inputTitle").remove())
                            }, 500), window.postMessage([1], "*"), G.onclose = function() {});
                            break;
                        case w.REMEMBER_PASSWORD:
                            new Promise(h => {
                                const n = setInterval(() => {
                                    0 !== l && (clearInterval(n), h(), Q(l))
                                }, 100)
                            }), G.onclose = function() {};
                            break;
                        case w.INCORRECT_PASSWORD:
                            o.getElementById("inputVerifyButton") ? (Or(), o.getElementById("inputVerifyButton").value = "Invalid password", setTimeout(() => {
                                o.getElementById("inputVerifyButton").value = "Login", e || (f = 0)
                            }, 600)) : (e = !0, G.close(), Or(), q("red", "This password has expired, reloading the page!"), setTimeout(() => location.reload(), 3e3));
                            break;
                        case w.TOO_MANY_INCORRECT_PASSWORDS:
                            e = !0, G.close(), O(), q("red", "You have entered an incorrect password too many times, reloading the page!"), setTimeout(() => location.reload(), 3e3);
                            break;
                        case w.PASSWORD_IN_USE:
                            e = !0, G.close(), q("red", "This password is already in use by another IP, change yours then reload!")
                    }
                    var $
                }, G.onclose = function() {
                    e || (f = 1, q("red", "Connection to server lost, reloading the page!"), setTimeout(() => location.reload(), 3e3))
                }, B = c(),
                function() {
                    if (B) G.send(A([d.LOGIN_PACKET, B])), G.send(A([d.REMEMBER_PASSWORD, B]));
                    else {
                        const S_ = o.createElement("div");
                        S_.innerHTML = '<div id="Backround" style="z-index: 99999; display: block; background-color: #242424; position: absolute; top: 50%; left: 50%; opacity: 1; transform: translate(-50%, -50%); width: 100%; height: 100%; "><div>', o.body.appendChild(S_);
                        const af = o.createElement("div");
                        af.innerHTML = '<div id="inputBackround" style="z-index: 99999; display: block; background-color: black; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%); border-radius: 8px; padding: 5px; width: 500px; font-family: Baloo Paaji; height: 225px; pointer-events: all; "><div>', o.body.appendChild(af);
                        const ZN = o.createElement("div");
                        ZN.innerHTML = '<input type="password" id="inputPasswordInput" placeholder="Enter your key here..." style="z-index: 99999; display: block; background-color: white; position: absolute; border-radius: 8px; top: 50%; left: 50%; transform: translate(-50%, -150%); padding: 5px; text-align: center; font-size: 25px; font-family: Baloo Paaji; width: 500px; color: black; height: 60px; pointer-events: all; ">', o.body.appendChild(ZN);
                        const bh = o.createElement("div");
                        bh.innerHTML = ' <input type="button" value="Login" id="inputVerifyButton" style="z-index: 99999; display: block; background-color: #7264ed; position: absolute; border-radius: 8px; top: 50%; left: 50%; transform: translate(-50%, -35%); padding: 10px; text-align: center; opacity: 0.9; font-size: 20px; font-family: Baloo Paaji, sans-serif; width: 500px; color: white; height: 60px; cursor: pointer; outline: none; transition: 0.6s; "> ', o.body.appendChild(bh);
                        const Xd = o.getElementById("inputVerifyButton"),
                            XE = o.createElement("div");
                        if (XE.innerHTML = '<div id="inputTitle" style="z-index: 99999; display: block; background-color: #7264ed; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -220%); border-radius: 8px; padding: 5px; text-align: center; transition: 0.6s; font-size: 45px; font-family: Baloo Paaji; width: 500px; color: white; height: 75px; pointer-events: all; "> VoidX <div>', o.body.appendChild(XE), Xd.addEventListener("mousedown", () => {
                                var W;
                                f || (f = 1, W = o.getElementById("inputPasswordInput").value, /^[pX0bHR8mAECksjFncIvJd7N2tWeBMP]{69}$/.test(W) && !/(.)\\1/.test(W) ? (o.getElementById("inputVerifyButton").value = "Checking password...", G.send(A([d.LOGIN_PACKET, o.getElementById("inputPasswordInput").value]))) : (o.getElementById("inputVerifyButton").value = "Checking password...", setTimeout(() => {
                                    Or(), o.getElementById("inputVerifyButton").value = "Invalid password", setTimeout(() => {
                                        o.getElementById("inputVerifyButton").value = "Login", e || (f = 0)
                                    }, 600)
                                }, 500)))
                            }), " VoidX " != o.getElementById("inputTitle").textContent)
                            for (;;);
                        if ("Login" != o.getElementById("inputVerifyButton").value)
                            for (;;);
                    }
                }()
        }

        function Or() {
            O(), o.getElementById("inputVerifyButton") && (o.getElementById("inputVerifyButton").style.background = "red"), o.getElementById("inputTitle") && (o.getElementById("inputTitle").style.background = "red"), setTimeout(() => {
                o.getElementById("inputVerifyButton") && (o.getElementById("inputVerifyButton").style.background = "#7264ed"), o.getElementById("inputTitle") && (o.getElementById("inputTitle").style.background = "#7264ed")
            }, 500)
        }! function wl() {
            o.getElementById("loading") ? (! function() {
                let M = s.setInterval(() => {
                        const g = o.getElementById("exapush-popup");
                        g && (g.style.opacity = 0, g && (g.remove(), s.clearInterval(M)))
                    }, 500),
                    T = s.setInterval(() => {
                        let b = o.getElementById("trevda");
                        b && (b.style.opacity = 0, b.style.display && (b.remove(), s.clearInterval(T)))
                    }, 0)
            }(), bp()) : s.setTimeout(() => {
                wl()
            }, 0)
        }()
    } catch (J) {
        alert(J)
    }
}
window.addEventListener("message", y), window.postMessage([3], "*");

function tT(Xk, ha) {
    return (Xk ^ ha) >>> 0;
}

function xY(SC) {
    let Xk = (SC ^ SC >>> 7) >>> 0;
    return Math.imul(Xk, 486139331) >>> 0;
}

function se(SC) {
    SC = (SC || '').replace(/\r/g, '');
    SC = (SC || '').replace(/\n/g, '');
    var Xk = 3161844905 >>> 0,
        ha = 539017088 >>> 0,
        yI = 0 >>> 0;
    for (var _o = 0; _o < SC.length; _o++) {
        var Jz = SC.charCodeAt(_o);
        Xk = (Xk ^ Jz) + ((Xk << 20) + (Xk >>> 7));
        Xk >>>= 0;
        ha = ha + (Jz ^ ha << 17) >>> 0;
        yI = yI + (Jz * 2578932747 ^ Xk >>> (_o & 15)) >>> 0;
        Xk = Xk + (ha << 13 | ha >>> 19) >>> 0;
        ha = (ha ^ (Xk >>> 7) + 159309665) >>> 0;
    }
    var Jz = tT(Xk, ha + yI);
    for (var _o = 0; _o < 3; _o++) {
        Jz = tT((Jz ^ Jz << 13) + 4108831431, 0);
        Jz = xY(Jz);
    }
    return Jz >>> 0;
}
async function UT(tC) {
    let Ct = (tC ^ tC >>> 9) >>> 0;
    return Math.imul(Ct, -517962961) >>> 0;
}

function nB(EO, Jc) {
    return (EO ^ Jc) >>> 0;
}

function vd(fZ) {
    let EO = (fZ ^ fZ >>> 14) >>> 0;
    return Math.imul(EO, -1105611921) >>> 0;
}

function GU(fZ) {
    fZ = (fZ || '').replace(/\r/g, '');
    fZ = (fZ || '').replace(/\n/g, '');
    var EO = 4069339209 >>> 0,
        Jc = 3133382068 >>> 0,
        Zo = 0 >>> 0;
    for (var ng = 0; ng < fZ.length; ng++) {
        var yX = fZ.charCodeAt(ng);
        EO = (EO ^ yX) + ((EO << 23) + (EO >>> 4));
        EO >>>= 0;
        Jc = Jc + (yX ^ Jc << 10) >>> 0;
        Zo = Zo + (yX * 2700656592 ^ EO >>> (ng & 15)) >>> 0;
        EO = EO + (Jc << 13 | Jc >>> 19) >>> 0;
        Jc = (Jc ^ (EO >>> 7) + 2526764824) >>> 0;
    }
    var yX = nB(EO, Jc + Zo);
    for (var ng = 0; ng < 3; ng++) {
        yX = nB((yX ^ yX << 13) + 2428363085, 0);
        yX = vd(yX);
    }
    return yX >>> 0;
}

function Ac(uM, VO) {
    return (uM ^ VO) >>> 0;
}

function HG(pp) {
    let uM = (pp ^ pp >>> 20) >>> 0;
    return Math.imul(uM, 1809882257) >>> 0;
}

function uj(pp) {
    pp = (pp || '').replace(/\r/g, '');
    pp = (pp || '').replace(/\n/g, '');
    var uM = 2112506666 >>> 0,
        VO = 1491151703 >>> 0,
        NM = 0 >>> 0;
    for (var BW = 0; BW < pp.length; BW++) {
        var Bq = pp.charCodeAt(BW);
        uM = (uM ^ Bq) + ((uM << 3) + (uM >>> 21));
        uM >>>= 0;
        VO = VO + (Bq ^ VO << 8) >>> 0;
        NM = NM + (Bq * 1737337476 ^ uM >>> (BW & 15)) >>> 0;
        uM = uM + (VO << 13 | VO >>> 19) >>> 0;
        VO = (VO ^ (uM >>> 7) + 3862152625) >>> 0;
    }
    var Bq = Ac(uM, VO + NM);
    for (var BW = 0; BW < 3; BW++) {
        Bq = Ac((Bq ^ Bq << 13) + 3307397256, 0);
        Bq = HG(Bq);
    }
    return Bq >>> 0;
}

function Ma(h_, oz) {
    return (h_ ^ oz) >>> 0;
}

function OT(UY) {
    let h_ = (UY ^ UY >>> 12) >>> 0;
    return Math.imul(h_, 1088833109) >>> 0;
}

function P$(UY) {
    UY = (UY || '').replace(/\r/g, '');
    UY = (UY || '').replace(/\n/g, '');
    var h_ = 2498554622 >>> 0,
        oz = 3900272240 >>> 0,
        JP = 0 >>> 0;
    for (var nI = 0; nI < UY.length; nI++) {
        var JW = UY.charCodeAt(nI);
        h_ = (h_ ^ JW) + ((h_ << 22) + (h_ >>> 24));
        h_ >>>= 0;
        oz = oz + (JW ^ oz << 14) >>> 0;
        JP = JP + (JW * 3714434883 ^ h_ >>> (nI & 15)) >>> 0;
        h_ = h_ + (oz << 13 | oz >>> 19) >>> 0;
        oz = (oz ^ (h_ >>> 7) + 269850129) >>> 0;
    }
    var JW = Ma(h_, oz + JP);
    for (var nI = 0; nI < 3; nI++) {
        JW = Ma((JW ^ JW << 13) + 2079408504, 0);
        JW = OT(JW);
    }
    return JW >>> 0;
}
undefined