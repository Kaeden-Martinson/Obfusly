const config = require("../../Settings/config.json")

const defaultedValues = ['false', 'true', 'undefined', 'null', 'Infinity', 'NaN'];

const windowVariables = ['parseInt', 'atob', 'btoa', 'alert', 'blur',
    'String', 'decodeURIComponent', 'encodeURIComponent',
    'arguments', 'window', 'global', 'Function', 'eval', 'Array',
    'document', 'Node', 'Document', 'WebSocket', 'fetch', 'Set',
    'Map', 'RegExp', 'Date', 'Image', 'Promise', 'Uint16Array',
    'Uint8Array', 'location', 'Math', 'navigator',
    'console', 'Object', 'setTimeout', 'setInterval', 'clearTimeout',
    'clearInterval', 'localStorage', 'JSON', 'Error',
    'sessions_alive', 'self', 'Intl', 'history', 'locationbar',
    'Atomics', 'CSS', 'Reflect', 'screen', 'parent', 'Number',
    'escape', 'unescape', 'Blob', 'WeakMap', 'Worker', 'WeakSet',
    'isNaN', 'isFinite', 'Int8Array', 'Int16Array', 'Int32Array',
    'clientInformation', 'confirm', 'close', 'find', 'focus', 'frames',
    'navigation', 'innerHeight', 'innerWidth', 'devicePixelRatio', 'caches',
    'print', 'prompt', 'origin', 'open', 'outerHeight', 'outerWidth', 'pageXOffset',
    'pageYOffset', 'performance', 'postMessage', 'screenLeft', 'screenTop', 'screenX',
    'screenY', 'scroll', 'stop', 'top', 'BigInt', 'Proxy', 'requestAnimationFrame', 'crypto',
    'decodeURI', 'fileUpload', 'elements', 'embed', 'defaultStatus', 'parseFloat', 'Symbol',
    'Float32Array', 'Float64Array', 'BigUint64Array', 'Uint32Array', 'BigInt64Array', '$',
    'XMLHttpRequest', 'URLSearchParams', 'WeakMap', 'WeakSet', 'URL',
    'TextEncoder', 'TextDecoder', 'sessionStorage', 'MutationObserver', 'inner'
];

const ignoreVariables = ['parent', 'window', 'arguments', 'module', 'define', 'exports', 'require'];

const newDeclarationVariables = ['Map', 'Set'];

windowVariables.push(...defaultedValues);

module.exports = { windowVariables, defaultedValues, ignoreVariables, newDeclarationVariables };