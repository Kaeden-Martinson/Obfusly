const runtimeConfig = require('./Settings/config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const __obfuscator_1 = require('./Main/first_obfuscator');
const __obfuscator_2 = require('./Main/property_obfuscator');

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'Frontend')));

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
        ) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else target[key] = source[key];
    };
};

function restoreDefaults() {
    for (const key of Object.keys(runtimeConfig)) if (!(key in DEFAULT_CONFIG)) delete runtimeConfig[key];
    deepMerge(runtimeConfig, DEFAULT_CONFIG);
};

let queue = Promise.resolve();
app.post('/obfuscate', (req, res) => {
    queue = queue.then(() => handleObfuscation(req, res))
        .catch(err => {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal error' });
            }
        });
});

const DEFAULT_CONFIG = structuredClone(runtimeConfig);
async function handleObfuscation(req, res) {
    const { code, config: incomingConfig } = req.body;
    if (!code) {
        res.status(400).json({ error: 'No code provided' });
        return;
    }
    try {
        if (incomingConfig && typeof incomingConfig === 'object') deepMerge(runtimeConfig, incomingConfig);
        const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
        const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties( obfuscatedCode, windowName, previousDeclarationMapping);
        res.json({ obfuscatedCode: objectObfuscatedCode });
    } finally {
        restoreDefaults();
    }
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
