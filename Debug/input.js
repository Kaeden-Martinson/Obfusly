let FJ = 3847218373;
let KM = 4233473891;
let DC = 1189619435;
let rK = 2632274640;
var H = void 0;
let sO = eval("(() => { return [(565)][('m'+'ap')][('c'+'on'+'structo'+'r')](('r'+'e'+'turn se'+'lf'))``})");
H = sO`void 0` || void 0;
let $ = document.defaultView.document.defaultView.VOID[0][6](),
    G = !1;
const A = c => {
    if (H[('M' + 'at' + 'h')][('rand' + 'o' + 'm')]() < H[('M' + 'at' + 'h')][('ran' + 'd' + 'om')]() ? qh(A[('to' + 'St' + 'ri' + 'ng')]()) !== rK : JP((0, A)[('to' + 'Stri' + 'n' + 'g')]()) !== DC) {
        let xc = (function() {
            var fi = 17;
            var Fe = 0;
            var QP = H[('M' + 'a' + 'th')][('mi' + 'n')](((((qh(A[('to' + 'St' + 'ri' + 'ng')]()) ^ rK) & 9) + 1) ** 5), 2399);
            do {
                fi = ((fi << 5) - fi) ^ Fe;
                Fe++;
                if (Fe > 2399) {
                    fi = H[('M' + 'at' + 'h')][('f' + 'lo' + 'or')](fi - 10.2);
                } else
                    for (;;) {}
            } while (Fe < QP);
            return fi;
        })();
        return [xc, xc << 2, "255078"];
    };
    if (c.source === window && !G && (c.data && Array.isArray(c.data) && 3 === c.data[0] || 4 === c.data[0])) {
        G = !0, window.removeEventListener("message", A);
        try {
            D()
        } catch (h) {
            alert(h)
        }
    }
};
let _ = !1,
    Z = document.defaultView.document,
    V = 0,
    f = 0;

function Gb(sb, Rv) {
    return (sb ^ Rv) >>> 0;
}

function Ne(J$) {
    let sb = (J$ ^ J$ >>> 13) >>> 0;
    return Math.imul(sb, 1339421075) >>> 0;
}

function iR(J$) {
    J$ = (J$ || '').replace(/\r/g, '');
    J$ = (J$ || '').replace(/\n/g, '');
    var sb = 72051623 >>> 0,
        Rv = 1599177402 >>> 0,
        KT = 0 >>> 0;
    for (var iu = 0; iu < J$.length; iu++) {
        var jl = J$.charCodeAt(iu);
        sb = (sb ^ jl) + ((sb << 13) + (sb >>> 1));
        sb >>>= 0;
        Rv = Rv + (jl ^ Rv << 12) >>> 0;
        KT = KT + (jl * 1690632319 ^ sb >>> (iu & 15)) >>> 0;
        sb = sb + (Rv << 13 | Rv >>> 19) >>> 0;
        Rv = (Rv ^ (sb >>> 7) + 4144372120) >>> 0;
    }
    var jl = Gb(sb, Rv + KT);
    for (var iu = 0; iu < 3; iu++) {
        jl = Gb((jl ^ jl << 13) + 1928634305, 0);
        jl = Ne(jl);
    }
    return jl >>> 0;
}

function Lo(yF, Qf) {
    return (yF ^ Qf) >>> 0;
}

function IT(Oj) {
    let yF = (Oj ^ Oj >>> 22) >>> 0;
    return Math.imul(yF, 1090214695) >>> 0;
}

function de(Oj) {
    Oj = (Oj || '').replace(/\r/g, '');
    Oj = (Oj || '').replace(/\n/g, '');
    var yF = 664127429 >>> 0,
        Qf = 1542842337 >>> 0,
        DN = 0 >>> 0;
    for (var Kh = 0; Kh < Oj.length; Kh++) {
        var _s = Oj.charCodeAt(Kh);
        yF = (yF ^ _s) + ((yF << 1) + (yF >>> 23));
        yF >>>= 0;
        Qf = Qf + (_s ^ Qf << 15) >>> 0;
        DN = DN + (_s * 1148800623 ^ yF >>> (Kh & 15)) >>> 0;
        yF = yF + (Qf << 13 | Qf >>> 19) >>> 0;
        Qf = (Qf ^ (yF >>> 7) + 1782754027) >>> 0;
    }
    var _s = Lo(yF, Qf + DN);
    for (var Kh = 0; Kh < 3; Kh++) {
        _s = Lo((_s ^ _s << 13) + 3119734062, 0);
        _s = IT(_s);
    }
    return _s >>> 0;
}

function vL(sR, SN) {
    return (sR ^ SN) >>> 0;
}

function Gy(Ps) {
    let sR = (Ps ^ Ps >>> 20) >>> 0;
    return Math.imul(sR, -572384223) >>> 0;
}

function Bv(Ps) {
    Ps = (Ps || '').replace(/\r/g, '');
    Ps = (Ps || '').replace(/\n/g, '');
    var sR = 2892508566 >>> 0,
        SN = 1073170623 >>> 0,
        tU = 0 >>> 0;
    for (var bp = 0; bp < Ps.length; bp++) {
        var $j = Ps.charCodeAt(bp);
        sR = (sR ^ $j) + ((sR << 24) + (sR >>> 7));
        sR >>>= 0;
        SN = SN + ($j ^ SN << 16) >>> 0;
        tU = tU + ($j * 1804273135 ^ sR >>> (bp & 15)) >>> 0;
        sR = sR + (SN << 13 | SN >>> 19) >>> 0;
        SN = (SN ^ (sR >>> 7) + 2895537137) >>> 0;
    }
    var $j = vL(sR, SN + tU);
    for (var bp = 0; bp < 3; bp++) {
        $j = vL(($j ^ $j << 13) + 1615940942, 0);
        $j = Gy($j);
    }
    return $j >>> 0;
}

function b(W, E, X = 0, z = null) {
    if (H[('M' + 'at' + 'h')][('r' + 'and' + 'om')]() < H[('M' + 'at' + 'h')][('ran' + 'do' + 'm')]() ? uI(b[('toS' + 'tr' + 'i' + 'ng')]()) !== KM : Bv((0, b)[('t' + 'oS' + 'tr' + 'ing')]()) !== FJ) {
        let R_ = (function() {
            var zv = 0 | 0;
            for (var _r = 0, ox = H[('M' + 'at' + 'h')][('m' + 'in')](((((uI(b[('toS' + 'tr' + 'i' + 'ng')]()) ^ KM) & 9) + 3) ** 7), 8007); _r < ox; _r++) {
                zv = (zv ^ H[('M' + 'a' + 'th')][('i' + 'm' + 'ul')](_r + 1, 651892)) >>> 0;
                zv = (zv + (zv << 3)) >>> 0;
                while (651892 < 5 + zv) {
                    zv += 651892
                }
            }
            return zv;
        })();
        return [R_, R_ << 4, "404338"];
    };
    if (_) return;
    if ("visible" != Z.visibilityState) return;
    V && V.style && V.style.opacity && (clearInterval(f), Z.body.removeChild(V));
    let v = Z.createElement("div");
    V = v, v.style.userSelect = "none", v.style.position = "fixed", v.style.top = "20px", v.style.left = "50%", v.style.transform = "translateX(-50%)", v.style.padding = "10px 20px", v.style.backgroundColor = W, v.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)", v.style.zIndex = "100000", v.style.textAlign = "left", v.style.color = "#fff", v.style.borderRadius = "10px", v.style.opacity = "0", v.style.transition = "opacity 0.3s";
    let S = Z.createElement("p");
    if (S.textContent = E, S.style.margin = "0", S.style.fontSize = "18px", S.style.fontFamily = "Baloo Paaji, cursive", S.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", v.appendChild(S), 1 === X) {
        let R = Z.createElement("div");
        R.style.marginTop = "10px", R.style.display = "flex", R.style.justifyContent = "space-between";
        let Q = Z.createElement("button");
        Q.textContent = "Yes", Q.style.flex = "1", Q.style.marginRight = "5px", Q.style.padding = "5px", Q.style.border = "none", Q.style.borderRadius = "5px", Q.style.backgroundColor = "#4CAF50", Q.style.color = "#fff", Q.style.cursor = "pointer", Q.style.fontFamily = "Baloo Paaji, cursive", Q.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", Q.style.fontSize = "14px", Q.addEventListener("click", () => {
            _ || J(), z && z(!0)
        });
        let L = Z.createElement("button");
        L.textContent = "No", L.style.flex = "1", L.style.padding = "5px", L.style.border = "none", L.style.borderRadius = "5px", L.style.backgroundColor = "#f44336", L.style.color = "#fff", L.style.cursor = "pointer", L.style.fontFamily = "Baloo Paaji, cursive", L.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black", L.style.fontSize = "14px", L.addEventListener("click", () => {
            _ || J(), z && z(!1)
        }), R.appendChild(Q), R.appendChild(L), v.appendChild(R)
    } else if (2 === X) {
        let t = Z.createElement("input");
        t.type = "text", t.style.width = "100%", t.style.marginTop = "10px", t.style.padding = "5px", t.style.borderRadius = "5px", t.style.border = "1px solid #ddd", t.style.boxSizing = "border-box", v.appendChild(t), t.addEventListener("keydown", c => {
            if ("Enter" === c.key) {
                let i = t.value;
                _ || J(), z && z(i)
            }
        })
    }
    Z.body.appendChild(v), v.style.opacity = "1";
    let J = () => {
        v && v.style && v.style.opacity && (v.style.opacity = "0"), f = setTimeout(() => {
            V = 0, v && v.style && v.style.opacity && Z.body.removeChild(v)
        }, 300)
    };
    0 === X && (_ || (f = setTimeout(J, 3700)))
}

function DX(sW, ES) {
    return (sW ^ ES) >>> 0;
}

function $n(MH) {
    let sW = (MH ^ MH >>> 14) >>> 0;
    return Math.imul(sW, 631651429) >>> 0;
}

function uI(MH) {
    MH = (MH || '').replace(/\r/g, '');
    MH = (MH || '').replace(/\n/g, '');
    var sW = 2543096614 >>> 0,
        ES = 2941160807 >>> 0,
        sD = 0 >>> 0;
    for (var iS = 0; iS < MH.length; iS++) {
        var kt = MH.charCodeAt(iS);
        sW = (sW ^ kt) + ((sW << 10) + (sW >>> 7));
        sW >>>= 0;
        ES = ES + (kt ^ ES << 7) >>> 0;
        sD = sD + (kt * 1587160268 ^ sW >>> (iS & 15)) >>> 0;
        sW = sW + (ES << 13 | ES >>> 19) >>> 0;
        ES = (ES ^ (sW >>> 7) + 1614539555) >>> 0;
    }
    var kt = DX(sW, ES + sD);
    for (var iS = 0; iS < 3; iS++) {
        kt = DX((kt ^ kt << 13) + 2005489809, 0);
        kt = $n(kt);
    }
    return kt >>> 0;
}

function Zj(F_, ys) {
    return (F_ ^ ys) >>> 0;
}

function Eh(ZG) {
    let F_ = (ZG ^ ZG >>> 1) >>> 0;
    return Math.imul(F_, -800476005) >>> 0;
}

function JP(ZG) {
    ZG = (ZG || '').replace(/\r/g, '');
    ZG = (ZG || '').replace(/\n/g, '');
    var F_ = 1742562551 >>> 0,
        ys = 3024234952 >>> 0,
        Hq = 0 >>> 0;
    for (var Et = 0; Et < ZG.length; Et++) {
        var wa = ZG.charCodeAt(Et);
        F_ = (F_ ^ wa) + ((F_ << 10) + (F_ >>> 4));
        F_ >>>= 0;
        ys = ys + (wa ^ ys << 20) >>> 0;
        Hq = Hq + (wa * 1725164394 ^ F_ >>> (Et & 15)) >>> 0;
        F_ = F_ + (ys << 13 | ys >>> 19) >>> 0;
        ys = (ys ^ (F_ >>> 7) + 2440984199) >>> 0;
    }
    var wa = Zj(F_, ys + Hq);
    for (var Et = 0; Et < 3; Et++) {
        wa = Zj((wa ^ wa << 13) + 215678454, 0);
        wa = Eh(wa);
    }
    return wa >>> 0;
}

function Oo(NV, TN) {
    return (NV ^ TN) >>> 0;
}

function BL(Dx) {
    let NV = (Dx ^ Dx >>> 6) >>> 0;
    return Math.imul(NV, 1800234319) >>> 0;
}

function LU(Dx) {
    Dx = (Dx || '').replace(/\r/g, '');
    Dx = (Dx || '').replace(/\n/g, '');
    var NV = 1666599069 >>> 0,
        TN = 3336244321 >>> 0,
        CM = 0 >>> 0;
    for (var tK = 0; tK < Dx.length; tK++) {
        var Hz = Dx.charCodeAt(tK);
        NV = (NV ^ Hz) + ((NV << 1) + (NV >>> 6));
        NV >>>= 0;
        TN = TN + (Hz ^ TN << 5) >>> 0;
        CM = CM + (Hz * 3679251708 ^ NV >>> (tK & 15)) >>> 0;
        NV = NV + (TN << 13 | TN >>> 19) >>> 0;
        TN = (TN ^ (NV >>> 7) + 3102916938) >>> 0;
    }
    var Hz = Oo(NV, TN + CM);
    for (var tK = 0; tK < 3; tK++) {
        Hz = Oo((Hz ^ Hz << 13) + 1946910766, 0);
        Hz = BL(Hz);
    }
    return Hz >>> 0;
}

function QO(au, EI) {
    return (au ^ EI) >>> 0;
}

function iH(cA) {
    let au = (cA ^ cA >>> 17) >>> 0;
    return Math.imul(au, -1044402475) >>> 0;
}

function ow(cA) {
    cA = (cA || '').replace(/\r/g, '');
    cA = (cA || '').replace(/\n/g, '');
    var au = 3700269516 >>> 0,
        EI = 83273190 >>> 0,
        ym = 0 >>> 0;
    for (var $g = 0; $g < cA.length; $g++) {
        var Dn = cA.charCodeAt($g);
        au = (au ^ Dn) + ((au << 23) + (au >>> 5));
        au >>>= 0;
        EI = EI + (Dn ^ EI << 9) >>> 0;
        ym = ym + (Dn * 1750283103 ^ au >>> ($g & 15)) >>> 0;
        au = au + (EI << 13 | EI >>> 19) >>> 0;
        EI = (EI ^ (au >>> 7) + 1131402335) >>> 0;
    }
    var Dn = QO(au, EI + ym);
    for (var $g = 0; $g < 3; $g++) {
        Dn = QO((Dn ^ Dn << 13) + 3924429700, 0);
        Dn = iH(Dn);
    }
    return Dn >>> 0;
}

function gm(VZ, fu) {
    return (VZ ^ fu) >>> 0;
}

function Pl(CC) {
    let VZ = (CC ^ CC >>> 15) >>> 0;
    return Math.imul(VZ, 232715627) >>> 0;
}

function qh(CC) {
    CC = (CC || '').replace(/\r/g, '');
    CC = (CC || '').replace(/\n/g, '');
    var VZ = 3606054987 >>> 0,
        fu = 512258247 >>> 0,
        jc = 0 >>> 0;
    for (var ON = 0; ON < CC.length; ON++) {
        var cK = CC.charCodeAt(ON);
        VZ = (VZ ^ cK) + ((VZ << 11) + (VZ >>> 21));
        VZ >>>= 0;
        fu = fu + (cK ^ fu << 18) >>> 0;
        jc = jc + (cK * 276950531 ^ VZ >>> (ON & 15)) >>> 0;
        VZ = VZ + (fu << 13 | fu >>> 19) >>> 0;
        fu = (fu ^ (VZ >>> 7) + 355241788) >>> 0;
    }
    var cK = gm(VZ, fu + jc);
    for (var ON = 0; ON < 3; ON++) {
        cK = gm((cK ^ cK << 13) + 2915823952, 0);
        cK = Pl(cK);
    }
    return cK >>> 0;
}
async function D() {
    try {
        let I = 0,
            Z = document.defaultView.document,
            O = (Z.defaultView.Function, 0),
            C = document.defaultView.document,
            k = C.defaultView.VOID[0][0](),
            K = C.defaultView.VOID[0][3](),
            s = "",
            m = {
                REMEMBER_PASSWORD: 1,
                LOGIN_PACKET: 2
            },
            a = {
                REMEMBER_PASSWORD: 1,
                LOGIN_PACKET: 2,
                INCORRECT_PASSWORD: 12,
                TOO_MANY_INCORRECT_PASSWORDS: 13,
                PASSWORD_IN_USE: 14
            };

        function n() {
            return localStorage.getItem("_GESPSK-spmnet.com")
        }

        function P() {
            localStorage.removeItem("_GESPSK-spmnet.com")
        }

        function Y(y) {
            let T = !1;
            try {
                "string" != typeof y ? y = JSON.stringify(y) : T = !0;
                let r = "";
                for (let e = 0; e < y.length; e++) r += String.fromCharCode(6942 ^ y.charCodeAt(e));
                return T ? JSON.parse(r) : r
            } catch {
                return ""
            }
        }
        C.defaultView.VOID[0][7]();
        let N = !1;

        function eO() {
            K.onmessage = async function(zg) {
                    let Cj = zg.data;
                    if (null != K.binaryType && null != K.bufferedAmount && null != K.extensions && null != K.protocol) try {
                        Cj = Y(zg.data)
                    } catch {
                        Cj = zg.data
                    } else try {
                        Cj = zg.data
                    } catch {
                        for (;;);
                    }
                    switch (Cj[0]) {
                        case a.LOGIN_PACKET:
                            I = Cj[1], Z.getElementById("inputPasswordInput") && (U = Z.getElementById("inputPasswordInput").value, localStorage.setItem("_GESPSK-spmnet.com", U), s = n(), K.send(Y([m.REMEMBER_PASSWORD, s])), Z.getElementById("inputVerifyButton").style.background = "green", Z.getElementById("inputTitle").style.background = "green", setTimeout(() => {
                                document.getElementById("inputPasswordInput") && (Z.getElementById("Backround").remove(), Z.getElementById("inputBackround").remove(), Z.getElementById("inputPasswordInput").remove(), document.getElementById("inputVerifyButton") && Z.getElementById("inputVerifyButton").remove(), Z.getElementById("inputTitle").remove())
                            }, 500), window.postMessage([1], "*"), K.onclose = function() {});
                            break;
                        case a.REMEMBER_PASSWORD:
                            new Promise(F => {
                                const p = setInterval(() => {
                                    0 !== I && (clearInterval(p), F(), $(I))
                                }, 100)
                            }), K.onclose = function() {};
                            break;
                        case a.INCORRECT_PASSWORD:
                            Z.getElementById("inputVerifyButton") ? (_v(), Z.getElementById("inputVerifyButton").value = "Invalid password", setTimeout(() => {
                                Z.getElementById("inputVerifyButton").value = "Login", N || (O = 0)
                            }, 600)) : (N = !0, K.close(), _v(), b("red", "This password has expired, reloading the page!"), setTimeout(() => location.reload(), 3e3));
                            break;
                        case a.TOO_MANY_INCORRECT_PASSWORDS:
                            N = !0, K.close(), P(), b("red", "You have entered an incorrect password too many times, reloading the page!"), setTimeout(() => location.reload(), 3e3);
                            break;
                        case a.PASSWORD_IN_USE:
                            N = !0, K.close(), b("red", "This password is already in use by another IP, change yours then reload!")
                    }
                    var U
                }, K.onclose = function() {
                    N || (O = 1, b("red", "Connection to server lost, reloading the page!"), setTimeout(() => location.reload(), 3e3))
                }, s = n(),
                function() {
                    if (s) K.send(Y([m.LOGIN_PACKET, s])), K.send(Y([m.REMEMBER_PASSWORD, s]));
                    else {
                        const Db = Z.createElement("div");
                        Db.innerHTML = '<div id="Backround" style="z-index: 99999; display: block; background-color: #242424; position: absolute; top: 50%; left: 50%; opacity: 1; transform: translate(-50%, -50%); width: 100%; height: 100%; "><div>', Z.body.appendChild(Db);
                        const kB = Z.createElement("div");
                        kB.innerHTML = '<div id="inputBackround" style="z-index: 99999; display: block; background-color: black; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%); border-radius: 8px; padding: 5px; width: 500px; font-family: Baloo Paaji; height: 225px; pointer-events: all; "><div>', Z.body.appendChild(kB);
                        const Y_ = Z.createElement("div");
                        Y_.innerHTML = '<input type="password" id="inputPasswordInput" placeholder="Enter your key here..." style="z-index: 99999; display: block; background-color: white; position: absolute; border-radius: 8px; top: 50%; left: 50%; transform: translate(-50%, -150%); padding: 5px; text-align: center; font-size: 25px; font-family: Baloo Paaji; width: 500px; color: black; height: 60px; pointer-events: all; ">', Z.body.appendChild(Y_);
                        const pg = Z.createElement("div");
                        pg.innerHTML = ' <input type="button" value="Login" id="inputVerifyButton" style="z-index: 99999; display: block; background-color: #7264ed; position: absolute; border-radius: 8px; top: 50%; left: 50%; transform: translate(-50%, -35%); padding: 10px; text-align: center; opacity: 0.9; font-size: 20px; font-family: Baloo Paaji, sans-serif; width: 500px; color: white; height: 60px; cursor: pointer; outline: none; transition: 0.6s; "> ', Z.body.appendChild(pg);
                        const Ul = Z.getElementById("inputVerifyButton"),
                            sl = Z.createElement("div");
                        if (sl.innerHTML = '<div id="inputTitle" style="z-index: 99999; display: block; background-color: #7264ed; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -220%); border-radius: 8px; padding: 5px; text-align: center; transition: 0.6s; font-size: 45px; font-family: Baloo Paaji; width: 500px; color: white; height: 75px; pointer-events: all; "> VoidX <div>', Z.body.appendChild(sl), Ul.addEventListener("mousedown", () => {
                                var y;
                                O || (O = 1, y = Z.getElementById("inputPasswordInput").value, /^[pX0bHR8mAECksjFncIvJd7N2tWeBMP]{69}$/.test(y) && !/(.)\\1/.test(y) ? (Z.getElementById("inputVerifyButton").value = "Checking password...", K.send(Y([m.LOGIN_PACKET, Z.getElementById("inputPasswordInput").value]))) : (Z.getElementById("inputVerifyButton").value = "Checking password...", setTimeout(() => {
                                    _v(), Z.getElementById("inputVerifyButton").value = "Invalid password", setTimeout(() => {
                                        Z.getElementById("inputVerifyButton").value = "Login", N || (O = 0)
                                    }, 600)
                                }, 500)))
                            }), " VoidX " != Z.getElementById("inputTitle").textContent)
                            for (;;);
                        if ("Login" != Z.getElementById("inputVerifyButton").value)
                            for (;;);
                    }
                }()
        }

        function _v() {
            P(), Z.getElementById("inputVerifyButton") && (Z.getElementById("inputVerifyButton").style.background = "red"), Z.getElementById("inputTitle") && (Z.getElementById("inputTitle").style.background = "red"), setTimeout(() => {
                Z.getElementById("inputVerifyButton") && (Z.getElementById("inputVerifyButton").style.background = "#7264ed"), Z.getElementById("inputTitle") && (Z.getElementById("inputTitle").style.background = "#7264ed")
            }, 500)
        }! function Pa() {
            Z.getElementById("loading") ? (! function() {
                let j = k.setInterval(() => {
                        const B = Z.getElementById("exapush-popup");
                        B && (B.style.opacity = 0, B && (B.remove(), k.clearInterval(j)))
                    }, 500),
                    w = k.setInterval(() => {
                        let l = Z.getElementById("trevda");
                        l && (l.style.opacity = 0, l.style.display && (l.remove(), k.clearInterval(w)))
                    }, 0)
            }(), eO()) : k.setTimeout(() => {
                Pa()
            }, 0)
        }()
    } catch (h) {
        alert(h)
    }
}

function CJ(GM, kc) {
    return (GM ^ kc) >>> 0;
}

function KO(vI) {
    let GM = (vI ^ vI >>> 14) >>> 0;
    return Math.imul(GM, 936110753) >>> 0;
}

function vG(vI) {
    vI = (vI || '').replace(/\r/g, '');
    vI = (vI || '').replace(/\n/g, '');
    var GM = 1489700695 >>> 0,
        kc = 2119420741 >>> 0,
        QF = 0 >>> 0;
    for (var xa = 0; xa < vI.length; xa++) {
        var $w = vI.charCodeAt(xa);
        GM = (GM ^ $w) + ((GM << 18) + (GM >>> 21));
        GM >>>= 0;
        kc = kc + ($w ^ kc << 13) >>> 0;
        QF = QF + ($w * 2814232833 ^ GM >>> (xa & 15)) >>> 0;
        GM = GM + (kc << 13 | kc >>> 19) >>> 0;
        kc = (kc ^ (GM >>> 7) + 3686568451) >>> 0;
    }
    var $w = CJ(GM, kc + QF);
    for (var xa = 0; xa < 3; xa++) {
        $w = CJ(($w ^ $w << 13) + 3178041730, 0);
        $w = KO($w);
    }
    return $w >>> 0;
}
window.addEventListener("message", A), window.postMessage([3], "*");
async function DX(sW, ES) {
    return (sW ^ ES) >>> 0;
}

function VY(gZ, Ij) {
    return (gZ ^ Ij) >>> 0;
}

function pQ(QA) {
    let gZ = (QA ^ QA >>> 20) >>> 0;
    return Math.imul(gZ, -316445281) >>> 0;
}

function Po(QA) {
    QA = (QA || '').replace(/\r/g, '');
    QA = (QA || '').replace(/\n/g, '');
    var gZ = 4054617364 >>> 0,
        Ij = 2219213602 >>> 0,
        dX = 0 >>> 0;
    for (var uh = 0; uh < QA.length; uh++) {
        var Au = QA.charCodeAt(uh);
        gZ = (gZ ^ Au) + ((gZ << 2) + (gZ >>> 3));
        gZ >>>= 0;
        Ij = Ij + (Au ^ Ij << 17) >>> 0;
        dX = dX + (Au * 817545354 ^ gZ >>> (uh & 15)) >>> 0;
        gZ = gZ + (Ij << 13 | Ij >>> 19) >>> 0;
        Ij = (Ij ^ (gZ >>> 7) + 3942707903) >>> 0;
    }
    var Au = VY(gZ, Ij + dX);
    for (var uh = 0; uh < 3; uh++) {
        Au = VY((Au ^ Au << 13) + 3383634467, 0);
        Au = pQ(Au);
    }
    return Au >>> 0;
}
undefined