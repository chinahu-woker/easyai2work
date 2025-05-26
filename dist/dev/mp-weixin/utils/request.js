"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useCommon = require("../composables/useCommon.js");
const request = (apiUrl, options = {}, retry = true) => {
  const fullUrl = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${getBaseURL()}${fullUrl}`,
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      ...options,
      success: async (res) => {
        if (res.statusCode === 401 && retry) {
          const { token } = await refreshToken(getRefreshToken());
          composables_useCommon.saveLoginInfo({ token });
          console.log("刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            request(apiUrl, options, false).then((res2) => {
              resolve(res2);
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject(res);
          }
        } else {
          if (res.data.data) {
            resolve(res.data.data);
          } else {
            resolve(res.data);
          }
        }
      },
      fail: async (err) => {
        console.log(233333333);
      },
      complete: async (err) => {
        console.log("请求完成", err);
      }
    });
  });
};
const refreshToken = async (refreshToken2, apiUrl = "/auth/refreshTokens", maxRetries = 3, retryInterval = 200, timeout = 5e3) => {
  const apiPath = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    console.log(`尝试第 ${attempt} 次刷新Token, refreshToken:`, refreshToken2);
    try {
      return await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${getBaseURL()}${apiPath}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: { refreshToken: refreshToken2 },
          timeout,
          success: (res) => {
            if (res.statusCode >= 400) {
              console.log("refreshToken", res);
              reject(res);
            } else {
              console.log("refreshToken", res);
              resolve(res.data);
            }
          },
          fail: (err) => {
            console.error("刷新Token失败", err);
            reject(err);
          }
        });
      });
    } catch (err) {
      if (err.name === "AbortError") {
        console.error(`第 ${attempt} 次刷新Token超时`);
      } else {
        console.error(`第 ${attempt} 次刷新Token失败`, err);
      }
    }
    if (attempt < maxRetries) {
      console.log(`等待 ${retryInterval} 毫秒后重试...`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  console.log("刷新Token失败，已达到最大重试次数");
  return null;
};
const uploadFile = (filePath, options = {}, apiUrl = "/file/upload") => {
  const fullUrl = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: `${getBaseURL()}${fullUrl}`,
      filePath,
      name: "file",
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      ...options,
      success: async (res) => {
        if (res.statusCode === 401) {
          const _refreshToken = getRefreshToken();
          if (!_refreshToken) {
            reject(res);
          }
          const { token } = await refreshToken(_refreshToken);
          composables_useCommon.saveLoginInfo({ token });
          console.log("刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            uploadFile(filePath, options).then((res2) => {
              resolve(res2);
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject(res);
          }
        } else {
          console.log("success", res);
          const data = JSON.parse(res.data);
          if (data.data) {
            resolve(data.data);
          } else {
            resolve(data);
          }
        }
      },
      fail: async (err) => {
        console.log("fail", err);
        if (err) {
          const _refreshToken = getRefreshToken();
          if (!_refreshToken) {
            reject(err);
          }
          const { token } = await refreshToken(_refreshToken);
          composables_useCommon.saveLoginInfo({ token });
          console.log("刷新后获取的token", token);
          if (token) {
            options.header = {
              Authorization: `Bearer ${token}`
            };
            uploadFile(filePath, options).then((res) => {
              resolve(res);
            }).catch((err2) => {
              reject(err2);
            });
          } else {
            reject(err);
          }
        } else {
          reject(err);
        }
      }
    });
  });
};
const getBaseURL = () => "https://scschool.cc/api";
const getBaseWsURL = () => "wss://scschool.cc/websocket";
const getToken = () => composables_useCommon.getLoginInfo().token;
const getRefreshToken = () => composables_useCommon.getLoginInfo().refresh_token;
exports.getBaseWsURL = getBaseWsURL;
exports.request = request;
exports.uploadFile = uploadFile;
