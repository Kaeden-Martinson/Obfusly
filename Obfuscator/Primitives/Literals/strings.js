const config = require('../../Settings/config.json');
const { encodeStringContents } = require('./encode');
const { splitAndRebuildString } = require('./splitting');

let stringBuilderModule;

function encodeStringsRandom(str, isIIFE) {

    let out = '';
    let fullyStringOut = false;

    if (config.stringSplitting) out = splitAndRebuildString(str, isIIFE, stringBuilderModule);
    else if (config.stringConcealment && stringBuilderModule) {
        out = stringBuilderModule.addString(str, isIIFE);
    } else if (config.stringEncoding) {
        fullyStringOut = true;
        out = encodeStringContents(str);
    } else {
        out = JSON.stringify(str);
    };

    return { value: out, raw: `${fullyStringOut ? "'" : ""}${out}${fullyStringOut ? "'" : ""}` };
};

function setStringBuilder(module) { stringBuilderModule = module; };
function clearStringBuilder() { stringBuilderModule = undefined; };

module.exports = { encodeStringsRandom, setStringBuilder, clearStringBuilder };