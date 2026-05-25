// Native DOMException polyfill mock to resolve npm deprecation warning
const nativeDOMException = typeof globalThis !== 'undefined' && globalThis.DOMException 
  ? globalThis.DOMException 
  : typeof DOMException !== 'undefined' 
    ? DOMException 
    : Error;

module.exports = nativeDOMException;
