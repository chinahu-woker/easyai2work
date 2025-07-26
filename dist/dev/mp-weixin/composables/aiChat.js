"use strict";
const common_vendor = require("../common/vendor.js");
const getBaseURL = () => "http://8.156.65.78:3001";
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
        console.log("请求失败", err);
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
        console.log("请求失败", err);
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
        console.log("请求失败", err);
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
        console.log("请求失败", err);
      }
      // 请求失败回调
    });
  });
};
const registerByUsername = (data) => {
  console.log("注册用户的值：", data);
  return new Promise((resolve, reject) => {
    const requestTask = common_vendor.index.request({
      url: `${getBaseURL()}/users/registerByUsername`,
      method: "POST",
      data,
      success: (res) => {
        console.log("注册请求已经完成：", res.data);
        resolve(res.data);
      },
      // 请求成功回调
      fail: (err) => {
        reject(err);
        console.log("请求失败", err);
      }
      // 请求失败回调
    });
    console.log("注册：requestTask：", requestTask);
  });
};
exports.Comment = Comment;
exports.delComment = delComment;
exports.getUserToken = getUserToken;
exports.getdetail = getdetail;
exports.registerByUsername = registerByUsername;
