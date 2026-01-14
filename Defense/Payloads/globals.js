async function createSandboxAndProtect({
    iframeId = '__clean_realm_iframe__',
    autoCheckInterval = 0
} = {}) {
    const isNode = (typeof window === 'undefined');

    const looksNativeString = (src) => {
        if (typeof src !== 'string') return false;
        const normalized = src.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ');
        return /\[native code\]/.test(normalized);
    };

    function safeGetDesc(target, prop) {
        try { return Object.getOwnPropertyDescriptor(target, prop); } catch (e) { return null; }
    }

    if (isNode) return { safe: true, checkIntegrity: function () { return "Stopping in node" } };

    // -------- BROWSER IMPLEMENTATION --------
    return new Promise((resolve, reject) => {
        try {
            let iframe = document.getElementById(iframeId);
            if (iframe) iframe.remove();

            iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.style.display = 'none';
            // same-origin about:blank by default
            document.documentElement.appendChild(iframe);

            iframe.onload = initRealm;
            setTimeout(() => { if (iframe.contentWindow) initRealm(); }, 50);

            function initRealm() {
                try {
                    const realm = iframe.contentWindow;
                    
                    Object.freeze(realm.Object);
                    Object.freeze(realm.Function);
                    Object.freeze(realm.Reflect);
                    Object.freeze(realm.WebSocket);
                    Object.freeze(realm.fetch);
                    Object.freeze(realm.console);

                    const TO_CHECK = [
                        // globals
                        { key: 'fetch', getClean: () => realm.fetch, descTarget: () => window, prop: 'fetch' },
                        { key: 'WebSocket', getClean: () => realm.WebSocket, descTarget: () => window, prop: 'WebSocket' },
                        { key: 'XMLHttpRequest', getClean: () => realm.XMLHttpRequest, descTarget: () => window, prop: 'XMLHttpRequest' },

                        // console methods (on console)
                        { key: 'console.log', getClean: () => realm.console.log, descTarget: () => window.console, prop: 'log' },
                        { key: 'console.warn', getClean: () => realm.console.warn, descTarget: () => window.console, prop: 'warn' },
                        { key: 'console.error', getClean: () => realm.console.error, descTarget: () => window.console, prop: 'error' },
                        { key: 'console.info', getClean: () => realm.console.info, descTarget: () => window.console, prop: 'info' },
                        { key: 'console.debug', getClean: () => realm.console.debug, descTarget: () => window.console, prop: 'debug' },

                        // Reflect methods
                        { key: 'Reflect.apply', getClean: () => realm.Reflect.apply, descTarget: () => Reflect, prop: 'apply' },
                        { key: 'Reflect.construct', getClean: () => realm.Reflect.construct, descTarget: () => Reflect, prop: 'construct' },
                        { key: 'Reflect.defineProperty', getClean: () => realm.Reflect.defineProperty, descTarget: () => Reflect, prop: 'defineProperty' },
                        { key: 'Reflect.deleteProperty', getClean: () => realm.Reflect.deleteProperty, descTarget: () => Reflect, prop: 'deleteProperty' },
                        { key: 'Reflect.get', getClean: () => realm.Reflect.get, descTarget: () => Reflect, prop: 'get' },
                        { key: 'Reflect.set', getClean: () => realm.Reflect.set, descTarget: () => Reflect, prop: 'set' },
                        { key: 'Reflect.ownKeys', getClean: () => realm.Reflect.ownKeys, descTarget: () => Reflect, prop: 'ownKeys' },
                        { key: 'Reflect.getOwnPropertyDescriptor', getClean: () => realm.Reflect.getOwnPropertyDescriptor, descTarget: () => Reflect, prop: 'getOwnPropertyDescriptor' },
                        { key: 'Reflect.getPrototypeOf', getClean: () => realm.Reflect.getPrototypeOf, descTarget: () => Reflect, prop: 'getPrototypeOf' },
                        { key: 'Reflect.setPrototypeOf', getClean: () => realm.Reflect.setPrototypeOf, descTarget: () => Reflect, prop: 'setPrototypeOf' },
                        { key: 'Reflect.has', getClean: () => realm.Reflect.has, descTarget: () => Reflect, prop: 'has' },

                        // Function.prototype methods
                        { key: 'Function.prototype.apply', getClean: () => realm.Function.prototype.apply, descTarget: () => Function.prototype, prop: 'apply' },
                        { key: 'Function.prototype.call', getClean: () => realm.Function.prototype.call, descTarget: () => Function.prototype, prop: 'call' },
                        { key: 'Function.prototype.bind', getClean: () => realm.Function.prototype.bind, descTarget: () => Function.prototype, prop: 'bind' },

                        // Object.prototype methods
                        { key: 'Object.freeze', getClean: () => realm.Object.freeze, descTarget: () => Object.prototype, prop: 'freeze' },
                        { key: 'Object.freeze.toString', getClean: () => realm.Object.freeze.toString, descTarget: () => Object.prototype, prop: 'toString' },
                        { key: 'Object.prototype.toString', getClean: () => realm.Object.prototype.toString, descTarget: () => Object.prototype, prop: 'toString' },
                        { key: 'Object.prototype.hasOwnProperty', getClean: () => realm.Object.prototype.hasOwnProperty, descTarget: () => Object.prototype, prop: 'hasOwnProperty' },

                        // add more items as desired...
                    ];

                    const snapshot = new Map();
                    const cleanValues = new Map();

                    for (const item of TO_CHECK) {
                        try {
                            const val = item.getClean();
                            cleanValues.set(item.key, val);
                            const s = (val && val.toString) ? val.toString() : String(val);
                            const desc = safeGetDesc(item.descTarget(), item.prop);
                            snapshot.set(item.key, { toString: s, descriptor: desc });
                        } catch (e) {
                            snapshot.set(item.key, { toString: null, descriptor: null });
                        }
                    }

                    function checkIntegrity({ verbose = false } = {}) {
                        const problems = [];

                        for (const item of TO_CHECK) {
                            const info = snapshot.get(item.key);
                            let base;
                            try { base = item.descTarget(); } catch (e) { base = undefined; }
                            const cur = base ? base[item.prop] : undefined;

                            if (typeof cur === 'undefined') {
                                problems.push({ name: item.key, reason: 'missing property' });
                                continue;
                            }

                            const curStr = (cur && cur.toString) ? cur.toString() : String(cur);
                            if (!looksNativeString(curStr) || (info.toString && curStr !== info.toString)) {
                                problems.push({ name: item.key, reason: 'toString mismatch or not native', recorded: info.toString, now: curStr });
                            }

                            const curDesc = base ? safeGetDesc(base, item.prop) : null;
                            if (info.descriptor && curDesc) {
                                if (info.descriptor.configurable !== curDesc.configurable ||
                                    info.descriptor.writable !== curDesc.writable ||
                                    info.descriptor.enumerable !== curDesc.enumerable) {
                                    problems.push({ name: item.key, reason: 'descriptor changed', recorded: info.descriptor, now: curDesc });
                                }
                            }
                        }

                        if (verbose) if (problems.length !== 0) for (;;) {}

                        return { ok: problems.length === 0, problems };
                    };

                    let autoTimer = null;
                    function startAutoCheck(intervalMs) {
                        if (autoTimer) clearInterval(autoTimer);
                        autoTimer = setInterval(() => {
                            const res = checkIntegrity({ verbose: true });
                            if (!res.ok) for (;;) {}
                        }, intervalMs);
                    }
                    function stopAutoCheck() { if (autoTimer) clearInterval(autoTimer); }

                    if (autoCheckInterval && typeof autoCheckInterval === 'number' && autoCheckInterval > 0) startAutoCheck(autoCheckInterval);

                    resolve({
                        safe: Object.fromEntries(cleanValues.entries()),
                        checkIntegrity,
                        startAutoCheck,
                        stopAutoCheck,
                        iframe
                    });
                } catch (err) {
                    reject(err);
                }
            }
        } catch (err) {
            reject(err);
        }
    });
}

(async () => {
    createSandboxAndProtect({ autoCheckInterval: 1000 }).then(module => module.checkIntegrity({ verbose: true }));
})();