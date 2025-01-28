/**
 * Utility module providing helper functions.
 * 
 * @namespace Utils
 */
const Utils = (() => {

    /**
     * Wraps a function to ensure it is only executed once.
     * 
     * @function once
     * @memberof Utils
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

    /**
     * Formats a string using a pattern and arguments.
     * 
     * @function patternf
     * @memberof Utils
     * @param {string} pattern - The pattern string containing placeholders like {__phs__}, {__phs__}, etc.
     * @param {...*} args - The values to replace the placeholders in the pattern string.
     * @returns {string} The formatted string with placeholders replaced by corresponding arguments.
     */
    const patternf = (pattern, ...args) => {
        return pattern.replace(
            new RegExp(config.__vphs__, 'g'), 
            (() => {
                let i = 0;
                return () => args[i++];
            }
            )()
        );
    };


    return {
        once,
        patternf
    }
})()

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}