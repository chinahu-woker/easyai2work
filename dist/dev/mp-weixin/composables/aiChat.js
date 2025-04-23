"use strict";
const common_vendor = require("../common/vendor.js");
const getBaseURL = () => "https://scschool.cc/api";
const getOneAPiURL = () => "https://chatapi.scschool.cc";
const ChatAPiUrl = () => `${getOneAPiURL()}/v1/chat/completions`;
const getUserToken = () => {
  const refreshToken = common_vendor.index.getStorageSync("refreshToken");
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/auth/refreshTokens`,
      // 请求地址
      method: "POST",
      data: {
        "refreshToken": refreshToken
      },
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:30", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const getModelList = (data) => {
  const token = data;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/oneapi/channel`,
      // 请求地址
      method: "GET",
      header: {
        "Authorization": "Bearer " + token
        // 'Host': 'scschool.cc',
      },
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:65", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const getUserKey = (data, Rtoken_value) => {
  const usedata = {
    "user_id": data.id,
    "status": data.status,
    "remain_quota": data.quota,
    "unlimited_quota": false
  };
  const token = Rtoken_value;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/oneapi/token`,
      // 请求地址
      method: "POST",
      header: {
        "Authorization": "Bearer " + token
      },
      data: usedata,
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:103", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const getUserInfo = (data) => {
  const restoken = data.refresh_token;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/oneapi/user`,
      // 请求地址
      method: "POST",
      header: {
        "Authorization": "Bearer " + restoken
      },
      data,
      enableChunked: false,
      // 开启流传输
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:135", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
exports.ChatAPiUrl = ChatAPiUrl;
exports.getModelList = getModelList;
exports.getUserInfo = getUserInfo;
exports.getUserKey = getUserKey;
exports.getUserToken = getUserToken;
//# sourceMappingURL=../../.sourcemap/mp-weixin/composables/aiChat.js.map
