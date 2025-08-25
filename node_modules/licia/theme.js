var Emitter = require('./Emitter');
var MediaQuery = require('./MediaQuery');
var m = new MediaQuery('(prefers-color-scheme: dark)');
exports = {
    get: function() {
        return m.isMatch() ? 'dark' : 'light';
    }
};
Emitter.mixin(exports);
m.on('match', function() {
    return exports.emit('change', 'dark');
});
m.on('unmatch', function() {
    return exports.emit('change', 'light');
});

module.exports = exports;
