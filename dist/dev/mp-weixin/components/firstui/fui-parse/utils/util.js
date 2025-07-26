"use strict";
const common_vendor = require("../../../../common/vendor.js");
let windowWidth = 0;
let windowHeight = 0;
common_vendor.index.getSystemInfo({
  success(res) {
    windowWidth = res.windowWidth;
    windowHeight = res.windowHeight;
  }
});
const getSystemInfo = () => {
  return [windowWidth, windowHeight];
};
const bindInstance = () => {
  let instance = {};
  return {
    /**
     * 提供键名，绑定对象值
     */
    set: (bindName, data = null) => {
      if (!instance[bindName]) {
        instance[bindName] = data;
      }
      return instance[bindName] || {};
    },
    get: (bindName) => {
      return instance[bindName] || {};
    },
    /**
     * 清除实例对象的所有缓存值
     */
    clear: () => {
      instance = {};
    },
    /**
     * 清楚实例对象特定的键
     */
    remove: (bindName) => {
      instance[bindName] && delete instance[bindName];
    }
  };
};
const util = {
  getSystemInfo,
  cacheInstance: bindInstance()
};
exports.util = util;
