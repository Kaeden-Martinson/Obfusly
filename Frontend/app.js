// ==================== Toast Notification System ====================
class Toast {
    constructor(message, type = 'info', duration = 4000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = null;
        this.show();
    }

    show() {
        const container = this.getContainer();
        this.element = document.createElement('div');
        this.element.className = `toast ${this.type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        this.element.innerHTML = `
            <div class="toast-icon">${icons[this.type]}</div>
            <div class="toast-message">${this.message}</div>
            <div class="toast-close" onclick="this.parentElement.remove()">×</div>
        `;

        container.appendChild(this.element);

        if (this.duration > 0) {
            setTimeout(() => this.remove(), this.duration);
        }
    }

    getContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    remove() {
        if (this.element) {
            this.element.classList.add('removing');
            setTimeout(() => {
                this.element.remove();
            }, 300);
        }
    }
}

function showToast(message, type = 'info', duration = 4000) {
    return new Toast(message, type, duration);
}

// ==================== Settings Management ====================
const SETTINGS_KEY = 'jsScrambleSettings';

function loadSettingsFromStorage() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

function saveSettingsToStorage() {
    const config = buildConfigFromUI();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    showToast('Settings saved successfully!', 'success');
}

function resetSettingsToDefault() {
    localStorage.removeItem(SETTINGS_KEY);
    loadSettingsToUI(getDefaultConfig());
    showToast('Settings reset to defaults', 'info');
}

function getDefaultConfig() {
    return {
        target: 'browser',
        nameGenerationStyle: 'minify',
        numberEncoding: true,
        optimzedNumberCache: true,
        numberCalculator: true,
        globalBaseIntegerConcealment: false,
        shuffleBaseIntegers: false,
        multipleVariableAssignments: false,
        baseIntegersDefault: 'JSFuck',
        encodedFunctionStrength: 5,
        stringEncoding: true,
        optimizedStringCache: true,
        stringConcealment: false,
        wrapStringsInIIFE: false,
        breakIIFEString: false,
        stringSplitting: 2,
        decodersCount: 1,
        addNoiseCount: 0,
        concealPrimitives: false,
        concealGlobalObjects: false,
        breakASTs: false,
        wrapInIIFE: true,
        integrityChecks: false,
        enableAntiDebugger: false,
        disableConsoleOutput: false,
        disableEval: false,
        disableLocalIIFEs: false,
        compression: false
    };
}

function buildConfigFromUI() {
    const config = getDefaultConfig();

    config.target = document.getElementById('target')?.value || 'browser';
    config.nameGenerationStyle = document.getElementById('nameGenerationStyle')?.value || 'minify';
    config.numberEncoding = document.getElementById('numberEncoding')?.checked || false;
    config.optimzedNumberCache = document.getElementById('optimzedNumberCache')?.checked || false;
    config.numberCalculator = document.getElementById('numberCalculator')?.checked || false;
    config.globalBaseIntegerConcealment = document.getElementById('globalBaseIntegerConcealment')?.checked || false;
    config.shuffleBaseIntegers = document.getElementById('shuffleBaseIntegers')?.checked || false;
    config.multipleVariableAssignments = document.getElementById('multipleVariableAssignments')?.checked || false;
    config.baseIntegersDefault = document.getElementById('baseIntegersDefault')?.value || 'JSFuck';
    config.encodedFunctionStrength = parseInt(document.getElementById('encodedFunctionStrength')?.value || 5);
    config.stringEncoding = document.getElementById('stringEncoding')?.checked || false;
    config.optimizedStringCache = document.getElementById('optimizedStringCache')?.checked || false;
    config.stringConcealment = document.getElementById('stringConcealment')?.checked || false;
    config.wrapStringsInIIFE = document.getElementById('wrapStringsInIIFE')?.checked || false;
    config.breakIIFEString = document.getElementById('breakIIFEString')?.checked || false;
    config.stringSplitting = parseInt(document.getElementById('stringSplitting')?.value || 2);
    config.decodersCount = parseInt(document.getElementById('decodersCount')?.value || 1);
    config.addNoiseCount = parseInt(document.getElementById('addNoiseCount')?.value || 0);
    config.concealPrimitives = document.getElementById('concealPrimitives')?.checked || false;
    config.concealGlobalObjects = document.getElementById('concealGlobalObjects')?.checked || false;
    config.breakASTs = document.getElementById('breakASTs')?.checked || false;
    config.wrapInIIFE = document.getElementById('wrapInIIFE')?.checked || false;
    config.integrityChecks = document.getElementById('integrityChecks')?.checked || false;
    config.enableAntiDebugger = document.getElementById('enableAntiDebugger')?.checked || false;
    config.disableConsoleOutput = document.getElementById('disableConsoleOutput')?.checked || false;
    config.disableEval = document.getElementById('disableEval')?.checked || false;
    config.disableLocalIIFEs = document.getElementById('disableLocalIIFEs')?.checked || false;
    config.compression = document.getElementById('compression')?.checked || false;

    return config;
}

function loadSettingsToUI(config) {
    if (!config) config = getDefaultConfig();

    const elements = {
        'target': config.target,
        'nameGenerationStyle': config.nameGenerationStyle,
        'baseIntegersDefault': config.baseIntegersDefault,
        'encodedFunctionStrength': config.encodedFunctionStrength,
        'stringSplitting': config.stringSplitting,
        'decodersCount': config.decodersCount,
        'addNoiseCount': config.addNoiseCount,
    };

    Object.entries(elements).forEach(([id, value]) => {
        const elem = document.getElementById(id);
        if (elem) elem.value = value;
    });

    const checkboxes = [
        'numberEncoding', 'optimzedNumberCache', 'numberCalculator',
        'globalBaseIntegerConcealment', 'shuffleBaseIntegers', 'multipleVariableAssignments',
        'stringEncoding', 'optimizedStringCache', 'stringConcealment',
        'wrapStringsInIIFE', 'breakIIFEString', 'concealPrimitives',
        'concealGlobalObjects', 'breakASTs', 'wrapInIIFE',
        'integrityChecks', 'enableAntiDebugger', 'disableConsoleOutput',
        'disableEval', 'disableLocalIIFEs', 'compression'
    ];

    checkboxes.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.checked = config[id] || false;
    });
}

// ==================== History Management ====================
let inputEditor, outputEditor;
const MAX_HISTORY = 10;
const ENTRY_PREFIX = 'jsScrambleEntry_';

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function saveEntry(index, entry) {
    localStorage.setItem(ENTRY_PREFIX + index, JSON.stringify(entry));
}

function loadEntry(index) {
    const saved = localStorage.getItem(ENTRY_PREFIX + index);
    return saved ? JSON.parse(saved) : null;
}

function getAllEntries() {
    const entries = [];
    for (let i = 0; i < MAX_HISTORY; i++) {
        const entry = loadEntry(i);
        if (entry) entries.unshift(entry);
    }
    return entries;
}

function saveToHistory(inputCode, outputCode) {
    for (let i = MAX_HISTORY - 1; i > 0; i--) {
        const prev = loadEntry(i - 1);
        if (prev) saveEntry(i, prev);
    }

    const newEntry = {
        input: inputCode,
        output: outputCode,
        timestamp: new Date().toLocaleString(),
        inputSize: formatBytes(new Blob([inputCode]).size),
        outputSize: formatBytes(new Blob([outputCode]).size)
    };

    saveEntry(0, newEntry);
    loadHistoryIntoSelect();
    updateStorageBar();
}

function clearHistory() {
    for (let i = 0; i < MAX_HISTORY; i++) {
        localStorage.removeItem(ENTRY_PREFIX + i);
    }
    loadHistoryIntoSelect();
    updateStorageBar();
    showToast('History cleared', 'info');
}

function loadHistoryIntoSelect() {
    const select = document.getElementById('historySelect');
    if (!select) return;

    const entries = getAllEntries();
    select.innerHTML = '<option value="">-- Load from history --</option>';

    entries.forEach((entry, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${entry.timestamp} (${entry.inputSize} → ${entry.outputSize})`;
        select.appendChild(option);
    });
}

function updateStorageBar() {
    const bar = document.querySelector('.storage-bar-fill');
    if (!bar) return;

    let totalSize = 0;
    for (let i = 0; i < MAX_HISTORY; i++) {
        const entry = loadEntry(i);
        if (entry) {
            totalSize += JSON.stringify(entry).length;
        }
    }

    const maxSize = 5242880; // 5MB
    const percentage = (totalSize / maxSize) * 100;
    
    bar.style.width = Math.min(percentage, 100) + '%';
    bar.classList.remove('warn', 'danger');

    if (percentage > 80) {
        bar.classList.add('danger');
    } else if (percentage > 60) {
        bar.classList.add('warn');
    }

    const sizeText = document.querySelector('.storage-bar-container');
    if (sizeText) {
        const textNode = sizeText.firstChild;
        if (textNode) {
            textNode.textContent = `Storage: ${formatBytes(totalSize)}`;
        }
    }
}

// ==================== Page Navigation ====================
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (pageName === 'obfuscate') {
        initializeMonacoEditor();
    }

    if (pageName === 'faq') {
        initializeFAQAccordion();
    }
}

// ==================== FAQ Accordion ====================
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('#faq .faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.onclick = (e) => {
                e.preventDefault();
                item.classList.toggle('active');
            };
        }
    });
}

// ==================== Editor Functions ====================
function updateInputSize() {
    let code = '';
    if (window.inputEditor && window.inputEditor.getValue) {
        code = window.inputEditor.getValue();
    } else {
        const editor = document.getElementById('inputEditor');
        code = editor ? editor.textContent : '';
    }
    const size = formatBytes(new Blob([code || '']).size);
    const sizeDisplay = document.querySelector('.editor-wrapper:first-child .editor-header-center');
    if (sizeDisplay) sizeDisplay.textContent = `Size: ${size}`;
}

function updateOutputSize() {
    let code = '';
    if (window.outputEditor && window.outputEditor.getValue) {
        code = window.outputEditor.getValue();
    } else {
        const editor = document.getElementById('outputEditor');
        code = editor ? editor.textContent : '';
    }
    const size = formatBytes(new Blob([code || '']).size);
    const sizeDisplay = document.querySelector('.editor-wrapper:last-child .editor-header-center');
    if (sizeDisplay) sizeDisplay.textContent = `Size: ${size}`;
}

function copyInput() {
    let code = '';
    if (window.inputEditor && window.inputEditor.getValue) {
        code = window.inputEditor.getValue();
    } else {
        const editor = document.getElementById('inputEditor');
        code = editor ? editor.textContent : '';
    }
    
    if (code) {
        navigator.clipboard.writeText(code).then(() => {
            showToast('Input copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy input', 'error');
        });
    }
}

function copyOutput() {
    let code = '';
    if (window.outputEditor && window.outputEditor.getValue) {
        code = window.outputEditor.getValue();
    } else {
        const editor = document.getElementById('outputEditor');
        code = editor ? editor.textContent : '';
    }
    
    if (code) {
        navigator.clipboard.writeText(code).then(() => {
            showToast('Output copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy output', 'error');
        });
    }
}

// ==================== Run Code with Modal ====================
function runCode(editorType) {
    let code = '';
    if (editorType === 'input') {
        code = (window.inputEditor && window.inputEditor.getValue) 
            ? window.inputEditor.getValue() 
            : document.getElementById('inputEditor').textContent;
    } else {
        code = (window.outputEditor && window.outputEditor.getValue) 
            ? window.outputEditor.getValue() 
            : document.getElementById('outputEditor').textContent;
    }

    if (!code.trim()) {
        showToast('No code to run', 'warning');
        return;
    }

    showRunModal(code);
}

function showRunModal(code) {
    const backdrop = document.getElementById('runModalBackdrop');
    const modal = document.getElementById('runModal');
    const content = document.getElementById('runModalContent');

    // Show loading message
    content.innerHTML = '<span class="run-modal-loading">► Running code...</span>';
    
    backdrop.classList.add('active');
    modal.classList.add('active');

    // Simulate code execution (you can replace this with actual execution)
    executeCode(code).then(result => {
        displayRunResult(result);
    });
}

function closeRunModal() {
    const backdrop = document.getElementById('runModalBackdrop');
    const modal = document.getElementById('runModal');

    backdrop.classList.remove('active');
    modal.classList.remove('active');
}

function displayRunResult(result) {
    const content = document.getElementById('runModalContent');
    const { success, output, error } = result;

    if (success) {
        content.innerHTML = `<span class="run-modal-output-success">Output:\n\n${escapeHtml(output)}</span>`;
    } else {
        content.innerHTML = `<span class="run-modal-output-error">Error:\n\n${escapeHtml(error)}</span>`;
    }
}

async function executeCode(code) {
    try {
        // Attempt to run code in Node.js via server endpoint
        const response = await fetch('/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Server returned ' + response.status);
        }
    } catch (error) {
        // Fallback: try to execute in browser console sandbox
        return executeBrowserCode(code);
    }
}

function executeBrowserCode(code) {
    const output = [];
    const errors = [];
    
    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
        output.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    console.error = (...args) => {
        errors.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    console.warn = (...args) => {
        output.push('[WARNING] ' + args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
    };

    try {
        // Execute code in a function context to avoid global scope pollution
        const result = (new Function(code))();
        
        // If function returns something, log it
        if (result !== undefined) {
            output.push('Return value: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
        }

        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: errors.length === 0,
            output: output.length > 0 ? output.join('\n') : '(no output)',
            error: errors.length > 0 ? errors.join('\n') : ''
        };
    } catch (err) {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: false,
            output: output.join('\n'),
            error: err.message || String(err)
        };
    }
}

// ==================== Obfuscation ====================
async function obfuscateJS() {
    const inputEditor = document.getElementById('inputEditor');
    const outputEditor = document.getElementById('outputEditor');
    const obfuscateBtn = document.getElementById('obfuscateBtn');

    if (!inputEditor || !inputEditor.textContent.trim()) {
        showToast('Please enter JavaScript code to obfuscate', 'warning');
        return;
    }

    obfuscateBtn.disabled = true;

    try {
        // Get code from Monaco Editor if available
        const inputCode = (window.inputEditor && window.inputEditor.getValue) 
            ? window.inputEditor.getValue() 
            : inputEditor.textContent;
        const config = buildConfigFromUI();
        
        // Placeholder obfuscation
        const obfuscatedCode = await performObfuscation(inputCode, config);
        
        // Set output in Monaco Editor if available
        if (window.outputEditor && window.outputEditor.setValue) {
            window.outputEditor.setValue(obfuscatedCode);
        } else {
            outputEditor.textContent = obfuscatedCode;
        }
        
        saveToHistory(inputCode, obfuscatedCode);
        updateOutputSize();

        showToast('Code obfuscated successfully!', 'success');
    } catch (error) {
        console.error('Obfuscation error:', error);
        showToast('Obfuscation failed: ' + error.message, 'error');
    } finally {
        obfuscateBtn.disabled = false;
    }
}

async function performObfuscation(code, config) {
    const response = await fetch('/obfuscate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, config })
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const result = await response.json();

   return result.obfuscatedCode || '// No output';
}

// ==================== Syntax Highlighting ====================
function applySyntaxHighlighting() {
    // Only highlight landing page code examples, not Monaco Editor containers
    const unprotectedBlock = document.querySelector('#intro .unprotected-code');
    const obfuscatedBlock = document.querySelector('#intro .obfuscated-code');
    
    if (unprotectedBlock) {
        const code = unprotectedBlock.textContent;
        const highlighted = highlightJavaScript(code);
        unprotectedBlock.innerHTML = highlighted;
    }
    
    if (obfuscatedBlock) {
        const code = obfuscatedBlock.textContent;
        const highlighted = highlightJavaScript(code);
        obfuscatedBlock.innerHTML = highlighted;
    }
}

function highlightJavaScript(code) {
    const keywords = /\b(function|var|let|const|if|else|for|while|return|new|this|class|extends|static|async|await|try|catch|finally|throw|import|export|default|from|as)\b/g;
    const strings = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+|0x[0-9a-fA-F]+)\b/g;
    const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;
    const punctuation = /([{}()\[\],.;:])/g;

    let result = code;
    const commentMap = new Map();
    const stringMap = new Map();

    // Process comments first
    result = result.replace(comments, (match) => {
        const key = `__COMMENT_${commentMap.size}__`;
        commentMap.set(key, `<span class="token comment">${escapeHtml(match)}</span>`);
        return key;
    });

    // Process strings
    result = result.replace(strings, (match) => {
        const key = `__STRING_${stringMap.size}__`;
        stringMap.set(key, `<span class="token string">${escapeHtml(match)}</span>`);
        return key;
    });

    // Process keywords
    result = result.replace(keywords, '<span class="token keyword">$1</span>');
    result = result.replace(functions, '<span class="token function">$1</span>');
    result = result.replace(numbers, '<span class="token number">$1</span>');
    result = result.replace(punctuation, '<span class="token punctuation">$1</span>');

    // Restore strings and comments
    stringMap.forEach((html, key) => {
        result = result.replace(new RegExp(escapeRegex(key), 'g'), html);
    });

    commentMap.forEach((html, key) => {
        result = result.replace(new RegExp(escapeRegex(key), 'g'), html);
    });

    return result;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    const savedConfig = loadSettingsFromStorage();
    loadSettingsToUI(savedConfig);

    // Initialize tooltips
    initializeTooltips();

    // Apply syntax highlighting
    applySyntaxHighlighting();

    // Load history
    loadHistoryIntoSelect();
    updateStorageBar();

    // Setup event listeners
    const historySelect = document.getElementById('historySelect');
    if (historySelect) {
        historySelect.addEventListener('change', function () {
            if (this.value) {
                const entries = getAllEntries();
                const entry = entries[parseInt(this.value)];
                if (entry) {
                    if (window.inputEditor && window.inputEditor.setValue) {
                        window.inputEditor.setValue(entry.input);
                    } else {
                        const inputEditor = document.getElementById('inputEditor');
                        if (inputEditor) inputEditor.textContent = entry.input;
                    }
                    
                    if (window.outputEditor && window.outputEditor.setValue) {
                        window.outputEditor.setValue(entry.output);
                    } else {
                        const outputEditor = document.getElementById('outputEditor');
                        if (outputEditor) outputEditor.textContent = entry.output;
                    }
                    
                    updateInputSize();
                    updateOutputSize();
                }
            }
            this.value = '';
        });
    }

    // Setup modal close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeRunModal();
        }
    });
});

function initializeTooltips() {
    // Tooltips are handled by CSS, no JS needed
}

// ==================== Monaco Editor Setup ====================
function initializeMonacoEditor() {
    require.config({ 
        paths: { 
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
        } 
    });

    require(['vs/editor/editor.main'], function () {
        // Initialize input editor
        if (document.getElementById('inputEditor')) {
            window.inputEditor = monaco.editor.create(
                document.getElementById('inputEditor'),
                {
                    value: '',
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    padding: { top: 10 },
                    wordWrap: 'on'
                }
            );

            window.inputEditor.onDidChangeModelContent(() => updateInputSize());
        }

        // Initialize output editor
        if (document.getElementById('outputEditor')) {
            window.outputEditor = monaco.editor.create(
                document.getElementById('outputEditor'),
                {
                    value: '',
                    language: 'javascript',
                    theme: 'vs-dark',
                    readOnly: true,
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    padding: { top: 10 },
                    wordWrap: 'on'
                }
            );
        }
    });
}