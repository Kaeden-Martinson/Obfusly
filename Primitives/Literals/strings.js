const config = require('../../Settings/config');
const { encodeStringContents } = require('./encode');
const { splitAndRebuildString } = require('./splitting');

let stringBuilderModule;

function encodeStringsRandom(str, isIIFE) {

    if (str === "") return { value: "", raw: '""' };

    let out = '';
    let fullyStringOut = false;

    if (config.strings.splitting.maxFragments > 0) out = splitAndRebuildString(str, isIIFE, stringBuilderModule);
    else if (config.strings.concealment.enabled && stringBuilderModule) {
        out = stringBuilderModule.addString(str, isIIFE);
    } else if (config.strings.encoding.enabled) {
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