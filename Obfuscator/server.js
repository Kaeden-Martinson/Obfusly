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

app.post('/obfuscate', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const [obfuscatedCode, windowName, previousDeclarationMapping] = __obfuscator_1.obfuscateEntireSource(code);
    const objectObfuscatedCode = await __obfuscator_2.obfuscateProperties(obfuscatedCode, windowName, previousDeclarationMapping);

    res.json({ obfuscatedCode: objectObfuscatedCode });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
