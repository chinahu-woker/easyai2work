"use strict";
const common_vendor = require("../common/vendor.js");
const getBaseURL = () => "https://huiwanai.cn/api";
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
        common_vendor.index.__f__("log", "at composables/aiChat.ts:42", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const getdetail = (data, id) => {
  const restoken = data.refresh_token;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/draw/history/detail/${id}`,
      // 请求地址
      method: "GET",
      header: {
        "Authorization": "Bearer " + restoken
      },
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:176", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const delComment = (data, id) => {
  const restoken = data.refresh_token;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/comment/${id}`,
      // 请求地址
      method: "DELETE",
      header: {
        Authorization: "Bearer " + restoken
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:200", "请求失败", err);
      }
    });
  });
};
const Comment = (data, content) => {
  const restoken = data.refresh_token;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}/comment`,
      method: "POST",
      header: {
        "Authorization": "Bearer " + restoken
      },
      data: content,
      success: (res) => {
        resolve(res);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:227", "请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const registerByUsername = (data) => {
  common_vendor.index.__f__("log", "at composables/aiChat.ts:313", "注册用户的值：", data);
  return new Promise((resolve, reject) => {
    const requestTask = common_vendor.index.request({
      url: `${getBaseURL()}/users/registerByUsername`,
      method: "POST",
      data,
      success: (res) => {
        common_vendor.index.__f__("log", "at composables/aiChat.ts:322", "注册请求已经完成：", res.data);
        resolve(res.data);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        common_vendor.index.__f__("log", "at composables/aiChat.ts:328", "请求失败", err);
      }
      // 请求失败回调
    });
    common_vendor.index.__f__("log", "at composables/aiChat.ts:331", "注册：requestTask：", requestTask);
  });
};
exports.Comment = Comment;
exports.delComment = delComment;
exports.getUserToken = getUserToken;
exports.getdetail = getdetail;
exports.registerByUsername = registerByUsername;
//# sourceMappingURL=../../.sourcemap/mp-weixin/composables/aiChat.js.map
