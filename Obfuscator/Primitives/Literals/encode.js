function encodeStringContents(str) {
    if (!str || !str.length) return str;
    
    let out = '';

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if (Math.random() < 0.5 && charCode <= 0xFF) {
            out += '__ENCODED_STRINGS__x' + charCode.toString(16).padStart(2, '0');
        } else {
            out += '__ENCODED_STRINGS__u' + charCode.toString(16).padStart(4, '0');
        }
    };

    return out;
}

module.exports = { encodeStringContents };