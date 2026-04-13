function encodeStringContents(str) {
    if (!str || !str.length) return str;
    
    const parts = [];

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if (Math.random() < 0.5 && charCode <= 0xFF) {
            parts.push('__ENCODED_STRINGS__x' + charCode.toString(16).padStart(2, '0'));
        } else {
            parts.push('__ENCODED_STRINGS__u' + charCode.toString(16).padStart(4, '0'));
        }
    };

    return parts.join('');
}

module.exports = { encodeStringContents };