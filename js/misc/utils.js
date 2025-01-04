const Utils = (() => {

     // Fire a function only once
     const once = fn => {
        let called = false;
        return function (...args) {
            if (called) return;
            called = true;
            return fn.apply(this, args);
        };
    };

    return {
        once
    }
})()

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}