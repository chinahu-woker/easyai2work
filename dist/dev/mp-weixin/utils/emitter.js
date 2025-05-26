"use strict";
const common_vendor = require("../common/vendor.js");
const emit = (event, payload) => {
  common_vendor.index.$emit(event, payload);
};
const on = (event, callback) => {
  common_vendor.index.$on(event, callback);
};
const off = (event, callback) => {
  common_vendor.index.$off(event, callback);
};
exports.emit = emit;
exports.off = off;
exports.on = on;
