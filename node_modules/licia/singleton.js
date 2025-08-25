var has = require('./has');
exports = function(fn) {
    var hashFn =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : JSON.stringify;
    var singleton = function() {
        var cache = singleton.cache;
        var address = hashFn.apply(this, arguments);
        if (has(cache, address)) {
            return cache[address];
        }
        var promise = fn.apply(this, arguments).finally(function() {
            delete cache[address];
        });
        cache[address] = promise;
        return promise;
    };
    singleton.cache = {};
    return singleton;
};

module.exports = exports;
