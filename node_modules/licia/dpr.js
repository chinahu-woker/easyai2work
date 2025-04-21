var Emitter = require('./Emitter');
var MediaQuery = require('./MediaQuery');
var m = new MediaQuery('(resolution: '.concat(get(), 'dppx)'));
exports = {
    get: get
};
Emitter.mixin(exports);
function get() {
    return window.devicePixelRatio || 1;
}
function change() {
    var dpr = get();
    m.setQuery('(resolution: '.concat(dpr, 'dppx)'));
    exports.emit('change', dpr);
}
m.on('unmatch', change);

module.exports = exports;
