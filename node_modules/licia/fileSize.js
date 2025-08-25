var isStr = require('./isStr');
var toNum = require('./toNum');
exports = function(bytes) {
    if (isStr(bytes)) {
        var match = bytes.match(regStrSize);
        if (!match) return 0;
        return Math.round(toNum(match[1]) * factor[match[2] || 'B']);
    } else {
        if (bytes <= 0) return '0';
        var suffixIdx = Math.floor(Math.log(bytes) / Math.log(1024));
        var val = bytes / Math.pow(2, suffixIdx * 10);
        return +val.toFixed(2) + suffixList[suffixIdx];
    }
};
var factor = {
    B: 1,
    K: 1024
};
factor.M = factor.K * 1024;
factor.G = factor.M * 1024;
factor.T = factor.G * 1024;
var suffixList = ['', 'K', 'M', 'G', 'T'];
var regStrSize = /^(\d+(?:\.\d+)?) *(K|M|G|T)?$/;

module.exports = exports;
