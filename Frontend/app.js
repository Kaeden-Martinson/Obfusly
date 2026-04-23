// ============================================================================
// OBFUSLY - JavaScript Obfuscation App
// Main application logic with API integration
// ============================================================================

let inputEditor, outputEditor;

// Configuration state from server
let obfuscationConfig = {
    nameGenerationStyle: "minify",
    numberEncoding: true,
    optimzedNumberCache: true,
    numberCalculator: true,
    globalBaseIntegerConcealment: true,
    multipleVariableAssignments: false,
    shuffleBaseIntegers: true,
    baseIntegersDefault: "JSFuck",
    integerPrecentage: {
        Refractal: 0,
        JSFuck: 0,
        Hexadecimal: 40,
        Octal: 30,
        Binary: 30
    },
    encodedFunctionStrength: 3,
    concealGlobalObjects: true,
    target: "browser",
    stringEncoding: true,
    stringSplitting: 0,
    optimizedStringCache: true,
    stringConcealment: true,
    stringConcealmentSettings: {
        decodersCount: 2,
        addNoiseCount: 1
    },
    concealPrimitives: true,
    compression: true,
    strictMode: false,
    integrityChecks: true,
    breakASTs: true,
    disableConsoleOutput: false,
    enableAntiDebugger: false,
};

// ============================================================================
// CODE ANIMATION
// ============================================================================

const codeLines = [
    'POST /api/certificate/validate HTTP/1.1',
    'Host: secure.example.com',
    'Content-Type: application/json',
    'Authorization: Bearer eyJ0eXAi...',
    '',
    '{',
    '  "certificate": "MIIDXTCCAkWgAwIB...",',
    '  "endpoint": "https://app.example.com",',
    '  "timestamp": "2026-04-21T10:30:00Z"',
    '}'
];

function initCodeAnimation() {
    const display = document.getElementById('codeDisplay');
    if (!display) return;
    display.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
        if (lineIndex < codeLines.length) {
            if (charIndex === 0) {
                const line = document.createElement('div');
                line.className = 'code-line';
                line.id = `line-${lineIndex}`;
                display.appendChild(line);
            }
            const currentLine = document.getElementById(`line-${lineIndex}`);
            const text = codeLines[lineIndex];
            if (charIndex < text.length) {
                currentLine.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeNextChar, 30);
            } else {
                lineIndex++;
                charIndex = 0;
                setTimeout(typeNextChar, 100);
            }
        } else {
            setTimeout(initCodeAnimation, 3000);
        }
    }
    typeNextChar();
}

// ============================================================================
// PAGE NAVIGATION
// ============================================================================

function navigateTo(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
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
    
    let scrollAmount = 0;
    const scrollSpeed = 0.25;
    
    const getCardWidth = () => {
        const card = track.querySelector('.testimonial-card');
        if (card) {
            return card.offsetWidth + 32;
        }
        return 360;
    };
    
    let cardWidth = getCardWidth();

    function scroll() {
        scrollAmount += scrollSpeed;
        track.style.transform = `translateX(-${scrollAmount}px)`;

        if (scrollAmount >= cardWidth) {
            const firstCard = track.querySelector('.testimonial-card');
            track.appendChild(firstCard);
            
            scrollAmount = 0;
            track.style.transform = 'translateX(0)';
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
            const selectedValue = hiddenSelect.value;
            options.forEach(option => {
                if (option.getAttribute('data-value') === selectedValue) {
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

// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

function updateConfigFromUI() {
    // Gather all checkbox values
    document.querySelectorAll('input[type="checkbox"][data-config]').forEach(checkbox => {
        const configKey = checkbox.getAttribute('data-config');
        obfuscationConfig[configKey] = checkbox.checked;
    });

    // Gather all select values
    document.querySelectorAll('select[data-config]').forEach(select => {
        const configKey = select.getAttribute('data-config');
        const value = select.value;
        
        // Handle nested config for stringConcealmentSettings
        if (configKey.includes('.')) {
            const [parent, child] = configKey.split('.');
            if (!obfuscationConfig[parent]) obfuscationConfig[parent] = {};
            
            // Try to parse as number first
            const numValue = parseInt(value);
            obfuscationConfig[parent][child] = isNaN(numValue) ? value : numValue;
        } else {
            // Try to parse as number first
            const numValue = parseInt(value);
            obfuscationConfig[configKey] = isNaN(numValue) ? value : numValue;
        }
    });

    // Gather slider values
    document.querySelectorAll('input[type="range"][data-config]').forEach(slider => {
        const configKey = slider.getAttribute('data-config');
        const value = parseInt(slider.value);
        
        if (configKey.includes('.')) {
            const [parent, child] = configKey.split('.');
            if (!obfuscationConfig[parent]) obfuscationConfig[parent] = {};
            obfuscationConfig[parent][child] = value;
        } else {
            obfuscationConfig[configKey] = value;
        }
    });

    console.log('Updated config:', obfuscationConfig);
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

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initCodeAnimation();
    startTestimonialScroll();
    initCustomDropdowns();
    attachConfigListeners();
    
    // Initial config read from UI
    updateConfigFromUI();
});
