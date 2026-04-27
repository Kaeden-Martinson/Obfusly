const config = require('../../Settings/config');
const { encodeStringContents } = require('./encode');

let splitCount = 0;

function splitAndRebuildString(str, isIIFE, stringBuilderModule) {
    if (!str || str.length < 2) return "('" + encodeStringContents(str) + "')";;

    let splits = Math.min(config.strings.splitting.maxFragments, Math.max(1, Math.floor(Math.log2(str.length))));

    splitCount++;
    let cutPoints = new Set();
    while (cutPoints.size < splits) {
        cutPoints.add(Math.floor(Math.random() * (str.length - 1)) + 1);
    }

    cutPoints = Array.from(cutPoints).sort((a, b) => a - b);

    let result = [];
    let prev = 0;
    for (const cut of cutPoints) {
        if (config.strings.concealment.enabled && stringBuilderModule) result.push(stringBuilderModule.addString(str.slice(prev, cut), isIIFE));
        else if (config.strings.encoding.enabled) result.push(encodeStringContents(str.slice(prev, cut)));
        else result.push(str.slice(prev, cut));
        prev = cut;
    }

    if (!prev) return str

    if (config.strings.concealment.enabled && stringBuilderModule) { result.push(stringBuilderModule.addString(str.slice(prev), isIIFE)); }
    else if (config.strings.encoding.enabled) result.push(encodeStringContents(str.slice(prev)));
    else result.push(str.slice(prev));

    let quoteVarible = config.strings.concealment.enabled && stringBuilderModule ? "" : "'";

    return `(${quoteVarible}` + result.join(`${quoteVarible}+${quoteVarible}`) + `${quoteVarible})`;
}

function getSplitCount() { return splitCount; };
function resetSplitCount() { splitCount = 0; };

module.exports = { splitAndRebuildString, getSplitCount, resetSplitCount };