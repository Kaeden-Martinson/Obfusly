const config = require('../../Settings/config.json');
const { encodeStringContents } = require('./encode');

function splitAndRebuildString(str, isIIFE, stringBuilderModule) {
    if (!str || str.length < 2) return "('" + encodeStringContents(str) + "')";;

    const splits = Math.floor(Math.random() * (str.length - 1)) + 1;

    let cutPoints = new Set();
    while (cutPoints.size < splits) {
        cutPoints.add(Math.floor(Math.random() * (str.length - 1)) + 1);
    }

    cutPoints = Array.from(cutPoints).sort((a, b) => a - b);

    let result = [];
    let prev = 0;
    for (const cut of cutPoints) {
        if (config.stringConcealment && stringBuilderModule) result.push(stringBuilderModule.addString(str.slice(prev, cut), isIIFE));
        else if (config.stringEncoding) result.push(encodeStringContents(str.slice(prev, cut)));
        else result.push(str.slice(prev, cut));
        prev = cut;
    }

    if (!prev) return str

    if (config.stringConcealment && stringBuilderModule) { result.push(stringBuilderModule.addString(str.slice(prev), isIIFE)); }
    else if (config.stringEncoding) result.push(encodeStringContents(str.slice(prev)));
    else result.push(str.slice(prev));

    let quoteVarible = config.stringConcealment && stringBuilderModule ? "" : "'";

    return `(${quoteVarible}` + result.join(`${quoteVarible}+${quoteVarible}`) + `${quoteVarible})`;
}

module.exports = { splitAndRebuildString };