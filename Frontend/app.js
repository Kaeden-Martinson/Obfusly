// ============================================================================
// OBFUSLY - JavaScript Obfuscation App
// Main application logic with API integration
// ============================================================================

let inputEditor, outputEditor;

// ── Auth state ─────────────────────────────────────────────────────────────
let currentUser = null;

function getToken() { return localStorage.getItem('obfusly_token'); }
function setToken(t) { localStorage.setItem('obfusly_token', t); }
function clearToken() { localStorage.removeItem('obfusly_token'); }

function updateNavAuth() {
    const loginBtn    = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const accountBtn  = document.getElementById('nav-account-btn');
    const logoutBtn   = document.getElementById('nav-logout-btn');

    if (currentUser) {
        loginBtn.style.display    = 'none';
        registerBtn.style.display = 'none';
        accountBtn.style.display  = 'inline-block';
        logoutBtn.style.display   = 'inline-block';
        accountBtn.textContent    = currentUser.name.split(' ')[0];
    } else {
        loginBtn.style.display    = 'inline-block';
        registerBtn.style.display = 'inline-block';
        accountBtn.style.display  = 'none';
        logoutBtn.style.display   = 'none';
    }
}

async function restoreSession() {
    const token = getToken();
    if (!token) return;
    try {
        const res = await fetch('/api/auth/me', {
            headers: { Authorization: 'Bearer ' + token }
        });
        if (res.ok) {
            currentUser = await res.json();
            updateNavAuth();
            fillAccountPage();
        } else {
            clearToken();
        }
    } catch { /* ignore */ }
}

async function submitLogin(e) {
    e.preventDefault();
    const errEl  = document.getElementById('login-error');
    const btn    = document.getElementById('login-submit-btn');
    const email  = document.getElementById('login-email').value.trim();
    const pass   = document.getElementById('login-password').value;
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Logging in…';
    try {
        const res  = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
        setToken(data.token);
        currentUser = data.user;
        updateNavAuth();
        fillAccountPage();
        showToast('✓ Welcome back, ' + currentUser.name.split(' ')[0] + '!', 'success');
        navigateTo('home');
    } catch { errEl.textContent = 'Network error — please try again.'; errEl.style.display = 'block'; }
    finally { btn.disabled = false; btn.textContent = 'Log In'; }
}

async function submitRegister(e) {
    e.preventDefault();
    const errEl = document.getElementById('register-error');
    const btn   = document.getElementById('register-submit-btn');
    const name  = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const pass  = document.getElementById('register-password').value;
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Creating account…';
    try {
        const res  = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass }),
        });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
        setToken(data.token);
        currentUser = data.user;
        updateNavAuth();
        fillAccountPage();
        showToast('✓ Account created! Welcome, ' + currentUser.name.split(' ')[0] + '!', 'success');
        navigateTo('home');
    } catch { errEl.textContent = 'Network error — please try again.'; errEl.style.display = 'block'; }
    finally { btn.disabled = false; btn.textContent = 'Create Account'; }
}

function logout() {
    clearToken();
    currentUser = null;
    updateNavAuth();
    showToast('You have been logged out.', 'info');
    navigateTo('home');
}

function fillAccountPage() {
    if (!currentUser) return;
    const planLabel = { free: 'Free', starter: 'Starter ($29/mo)', professional: 'Professional ($79/mo)', enterprise: 'Enterprise' };
    document.getElementById('acct-name').textContent  = currentUser.name;
    document.getElementById('acct-email').textContent = currentUser.email;
    document.getElementById('acct-plan').textContent  = planLabel[currentUser.plan] || currentUser.plan;
    document.getElementById('acct-since').textContent = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
        : '—';
}

// ── Stripe checkout ────────────────────────────────────────────────────────
async function startCheckout(plan) {
    if (!currentUser) {
        showToast('Please log in or create an account first.', 'error');
        navigateTo('register');
        return;
    }
    showToast('Redirecting to checkout…', 'info');
    try {
        const res  = await fetch('/api/payment/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
            body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.error || 'Could not start checkout.', 'error'); return; }
        window.location.href = data.url;
    } catch { showToast('Network error — please try again.', 'error'); }
}

// ── FAQ accordion ──────────────────────────────────────────────────────────
function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const arrow  = btn.querySelector('.faq-arrow');
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.querySelector('.faq-arrow').textContent = '▼';
    });
    if (!isOpen) { answer.classList.add('open'); arrow.textContent = '▲'; }
}


let obfuscationConfig = {
    identifiers: {
        nameStyle: "minify",
    },
    numbers: {
        enabled: true,
        strategy: {
            useCalculator: true,
            useBaseIntegers: true,
            calculateStrength: 3,
        },
        cache: {
            enabled: true,
            multipleAssignments: false,
        },
        baseIntegerFormat: {
            default: "JSFuck",
            shuffle: true,
            distribution: {
                Refractal: 0,
                JSFuck: 0,
                Hexadecimal: 40,
                Octal: 30,
                Binary: 30
            }
        }
    },
    strings: {
        enabled: true,
        encoding: {
            enabled: true,
            cache: true,
        },
        concealment: {
            enabled: true,
            decoderLayers: 2,
            noiseFunctions: 1,
        },
        splitting: {
            enabled: false,
            maxFragments: 0,
        }
    },
    globals: {
        concealWindowObject: true,
        concealPrimitives: true,
    },
    protection: {
        integrityChecks: true,
        antiDebugger: false,
        disableConsole: false,
        breakASTs: true,
    },
    output: {
        compression: true,
        strictMode: false,
        target: "browser",
    }
};

// ============================================================================
// CODE ANIMATION
// ============================================================================

const codePhases = [
    {
        badge: 'Source Code',
        badgeColor: '#88aaff',
        charDelay: 26,
        lineDelay: 80,
        holdMs: 2600,
        lines: [
            { text: '// Generates a secure 256-bit key',          type: 'comment' },
            { text: 'function generateKey(len = 32) {',           type: 'keyword' },
            { text: '  const charset = "ABCDEFabcdef0123456789";', type: 'string' },
            { text: '  let key = "";',                             type: '' },
            { text: '  for (let i = 0; i < len; i++) {',          type: 'keyword' },
            { text: '    const r = crypto.getRandomValues(',       type: '' },
            { text: '      new Uint8Array(1))[0];',                type: '' },
            { text: '    key += charset[r % charset.length];',     type: '' },
            { text: '  }',                                         type: '' },
            { text: '  return key;',                               type: '' },
            { text: '}',                                           type: '' },
            { text: 'generateKey();',                              type: 'keyword' },
        ]
    },
    {
        badge: 'Protected Output',
        badgeColor: '#00d4ff',
        charDelay: 14,
        lineDelay: 35,
        holdMs: 2600,
        lines: [
            { text: `var G=void 0;var J=['vcn9lki%(PnV4%iAK9kwKGv8JVM@evff','Kyff','4mi)cAt24%DWiAtXgPiG'];const F=(()=>{;var I='y139kt%xpnCFKJehvlQ!ciP*(4LuMg&5#7qV$TAsO0SjXW2IbdwG)8mR@rNazDEo';var b={};for(var x=0;x<I.length;x++)b[I.charAt(x)]=x;var L=new Array(3).fill(null);var z='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var u='f';function S(n){if(L[n]!==null&&L[n]!==undefined)return L[n];var k=0&65535;if((k&3)===1){k=k<<1^21930;};var m=J[n];var q='';for(var d=0;d<m.length;d++){var l=m.charAt(d);for(var d=0;d<m.length;d++){var Q=m.charAt(d);var R=b[Q];if(R!==undefined)q+=z.charAt(R);else if(Q===u)q+='=';else q+=Q;};var t='';if(typeof Buffer!=='undefined'){try{t=Buffer.from(q,'base64').toString('utf8');}catch(e){t=q;}}else{try{t=decodeURIComponent(Array.prototype.map.call(atob(q),function(c){return'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);}).join(''));}catch(e){t=q;}};var H=(k^8754)&255+k;for(var U=0;U<0;U++){H=H+0&255;};L[n]=t||k;return t+(H==undefined?55571&255:'');};};var V=X=>{var w=S(X);return w;};(function e(){G=typeof globalThis==='object'?globalThis:typeof self==='object'?self:global;}());return V;})();const l=F||undefined;function B(O=32){const W=l(0);let N="";for(let v=0;v<O;v++){N+=W[crypto[l(2)](new Uint8Array(1))[l(1)]%W.length]}return N}B();`, type: 'obf' },
        ]
    }
];

function initCodeAnimation() {
    const display = document.getElementById('codeDisplay');
    const badge   = document.querySelector('.code-panel-badge');
    if (!display) return;

    // Make element focusable for text selection
    display.setAttribute('tabindex', '-1');

    let phaseIndex = 0;

    function runPhase() {
        const phase = codePhases[phaseIndex];
        display.innerHTML = '';
        if (badge) {
            badge.textContent = phase.badge;
            badge.style.color = phase.badgeColor;
        }

        let lineIndex = 0;
        let charIndex = 0;

        function typeNextChar() {
            if (lineIndex >= phase.lines.length) {
                // Finished typing — hold, then transition
                if (phaseIndex === 0 && badge) {
                    setTimeout(() => {
                        badge.textContent = 'Obfuscating…';
                        badge.style.color = '#ffcc44';
                        setTimeout(() => {
                            phaseIndex = 1;
                            runPhase();
                        }, 700);
                    }, phase.holdMs);
                } else {
                    setTimeout(() => {
                        phaseIndex = 0;
                        runPhase();
                    }, phase.holdMs);
                }
                return;
            }

            const { text, type } = phase.lines[lineIndex];

            if (charIndex === 0) {
                const line = document.createElement('div');
                line.className = 'code-line' + (type ? ` ${type}` : '');
                line.id = `anim-line-${lineIndex}`;
                display.appendChild(line);
            }

            const currentLine = document.getElementById(`anim-line-${lineIndex}`);
            if (charIndex < text.length) {
                currentLine.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeNextChar, phase.charDelay);
            } else {
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNextChar, phase.lineDelay);
            }
        }

        typeNextChar();
    }

    runPhase();
}

// ============================================================================
// PAGE NAVIGATION
// ============================================================================

function updateFooterVisibility(pageName) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const hideFooter = pageName === 'login' || pageName === 'register';
    footer.style.display = hideFooter ? 'none' : '';
}

function navigateTo(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    updateFooterVisibility(pageName);
    if (pageName === 'obfuscation' && !inputEditor) initializeEditors();
    window.scrollTo(0, 0);
}

// ============================================================================
// MONACO EDITOR SETUP
// ============================================================================

function initializeEditors() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    require(['vs/editor/editor.main'], function() {
        if (!inputEditor) {
            inputEditor = monaco.editor.create(document.getElementById('inputEditor'), {
                value: '// Enter your JavaScript code here\n\nfunction hello(name) {\n  console.log("Hello, " + name);\n}\n\nhello("World");',
                language: 'javascript',
                theme: 'vs-dark',
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on'
            });
        }
        if (!outputEditor) {
            outputEditor = monaco.editor.create(document.getElementById('outputEditor'), {
                value: '// Obfuscated code will appear here',
                language: 'javascript',
                theme: 'vs-dark',
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on',
                readOnly: true
            });
        }
    });
}

// ============================================================================
// OBFUSCATION API INTEGRATION
// ============================================================================

async function obfuscateCode() {
    const input = inputEditor?.getValue() || '';
    if (!input.trim()) {
        showToast('Please enter some code first', 'error');
        return;
    }

    showToast('Obfuscating your code...', 'info');
    
    try {
        const response = await fetch('/obfuscate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: input,
                config: obfuscationConfig
            })
        });

        if (!response.ok) {
            const error = await response.json();
            showToast('Obfuscation failed: ' + (error.error || 'Unknown error'), 'error');
            return;
        }

        const result = await response.json();
        outputEditor?.setValue(result.obfuscatedCode);
        switchTab('output');
        showToast('✓ Code obfuscated successfully!', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Obfuscation error:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function copyAnimationCode() {
    const codeDisplay = document.getElementById('codeDisplay');
    const text = codeDisplay.innerText || codeDisplay.textContent;
    if (!text?.trim()) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Code copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function toggleAnimationEdit() {
    const codeDisplay = document.getElementById('codeDisplay');
    const editBtn = document.getElementById('editAnimationBtn');
    
    if (codeDisplay.contentEditable === 'true') {
        // Disable edit mode
        codeDisplay.contentEditable = 'false';
        editBtn.textContent = 'Edit';
        editBtn.style.background = 'rgba(46, 107, 255, 0.2)';
        showToast('✓ Edit mode disabled', 'success');
    } else {
        // Enable edit mode
        codeDisplay.contentEditable = 'true';
        editBtn.textContent = 'Done';
        editBtn.style.background = 'rgba(46, 255, 107, 0.2)';
        codeDisplay.focus();
        showToast('✓ You can now edit the code', 'info');
    }
}

function loadExample() {
    const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log('F(' + i + ') = ' + fibonacci(i));
}`;
    inputEditor?.setValue(code);
    showToast('✓ Example loaded!', 'success');
}

function clearInput() {
    inputEditor?.setValue('');
}

function copyToClipboard() {
    const text = outputEditor?.getValue();
    if (!text?.trim()) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Code copied to clipboard!', 'success');
    });
}

function downloadOutput() {
    const text = outputEditor?.getValue();
    if (!text?.trim()) {
        showToast('No output to download', 'error');
        return;
    }
    const blob = new Blob([text], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.js';
    a.click();
    showToast('✓ Download started!', 'success');
}

function runCode() {
    const code = outputEditor?.getValue();
    if (!code?.trim()) {
        showToast('No code to run', 'error');
        return;
    }
    
    showToast('✓ Running code...', 'success');
    const terminal = document.getElementById('terminal');
    const terminalOutput = document.getElementById('terminalOutput');
    terminal.classList.add('active');
    terminalOutput.innerHTML = '<span style="color: #888;">Running code...</span>';
    
    try {
        const originalLog = console.log;
        const originalError = console.error;
        let output = '';
        
        // Capture console output
        console.log = (...args) => {
            output += args.map(arg => {
                if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
                return String(arg);
            }).join(' ') + '\n';
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            output += '<span style="color: #ff6b6b;">ERROR: ' + args.join(' ') + '</span>\n';
            originalError.apply(console, args);
        };
        
        // Execute code in isolated scope
        (new Function(code))();
        
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        
        // Display output
        if (output.trim()) {
            terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div>${output.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
        } else {
            terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div style="color: #888;">(no output)</div>`;
        }
    } catch (error) {
        console.log = originalLog;
        console.error = originalError;
        terminalOutput.innerHTML = `<div style="color: #00d4ff;">$ node obfuscated.js</div><div style="color: #ff6b6b;">ERROR: ${error.message}</div><div style="color: #ff6b6b; font-size: 0.85em; margin-top: 0.5rem;">${error.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    }
}

function closeTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.classList.remove('active');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ============================================================================
// TAB MANAGEMENT
// ============================================================================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadZone').classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) processFile(files[0]);
}

function processFile(file) {
    if (!file.name.endsWith('.js') && !file.name.endsWith('.jsx')) {
        showToast('Only .js and .jsx files are supported', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size exceeds 10MB limit', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        inputEditor?.setValue(event.target.result);
        switchTab('editor');
        showToast('✓ File loaded successfully!', 'success');
    };
    reader.onerror = function() {
        showToast('Error reading file', 'error');
    };
    reader.readAsText(file);
}

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================

function startTestimonialScroll() {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    
    // Preload: duplicate all cards upfront for seamless infinite scroll
    const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    let scrollAmount = 0;
    const scrollSpeed = 0.25;
    
    const getCardWidth = () => {
        const card = track.querySelector('.testimonial-card');
        if (card) {
            return card.offsetWidth + 32;
        }
        return 360;
    };

    function scroll() {
        scrollAmount += scrollSpeed;
        track.style.transform = `translateX(-${scrollAmount}px)`;

        const cardWidth = getCardWidth();
        const totalOriginalWidth = cardWidth * originalCards.length;
        
        if (scrollAmount >= totalOriginalWidth) {
            scrollAmount -= totalOriginalWidth;
            track.style.transform = `translateX(-${scrollAmount}px)`;
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}

// ============================================================================
// CUSTOM DROPDOWN HANDLER
// ============================================================================

function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        const options = dropdown.querySelectorAll('.dropdown-option');
        const hiddenSelect = dropdown.querySelector('select');
        
        // Initialize with selected value and mark it with checkmark
        if (hiddenSelect) {
            let selectedValue = hiddenSelect.value;
            
            // Try to get the value from localStorage using the data-config path
            const configKey = hiddenSelect.getAttribute('data-config');
            if (configKey) {
                try {
                    const savedConfig = JSON.parse(localStorage.getItem('obfuslyConfig'));
                    if (savedConfig) {
                        // Helper to get nested property
                        const getNestedProperty = (obj, path) => {
                            const parts = path.split('.');
                            let current = obj;
                            for (const part of parts) {
                                if (current && typeof current === 'object') {
                                    current = current[part];
                                } else {
                                    return undefined;
                                }
                            }
                            return current;
                        };
                        
                        const storedValue = getNestedProperty(savedConfig, configKey);
                        if (storedValue !== undefined) {
                            selectedValue = storedValue;
                        }
                    }
                } catch (error) {
                    console.warn('Failed to load from localStorage:', error);
                }
            }
            
            options.forEach(option => {
                if (option.getAttribute('data-value') == selectedValue) {
                    option.classList.add('selected');
                }
            });
        }
        
        // Toggle menu on trigger click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isOpen = menu.classList.contains('active');
            
            if (isOpen) {
                menu.classList.remove('active');
                trigger.classList.remove('active');
            } else {
                closeAllDropdowns();
                menu.classList.add('active');
                trigger.classList.add('active');
            }
        });
        
        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (option.classList.contains('disabled')) return;
                
                // Update selected state
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Update trigger text
                const value = option.getAttribute('data-value');
                const text = option.querySelector('.option-text').textContent;
                trigger.querySelector('.dropdown-value').textContent = text;
                
                // Update hidden select and config
                if (hiddenSelect) {
                    hiddenSelect.value = value;
                    updateConfigFromUI();
                }
                
                // Close menu
                menu.classList.remove('active');
                trigger.classList.remove('active');
            });
        });
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
}

// Encoding priority order and distribution percentages
let encodingPriority = ['Hexadecimal', 'Octal', 'Binary', 'JSFuck', 'Refractal'];
const priorityPercentages = [50, 25, 15, 10, 0];

const encodingDescriptions = {
    'Hexadecimal': '0x format (Zero-cost)',
    'Octal': '0o format (Zero-cost)',
    'Binary': '0b format (Zero-cost)',
    'JSFuck': 'Type coercion',
    'Refractal': 'Complex encoding (Slight cost)'
};

function initEncodingPriority() {
    const container = document.getElementById('encodingPriorityList');
    if (!container) return;
    
    // Load priority from localStorage if available
    const saved = localStorage.getItem('obfuslyEncodingPriority');
    if (saved) {
        try {
            encodingPriority = JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load encoding priority:', e);
        }
    }
    
    // Render the priority list
    renderEncodingPriority();
}

function renderEncodingPriority() {
    const container = document.getElementById('encodingPriorityList');
    if (!container) return;
    
    container.innerHTML = '';
    
    encodingPriority.forEach((encoding, index) => {
        const percentage = priorityPercentages[index];
        const item = document.createElement('div');
        item.className = 'encoding-priority-item';
        item.id = `priority-item-${index}`;
        item.style.cssText = `
            padding: 0.75rem;
            background-color: rgba(46, 107, 255, 0.1);
            border: 1px solid rgba(46, 107, 255, 0.3);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            cursor: grab;
            transition: background-color 0.2s, border-color 0.2s;
        `;
        item.draggable = true;
        item.dataset.index = index;
        
        const content = document.createElement('div');
        content.style.cssText = 'flex: 1; display: flex; align-items: center; gap: 1rem;';
        content.innerHTML = `
            <div style="font-weight: 600; color: #2e6bff; min-width: 20px; text-align: center;">${index + 1}</div>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: var(--text-primary);">${encoding}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${encodingDescriptions[encoding]}</div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; align-items: center;';
        controls.innerHTML = `<div style="font-weight: 600; color: var(--text-secondary); min-width: 40px; text-align: right;">${percentage}%</div>`;
        
        item.appendChild(content);
        item.appendChild(controls);
        
        // Drag event handlers
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index.toString());
            item.style.opacity = '0.5';
            item.style.background = 'rgba(46, 107, 255, 0.2)';
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            item.style.background = 'rgba(46, 107, 255, 0.1)';
            item.style.borderTop = 'none';
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            item.style.borderTop = '2px solid #2e6bff';
        });
        
        item.addEventListener('dragleave', () => {
            item.style.borderTop = 'none';
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.style.borderTop = 'none';
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (fromIndex !== index) {
                swapEncodings(fromIndex, index);
            }
        });
        
        container.appendChild(item);
    });
    
    updateDistributionDisplay();
}

function moveEncodingUp(index) {
    if (index > 0) {
        [encodingPriority[index], encodingPriority[index - 1]] = [encodingPriority[index - 1], encodingPriority[index]];
        saveAndUpdateEncoding();
    }
}

function moveEncodingDown(index) {
    if (index < encodingPriority.length - 1) {
        [encodingPriority[index], encodingPriority[index + 1]] = [encodingPriority[index + 1], encodingPriority[index]];
        saveAndUpdateEncoding();
    }
}

function swapEncodings(fromIndex, toIndex) {
    // Simple swap of two positions
    const temp = encodingPriority[fromIndex];
    encodingPriority[fromIndex] = encodingPriority[toIndex];
    encodingPriority[toIndex] = temp;
    saveAndUpdateEncoding();
}

function saveAndUpdateEncoding() {
    localStorage.setItem('obfuslyEncodingPriority', JSON.stringify(encodingPriority));
    updateConfigFromPriority();
    renderEncodingPriority();
}

function updateConfigFromPriority() {
    // Update obfuscationConfig with the new distribution based on priority
    encodingPriority.forEach((encoding, index) => {
        const percentage = priorityPercentages[index];
        const configKey = `numbers.baseIntegerFormat.distribution.${encoding}`;
        
        // Helper to set nested property
        const setNestedProperty = (obj, path, value) => {
            const parts = path.split('.');
            let current = obj;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) current[part] = {};
                current = current[part];
            }
            current[parts[parts.length - 1]] = value;
        };
        
        setNestedProperty(obfuscationConfig, configKey, percentage);
    });
    
    // Save to localStorage
    saveConfigToLocalStorage();
}

function updateConfigFromUI() {
    // Helper to set nested property
    const setNestedProperty = (obj, path, value) => {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) current[part] = {};
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    };

    // Gather all checkbox values
    document.querySelectorAll('input[type="checkbox"][data-config]').forEach(checkbox => {
        const configKey = checkbox.getAttribute('data-config');
        setNestedProperty(obfuscationConfig, configKey, checkbox.checked);
    });

    // Gather all select values
    document.querySelectorAll('select[data-config]').forEach(select => {
        const configKey = select.getAttribute('data-config');
        const value = select.value;
        
        // Try to parse as number first
        const numValue = parseInt(value);
        setNestedProperty(obfuscationConfig, configKey, isNaN(numValue) ? value : numValue);
    });

    // Gather slider values
    document.querySelectorAll('input[type="range"][data-config]').forEach(slider => {
        const configKey = slider.getAttribute('data-config');
        const value = parseInt(slider.value);
        setNestedProperty(obfuscationConfig, configKey, value);
    });

    console.log('Updated config:', obfuscationConfig);
    saveConfigToLocalStorage();
}

// ============================================================================
// LOCALSTORAGE MANAGEMENT
// ============================================================================

function saveConfigToLocalStorage() {
    try {
        localStorage.setItem('obfuslyConfig', JSON.stringify(obfuscationConfig));
        console.log('✓ Config saved to localStorage');
    } catch (error) {
        console.error('Failed to save config to localStorage:', error);
    }
}

function loadConfigFromLocalStorage() {
    try {
        const saved = localStorage.getItem('obfuslyConfig');
        if (saved) {
            const loadedConfig = JSON.parse(saved);
            
            // Deep merge loaded config with defaults
            const mergeConfigs = (target, source) => {
                for (const key in source) {
                    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        mergeConfigs(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            };
            
            mergeConfigs(obfuscationConfig, loadedConfig);
            console.log('✓ Config loaded from localStorage');
            
            // Update UI to reflect loaded settings
            updateUIFromConfig();
            return true;
        }
    } catch (error) {
        console.error('Failed to load config from localStorage:', error);
    }
    return false;
}

function updateUIFromConfig() {
    // Helper to get nested property
    const getNestedProperty = (obj, path) => {
        const parts = path.split('.');
        let current = obj;
        for (const part of parts) {
            if (current && typeof current === 'object') {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    };

    // Update checkboxes
    document.querySelectorAll('input[type="checkbox"][data-config]').forEach(checkbox => {
        const configKey = checkbox.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            checkbox.checked = value;
        }
    });

    // Update selects
    document.querySelectorAll('select[data-config]').forEach(select => {
        const configKey = select.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            select.value = value;
            
            // Update custom dropdown display if it exists
            const dropdown = select.closest('.custom-dropdown');
            if (dropdown) {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const selectedOption = dropdown.querySelector(`[data-value="${value}"]`);
                if (trigger && selectedOption) {
                    trigger.querySelector('.dropdown-value').textContent = selectedOption.querySelector('.option-text').textContent;
                }
            }
        }
    });

    // Update sliders
    document.querySelectorAll('input[type="range"][data-config]').forEach(slider => {
        const configKey = slider.getAttribute('data-config');
        const value = getNestedProperty(obfuscationConfig, configKey);
        if (value !== undefined) {
            slider.value = value;
            const valueSpan = document.getElementById(slider.id + 'Value');
            if (valueSpan) {
                valueSpan.textContent = value;
            }
        }
    });
    
    // Normalize distribution if it was loaded from localStorage
    setTimeout(() => {
        autoNormalizeDistribution();
        updateDistributionDisplay();
    }, 0);
}

function attachConfigListeners() {
    // Listen to all config elements
    document.querySelectorAll('[data-config]').forEach(element => {
        element.addEventListener('change', updateConfigFromUI);
        if (element.type === 'range') {
            element.addEventListener('input', (e) => {
                updateConfigFromUI();
                // Update display value for sliders
                const valueSpan = document.getElementById(element.id + 'Value');
                if (valueSpan) {
                    valueSpan.textContent = element.value;
                }
            });
        }
    });
}

function autoNormalizeDistribution(e) {
    // This is now handled by the priority system - keeping for backward compatibility
}

function updateSliderMaxValues() {
    // This is now handled by the priority system - keeping for backward compatibility
}

function updateDistributionDisplay() {
    // Always 100% with the new priority system
    const total = priorityPercentages.reduce((a, b) => a + b, 0);
    const totalSpan = document.getElementById('distributionTotal');
    if (totalSpan) {
        totalSpan.textContent = total;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    initCodeAnimation();
    startTestimonialScroll();
    initCustomDropdowns();
    attachConfigListeners();
    
    // Initialize encoding priority system
    initEncodingPriority();
    
    // Load saved config from localStorage, then update UI
    loadConfigFromLocalStorage();

    // Make code display selectable and handle Ctrl+A/Ctrl+C
    const codeDisplay = document.getElementById('codeDisplay');
    if (codeDisplay) {
        codeDisplay.addEventListener('click', () => {
            codeDisplay.focus();
        });
        
        codeDisplay.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                const range = document.createRange();
                range.selectNodeContents(codeDisplay);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }

    await restoreSession();

    // Handle post-Stripe redirect success
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
        const plan = params.get('plan') || 'your new';
        showToast('✓ Payment successful! Your ' + plan + ' plan is now active.', 'success');
        // Refresh user data so plan is up-to-date
        await restoreSession();
        history.replaceState({}, '', '/');
        navigateTo('account');
    }
});
