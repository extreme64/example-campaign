/**
 * Utility module providing helper functions.
 */
const Utils = (() => {

   /**
    * Wraps a function to ensure it is only executed once.
    * 
    * @param {Function} fn - The function to be executed only once.
    * @returns {Function} A new function that will call the original function only once.
    */
     const once = fn => {
        let called = false;

        return function (...args) {
            if (called) return;
            called = true;

            return fn.bind(this)(...args);
        };
     };

    return {
        once
    }
})()

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}